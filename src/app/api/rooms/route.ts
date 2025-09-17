import { NextResponse } from "next/server";
import { getAllRoomsWithSlugs } from "@/lib/rooms";

export async function GET() {
	try {
		const rooms = await getAllRoomsWithSlugs();
		return NextResponse.json({ rooms });
	} catch (error) {
		console.error("Failed to fetch rooms:", error);
		return NextResponse.json(
			{ error: "Failed to fetch rooms" },
			{ status: 500 }
		);
	}
}