import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'; // Icons for success and failure
import '../assets/styles/authStatus.css';  // Centralized CSS
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

// Failure Component
export const AuthFailure = ({ type = "SignUp" }) => {  // Default type is "SignUp" if not provided
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract the error message from query params or use a default message
  const errorMessage = searchParams.get('message') || `Failed to ${type}. Please try again.`;

  useEffect(() => {
    // Redirect to the correct page after 3 seconds
    const timer = setTimeout(() => {
      
      navigate(`/${type.toLowerCase()}`); // Redirects to /signin or /signup
    }, 3000);

    // Clean up timer
    return () => clearTimeout(timer);
  }, [navigate, type]);

  return (
    <div className="error-container">
      <div className="error-icon">
        <FaExclamationTriangle className="icon" /> {/* Failure icon */}
      </div>
      <h1 className="error-title">{`${type} Failed`}</h1>
      <p className="error-message">{errorMessage}</p>
      <p className="redirect-message">You will be redirected to the {type} page shortly...</p>
    </div>
  );
};

// Success Component
export const AuthSuccess = ({ type = "SignUp" }) => {  // Default type is "SignUp" if not provided
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // Redirect to the homepage after 2 seconds
    const timer = setTimeout(() => {
      const token = searchParams.get('token');
      if (token){
      localStorage.setItem(import.meta.env.VITE_JWT_COOKIE_NAME, token);
      const decoded = jwtDecode(token);
      dispatch(setUser(decoded));}
      navigate('/');
    }, 2000);

    // Clean up timer
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-container">
      <div className="success-icon">
        <FaCheckCircle className="icon" /> {/* Success icon */}
      </div>
      <h1 className="success-title">{`${type} Successful!`}</h1>
      <p className="redirect-message">Redirecting to the homepage...</p>
    </div>
  );
};

