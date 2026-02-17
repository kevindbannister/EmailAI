import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { FeatureFlagsProvider } from './context/FeatureFlagsContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FeatureFlagsProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </FeatureFlagsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
