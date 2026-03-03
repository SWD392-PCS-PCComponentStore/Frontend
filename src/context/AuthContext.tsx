import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';

type AuthModal = 'login' | 'register' | null;

type AuthContextValue = {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  authModal: AuthModal;
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<AuthModal>(null);

  const openLogin = useCallback(() => setAuthModal('login'), []);
  const openRegister = useCallback(() => setAuthModal('register'), []);
  const closeModal = useCallback(() => setAuthModal(null), []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // TODO: gọi loginApi({ email, password }) từ @/api khi backend sẵn sàng
    // const res = await loginApi({ email, password });
    // setUser(res.user);
    // setAuthModal(null);
    // return true;
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    // TODO: gọi registerApi({ name, email, password }) từ @/api khi backend sẵn sàng
    // const res = await registerApi({ name, email, password });
    // setUser(res.user);
    // setAuthModal(null);
    // return true;
    return false;
  }, []);

  const logout = useCallback(() => {
    // TODO: gọi logoutApi() từ @/api khi backend sẵn sàng
    // await logoutApi();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        authModal,
        openLogin,
        openRegister,
        closeModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
