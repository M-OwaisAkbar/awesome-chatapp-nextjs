import mongoose, { model } from "mongoose";
import { models } from "mongoose";

const userSchema = mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
}, { timestamps: true });

const User = models.user || model('user', userSchema)

export default User;