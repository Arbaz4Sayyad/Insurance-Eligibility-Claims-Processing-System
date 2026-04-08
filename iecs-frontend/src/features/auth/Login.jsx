import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Service Layer Execution 
      const response = await authService.login(credentials);

      // 2. Predictable Logic parsing response structure
      if (response.success && response.data) {
        
        // 3. Centralized Routing based on Role
        const { role } = response.data;
        if (role === 'ADMIN') navigate('/admin');
        else if (role === 'CASEWORKER') navigate('/caseworker');
        else navigate('/dashboard'); 
        
      } else {
        setErrorMsg('Invalid login response from server.');
      }
      
    } catch (err) {
       // Using the normalized error structure created out of apiClient.js interceptor
       setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">IECS Portal Login</h2>
        
        {errorMsg && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input 
              type="text" 
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input 
              type="password" 
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
