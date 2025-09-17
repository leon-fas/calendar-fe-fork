"use client";

import { RiCalendarLine, RiWhatsappLine } from "@remixicon/react";
import { format, isBefore } from "date-fns";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  DefaultEndHour,
  DefaultStartHour,
  EndHour,
  StartHour,
} from "@/components/event-calendar/constants";
import type { EventColor } from "@/components/event-calendar/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { generateWhatsAppBookingUrl } from "@/lib/whatsapp";

interface WhatsAppBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRoom?: string;
}

interface Room {
  id: string;
  name: string;
  description?: string;
  color: EventColor;
  slug: string;
}

interface BookingRequest {
  roomId: string;
  roomName: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  allDay?: boolean;
  description?: string;
  color?: EventColor;
  purpose?: string;
}

export function WhatsAppBookingModal({
  isOpen,
  onClose,
  defaultRoom,
}: WhatsAppBookingModalProps) {
  // Form state - matching event dialog structure
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState(`${DefaultStartHour}:00`);
  const [endTime, setEndTime] = useState(`${DefaultEndHour}:00`);
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState<EventColor>("blue");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Room state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedRoomName, setSelectedRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  // Get current pathname to detect room context
  const pathname = usePathname();

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/rooms");
        const data = await response.json();
        if (data.rooms) {
          setRooms(data.rooms);
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
        setError("Failed to load rooms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchRooms();
    }
  }, [isOpen]);

  // Handle room auto-selection and form reset
  useEffect(() => {
    if (isOpen) {
      resetForm();

      // Auto-select room if on a room page or defaultRoom is provided
      if (defaultRoom) {
        const room = rooms.find(
          (r) =>
            r.slug === defaultRoom ||
            r.id === defaultRoom ||
            r.name === defaultRoom,
        );
        if (room) {
          setSelectedRoomId(room.id);
          setSelectedRoomName(room.name);
        }
      } else {
        // Try to detect room from pathname (e.g., /rooms/market)
        const pathParts = pathname.split("/");
        if (pathParts[1] === "rooms" && pathParts[2]) {
          const roomSlug = pathParts[2];
          const room = rooms.find((r) => r.slug === roomSlug);
          if (room) {
            setSelectedRoomId(room.id);
            setSelectedRoomName(room.name);
          }
        }
      }
    }
  }, [isOpen, defaultRoom, pathname, rooms]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    setStartTime(`${DefaultStartHour}:00`);
    setEndTime(`${DefaultEndHour}:00`);
    setAllDay(false);
    setColor("blue");
    setPurpose("");
    setSelectedRoomId("");
    setSelectedRoomName("");
    setError(null);
  };

  // Generate time options
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const value = `${formattedHour}:${formattedMinute}`;
        const date = new Date(2000, 0, 1, hour, minute);
        const label = format(date, "h:mm a");
        options.push({ value, label });
      }
    }
    return options;
  }, []);

  // Color options matching event dialog
  const colorOptions: Array<{
    value: EventColor;
    label: string;
    bgClass: string;
    borderClass: string;
  }> = [
    {
      value: "blue",
      label: "Blue",
      bgClass: "bg-blue-400 data-[state=checked]:bg-blue-400",
      borderClass: "border-blue-400 data-[state=checked]:border-blue-400",
    },
    {
      value: "violet",
      label: "Violet",
      bgClass: "bg-violet-400 data-[state=checked]:bg-violet-400",
      borderClass: "border-violet-400 data-[state=checked]:border-violet-400",
    },
    {
      value: "rose",
      label: "Rose",
      bgClass: "bg-rose-400 data-[state=checked]:bg-rose-400",
      borderClass: "border-rose-400 data-[state=checked]:border-rose-400",
    },
    {
      value: "emerald",
      label: "Emerald",
      bgClass: "bg-emerald-400 data-[state=checked]:bg-emerald-400",
      borderClass: "border-emerald-400 data-[state=checked]:border-emerald-400",
    },
    {
      value: "orange",
      label: "Orange",
      bgClass: "bg-orange-400 data-[state=checked]:bg-orange-400",
      borderClass: "border-orange-400 data-[state=checked]:border-orange-400",
    },
    {
      value: "gray",
      label: "Gray",
      bgClass: "bg-gray-400 data-[state=checked]:bg-gray-400",
      borderClass: "border-gray-400 data-[state=checked]:border-gray-400",
    },
    {
      value: "yellow",
      label: "Yellow",
      bgClass: "bg-yellow-400 data-[state=checked]:bg-yellow-400",
      borderClass: "border-yellow-400 data-[state=checked]:border-yellow-400",
    },
    {
      value: "cyan",
      label: "Cyan",
      bgClass: "bg-cyan-400 data-[state=checked]:bg-cyan-400",
      borderClass: "border-cyan-400 data-[state=checked]:border-cyan-400",
    },
  ];

  const validateForm = (): boolean => {
    // Basic validation
    if (!selectedRoomId || !title.trim()) {
      setError("Please fill in all required fields");
      return false;
    }

    if (!allDay) {
      // Time validation
      const [startHours = 0, startMinutes = 0] = startTime
        .split(":")
        .map(Number);
      const [endHours = 0, endMinutes = 0] = endTime.split(":").map(Number);

      if (
        startHours < StartHour ||
        startHours > EndHour ||
        endHours < StartHour ||
        endHours > EndHour
      ) {
        setError(`Time must be between ${StartHour}:00 and ${EndHour}:00`);
        return false;
      }

      // Create date objects for time comparison
      const start = new Date(startDate);
      start.setHours(startHours, startMinutes, 0);
      const end = new Date(endDate);
      end.setHours(endHours, endMinutes, 0);

      if (isBefore(end, start)) {
        setError("End time cannot be before start time");
        return false;
      }
    }

    // Check if end date is not before start date
    if (isBefore(endDate, startDate)) {
      setError("End date cannot be before start date");
      return false;
    }

    // Check if the selected date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isBefore(startDate, today)) {
      setError("Cannot book for past dates");
      return false;
    }

    return true;
  };

  const handleSendWhatsApp = () => {
    if (!validateForm()) {
      return;
    }

    const bookingRequest: BookingRequest = {
      roomId: selectedRoomId,
      roomName: selectedRoomName,
      title: title.trim(),
      date: startDate,
      startTime,
      endTime,
      allDay,
      description: description.trim() || undefined,
      color,
      purpose: purpose.trim() || undefined,
    };

    const whatsAppUrl = generateWhatsAppBookingUrl(bookingRequest);

    // Open WhatsApp in new tab
    window.open(whatsAppUrl, "_blank");

    // Close modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RiWhatsappLine size={20} className="text-[#25D366]" />
            Request Booking via WhatsApp
          </DialogTitle>
          <DialogDescription>
            Fill out the booking details and we'll send your request to the
            admin via WhatsApp
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-4 py-4">
          {/* Title - Required */}
          <div className="*:not-first:mt-1.5">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting title"
            />
          </div>

          {/* Description */}
          <div className="*:not-first:mt-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Meeting description..."
              rows={3}
            />
          </div>

          {/* Room Selection */}
          <div className="*:not-first:mt-1.5">
            <Label htmlFor="room">Room *</Label>
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading rooms...
              </div>
            ) : (
              <Select
                value={selectedRoomId}
                onValueChange={(value) => {
                  setSelectedRoomId(value);
                  const room = rooms.find((r) => r.id === value);
                  if (room) {
                    setSelectedRoomName(room.name);
                  }
                  setError(null);
                }}
              >
                <SelectTrigger id="room">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                      {room.description && (
                        <span className="text-xs text-muted-foreground ml-2">
                          - {room.description}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Date Selection */}
          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label htmlFor="start-date">Start Date *</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn(
                      "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "truncate",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </span>
                    <RiCalendarLine
                      size={16}
                      className="text-muted-foreground/80 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    defaultMonth={startDate}
                    disabled={{ before: new Date() }}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                        // If end date is before the new start date, update it
                        if (isBefore(endDate, date)) {
                          setEndDate(date);
                        }
                        setError(null);
                        setStartDateOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {!allDay && (
              <div className="min-w-28 *:not-first:mt-1.5">
                <Label htmlFor="start-time">Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id="start-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* End Date/Time */}
          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label htmlFor="end-date">End Date *</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant="outline"
                    className={cn(
                      "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "truncate",
                        !endDate && "text-muted-foreground",
                      )}
                    >
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </span>
                    <RiCalendarLine
                      size={16}
                      className="text-muted-foreground/80 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    defaultMonth={endDate}
                    disabled={{ before: startDate }}
                    onSelect={(date) => {
                      if (date) {
                        setEndDate(date);
                        setError(null);
                        setEndDateOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {!allDay && (
              <div className="min-w-28 *:not-first:mt-1.5">
                <Label htmlFor="end-time">End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger id="end-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* All Day Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="all-day"
              checked={allDay}
              onCheckedChange={(checked) => setAllDay(checked === true)}
            />
            <Label htmlFor="all-day">All day</Label>
          </div>

          {/* Color Selection */}
          <fieldset className="space-y-4">
            <legend className="text-foreground text-sm leading-none font-medium">
              Color
            </legend>
            <RadioGroup
              className="flex gap-1.5"
              defaultValue={colorOptions[0]?.value}
              value={color}
              onValueChange={(value: EventColor) => setColor(value)}
            >
              {colorOptions.map((colorOption) => (
                <RadioGroupItem
                  key={colorOption.value}
                  id={`color-${colorOption.value}`}
                  value={colorOption.value}
                  aria-label={colorOption.label}
                  className={cn(
                    "size-6 shadow-none",
                    colorOption.bgClass,
                    colorOption.borderClass,
                  )}
                />
              ))}
            </RadioGroup>
          </fieldset>

          {/* Additional Notes */}
          <div className="*:not-first:mt-1.5">
            <Label htmlFor="purpose">Additional Notes</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Any additional information for the booking..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSendWhatsApp}
            className="bg-[#25D366] hover:bg-[#20B658]"
          >
            <RiWhatsappLine size={16} className="mr-2" />
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
