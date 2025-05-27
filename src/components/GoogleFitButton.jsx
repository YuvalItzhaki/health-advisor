import React from "react";
import { Button } from "antd";

function GoogleFitButton() {
  const handleGoogleLogin = () => {
    // Redirect to the backend Google OAuth route
    window.location.href = "http://localhost:5001/api/auth/google"; // Update this to match your backend route
  };

  return (
    <Button type="primary" onClick={handleGoogleLogin} block>
      Connect with Google Fit
    </Button>
  );
}

export default GoogleFitButton;
