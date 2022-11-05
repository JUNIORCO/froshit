import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { useEffect } from "react";

// auto refresh when connection changes
export function useOnlineManager() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      return NetInfo.addEventListener((state) => {
        onlineManager.setOnline(
          state.isConnected != null &&
          state.isConnected &&
          Boolean(state.isInternetReachable)
        );
      });
    }
  }, []);
}
