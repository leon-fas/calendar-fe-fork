"use client";

import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QRCodeGenerator } from "./qr-code-generator";

interface QRCodePopoverProps {
  roomSlug?: string;
  roomName?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function QRCodePopover({
  roomSlug,
  roomName,
  variant = "outline",
  size = "sm",
  className,
}: QRCodePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`shrink-0 ${className} cursor-pointer`}
          title={`Generate QR code for ${roomName || "All Rooms"}`}
        >
          <QrCode className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="end" sideOffset={8}>
        <QRCodeGenerator roomSlug={roomSlug} roomName={roomName} />
      </PopoverContent>
    </Popover>
  );
}
