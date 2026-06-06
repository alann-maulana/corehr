/**
 * Date and Attendance utility helper functions
 */

/**
 * Returns all working days (Monday to Friday) in a specific month,
 * excluding weekends and national holidays.
 * @param year Year (4 digits, e.g. 2026)
 * @param month Month (1-indexed, 1 = January, 12 = December)
 * @param holidays Array of holiday date strings in format 'YYYY-MM-DD'
 */
export function getWorkingDaysInMonth(
  year: number,
  month: number,
  holidays: string[]
): string[] {
  const workingDays: string[] = [];
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of month

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    // Format to YYYY-MM-DD in local time
    const dateStr = formatDateToLocalYYYYMMDD(d);
    
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
    const isHoliday = holidays.includes(dateStr);

    if (!isWeekend && !isHoliday) {
      workingDays.push(dateStr);
    }
  }

  return workingDays;
}

/**
 * Returns all working days (Monday to Friday) from the 1st of the month
 * up to today (or the end of the month if it's a past month),
 * excluding weekends and national holidays.
 * @param year Year (4 digits)
 * @param month Month (1-indexed)
 * @param holidays Array of holiday date strings in format 'YYYY-MM-DD'
 */
export function getWorkingDaysUpToToday(
  year: number,
  month: number,
  holidays: string[]
): string[] {
  const workingDays: string[] = [];
  const now = new Date();
  
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  // If the queried month is in the future, return empty array
  if (year > currentYear || (year === currentYear && month > currentMonth)) {
    return [];
  }

  const startDate = new Date(year, month - 1, 1);
  
  // End date is either today (if current month/year) or last day of the queried month
  let endDate: Date;
  if (year === currentYear && month === currentMonth) {
    endDate = new Date(year, month - 1, now.getDate());
  } else {
    endDate = new Date(year, month, 0);
  }

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const dateStr = formatDateToLocalYYYYMMDD(d);
    
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidays.includes(dateStr);

    if (!isWeekend && !isHoliday) {
      workingDays.push(dateStr);
    }
  }

  return workingDays;
}

/**
 * Formats a Date object to YYYY-MM-DD string in local time
 */
export function formatDateToLocalYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date object to YYYY-MM-DD string in local time, but handles date-only inputs properly
 */
export function formatDbDate(dateInput: Date | string): string {
  if (typeof dateInput === "string") {
    // If it's a string, it might be YYYY-MM-DDT... or just YYYY-MM-DD
    return dateInput.substring(0, 10);
  }
  return formatDateToLocalYYYYMMDD(dateInput);
}

/**
 * Calculates working hours based on check-in and check-out time strings (HH:MM:SS)
 */
export function calculateWorkingHours(
  checkIn: string | null | undefined,
  checkOut: string | null | undefined
): number {
  if (!checkIn || !checkOut) return 0;
  
  const [inH, inM] = checkIn.split(":").map(Number);
  const [outH, outM] = checkOut.split(":").map(Number);
  
  const inMinutes = inH * 60 + inM;
  const outMinutes = outH * 60 + outM;
  
  if (outMinutes <= inMinutes) return 0;
  return (outMinutes - inMinutes) / 60;
}

/**
 * Formats a decimal working hour value into a readable Indonesian string
 */
export function formatWorkingHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  if (h === 0) return `${m} Menit`;
  if (m === 0) return `${h} Jam`;
  return `${h} Jam ${m} Menit`;
}

/**
 * Translates a month index to Indonesian month name
 */
export function getIndonesianMonthName(month: number): string {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return months[month - 1] || "";
}
