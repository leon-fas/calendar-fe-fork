"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

interface RoomHeaderProps {
  roomName: string;
  description?: string | null;
}

export function RoomHeader({ roomName, description }: RoomHeaderProps) {
  const { open } = useSidebar();

  return (
    <div className="flex flex-col sm:flex-row gap-0 sm:gap-2 sm:items-center">
      <div className="flex items-center gap-4">
        <SidebarTrigger
          data-state={open ? "invisible" : "visible"}
          className="peer size-7 text-muted-foreground/80 hover:text-foreground/80 hover:bg-transparent! sm:-ms-1.5 lg:data-[state=invisible]:opacity-0 lg:data-[state=invisible]:pointer-events-none transition-opacity ease-in-out duration-200"
          isOutsideSidebar
        />
        <h1 className="text-2xl font-bold lg:peer-data-[state=invisible]:-translate-x-7.5 transition-transform ease-in-out duration-300">
          {roomName}
        </h1>
      </div>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
