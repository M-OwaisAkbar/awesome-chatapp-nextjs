import User from "../../database/models/users"
import connectMongo from "../../database/mongo.connection"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const saltRounds = 8;

export default async function handler(req, res) {
  await connectMongo()
  const { method } = req
  if (method == 'POST') {
    try {
      const { email, password, fullName } = req.body;
      if (!email.trim() || !password.trim() || !fullName.trim()) {
        return res.status(400).send({ message: "email,password and fullname is required" })
      }
      let aleadyExist = await User.findOne({ email });
      if (aleadyExist) {
        return res.status(400).send({ message: "email or fullname already exists" })
      }
      let bPass = await bcrypt.hash(password, saltRounds);
      const nUser = new User({ fullName, email, password: bPass });
      await nUser.save();
      return res.status(201).send({})
    } catch (error) {
      return res.status(500).send({ message: error.message })
    }
  }
  res.status(200).json({ name: 'John Doe' });
}
