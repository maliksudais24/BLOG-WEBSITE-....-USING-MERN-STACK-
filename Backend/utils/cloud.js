import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});

export const uploadfile = async (localfile) => {
  try {
    if (!localfile) return null;

    const response = await cloudinary.uploader.upload(localfile, {
      resource_type: "auto",
    });

    fs.unlinkSync(localfile); // ✅ fixed
    return response;

  } catch (error) {
    if (fs.existsSync(localfile)) {
      fs.unlinkSync(localfile); // ✅ fixed
    }
    return null;
  }
};

export const deleteFile = async (publicId) => {
  try {
    if (!publicId) return null;

    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    return null;
  }
};
