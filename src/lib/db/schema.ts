import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	color: text("color").notNull().$type<"blue" | "orange" | "violet" | "rose" | "emerald" | "gray" | "yellow" | "cyan">().default("blue"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	color: text("color"),
	location: text("location"),
	startTime: timestamp("start_time", { withTimezone: true }).notNull(),
	endTime: timestamp("end_time", { withTimezone: true }).notNull(),
	roomId: uuid("room_id")
		.notNull()
		.references(() => rooms.id, { onDelete: "cascade" }),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const roomsRelations = relations(rooms, ({ many }) => ({
	bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
	room: one(rooms, {
		fields: [bookings.roomId],
		references: [rooms.id],
	}),
}));

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
