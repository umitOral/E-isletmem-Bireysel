import { v2 as cloudinary } from "cloudinary";
const cloudinaryImageUploadMethod = async (file) => {
    const result = await cloudinary.uploader.upload(file, {
      use_filename: true,
      folder: "archimet",
    });

    return { secure_url: result.secure_url, public_id: result.public_id };
  };

  export {cloudinaryImageUploadMethod}