'use client';

import { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string;
  name: string | null;
};

type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  user: User;
};

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data?.session) {
          setSession(data.session);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up a simple polling mechanism
    const interval = setInterval(checkAuth, 1000 * 60); // Check every minute

    return () => clearInterval(interval);
  }, [router]);

  const value = {
    session,
    loading,
    isAuthenticated: !!session,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
