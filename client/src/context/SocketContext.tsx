import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        const userId = user._id || user.id;

        if (token && userId) {
            const newSocket = io('http://localhost:5000');
            
            newSocket.on('connect', () => {
                console.log('Connected to socket server');
                newSocket.emit('join', userId);
            });

            newSocket.on('notification', (notification) => {
                toast.success(notification.message, {
                    duration: 5000,
                    icon: '🔔',
                    style: {
                        borderRadius: '15px',
                        background: '#003F87',
                        color: '#fff',
                        fontWeight: 'bold'
                    }
                });
            });

            newSocket.on('admin_notification', (notification) => {
                // Check if current user is admin (optional, server already filters if using rooms)
                if (user.Role === 'admin') {
                    toast.success(notification.message, {
                        duration: 6000,
                        icon: '📢',
                        style: {
                            borderRadius: '15px',
                            background: '#003F87',
                            color: '#fff',
                            fontWeight: 'bold'
                        }
                    });
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        }
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
