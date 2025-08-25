
import cors from 'cors'
import express from 'express'
import { Server } from 'socket.io'
import { chats } from './src/data/data.js'

import { config } from 'dotenv'
import globalerr from './src/middleware/globalerr.js'
import './src/model/connectdb.js'
import { charRoute } from './src/module/chat/chat.route.js'
import { messageroute } from './src/module/message/message.route.js'
import { userRoute } from './src/module/users/user.Route.js'
config()
const app = express()
const port = process.env.PORT

app.use(cors()  )
app.use(express.json())
app.use('/api/user', userRoute)
app.use('/api/chat', charRoute)
app.use('/api/message', messageroute)
app.get('/api/chat/:id',(req,res)=>{
    const {id} = req.params
    console.log(id);
    
    const singlechat = chats.find((chat) => chat._id === id)
    res.send(singlechat)
})




const server=app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const io =  new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],

    }
})


const onlineUsers = {}; // userId -> socketId

io.on("connection", (socket) => {
  const user = socket.handshake?.auth.userId?.user; // جاي من client
   onlineUsers[user?._id] = socket.id; // اربط الاتنين
 
 
 

  socket.on("sendPrivateMessage", ({ reciverid, message }) => {

    console.log(message);
    
    console.log(reciverid._id);
  const receiverSocketId = onlineUsers[reciverid._id];
  if (receiverSocketId) {
    
    io.to(receiverSocketId).emit("privateMessage", message);
  }
});
// Voice offer
  socket.on("voice-offer", ({ offer, to }) => {
    const receiverSocketId = onlineUsers[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("voice-offer", { offer, from: user._id });
    }
  });
    // Voice answer
  socket.on("voice-answer", ({ answer, to }) => {
    const receiverSocketId = onlineUsers[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("voice-answer", { answer, from: user._id });
    }
  });
    socket.on("voice-candidate", ({ candidate, to }) => {
    const receiverSocketId = onlineUsers[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("voice-candidate", { candidate, from: user._id });
    }
  });



});



app.use(   ( (req, res, next) => {
 res.json('page not found')
}));
app.use(globalerr)


