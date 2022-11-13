import { unstable_getServerSession } from "next-auth/next"
import Message from "../../database/models/chat.messages.js";
import connectMongo from "../../database/mongo.connection";
import { authOptions } from "./auth/[...nextauth]"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  connectMongo()
  const session = await unstable_getServerSession(req, res, authOptions)
  const { method } = req
  console.log(session)
  if (!session) {
    return res.status(401).json({ message: 'You donot belong here' })
  }
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


