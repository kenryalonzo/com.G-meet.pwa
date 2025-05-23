import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPathname = (path: string) => {
  // Remove leading slash and split path segments
  const segments = path.toLowerCase().split("/").filter(Boolean)

  // Transform segments: replace hyphens with spaces and capitalize words
  return segments.map((segment) => 
    segment.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}