export type Role = "citizen" | "volunteer" | "donor" | "coordinator" | "admin";

export interface Profile {
  user_id: string;
  display_name: string | null;
  role: Role;
  district_code: string | null;
  created_at: string;
}

export function canModerate(role: Role | null | undefined): boolean {
  return role === "coordinator" || role === "admin";
}

export function isAdmin(role: Role | null | undefined): boolean {
  return role === "admin";
}
