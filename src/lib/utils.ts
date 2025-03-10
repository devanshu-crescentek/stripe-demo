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

  const officeStart = 8
  const officeEnd = 17
  const currentHour: number = ukTime.getHours()
  const currentMinutes: number = ukTime.getMinutes()

  let estimatedHour: number
  let estimatedMinutes: number

  if (ukTime.getDay() === 6 || ukTime.getDay() === 0) {
    // If it's Saturday or Sunday, set delivery to Monday at 9 AM
    ukTime.setDate(ukTime.getDate() + (8 - ukTime.getDay()))
    estimatedHour = officeStart + 1
    estimatedMinutes = 0
  } else if (currentHour < officeStart) {
    // If order is before 8 AM, start counting from 8 AM
    estimatedHour = officeStart + 1
    estimatedMinutes = 0
  } else if (currentHour >= officeEnd) {
    // If order is at or after 5 PM, move to the next business day at 9 AM
    ukTime.setDate(ukTime.getDate() + 1)
    estimatedHour = officeStart + 1
    estimatedMinutes = 0
  } else if (currentHour === officeEnd - 1 && currentMinutes === 0) {
    // If order is exactly at 4 PM, set delivery to 5 PM today
    estimatedHour = officeEnd
    estimatedMinutes = 0
  } else if (currentHour >= officeEnd - 1 && currentMinutes > 0) {
    // If order is after 4 PM but before 5 PM, move to the next business day at the same minutes past 8 AM
    ukTime.setDate(ukTime.getDate() + 1)
    estimatedHour = officeStart
    estimatedMinutes = currentMinutes
  } else {
    // Add 1 hour within business hours
    estimatedHour = currentHour + 1
    estimatedMinutes = currentMinutes
  }

  // Ensure the next business day is not a weekend
  if (ukTime.getDay() === 6) ukTime.setDate(ukTime.getDate() + 2)
  if (ukTime.getDay() === 0) ukTime.setDate(ukTime.getDate() + 1)

  // Set the estimated time
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

  // Add ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (n: number): string => {
    if (n > 3 && n < 21) return 'ᵗʰ' // Special case for 11th-13th
    switch (n % 10) {
      case 1:
        return 'ˢᵗ'
      case 2:
        return 'ⁿᵈ'
      case 3:
        return 'ʳᵈ'
      default:
        return 'ᵗʰ'
    }
  }

  return `${day}, ${date}${getOrdinalSuffix(date)} ${month} ${year} at ${time}`
}

export const getNextBusinessDayTime = (
  timezone: string = 'Europe/London',
  paymentDate: Date = new Date()
): string => {
  const now: Date = new Date(paymentDate)
  const ukTime: Date = new Date(
    now.toLocaleString('en-US', { timeZone: timezone })
  )

  const officeStart = 8
  const officeEnd = 17
  const businessHours = officeEnd - officeStart // 9 hours (8 AM - 5 PM)

  let estimatedHour = ukTime.getHours()
  let estimatedMinutes = ukTime.getMinutes()

  // If the current time is before office hours, start at 8 AM today
  if (estimatedHour < officeStart) {
    estimatedHour = officeStart
    estimatedMinutes = 0
  }

  // Calculate remaining business hours for today
  const remainingHoursToday = officeEnd - estimatedHour

  if (estimatedHour >= officeEnd) {
    // After 5 PM: Move to next business day at 5 PM
    ukTime.setDate(ukTime.getDate() + 1)
    estimatedHour = officeEnd
    estimatedMinutes = 0
  } else if (remainingHoursToday >= businessHours) {
    // If there's a full 9-hour window, add 9 hours
    estimatedHour += businessHours
  } else {
    // If not enough hours left today, carry over to the next business day
    const remainingTimeNeeded = businessHours - remainingHoursToday
    ukTime.setDate(ukTime.getDate() + 1) // Move to next business day
    estimatedHour = officeStart + remainingTimeNeeded
    // estimatedMinutes = 0
  }

  if (estimatedHour === officeEnd && estimatedMinutes > 0) {
    const remainingTimeNeeded = businessHours - remainingHoursToday
    estimatedHour = officeStart + remainingTimeNeeded
  }

  // If the next business day is Saturday or Sunday, move to Monday at 5 PM
  if (ukTime.getDay() === 6) {
    ukTime.setDate(ukTime.getDate() + 2) // Move to Monday
    estimatedHour = officeEnd
    estimatedMinutes = 0
  } else if (ukTime.getDay() === 0) {
    ukTime.setDate(ukTime.getDate() + 1) // Move to Monday
    estimatedHour = officeEnd
    estimatedMinutes = 0
  }

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

  // Add ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (n: number): string => {
    if (n > 3 && n < 21) return 'ᵗʰ' // Special case for 11th-13th
    switch (n % 10) {
      case 1:
        return 'ˢᵗ'
      case 2:
        return 'ⁿᵈ'
      case 3:
        return 'ʳᵈ'
      default:
        return 'ᵗʰ'
    }
  }

  return `${day}, ${date}${getOrdinalSuffix(date)} ${month} ${year} at ${time}`
}
