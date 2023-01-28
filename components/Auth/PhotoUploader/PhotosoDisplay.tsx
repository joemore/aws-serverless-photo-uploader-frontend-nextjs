import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { API } from "aws-amplify";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function PhotosoDisplay() {
  const [photos, setPhotos] = useState<any | []>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const getPhotos = async () => {
    const result = await API.get("API", "/get-photos", {});
    // console.log(result.photos);
    setPhotos(result.photos);
  };

  const deletePhoto = async (id: string) => {
    setIsDeleting(true);
    setPhotos(
      photos.map((photo: any) => {
        return photo.id === id ? { ...photo, deleting: true } : photo;
      })
    );
    const result = await API.del("API", `/delete-photo/${id}`, {});
    setPhotos(photos.filter((photo: any) => photo.id !== id));
    setIsDeleting(false);
  };

  useEffect(() => {
    getPhotos();
  }, []);

  const sqThumb = (size: string) => (
    <img
      src={size}
      className="h-8 w-8 mx-auto block object-cover rounded shadow-md shadow-slate-600"
    />
  );

  return (
    <>
      <div className="px-4 py-6">
        <h1>
          Displaying {photos.length} Photos{" "}
          <small
            className="text-sky-500 cursor-pointer mt-3 mr-10 float-right"
            onClick={() => getPhotos()}>
            refresh
          </small>
        </h1>

        <div className="border-t border-gray-200 mt-5 mx-8">
          {photos.length === 0 ? (
            <div className="text-xl italic text-center p-10 text-gray-300">
              No photos currently in library...
            </div>
          ) : (
            photos.map((photo: any, index: number) => {
              const sm = photo.preSignedGetUrls[0].url;
              const md = photo.preSignedGetUrls[1].url;
              const lg = photo.preSignedGetUrls[2].url;
              const original = photo.preSignedGetUrls[3]
                ? photo.preSignedGetUrls[3].url
                : null;
              const previewClasses = "shadow-md shadow-slate-800 rounded-md";
              return (
                <div
                  key={index}
                  className={clsx(
                    photo.deleting ? "opacity-30" : "",
                    `md:flex md:flex-row justify-between px-4 py-2 border-b border-gray-200`
                  )}>
                  <div
                    className="w-8 h-8 mr-1 rounded-full"
                    style={{ backgroundColor: photo.color1x1 }}>
                    {/* 1x1 Pixel Image (Need to simply extract this color) */}
                  </div>

                  <div className="w-10 mr-1 ">
                    {/* 32x32 Pixel Image */}
                    {sqThumb(sm)}
                  </div>
                  <div className="w-10 mr-3 relative group cursor-pointer">
                    {/* 128x128 Thumb */}
                    {sqThumb(md)}
                    {/* Large Preview */}
                    <div className="fixed hidden top-4 right-4 max-w-sm z-10 group-hover:block pointer-events-none bg-gray-100 rounded-xl">
                      <div
                        className="p-4 relative z-10 rounded-xl"
                        style={{ backgroundColor: photo.color1x1 }}>
                        <img
                          src={lg}
                          className={clsx(previewClasses, " max-h-96 ")}
                        />
                        <div className="flex justify-center items-center gap-5 mt-4">
                          <img src={sm} className={previewClasses} />
                          <img
                            src={md}
                            className={clsx(previewClasses, " max-h-24 ")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold flex-1">
                    {photo.original_name}
                  </div>

                  <div className="text-sm flex-1">
                    {original ? (
                      <a
                        href={original}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500">
                        Download Original
                      </a>
                    ) : (
                      <span className="text-gray-300">
                        Original was not uploaded
                      </span>
                    )}
                  </div>

                  <div
                    className="w-8 h-8 hover:outline outline-1 outline-slate-400 rounded-full ml-10 px-1.5 py-1.5 text-center cursor-pointer"
                    onClick={() =>
                      photo.deleting || isDeleting
                        ? null
                        : deletePhoto(photo.id)
                    }>
                    {photo.deleting ? (
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    ) : (
                      <TrashIcon className="h-5 w-5 text-red-500 hover:text-black" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-10 text-right mx-8 text-sm">
          <h1>
            Total Photos: <b>{photos.length}</b>
            <span className="text-xs text-gray-500 ml-1">
              {/* ({humanFileSize(totalSize, true, 2)}) */}
            </span>
          </h1>
        </div>
      </div>
    </>
  );
}
