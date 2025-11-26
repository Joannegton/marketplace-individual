export const runtime = "nodejs";

import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  admin.initializeApp({
    credential: serviceAccount
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const path =
      url.searchParams.get("path") ||
      request.headers.get("x-path") ||
      "products";
    const filename = request.headers.get("x-filename") || "file";
    const contentType =
      request.headers.get("content-type") || "application/octet-stream";

    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucket = admin.storage().bucket();
    const destName = `${path}/${Date.now()}_${filename}`;
    const file = bucket.file(destName);

    await file.save(buffer, { metadata: { contentType } });
    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destName}`;

    return new Response(JSON.stringify({ url: publicUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Upload error", err);
    return new Response(
      JSON.stringify({ error: err?.message || String(err) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
