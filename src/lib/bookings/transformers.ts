import type { CalendarEvent, EventColor } from "../../components/event-calendar/types";
import type { Booking } from "../db/schema";

/**
 * Convert database Booking to CalendarEvent format
 */
export function bookingToCalendarEvent(booking: Booking): CalendarEvent {
	return {
		id: booking.id,
		title: booking.title,
		description: booking.description || undefined,
		start: new Date(booking.startTime),
		end: new Date(booking.endTime),
		color: (booking.color as EventColor) || "blue",
		location: booking.location || undefined,
		allDay: false, // We don't support all-day events yet, but could be added later
	};
}

/**
 * Convert multiple Bookings to CalendarEvents
 */
export function bookingsToCalendarEvents(bookings: Booking[]): CalendarEvent[] {
	return bookings.map(bookingToCalendarEvent);
}

/**
 * Convert CalendarEvent to database Booking format for creation
 */
export function calendarEventToBooking(
	event: CalendarEvent,
	roomId: string,
	userId: string
): Omit<Booking, "id" | "createdAt"> {
	return {
		title: event.title,
		description: event.description || null,
		color: event.color || null,
		location: event.location || null,
		startTime: event.start,
		endTime: event.end,
		roomId,
		userId,
	};
}

/**
 * Convert CalendarEvent to database Booking updates format
 */
export function calendarEventToBookingUpdate(
	event: CalendarEvent
): Partial<Omit<Booking, "id" | "createdAt" | "roomId" | "userId">> {
	return {
		title: event.title,
		description: event.description || null,
		color: event.color || null,
		location: event.location || null,
		startTime: event.start,
		endTime: event.end,
	};
}

/**
 * Convert multiple Bookings with room names to CalendarEvents
 * Used specifically for all-rooms view where room name should be shown as location
 */
export function bookingsToCalendarEventsWithRoomNames(
	bookings: (Booking & { roomName: string; roomColor: string })[]
): CalendarEvent[] {
	return bookings.map((booking) => {
		return {
			id: booking.id,
			title: booking.title,
			description: booking.description || undefined,
			start: new Date(booking.startTime),
			end: new Date(booking.endTime),
			color: (booking.color as EventColor) || "blue",
			location: booking.roomName,
			allDay: false,
			roomName: booking.roomName, // Add room name for border styling
			roomColor: booking.roomColor, // Add room color for border styling
		};
	});
}
