/**
 * Utility helpers - pure functions, no side effects
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely (handles conflicts)
 * Usage: cn("px-2 py-1", condition && "bg-red-500")
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, length = 100) {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
}

/**
 * Generate WhatsApp link with prefilled message
 */
export function getWhatsAppLink(phone, message) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Validate Nigerian phone number (basic)
 */
export function isValidPhone(phone) {
  const cleaned = phone.replace(/\s/g, "");
  return /^(0|\+?234)[0-9]{10}$/.test(cleaned) || cleaned.length >= 10;
}

/**
 * Debounce function for search, etc.
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
