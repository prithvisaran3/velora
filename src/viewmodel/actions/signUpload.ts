"use server";

import crypto from "crypto";

export async function getSignedUploadParams() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "dummy_private_key";
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 30 * 60; // 30 mins

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  return {
    token,
    expire,
    signature,
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "dummy_public_key",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/velora",
  };
}
