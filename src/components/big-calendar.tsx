"use client";

import {
  addDays,
  addMonths,
  endOfMonth,
  getDay,
  setHours,
  setMinutes,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCalendarContext } from "@/components/event-calendar/calendar-context";
import {
  createBookingAPI,
  deleteBookingAPI,
  fetchBookings,
  updateBookingAPI,
} from "@/lib/api/bookings";
import { CalendarEvent, EventCalendar } from "./event-calendar";

interface BigCalendarProps {
  roomId?: string;
  roomName?: string;
  readOnly?: boolean;
}

export default function Component({
  roomId,
  roomName,
  readOnly = false,
}: BigCalendarProps = {}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isColorVisible, isRoomVisible, currentDate } = useCalendarContext();

  // Fetch events when roomId or currentDate changes
  useEffect(() => {
    if (!roomId) {
      // If no roomId, show sample events for now (or could show all rooms' events)
      // setEvents(sampleEvents);
      setIsLoading(false);
      return;
    }

    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Calculate date range - get events for current month + some buffer
        const startDate = startOfMonth(subMonths(currentDate, 1));
        const endDate = endOfMonth(addMonths(currentDate, 2));

        const calendarEvents = await fetchBookings(roomId, startDate, endDate);
        setEvents(calendarEvents);
      } catch (err) {
        console.error("Failed to fetch room bookings:", err);
        setError("Failed to load room bookings");
        setEvents([]); // Fallback to empty events
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [roomId, currentDate]);

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

    if (!roomId) {
      toast.error("Room not specified");
      return;
    }

    // Validate event data
    if (!event || !event.title || !event.start || !event.end) {
      toast.error("Event is missing required information");
      return;
    }

    try {
      // Automatically set the room name as the location
      const eventWithLocation = {
        ...event,
        location: roomName || `Room ${roomId}`,
      };

      const result = await createBookingAPI(eventWithLocation, roomId);

      // Add the new event to local state
      const newCalendarEvent = {
        ...eventWithLocation,
        id: result.booking.id,
      };
      setEvents([...events, newCalendarEvent]);

      toast.success("Booking created successfully");
    } catch (error) {
      console.error("Failed to create booking:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create booking",
      );
    }
  };

  const handleEventUpdate = async (updatedEvent: CalendarEvent) => {
    if (readOnly) return;

    if (!roomId) {
      toast.error("Room not specified");
      return;
    }

    try {
      await updateBookingAPI(updatedEvent, roomId);

      // Update local state
      setEvents(
        events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        ),
      );

      toast.success("Booking updated successfully");
    } catch (error) {
      console.error("Failed to update booking:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update booking",
      );
    }
  };

  const handleEventDelete = async (eventId: string) => {
    if (readOnly) return;

    try {
      await deleteBookingAPI(eventId);

      // Remove from local state
      setEvents(events.filter((event) => event.id !== eventId));

      toast.success("Booking deleted successfully");
    } catch (error) {
      console.error("Failed to delete booking:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete booking",
      );
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-muted-foreground">Loading calendar...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg text-destructive mb-2">
            Error loading calendar
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
      readOnly={readOnly}
      defaultLocation={roomName}
    />
  );
}
