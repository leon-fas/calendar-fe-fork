import Link from "next/link";
import AllRoomsBigCalendar from "@/components/all-rooms-big-calendar";
import { QRCodePopover } from "@/components/qr-code-popover";
import { RoomHeader } from "@/components/room-header";
import { Button } from "@/components/ui/button";
import { getAllRoomsWithSlugs } from "@/lib/rooms";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  // Get all rooms for navigation
  const allRooms = await getAllRoomsWithSlugs();

  // Check authentication status
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  const isAuthenticated = !!authData?.claims?.sub;

  return (
    <>
      <div className="flex flex-col gap-4 p-4 border-b lg:flex-row lg:items-center lg:justify-between">
        <RoomHeader
          roomName="All Rooms"
          description="View bookings across all meeting rooms"
        />

        <div className="flex gap-2 flex-wrap">
          {allRooms.map((room) => (
            <Button
              key={room.id}
              variant="outline"
              size="sm"
              asChild
              className="shrink-0"
            >
              <Link href={`/rooms/${room.slug}`}>{room.name}</Link>
            </Button>
          ))}
          <QRCodePopover roomName="All Rooms" />
        </div>
      </div>

      <AllRoomsBigCalendar readOnly={!isAuthenticated} />
    </>
  );
}
