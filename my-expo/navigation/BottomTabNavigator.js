import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LibraryScreen from '../screens/LibraryScreen';
import AiPlaylistScreen from '../screens/AiPlaylistScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

// Helper function for tab icons
const getTabIcon = (route, focused, color, size) => {
  const iconSize = focused ? 26 : 22;

  switch (route.name) {
    case 'Home':
      return <Ionicons name={focused ? 'home' : 'home-outline'} size={iconSize} color={color} />;
    case 'Search':
      return <Ionicons name={focused ? 'search' : 'search-outline'} size={iconSize} color={color} />;
    case 'Library':
      return <Ionicons name={focused ? 'library' : 'library-outline'} size={iconSize} color={color} />;
    case 'AI Generate':
      return <MaterialCommunityIcons name={focused ? 'robot-excited' : 'robot'} size={iconSize} color={color} />;
    default:
      return null;
  }
};

const BottomTabNavigator = () => {
  // Define constants for repeated values
  const ACTIVE_COLOR = COLORS.white;
  const INACTIVE_COLOR = COLORS.textSecondary;
  const BACKGROUND_COLOR = COLORS.black;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) =>
          getTabIcon(route, focused, color, size),
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: BACKGROUND_COLOR,
          borderTopColor: COLORS.grey,
          height: 55,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarAccessibilityLabel: 'Go to Home Screen',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarAccessibilityLabel: 'Search for content',
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarAccessibilityLabel: 'View your library',
        }}
      />
      <Tab.Screen
        name="AI Generate"
        component={AiPlaylistScreen}
        options={{
          tabBarLabel: 'Generate',
          tabBarAccessibilityLabel: 'Generate AI playlists',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;