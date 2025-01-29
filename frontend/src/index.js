import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from "@react-oauth/google"; 

const GOOGLE_CLIENT_ID = "934186764034-hob9fe241h4ltkql4j3dukl8h8qc5pa0.apps.googleusercontent.com" || "";

console.log("🔍 Google Client ID (Before Rendering):", GOOGLE_CLIENT_ID);
console.log("🌍 Current Page Origin:", window.location.origin);
console.log("📝 Process ENV Variables:", process.env);
console.log("🔍 Google Client ID:", GOOGLE_CLIENT_ID);


if (!GOOGLE_CLIENT_ID) {
  console.error("❌ Google Client ID is missing! Check your .env file.");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
