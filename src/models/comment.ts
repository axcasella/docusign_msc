import mongoose from "mongoose";
import { Comment } from "../types/interface";

const commentSchema = new mongoose.Schema({
  certificate: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const commentModel = mongoose.model<Comment>("comment", commentSchema);
export default commentModel;
