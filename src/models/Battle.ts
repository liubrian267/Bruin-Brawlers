import mongoose from "mongoose";
import { Game } from "@/types/gameData";

const brawlerSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // Brawler ID (e.g., 16000079)
  name: { type: String, required: true }, // Brawler name (e.g., "ANGELO")
  power: { type: Number, required: true }, // Brawler power level (e.g., 7)
  trophies: { type: Number, required: true }, // Brawler trophies (e.g., 287)
});

const playerSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  name: { type: String, required: true },
  brawler: brawlerSchema, 
  brawlers: [brawlerSchema]
});


const starPlayerSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  name: { type: String, required: true },
  brawler: brawlerSchema, 
});

export const battleSchema = new mongoose.Schema({
  battleTime: { type: String, required: true }, // Unique identifier for the battle
  event: {
    id: { type: Number, required: true }, // Event ID
    mode: { type: String, required: true }, // Event mode (e.g., "brawlBall")
    map: { type: String, required: true }, // Map name (e.g., "Beach Ball")
  },
  battle: {
    mode: { type: String, required: true }, // Battle mode (e.g., "brawlBall")
    type: { type: String, required: true }, // Battle type (e.g., "ranked")
    rank: { type: Number, required: false }, // Player rank (e.g., 7) for showdown modes
    result: { type: String, required: false }, // Battle result (e.g., "victory")
    duration: { type: Number, required: false }, // Duration of the battle in seconds
    trophyChange: {type: Number}, // Change in trophies after the battle)
    starPlayer: starPlayerSchema,
    teams: {
      type: [[playerSchema]], // Nested arrays of players (for team battles)
      required: false,       // Now optional
    },
    players: {
      type: [playerSchema],  // Flat array of players (for solo battles)
      required: false,       // Optional attribute
    },
  },
});

export const Battle = mongoose.models.Battle || mongoose.model('Battle', battleSchema);

// Extend the existing Game type with Mongoose document properties
export interface GameDocument extends Game, mongoose.Document {}
