export async function resizeImage(
  file: File,
  maxPx: number,
  quality: number,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, maxPx / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);

  return canvas.convertToBlob({ type: "image/jpeg", quality });
}

export async function resizeBoth(file: File) {
  const [full, thumb] = await Promise.all([
    resizeImage(file, 1920, 0.85),
    resizeImage(file, 200, 0.75),
  ]);
  return { full, thumb };
}
