import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GoogleLoginComponent() {
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', { code: response.code });
      console.log('Login Success:', res.data);
      navigate('/home'); 
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  const handleError = (error) => {
    console.error('Login Failed:', error);
  };

  return (
    <GoogleOAuthProvider clientId="281092657207-sn595vvrehql02l57i9vlfqjt8c1h7nc.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginComponent;