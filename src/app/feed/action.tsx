import { connectToDatabase } from "@/utils/database";
import User from "@/models/User";
import Post from "@/models/Post";
export async function fetchUserPosts(brawlID: string) {
  await connectToDatabase();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  const user = await User.findOne({ BrawlID: brawlID }).lean();
  //   console.log("User:", user);
  //   console.log("Posts:", posts);
  const userPosts = user
    ? posts.filter((post) => {
        // Check if author is an object with _id property
        if (
          post.author &&
          typeof post.author === "object" &&
          "_id" in post.author
        ) {
          return post.author._id.toString() === user._id.toString();
        }
        // If author is just an ObjectId
        return post.author?.toString() === user._id.toString();
      })
    : [];
  return JSON.parse(JSON.stringify(userPosts));
}
