import { Metadata } from "next";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { WhatsAppBookingButton } from "@/components/whatsapp-booking-button";

export function generateMetadata(): Metadata {
  return {
    title: "All Meeting Room Schedules",
    description: "View bookings across all meeting rooms",
  };
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-2 pt-0">{children}</div>
        </SidebarInset>
        <WhatsAppBookingButton />
      </SidebarProvider>
    </div>
  );
}
