import { connectToDatabase } from "@/utils/database";
import User from "@/models/User";
import { cookies } from "next/headers";
export async function PUT(req: Request) {
  // console.log('hiß')
  await connectToDatabase();
  const cookieStore = await cookies();
  const myBrawlId = cookieStore.get("brawlID")?.value as string;

  const { friendBrawlId } = await req.json();
  // console.log("My BrawlID:", myBrawlId, "Friend BrawlID:", friendBrawlId);
  try {
    const user = await User.findOne({ BrawlID: myBrawlId });
    const friend = await User.findOne({ BrawlID: friendBrawlId });
    console.log(user, friend)
    if (!friend) {
      return new Response(
        JSON.stringify({
          errors: {
            friendBrawlId: ["Friend not registered with Bruin Brawlers"],
          },
        }),
        { status: 404 }
      );
    }
    if (user?.friends.includes(friend._id)) {
      return new Response(
        JSON.stringify({ error: "User is already a friend" }),
        { status: 404 }
      );
    }
    user?.friends.push(friend._id);
    await user?.save();
    return new Response(
      JSON.stringify({ message: "Friend added successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding friend:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
