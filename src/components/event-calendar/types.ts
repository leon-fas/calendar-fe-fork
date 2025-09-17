export type CalendarView = "month" | "week" | "day" | "agenda";

export interface CalendarEvent {
	id: string;
	title: string;
	description?: string;
	start: Date;
	end: Date;
	allDay?: boolean;
	color?: EventColor;
	label?: string;
	location?: string;
	roomName?: string; // Add room name for border styling on all-rooms view
	roomColor?: string; // Add room color for border styling on all-rooms view
}

export type EventColor =
	| "blue"
	| "orange"
	| "violet"
	| "rose"
	| "emerald"
	| "gray"
	| "yellow"
	| "cyan";
