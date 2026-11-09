import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.redirect(
    "https://www.spendshift.com.au/?utm_source=instagram&utm_medium=social&utm_campaign=organic_social"
  );
}

