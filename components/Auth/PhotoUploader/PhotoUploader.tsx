import { API } from "aws-amplify";
import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import { v4 as uuidv4 } from "uuid";
import { UPLOAD_ORIGINAL } from "../../../pages/auth/photo-uploader";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";

// import heic2any from "heic2any";

const ACCEPT_TYPES = "image/jpeg,image/heic,image/png,image/gif";

export const resizeFile = (file: File, size: number, compression: number) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      size,
      size,
      "JPEG",
      compression,
      0,
      (uri) => {
        resolve(uri);
      },
      "file",
      size,
      size
    );
  });
};

async function convertToHEIC(fileInput: File) {
  return new Promise((resolve, reject) => {
    const heic2any = require("heic2any");

    console.log("🧩 HEIC START");
    heic2any({
      blob: fileInput,
      toType: "image/jpeg",
      quality: 0.7,
    }).then(
      (blob: any) => {
        //use the converted blob to do whatever
        //maybe let newFile = new File(blob, fileName.jpg, { type: 'image/jpeg' }) or something
        let newName = `${fileInput.name.split(".")[0]}.jpg`;
        let heicFile = new File([blob], `${fileInput.name.split(".")[0]}.jpg`, {
          type: "image/jpeg",
        });
        console.log("RESOLVE: ", newName, heicFile);
        resolve(heicFile);
      },
      (error: any) => {
        //handle errors
        console.log("REJECT: ", error);
        reject(error);
      }
    );
  });
}

interface IPhotoUpload {
  file: File;
  thumb?: File;
  info: {
    progress: number;
    status: string;
    uuid: string;
    bytes: any;
  };
}
type iPhotos = IPhotoUpload[];

export function humanFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }
  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;
  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );
  return bytes.toFixed(dp) + " " + units[u];
}

function getTopLeftPixelColor(file: File) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx: any = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var pixelData = ctx.getImageData(0, 0, 1, 1).data;
      resolve(
        "rgb(" + pixelData[0] + ", " + pixelData[1] + ", " + pixelData[2] + ")"
      );
    };
    img.onerror = function () {
      reject(Error("Failed to load image"));
    };
  });
}

const imgDimensions = (file: File) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = function () {
      reject(Error("Failed to load image"));
    };
  });
};

export default function PhotoUploader() {
  const [photos, setPhotos] = useState<iPhotos | []>([]);
  const [uploadTrigger, setUploadTrigger] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalSizeOriginals, setTotalSizeOriginals] = useState(0);
  const [totalSizeThumbs, setTotalSizeThumbs] = useState(0);
  const [uploadOriginal, setUploadOriginal] = useState(UPLOAD_ORIGINAL);

  const s3Uploader = async (item: IPhotoUpload) => {
    const originalFile: File = item.file;
    const index = photos.findIndex(
      (photo) => photo.info.uuid === item.info.uuid
    );

    let convertedFile: any = false;

    // If file is HEIC then use this converter to convert to JPG
    if (originalFile.type === "image/heic") {
      convertedFile = await convertToHEIC(originalFile);
    }

    const fileUsed = convertedFile || originalFile;

    // Get width and height of fileUsed
    const { width, height }: any = await imgDimensions(fileUsed);
    const smallestSide = width > height ? height : width;

    // Resize to 400px, 128px and 32px - but only if our input image is larger than that
    const size400 = smallestSide > 400 ? 400 : smallestSide;
    const size128 = smallestSide > 128 ? 128 : smallestSide;
    const size32 = smallestSide > 32 ? 32 : smallestSide;

    // Run through the resizers
    const resized400: any = await resizeFile(fileUsed, size400, 80);
    const resized128: any = await resizeFile(resized400, size128, 60);
    const resized32: any = await resizeFile(resized128, size32, 40);

    // Note  - our 1x1 image is only used to extract the avg color of the image - it's not uploaded
    // Note2 - This fails on images with large aspect ratios that are not square - to find a fix soon!
    const resized1: any = await resizeFile(resized32, 1, 100);
    const color1x1 = await getTopLeftPixelColor(resized1);

    const sizes = ["32x32", "128x128", "400-max-w-h"];
    if (uploadOriginal) {
      sizes.push("original");
    }
    const { preSignedPutUrls, id } = await API.post("API", "/insert-photo", {
      body: {
        originalName: originalFile.name,
        sizes,
        creationDate: "TBD",
        color1x1,
      },
    });
    const PhotoID = id;

    const thumbUploader = async (
      urls: any,
      size: string,
      inputFile: File,
      setProgress: boolean = false
    ) => {
      const preSigned = urls.find((item: any) => item.size === size);
      const result = await axios.put(preSigned.url, inputFile, {
        headers: { "Content-Type": inputFile?.type },
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (setProgress) {
            setPhotos((photos: iPhotos) => {
              const newPhotos = [...photos];
              newPhotos[index].info.progress = percentCompleted;
              newPhotos[index].info.bytes[size] = inputFile.size;
              newPhotos[index].info.status =
                percentCompleted >= 100 ? "complete" : "uploading";
              newPhotos[index].thumb = resized32;

              return newPhotos;
            });
          }
        },
      });
      setTotalSizeThumbs((prev) => prev + inputFile.size);
      console.log(`${size} Uploaded, Size: `, humanFileSize(inputFile.size));
      return result;
    };

    //Upload dummy 32x32, 128x128 & preview-400 images...
    await thumbUploader(preSignedPutUrls, "32x32", resized32);
    await thumbUploader(preSignedPutUrls, "128x128", resized128);
    await thumbUploader(
      preSignedPutUrls,
      "400-max-w-h",
      resized400,
      uploadOriginal ? false : true
    );
    if (uploadOriginal) {
      await thumbUploader(preSignedPutUrls, "original", originalFile, true);
    }

    // Mark our items uploadStatus and COMPLETE
    const completed = await API.get("API", `/complete-photo/${PhotoID}`, {});
    return fileUsed.name;
  };

  const __recursion = async (files: iPhotos) => {
    const stillPending = files.filter((f) => f.info.status === "pending");
    const item = stillPending[0];
    if (item) {
      setTotalSizeOriginals((prev) => prev + item.file.size);
      setTotalCount((prev) => prev + 1);
      await s3Uploader(item);
      __recursion(files);
    } else {
      setUploadTrigger(false);
    }
  };

  const handleFilesPicked = async (e: any) => {
    setTotalCount(0);
    setTotalSizeOriginals(0);
    setTotalSizeThumbs(0);
    const files = e.target.files;
    const filesToUpload = [...files];
    const photosProcessed: iPhotos = filesToUpload.map((file: File) => {
      return {
        file,
        info: {
          progress: 0,
          status: "pending",
          uuid: uuidv4(),
          bytes: {
            "32x32": 0,
            "128x128": 0,
            "400-max-w-h": 0,
          },
        },
      };
    });
    setPhotos(photosProcessed);
    setUploadTrigger(true);
  };

  // Prepare uploader recursion functionality
  useEffect(() => {
    if (uploadTrigger === true) {
      __recursion(photos);
    }
  }, [uploadTrigger]);

  const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-200">
      <div
        className="bg-emerald-300 h-1.5 rounded-full"
        style={{ width: `${progress}%` }}></div>
    </div>
  );

  return (
    <>
      <div className="px-4 py-6">
        <h1 className="text-3xl font-bold mb-3">Photo Uploader</h1>
        <p className="text-gray-500 mb-2">
          This is the main Photo Uploading tool - currently it currently only
          allows <b>JPG, PNG, GIF and HEIC</b> to be selected, and it resizes
          any uploaded image to 400px (max width or height), 128x128 pixels and
          32x32 pixels. It also extracts the average color of the image and
          stores it in the database (Because why not...)
        </p>
        <p className="text-gray-500 mb-2">
          The uploader is recursive, so it will upload one image at a time, and
          will only move on to the next image once the previous one has been
          uploaded.
        </p>

        <hr className="my-6" />

        <div className="my-3 flex justify-between">
          <label
            htmlFor="file-picker"
            className="relative bg-green-600 hover:bg-green-700 text-white flex items-center justify-center rounded-lg px-4 py-2">
            <input
              type="file"
              id="file-picker"
              multiple
              onChange={handleFilesPicked}
              accept={ACCEPT_TYPES}
              className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
            />
            <CloudArrowUpIcon className="h-6 w-6 mr-2" />
            <span>Select Images and start uploading...</span>
          </label>

          <fieldset className="space-y-5">
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="uploadOriginal"
                  aria-describedby="uploadOriginal-description"
                  name="uploadOriginal"
                  type="checkbox"
                  className={clsx(
                    uploadTrigger
                      ? "text-gray-300 focus:ring-gray-300"
                      : "text-stone-600 focus:ring-stone-500",
                    `h-4 w-4 rounded border-gray-300 `
                  )}
                  checked={uploadOriginal}
                  onChange={() =>
                    uploadTrigger ? null : setUploadOriginal(!uploadOriginal)
                  }
                  disabled={uploadTrigger}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="comments"
                  className="font-medium text-gray-700 mr-2">
                  Upload Original
                </label>
                <span id="comments-description" className="text-gray-500">
                  <span className="sr-only">Upload Original </span>
                  <div className="text-xs text-gray-500">
                    (Hint: turn off to save space)
                  </div>
                </span>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="border-t border-gray-200 mt-5 mx-8">
          {photos.map((photo: IPhotoUpload, index: number) => {
            const thumbSizesBytes =
              photo.info.bytes["32x32"] +
              photo.info.bytes["128x128"] +
              photo.info.bytes["400-max-w-h"];
            return (
              <div
                key={index}
                className="md:flex md:flex-row justify-between px-4 py-2 border-b border-gray-200">
                <div className="w-6">
                  {photo.thumb && (
                    <img
                      src={URL.createObjectURL(photo.thumb)}
                      className="h-5 w-5 mx-auto block object-cover rounded-md"
                    />
                  )}
                </div>

                <div className="text-sm md:text-xs font-bold md:px-3">
                  {photo.file.name}
                </div>

                {/* <div className="text-xs font-mono">{photo.info.uuid}</div> */}
                <div className="md:flex-1 pt-1 md:px-4">
                  <ProgressBar progress={photo.info.progress}></ProgressBar>
                </div>
                <div className="text-xs w-20">
                  {uploadOriginal
                    ? humanFileSize(photo.file.size, true, 2)
                    : humanFileSize(thumbSizesBytes, true, 2)}
                </div>
                <div className="text-xs uppercase md:px-1">
                  {photo.info.status}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-right mx-8 text-sm">
          <h1>
            Total Uploads: <b>{totalCount}</b>
            <div
              className={clsx(
                "text-xs text-gray-500 ml-1",
                !uploadOriginal ? "line-through" : ""
              )}>
              Originals Total Size: {humanFileSize(totalSizeOriginals, true, 2)}
            </div>
            <div className="text-xs text-gray-500 ml-1">
              Thumbs Total Size: {humanFileSize(totalSizeThumbs, true, 2)}
            </div>
            {!uploadOriginal && (
              <div className="text-xs text-gray-500 ml-1">
                Total Savings:{" "}
                {humanFileSize(totalSizeOriginals - totalSizeThumbs, true, 2)}
              </div>
            )}
          </h1>
        </div>
      </div>
    </>
  );
}
