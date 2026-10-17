import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize after a short delay to ensure the component is mounted
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Check for localStorage token
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('authToken');
      setHasToken(!!token);
    };

    checkToken();

    const handleTokenChange = () => {
      checkToken();
    };

    window.addEventListener('tokenChanged', handleTokenChange);
    
    return () => {
      window.removeEventListener('tokenChanged', handleTokenChange);
    };
  }, []);

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: isInitialized && hasToken,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    ...query,
    hasToken,
    isInitialized,
  };
};

export default useAuth;
