import mongoose from "mongoose";
import { User } from "../types/interface";
import { Role } from "../utils/utils";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Role,
    required: true,
  },
});

const userModel = mongoose.model<User>("user", userSchema);
export default userModel;
