// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Zalogowano pomyślnie! 🎉",
        description: "Witaj z powrotem w swojim ogrodzie",
      });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast({
        title: "Błąd logowania",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
      }
      toast({
        title: "Konto utworzone! 🌱",
        description: "Witaj w swojej przygodzie z ogrodnictwem",
      });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast({
        title: "Błąd rejestracji",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Wylogowano",
        description: "Do zobaczenia wkrótce! 👋",
      });
    } catch (error: any) {
      toast({
        title: "Błąd wylogowania",
        description: "Wystąpił problem podczas wylogowywania",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Link wysłany! 📧",
        description: "Sprawdź swoją skrzynkę mailową",
      });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast({
        title: "Błąd resetowania hasła",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUserProfile = async (displayName: string) => {
    try {
      if (currentUser) {
        await updateProfile(currentUser, { displayName });
        toast({
          title: "Profil zaktualizowany! ✅",
          description: "Twoje dane zostały pomyślnie zmienione",
        });
      }
    } catch (error: any) {
      toast({
        title: "Błąd aktualizacji profilu",
        description: "Nie udało się zaktualizować profilu",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Zalogowano przez Google! 🎉",
        description: "Witaj w swojim ogrodzie",
      });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast({
        title: "Błąd logowania Google",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Nie znaleziono użytkownika z tym adresem email';
      case 'auth/wrong-password':
        return 'Nieprawidłowe hasło';
      case 'auth/email-already-in-use':
        return 'Ten adres email jest już używany';
      case 'auth/weak-password':
        return 'Hasło jest za słabe. Użyj co najmniej 6 znaków';
      case 'auth/invalid-email':
        return 'Nieprawidłowy adres email';
      case 'auth/too-many-requests':
        return 'Za dużo prób logowania. Spróbuj ponownie później';
      case 'auth/network-request-failed':
        return 'Błąd połączenia. Sprawdź internet';
      case 'auth/popup-closed-by-user':
        return 'Logowanie zostało anulowane';
      default:
        return 'Wystąpił nieoczekiwany błąd';
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};