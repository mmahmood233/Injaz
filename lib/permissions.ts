export type UserRole = "VISITOR" | "MEMBER" | "ADMIN";

export function isAdmin(role?: string | null): boolean {
  return role === "ADMIN";
}

export function isMember(role?: string | null): boolean {
  return role === "MEMBER" || role === "ADMIN";
}

export function canComment(role?: string | null): boolean {
  return isMember(role);
}

export function canManageContent(role?: string | null): boolean {
  return isAdmin(role);
}

export function canViewBorrowings(role?: string | null): boolean {
  return isMember(role);
}
