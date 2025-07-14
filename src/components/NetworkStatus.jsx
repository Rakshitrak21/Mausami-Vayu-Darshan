import React from 'react';
import { Wifi, WifiOff, Signal } from 'lucide-react';

const NetworkStatus = ({ networkInfo, isOnline }) => {
  const getConnectionIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4 text-red-400" />;
    if (networkInfo?.effectiveType === '4g') return <Wifi className="h-4 w-4 text-green-400" />;
    return <Signal className="h-4 w-4 text-yellow-400" />;
  };

  const getConnectionText = () => {
    if (!isOnline) return 'Offline';
    if (networkInfo?.effectiveType) {
      return networkInfo.effectiveType.toUpperCase();
    }
    return 'Online';
  };

  return (
    <div className="flex items-center space-x-2 text-white/80">
      {getConnectionIcon()}
      <span className="text-sm">{getConnectionText()}</span>
    </div>
  );
};

export default NetworkStatus;