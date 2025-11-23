import { useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';

/**
 * Hook to broadcast game state to spectators in real-time
 * Active players use this to share their game state with spectators
 */
export function useBroadcastGameState(state: any, isActive: boolean) {
  const { socket } = useSocket();
  const lastBroadcastRef = useRef<string>('');
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only broadcast if player is active
    if (!socket || !isActive) return;

    // Throttle broadcasts to avoid overwhelming the server (max 10 per second)
    const stateString = JSON.stringify(state);
    
    // Skip if state hasn't changed
    if (stateString === lastBroadcastRef.current) return;
    
    // Clear existing timeout
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current);
    }

    // Broadcast after a small delay (throttling)
    throttleTimeoutRef.current = setTimeout(() => {
      socket.emit('minigame:stateUpdate', state);
      lastBroadcastRef.current = stateString;
    }, 100); // 100ms throttle = max 10 updates per second

    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [socket, state, isActive]);
}

