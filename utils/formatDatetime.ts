import dayjs from 'dayjs'
import type { EventLog } from '~/schemas/model'

export function formatDatetime(date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(format)
}

export function timeToISOString(timeString: string, eventLog?: EventLog) {
  // 分割小时和分钟
  const [_hours, _minutes] = timeString.split(':')
  const hours = Number(_hours)
  const minutes = Number(_minutes)

  // 如果当前时间是 凌晨，然而 timeString 是 半夜
  // 那么就需要加一天
  if (dayjs().hour() < 12 && Number(hours) > 12 && !eventLog)
    return dayjs().subtract(1, 'day').hour(hours).minute(minutes).second(0).toISOString()

  // 创建一个代表 2021-08-01 的 dayjs 对象，并设置时间
  const date = dayjs(eventLog?.eventTime).hour(hours).minute(minutes).second(0)

  // 转换为 ISO 字符串格式
  return date.toISOString() // "2021-08-01T22:00:00.000Z"
}
