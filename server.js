const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT=process.env.PORT||3000;
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
const botName = 'Geeks talk Bot';


app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});
// io.on("connection", (socket) => {
//   socket.on('new-user', name => {
//     users[socket.id] = name;
//     socket.broadcast.emit('user-connected', name)
//   })
//   socket.on('send-chat-message', message => {
//     socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
//   })
//   socket.on("join-room", (roomId, userId) => {
//     socket.join(roomId);
//     socket.to(roomId).broadcast.emit("user-connected", userId);
//     socket.on("disconnect", () => {
//       socket.to(roomId).broadcast.emit("user-disconnected", userId);
//     });
//   });
  
//});
io.on('connection', socket => {
    socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    
  });
  socket.on('joinRoom', ({ username, room }) => {
    
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to geek talk!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

     
    }
  });
});

server.listen(PORT);
