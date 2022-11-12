import mongoose, { model, models } from "mongoose";

const messageSchema = mongoose.Schema({
  body: String,
  //ref could be used depending on complexity
  sender: { name: String, id: String,email:String },
}, { timestamps: true });

const Message = models.message || model('message', messageSchema)

export default Message;