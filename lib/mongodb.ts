// lib/mongodb.ts
import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const g = globalThis as typeof globalThis & { mongoose?: MongooseCache };

g.mongoose = g.mongoose || { conn: null, promise: null };

// ✅ This function guarantees a string (or throws a clear error)
function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Set it in .env.local (local) or Vercel Environment Variables (prod)."
    );
  }
  return uri;
}

export async function dbConnect() {
  if (g.mongoose!.conn) return g.mongoose!.conn;

  if (!g.mongoose!.promise) {
    const MONGODB_URI = getMongoUri(); // ✅ string (not undefined)
    g.mongoose!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  g.mongoose!.conn = await g.mongoose!.promise;
  return g.mongoose!.conn;
}
