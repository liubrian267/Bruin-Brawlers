"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Create a client-only version of the component
const ProfileDataClient = ({ profileData }: any) => {
  const [showProfile, setShowProfile] = useState(false);

  // Add null checks and default values
  const safeProfileData = {
    trophies: profileData?.trophies ?? 0,
    highestTrophies: profileData?.highestTrophies ?? 0,
    club: profileData?.club ?? { name: "Not in a Club" },
    brawlers: profileData?.brawlers ?? [],
    "3vs3Victories": profileData?.["3vs3Victories"] ?? 0,
    soloVictories: profileData?.soloVictories ?? 0,
    duoVictories: profileData?.duoVictories ?? 0,
    bestRoboRumbleTime: profileData?.bestRoboRumbleTime ?? "N/A",
    bestTimeAsBigBrawler: profileData?.bestTimeAsBigBrawler ?? "N/A",
  };

  const StatItem = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon: string;
  }) => (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 p-2 group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-colors duration-300">
        <Image
          src={icon}
          alt={label}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200 group-hover:translate-x-0.5 transition-transform duration-300">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <details
      className="collapse bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 mb-6"
      onToggle={(e) => setShowProfile((e.target as HTMLDetailsElement).open)}
    >
      <summary className="collapse-title p-6 text-xl font-medium flex items-center gap-3 cursor-pointer bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] text-white rounded-t-xl group">
        <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <span className="group-hover:translate-x-1 transition-transform duration-300">
          {showProfile ? "Hide Profile" : "Show Profile"}
        </span>
      </summary>

      <div className="collapse-content p-6">
        <div className="max-w-4xl mx-auto overflow-hidden">
          <h2 className="text-2xl font-bold mb-8 pb-4 bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] bg-clip-text text-transparent border-b border-gray-200 dark:border-gray-700">
            Player Statistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
              <div className="p-4 bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] rounded-t-xl">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  Basic Info
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <StatItem
                  label="Trophies"
                  value={safeProfileData.trophies.toString()}
                  icon="/icons/trophies.png"
                />
                <StatItem
                  label="Highest Trophies"
                  value={safeProfileData.highestTrophies.toString()}
                  icon="/icons/highest-trophies.png"
                />
                <StatItem
                  label="Club"
                  value={safeProfileData.club.name}
                  icon="/icons/clubs.png"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
              <div className="p-4 bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] rounded-t-xl">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </span>
                  Battle Statistics
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <StatItem
                  label="Unlocked Brawlers"
                  value={safeProfileData.brawlers.length.toString()}
                  icon="/icons/unlocked-brawlers.png"
                />
                <StatItem
                  label="3v3 Victories"
                  value={safeProfileData["3vs3Victories"].toString()}
                  icon="/icons/3vs3-victories.png"
                />
                <StatItem
                  label="Solo Victories"
                  value={safeProfileData.soloVictories.toString()}
                  icon="/icons/solo-victories.png"
                />
                <StatItem
                  label="Duo Victories"
                  value={safeProfileData.duoVictories.toString()}
                  icon="/icons/duo-victories.png"
                />
                <StatItem
                  label="Robo Rumble"
                  value={safeProfileData.bestRoboRumbleTime}
                  icon="/icons/robo-rumble.png"
                />
                <StatItem
                  label="Big Game"
                  value={safeProfileData.bestTimeAsBigBrawler}
                  icon="/icons/big-game.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </details>
  );
};

// Create a client-only version of the component with no SSR
const ProfileData = dynamic(() => Promise.resolve(ProfileDataClient), {
  ssr: false,
});

export default ProfileData;
