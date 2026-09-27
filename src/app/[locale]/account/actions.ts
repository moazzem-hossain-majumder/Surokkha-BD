"use server";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function signOut(locale: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect({ href: "/", locale });
}

export interface DeleteAccountState {
  error: string | null;
}

// P6-6 (data deletion). Deletes the actual auth.users row via the admin API
// (there is no self-delete endpoint on the regular client) after confirming
// the request came from that same signed-in session -- never trust a userId
// passed from the client. profiles/volunteers rows cascade-delete with it;
// everything else the person authored (alerts, reports, pledges, etc.) is
// detached rather than deleted, per migration 0010 -- see that file's
// comment and docs/SECURITY_REVIEW.md for why.
export async function deleteAccount(locale: string, _prev: DeleteAccountState, formData: FormData): Promise<DeleteAccountState> {
  if (String(formData.get("confirm") ?? "") !== "DELETE") {
    return { error: "Type DELETE to confirm." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { error: error.message };

  await supabase.auth.signOut();
  redirect({ href: "/", locale });
  return { error: null }; // unreachable -- redirect() always throws, but satisfies the return type
}
