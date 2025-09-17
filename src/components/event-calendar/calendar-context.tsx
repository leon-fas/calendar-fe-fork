"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { etiquettes } from "./constants";

interface CalendarContextType {
  // Date management
  currentDate: Date;
  setCurrentDate: (date: Date) => void;

  // Etiquette visibility management
  visibleColors: string[];
  toggleColorVisibility: (color: string) => void;
  isColorVisible: (color: string | undefined) => boolean;

  // Room visibility management
  visibleRooms: string[];
  toggleRoomVisibility: (roomName: string) => void;
  isRoomVisible: (roomName: string | undefined) => boolean;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider",
    );
  }
  return context;
}

interface CalendarProviderProps {
  children: ReactNode;
}

export function CalendarProvider({ children }: CalendarProviderProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Initialize visibleColors based on the isActive property in etiquettes
  const [visibleColors, setVisibleColors] = useState<string[]>(() => {
    // Filter etiquettes to get only those that are active
    return etiquettes
      .filter((etiquette) => etiquette.isActive)
      .map((etiquette) => etiquette.color);
  });

  // Initialize visibleRooms as empty array (all rooms hidden by default)
  const [visibleRooms, setVisibleRooms] = useState<string[]>([]);

  // Toggle visibility of a color
  const toggleColorVisibility = (color: string) => {
    setVisibleColors((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color);
      } else {
        return [...prev, color];
      }
    });
  };

  // Check if a color is visible
  const isColorVisible = (color: string | undefined) => {
    if (!color) return true; // Events without a color are always visible
    return visibleColors.includes(color);
  };

  // Toggle visibility of a room
  const toggleRoomVisibility = (roomName: string) => {
    setVisibleRooms((prev) => {
      if (prev.includes(roomName)) {
        return prev.filter((r) => r !== roomName);
      } else {
        return [...prev, roomName];
      }
    });
  };

  // Check if a room is visible
  const isRoomVisible = (roomName: string | undefined) => {
    if (!roomName) return true; // Events without a room are always visible
    return visibleRooms.length === 0 || visibleRooms.includes(roomName);
  };

  const value = {
    currentDate,
    setCurrentDate,
    visibleColors,
    toggleColorVisibility,
    isColorVisible,
    visibleRooms,
    toggleRoomVisibility,
    isRoomVisible,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}
