import { NextResponse } from "next/server";
import Post from "@/models/Post";
import { connectToDatabase } from "@/utils/database";

export async function PATCH(request: Request) {
  try {
    const formData = await request.formData();
    const textContent = formData.get("textContent");
    const postID = formData.get("postID");
    const imageFile = formData.get("imageContent");

    let base64Image = null;
    if (imageFile && imageFile instanceof File) {
      // Convert the File to an ArrayBuffer, then to a Buffer, and finally to a base64 string
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64Image = buffer.toString("base64");
    }

    await connectToDatabase();

    // Update the post and return the updated document using { new: true }
    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      { content: textContent, imageUrl: base64Image },
      { new: true }
    );

    //console.log("Updated post:", updatedPost);
    if (!updatedPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post updated successfully", post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { message: "Error updating post" },
      { status: 500 }
    );
  }
}
