import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  age: { type: Number, required: true },
  user: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
});

const userModel = mongoose.model("users", userSchema);
export default userModel;
