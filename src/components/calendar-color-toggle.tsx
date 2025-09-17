"use client";

import { RiCheckLine } from "@remixicon/react";
import { useCalendarContext } from "@/components/event-calendar/calendar-context";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { etiquettes } from "./event-calendar";

export function CalendarColorToggle() {
  const { isColorVisible, toggleColorVisibility } = useCalendarContext();

  return (
    <SidebarMenu>
      {etiquettes.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            asChild
            className="relative rounded-md [&>svg]:size-auto justify-between has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px]"
          >
            <span>
              <span className="font-medium flex items-center justify-between gap-3">
                <Checkbox
                  id={item.id}
                  className="sr-only peer"
                  checked={isColorVisible(item.color)}
                  onCheckedChange={() => toggleColorVisibility(item.color)}
                />
                <RiCheckLine
                  className="peer-not-data-[state=checked]:invisible"
                  size={16}
                  aria-hidden="true"
                />
                <label
                  htmlFor={item.id}
                  className="peer-not-data-[state=checked]:line-through peer-not-data-[state=checked]:text-muted-foreground/65 after:absolute after:inset-0"
                >
                  {item.name}
                </label>
              </span>
              <span
                className="size-1.5 rounded-full bg-(--event-color)"
                style={
                  {
                    "--event-color": `var(--color-${item.color}-400)`,
                  } as React.CSSProperties
                }
              ></span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
