import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getEstimatedTime = (_timezone: string = "Europe/London"): string => {
  const userTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const now: Date = new Date();
  const ukTime: Date = new Date(now.toLocaleString("en-US", { timeZone: userTimezone }));

  const currentHour: number = ukTime.getHours();
  const currentMinutes: number = ukTime.getMinutes();

  // Add 1 hour for processing time
  let estimatedHour: number = currentHour + 1;
  let estimatedMinutes: number = currentMinutes;

  if (estimatedHour >= 17) {
    // If it's past 4 PM, move to next working day at 9 AM
    ukTime.setDate(ukTime.getDate() + 1);
    estimatedHour = 9;
    estimatedMinutes = 0;

    // Skip weekends (Saturday & Sunday)
    if (ukTime.getDay() === 6) ukTime.setDate(ukTime.getDate() + 2); // If Saturday, move to Monday
    if (ukTime.getDay() === 0) ukTime.setDate(ukTime.getDate() + 1); // If Sunday, move to Monday
  } else if (estimatedHour < 8) {
    // If it's before 8 AM, set to 9 AM
    estimatedHour = 9;
    estimatedMinutes = 0;
  }

  // Set the estimated time
  ukTime.setHours(estimatedHour, estimatedMinutes, 0);

  // Format day and time in 12-hour format with AM/PM
  const options: Intl.DateTimeFormatOptions = { 
    weekday: "long", 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: true 
  };
  
  return ukTime.toLocaleString("en-GB", options);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getNextBusinessDayTime = (_timezone: string = "Europe/London"): string => {
  const userTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now: Date = new Date();
  const ukTime: Date = new Date(now.toLocaleString("en-US", { timeZone: userTimezone }));

  const currentHour: number = ukTime.getHours();
  const currentMinutes: number = ukTime.getMinutes();

  // Define office hours
  const officeStart = 8;
  const officeEnd = 17;

  let estimatedHour: number = currentHour;
  let estimatedMinutes: number = currentMinutes;

  // If order is placed outside office hours, start at 8 AM next business day
  if (currentHour >= officeEnd) {
    ukTime.setDate(ukTime.getDate() + 1); // Move to next day
    estimatedHour = officeStart;
    estimatedMinutes = 0;
  }

  // Move exactly one business day ahead (counting only office hours)
  ukTime.setDate(ukTime.getDate() + 1);

  // Skip weekends (Saturday & Sunday)
  if (ukTime.getDay() === 6) ukTime.setDate(ukTime.getDate() + 2); // If Saturday, move to Monday
  if (ukTime.getDay() === 0) ukTime.setDate(ukTime.getDate() + 1); // If Sunday, move to Monday

  // Apply the estimated time
  ukTime.setHours(estimatedHour, estimatedMinutes, 0);

  // Format day and time in 12-hour format with AM/PM
  const options: Intl.DateTimeFormatOptions = { 
    weekday: "long", 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: true 
  };

  return ukTime.toLocaleString("en-GB", options);
};
