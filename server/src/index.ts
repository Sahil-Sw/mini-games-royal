import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@minigame/shared';
import { setupSocketHandlers } from './socket/handlers.js';

const app = express();
const httpServer = createServer(app);

// Environment variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

// CORS configuration
app.use(cors({
  origin: NODE_ENV === 'production' ? CORS_ORIGINS : '*',
  credentials: true,
}));

app.use(express.json());

// Socket.IO setup
const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(httpServer, {
  cors: {
    origin: NODE_ENV === 'production' ? CORS_ORIGINS : '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Setup socket handlers
setupSocketHandlers(io);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get active rooms
app.get('/api/rooms', (req: Request, res: Response) => {
  // TODO: Return list of active rooms
  res.json({ rooms: [] });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎮 WebSocket server ready`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 CORS Origins: ${CORS_ORIGINS.join(', ')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});

