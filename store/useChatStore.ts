import { create } from 'zustand';

interface ChatState {
  socket: WebSocket | null;
  isConnected: boolean;
  messages: any[];
  connect: () => void;
  disconnect: () => void;
  sendMessage: (data: any) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  isConnected: false,
  messages: [],

  connect: () => {
    const { socket } = get();
    if (socket) return; // Prevent multiple connections

    // Replace with your actual WebSocket URL
    const ws = new WebSocket('wss://your-backend-url.com/ws/chat/');

    ws.onopen = () => set({ isConnected: true });
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      set((state) => ({ messages: [...state.messages, data] }));
    };

    ws.onclose = () => {
      set({ isConnected: false, socket: null });
      // Reconnection Logic: Exponential backoff or simple timeout
      setTimeout(() => get().connect(), 3000);
    };

    ws.onerror = (error) => console.error('WebSocket Error:', error);

    set({ socket: ws });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, isConnected: false });
    }
  },

  sendMessage: (data) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.send(JSON.stringify(data));
    }
  },
}));