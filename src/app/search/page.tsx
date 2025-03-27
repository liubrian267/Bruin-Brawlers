"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown, TrendingUp, Clock, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { User } from "@/types/Users";

interface Post {
  _id: string;
  author:
    | {
        BrawlID: string;
        profilePicture?: string;
        username: string;
      }
    | string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "posts";
  const [sortBy, setSortBy] = useState<
    "recent" | "old" | "mostLikes" | "leastLikes"
  >("recent");
  const [results, setResults] = useState<Post[] | User[]>([]);

  const fetchResults = async () => {
    if (!query) return;

    try {
      const endpoint =
        type === "friends" ? "/api/users/search" : "/api/posts/search";
      const response = await fetch(
        `${endpoint}?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();

      if (type === "posts") {
        // Sort posts based on selected option
        const sortedData = [...data].sort((a: Post, b: Post) => {
          switch (sortBy) {
            case "recent":
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            case "old":
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            case "mostLikes":
              return b.likes - a.likes;
            case "leastLikes":
              return a.likes - b.likes;
            default:
              return 0;
          }
        });
        setResults(sortedData);
      } else {
        setResults(data);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query, type, sortBy]);

  const gotoProfile = (BrawlID: string) => {
    window.location.href = `/profile/${BrawlID}`;
  };

  const handleAddFriend = async (userId: string) => {
    try {
      const response = await fetch("/api/friends/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId: userId }),
      });
      if (!response.ok) throw new Error("Failed to add friend");
    } catch (error) {
      console.error("Error adding friend:", error);
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
    <div className="min-h-screen bg-gray-100 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Query Display */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Search Results for &quot;{query}&quot;
          </h1>
          <p className="text-gray-600">
            Showing {type === "friends" ? "users" : "posts"} matching your
            search
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sorting Options Sidebar */}
          {type === "posts" && (
            <div className="w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
              <h2 className="text-lg font-semibold mb-4 text-black dark:text-gray-900">
                Sort By
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSortBy("recent")}
                  className={`flex items-center space-x-2 w-full p-2 rounded ${
                    sortBy === "recent"
                      ? "bg-[#2774AE] text-white"
                      : "text-black dark:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Clock size={18} />
                  <span>Most Recent</span>
                </button>
                <button
                  onClick={() => setSortBy("old")}
                  className={`flex items-center space-x-2 w-full p-2 rounded ${
                    sortBy === "old"
                      ? "bg-[#2774AE] text-white"
                      : "text-black dark:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <ArrowUpDown size={18} />
                  <span>Oldest First</span>
                </button>
                <button
                  onClick={() => setSortBy("mostLikes")}
                  className={`flex items-center space-x-2 w-full p-2 rounded ${
                    sortBy === "mostLikes"
                      ? "bg-[#2774AE] text-white"
                      : "text-black dark:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <TrendingUp size={18} />
                  <span>Most Popular</span>
                </button>
                <button
                  onClick={() => setSortBy("leastLikes")}
                  className={`flex items-center space-x-2 w-full p-2 rounded ${
                    sortBy === "leastLikes"
                      ? "bg-[#2774AE] text-white"
                      : "text-black dark:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <ThumbsUp size={18} />
                  <span>Least Popular</span>
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {results.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No results found for &quot;{query}&quot;
                </div>
              ) : type === "friends" ? (
                // User results
                <div className="divide-y">
                  {(results as User[]).map((user) => (
                    <div
                      key={user._id}
                      onClick={() => {
                        gotoProfile(user.BrawlID);
                      }}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 hover:cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#2774AE] rounded-full flex items-center justify-center text-white">
                          {user.profilePicture ? (
                            <Image
                              src={user.profilePicture}
                              alt={user.username}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <span className="text-xl">
                              {user.username[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-black dark:text-gray-900">
                          {user.username}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddFriend(user._id)}
                        className="px-4 py-2 bg-[#2774AE] text-white rounded-md hover:bg-[#1e5c8c] transition-colors"
                      >
                        Add Friend
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                // Post results
                <div className="divide-y">
                  {(results as Post[]).map((post) => (
                    <div key={post._id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {typeof post.author === "object" &&
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
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-black dark:text-gray-900">
                                {getAuthorName(post.author)}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-gray-500 text-sm">
                              {post.likes} {post.likes === 1 ? "like" : "likes"}
                            </div>
                          </div>
                          <p className="mt-2 text-gray-700">{post.content}</p>
                          {post.imageUrl && (
                            <div className="relative h-64 mt-4">
                              <Image
                                src={post.imageUrl}
                                alt="Post image"
                                fill
                                className="object-contain rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
