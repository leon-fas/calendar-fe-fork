import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoomConfigBySlug, ROOM_SLUGS } from "@/lib/rooms";

interface RoomLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ROOM_SLUGS.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const roomConfig = getRoomConfigBySlug(slug);

  if (!roomConfig) {
    notFound();
  }

  return {
    title: `${roomConfig.name} - Meeting Room`,
    description: roomConfig.description || `View and manage bookings for ${roomConfig.name}`,
  };
}

export default function RoomLayout({ children, params }: RoomLayoutProps) {
  return <>{children}</>;
}