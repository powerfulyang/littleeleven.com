export function isRemoteImage(str: string) {
  return str.startsWith('https://') || str.startsWith('/')
}
