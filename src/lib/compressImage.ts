"use client";

// Re-draws an uploaded image onto a canvas and re-exports it as JPEG. This
// both compresses the photo and strips all EXIF metadata (including GPS),
// since canvas re-rasterization never carries metadata over. No extra
// dependency needed.
export async function compressImageToDataUrl(file: File, maxDimension = 1600, quality = 0.75): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported on this device.");
  ctx.drawImage(bitmap, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", quality);
}
