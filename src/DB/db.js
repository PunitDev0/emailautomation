import mongoose from 'mongoose';


// Connection function
export async function connectToDatabase() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables');
    return Promise.reject(new Error("MONGO_URI is not defined."));
  }

  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB.");



  } catch (error) {
    console.error("Error connecting to MongoDB or updating data:", error.message);
    throw error; // Ensure it propagates for error monitoring tools
  }
}

 