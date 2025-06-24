import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3002/protected-route`, {
      credentials: 'include', 
    })
      .then(res => {
        console.log(res)
        setIsAuthenticated(res.ok)
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  return isAuthenticated;
};


// const auth = useAuth();

// if (auth === null) return <p>Loading...</p>;
// if (!auth) return <Navigate to="/login" />;
// return <ProtectedComponent />;
