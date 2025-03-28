import mongoose, { ConnectOptions } from 'mongoose';

interface MyConnectOptions extends ConnectOptions {
  serverSelectionTimeoutMS?: number;
}

export async function connectToDatabase() {
    const MONGO_URI: string | undefined = process.env.MONGO_URI;
    if (!MONGO_URI) {
        throw new Error("Please define the MONGO_URI environment variable inside .env");
    }
    try {
        
        const options: MyConnectOptions = {
            serverSelectionTimeoutMS: 10000, // Timeout after 5s instead of 30s
        };

        await mongoose.connect(MONGO_URI, options);
        await import("../models/User");
        await import("../models/Post");
        console.log("Registered models:", mongoose.models);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}
