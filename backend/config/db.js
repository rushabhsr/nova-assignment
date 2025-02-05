
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

const mongooseOptions = {
  useNewUrlParser: true,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  w: "majority",
};

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, mongooseOptions);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB.");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB.");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed due to app termination.");
  process.exit(0);
});

export default connectDB;