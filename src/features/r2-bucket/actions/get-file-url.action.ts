"use server";

import { buildR2PublicUrl } from "../utils/awss3.utils";

export async function getFileUrlFromKey(key: string) {
  if (!key || typeof key !== "string") {
    return { success: false, error: "Invalid key" } as const;
  }

  try {
    const url = buildR2PublicUrl(key);
    return { success: true, url } as const;
  } catch (error) {
    return { success: false, error: "Failed to build URL" } as const;
  }
}
