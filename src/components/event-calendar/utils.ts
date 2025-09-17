import { isSameDay } from "date-fns";
import type { CalendarEvent, EventColor } from "./types";

/**
 * Get CSS classes for event colors
 */
export function getEventColorClasses(color?: EventColor | string): string {
	const eventColor = color || "gray";

	switch (eventColor) {
		case "blue":
			return "bg-blue-200/50 hover:bg-blue-200/40 text-blue-900/90 dark:bg-blue-400/25 dark:hover:bg-blue-400/20 dark:text-blue-200 shadow-blue-700/8";
		case "violet":
			return "bg-violet-200/50 hover:bg-violet-200/40 text-violet-900/90 dark:bg-violet-400/25 dark:hover:bg-violet-400/20 dark:text-violet-200 shadow-violet-700/8";
		case "rose":
			return "bg-rose-200/50 hover:bg-rose-200/40 text-rose-900/90 dark:bg-rose-400/25 dark:hover:bg-rose-400/20 dark:text-rose-200 shadow-rose-700/8";
		case "emerald":
			return "bg-emerald-200/50 hover:bg-emerald-200/40 text-emerald-900/90 dark:bg-emerald-400/25 dark:hover:bg-emerald-400/20 dark:text-emerald-200 shadow-emerald-700/8";
		case "orange":
			return "bg-orange-200/50 hover:bg-orange-200/40 text-orange-900/90 dark:bg-orange-400/25 dark:hover:bg-orange-400/20 dark:text-orange-200 shadow-orange-700/8";
		case "gray":
			return "bg-gray-200/50 hover:bg-gray-200/40 text-gray-900/90 dark:bg-gray-400/25 dark:hover:bg-gray-400/20 dark:text-gray-200 shadow-gray-700/8";
		case "yellow":
			return "bg-yellow-200/50 hover:bg-yellow-200/40 text-yellow-900/90 dark:bg-yellow-400/25 dark:hover:bg-yellow-400/20 dark:text-yellow-200 shadow-yellow-700/8";
		case "cyan":
			return "bg-cyan-200/50 hover:bg-cyan-200/40 text-cyan-900/90 dark:bg-cyan-400/25 dark:hover:bg-cyan-400/20 dark:text-cyan-200 shadow-cyan-700/8";
		default:
			return "bg-gray-200/50 hover:bg-gray-200/40 text-gray-900/90 dark:bg-gray-400/25 dark:hover:bg-gray-400/20 dark:text-gray-200 shadow-gray-700/8";
	}
}

/**
 * Get CSS classes for border radius based on event position in multi-day events
 */
export function getBorderRadiusClasses(isFirstDay: boolean, isLastDay: boolean): string {
	if (isFirstDay && isLastDay) {
		return "rounded"; // Both ends rounded
	} else if (isFirstDay) {
		return "rounded-l rounded-r-none not-in-data-[slot=popover-content]:w-[calc(100%+5px)]"; // Only left end rounded
	} else if (isLastDay) {
		return "rounded-r rounded-l-none not-in-data-[slot=popover-content]:w-[calc(100%+4px)] not-in-data-[slot=popover-content]:-translate-x-[4px]"; // Only right end rounded
	} else {
		return "rounded-none not-in-data-[slot=popover-content]:w-[calc(100%+9px)] not-in-data-[slot=popover-content]:-translate-x-[4px]"; // No rounded corners
	}
}

/**
 * Check if an event is a multi-day event
 */
export function isMultiDayEvent(event: CalendarEvent): boolean {
	const eventStart = new Date(event.start);
	const eventEnd = new Date(event.end);
	return event.allDay || eventStart.getDate() !== eventEnd.getDate();
}

/**
 * Filter events for a specific day
 */
export function getEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
	return events
		.filter((event) => {
			const eventStart = new Date(event.start);
			return isSameDay(day, eventStart);
		})
		.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

/**
 * Sort events with multi-day events first, then by start time
 */
export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
	return [...events].sort((a, b) => {
		const aIsMultiDay = isMultiDayEvent(a);
		const bIsMultiDay = isMultiDayEvent(b);

		if (aIsMultiDay && !bIsMultiDay) return -1;
		if (!aIsMultiDay && bIsMultiDay) return 1;

		return new Date(a.start).getTime() - new Date(b.start).getTime();
	});
}

/**
 * Get multi-day events that span across a specific day (but don't start on that day)
 */
export function getSpanningEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
	return events.filter((event) => {
		if (!isMultiDayEvent(event)) return false;

		const eventStart = new Date(event.start);
		const eventEnd = new Date(event.end);

		// Only include if it's not the start day but is either the end day or a middle day
		return (
			!isSameDay(day, eventStart) &&
			(isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd))
		);
	});
}

/**
 * Get all events visible on a specific day (starting, ending, or spanning)
 */
export function getAllEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
	return events.filter((event) => {
		const eventStart = new Date(event.start);
		const eventEnd = new Date(event.end);
		return (
			isSameDay(day, eventStart) || isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd)
		);
	});
}

/**
 * Get all events for a day (for agenda view)
 */
export function getAgendaEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
	return events
		.filter((event) => {
			const eventStart = new Date(event.start);
			const eventEnd = new Date(event.end);
			return (
				isSameDay(day, eventStart) ||
				isSameDay(day, eventEnd) ||
				(day > eventStart && day < eventEnd)
			);
		})
		.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

/**
 * Add hours to a date
 */
export function addHoursToDate(date: Date, hours: number): Date {
	const result = new Date(date);
	result.setHours(result.getHours() + hours);
	return result;
}
