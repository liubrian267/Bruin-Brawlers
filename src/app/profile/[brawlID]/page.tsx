import * as React from "react";
import BrawlerList from "@/components/dataDisplay/BrawlerList";
import MatchList from "@/components/dataDisplay/MatchList";
import ProfileData from "@/components/dataDisplay/ProfileData";
import { updateMatchHistory } from "../action";
import { headers } from "next/headers";
import { BattleSessionEntry } from "@/types/gameData";
const API_KEY = process.env.BS_API_KEY as string;
const URL = "https://api.brawlstars.com/v1";

interface brawler {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
}

function extractBrawlIDFromUrl(url: string): string | null {
  try {
    const { pathname } = new globalThis.URL(url);
    // Remove empty segments (in case of leading slash)
    const segments = pathname.split("/").filter(Boolean);
    // Check if the first segment is "profile" and a second segment exists.
    if (segments[0].toLowerCase() === "profile" && segments[1]) {
      return segments[1];
    }
    return null;
  } catch (error) {
    console.error("Invalid URL provided:", error);
    return null;
  }
}

// interface PageProps {
//   params: {
//     brawlID: string;
//   };
// }
const page = async () => {
  // const { brawlID } = params;
  // console.log("Extracted brawlID:", brawlID);
  // Debug log for environment variables
  //need stronger typing for the profileData being fetched
  //store type of profileData in types folder
  // const brawlIDQuery = router.query.brawlID;

  // if (!brawlIDQuery || Array.isArray(brawlIDQuery)) {
  //   // Handle the error appropriately: show an error message, return, or use a fallback.
  //   throw new Error("Invalid brawlID: it must be a single string.");
  // }

  // const brawlID: string = brawlIDQuery;
  // Retrieve all headers from the incoming request
  //const { brawlID } = params;
  const headersList = headers();
  // const fullUrl = (await headersList).get("referer") || "";

  // console.log(fullUrl, "url");
  // const fullUrl = "http://localhost:3000/profile/29PUCGGV";
  const activePath = (await headersList).get("x-pathname");
  console.log(activePath, "active path");
  const brawlID = activePath
    ? (extractBrawlIDFromUrl(activePath) as string)
    : "";
  //const brawlID = "29PUCGGV";
  console.log(brawlID);
  let profileData = null;

  try {
    const apiUrl = `${URL}/players/%23${brawlID}`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    profileData = await response.json();
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
  }

  let brawlers = profileData?.brawlers;
  if (brawlers) {
    brawlers = brawlers.sort(
      (a: brawler, b: brawler) => b.trophies - a.trophies
    );
  }

  let battlelog = null;
  let battleSession = null;
  try {
    const response = await fetch(`${URL}/players/%23${brawlID}/battlelog`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    battlelog = await response.json();
    const rawBattleSession = await updateMatchHistory(brawlID, battlelog.items);

    // Define the type for rawBattleSession entries
    // type BattleSessionEntry = {
    //   battles: {
    //     _id?: string | null;
    //     [key: string]: any;
    //   }[];
    //   totalBattles: number;
    //   totalWins: number;
    //   winRate: number;
    // };
    //console.log("Raw battle session:", rawBattleSession);
    // Type assertion for rawBattleSession
    battleSession = rawBattleSession
      ? Object.fromEntries(
          Array.from(
            rawBattleSession.entries() as Iterable<[string, BattleSessionEntry]>
          ).map(([date, data]) => [
            date,
            {
              battles: data.battles.map((battle) => ({
                ...JSON.parse(JSON.stringify(battle)),
              })),
              totalBattles: data.totalBattles || 0,
              totalWins: data.totalWins || 0,
              winRate: data.winRate || 0,
              draws: data.draws || 0,
              totalTrophyChange: data.totalTrophyChange || 0,
              _id: data._id ? data._id.toString() : null,
            },
          ])
        )
      : {};

    //console.log("Battle session updated:", battleSession);
  } catch (error) {
    console.error("Failed to update match history:", error);
  }

  if (!profileData) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p>No profile data available. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-transparent">
      <ProfileData profileData={profileData} />
      {brawlers && <BrawlerList brawlers={brawlers} />}
      {battleSession && <MatchList battleSession={battleSession} />}
    </div>
  );
};

export default page;
