'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';

type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get the current session
        const { session: currentSession } = await auth.api.getSession({
          headers: new Headers(),
          query: {}
        });

        if (currentSession) {
          setSession({
            id: currentSession.id,
            userId: currentSession.userId,
            expiresAt: new Date(currentSession.expiresAt),
            token: currentSession.token,
            user: {
              id: currentSession.user.id,
              email: currentSession.user.email,
              name: currentSession.user.name || null,
            },
          });
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

    // Set up a simple polling mechanism since onAuthStateChange might not be available
    const interval = setInterval(checkAuth, 1000 * 60); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return {
    session,
    loading,
    isAuthenticated: !!session,
  };
}
