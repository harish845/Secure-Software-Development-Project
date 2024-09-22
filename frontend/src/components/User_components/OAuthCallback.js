import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userString = urlParams.get('user');

    if (userString) {
        const user = JSON.parse(decodeURIComponent(userString));
        const userData = {
            token : user.token,
            user : {
                _id: user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        contact: user.contact,
                        addLine1: user.addLine1,
                        addLine2: user.addLine2,
                        addLine3: user.addLine3,
                        email: user.email,
                        gender: user.gender,
                        password: user.password,
                        __v: user.__v
            }
        };

        const ROLE = "user";
        localStorage.setItem("role", ROLE);

        localStorage.setItem('user', JSON.stringify(userData));
        console.log("User Stored:", userData);

        // Navigate to home
        navigate('/home');
    } else {
        console.error("No user data received");
    }
}, [navigate]);
  

  return (
    <div>
      <p>Processing Google OAuth Login...</p>
    </div>
  );
};

export default OAuthCallback;
