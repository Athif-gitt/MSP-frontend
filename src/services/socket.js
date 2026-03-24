/**
 * Simple WebSocket manager for handling real-time Django Channels connections.
 * Includes automatic reconnect with exponential backoff.
 */

class NotificationSocket {
  constructor() {
    this.socket = null;
    this.url = 'ws://localhost:8000/ws/notifications/';
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
    this.listeners = new Set();
    this.isConnecting = false;
  }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('Notification WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0; // Reset attempts on successful connection
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifyListeners(data);
      } catch (err) {
        console.error('Error parsing WebSocket message', err);
      }
    };

    this.socket.onclose = (event) => {
      this.isConnecting = false;
      console.log('Notification WebSocket closed', event);
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('Notification WebSocket error', error);
      // Let onclose handle the reconnect
    };
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000); // Max 10s backoff
      console.log(`Reconnecting in ${delay}ms...`);
      this.reconnectTimeout = setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    } else {
      console.warn('Max WebSocket reconnect attempts reached');
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners(data) {
    this.listeners.forEach(callback => callback(data));
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.socket) {
      // Prevent reconnecting when deliberately closed
      this.socket.onclose = null;
      this.socket.close();
      this.socket = null;
    }
    this.listeners.clear();
    this.isConnecting = false;
  }
}

export const notificationSocket = new NotificationSocket();
