import { connectToDatabase } from "@/utils/database";
import User from "@/models/User";
import Post from "@/models/Post";
import { IUser } from "@/models/User";
import { IPost } from "@/models/Post";

export async function fetchUserPosts(brawlID: string) {
  await connectToDatabase();
  const posts = (await Post.find().sort({ createdAt: -1 }).lean()) as IPost[];
  const user = (await User.findOne({
    BrawlID: brawlID,
  }).lean()) as IUser | null;

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
