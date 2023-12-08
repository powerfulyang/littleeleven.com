export function getUploadURL(upload: any) {
  if (!upload)
    return ''

  if (upload.hash)
    return `//${upload.bucket.domain}/${upload.hash}`

  return ''
}

export function getUploadThumbnailURL(upload: any) {
  if (!upload)
    return ''

  if (upload.thumbnailHash)
    return `//${upload.bucket.domain}/${upload.thumbnailHash}`

  return ''
}
