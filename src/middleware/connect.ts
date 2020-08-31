import mongoose from "mongoose";
import { mongoDBUrl } from "../config/config";

const connectToMongoDB = async () => {
  try {
    console.log(mongoDBUrl);
    await mongoose.connect(mongoDBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.log(`error: ${err.message}`);
    process.exit(1);
  }
};

export default connectToMongoDB;
