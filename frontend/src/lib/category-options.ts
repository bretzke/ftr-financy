import {
  BaggageClaim,
  BookOpen,
  Briefcase,
  Car,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  Receipt,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS = [
  "BUSINESS",
  "CAR",
  "HEALTH",
  "FINANCY",
  "CART",
  "TICKET",
  "TOOL_CASE",
  "UTENSILS",
  "PET",
  "HOUSE",
  "GIFT",
  "GYM",
  "BOOK",
  "BAGGAGE",
  "MAILBOX",
  "RECEIPT",
] as const;

export const CATEGORY_COLORS = [
  "GREEN",
  "BLUE",
  "PURPLE",
  "PINK",
  "RED",
  "ORANGE",
  "YELLOW",
] as const;

export type CategoryIcon = (typeof CATEGORY_ICONS)[number];
export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export const DEFAULT_CATEGORY_ICON: CategoryIcon = "FINANCY";
export const DEFAULT_CATEGORY_COLOR: CategoryColor = "GREEN";

export const CATEGORY_ICON_MAP: Record<CategoryIcon, LucideIcon> = {
  BUSINESS: Briefcase,
  CAR: Car,
  HEALTH: HeartPulse,
  FINANCY: PiggyBank,
  CART: ShoppingCart,
  TICKET: Ticket,
  TOOL_CASE: ToolCase,
  UTENSILS: Utensils,
  PET: PawPrint,
  HOUSE: House,
  GIFT: Gift,
  GYM: Dumbbell,
  BOOK: BookOpen,
  BAGGAGE: BaggageClaim,
  MAILBOX: Mailbox,
  RECEIPT: Receipt,
};

export const CATEGORY_COLOR_MAP: Record<
  CategoryColor,
  { hex: string; label: string }
> = {
  GREEN: { hex: "#16A34A", label: "Verde" },
  BLUE: { hex: "#2563EB", label: "Azul" },
  PURPLE: { hex: "#9333EA", label: "Roxo" },
  PINK: { hex: "#DB2777", label: "Rosa" },
  RED: { hex: "#DC2626", label: "Vermelho" },
  ORANGE: { hex: "#EA580C", label: "Laranja" },
  YELLOW: { hex: "#CA8A04", label: "Amarelo" },
};

export function getCategoryIcon(icon: string): LucideIcon {
  return CATEGORY_ICON_MAP[icon as CategoryIcon] ?? PiggyBank;
}

export function getCategoryColorHex(color: string): string {
  return CATEGORY_COLOR_MAP[color as CategoryColor]?.hex ?? "#1f6f43";
}

export function getCategoryColorLabel(color: string): string {
  return CATEGORY_COLOR_MAP[color as CategoryColor]?.label ?? color;
}
