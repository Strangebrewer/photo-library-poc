import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { s3, S3_BUCKET } from "@/lib/s3";
import { auth } from "@/auth";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return new Response(null, { status: 401 });
  const uuid = randomUUID();

  const [fullUrl, thumbUrl] = await Promise.all([
    getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: `${uuid}.jpg`,
        ContentType: "image/jpeg",
      }),
      { expiresIn: 300 },
    ),
    getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: `${uuid}_thumb.jpg`,
        ContentType: "image/jpeg",
      }),
      { expiresIn: 300 },
    ),
  ]);

  return NextResponse.json({ uuid, fullUrl, thumbUrl });
}
