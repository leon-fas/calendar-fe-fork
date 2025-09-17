import { eq } from "drizzle-orm";
import { db, type Room } from "../db";
import { createRoom, getAllRooms, updateRoom } from "../db/queries/rooms";
import { rooms } from "../db/schema";
import { getRoomConfigBySlug, ROOMS_CONFIG, type RoomConfig } from "./config";

export * from "./config";

// Extended room type that includes slug
export interface RoomWithSlug extends Room {
	slug: string;
}

/**
 * Get room data by slug, including database ID
 */
export async function getRoomBySlug(slug: string): Promise<RoomWithSlug | null> {
	const config = getRoomConfigBySlug(slug);
	if (!config) return null;

	try {
		const dbRooms = await db.select().from(rooms).where(eq(rooms.name, config.name));
		const room = dbRooms[0];

		if (!room) return null;

		return {
			...room,
			slug: config.slug,
		};
	} catch (error) {
		console.error(`Error getting room by slug ${slug}:`, error);
		return null;
	}
}

/**
 * Get all rooms with their slugs
 */
export async function getAllRoomsWithSlugs(): Promise<RoomWithSlug[]> {
	try {
		const dbRooms = await getAllRooms();

		return dbRooms.map((room) => {
			const config = ROOMS_CONFIG.find((c) => c.name === room.name);
			return {
				...room,
				slug: config?.slug || room.name.toLowerCase().replace(/\s+/g, "-"),
			};
		});
	} catch (error) {
		console.error("Error getting all rooms with slugs:", error);
		return [];
	}
}

/**
 * Initialize database with static rooms if they don't exist
 */
export async function initializeRooms(): Promise<void> {
	try {
		const existingRooms = await getAllRooms();
		const existingNames = existingRooms.map((room) => room.name);

		for (const config of ROOMS_CONFIG) {
			if (!existingNames.includes(config.name)) {
				await createRoom({
					name: config.name,
					description: config.description,
					color: config.color,
				});
				console.log(`Created room: ${config.name} with color: ${config.color}`);
			} else {
				// Update existing rooms to add color if they don't have one
				const existingRoom = existingRooms.find((room) => room.name === config.name);
				if (existingRoom && !existingRoom.color) {
					await updateRoom(existingRoom.id, { color: config.color });
					console.log(`Updated room ${config.name} with color: ${config.color}`);
				}
			}
		}
	} catch (error) {
		console.error("Error initializing rooms:", error);
	}
}

/**
 * Validate if a slug is valid
 */
export function isValidRoomSlug(slug: string): boolean {
	return ROOMS_CONFIG.some((room) => room.slug === slug);
}
