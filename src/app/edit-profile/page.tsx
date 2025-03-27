"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserProfile {
  profilePicture: string | null;
  socialMedia: {
    twitter: string | null;
    instagram: string | null;
    discord: string | null;
  };
  biography: string;
  username: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    profilePicture: null,
    socialMedia: {
      twitter: "",
      instagram: "",
      discord: "",
    },
    biography: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch current profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setProfile((prev) => ({ ...prev, profilePicture: data.imageUrl }));
    } catch (err) {
      console.error("Failed to upload image:", err); // Directly log the error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      router.push("/feed");
    } catch (err) {
      console.error("Failed to update profile:", err); // Directly log the error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 hover:shadow-xl transition-all duration-300">
        {/* Header Section with Profile Picture */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-3 text-gray-800 dark:text-gray-100 bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] bg-clip-text text-transparent">
              Your Profile
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Brawlstars ID: {profile.username}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4 rounded-xl overflow-hidden shadow-lg group">
              {profile.profilePicture ? (
                <Image
                  src={profile.profilePicture}
                  alt="Profile"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#2774AE] to-[#1e5c8c] flex items-center justify-center">
                  <span className="text-white font-medium">No image</span>
                </div>
              )}
            </div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Picture
            </label>
            <label className="cursor-pointer">
              <div className="px-4 py-2 bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group-hover:from-[#1e5c8c] group-hover:to-[#2774AE]">
                Choose Image
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-100">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Social Media Links */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
              Social Media
            </h2>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter
              </label>
              <input
                type="text"
                value={profile.socialMedia.twitter || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    socialMedia: {
                      ...prev.socialMedia,
                      twitter: e.target.value,
                    },
                  }))
                }
                className="w-full px-4 py-3 bg-white/90 dark:bg-gray-700/90 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-[#2774AE] focus:border-transparent transition duration-200 group-hover:shadow-md dark:text-gray-100"
                placeholder="Twitter username"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={profile.socialMedia.instagram || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    socialMedia: {
                      ...prev.socialMedia,
                      instagram: e.target.value,
                    },
                  }))
                }
                className="w-full px-4 py-3 bg-white/90 dark:bg-gray-700/90 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-[#2774AE] focus:border-transparent transition duration-200 group-hover:shadow-md dark:text-gray-100"
                placeholder="Instagram username"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discord
              </label>
              <input
                type="text"
                value={profile.socialMedia.discord || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    socialMedia: {
                      ...prev.socialMedia,
                      discord: e.target.value,
                    },
                  }))
                }
                className="w-full px-4 py-3 bg-white/90 dark:bg-gray-700/90 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-[#2774AE] focus:border-transparent transition duration-200 group-hover:shadow-md dark:text-gray-100"
                placeholder="Discord username"
              />
            </div>
          </div>

          {/* Biography */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Biography
            </label>
            <textarea
              value={profile.biography}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, biography: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-3 bg-white/90 dark:bg-gray-700/90 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-[#2774AE] focus:border-transparent transition duration-200 group-hover:shadow-md resize-none dark:text-gray-100"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2774AE]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl shadow-md text-white bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2774AE] ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-[#1e5c8c] hover:to-[#2774AE]"
              }`}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
