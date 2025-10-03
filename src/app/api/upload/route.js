import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // let FormData handle this
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await new Promise((resolve, reject) => {
      const busboy = require("busboy");
      const bb = busboy({ headers: req.headers });
      let fileBuffer = null;

      bb.on("file", (_, file) => {
        const chunks = [];
        file.on("data", (chunk) => chunks.push(chunk));
        file.on("end", () => {
          fileBuffer = Buffer.concat(chunks);
        });
      });

      bb.on("finish", () => resolve(fileBuffer));
      req.pipe(bb);
    });

    if (!data) return res.status(400).json({ error: "No file uploaded" });

    const uploadRes = await cloudinary.uploader.upload_stream(
      { folder: "handymen" },
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ url: result.secure_url });
      }
    );

    require("streamifier").createReadStream(data).pipe(uploadRes);
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
}
