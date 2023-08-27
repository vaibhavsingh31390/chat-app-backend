const socketIo = require("socket.io");
const messageService =  require('./services/messageService');
module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  global.ONLINE_USERS = new Map();

  io.on("connection", (socket) => {
    socket.on("ADD_USER", (user) => {
      ONLINE_USERS.set(socket.id, [user, Date.now()]);
      io.emit("ONLINE_LIST", Array.from(ONLINE_USERS.values()));
    });

    socket.on("MSG_DELIVERED", async (data) => {
      try {
        let serviceQuery = await messageService.setDelivered(data);
        if (serviceQuery) {
          // console.log(serviceQuery);
          socket.emit('MSG_DELIVERED_ACK', 'DELIVERED')
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("USER_IN_CHAT", async (data) => {
      try {
        let serviceQuery = await messageService.setSeen(data);
        if (serviceQuery) {
          //console.log(serviceQuery);
          socket.emit('MSG_SEEN', 'SEEN');
        }
      } catch (error) {
        console.log(error);
      }
    });


    socket.on("disconnect", () => {
      ONLINE_USERS.delete(socket.id);
      io.emit("ONLINE_LIST", Array.from(ONLINE_USERS.values()));
    });
  });

  return io;
};
