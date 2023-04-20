const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId && user.socketId === socketId) &&
    users.unshift({ userId, socketId });
};

const getReceiver = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  //When connect
  console.log("a user connected...");
  //take userId and socketId form client
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getReceiver(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });
  socket.on("sendNotification", ({ senderName, receiverId, type }) => {
    const receiver = getReceiver(receiverId);

    io.to(receiver?.socketId).emit("getNotification", {
      senderName,
      type,
    });
  });

  //When disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
