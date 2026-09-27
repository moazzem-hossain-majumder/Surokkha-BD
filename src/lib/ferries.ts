export interface FerrySchedule {
  id: string;
  route: string;
  from_place: string;
  to_place: string;
  departs: string;
  days: string;
  contact: string | null;
  source_name: string;
  updated_at: string;
}

export type FerryHelpStatus = "open" | "answered" | "closed";

export interface FerryHelpRequest {
  id: string;
  route: string;
  message: string;
  contact_optional: string | null;
  status: FerryHelpStatus;
  reply: string | null;
  created_at: string;
}
