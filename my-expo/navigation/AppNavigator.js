import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Import Navigators & Screens
import BottomTabNavigator from './BottomTabNavigator';
import PlayerScreen from '../screens/PlayerScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Import Components & Constants
import MiniPlayer from '../components/MiniPlayer';
import { COLORS } from '../constants/colors';

// Import the hook to consume AuthContext
import { useAuth } from '../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';

const Stack = createNativeStackNavigator();

// --- Simple Loading Screen Component ---
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.accent} />
  </View>
);

const AppNavigator = () => {
  const { isLoading, isAuthenticated } = useAuth();
  console.log(`--- AppNavigator Render --- isLoading: ${isLoading}, isAuthenticated: ${isAuthenticated} ---`);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* Navigation Stack */}
        <Stack.Navigator
          key={String(isAuthenticated)}
          initialRouteName={isAuthenticated ? "Main" : "Login"}
          screenOptions={{
            headerShown: false,
          }}
        >
          {isAuthenticated ? (
            // Authenticated Screens
            <>
              <Stack.Screen name="Main" component={BottomTabNavigator} />
              <Stack.Screen name="Player" component={PlayerScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            </>
          ) : (
            // Unauthenticated Screens
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>

        {/* MiniPlayer (only shown when authenticated) */}
        {isAuthenticated && (
          <View style={styles.miniPlayerContainer}>
            <MiniPlayer />
          </View>
        )}
      </View>
    </NavigationContainer>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    padding: 10,
  },
});

export default AppNavigator;