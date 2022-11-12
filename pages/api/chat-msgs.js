import Message from "../../database/models/chat.messages.js";
import connectMongo from "../../database/mongo.connection";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  connectMongo()
  const { method } = req
  if (method == 'GET') {
    try {
      const messages = await Message.find();
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).send({ message: error.message })
    }
  }
  res.status(200).json({ name: 'John Doe' })
}
