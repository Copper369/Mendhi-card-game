import { create } from 'zustand';

const useGameStore = create((set) => ({
  socket: null,
  roomId: null,
  playerName: '',
  room: null,
  chatMessages: [],
  
  setSocket: (socket) => set({ socket }),
  setRoomId: (roomId) => set({ roomId }),
  setPlayerName: (playerName) => set({ playerName }),
  setRoom: (room) => set({ room }),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),
  resetGame: () => set({
    roomId: null,
    room: null,
    chatMessages: []
  })
}));

export default useGameStore;
