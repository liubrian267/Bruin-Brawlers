"use client";
import { useState } from "react";
import { BrawlerImageMap } from "@/utils/brawlerImageMap";
import Image from "next/image";

interface brawler {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
}

interface brawlerList {
  brawlers: brawler[];
}

export default function BrawlerList({ brawlers }: brawlerList) {
  const [visibleCount, setVisibleCount] = useState(18);
  const [showBrawlers, setShowBrawlers] = useState(false);
  const [selectedBrawler, setSelectedBrawler] = useState<brawler | null>(null);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 18);
  };

  return (
    <details
      className="collapse bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 mb-6"
      onToggle={(e) => setShowBrawlers((e.target as HTMLDetailsElement).open)}
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <span className="group-hover:translate-x-1 transition-transform duration-300">
          {showBrawlers ? "Hide Brawlers" : "Show Brawlers"}
        </span>
      </summary>
      <div className="collapse-content p-6">
        <div className="max-w-4xl mx-auto overflow-hidden">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] bg-clip-text text-transparent">
              Brawlers Collection
            </h2>
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] text-white rounded-xl text-sm font-medium">
                {brawlers.length}/89
              </span>
              <div className="relative">
                <select
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-1.5 pr-8 text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2774AE] cursor-pointer"
                  onChange={(e) => setVisibleCount(parseInt(e.target.value))}
                  value={visibleCount}
                >
                  <option value={18}>Show 18</option>
                  <option value={36}>Show 36</option>
                  <option value={54}>Show 54</option>
                  <option value={1000}>Show All</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {brawlers
              ?.slice(0, visibleCount)
              .map((brawler: brawler, index: number) => (
                <div
                  key={index}
                  className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  onClick={() =>
                    setSelectedBrawler(
                      selectedBrawler?.id === brawler.id ? null : brawler
                    )
                  }
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2774AE]/5 to-[#1e5c8c]/5 dark:from-[#2774AE]/10 dark:to-[#1e5c8c]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-4 flex items-center gap-4">
                    <div className="w-16 h-16 relative flex-shrink-0 bg-gradient-to-br from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 rounded-lg overflow-hidden group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-all duration-300">
                      <Image
                        src={BrawlerImageMap[brawler.name.toLowerCase()]}
                        alt={brawler.name}
                        className="object-contain w-full h-full p-2 transform group-hover:scale-110 transition-transform duration-300"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:translate-x-1 transition-transform duration-300">
                        {brawler.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-5 h-5 flex items-center justify-center bg-gradient-to-br from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 rounded-lg p-1 group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-colors duration-300">
                          <Image
                            src="/icons/trophies.png"
                            alt="Trophies"
                            width={12}
                            height={12}
                            className="object-contain"
                          />
                        </div>
                        <span className="text-[#2774AE] dark:text-[#4A9EDE] font-medium">
                          {brawler.trophies}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="text-sm px-2.5 py-0.5 bg-gradient-to-r from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 rounded-lg text-gray-700 dark:text-gray-300 group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-colors duration-300">
                        Power {brawler.power}
                      </div>
                      <div className="text-sm px-2.5 py-0.5 bg-gradient-to-r from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 rounded-lg text-gray-700 dark:text-gray-300 group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-colors duration-300">
                        Rank {brawler.rank}
                      </div>
                    </div>
                  </div>
                  {selectedBrawler?.id === brawler.id && (
                    <div className="p-4 pt-0 mt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="block font-medium mb-1">
                            Power Level
                          </span>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(brawler.power / 11) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="block font-medium mb-1">
                            Rank Progress
                          </span>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(brawler.rank / 35) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
          {visibleCount < brawlers.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleShowMore}
                className="px-6 py-3 bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium hover:from-[#1e5c8c] hover:to-[#2774AE] transform hover:-translate-y-0.5"
              >
                Show More Brawlers
              </button>
            </div>
          )}
        </div>
      </div>
    </details>
  );
}
