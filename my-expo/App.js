// App.js
import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { PlayerProvider } from './contexts/PlayerContext'; // Assuming you have this
import { AuthProvider } from './contexts/AuthContext'; // <-- Import AuthProvider
import { LogBox } from 'react-native'; // Optional: For ignoring timer warnings etc.

LogBox.ignoreLogs(['Setting a timer']);

export default function App() {
  return (
    // Wrap the entire app, AuthProvider should ideally be one of the outermost providers
    <AuthProvider>
      <PlayerProvider>
        <AppNavigator />
      </PlayerProvider>
    </AuthProvider>
  );
}