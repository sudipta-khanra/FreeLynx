// import React from "react";
// import AppRoutes from "./routes/AppRoutes";
// import { ToastProvider } from "./context/ToastContext";

// export default function App() {
//   return (
//     <ToastProvider>
//       <AppRoutes />
//     </ToastProvider>

//   );
// }
import React from 'react';

export default function App() {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    margin: 0,
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    color: '#333333',
    textAlign: 'center',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
    maxWidth: '480px',
    width: '100%',
  };

  const iconStyle = {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'inline-block',
  };

  const headingStyle = {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1a1a1a',
    letterSpacing: '-0.5px',
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#666666',
    margin: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <span style={iconStyle} role="img" aria-label="maintenance">
          🛠️
        </span>
        <h1 style={headingStyle}>The App is under maintenance</h1>
        <p style={textStyle}>
          We are currently upgrading our systems to improve your experience.
          We'll be back online shortly. Thank you for your patience!
        </p>
      </div>
    </div>
  );
}
