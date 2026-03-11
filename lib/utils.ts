import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateRange(startDate: Date, endDate: Date) {
  const start = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const end = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${start} - ${end}`;
}

export function getDurationInDays(startDate: Date, endDate: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / msPerDay
  );
  return diff + 1;
}

export function getTripLocationLabel(itineraryitems: { itemTitle: string }[]) {
  if (!itineraryitems.length) {
    return "Location coming soon";
  }
  return itineraryitems[0].itemTitle;
}
