import mongoose from "mongoose"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local")
}

const MONGODB_URI = process.env.MONGODB_URI

// Use global variable to cache the connection in development
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ Connected to MongoDB")
        return mongoose
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error)
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
