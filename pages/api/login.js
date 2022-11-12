import User from "../../database/models/users";
import connectMongo from "../../database/mongo.connection";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  connectMongo()
  const { method } = req
  if (method == 'POST') {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send({ message: "email and password are required" })
      }
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({ message: "no associated account found" })
      }
      let correctPass = await bcrypt.compare(password, user.password)
      if (!correctPass) {
        return res.status(400).send({ message: "incorrect password" })
      }
      let accessToken = jwt.sign({ email: user.email, fullName: user.fullName, id: user._id }, process.env.JWT_SECRET)
      return res.status(200).send({ accessToken, user })
    } catch (error) {
      return res.status(500).send({ message: error.message })
    }
  }
  res.status(200).json({ name: 'John Doe' })
}
