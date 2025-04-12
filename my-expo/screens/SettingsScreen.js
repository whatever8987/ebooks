// screens/SettingsScreen.js (Example)
import React from 'react';
import { View, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const SettingsScreen = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        // AppNavigator will automatically switch to Login screen
        // because isAuthenticated becomes false
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Log Out" onPress={handleLogout} color="red" />
        </View>
    );
};
export default SettingsScreen;