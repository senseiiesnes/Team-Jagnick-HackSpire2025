import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (!socket) {
    // Connect to the WebSocket server running on port 3003
    socket = io('http://localhost:3003', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const closeSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinCommunity = (communityId: string): void => {
  if (socket) {
    socket.emit('join-community', communityId);
  }
};

export const leaveCommunity = (communityId: string): void => {
  if (socket) {
    socket.emit('leave-community', communityId);
  }
};

export const sendCommunityMessage = (communityId: string, message: string): void => {
  if (socket) {
    socket.emit('community-message', { communityId, message });
  }
};

export const onCommunityMessage = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('community-message', callback);
  }
};

export const onUserJoined = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('user-joined', callback);
  }
};

export const onUserLeft = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('user-left', callback);
  }
};

export const onCommunityMembers = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('community-members', callback);
  }
};

export const removeAllListeners = (): void => {
  if (socket) {
    socket.removeAllListeners();
  }
};

export default {
  initializeSocket,
  getSocket,
  closeSocket,
  joinCommunity,
  leaveCommunity,
  sendCommunityMessage,
  onCommunityMessage,
  onUserJoined,
  onUserLeft,
  onCommunityMembers,
  removeAllListeners,
}; 