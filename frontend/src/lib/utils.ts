import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Tint } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceDetailed(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const tintBgClasses: Record<Tint, string> = {
  sage: "bg-sage",
  butter: "bg-butter",
  sand: "bg-sand",
  blush: "bg-blush",
  sky: "bg-sky",
  stone: "bg-stone",
};

export const tintBorderClasses: Record<Tint, string> = {
  sage: "border-sage",
  butter: "border-butter",
  sand: "border-sand",
  blush: "border-blush",
  sky: "border-sky",
  stone: "border-stone",
};
