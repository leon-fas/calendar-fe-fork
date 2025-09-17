import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CalendarEvent } from "@/components/event-calendar/types";
import {
	calendarEventToBookingUpdate,
	checkBookingConflict,
	deleteBooking,
	updateBooking,
	getBookingById,
} from "@/lib/bookings";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		// Get authenticated user from Supabase
		const supabase = await createClient();
		const { data: authData, error: authError } = await supabase.auth.getClaims();

		if (authError || !authData?.claims) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		const userId = authData.claims.sub;
		if (!userId) {
			return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
		}

		const { id } = await params;

		// Verify user owns this booking
		const existingBooking = await getBookingById(id);
		if (!existingBooking) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 });
		}

		if (existingBooking.userId !== userId) {
			return NextResponse.json({ error: "Not authorized to modify this booking" }, { status: 403 });
		}

		const body = await request.json();
		const { event, roomId } = body as { event: any; roomId: string };

		if (!event || !roomId) {
			return NextResponse.json({ error: "Missing event or roomId" }, { status: 400 });
		}

		// Convert serialized dates back to Date objects
		const eventWithDates: CalendarEvent = {
			...event,
			start: new Date(event.start),
			end: new Date(event.end),
		};

		// Note: Allowing overlapping bookings since UI handles stacking

		const updateData = calendarEventToBookingUpdate(eventWithDates);
		const updatedBooking = await updateBooking(id, updateData);

		if (!updatedBooking) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			booking: updatedBooking,
		});
	} catch (error) {
		console.error("Failed to update booking:", error);
		return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
	}
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		// Get authenticated user from Supabase
		const supabase = await createClient();
		const { data: authData, error: authError } = await supabase.auth.getClaims();

		if (authError || !authData?.claims) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		const userId = authData.claims.sub;
		if (!userId) {
			return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
		}

		const { id } = await params;

		// Verify user owns this booking
		const existingBooking = await getBookingById(id);
		if (!existingBooking) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 });
		}

		if (existingBooking.userId !== userId) {
			return NextResponse.json({ error: "Not authorized to delete this booking" }, { status: 403 });
		}

		const success = await deleteBooking(id);

		if (!success) {
			return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Failed to delete booking:", error);
		return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
	}
}
