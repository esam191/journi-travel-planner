import { PutObjectCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/lib/spaces";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Invalid content type" },
      { status: 400 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const key = `uploads/${Date.now()}-${file.name.replaceAll(" ", "-")}`;

    const command = new PutObjectCommand({
      Bucket: process.env.SPACES_BUCKET, 
      Key: key,
      Body: fileBuffer,
      ACL: "public-read", 
      ContentType: file.type || "application/octet-stream",
    });

    await s3Client.send(command);

    const url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com/${key}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}