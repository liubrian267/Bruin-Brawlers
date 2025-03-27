import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Friend {
  _id: string;
  username: string;
  BrawlID: string;
  profilePicture?: string;
}

const FriendsPanel = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [recommendedFriends, setRecommendedFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFriends();
    fetchRecommendedFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await fetch("/api/friends");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch friends");
      }
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendedFriends = async () => {
    try {
      const response = await fetch("/api/users/recommended");
      if (!response.ok) throw new Error("Failed to fetch recommendations");
      const data = await response.json();
      setRecommendedFriends(data);
    } catch (error) {
      console.error("Error fetching recommended friends:", error);
    }
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

      // Refresh both friends and recommendations lists
      await Promise.all([fetchFriends(), fetchRecommendedFriends()]);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleViewProfile = (brawlID: string) => {
    router.push(`/profile/${brawlID}`);
  };

  if (isLoading) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 space-y-6">
      {/* Friends List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-[#2774AE] dark:text-blue-400" size={24} />
          <h2 className="text-lg font-semibold">Friends</h2>
        </div>
        <div className="space-y-4">
          {friends.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No friends yet
            </p>
          ) : (
            friends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg cursor-pointer transition-all duration-200"
                onClick={() => handleViewProfile(friend.BrawlID)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#2774AE] rounded-full flex items-center justify-center text-white">
                    {friend.profilePicture ? (
                      <Image
                        src={friend.profilePicture}
                        alt={friend.username || "User"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-lg">
                        {(friend.username || "U")[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {friend.username || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {friend.BrawlID}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recommended Friends */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="text-[#2774AE] dark:text-blue-400" size={24} />
          <h2 className="text-lg font-semibold">Recommended</h2>
        </div>
        <div className="space-y-4">
          {recommendedFriends.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No recommendations available
            </p>
          ) : (
            recommendedFriends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#2774AE] rounded-full flex items-center justify-center text-white">
                    {friend.profilePicture ? (
                      <Image
                        src={friend.profilePicture}
                        alt={friend.username || "User"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-lg">
                        {(friend.username || "U")[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {friend.username || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {friend.BrawlID}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddFriend(friend._id)}
                  className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-[#2774AE] hover:bg-[#1e5c8c] text-white text-sm rounded-md transition-all duration-200"
                >
                  Add
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPanel;
