"use client";
import { useState } from "react";
import { MatchListProps } from "@/types/gameData";
import Match from "./Match";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LineChart from "./lineChart";
import Image from "next/image";

// function toTitleCase(str: string): string {
//   return str.replace(/\b\w/g, (char) => char.toUpperCase());
// }

export default function MatchList({ battleSession }: MatchListProps) {
  // console.log(battleSession, "from MatchList component");
  const [visibleCount, setVisibleCount] = useState(25);
  const [showMatches, setShowMatches] = useState(false);
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 25);
  };

  dayjs.extend(relativeTime);
  // dayjs.locale("en", {
  //   relativeTime: {
  //     d: "1 day", // For singular day
  //     dd: "%d days", // For plural days
  //   },
  // });
  const sortedDates = Object.keys(battleSession).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  return (
    <details
      className="collapse bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
      onToggle={(e) => setShowMatches((e.target as HTMLDetailsElement).open)}
    >
      <summary className="collapse-title p-6 text-xl font-medium flex items-center gap-3 cursor-pointer bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] text-white rounded-t-xl group">
        <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
          <Image
            src="/icons/battleLog.png"
            width={30}
            height={30}
            alt="battlelog"
          />
        </div>
        <span className="group-hover:translate-x-1 transition-transform duration-300">
          {showMatches ? "Hide Match History" : "Show Match History"}
        </span>
      </summary>
      <LineChart battleSession={battleSession} />
      <div className="collapse-content p-6">
        <div className="max-w-4xl mx-auto overflow-hidden">
          <h2 className="text-2xl font-bold mb-8 pb-4 bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] bg-clip-text text-transparent border-b border-gray-200 dark:border-gray-700">
            Recent Matches
          </h2>

          <div className="space-y-6">
            {sortedDates.slice(0, visibleCount).map((date) => (
              <details
                key={date}
                className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-[#2774AE]/10 to-[#1e5c8c]/10 dark:from-[#2774AE]/20 dark:to-[#1e5c8c]/20 rounded-lg group-hover:from-[#2774AE]/20 group-hover:to-[#1e5c8c]/20 dark:group-hover:from-[#2774AE]/30 dark:group-hover:to-[#1e5c8c]/30 transition-colors duration-300">
                      <Image
                        src="/icons/calendar.png"
                        width={20}
                        height={20}
                        alt="calendar icon"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:translate-x-1 transition-transform duration-300">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm">
                        <div className="flex items-center gap-2 bg-white/50 dark:bg-white/10 px-3 py-1.5 rounded-lg">
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-[#2774AE] dark:text-[#4A9EDE]"
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
                          </svg> */}
                          <span className="dark:text-gray-200">
                            Matches: {battleSession[date].totalBattles}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/50 dark:bg-white/10 px-3 py-1.5 rounded-lg">
                          <Image
                            src="/icons/trophies.png"
                            width={20}
                            height={20}
                            alt="trophy icon"
                          ></Image>
                          <span className="dark:text-gray-200">
                            Winrate: {battleSession[date].winRate.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="transform transition-transform duration-300 group-open:rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>

                <div className="p-4 pt-0 space-y-4">
                  {battleSession[date].battles.map((battle, index) => (
                    <div
                      key={index}
                      className="transform transition-all duration-300 hover:-translate-y-1"
                    >
                      <Match game={battle} />
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>

          {visibleCount < Object.keys(battleSession).length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleShowMore}
                className="px-6 py-3 bg-gradient-to-r from-[#2774AE] to-[#1e5c8c] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium hover:from-[#1e5c8c] hover:to-[#2774AE] transform hover:-translate-y-0.5"
              >
                Show More Days
              </button>
            </div>
          )}
        </div>
      </div>
    </details>
  );
}
