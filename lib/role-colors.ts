/**
 * Role-Based Theme Colors
 * Consistent color schemes across the Shurokkha platform
 */

export type UserRole = "donor" | "provider" | "beneficiary" | "admin" | "guest";

export interface RoleTheme {
  primary: string;
  secondary: string;
  accent: string;
  badge: string;
  cardGradient: string;
  hoverBorder: string;
  icon: string;
}

/**
 * Color schemes for each user role
 * - Donor: Green theme (growth, giving, positive impact)
 * - Provider: Blue theme (trust, stability, professionalism)
 * - Beneficiary: Purple theme (dignity, support, empowerment)
 * - Admin: Red theme (alertness, monitoring, security)
 */
export const roleColors: Record<UserRole, RoleTheme> = {
  donor: {
    primary: "text-green-600 dark:text-green-400",
    secondary: "text-green-500 dark:text-green-300",
    accent: "text-green-700 dark:text-green-500",
    badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    cardGradient:
      "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200",
    hoverBorder: "hover:border-green-500",
    icon: "text-green-600",
  },
  provider: {
    primary: "text-blue-600 dark:text-blue-400",
    secondary: "text-blue-500 dark:text-blue-300",
    accent: "text-blue-700 dark:text-blue-500",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    cardGradient:
      "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200",
    hoverBorder: "hover:border-blue-500",
    icon: "text-blue-600",
  },
  beneficiary: {
    primary: "text-purple-600 dark:text-purple-400",
    secondary: "text-purple-500 dark:text-purple-300",
    accent: "text-purple-700 dark:text-purple-500",
    badge:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    cardGradient:
      "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200",
    hoverBorder: "hover:border-purple-500",
    icon: "text-purple-600",
  },
  admin: {
    primary: "text-red-600 dark:text-red-400",
    secondary: "text-red-500 dark:text-red-300",
    accent: "text-red-700 dark:text-red-500",
    badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    cardGradient:
      "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200",
    hoverBorder: "hover:border-red-500",
    icon: "text-red-600",
  },
  guest: {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    badge: "bg-secondary text-secondary-foreground",
    cardGradient: "from-secondary/10 to-accent/10 border-primary/20",
    hoverBorder: "hover:border-primary",
    icon: "text-primary",
  },
};

/**
 * Get theme colors for a specific role
 */
export function getRoleTheme(role?: UserRole | null): RoleTheme {
  if (!role) return roleColors.guest;
  return roleColors[role] || roleColors.guest;
}

/**
 * Get badge variant based on role
 */
export function getRoleBadgeClass(role?: UserRole | null): string {
  const theme = getRoleTheme(role);
  return theme.badge;
}

/**
 * Get card gradient class based on role
 */
export function getRoleCardGradient(role?: UserRole | null): string {
  const theme = getRoleTheme(role);
  return `bg-linear-to-br ${theme.cardGradient}`;
}

/**
 * Design System Constants
 * Use these throughout the platform for consistency
 */
export const DESIGN_SYSTEM = {
  // Typography
  typography: {
    pageTitle: "text-3xl font-bold",
    sectionHeader: "text-2xl font-semibold",
    cardTitle: "text-lg font-medium",
    body: "text-base",
    caption: "text-sm text-muted-foreground",
  },

  // Spacing
  spacing: {
    pagePadding: "px-4 sm:px-6 lg:px-8 py-8",
    cardPadding: "p-6",
    gridGap: "gap-6",
    sectionMargin: "mb-8",
  },

  // Borders & Shadows
  effects: {
    border: "border-2", // Standardized to border-2
    shadow: "hover:shadow-xl", // Standardized to shadow-xl
    transition: "transition-all duration-200",
    scale: "hover:scale-105",
  },

  // Buttons
  buttons: {
    primary: "variant-default",
    secondary: "variant-outline",
    destructive: "variant-destructive",
  },
} as const;

/**
 * Helper to apply consistent card styles
 */
export function getCardClasses(hoverable = true): string {
  const base = `${DESIGN_SYSTEM.effects.border} ${DESIGN_SYSTEM.spacing.cardPadding}`;
  if (hoverable) {
    return `${base} ${DESIGN_SYSTEM.effects.shadow} ${DESIGN_SYSTEM.effects.scale} ${DESIGN_SYSTEM.effects.transition} cursor-pointer`;
  }
  return base;
}
