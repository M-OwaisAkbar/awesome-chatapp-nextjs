import Users from "../../database/models/users";
import connectMongo from "../../database/mongo.connection";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  connectMongo()
  const { method } = req
  if (method == 'GET') {
    try {
      const users = await Users.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).send({ message: error.message })
    }
  }
  res.status(200).json({ name: 'PoLa' })
}
