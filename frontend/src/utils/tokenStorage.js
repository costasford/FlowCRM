// Secure token storage utilities
// This provides a centralized way to manage token storage
// and makes it easy to switch to more secure methods later

const TOKEN_KEY = 'flowcrm_token';

export const tokenStorage = {
  // Get token from storage
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get token from storage:', error);
      return null;
    }
  },

  // Set token in storage
  setToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      return true;
    } catch (error) {
      console.error('Failed to save token to storage:', error);
      return false;
    }
  },

  // Remove token from storage
  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      return true;
    } catch (error) {
      console.error('Failed to remove token from storage:', error);
      return false;
    }
  },

  // Check if token exists
  hasToken: () => {
    return !!tokenStorage.getToken();
  }
};

// TODO: For production, consider implementing:
// 1. HttpOnly cookies with secure flag
// 2. Token refresh mechanism
// 3. Automatic token rotation
// 4. Memory-only storage for highly sensitive apps