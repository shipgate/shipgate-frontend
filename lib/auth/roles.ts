// lib/auth/roles.ts

export type UserRole = "user" | "super-admin" | "admin" | "operational-staff" | "courier";

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  "user": "/dashboard",
  "super-admin": "/super-admin/dashboard",
  "admin": "/admin/dashboard",
  "operational-staff": "/staff/dashboard",
  "courier": "/courier/dashboard",
};

// Each role's allowed path prefixes
export const ROLE_ALLOWED_PATHS: Record<UserRole, string[]> = {
  "user": ["/dashboard"],
  "super-admin": ["/super-admin", "/admin", "/staff", "/dashboard", "/courier"],
  "admin": ["/admin", "/staff", "/dashboard"],
  "operational-staff": ["/staff"],
  "courier": ["/courier"],
};

export function getRoleDashboard(role: UserRole): string {
  return ROLE_DASHBOARDS[role] ?? "/dashboard";
}

export function isPathAllowedForRole(role: UserRole, pathname: string): boolean {
  const allowedPrefixes = ROLE_ALLOWED_PATHS[role] ?? [];
  return allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
}
