import { Expense } from "@/payload-types";

export type CategoryType = Expense["category"];

type CategoryColor = {
  /** Full Tailwind background class. Written out in full so Tailwind generates it. */
  bg: string;
  /** Full Tailwind border class. */
  border: string;
  /** Full Tailwind text class. */
  text: string;
};

// One unique color per category: 9 accent shades, then 4 neutral greys. Classes must stay literal.
export const CATEGORY_COLORS: Record<CategoryType, CategoryColor> = {
  personalRecurring: { bg: "bg-fg-400", border: "border-fg-400", text: "text-fg-400" },
  personalOneOff: { bg: "bg-primary-400", border: "border-primary-400", text: "text-primary-400" },
  investments: { bg: "bg-bg-300", border: "border-bg-300", text: "text-bg-300" },
  taxes: { bg: "bg-secondary-400", border: "border-secondary-400", text: "text-secondary-400" },
  business: { bg: "bg-tertiary-400", border: "border-tertiary-400", text: "text-tertiary-400" },
  food: { bg: "bg-secondary-500", border: "border-secondary-500", text: "text-secondary-500" },
  shelter: { bg: "bg-tertiary-300", border: "border-tertiary-300", text: "text-tertiary-300" },
  transport: { bg: "bg-tertiary-400", border: "border-tertiary-400", text: "text-tertiary-400" },
  health: { bg: "bg-tertiary-500", border: "border-tertiary-500", text: "text-tertiary-500" },
  fitness: { bg: "bg-fg-200", border: "border-fg-200", text: "text-fg-200" },
  education: { bg: "bg-fg-300", border: "border-fg-300", text: "text-fg-300" },
  wife: { bg: "bg-fg-400", border: "border-fg-400", text: "text-fg-400" },
  "non-essential": { bg: "bg-fg-500", border: "border-fg-500", text: "text-fg-500" },
};
