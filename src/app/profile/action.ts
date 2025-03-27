"use server";
import { connectToDatabase } from "@/utils/database";
import User from "@/models/User";
import { Game } from "@/types/gameData";


export async function updateMatchHistory(brawlID: string, matches: Game[]) {
  await connectToDatabase();
  

  // Log the input to debug
  //console.log(`Updating match history for BrawlID: ${brawlID}, Matches count: ${matches.length}`);
  
  const user = await User.findOne({ BrawlID: brawlID });
  if (!user) {
    throw new Error("User not found");
  }
  // Log the current state of battleSession
  //console.log("Current battleSession:", user.battleSession);
  
  // Ensure battleSession is a Map instance
  if (!user.battleSession || !(user.battleSession instanceof Map)) {
    user.battleSession = new Map();
  }
  
  for (const game of matches) {
    // Format battleTime into a date string (e.g., "YYYY-MM-DD")
    const formatDate = game.battleTime.replace(/^(\d{4})(\d{2})(\d{2}).*/, "$1-$2-$3");
    const date = new Date(formatDate).toISOString().split("T")[0];
    
    console.log(`Processing game for date: ${date}`, game.battleTime);
    
    // Get existing battle session for the date using Map.get
    const battleData = user.battleSession.get(date);
    if (battleData) {
      // Check if a game with the same battleTime already exists
      const isDuplicate = battleData.battles.some(
        (existingGame) => existingGame.battleTime === game.battleTime
      );
      
      if (!isDuplicate) {
        console.log(`Adding new game to existing battle session for date: ${date}`);
        battleData.battles.push(game);
        battleData.totalBattles = (battleData.totalBattles ?? 0) + 1;
        battleData.totalWins = (battleData.totalWins ?? 0) + (game.battle.result === "victory" ? 1 : 0);
        battleData.winRate = (battleData.totalWins / battleData.totalBattles) * 100;
        battleData.draws = (battleData.draws ?? 0) + (game.battle.result === "draw" ? 1 : 0);
        battleData.totalTrophyChange = (battleData.totalTrophyChange ?? 0) + game.battle.trophyChange;
        
        // Update the map with the new battleData
        user.battleSession.set(date, battleData);
      } else {
        console.log(`Game already exists in battle session for date: ${date}`);
      }
    } else {
      console.log(`Creating new battle session for date: ${date}`);
      const totalBattles = 1;
      const totalWins = game.battle.result === "victory" ? 1 : 0;
      const winRate = (totalWins / totalBattles) * 100;
      const draws = game.battle.result === "draw" ? 1 : 0;
      const totalTrophyChange =  game.battle.trophyChange;
      
      // Create a new session using Map.set
      user.battleSession.set(date, {
        battles: [game] as any,
        totalBattles,
        totalWins,
        winRate,
        draws,
        totalTrophyChange,
      });
    }
  }
  
  // Mark the battleSession as modified to ensure Mongoose tracks changes
  // user.markModified("battleSession");
  
  //console.log("Updated battleSession before save:", user.battleSession);
  
  try {
    await user.save();
    console.log("User saved successfully");
    
    return user.battleSession;
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
}
