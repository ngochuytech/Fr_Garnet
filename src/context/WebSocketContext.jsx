import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';

export const WebSocketContext = createContext(null);

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const WS_URL = import.meta.env.VITE_WS_URL;

export const WebSocketProvider = ({ children }) => {
    const { user } = useAuth();
    const stompClientRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        if (!user) return;
        if (isConnected) return;

        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            debug: (msg) => console.debug('[STOMP Global]', msg),
            onConnect: () => {
                setIsConnected(true);
                console.info('[WS Global] Đã kết nối STOMP ✓');
            },
            onDisconnect: () => {
                setIsConnected(false);
                console.info('[WS Global] Đã ngắt kết nối STOMP.');
            },
            onStompError: (frame) => {
                console.error('[WS Global] STOMP error:', frame.headers['message'], frame.body);
            },
            onWebSocketError: (evt) => {
                console.error('[WS Global] WebSocket error:', evt);
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current?.active) {
                stompClientRef.current.deactivate();
            }
            setIsConnected(false);
        };
    }, [user?.id]);

    const subscribeToNotifications = (callback) => {
        if(stompClientRef.current?.active) {
            return stompClientRef.current.subscribe('/user/queue/notifications', (message) =>{
                const parsedBody = JSON.parse(message.body);
                callback(parsedBody);
            });
        }
        return null;
    }

    const subscribeToChat = (callback) => {
        if(stompClientRef.current?.active) {
            return stompClientRef.current.subscribe('/user/queue/message', (message) =>{
                const parsedBody = JSON.parse(message.body)
                callback(parsedBody);
            });
        }
        return null;
    }

    const subscribeToReadReceipt = (callback) => {
        if(stompClientRef.current?.active) {
            return stompClientRef.current.subscribe('/user/queue/chat.read', (message) => {
                // Payload là userId của người vừa xem
                callback(message.body);
            });
        }
        return null;
    }

    const contextValue = {
        client: stompClientRef.current,
        isConnected,
        sendMessage: (destination, body) => {
            if (stompClientRef.current?.active) {
                stompClientRef.current.publish({
                    destination,
                    body: JSON.stringify(body)
                });
            }
        },
        subscribeToNotifications,
        subscribeToChat,
        subscribeToReadReceipt
    }

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
}

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context){
        throw new Error("useWebSocket phải được bọc bên trong WebSocketProvider")
    }
    return context;
}