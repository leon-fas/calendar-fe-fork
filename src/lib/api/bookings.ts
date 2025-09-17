import type { CalendarEvent } from "@/components/event-calendar/types";

/**
 * Client-side API functions for booking operations
 */

export async function fetchBookings(
	roomId: string,
	startDate: Date,
	endDate: Date
): Promise<CalendarEvent[]> {
	const params = new URLSearchParams({
		roomId,
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
	});

	const response = await fetch(`/api/bookings?${params}`);

	if (!response.ok) {
		throw new Error("Failed to fetch bookings");
	}

	const data = await response.json();

	// Convert date strings back to Date objects
	return data.events.map((event: any) => ({
		...event,
		start: new Date(event.start),
		end: new Date(event.end),
	}));
}

export async function createBookingAPI(event: CalendarEvent, roomId: string): Promise<any> {
	// Ensure dates are properly serialized
	const serializedEvent = {
		...event,
		start: event.start.toISOString(),
		end: event.end.toISOString(),
	};

	const response = await fetch("/api/bookings", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ event: serializedEvent, roomId }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to create booking");
	}

	return response.json();
}

export async function updateBookingAPI(event: CalendarEvent, roomId: string): Promise<any> {
	// Ensure dates are properly serialized
	const serializedEvent = {
		...event,
		start: event.start.toISOString(),
		end: event.end.toISOString(),
	};

	const response = await fetch(`/api/bookings/${event.id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ event: serializedEvent, roomId }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to update booking");
	}

	return response.json();
}

export async function deleteBookingAPI(eventId: string): Promise<void> {
	const response = await fetch(`/api/bookings/${eventId}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to delete booking");
	}
}

export async function fetchAllRoomsBookings(
	startDate: Date,
	endDate: Date
): Promise<CalendarEvent[]> {
	const params = new URLSearchParams({
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
	});

	const response = await fetch(`/api/bookings/all?${params}`);

	if (!response.ok) {
		throw new Error("Failed to fetch all rooms bookings");
	}

	const data = await response.json();

	// Convert date strings back to Date objects
	return data.events.map((event: any) => ({
		...event,
		start: new Date(event.start),
		end: new Date(event.end),
	}));
}
