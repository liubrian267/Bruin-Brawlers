import * as React from "react";
import BrawlerList from "@/components/dataDisplay/BrawlerList";
import MatchList from "@/components/dataDisplay/MatchList";
import ProfileData from "@/components/dataDisplay/ProfileData";
import { updateMatchHistory } from "../action";

const API_KEY = process.env.BS_API_KEY as string;
const URL = "https://api.brawlstars.com/v1";

interface brawler {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
}

const page = async ({ params }: { params: { brawlID: string } }) => {
  // Debug log for environment variables
  //need stronger typing for the profileData being fetched
  //store type of profileData in types folder
  const { brawlID } = params;
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
  } catch (error: any) {
    console.error("Failed to fetch profile data:", error.message);
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

    battleSession = rawBattleSession
      ? Object.fromEntries(
          Array.from(rawBattleSession.entries()).map(([date, data]) => [
            date,
            {
              battles: data.battles.map((battle) => ({
                ...JSON.parse(JSON.stringify(battle)),
                _id: battle._id ? battle._id.toString() : null,
              })),
              totalBattles: data.totalBattles || 0,
              totalWins: data.totalWins || 0,
              winRate: data.winRate || 0,
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
