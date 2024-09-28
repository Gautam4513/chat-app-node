// Node server to handle socketio connections
const port = process.env.PORT
const io = require('socket.io')(port, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const user = {}

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log("New user", name);
        user[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        io.emit('update-user-count', Object.keys(user).length);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: user[socket.id] })
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', user[socket.id]);
        delete user[socket.id];
        io.emit('update-user-count', Object.keys(user).length);
    });
})

