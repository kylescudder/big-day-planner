// Client helpers for the private profile photo endpoint.
export async function avatarRequest(
  init: RequestInit
): Promise<{ image: string | null }> {
  const response = await fetch('/api/profile/avatar', init)
  const body = await response.json().catch(() => ({}))
  if (!response.ok)
    throw new Error(body.error ?? 'Unable to update your profile photo.')
  return body
}

// Crop to a square and re-encode in the browser, so large phone photos upload
// quickly. The server checks, resizes and re-encodes again.
export async function prepareAvatar(file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    throw new Error('Choose a JPEG, PNG or WebP photo.')
  if (file.size > 10 * 1024 * 1024)
    throw new Error('Choose a photo smaller than 10 MB.')
  const image = await createImageBitmap(file)
  try {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 512
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Your browser could not prepare this photo.')
    const side = Math.min(image.width, image.height)
    context.drawImage(
      image,
      (image.width - side) / 2,
      (image.height - side) / 2,
      side,
      side,
      0,
      0,
      512,
      512
    )
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(new Error('This photo could not be prepared.')),
        'image/jpeg',
        0.85
      )
    )
  } finally {
    image.close()
  }
}
