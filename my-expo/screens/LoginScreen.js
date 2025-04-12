// screens/LoginScreen.js
import React, { useState } from 'react'; // Removed useContext as we'll use useAuth
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

import { COLORS } from '../constants/colors';
import { API } from '../api/client'; // Import your API client
import { useAuth } from '../contexts/AuthContext'; // <-- Import and use the custom hook

// const AUTH_TOKEN_KEY = 'authToken'; // Context handles this key internally

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth(); // <-- Use the custom hook to get login function

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    // Basic validation
    if (!email) {
      setError('Please enter your email or username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError(null);
    setIsLoading(true);
    console.log("LoginScreen: handleLogin started, isLoading=true");

    try {
      const response = await API.auth.login({ username: email, password });

      // Log Raw API Response
      console.log("------------ LoginScreen: RAW API RESPONSE ------------");
      console.log("Status:", response?.status);
      console.log("Data:", JSON.stringify(response?.data, null, 2));
      console.log("-------------------------------------------------------");

      // Adjust Token Extraction & Log
      // !! IMPORTANT: Check the log above and adjust 'auth_token' if the key is different !!
      const token = response?.data?.auth_token;
      const userData = response?.data?.user; // Check if user data is present
      console.log(`LoginScreen: Attempting token extraction. Key='auth_token'. Found token: ${!!token}`);
      console.log("LoginScreen: Extracted Token Value:", token);
      console.log("LoginScreen: Extracted User Data:", JSON.stringify(userData, null, 2));

      if (token) {
        // Log Before Context Call
        console.log("LoginScreen: Token extracted successfully. Calling context login...");

        await login(token, userData); // Call context login function

        // Log After Context Call
        console.log("LoginScreen: Context login function finished.");

        // Navigation should happen automatically via AppNavigator reacting to isAuthenticated
        // navigation.replace('Main'); // Usually not needed here if context updates state correctly

      } else {
        // Token not found in the response data
        console.error("LoginScreen: LOGIN FAILED - Token key ('auth_token'?) not found in response data!");
        setError('Login failed: Invalid response from server (no token).');
        setPassword('');
      }

    } catch (err) {
      console.error("LoginScreen: Login API error caught:", err);
      let errorMessage = 'An error occurred. Please try again later.';
       if (err.response) {
         console.error("Error data:", err.response.data);
         console.error("Error status:", err.response.status);
         errorMessage = err.response.data?.detail ||
                        (Array.isArray(err.response.data?.non_field_errors) && err.response.data.non_field_errors[0]) ||
                        'Incorrect username or password.';
       } else if (err.request) {
         errorMessage = 'Could not connect to the server. Check network.';
       }
      setError(errorMessage);
      setPassword('');
    } finally {
      // Check Finally Block
      console.log("LoginScreen: handleLogin finally block reached. Setting isLoading=false.");
      setIsLoading(false);
    }
  }; // <-- Closing brace for handleLogin looks correct

    // --- JSX for the Login Screen ---
    return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Spotube Concept</Text>
          <Text style={styles.subtitle}>Welcome back!</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              editable={!isLoading}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
              <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
             style={[styles.button, isLoading && styles.buttonDisabled]}
             onPress={handleLogin}
             disabled={isLoading}
           >
             {isLoading ? ( <ActivityIndicator size="small" color={COLORS.background} /> )
                        : ( <Text style={styles.buttonText}>Log In</Text> )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Forgot Password pressed")}>
            <Text style={styles.linkTextSecondary}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background },
    container: { flex: 1 },
    innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
    title: { fontSize: 32, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
    subtitle: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 30 },
    errorText: { color: COLORS.red, marginBottom: 15, textAlign: 'center', fontSize: 14, minHeight: 20 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, width: '100%', height: 50, marginBottom: 20, paddingHorizontal: 15 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, color: COLORS.text, fontSize: 16 },
    eyeIcon: { padding: 5 },
    button: { backgroundColor: COLORS.accent, paddingVertical: 15, borderRadius: 25, alignItems: 'center', width: '100%', marginBottom: 20, height: 50, justifyContent: 'center' },
    buttonDisabled: { backgroundColor: COLORS.grey },
    buttonText: { color: COLORS.black, fontSize: 16, fontWeight: 'bold' },
    linkTextSecondary: { color: COLORS.textTertiary, fontSize: 14, textDecorationLine: 'underline', marginBottom: 25 },
    footer: { flexDirection: 'row', marginTop: 20, position: 'absolute', bottom: 40 },
    footerText: { color: COLORS.textSecondary, fontSize: 14 },
    linkText: { color: COLORS.accent, fontSize: 14, fontWeight: 'bold' },
});

export default LoginScreen;