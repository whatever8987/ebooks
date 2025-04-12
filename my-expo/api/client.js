import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
// Ensure this path is correct for your project structure
import { API_BASE_URL } from '../constants/config';

// Key used to store the auth token in SecureStore (must match AuthContext)
const AUTH_TOKEN_KEY = 'authToken';

// --- Axios instance for AUTHENTICATED requests ---
// This instance will have the interceptor to automatically add the token
const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`, // Your base API path
});

// --- Request Interceptor ---
// Automatically attaches the auth token to requests made with 'apiClient'
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
            if (token) {
                // IMPORTANT: Confirm if your backend expects 'Token' or 'Bearer'
                config.headers.Authorization = `Token ${token}`;
                // Example if using JWT (Bearer):
                // config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Interceptor: Error getting token from SecureStore", error);
        }
        return config; // Return the modified config
    },
    (error) => {
        // Handle request error (e.g., network error before sending)
        return Promise.reject(error);
    }
);

// --- API Method Definitions ---
// Group API calls by feature
export const API = {
    auth: {
        /**
         * Logs in a user. Uses base axios as token is not needed *before* login.
         * AuthContext should handle storing the token from the response.
         */
        login: async ({ username, password }) => {
            const sendData = { username, password };
            // Use base axios instance (no interceptor needed for login request itself)
            // Ensure '/api/v1/token/login/' matches your Django URL path
            const response = await axios.post(`${API_BASE_URL}/api/v1/token/login/`, sendData);
            return response; // Return the full axios response
        },
        /**
         * Logs out a user. Uses apiClient as the backend might need the token
         * to invalidate it server-side.
         * AuthContext should handle clearing the token from storage.
         */
        logout: async () => {
            // Uses apiClient instance (interceptor will add the token)
            // Ensure '/token/logout/' matches your Django URL path relative to baseURL
            const response = await apiClient.post('/token/logout/');
            return response;
        },
        /**
         * Registers a new user. Uses base axios as no token is needed.
         */
        register: async ({ email, username, password }) => {
            const sendData = { email, username, password };
            // Use base axios instance
            // Ensure '/api/v1/users/' matches your Django URL path
            const response = await axios.post(`${API_BASE_URL}/api/v1/users/`, sendData);
            return response;
        },
        /**
         * Gets the current logged-in user's profile information.
         * Uses apiClient as it requires authentication.
         * Used by AuthContext to validate token on startup.
         */
        getMe: async () => {
            // Uses apiClient instance (interceptor adds token)
            // *** VERIFY this endpoint path with your Django setup ***
            const response = await apiClient.get('/users/me/');
            return response;
        }
    },
    // --- Ebooks --- (Using apiClient as these likely require auth)
    ebooks: {
        getEbooks: async () => {
            const answer = await apiClient.get('/ebooks/');
            return answer;
        },
        create: async ({ title, description, url, type }) => {
            const data = { title, description, url, type };
            const answer = await apiClient.post('/ebooks/', data);
            return answer;
        },
        update: async ({ id, title, description }) => {
            const data = { title, description };
            const answer = await apiClient.patch(`/ebooks/${id}/`, data);
            return answer;
        },
        delete: async ({ id }) => {
            const answer = await apiClient.delete(`/ebooks/${id}/`);
            return answer;
        },
        typesEbooks: async () => {
            const answer = await apiClient.get('/types-ebooks/');
            return answer;
        },
        getEbookById: async ({ id }) => {
            const answer = await apiClient.get(`/ebooks/${id}/`);
            return answer;
        },
    },
    // --- Profile --- (Using apiClient)
    profile: {
        adminstatus: async () => {
            const answer = await getAPIClient.get('/profile/adminstatus/');
            return answer;
        },

        // --- ADD THESE (Examples) ---
        /** Gets profile details for a specific user ID */
        getProfile: async (userId) => {
            const answer = await apiClient.get(`/profile/${userId}/`); // Uses interceptor
            return answer;
        },

        /** Updates profile details for the logged-in user (assuming /profile/me/ or similar)
         *  Or you might need updateProfile(userId, data) if editing others
         */
        updateMyProfile: async (data) => {
            // This assumes you have a '/profile/me/' endpoint mapped to ProfileDetail
            // Adjust path as needed. data = { username, email, etc. }
            const answer = await apiClient.patch(`/profile/me/`, data);
            return answer;
        },

        /** Updates money for a specific profile ID */
        updateMoney: async (userId, amount) => {
            const data = { money: amount };
            const answer = await apiClient.patch(`/profile/${userId}/update-money/`, data);
            return answer;
        },
    },
    // --- Types --- (Using apiClient)
    types: {
        getTypes: async () => {
            const answer = await apiClient.get('/types/');
            return answer;
        },
        postTypes: async ({ title }) => {
            const data = { title };
            const answer = await apiClient.post('/types/', data);
            return answer;
        },
        putTypes: async ({ id, title }) => {
            const data = { title };
            const answer = await apiClient.put(`/types/${id}/`, data);
            return answer;
        },
        deleteTypes: async ({ id }) => {
            const answer = await apiClient.delete(`/types/${id}/`);
            return answer;
        },
    }
};

// Optional: Export the instance if needed elsewhere, though using the API object is cleaner
// export { apiClient };