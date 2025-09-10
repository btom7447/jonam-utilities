import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disable Next.js body parsing for this route (important for file streams)
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    // Save uploads into /public/uploads
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Parse file with formidable
    const form = formidable({ multiples: false, uploadDir, keepExtensions: true });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file[0]; // assuming input name="file"
    const fileName = path.basename(file.filepath);
    const fileUrl = `/uploads/${fileName}`; // public URL (served by Next.js /public folder)

    return NextResponse.json({ url: fileUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
