import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
            setUnreadCount(response.data.filter((n: any) => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Polling as a fallback or if socket isn't enough, but usually socket will push
        // For now, let's just rely on initial fetch and we'll add socket listener here too
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-[#003F87] hover:text-white transition-all group"
            >
                <Bell size={20} className="group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                        dir="rtl"
                    >
                        <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                            <h4 className="font-black text-[#003F87]">الإشعارات</h4>
                            <span className="text-[10px] font-bold bg-slate-50 px-2 py-1 rounded-full text-slate-400">
                                {unreadCount} جديد
                            </span>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => markAsRead(notification._id)}
                                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer flex gap-3 ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                                            notification.type === 'story_approved' ? 'bg-green-100 text-green-600' :
                                            notification.type === 'story_rejected' ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-[#003F87]'
                                        }`}>
                                            {notification.type === 'story_approved' ? <Check size={18} /> : 
                                             notification.type === 'story_rejected' ? <X size={18} /> : 
                                             <Clock size={18} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-800 leading-tight mb-1">
                                                {notification.message}
                                            </p>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ar })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center">
                                    <Bell size={40} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-sm text-slate-400 font-medium">لا توجد إشعارات حالياً</p>
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-4 bg-slate-50 text-center">
                                <button className="text-[10px] font-black text-[#003F87] hover:underline uppercase tracking-wider">
                                    مشاهدة كل الإشعارات
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
