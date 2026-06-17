/**
 * Parses a timezone-naive datetime-local string (e.g., "2026-06-20T10:00")
 * explicitly as Indian Standard Time (IST, UTC+5:30) and returns a UTC Date object.
 */
export function parseISTDateTime(value: string | null): Date | null {
  if (!value || value.trim() === "") return null;

  // Append the IST offset (+05:30) so JS parses it relative to India instead of system local time
  const istString = value.includes("Z") || value.includes("+") 
    ? value 
    : `${value}:00+05:30`;

  const d = new Date(istString);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Converts a UTC Date object into a timezone-naive string formatted for 
 * HTML <input type="datetime-local"> matching Indian Standard Time (IST).
 */
export function toISTInputValue(date: Date | null): string {
  if (!date) return "";

  // Shift UTC date by +5.5 hours to represent IST values
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);

  // Return the ISO string sliced up to the minutes portion: YYYY-MM-DDTHH:mm
  return istDate.toISOString().slice(0, 16);
}