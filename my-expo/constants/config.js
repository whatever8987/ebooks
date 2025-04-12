// constants/config.js (or similar)

// Use the IP address from your eth0 interface
const DEV_BACKEND_URL = 'http://172.30.242.200:8000'; // <-- Updated!

// Keep your production URL placeholder
const PROD_BACKEND_URL = 'https://your-deployed-backend.com';

// Basic check for environment (better methods exist)
const useProduction = process.env.NODE_ENV === 'production';

export const API_BASE_URL = useProduction ? PROD_BACKEND_URL : DEV_BACKEND_URL;

// Optional: Log the URL being used during development for verification
if (!useProduction) {
    console.log("DEVELOPMENT MODE: Using API Base URL:", API_BASE_URL);
}