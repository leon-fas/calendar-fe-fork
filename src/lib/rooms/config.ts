import type { NewRoom } from "../db/schema";
import type { EventColor } from "@/components/event-calendar/types";

export interface RoomConfig extends Omit<NewRoom, 'id' | 'createdAt'> {
  slug: string;
  name: string;
  description?: string;
  color: EventColor;
}

export const ROOMS_CONFIG: RoomConfig[] = [
  {
    slug: "market",
    name: "Market",
    description: "Main conference room for team meetings and presentations",
    color: "blue"
  },
  {
    slug: "small-studio",
    name: "Small Studio",
    description: "Intimate meeting space perfect for small team discussions",
    color: "orange"
  },
  {
    slug: "phinisi",
    name: "Phinisi",
    description: "Spacious meeting room for larger gatherings and workshops",
    color: "violet"
  }
];

export const ROOM_SLUGS = ROOMS_CONFIG.map(room => room.slug);

export function getRoomConfigBySlug(slug: string): RoomConfig | undefined {
  return ROOMS_CONFIG.find(room => room.slug === slug);
}

export function getSlugByRoomName(name: string): string | undefined {
  return ROOMS_CONFIG.find(room => room.name === name)?.slug;
}