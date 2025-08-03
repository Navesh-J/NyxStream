import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

console.log("🔍 ENV MONGODB_URI:", MONGODB_URI || "Not defined");

if (!MONGODB_URI) {
  throw new Error("Please define mongo_uri in env variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };
    console.log(process.env.MONGODB_URI)
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.log(process.env.MONGODB_URI)
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
