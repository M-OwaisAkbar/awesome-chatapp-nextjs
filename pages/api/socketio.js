import { Server } from 'socket.io'
import connectMongo from '../../database/mongo.connection'
import Message from "../../database/models/chat.messages"
import User from "../../database/models/users"
const ioHandler = (req, res) => {
  const activeUsers = []
  connectMongo();
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')
    const io = new Server(res.socket.server);
    const nsp = io.of('/');
    nsp.on('connection', (socket) => {
      socket.emit('currentOnlineUsers', activeUsers)
      socket.on("connectToChat", async (data) => {
        const user = await User.findOne({ email: data.email })
        if (!user) {
          return socket.emit('exception', { status: false, message: 'User Not Found!' })
        }
        if (user) {
          socket.userId = user._id;
          if (!activeUsers.includes(user._id.toString())) {
            activeUsers.push(user._id)
          }

          nsp.emit('currentOnlineUsers', activeUsers)
        }
      })
      socket.on("sendMessage", async (data) => {
        const user = await User.findOne({ email: data.email })
        if (!user) {
          return socket.emit('exception', { status: false, message: 'User Not Found!' })
        }
        if (!data.message) {
          return socket.emit('exception', { status: false, message: 'body is required!' })
        }
        const message = new Message({
          body: data.message,
          sender: { name: user.fullName, id: user._id.toString(), email: user.email },
        })
        message.save((err, message) => {
          if (err) {
            console.log(err)
          }
          else {
            nsp.emit('newMessage', { message })
          }
        })
      });
      socket.on('disconnect', (data) => {
        if (socket.userId) {
          let index = activeUsers.indexOf(socket.userId)
          if (index > -1) {
            activeUsers.splice(index, 1)
          }
          nsp.emit('currentOnlineUsers', activeUsers)
        }
      })
      socket.on('disconnecting', () => {
        console.log('diconnecting')
      })
    })
    res.socket.server.io = io
  } else {
    console.log('socket.io already running')
  }
  res.end()
}
export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler