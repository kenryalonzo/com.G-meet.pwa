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

export function randomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateRoomId(): string {
  return `${randomString(3)}-${randomString(4)}-${randomString(3)}`;
}

/** Initials from a display name, e.g. "Ada Lovelace" -> "AL" */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
  return (first + last).toUpperCase()
}

/** Deterministic avatar background color derived from a stable id (e.g. user id or email) */
export function stringToHue(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}
