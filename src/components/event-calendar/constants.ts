import { EventColor } from "./types";

export const EventHeight = 24;

// Vertical gap between events in pixels - controls spacing in month view
export const EventGap = 4;

// Height of hour cells in week and day views - controls the scale of time display
export const WeekCellsHeight = 72;

// Number of days to show in the agenda view
export const AgendaDaysToShow = 30;

// Start and end hours for the week and day views
export const StartHour = 7; // Start at 7 AM
export const EndHour = 23; // End at 8 PM

// Default start and end times
export const DefaultStartHour = 13; // 1 PM
export const DefaultEndHour = 14; // 2 PM

// Etiquettes data for calendar filtering
export const etiquettes = [
	{
		id: "allegro",
		name: "Allegro",
		color: "orange" as EventColor,
		isActive: true,
	},
	{
		id: "fanfare",
		name: "Fanfare",
		color: "violet" as EventColor,
		isActive: true,
	},
	{
		id: "finance",
		name: "Finance",
		color: "cyan" as EventColor,
		isActive: true,
	},
	{
		id: "ga",
		name: "GA",
		color: "yellow" as EventColor,
		isActive: true,
	},
	{
		id: "general",
		name: "General",
		color: "gray" as EventColor,
		isActive: true,
	},
	{
		id: "hr",
		name: "HR",
		color: "rose" as EventColor,
		isActive: true,
	},
	{
		id: "koda",
		name: "KODA",
		color: "blue" as EventColor,
		isActive: true,
	},
	{
		id: "wolfgang",
		name: "Wolfgang",
		color: "emerald" as EventColor,
		isActive: true,
	},
];
