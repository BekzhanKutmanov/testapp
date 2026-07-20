export const captureProctorScreenshot = (video: HTMLVideoElement): string | null => {
  if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) return null

  const canvas = document.createElement('canvas')

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const context = canvas.getContext('2d')

  if (!context) return null

  context.drawImage(video, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/jpeg', 0.82)
}
