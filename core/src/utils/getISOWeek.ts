import { Temporal } from "temporal-polyfill";

/**
 * Get the ISO 8601 week number and year for a given date.
 * 
 * @param day - Date as Temporal.PlainDate or YYYY-MM-DD string
 * @returns Object with week number and year
 */
export function getISOWeek(day: string): { week: number; year: number } {
	const plainDate = Temporal.PlainDate.from(day);
	return { week: plainDate.weekOfYear ?? 1, year: plainDate.yearOfWeek ?? plainDate.year };
}
