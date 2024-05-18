import mongoose from "mongoose";

const mongoURI = "mongodb://0.0.0.0:27017/techfest";

async function connectToMongo() {
  try {
    await mongoose.connect(mongoURI);

    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

export default connectToMongo;
