const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Serve static files
app.use(express.static('public'));

// In-memory data structures
const users = new Map(); 
const communities = new Map(); 
const privateConnections = new Map(); 

// Socket.IO connection handling
io.on('connection', (socket) => {
  const userId = uuidv4();
  console.log(`User connected: ${userId}`);
  
  // Store user socket
  users.set(userId, socket);
  
  // Send user their ID
  socket.emit('user-id', userId);
  
  // Handle joining a community
  socket.on('join-community', (communityId) => {
    console.log(`User ${userId} joining community ${communityId}`);
    
    // Create community if it doesn't exist
    if (!communities.has(communityId)) {
      communities.set(communityId, new Set());
    }
    
    // Add user to community
    communities.get(communityId).add(userId);
    
    // Join socket room for the community
    socket.join(communityId);
    
    // Get the full members list
    const membersList = Array.from(communities.get(communityId));
    console.log(`Community ${communityId} members:`, membersList);
    
    // Broadcast the updated members list to ALL users in the community (including the new joiner)
    io.to(communityId).emit('community-members', {
      communityId,
      members: membersList
    });
    
    // Notify all community members about the new user
    io.to(communityId).emit('user-joined', { userId, communityId });
  });
  
  // Handle leaving a community
  socket.on('leave-community', (communityId) => {
    console.log(`User ${userId} leaving community ${communityId}`);
    
    if (communities.has(communityId)) {
      communities.get(communityId).delete(userId);
      
      // Delete community if empty
      if (communities.get(communityId).size === 0) {
        communities.delete(communityId);
      } else {
        // Get the updated members list
        const membersList = Array.from(communities.get(communityId));
        console.log(`Community ${communityId} members after leave:`, membersList);
        
        // Broadcast the updated members list to all remaining users
        io.to(communityId).emit('community-members', {
          communityId,
          members: membersList
        });
      }
    }
    
    socket.leave(communityId);
    io.to(communityId).emit('user-left', { userId, communityId });
  });
  
  // Handle community message broadcasting
  socket.on('community-message', ({ communityId, message }) => {
    io.to(communityId).emit('community-message', {
      userId,
      communityId,
      message,
      timestamp: Date.now()
    });
  });
  
  // Handle private message (1-to-1)
  socket.on('private-message', ({ recipientId, message }) => {
    const recipientSocket = users.get(recipientId);
    
    if (recipientSocket) {
      recipientSocket.emit('private-message', {
        senderId: userId,
        message,
        timestamp: Date.now()
      });
    }
  });
  
  // WebRTC signaling for 1-to-1 calls
  
  // Call request
  socket.on('call-request', ({ recipientId }) => {
    console.log(`Call request from ${userId} to ${recipientId}`);
    
    const recipientSocket = users.get(recipientId);
    
    if (recipientSocket) {
      const connectionId = uuidv4();
      privateConnections.set(connectionId, {
        caller: userId,
        callee: recipientId
      });
      
      recipientSocket.emit('incoming-call', {
        callerId: userId,
        connectionId
      });
    } else {
      socket.emit('call-failed', { recipientId, reason: 'User not found' });
    }
  });
  
  // Call acceptance
  socket.on('call-accepted', ({ connectionId }) => {
    const connection = privateConnections.get(connectionId);
    
    if (connection) {
      const callerSocket = users.get(connection.caller);
      
      if (callerSocket) {
        callerSocket.emit('call-accepted', { connectionId });
      }
    }
  });
  
  // Call rejection
  socket.on('call-rejected', ({ connectionId }) => {
    const connection = privateConnections.get(connectionId);
    
    if (connection) {
      const callerSocket = users.get(connection.caller);
      
      if (callerSocket) {
        callerSocket.emit('call-rejected', { connectionId });
      }
      
      privateConnections.delete(connectionId);
    }
  });
  
  // WebRTC signaling - SDP offer
  // socket.on('sdp-offer', ({ connectionId, sdp }) => {
  //   const connection = privateConnections.get(connectionId);
    
  //   if (connection) {
  //     const targetId = connection.caller === userId ? connection.callee : connection.caller;
  //     const targetSocket = users.get(targetId);
      
  //     if (targetSocket) {
  //       targetSocket.emit('sdp-offer', {
  //         connectionId,
  //         sdp
  //       });
  //     }
  //   }
  // });
  
  // WebRTC signaling - SDP answer
  // socket.on('sdp-answer', ({ connectionId, sdp }) => {
  //   const connection = privateConnections.get(connectionId);
    
  //   if (connection) {
  //     const targetId = connection.caller === userId ? connection.callee : connection.caller;
  //     const targetSocket = users.get(targetId);
      
  //     if (targetSocket) {
  //       targetSocket.emit('sdp-answer', {
  //         connectionId,
  //         sdp
  //       });
  //     }
  //   }
  // });
  
  // WebRTC signaling - ICE candidates
  // socket.on('ice-candidate', ({ connectionId, candidate }) => {
  //   const connection = privateConnections.get(connectionId);
    
  //   if (connection) {
  //     const targetId = connection.caller === userId ? connection.callee : connection.caller;
  //     const targetSocket = users.get(targetId);
      
  //     if (targetSocket) {
  //       targetSocket.emit('ice-candidate', {
  //         connectionId,
  //         candidate
  //       });
  //     }
  //   }
  // });
  
  // Handle voice message (1-to-1)
  socket.on('voice-message', ({ recipientId, audioBlob }) => {
    const recipientSocket = users.get(recipientId);
    
    if (recipientSocket) {
      recipientSocket.emit('voice-message', {
        senderId: userId,
        audioBlob,
        timestamp: Date.now()
      });
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${userId}`);
    
    // Remove user from all communities
    for (const [communityId, members] of communities.entries()) {
      if (members.has(userId)) {
        members.delete(userId);
        io.to(communityId).emit('user-left', { userId, communityId });
        
        // Delete community if empty
        if (members.size === 0) {
          communities.delete(communityId);
        } else {
          // Broadcast updated members list to remaining users
          const membersList = Array.from(members);
          console.log(`Community ${communityId} members after disconnect:`, membersList);
          io.to(communityId).emit('community-members', {
            communityId,
            members: membersList
          });
        }
      }
    }
    
    // Clean up private connections
    for (const [connectionId, connection] of privateConnections.entries()) {
      if (connection.caller === userId || connection.callee === userId) {
        const otherId = connection.caller === userId ? connection.callee : connection.caller;
        const otherSocket = users.get(otherId);
        
        if (otherSocket) {
          otherSocket.emit('call-ended', { connectionId });
        }
        
        privateConnections.delete(connectionId);
      }
    }
    
    // Remove user from users map
    users.delete(userId);
  });
});

// Start the server
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`WebRTC server running on port ${PORT}`);
});

module.exports = server; // Export for testing