import mongoose from 'mongoose';

const connection = {}

const connectMongo = async () => {
  try {
    if (connection.isConnected)
      return
    const db = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    connection.isConnected = db.connections[0].readyState
    if (connection.isConnected) {
      console.log("Database Connected")
    }
  } catch (err) {
    throw err
  }
}

export default connectMongo;