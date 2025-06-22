import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadCloudinary = async (filepath) => {
    if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
        throw new Error("Cloudinary environment variables are not set.");
    }

    try {
        const response = await cloudinary.uploader.upload(filepath, {
            resource_type: "auto"
        });

        fs.unlink(filepath); // clean up temp file
        return response;
    } catch (error) {
        if (await fs.exists(filepath)) await fs.unlink(filepath);
        console.error("Cloudinary upload failed:", error?.message || error);
        return null;
    }
};

export default uploadCloudinary;
