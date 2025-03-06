import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

export const getLondonISOString = () => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }

  const formatter = new Intl.DateTimeFormat('en-GB', options)
  const parts = formatter.formatToParts(new Date())

  const isoString = `${parts[4].value}-${parts[2].value}-${parts[0].value}T${parts[6].value}:${parts[8].value}:${parts[10].value}.000Z`

  return isoString
}

export const getEstimatedTime = (
  timezone: string = 'Europe/London',
  paymentDate: Date = new Date()
): string => {
  const now: Date = new Date(paymentDate)
  const ukTime: Date = new Date(
    now.toLocaleString('en-US', { timeZone: timezone })
  )

  const currentHour: number = ukTime.getHours()
  const currentMinutes: number = ukTime.getMinutes()

  // Add 1 hour for processing time
  let estimatedHour: number = currentHour + 1
  let estimatedMinutes: number = currentMinutes

  if (estimatedHour >= 17) {
    // If it's past 4 PM, move to next working day at 9 AM
    ukTime.setDate(ukTime.getDate() + 1)
    estimatedHour = 9
    estimatedMinutes = 0

    // Skip weekends (Saturday & Sunday)
    if (ukTime.getDay() === 6) ukTime.setDate(ukTime.getDate() + 2) // If Saturday, move to Monday
    if (ukTime.getDay() === 0) ukTime.setDate(ukTime.getDate() + 1) // If Sunday, move to Monday
  } else if (estimatedHour < 8) {
    // If it's before 8 AM, set to 9 AM
    estimatedHour = 9
    estimatedMinutes = 0
  }

  // Set the estimated time
  ukTime.setHours(estimatedHour, estimatedMinutes, 0)

  const day = ukTime.toLocaleString('en-GB', { weekday: 'long' })
  const date = ukTime.getDate()
  const month = ukTime.toLocaleString('en-GB', { month: 'long' })
  const year = ukTime.getFullYear()
  const time = ukTime.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  // Add ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (n: number): string => {
    if (n > 3 && n < 21) return 'th' // 4-20 always "th"
    switch (n % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }
  const formattedDate = `${day}, ${date}${getOrdinalSuffix(
    date
  )} ${month} ${year} at ${time}`

  return formattedDate
}

export const getNextBusinessDayTime = (
  timezone: string = 'Europe/London',
  paymentDate: Date = new Date()
): string => {
  const now: Date = new Date(paymentDate)
  const ukTime: Date = new Date(
    now.toLocaleString('en-US', { timeZone: timezone })
  )

  const currentHour: number = ukTime.getHours()
  const currentMinutes: number = ukTime.getMinutes()

  // Define office hours
  const officeStart = 8
  const officeEnd = 17

  let estimatedHour: number = currentHour
  let estimatedMinutes: number = currentMinutes

  // If order is placed outside office hours, start at 8 AM next business day
  if (currentHour >= officeEnd) {
    ukTime.setDate(ukTime.getDate() + 1) // Move to next day
    estimatedHour = officeStart
    estimatedMinutes = 0
  }

  // Move exactly one business day ahead (counting only office hours)
  ukTime.setDate(ukTime.getDate() + 1)

  // Skip weekends (Saturday & Sunday)
  if (ukTime.getDay() === 6) ukTime.setDate(ukTime.getDate() + 2) // If Saturday, move to Monday
  if (ukTime.getDay() === 0) ukTime.setDate(ukTime.getDate() + 1) // If Sunday, move to Monday

  // Apply the estimated time
  ukTime.setHours(estimatedHour, estimatedMinutes, 0)

  const day = ukTime.toLocaleString('en-GB', { weekday: 'long' })
  const date = ukTime.getDate()
  const month = ukTime.toLocaleString('en-GB', { month: 'long' })
  const year = ukTime.getFullYear()
  const time = ukTime
    .toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .replace('am', 'AM')
    .replace('pm', 'PM')

  // Add ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (n: number): string => {
    if (n > 3 && n < 21) return 'th' // 4-20 always "th"
    switch (n % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  const formattedDate = `${day}, ${date}${getOrdinalSuffix(
    date
  )} ${month} ${year} at ${time}`

  return formattedDate
}
