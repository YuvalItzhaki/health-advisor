import React from 'react';

function GoogleFitButton() {
  const handleGoogleLogin = () => {
    // Redirect to the backend Google OAuth route
    window.location.href = 'http://localhost:5001/api/auth/google'; // Update this to match your backend route
  };

  return (
    <button onClick={handleGoogleLogin}>
      Connect with Google Fit
    </button>
  );
}

export default GoogleFitButton;
