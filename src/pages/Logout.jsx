import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('isAuthenticated');
    const timer = setTimeout(() => {
      navigate('/Login');
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status"></div>
      <h4>You have been logged out. Redirecting to login...</h4>
    </div>
  );
};

export default Logout;