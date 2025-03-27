import React from "react";
import { Game } from "@/types/gameData";
import Team from "./TeamDisplay";
import Image from "next/image";

import { ModeImageMap } from "@/utils/modeImages";
export default function Match({ game }: { game: Game }) {
  const result = game.battle?.result || "unknown";
  console.log(game, "from match component");
  const resultClass =
    result === "victory"
      ? "text-green-500 dark:text-green-400"
      : result === "defeat"
      ? "text-red-500 dark:text-red-400"
      : "text-gray-500 dark:text-gray-400";

  const resultBg =
    result === "victory"
      ? "bg-green-500/10 dark:bg-green-400/10"
      : result === "defeat"
      ? "bg-red-500/10 dark:bg-red-400/10"
      : "bg-gray-500/10 dark:bg-gray-400/10";

  return (
    <div className="w-full rounded-xl overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 group">
      {/* Header with battle info */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          {/* Mode and Type */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 rounded-lg group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-colors duration-300">
              {ModeImageMap[game.battle.mode] && (
                <Image
                  src={ModeImageMap[game.battle.mode]}
                  width={30}
                  height={30}
                  alt={game.battle.mode}
                />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {game.battle?.mode || "Unknown Mode"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {game.battle?.type || "Unknown Type"}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 rounded-lg group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-[#2774AE] dark:text-[#4A9EDE]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {game.battle?.duration || "0"}s
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Duration
              </p>
            </div>
          </div>

          {/* Trophy Change */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 rounded-lg group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-colors duration-300">
              <Image
                src="/icons/trophies.png"
                width={20}
                height={20}
                alt="trophy icon"
              ></Image>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {game.battle?.trophyChange || "0"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Trophies
              </p>
            </div>
          </div>

          {/* Result */}
          <div
            className={`ml-auto px-4 py-1.5 rounded-lg font-medium ${resultBg} ${resultClass}`}
          >
            {result.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="p-4 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {game.battle?.teams && (
            <>
              {game.battle.teams.map((team, index) => (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 shadow-sm"
                >
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Team {index + 1}
                  </h4>
                  <Team team={team} starPlayer={game.battle.starPlayer} />
                </div>
              ))}
            </>
          )}
          {game.battle?.players && game.battle.players.length > 0 && (
            <div className="col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Players
              </h4>
              <Team
                team={game.battle.players}
                starPlayer={game.battle.starPlayer}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// {!game.battle?.teams && game.battle?.players && (
