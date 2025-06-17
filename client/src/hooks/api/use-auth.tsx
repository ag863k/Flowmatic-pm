import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [hasToken, setHasToken] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('authToken');
      const newHasToken = !!token;
      
      if (hasToken !== newHasToken) {
        setHasToken(newHasToken);
        
        if (!newHasToken) {
          queryClient.removeQueries({ queryKey: ["authUser"] });
        }
      }
      
      if (!isInitialized) {
        setIsInitialized(true);
      }
    };

    checkToken();

    const handleTokenChange = () => {
      checkToken();
    };

    window.addEventListener('tokenChanged', handleTokenChange);
    
    return () => {
      window.removeEventListener('tokenChanged', handleTokenChange);
    };
  }, [hasToken, isInitialized, queryClient]);

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: hasToken && isInitialized,
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
