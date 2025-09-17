import { format } from "date-fns";
import { etiquettes } from "@/components/event-calendar/constants";
import type { EventColor } from "@/components/event-calendar/types";

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

/**
 * Get etiquette name from color
 */
function getEtiquetteNameFromColor(color?: EventColor): string | undefined {
  if (!color) return undefined;
  const etiquette = etiquettes.find((e) => e.color === color);
  return etiquette?.name;
}

/**
 * Generate a WhatsApp URL with a pre-formatted booking request message
 */
export function generateWhatsAppBookingUrl(request: BookingRequest): string {
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE;

  if (!adminPhone) {
    throw new Error("NEXT_PUBLIC_ADMIN_PHONE environment variable is not set");
  }

  // Format the date
  const formattedDate = format(request.date, "EEEE, MMMM do, yyyy");

  // Format time to be more readable
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(2000, 0, 1, hours, minutes);
    return format(date, "h:mm a");
  };

  const startTimeFormatted = formatTime(request.startTime);
  const endTimeFormatted = formatTime(request.endTime);

  // Get etiquette name from color
  const etiquetteName = getEtiquetteNameFromColor(request.color);

  // Create the message
  let message = `🏢 *Meeting Room Booking Request*\n\n`;
  message += `📍 *Room:* ${request.roomName}\n`;
  message += `📋 *Event:* ${request.title}\n`;
  message += `📅 *Date:* ${formattedDate}\n`;

  if (request.allDay) {
    message += `🕐 *Time:* All Day\n\n`;
  } else {
    message += `🕐 *Time:* ${startTimeFormatted} - ${endTimeFormatted}\n\n`;
  }

  if (request.description && request.description.trim()) {
    message += `📝 *Description:* ${request.description}\n`;
  }

  if (etiquetteName) {
    message += `📊 *Calendar:* ${etiquetteName}\n`;
  }

  if (request.purpose && request.purpose.trim()) {
    message += `💬 *Additional Notes:* ${request.purpose}\n`;
  }

  message += `\nPlease confirm the booking availability. Thank you! 🙏`;

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);

  // Clean the phone number (remove spaces, hyphens, parentheses)
  const cleanPhone = adminPhone.replace(/[\s\-\(\)]/g, "");

  // Generate WhatsApp URL
  // Use wa.me format which works on both mobile and desktop
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

