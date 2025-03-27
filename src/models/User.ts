import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { battleSchema } from "./Battle";
// Define the user schema

const userSchema = new mongoose.Schema({
    BrawlID: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, default: "Anonymous" },
    password: { type: String, required: true },
    profilePicture: { type: String, default: null },
    trophies: { type: Number, default: 0 },
    brawlers: [{
      name: String,
      trophies: Number
    }],
    socialMedia: {
      twitter: { type: String, default: null },
      instagram: { type: String, default: null },
      discord: { type: String, default: null }
    },
    biography: { type: String, default: "" },
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

// Prevent OverwriteModelError
if (mongoose.models.User) {
    delete mongoose.models.User;
  }
  const User = mongoose.model("User", userSchema);

export default User;
