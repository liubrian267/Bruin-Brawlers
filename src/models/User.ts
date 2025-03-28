import mongoose, { ObjectId, Types} from "mongoose";
import bcrypt from "bcryptjs";
import { battleSchema } from "./Battle";
import { BattleSessionData } from "../types/gameData";
// Define the user schema

export interface IUser extends Document {
  _id: ObjectId;
  BrawlID: string;
  email: string;
  username: string;
  password: string;
  profilePicture: string | null;
  trophies: number;
  brawlers: Array<{
    name: string;
    trophies: number;
  }>;
  socialMedia: {
    twitter: string | null;
    instagram: string | null;
    discord: string | null;
  };
  biography: string;
  battleSession: BattleSessionData;
  friends: Types.ObjectId[];
}

const userSchema = new mongoose.Schema({
  BrawlID: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, default: "Anonymous" },
  password: { type: String, required: true },
  profilePicture: { type: String, default: null },
  trophies: { type: Number, default: 0 },
  brawlers: [
    {
      name: String,
      trophies: Number,
    },
  ],
  socialMedia: {
    twitter: { type: String, default: null },
    instagram: { type: String, default: null },
    discord: { type: String, default: null },
  },
  biography: { type: String, default: "" },
  // Changed battleSession from a Map to a sub-document so it exactly matches BattleSessionData.
  battleSession: {
    type: Map,
    of: {
      battles: [battleSchema],
      totalBattles: Number,
      totalWins: Number,
      winRate: Number,
      draws: Number,
      totalTrophyChange: Number,
    },
    default: () => new Map(), // Initialize as a Map
  },

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Prevent OverwriteModelError if the model already exists
if (mongoose.models.User) {
  delete mongoose.models.User;
}
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;