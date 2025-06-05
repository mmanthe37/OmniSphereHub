// Real-time streaming data from Xano MCP server
export class XanoStreamingService {
  private sseUrl = 'https://x8ki-letl-twmt.n7.xano.io/x2/mcp/XLRQ8o0R/mcp/sse';
  private streamUrl = 'https://x8ki-letl-twmt.n7.xano.io/x2/mcp/XLRQ8o0R/mcp/stream';
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Connect to real-time market data stream
  connectMarketDataStream(onData: (data: any) => void, onError?: (error: any) => void) {
    this.eventSource = new EventSource(`${this.sseUrl}?stream=market_data`, {
      withCredentials: false
    });

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onData(data);
        this.reconnectAttempts = 0; // Reset on successful message
      } catch (error) {
        console.error('Error parsing SSE data:', error);
        onError?.(error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      this.handleReconnection(onData, onError);
    };

    this.eventSource.onopen = () => {
      console.log('Connected to Xano real-time market data stream');
    };
  }

  // Connect to portfolio updates stream
  connectPortfolioStream(userId: number, onData: (data: any) => void, onError?: (error: any) => void) {
    this.eventSource = new EventSource(`${this.sseUrl}?stream=portfolio&user_id=${userId}`, {
      withCredentials: false
    });

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onData(data);
      } catch (error) {
        console.error('Error parsing portfolio stream data:', error);
        onError?.(error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('Portfolio stream error:', error);
      this.handleReconnection(() => this.connectPortfolioStream(userId, onData, onError));
    };
  }

  // Connect to AI trading signals stream
  connectAITradingStream(onData: (data: any) => void, onError?: (error: any) => void) {
    this.eventSource = new EventSource(`${this.sseUrl}?stream=ai_trading`, {
      withCredentials: false
    });

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onData(data);
      } catch (error) {
        console.error('Error parsing AI trading stream data:', error);
        onError?.(error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('AI trading stream error:', error);
      this.handleReconnection(() => this.connectAITradingStream(onData, onError));
    };
  }

  // Handle reconnection logic
  private handleReconnection(reconnectFn: Function, onError?: (error: any) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.disconnect();
        reconnectFn();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      onError?.('Connection failed after maximum retry attempts');
    }
  }

  // Send data to streaming endpoint
  async sendStreamingData(data: any): Promise<void> {
    try {
      const response = await fetch(this.streamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_XANO_API_TOKEN}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Streaming request failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending streaming data:', error);
      throw error;
    }
  }

  // Disconnect from all streams
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  // Check if currently connected
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}

export const xanoStreaming = new XanoStreamingService();