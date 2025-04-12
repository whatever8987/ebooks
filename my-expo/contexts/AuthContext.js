// contexts/AuthContext.js
import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import * as SecureStore from 'expo-secure-store'; // Correct import
import { API } from '../api/client';

const AUTH_TOKEN_KEY = 'authToken';

const AuthContext = createContext({ /* ... */ });

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      console.log("AuthContext: loadAuthData() started.");
      setIsLoading(true);
      try {
        // --- FIX: Use getItemAsync with await ---
        const storedToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        // --- END FIX ---

        if (storedToken) {
          console.log('AuthContext: Token found in storage.');
          setToken(storedToken);

          try {
            console.log('AuthContext: Attempting to validate token via API.auth.getMe()');
            // Make sure interceptor adds the token correctly using storedToken
            const response = await API.auth.getMe(); // apiClient needs interceptor setup correctly

            if (response.data) {
              console.log('AuthContext: Token validated. User data fetched:', JSON.stringify(response.data, null, 2));
              setUser(response.data);
              setIsAuthenticated(true);
            } else {
              console.warn('AuthContext: getMe() succeeded but returned no data. Logging out.');
              await logoutInternal();
            }
          } catch (apiError) {
             console.error('AuthContext: Error validating token/fetching user:', apiError?.response?.data || apiError.message);
             if (apiError.response?.status === 401 || apiError.response?.status === 403) {
                 console.log('AuthContext: Stored token invalid (401/403). Logging out.');
                 await logoutInternal();
             } else {
                 console.log('AuthContext: Other API error during token validation. Logging out.');
                 await logoutInternal();
             }
          }
        } else {
           console.log('AuthContext: No token found in storage.');
           setIsAuthenticated(false);
           setToken(null);
           setUser(null);
        }
      } catch (error) {
        console.error("AuthContext: Error reading token from SecureStore:", error);
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        console.log("AuthContext: loadAuthData() finished. Setting isLoading=false.");
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (newToken, userData) => {
    console.log("AuthContext: login() called.");
    // ... logging received token/user ...

    try {
      // --- FIX: Use setItemAsync with await ---
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, newToken);
      // --- END FIX ---
      console.log("AuthContext: Token stored successfully.");
      setToken(newToken);
      setUser(userData || null);
      setIsAuthenticated(true);
      console.log("AuthContext: State updated - isAuthenticated: true.");
    } catch (error) {
      console.error("AuthContext: Error saving token during login:", error);
    } finally {
      console.log("AuthContext: login() finished.");
      // Note: isLoading wasn't set to true at the start here, so no need to set false?
      // Consider adding setIsLoading(true/false) around the try block if needed.
    }
  };

  const logout = async () => {
    console.log("AuthContext: logout() called.");
    await logoutInternal();
  };

  const logoutInternal = async () => {
      setIsLoading(true);
      try {
          // --- FIX: Use deleteItemAsync with await ---
          await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
          // --- END FIX ---
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          console.log('AuthContext: User logged out. Token deleted, state reset.');
      } catch (error) {
          console.error("AuthContext: Error removing token on logout:", error);
      } finally {
          setIsLoading(false);
      }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [token, user, isAuthenticated, isLoading] // Dependencies are correct
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};