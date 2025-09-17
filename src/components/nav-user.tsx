"use client";

import {
  RiExpandUpDownLine,
  RiLogoutCircleLine,
} from "@remixicon/react";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();

  // Generate initials from email
  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    }
    return email.charAt(0).toUpperCase();
  };

  // Logout functionality
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [&>svg]:size-5"
            >
              <Avatar className="size-8">
                <AvatarImage src={user.avatar} alt={user.email} />
                <AvatarFallback className="rounded-lg">{getInitials(user.email)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.email}</span>
              </div>
              <RiExpandUpDownLine className="ml-auto size-5 text-muted-foreground/80" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) dark bg-sidebar"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="gap-3 focus:bg-sidebar-accent cursor-pointer"
                onClick={handleLogout}
              >
                <RiLogoutCircleLine
                  size={20}
                  className="size-5 text-muted-foreground/80"
                />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
