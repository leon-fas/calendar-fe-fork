"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { RoomWithSlug } from "@/lib/rooms";
import { RiCheckLine } from "@remixicon/react";
import { useCalendarContext } from "@/components/event-calendar/calendar-context";

export function RoomsFilter() {
  const { isRoomVisible, toggleRoomVisibility } = useCalendarContext();
  const [rooms, setRooms] = useState<RoomWithSlug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/rooms');
        if (!response.ok) {
          throw new Error(`Failed to fetch rooms: ${response.status}`);
        }
        const data = await response.json();
        setRooms(data.rooms);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError(err instanceof Error ? err.message : 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'orange':
        return 'bg-orange-500';
      case 'violet':
        return 'bg-violet-500';
      case 'rose':
        return 'bg-rose-500';
      case 'emerald':
        return 'bg-emerald-500';
      case 'gray':
        return 'bg-gray-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'cyan':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton disabled>
            <span className="text-sm text-muted-foreground">Loading rooms...</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (error) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton disabled>
            <span className="text-sm text-destructive">Failed to load rooms</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      {rooms.map((room) => (
        <SidebarMenuItem key={room.slug}>
          <SidebarMenuButton
            asChild
            className="relative rounded-md [&>svg]:size-auto justify-between has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px]"
          >
            <span>
              <span className="font-medium flex items-center justify-between gap-3">
                <Checkbox
                  id={room.slug}
                  className="sr-only peer"
                  checked={isRoomVisible(room.name)}
                  onCheckedChange={() => toggleRoomVisibility(room.name)}
                />
                <RiCheckLine
                  className="peer-not-data-[state=checked]:invisible"
                  size={16}
                  aria-hidden="true"
                />
                <label
                  htmlFor={room.slug}
                  className="peer-not-data-[state=checked]:line-through peer-not-data-[state=checked]:text-muted-foreground/65 after:absolute after:inset-0"
                >
                  {room.name}
                </label>
              </span>
              <span
                className={`size-1.5 rounded-full ${getColorClasses(room.color)}`}
              ></span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}