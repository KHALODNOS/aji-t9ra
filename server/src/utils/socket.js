const { Server } = require("socket.io");

let io;
const userSockets = new Map(); // Map to store userId -> socketId
const generalChatUsers = new Map(); // socketId -> user
const generalChatMessages = [];

const getGeneralChatUsers = () => Array.from(generalChatUsers.values());

const buildChatMessage = ({ text, user }) => ({
    id: `general-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    sender: {
        id: user.id,
        name: user.name || "طالب",
        avatar: user.avatar || "",
        role: user.role || "student"
    },
    createdAt: new Date().toISOString()
});

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

        socket.on("general-chat:join", (user = {}) => {
            const chatUser = {
                id: user.id || socket.id,
                name: user.name || "طالب",
                avatar: user.avatar || "",
                role: user.role || "student"
            };

            socket.join("general-chat");
            generalChatUsers.set(socket.id, chatUser);
            socket.emit("general-chat:history", generalChatMessages);
            io.to("general-chat").emit("general-chat:users", getGeneralChatUsers());
            socket.to("general-chat").emit("general-chat:system", {
                id: `system-${Date.now()}`,
                text: `${chatUser.name} انضم إلى الدردشة`,
                createdAt: new Date().toISOString()
            });
        });

        socket.on("general-chat:message", ({ text, user } = {}) => {
            const cleanText = typeof text === "string" ? text.trim() : "";
            if (!cleanText) return;

            const storedUser = generalChatUsers.get(socket.id);
            const message = buildChatMessage({
                text: cleanText.slice(0, 1000),
                user: storedUser || user || {}
            });

            generalChatMessages.push(message);
            if (generalChatMessages.length > 100) generalChatMessages.shift();
            io.to("general-chat").emit("general-chat:message", message);
        });

        socket.on("general-chat:typing", ({ isTyping, user } = {}) => {
            const storedUser = generalChatUsers.get(socket.id);
            socket.to("general-chat").emit("general-chat:typing", {
                isTyping: Boolean(isTyping),
                user: storedUser || user || { id: socket.id, name: "طالب" }
            });
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
            const chatUser = generalChatUsers.get(socket.id);
            if (chatUser) {
                generalChatUsers.delete(socket.id);
                socket.to("general-chat").emit("general-chat:users", getGeneralChatUsers());
                socket.to("general-chat").emit("general-chat:system", {
                    id: `system-${Date.now()}`,
                    text: `${chatUser.name} غادر الدردشة`,
                    createdAt: new Date().toISOString()
                });
            }

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
