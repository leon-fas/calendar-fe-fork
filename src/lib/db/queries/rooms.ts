import { eq } from "drizzle-orm";
import { bookings, db, type NewRoom, type Room, rooms } from "../index";

export async function getAllRooms(): Promise<Room[]> {
	return await db.select().from(rooms).orderBy(rooms.createdAt);
}

export async function getRoomById(id: string): Promise<Room | null> {
	const result = await db.select().from(rooms).where(eq(rooms.id, id));
	return result[0] || null;
}

export async function createRoom(room: NewRoom): Promise<Room> {
	const result = await db.insert(rooms).values(room).returning();
	return result[0];
}

export async function updateRoom(id: string, updates: Partial<NewRoom>): Promise<Room | null> {
	const result = await db.update(rooms).set(updates).where(eq(rooms.id, id)).returning();
	return result[0] || null;
}

export async function deleteRoom(id: string): Promise<boolean> {
	const result = await db.delete(rooms).where(eq(rooms.id, id)).returning();
	return result.length > 0;
}

export async function getRoomWithBookings(id: string) {
	return await db.query.rooms.findFirst({
		where: eq(rooms.id, id),
		with: {
			bookings: {
				orderBy: bookings.startTime,
			},
		},
	});
}
