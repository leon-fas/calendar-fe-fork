"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { CalendarView } from "@/components/event-calendar/types";

const VALID_VIEWS: CalendarView[] = ["month", "week", "day", "agenda"];
const DEFAULT_VIEW: CalendarView = "week";

/**
 * Custom hook to manage calendar view state synchronized with URL query parameters
 */
export function useCalendarView(initialView: CalendarView = DEFAULT_VIEW) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current view from URL or fall back to initialView/default
  const currentView: CalendarView = useMemo(() => {
    const viewParam = searchParams.get("view");

    if (viewParam && VALID_VIEWS.includes(viewParam as CalendarView)) {
      return viewParam as CalendarView;
    }

    return initialView;
  }, [searchParams, initialView]);

  // Function to update view and URL
  const setView = useCallback((newView: CalendarView) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);

    // Use router.replace to update URL without adding to history
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return {
    view: currentView,
    setView,
  };
}