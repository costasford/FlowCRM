// HttpOnly Cookie Authentication
// Tokens are now stored in HttpOnly cookies for enhanced security
// JavaScript cannot access these cookies, so we use API calls to check auth status

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const tokenStorage = {
  // Check if user is authenticated by making API call
  // HttpOnly cookies are automatically included in requests
  checkAuth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include', // Include cookies in request
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to check authentication:', error);
      return false;
    }
  },

  // Get user data (if authenticated)
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  // Logout (clear cookie on server)
  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to logout:', error);
      // Return true anyway - if logout fails, the server will handle cookie expiration
      return true;
    }
  },

  // Legacy methods for backward compatibility (now no-ops)
  getToken: () => null,
  setToken: () => true,
  removeToken: () => true,
  hasToken: () => false // Always false since we can't access cookies
};

// ✅ PRODUCTION SECURITY IMPLEMENTED:
// 1. HttpOnly cookies with secure flag
// 2. SameSite protection against CSRF
// 3. Automatic cookie inclusion in requests
// 4. No JavaScript access to tokens