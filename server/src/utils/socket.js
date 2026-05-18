const { Server } = require("socket.io");

let io;
const userSockets = new Map(); // Map to store userId -> socketId

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Replace with your frontend URL
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join", (userId) => {
            userSockets.set(userId, socket.id);
            console.log(`User ${userId} joined with socket ${socket.id}`);
        });

        // Voice Room Sockets
        socket.on("voice-room:join", ({ roomId, userId, username }) => {
            socket.join(`room:${roomId}`);
            console.log(`Socket ${socket.id} (User: ${userId}, Name: ${username}) joined socket room: room:${roomId}`);
        });

        socket.on("voice-room:leave", ({ roomId, userId }) => {
            socket.leave(`room:${roomId}`);
            console.log(`Socket ${socket.id} (User: ${userId}) left socket room: room:${roomId}`);
        });

        socket.on("disconnect", () => {
            // Find and remove the user from the map
            for (let [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

const sendNotification = (userId, notification) => {
    if (io) {
        const socketId = userSockets.get(userId.toString());
        if (socketId) {
            io.to(socketId).emit("notification", notification);
        }
    }
};

const broadcastToAdmins = (notification) => {
    if (io) {
        // This assumes you might have a way to identify admins
        // For now, we can just emit to a room or iterate
        io.emit("admin_notification", notification);
    }
};

module.exports = { initSocket, getIO, sendNotification, broadcastToAdmins };
