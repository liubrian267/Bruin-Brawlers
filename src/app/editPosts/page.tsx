import React from "react";
import { fetchUserPosts } from "../feed/action";
import { cookies } from "next/headers";
import EditPosts from "@/components/posts/editPostFeed";
const page = async () => {
  const cookieStore = await cookies();
  const brawlID = cookieStore.get("brawlID")?.value as string;
  const data = await fetchUserPosts(brawlID);
  //   console.log(data);
  return (
    <div>
      <EditPosts posts={data} />
    </div>
  );
};
export default page;
