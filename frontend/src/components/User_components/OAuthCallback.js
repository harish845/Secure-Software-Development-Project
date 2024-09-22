import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
  
    if (token) {
      localStorage.setItem('token', token);
      console.log("Token Stored:", token);
      
      // Debug log before navigating
      console.log("Navigating to /home");
      navigate('/home');
    } else {
      console.error("No token received");
    }
  }, [navigate]);
  

  return (
    <div>
      <p>Processing Google OAuth Login...</p>
    </div>
  );
};

export default OAuthCallback;
