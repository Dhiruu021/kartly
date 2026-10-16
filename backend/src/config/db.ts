import mongoose from "mongoose";
import { ENV } from "./env.js";

let mongod: any = null;

export const connectDB = async (): Promise<string> => {
  try {
    let uri = ENV.MONGODB_URI;

    if (uri && uri.trim() !== "") {
      console.log(`Connecting to configured MongoDB URI...`);
      await mongoose.connect(uri);
      console.log(`MongoDB Connected successfully to external database: ${mongoose.connection.host}`);
      return uri;
    }

    console.log(`No MONGODB_URI provided. Initializing local in-memory MongoDB server for instant zero-config runtime...`);
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to local In-Memory MongoDB at: ${uri}`);
    return uri;
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    if (!mongod && ENV.NODE_ENV !== "production") {
      console.log("Falling back to In-Memory MongoDB Server...");
      try {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        await mongoose.connect(fallbackUri);
        console.log(`Connected to Fallback In-Memory MongoDB at: ${fallbackUri}`);
        return fallbackUri;
      } catch (fallbackErr) {
        console.error("Failed to start fallback in-memory MongoDB:", fallbackErr);
        throw fallbackErr;
      }
    }
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error("Error disconnecting MongoDB:", err);
  }
};
