import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/*
 * Turns off reminder emails using the private token from the email.
 * POST only, so email link scanners that pre-open links can't unsubscribe
 * people by accident. Supports one-click unsubscribe (RFC 8058) from mail apps.
 */

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = new URL(req.url);
  let token = url.searchParams.get("token") || "";
  if (!token) {
    try {
      const body = await req.json();
      token = typeof body?.token === "string" ? body.token : "";
    } catch {
      token = "";
    }
  }

  if (!/^[a-f0-9]{48}$/.test(token)) {
    return NextResponse.json({ error: "This unsubscribe link isn't valid." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("report_plans")
    .update({ reminders_enabled: false, updated_at: new Date().toISOString() })
    .eq("reminders_token", token)
    .select("report_id");

  if (error) {
    console.error("UNSUBSCRIBE_ERROR:", error.message);
    return NextResponse.json({ error: "We couldn't update your settings. Please try again or email info@spendshift.com.au." }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: "This unsubscribe link isn't valid." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, reportId: data[0].report_id });
}
