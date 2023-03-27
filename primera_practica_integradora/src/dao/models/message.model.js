import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
});

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;
