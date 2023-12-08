export function getDuration(start: string, end: string = new Date().toString()) {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff - hours * 1000 * 60 * 60) / (1000 * 60))
  const seconds = Math.floor((diff - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000).toString().padStart(2, '0')
  return `${hours ? `${hours}h ` : ''} ${minutes}m ${seconds}s`
}
