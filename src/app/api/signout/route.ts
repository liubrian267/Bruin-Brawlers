// app/api/signout/route.ts
import { NextResponse } from "next/server";
import { deleteSession } from "@/utils/jwt"; // adjust the path

export async function POST() {
  // Call the deleteSession function
  await deleteSession();
  // Optionally, return a response
  return NextResponse.json({ message: "Signed out" });
}
