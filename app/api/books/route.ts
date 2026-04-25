import { NextRequest, NextResponse } from "next/server";
import { searchGoogleBooks, searchOpenLibrary } from "@/lib/bookApis";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ results: [] });

  const [google, openlib] = await Promise.allSettled([
    searchGoogleBooks(query),
    searchOpenLibrary(query),
  ]);

  const googleResults = google.status === "fulfilled" ? google.value : [];
  const openlibResults = openlib.status === "fulfilled" ? openlib.value : [];

  return NextResponse.json({ results: [...googleResults, ...openlibResults] });
}
