"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StaffBadgeProps = {
  name: string;
  color?: string | null;
  className?: string;
};

// Predefined Tailwind color classes
const colorClassMap: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  slate: {
    bg: "bg-slate-100 dark:bg-slate-900",
    text: "text-slate-900 dark:text-slate-100",
    border: "border-slate-300 dark:border-slate-700",
  },
  gray: {
    bg: "bg-gray-100 dark:bg-gray-900",
    text: "text-gray-900 dark:text-gray-100",
    border: "border-gray-300 dark:border-gray-700",
  },
  zinc: {
    bg: "bg-zinc-100 dark:bg-zinc-900",
    text: "text-zinc-900 dark:text-zinc-100",
    border: "border-zinc-300 dark:border-zinc-700",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-900 dark:text-red-100",
    border: "border-red-300 dark:border-red-700",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900",
    text: "text-orange-900 dark:text-orange-100",
    border: "border-orange-300 dark:border-orange-700",
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-900",
    text: "text-amber-900 dark:text-amber-100",
    border: "border-amber-300 dark:border-amber-700",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-900",
    text: "text-yellow-900 dark:text-yellow-100",
    border: "border-yellow-300 dark:border-yellow-700",
  },
  lime: {
    bg: "bg-lime-100 dark:bg-lime-900",
    text: "text-lime-900 dark:text-lime-100",
    border: "border-lime-300 dark:border-lime-700",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-900 dark:text-green-100",
    border: "border-green-300 dark:border-green-700",
  },
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-900",
    text: "text-emerald-900 dark:text-emerald-100",
    border: "border-emerald-300 dark:border-emerald-700",
  },
  teal: {
    bg: "bg-teal-100 dark:bg-teal-900",
    text: "text-teal-900 dark:text-teal-100",
    border: "border-teal-300 dark:border-teal-700",
  },
  cyan: {
    bg: "bg-cyan-100 dark:bg-cyan-900",
    text: "text-cyan-900 dark:text-cyan-100",
    border: "border-cyan-300 dark:border-cyan-700",
  },
  sky: {
    bg: "bg-sky-100 dark:bg-sky-900",
    text: "text-sky-900 dark:text-sky-100",
    border: "border-sky-300 dark:border-sky-700",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-900 dark:text-blue-100",
    border: "border-blue-300 dark:border-blue-700",
  },
  indigo: {
    bg: "bg-indigo-100 dark:bg-indigo-900",
    text: "text-indigo-900 dark:text-indigo-100",
    border: "border-indigo-300 dark:border-indigo-700",
  },
  violet: {
    bg: "bg-violet-100 dark:bg-violet-900",
    text: "text-violet-900 dark:text-violet-100",
    border: "border-violet-300 dark:border-violet-700",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900",
    text: "text-purple-900 dark:text-purple-100",
    border: "border-purple-300 dark:border-purple-700",
  },
  fuchsia: {
    bg: "bg-fuchsia-100 dark:bg-fuchsia-900",
    text: "text-fuchsia-900 dark:text-fuchsia-100",
    border: "border-fuchsia-300 dark:border-fuchsia-700",
  },
  pink: {
    bg: "bg-pink-100 dark:bg-pink-900",
    text: "text-pink-900 dark:text-pink-100",
    border: "border-pink-300 dark:border-pink-700",
  },
  rose: {
    bg: "bg-rose-100 dark:bg-rose-900",
    text: "text-rose-900 dark:text-rose-100",
    border: "border-rose-300 dark:border-rose-700",
  },
};

export function StaffBadge({ name, color, className }: StaffBadgeProps) {
  // Get color classes or use default
  const colorClasses =
    color && colorClassMap[color]
      ? colorClassMap[color]
      : {
          bg: "bg-secondary",
          text: "text-secondary-foreground",
          border: "border-border",
        };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        colorClasses.bg,
        colorClasses.text,
        colorClasses.border,
        className
      )}
    >
      {name}
    </Badge>
  );
}

export const AVAILABLE_COLORS = Object.keys(colorClassMap);
