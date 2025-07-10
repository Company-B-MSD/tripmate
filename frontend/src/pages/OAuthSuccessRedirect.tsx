import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthSuccessRedirect() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // You can optionally decode token here if needed
      login(token); // this will store token in localStorage via AuthContext
      navigate('/dashboard', { replace: true }); // redirect to protected page
    } else {
      navigate('/'); // fallback if token is missing
    }
  }, [login, navigate]);

  return <p>Redirecting...</p>;
}
