import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Wifi, WifiOff } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";

interface SystemStatus {
  api: 'healthy' | 'degraded' | 'down';
  database: 'healthy' | 'degraded' | 'down';
  websocket: 'connected' | 'disconnected';
  lastCheck: Date;
}

export function StatusBanner() {
  const { isConnected } = useWebSocket('/ws');
  const [status, setStatus] = useState<SystemStatus>({
    api: 'healthy',
    database: 'healthy',
    websocket: 'disconnected',
    lastCheck: new Date()
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const healthData = await response.json();
        
        setStatus(prev => ({
          ...prev,
          api: response.ok ? 'healthy' : 'down',
          database: healthData.database ? 'healthy' : 'down',
          websocket: isConnected ? 'connected' : 'disconnected',
          lastCheck: new Date()
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          api: 'down',
          database: 'down',
          websocket: isConnected ? 'connected' : 'disconnected',
          lastCheck: new Date()
        }));
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    const hasIssues = status.api !== 'healthy' || status.database !== 'healthy' || !isConnected;
    setIsVisible(hasIssues);
  }, [status, isConnected]);

  if (!isVisible) return null;

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'healthy':
      case 'connected':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'down':
      case 'disconnected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case 'healthy':
      case 'connected':
        return CheckCircle;
      case 'degraded':
        return AlertTriangle;
      case 'down':
      case 'disconnected':
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-b border-red-500/30 px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <span className="text-white font-inter font-medium">
            System Status Alert
          </span>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.api) === CheckCircle ? (
              <CheckCircle className={`w-4 h-4 ${getStatusColor(status.api)}`} />
            ) : (
              <AlertTriangle className={`w-4 h-4 ${getStatusColor(status.api)}`} />
            )}
            <span className="text-gray-300">API: </span>
            <span className={getStatusColor(status.api)}>{status.api}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.database) === CheckCircle ? (
              <CheckCircle className={`w-4 h-4 ${getStatusColor(status.database)}`} />
            ) : (
              <AlertTriangle className={`w-4 h-4 ${getStatusColor(status.database)}`} />
            )}
            <span className="text-gray-300">DB: </span>
            <span className={getStatusColor(status.database)}>{status.database}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span className="text-gray-300">WebSocket: </span>
            <span className={getStatusColor(status.websocket)}>{status.websocket}</span>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition-colors ml-4"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}