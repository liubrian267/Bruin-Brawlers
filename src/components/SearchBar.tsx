"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search as SearchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserType } from "@/types/Users";
import { Post } from "@/types/posts";

const Search = () => {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [searchFriends, setSearchFriends] = useState(true);
  const [searchResults, setSearchResults] = useState<UserType[] | Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const endpoint = searchFriends
        ? "/api/users/search"
        : "/api/posts/search";
      const url = `${endpoint}?q=${encodeURIComponent(query)}`;
      console.log("Calling URL:", url);
      const response = await fetch(
        `${endpoint}?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (searchName: string) => {
    if (!searchName.trim()) return;
    const type = searchFriends ? "friends" : "posts";
    router.push(`/search?q=${encodeURIComponent(searchName)}&type=${type}`);
    setSearchResults([]); // Clear dropdown results
  };

  const handleSearchButtonClick = () => {
    if (!query.trim()) return;
    const type = searchFriends ? "friends" : "posts";
    router.push(`/search?q=${encodeURIComponent(query)}&type=${type}`);
    setSearchResults([]); // Clear dropdown results
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, searchFriends]);

  const handleAddFriend = async (friendBrawlId: string) => {
    try {
      const response = await fetch("/api/addFriend", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendBrawlId: friendBrawlId }),
      });
      if (!response.ok) throw new Error("Failed to add friend");
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <div className="w-full relative" ref={searchRef}>
      <div className="flex justify-center w-full mb-4">
        <div className="relative text-black rounded-full bg-white w-[350px] flex">
          <input
            type="text"
            placeholder={searchFriends ? "Search users..." : "Search posts..."}
            className="rounded-full search-input text-red w-full p-2 bg-white border border-gray-300 rounded-r"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <button
            onClick={handleSearchButtonClick}
            className="rounded-full bg-white text-black w-[100px]"
            disabled={isSearching}
          >
            {isSearching ? "..." : "Search"}
          </button>
        </div>
        <div className="dropdown dropdown-hover ">
          <div tabIndex={0} role="button" className="btn m-1">
            <SearchIcon size={24} />
            {searchFriends ? <>Friends</> : <>Posts</>}⌄
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[100] w-52 p-2 shadow-sm"
          >
            <li>
              <button
                onClick={() => {
                  setSearchFriends(true);
                  setSearchResults([]);
                }}
                className="text-white dark:text-white hover:bg-gray-600"
              >
                Friends
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setSearchFriends(false);
                  setSearchResults([]);
                }}
                className="text-white dark:text-white hover:bg-gray-600"
              >
                Posts
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Search Results Dropdown */}
      {searchResults?.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 max-h-[500px] overflow-y-auto">
          {searchFriends ? (
            // User results preview
            <div className="divide-y">
              {(searchResults as UserType[]).slice(0, 3).map((user) => (
                <div
                  key={user?._id.toString()}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 hover:cursor-pointer"
                  onClick={() => {
                    handleSearchResultClick(user.username);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#2774AE] rounded-full flex items-center justify-center text-white">
                      {user?.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt={user.username}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-xl">
                          {user ? user.username[0].toUpperCase() : ""}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-black dark:text-gray-900">
                      {user?.username}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddFriend(user?.BrawlID)}
                    className="px-4 py-2 bg-[#2774AE] text-white rounded-md hover:bg-[#1e5c8c] transition-colors"
                  >
                    Add Friend
                  </button>
                </div>
              ))}
              {searchResults.length > 3 && (
                <div
                  className="p-3 text-center text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
                  onClick={handleSearchButtonClick}
                >
                  View all {searchResults.length} results
                </div>
              )}
            </div>
          ) : (
            // Post results preview
            <div className="divide-y">
              {(searchResults as Post[]).slice(0, 3).map((post) => (
                <div
                  key={post._id}
                  onClick={() => {
                    handleSearchResultClick(post.content);
                  }}
                  className="p-4 hover:bg-gray-50 hover:cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-[#2774AE] rounded-full flex items-center justify-center text-white font-bold">
                        {(post.author.username || "A")[0].toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {post.author.username || "Anonymous"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-gray-500 text-sm">
                          {post.likes} {post.likes === 1 ? "like" : "likes"}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700 line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {searchResults.length > 3 && (
                <div
                  className="p-3 text-center text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
                  onClick={handleSearchButtonClick}
                >
                  View all {searchResults.length} results
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
