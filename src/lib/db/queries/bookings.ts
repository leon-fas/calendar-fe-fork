import { and, eq, gte, lte, not, or } from "drizzle-orm";
import { type Booking, bookings, db, type NewBooking, rooms } from "../index";

export async function getAllBookings(): Promise<Booking[]> {
	return await db.select().from(bookings).orderBy(bookings.startTime);
}

export async function getBookingById(id: string): Promise<Booking | null> {
	const result = await db.select().from(bookings).where(eq(bookings.id, id));
	return result[0] || null;
}

export async function getBookingsByRoom(roomId: string): Promise<Booking[]> {
	return await db
		.select()
		.from(bookings)
		.where(eq(bookings.roomId, roomId))
		.orderBy(bookings.startTime);
}

export async function getBookingsByDateRange(
	roomId: string,
	startDate: Date,
	endDate: Date
): Promise<Booking[]> {
	return await db
		.select()
		.from(bookings)
		.where(
			and(
				eq(bookings.roomId, roomId),
				lte(bookings.startTime, endDate),
				gte(bookings.endTime, startDate)
			)
		)
		.orderBy(bookings.startTime);
}

export async function createBooking(booking: NewBooking): Promise<Booking> {
	const result = await db.insert(bookings).values(booking).returning();
	return result[0];
}

export async function updateBooking(
	id: string,
	updates: Partial<NewBooking>
): Promise<Booking | null> {
	const result = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
	return result[0] || null;
}

export async function deleteBooking(id: string): Promise<boolean> {
	const result = await db.delete(bookings).where(eq(bookings.id, id)).returning();
	return result.length > 0;
}

export async function checkBookingConflict(
	roomId: string,
	startTime: Date,
	endTime: Date,
	excludeBookingId?: string
): Promise<boolean> {
	const conditions = [
		eq(bookings.roomId, roomId),
		or(
			and(lte(bookings.startTime, startTime), gte(bookings.endTime, startTime)),
			and(lte(bookings.startTime, endTime), gte(bookings.endTime, endTime)),
			and(gte(bookings.startTime, startTime), lte(bookings.endTime, endTime))
		),
	];

	if (excludeBookingId) {
		conditions.push(not(eq(bookings.id, excludeBookingId)));
	}

	const conflicts = await db
		.select()
		.from(bookings)
		.where(and(...conditions));

	return conflicts.length > 0;
}

export async function isRoomAvailable(
	roomId: string,
	startTime: Date,
	endTime: Date
): Promise<boolean> {
	const hasConflict = await checkBookingConflict(roomId, startTime, endTime);
	return !hasConflict;
}

/**
 * Get all bookings for multiple rooms within a date range
 */
export async function getBookingsForAllRooms(startDate: Date, endDate: Date): Promise<Booking[]> {
	return await db
		.select()
		.from(bookings)
		.where(and(lte(bookings.startTime, endDate), gte(bookings.endTime, startDate)))
		.orderBy(bookings.startTime);
}

/**
 * Get current booking for a room (happening right now)
 */
export async function getCurrentBooking(roomId: string): Promise<Booking | null> {
	const now = new Date();
	const result = await db
		.select()
		.from(bookings)
		.where(
			and(eq(bookings.roomId, roomId), lte(bookings.startTime, now), gte(bookings.endTime, now))
		);
	return result[0] || null;
}

/**
 * Get next upcoming booking for a room
 */
export async function getNextBooking(roomId: string): Promise<Booking | null> {
	const now = new Date();
	const result = await db
		.select()
		.from(bookings)
		.where(and(eq(bookings.roomId, roomId), gte(bookings.startTime, now)))
		.orderBy(bookings.startTime)
		.limit(1);
	return result[0] || null;
}

/**
 * Get all bookings for all rooms within a date range, including room names and colors
 */
export async function getAllRoomsBookingsByDateRange(
	startDate: Date,
	endDate: Date
): Promise<(Booking & { roomName: string; roomColor: string })[]> {
	const result = await db
		.select({
			id: bookings.id,
			title: bookings.title,
			description: bookings.description,
			color: bookings.color,
			location: bookings.location,
			startTime: bookings.startTime,
			endTime: bookings.endTime,
			roomId: bookings.roomId,
			userId: bookings.userId,
			createdAt: bookings.createdAt,
			roomName: rooms.name,
			roomColor: rooms.color,
		})
		.from(bookings)
		.innerJoin(rooms, eq(bookings.roomId, rooms.id))
		.where(
			and(
				lte(bookings.startTime, endDate),
				gte(bookings.endTime, startDate)
			)
		)
		.orderBy(bookings.startTime);

	return result;
}
