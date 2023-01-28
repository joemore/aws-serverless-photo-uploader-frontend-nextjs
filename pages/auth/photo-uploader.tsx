import type { NextPage } from "next";
import PhotosoDisplay from "../../components/Auth/PhotoUploader/PhotosoDisplay";
import PhotoUploader from "../../components/Auth/PhotoUploader/PhotoUploader";
import BreadCrumbs from "../../components/UI/BreadCrumbs";

// Sets the default switch for if we want to upload the original as well as the thumbnail
export const UPLOAD_ORIGINAL = false;

const PhotoUploaderDisplay: NextPage & { auth: boolean } = () => {
  return (
    <>
      <main className="">
        <BreadCrumbs
          links={[
            { url: "/", text: "Home" },
            { url: "/auth/photo-uploader", text: "Photo Uploader" },
          ]}
        />
        <div className=" pb-6 px-0 ">
          <PhotoUploader />
          <PhotosoDisplay />
        </div>
      </main>
    </>
  );
};

export default PhotoUploaderDisplay;
PhotoUploaderDisplay.auth = true;
