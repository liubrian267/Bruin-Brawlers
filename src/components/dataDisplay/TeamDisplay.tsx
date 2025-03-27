import React from "react";
import { Player, TeamListProp } from "@/types/gameData";
import { BrawlerImageMap } from "@/utils/brawlerImageMap";
import Image from "next/image";
const PlayerCard = ({
  player,
  isStarPlayer,
}: {
  player: Player;
  isStarPlayer: boolean;
}) => (
  <div
    className={`relative flex flex-col items-center p-3 rounded-lg ${
      isStarPlayer
        ? "bg-gradient-to-br from-yellow-500/20 to-amber-500/20 dark:from-yellow-500/30 dark:to-amber-500/30"
        : "bg-white/50 dark:bg-gray-800/50"
    } backdrop-blur-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 group`}
  >
    {/* Star Player Badge */}
    {isStarPlayer && (
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </div>
    )}

    {/* Brawler Image */}
    {/* Check if player has a single brawler or multiple brawlers */}
    {player.brawler ? (
      <div className="w-14 h-14 relative mb-2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 rounded-lg group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-colors duration-300" />
        <Image
          src={
            BrawlerImageMap[player.brawler.name?.toLowerCase() || ""] ||
            "/default-brawler.png"
          }
          alt={player.brawler.name}
          width={20}
          height={20}
          className="w-full h-full object-contain p-2 transform group-hover:scale-110 transition-transform duration-300"
        />
      </div>
    ) : player.brawlers && Array.isArray(player.brawlers) ? (
      <div className="flex flex-wrap gap-2 justify-center">
        {player.brawlers.map((brawler, idx) => (
          <div key={idx} className="w-14 h-14 relative mb-2">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 rounded-lg group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-colors duration-300" />
            <Image
              src={
                BrawlerImageMap[brawler.name?.toLowerCase() || ""] ||
                "/default-brawler.png"
              }
              alt={brawler.name}
              width={20}
              height={20}
              className="w-full h-full object-contain p-2 transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    ) : (
      <div className="w-14 h-14 relative mb-2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 rounded-lg group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-colors duration-300" />
        <Image
          src="/default-brawler.png"
          alt="Unknown Brawler"
          className="w-full h-full object-contain p-2 transform group-hover:scale-110 transition-transform duration-300"
          width={20}
          height={20}
        />
      </div>
    )}

    {/* Player Name */}
    <div className="text-center">
      <p className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate max-w-[120px] group-hover:translate-y-[-2px] transition-transform duration-300">
        {player.name}
      </p>
      <div className="flex items-center justify-center gap-1.5 mt-1">
        <div className="w-4 h-4 flex items-center justify-center bg-gradient-to-br from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 rounded p-0.5 group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-colors duration-300">
          <Image
            src="/icons/level.png"
            width={12}
            height={12}
            alt="level icon"
          />
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Power {player.brawler?.power}
        </span>
      </div>
    </div>
  </div>
);

export default function TeamDisplay({ team, starPlayer }: TeamListProp) {
  //console.log(team, "team from TeamDisplay component");
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {team.map((player) => (
        <PlayerCard
          key={player.tag}
          player={player}
          isStarPlayer={starPlayer?.tag === player.tag}
        />
      ))}
    </div>
  );
}
