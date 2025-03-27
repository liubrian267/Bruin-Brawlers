"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Post } from "@/types/posts";
const EditPosts = ({ posts }: { posts: Post[] }) => {
  // console.log(posts);
  const [localPosts, setLocalPosts] = useState(posts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  const handleEdit = (post: Post) => {
    setEditContent(post.content);
    setEditingId(post._id);
    // Optionally, clear any previous image selection.
    setEditImage(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent("");
    setEditImage(null);
  };

  const handleDelete = async (postID: string) => {
    try {
      const response = await fetch("/api/posts/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postID }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      const data = await response.json();
      console.log("Post deleted:", data.message);
      setLocalPosts((prevPosts: Post[]) =>
        prevPosts.filter((post) => post._id !== postID)
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleSave = async (postID: string) => {
    try {
      const formData = new FormData();
      formData.append("postID", postID);
      formData.append("textContent", editContent);
      if (editImage) {
        formData.append("imageContent", editImage);
      }
      const response = await fetch("/api/posts/edit", {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const data = await response.json();
      console.log(data.message);
      setLocalPosts((prevPosts: Post[]) =>
        prevPosts.map((post) => (post._id === postID ? data.post : post))
      );
      window.location.reload();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="space-y-6">
      {localPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
          No posts to display.
        </div>
      ) : (
        localPosts.map((post: Post) => (
          <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between mb-4">
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <div className="space-x-2">
                {editingId !== post._id ? (
                  <>
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleSave(post._id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {editingId === post._id ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4 min-h-[100px] bg-white"
                />
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Edit Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setEditImage(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                  />
                  {editImage ? (
                    <div className="relative h-64 mt-2">
                      <Image
                        src={URL.createObjectURL(editImage)}
                        alt="Preview image"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  ) : post.imageUrl ? (
                    // If no new image is selected, optionally show the existing image.
                    <div className="relative h-64 mt-2">
                      <Image
                        src={post.imageUrl}
                        alt="Post image"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
                {post.imageUrl && (
                  <div className="relative h-64 mb-4">
                    <Image
                      src={post.imageUrl}
                      alt="Post image"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                )}
              </>
            )}

            <div className="text-sm text-gray-500">
              {post.likes} {post.likes === 1 ? "like" : "likes"}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EditPosts;
