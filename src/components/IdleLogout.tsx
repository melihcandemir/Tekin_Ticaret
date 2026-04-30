import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdleTimeout } from '../hooks/useIdleTimeout';

const IdleLogout = () => {
  const navigate = useNavigate();

  const handleTimeout = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  useIdleTimeout(handleTimeout);

  return null;
};

export default IdleLogout;
