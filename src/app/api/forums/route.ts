import { NextResponse } from "next/server";
import { getForums } from "@/features/forums/queries/get-forums.action";

export async function GET() {
  try {
    const forums = await getForums();
    return NextResponse.json(forums);
  } catch (error) {
    console.error("Failed to fetch forums:", error);
    return NextResponse.json(
      { error: "Failed to fetch forums" },
      { status: 500 }
    );
  }
}