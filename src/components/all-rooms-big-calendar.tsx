"use client";

import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCalendarContext } from "@/components/event-calendar/calendar-context";
import { fetchAllRoomsBookings } from "@/lib/api/bookings";
import { CalendarEvent, EventCalendar } from "./event-calendar";

interface AllRoomsBigCalendarProps {
  readOnly?: boolean;
}

export default function AllRoomsBigCalendar({
  readOnly = false,
}: AllRoomsBigCalendarProps = {}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isColorVisible, isRoomVisible, currentDate } = useCalendarContext();

  // Fetch events when currentDate changes
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Calculate date range - get events for current month + some buffer
        const startDate = startOfMonth(subMonths(currentDate, 1));
        const endDate = endOfMonth(addMonths(currentDate, 2));

        const calendarEvents = await fetchAllRoomsBookings(startDate, endDate);
        setEvents(calendarEvents);
      } catch (err) {
        console.error("Failed to fetch all rooms bookings:", err);
        setError("Failed to load room bookings");
        setEvents([]); // Fallback to empty events
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate]);

  // Filter events based on visibility settings
  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      const colorVisible = isColorVisible(event.color);
      const roomVisible = isRoomVisible(event.location);
      return colorVisible && roomVisible;
    });
  }, [events, isColorVisible, isRoomVisible]);

  const handleEventAdd = async (event: CalendarEvent) => {
    if (readOnly) return;

    toast.error(
      "Cannot create bookings from all-rooms view. Please select a specific room.",
    );
  };

  const handleEventUpdate = async (updatedEvent: CalendarEvent) => {
    if (readOnly) return;

    toast.error(
      "Cannot edit bookings from all-rooms view. Please select a specific room.",
    );
  };

  const handleEventDelete = async (eventId: string) => {
    if (readOnly) return;

    toast.error(
      "Cannot delete bookings from all-rooms view. Please select a specific room.",
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-muted-foreground">
          Loading calendars...
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg text-destructive mb-2">
            Error loading calendars
          </div>
          <div className="text-sm text-muted-foreground">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <EventCalendar
      events={visibleEvents}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      initialView="day"
      readOnly={true} // Always read-only for all-rooms view
      showRoomNames={true}
    />
  );
}
