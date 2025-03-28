"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { storeUser } from "@/utils/storeUser";
import { UserPayloadState } from "@/types/Users";
import FriendsPanel from "@/components/FriendsPanel";
import { Post } from "@/types/posts";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: "",
    image: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  //create a user id for demo purposes
  const [currentUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        return storedUserId;
      }
      const newUserId = "User-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", newUserId);
      return newUserId;
    }
    return "User-" + Math.random().toString(36).substr(2, 9);
  });

  const [user, setUser] = useState<UserPayloadState>({
    _id: "",
    brawlID: "",
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
    fetchUserDetails();
  }, []);

  async function fetchUserDetails() {
    const userData = await storeUser();
    console.log("usr data", userData);
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser({
      _id: userData._id,
      brawlID: userData.BrawlID,
      name: userData.username,
      email: userData.email,
    });
  }

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/posts");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to fetch posts"
        );
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch posts"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPost((prev) => ({ ...prev, image: file }));
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const post = posts.find((p) => p._id === postId);
      if (!post) return;

      const isLiked = post.likedBy?.includes(currentUser);
      const action = isLiked ? "unlike" : "like";

      const response = await fetch("/api/posts/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: currentUser,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === postId ? updatedPost : p))
      );
    } catch (error) {
      console.error("Error updating like:", error);
      alert("Failed to update like. Please try again.");
    }
  };

  const isPostLikedByUser = (post: Post) => {
    return post.likedBy?.includes(currentUser) || false;
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("_id", String(user._id));
      formData.append("content", newPost.content);
      if (newPost.image) {
        formData.append("image", newPost.image);
      }
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to create post");
      }

      // Add the new post to the beginning of the posts array
      setPosts((prevPosts) => [data.post, ...prevPosts]);
      // Reset form
      setIsCreatingPost(false);
      setNewPost({ content: "", image: null });
    } catch (error) {
      console.error("Error creating post:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAuthorName = (author: Post["author"]) => {
    if (typeof author === "object" && author.BrawlID) {
      return author.BrawlID;
    }
    return typeof author === "string" ? author : "Anonymous";
  };

  const getAuthorInitial = (author: Post["author"]) => {
    const name = getAuthorName(author);
    return name[0]?.toUpperCase() || "A";
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex gap-8">
          {/* Main Feed Content */}
          <div className="flex-1">
            {error && (
              <div className="bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl p-6 mb-8 shadow-lg backdrop-blur-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <h3 className="font-semibold text-lg mb-2">Error</h3>
                <p className="mb-3">{error}</p>
                <button
                  onClick={() => fetchPosts()}
                  className="text-sm text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline transform transition-transform duration-200 hover:scale-105"
                >
                  Try Again
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-[#2774AE] dark:border-blue-400"></div>
              </div>
            ) : (
              <>
                {/* Create Post Button */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg p-8 mb-8 border border-gray-100/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {!isCreatingPost ? (
                    <button
                      onClick={() => setIsCreatingPost(true)}
                      className="w-full text-left px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      <span className="text-gray-600 dark:text-gray-300">
                        What&apos;s on your mind?
                      </span>
                    </button>
                  ) : (
                    <form onSubmit={createPost} className="space-y-6">
                      <textarea
                        value={newPost.content}
                        onChange={(e) =>
                          setNewPost((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        placeholder="Share your thoughts..."
                        className="w-full p-5 border bg-white/80 dark:bg-gray-700/80 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2774AE] focus:border-transparent transition-all duration-200 dark:text-gray-100 dark:placeholder-gray-400 shadow-sm hover:shadow-md"
                        rows={3}
                        disabled={isSubmitting}
                      />
                      <div className="flex justify-between items-center">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <div
                            className={`bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] text-white px-5 py-2.5 rounded-xl transition-all duration-300 transform ${
                              isSubmitting
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:shadow-md hover:from-[#1e5c8c] hover:to-[#2774AE] hover:-translate-y-0.5"
                            }`}
                          >
                            <span>Add Image</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={isSubmitting}
                          />
                        </label>
                        {newPost.image && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Image selected: {newPost.image.name}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingPost(false);
                            setNewPost({ content: "", image: null });
                          }}
                          className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-0.5"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] text-white px-6 py-3 rounded-xl transition-all duration-300 transform ${
                            isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:shadow-md hover:from-[#1e5c8c] hover:to-[#2774AE] hover:-translate-y-0.5"
                          }`}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Posting..." : "Post"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Posts Feed */}
                {posts.length === 0 ? (
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center text-gray-600 dark:text-gray-300">
                    No posts yet. Be the first to share something!
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post._id}
                      className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg p-8 mb-8 border border-gray-100/50 dark:border-gray-700/50 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="flex-shrink-0 transform transition-transform duration-300 group-hover:scale-105">
                          {post.author &&
                          typeof post.author === "object" &&
                          post.author.profilePicture ? (
                            <div className="w-10 h-10 rounded-full relative overflow-hidden">
                              <Image
                                src={post.author.profilePicture}
                                alt={`${getAuthorName(post.author)}'s profile`}
                                fill
                                className="rounded-full object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-[#2774AE] rounded-full flex items-center justify-center text-white font-bold">
                              {getAuthorInitial(post.author)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-1">
                            {getAuthorName(post.author)}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="mb-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                      </p>
                      {post.imageUrl && (
                        <div className="relative h-72 mb-6 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 group-hover:shadow-xl">
                          <Image
                            src={post.imageUrl}
                            alt="Post image"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleLike(post._id)}
                          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-[#2774AE] transition-all duration-300 group/like"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 transform transition-all duration-300 group-hover/like:scale-110 ${
                              isPostLikedByUser(post)
                                ? "text-[#2774AE] fill-current"
                                : ""
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          <span className="font-medium">
                            {post.likes} {post.likes === 1 ? "like" : "likes"}
                          </span>
                        </button>
                        {post.likedBy && post.likedBy.length > 0 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-2">
                            Liked by {post.likedBy.slice(0, 3).join(", ")}
                            {post.likedBy.length > 3 &&
                              ` and ${post.likedBy.length - 3} others`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {/* Friends Panel */}
          <div className="hidden lg:block sticky top-6">
            <FriendsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
