import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BigCalendar from "@/components/big-calendar";
import { QRCodePopover } from "@/components/qr-code-popover";
import { RoomHeader } from "@/components/room-header";
import { Button } from "@/components/ui/button";
import {
  getAllRoomsWithSlugs,
  getRoomBySlug,
  isValidRoomSlug,
} from "@/lib/rooms";
import { createClient } from "@/lib/supabase/server";

interface RoomPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { slug } = await params;

  // Validate slug
  if (!isValidRoomSlug(slug)) {
    notFound();
  }

  // Get room data
  const room = await getRoomBySlug(slug);
  if (!room) {
    notFound();
  }

  // Get all rooms for navigation
  const allRooms = await getAllRoomsWithSlugs();

  // Check authentication status
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  const isAuthenticated = !!authData?.claims?.sub;

  return (
    <>
      <div className="flex flex-col gap-4 p-4 border-b lg:flex-row lg:items-center lg:justify-between">
        <RoomHeader roomName={room.name} description={room.description} />

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href="/">
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">All Rooms</span>
              <span className="sm:hidden">Home</span>
            </Link>
          </Button>
          {allRooms
            .filter((roomItem) => roomItem.slug !== slug)
            .map((roomItem) => (
              <Button
                key={roomItem.id}
                variant="outline"
                size="sm"
                asChild
                className="shrink-0"
              >
                <Link href={`/rooms/${roomItem.slug}`}>{roomItem.name}</Link>
              </Button>
            ))}
          <QRCodePopover roomSlug={room.slug} roomName={room.name} />
        </div>
      </div>

      <BigCalendar
        roomId={room.id}
        roomName={room.name}
        readOnly={!isAuthenticated}
      />
    </>
  );
}
