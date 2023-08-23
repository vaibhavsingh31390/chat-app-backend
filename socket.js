const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    }
  });

  global.ONLINE_USERS = new Map(); 

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('ADD_USER', (user) => {
      ONLINE_USERS.set(socket.id, [user, Date.now()]);
      io.emit('ONLINE_LIST', Array.from(ONLINE_USERS.values()));
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      ONLINE_USERS.delete(socket.id);
      io.emit('ONLINE_LIST', Array.from(ONLINE_USERS.values()));
    });
  });

  return io;
};
