// screens/RegisterScreen.js
import React, { useState } from 'react';
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
  ScrollView, // Keep ScrollView for potentially longer content
  Alert // Use Alert for feedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
// Assuming your API client is correctly set up and exported
import { API } from '../api/client'; // <-- Import your API client (adjust path)
import { COLORS } from '../constants/colors';
// No need for AuthContext here if registration doesn't log the user in immediately

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Single error state

  const handleRegister = async () => {
    // --- Validation ---
    setError(null); // Clear previous errors
    if (!username.trim()) {
      setError('Please enter a username.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    // Basic email format check (can be more robust)
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) { // Example length check
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!confirmPassword) {
      setError('Please confirm your password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // --- End Validation ---

    setIsLoading(true);

    try {
      // Call the register API endpoint
      const response = await API.auth.register({
        username: username.trim(), // Send trimmed values
        email: email.trim(),
        password: password, // Send the actual password
      });

      // Registration successful
      console.log("Registration successful:", response.data); // Log response if needed

      // Show success message and navigate to Login
      Alert.alert(
        "Registration Successful",
        "You can now log in with your credentials.",
        [{ text: "OK", onPress: () => navigation.navigate('Login') }] // Navigate after user clicks OK
      );
      // Or if you install a toast library:
      // showToast({ title: 'User successfully created', status: 'success' });
      // navigation.navigate('Login');

      // --- Alternative: If registration ALSO logs you in ---
      // const token = response?.data?.auth_token;
      // if (token) {
      //   await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      //   // Call context login function: authContext.login(token, response?.data?.user);
      //   navigation.replace('Main'); // Go directly to main app
      // } else {
      //   // Handle case where registration succeeded but no token was returned
      //   Alert.alert("Registration Complete", "Please log in.", [
      //      { text: "OK", onPress: () => navigation.navigate('Login') }
      //   ]);
      // }
      // --- End Alternative ---

    } catch (err) {
      console.error("Registration API error:", err);
      let errorMessage = 'An error occurred during registration.';
      if (err.response) {
        // Server responded with an error status (4xx, 5xx)
        console.error("Error data:", err.response.data);
        console.error("Error status:", err.response.status);
        // Try to extract specific errors (adjust field names based on your DRF serializers)
        if (err.response.data?.username) errorMessage = `Username: ${err.response.data.username[0]}`;
        else if (err.response.data?.email) errorMessage = `Email: ${err.response.data.email[0]}`;
        else if (err.response.data?.password) errorMessage = `Password: ${err.response.data.password[0]}`;
        else if (err.response.data?.detail) errorMessage = err.response.data.detail;
        else if (Array.isArray(err.response.data) && err.response.data[0]) errorMessage = err.response.data[0]; // Handle list errors
        else errorMessage = 'Registration failed. Please check your input.'; // Generic fallback
      } else if (err.request) {
        // Network error
        errorMessage = 'Could not connect to the server. Check network.';
      }
      setError(errorMessage);
      // Alert.alert("Registration Failed", errorMessage); // Show error in an alert
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Use ScrollView for potentially long content */}
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the music!</Text>

          {/* Error Message Display */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={COLORS.textTertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
             <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 chars)"
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

           {/* Confirm Password Input */}
           <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
             <TextInput
               style={styles.input}
               placeholder="Confirm Password"
               placeholderTextColor={COLORS.textTertiary}
               value={confirmPassword}
               onChangeText={setConfirmPassword}
               secureTextEntry={!isConfirmPasswordVisible}
               editable={!isLoading}
             />
             <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIcon}>
                  <Ionicons name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={22} color={COLORS.textSecondary} />
             </TouchableOpacity>
           </View>

          {/* Register Button */}
          <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister} // Call the correct handler
              disabled={isLoading}
            >
              {isLoading ? (
                 <ActivityIndicator size="small" color={COLORS.background} />
              ) : (
                 <Text style={styles.buttonText}>Sign Up</Text>
              )}
           </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Log In</Text>
            </TouchableOpacity>
          </View>
           <View style={{ height: 60 }} /> {/* Extra padding at the bottom */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Styles remain the same as your previous working version ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    // flex: 1, // Removed flex: 1 for ScrollView
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40, // Add vertical padding for ScrollView
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
    marginTop: 20, // Adjust top margin
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 30,
  },
  errorText: {
       color: COLORS.red,
       marginBottom: 15,
       textAlign: 'center',
       fontSize: 14,
       minHeight: 20, // Ensure space
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    width: '100%',
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  inputIcon: {
       marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  eyeIcon: {
       padding: 5,
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    height: 50, // Match input height
    justifyContent: 'center',
    marginTop: 10, // Add margin above button
  },
  buttonDisabled: {
       backgroundColor: COLORS.grey,
  },
  buttonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    // position: 'absolute', // Remove absolute positioning for ScrollView
    // bottom: 40,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;