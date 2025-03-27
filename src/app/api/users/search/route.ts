import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";


function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    console.log(query)
    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Search for users where username matches the query (case-insensitive)
   const users = await User.find({
      username: { $regex: `^${escapeRegex(query)}`, $options: "i" },
   })
    .select("username profilePicture BrawlID _id email")
    .limit(10)

  console.log(users, "from search")
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
