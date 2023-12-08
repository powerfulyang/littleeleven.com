import type { EventLogResult } from '~/schemas/model'

export function getDesc(value: unknown, unit: string) {
  return value ? ` ${value}${unit}` : ''
}

export function formatLogInfo(eventLogResult: EventLogResult) {
  const { extra, eventName, event } = eventLogResult
  if (eventName === 'Weigh')
    return `体重${getDesc(extra?.weight, 'kg')}`

  if (eventName === 'Feed')
    return `${extra?.type}${getDesc(extra?.milkVolume, 'ml')}`

  if (eventName === 'Diaper')
    return `${extra?.source}`

  if (eventName === 'Supplement')
    return `${extra?.type}`

  return event.displayName
}
