"use server";
import { connectToDatabase } from "@/utils/database";
import User from "@/models/User";
// import { battleSchema } from "@/models/Battle";
// import { Battle } from "@/models/Battle";
import { Game } from "@/types/gameData";



export async function updateMatchHistory(brawlID: string, matches: Game[]) {
  // Validate input
  //console.log(matches)
  if (!brawlID) {
    throw new Error("BrawlID is required");
  }

  await connectToDatabase();

  const user = await User.findOne({ BrawlID: brawlID });
  if (!user) {
    throw new Error("User not found");
  }

  // Ensure battleSession exists and is a Map
  if (!user.battleSession) {
    user.battleSession = new Map();
  }

  matches.forEach(game => {
    // Format battleTime into a date string (e.g., "YYYY-MM-DD")
    const formatDate = game.battleTime.replace(/^(\d{4})(\d{2})(\d{2}).*/, "$1-$2-$3");
    const date = new Date(formatDate).toISOString().split("T")[0];
    //console.log(game, "from loop")
    // Access or create battle session for the date
    const battleData = user.battleSession.get(date);

    if (battleData) {
      // Check for duplicate game
      const isDuplicate = battleData.battles.some(
        (existingGame: Game) => existingGame.battleTime === game.battleTime
      );

      if (!isDuplicate) {
        console.log(`Adding game to battle session for date: ${date}`);
        battleData.battles.push(game);
        battleData.totalBattles = (battleData.totalBattles || 0) + 1;
        battleData.totalWins = (battleData.totalWins || 0) + (game.battle.result === "victory" ? 1 : 0);
        battleData.winRate = battleData.totalBattles
        ? (battleData.totalWins / battleData.totalBattles) * 100
        : 0;
      
        battleData.draws = (battleData.draws || 0) + (game.battle.result === "draw" ? 1 : 0);
        battleData.totalTrophyChange = (battleData.totalTrophyChange || 0) + game.battle.trophyChange;
      } else {
        console.log(`Game already exists in battle session for date: ${date}`);
      }
    } else {
      // Create a new battle session entry for the date
      const newBattleData = {
        battles: [game],
        totalBattles: 1,
        totalWins: game.battle.result === "victory" ? 1 : 0,
        winRate: game.battle.result === "victory" ? 100 : 0,
        draws: game.battle.result === "draw" ? 1 : 0,
        totalTrophyChange: game.battle.trophyChange,
      };
      user.battleSession.set(date, newBattleData);
    }
  });

  // Mark the battleSession as modified so that Mongoose tracks the changes
  user.markModified("battleSession");

  try {
    await user.save();
    console.log("User saved successfully");
    //console.log("Updated battleSession after save:", user.battleSession);
    return user.battleSession;
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
}