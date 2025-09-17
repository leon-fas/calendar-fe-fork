"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RiLoginCircleLine } from "@remixicon/react";
import { CalendarColorToggle } from "@/components/calendar-color-toggle";
import { NavUser } from "@/components/nav-user";
import { RoomsFilter } from "@/components/rooms-filter";
import SidebarCalendar from "@/components/sidebar-calendar";
import { createClient } from "@/lib/supabase/client";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@/components/ui/sidebar";

interface User {
	email: string;
	avatar: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const [user, setUser] = useState<User | null>(null);

	// Get authenticated user from Supabase on client side
	useEffect(() => {
		const getUser = async () => {
			const supabase = createClient();
			const { data: authData } = await supabase.auth.getClaims();

			// Extract user information, fallback to null if not authenticated
			if (authData?.claims) {
				setUser({
					email: authData.claims.email || "Unknown",
					avatar: "", // No avatar for now, will use email initials
				});
			} else {
				setUser(null);
			}
		};

		getUser();
	}, []);

	// Check if we're on the all-rooms page
	const showRoomsFilter = pathname === '/';
	return (
		<Sidebar
			variant="inset"
			{...props}
			className="dark scheme-only-dark max-lg:p-3 lg:pe-1"
		>
			<SidebarHeader>
				<div className="flex justify-between items-center gap-2">
					<Link
						className="inline-flex"
						href="/"
					>
						<span className="sr-only">Logo</span>
						<svg
							role="img"
							aria-label="Logo"
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 32 32"
						>
							<path
								fill="#52525C"
								d="m10.661.863-2.339 1.04 5.251 11.794L1.521 9.072l-.918 2.39 12.053 4.627-11.794 5.25 1.041 2.34 11.794-5.252L9.071 30.48l2.39.917 4.626-12.052 5.251 11.793 2.339-1.04-5.251-11.795 12.052 4.627.917-2.39-12.052-4.627 11.794-5.25-1.041-2.34-11.794 5.252L22.928 1.52l-2.39-.917-4.626 12.052L10.662.863Z"
							/>
							<path
								fill="#F4F4F5"
								d="M17.28 0h-2.56v12.91L5.591 3.78l-1.81 1.81 9.129 9.129H0v2.56h12.91L3.78 26.409l1.81 1.81 9.129-9.129V32h2.56V19.09l9.128 9.129 1.81-1.81-9.128-9.129H32v-2.56H19.09l9.129-9.129-1.81-1.81-9.129 9.129V0Z"
							/>
						</svg>
					</Link>
					<SidebarTrigger className="text-muted-foreground/80 hover:text-foreground/80 hover:bg-transparent!" />
				</div>
			</SidebarHeader>
			<SidebarContent className="gap-0 mt-3 pt-3 border-t">
				<SidebarGroup className="px-1">
					<SidebarCalendar />
				</SidebarGroup>
				{showRoomsFilter && (
					<SidebarGroup className="px-1 mt-3 pt-4 border-t">
						<SidebarGroupLabel className="uppercase text-muted-foreground/65">
							Rooms
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<RoomsFilter />
						</SidebarGroupContent>
					</SidebarGroup>
				)}
				<SidebarGroup className="px-1 mt-3 pt-4 border-t">
					<SidebarGroupLabel className="uppercase text-muted-foreground/65">
						Calendars
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<CalendarColorToggle />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				{user ? (
					<NavUser user={user} />
				) : (
					<SidebarMenu>
						<SidebarMenuItem>
							<Link href="/auth/login">
								<SidebarMenuButton
									size="lg"
									className="w-full justify-start"
								>
									<RiLoginCircleLine className="size-5 text-muted-foreground/80" />
									<span className="text-sm font-medium">Login</span>
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
					</SidebarMenu>
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
