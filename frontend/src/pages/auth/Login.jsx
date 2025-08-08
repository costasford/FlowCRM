import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { testConnection } from '../../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ checking: true });
  
  const { user, login, loading: authLoading } = useAuth();

  // Test connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testConnection();
      setConnectionStatus(result);
    };
    checkConnection();
  }, []);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to FlowCRM
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Property Management CRM System
          </p>
        </div>
        
        {/* Connection Status */}
        {connectionStatus.checking && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
              Connecting to server...
            </div>
          </div>
        )}
        
        {!connectionStatus.checking && !connectionStatus.connected && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="font-medium">Server Connection Failed</div>
            <div className="text-sm mt-1">{connectionStatus.error}</div>
            <button 
              onClick={async () => {
                setConnectionStatus({ checking: true });
                const result = await testConnection();
                setConnectionStatus(result);
              }}
              className="text-red-800 underline text-sm mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {!connectionStatus.checking && connectionStatus.connected && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center text-sm">
            ✓ Connected to server
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="font-medium">Login Failed</div>
              <div className="text-sm mt-1">{error}</div>
            </div>
          )}
          
          <div className="rounded-lg shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !connectionStatus.connected}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : !connectionStatus.connected ? 'Server Unavailable' : 'Sign in'}
            </button>
          </div>

          {/* Demo credentials for showcase */}
          <div className="text-center">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <p className="font-semibold mb-2">Try Demo Account:</p>
              <div className="text-sm">
                <p><strong>Email:</strong> demo@flowcrm.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;