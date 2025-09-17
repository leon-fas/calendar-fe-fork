"use client";

import { RiWhatsappLine } from "@remixicon/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WhatsAppBookingModal } from "./whatsapp-booking-modal";

interface WhatsAppBookingButtonProps {
  className?: string;
  defaultRoom?: string;
}

export function WhatsAppBookingButton({
  className,
  defaultRoom,
}: WhatsAppBookingButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  // Detect current room from pathname if not explicitly provided
  const currentRoom =
    defaultRoom ||
    (() => {
      const pathParts = pathname.split("/");
      if (pathParts[1] === "rooms" && pathParts[2]) {
        return pathParts[2]; // This will be the room slug
      }
      return undefined;
    })();

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-[#25D366] hover:bg-[#20B658] text-white border-0 cursor-pointer",
          "hover:scale-105 active:scale-95",
          className,
        )}
        aria-label="Request booking via WhatsApp"
      >
        <RiWhatsappLine className="size-9" aria-hidden="true" />
      </Button>

      <WhatsAppBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultRoom={currentRoom}
      />
    </>
  );
}
