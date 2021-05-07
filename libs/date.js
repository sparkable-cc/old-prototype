import dayjs from 'dayjs'
import 'dayjs/locale/en' // import locale
import Duration from 'dayjs/plugin/duration'

dayjs.locale('en')
dayjs.extend(Duration)

export const Seconds = 1000
export const Minutes = 60 * Seconds
export const Hours = 60 * Minutes
export const Days = 24 * Hours

const date = dayjs
export default date

export function formatDate(ts) {
  return isToday(ts) ? `Today, ${formatTime(ts)}` : dayjs(ts).format('DD.MM.YY')
}

export function formatFull(ts) {
  return `${date}, ${formatTime(ts)}`
}

export function formatYear(ts) {
  return dayjs(ts).format('YYYY')
}

export function formatTime(ts) {
  return dayjs(ts).format('HH:mm')
}

export function tonight() {
  return dayjs().endOf('day').valueOf()
}

export function isToday(ts) {
  return dayjs().endOf('day').valueOf() == dayjs(ts).endOf('day').valueOf()
}
