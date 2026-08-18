import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'user' | 'designer' | 'architect';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  bio?: string;
  phone?: string;
  location?: string;
  firmName?: string;
  licenseId?: string;
  hourlyRate?: number;
  ratePerSqFt?: number;
  preferredStyle?: string;
  unitPreference?: 'ft' | 'm';
  targetClearanceCm?: number;
  aiSensitivity?: 'balanced' | 'spacious' | 'compact';
  notificationsEnabled?: boolean;
}

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'user-alexander',
  name: 'Alexander Wright',
  email: 'alexander.wright@aera.design',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
  title: 'Homeowner & Architectural Enthusiast',
  phone: '+1 (212) 555-0194',
  location: 'Tribeca, New York, NY',
  preferredStyle: 'Warm Minimalist Oak',
  unitPreference: 'ft',
  targetClearanceCm: 90,
  aiSensitivity: 'balanced',
  notificationsEnabled: true,
  bio: 'Redesigning our 1,200 sq.ft 2BHK loft for optimal walking circulation and bespoke storage.',
};

const DESIGNER_USER: UserProfile = {
  id: 'des-elena-rostova',
  name: 'Elena Rostova',
  email: 'elena@rostovadesign.com',
  role: 'designer',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
  title: 'Senior Interior Designer',
  phone: '+1 (212) 555-0182',
  location: 'Manhattan, New York, NY',
  firmName: 'Elena Rostova Interiors',
  hourlyRate: 95,
  ratePerSqFt: 3.5,
  preferredStyle: 'Japandi Earth & Wabi-Sabi',
  unitPreference: 'ft',
  targetClearanceCm: 90,
  aiSensitivity: 'balanced',
  notificationsEnabled: true,
  bio: 'Interior designer specializing in Japandi, Scandinavian minimalist styling, and bespoke material palettes.',
};

const ARCHITECT_USER: UserProfile = {
  id: 'des-ethan-rodrigues',
  name: 'Ethan Rodrigues',
  email: 'ethan@rodrigues-spatial.com',
  role: 'architect',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  title: 'Principal AIA Spatial Architect',
  phone: '+1 (415) 889-3200',
  location: 'SoHo, New York / San Francisco',
  firmName: 'Rodrigues Spatial Architecture LLC',
  licenseId: 'AIA-NY #849204',
  hourlyRate: 140,
  ratePerSqFt: 5.0,
  preferredStyle: 'Warm Minimalist & Structural Modernism',
  unitPreference: 'ft',
  targetClearanceCm: 95,
  aiSensitivity: 'spacious',
  notificationsEnabled: true,
  bio: 'Licensed AIA Spatial Architect with 12+ years experience in CAD structural clearances, door swing safety, and residential space planning.',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('user');
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'architect') {
      setUser(ARCHITECT_USER);
    } else if (newRole === 'designer') {
      setUser(DESIGNER_USER);
    } else {
      setUser(DEFAULT_USER);
    }
  };

  const login = (_email: string, preferredRole: UserRole = 'user') => {
    setIsAuthenticated(true);
    setRole(preferredRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setRole,
        isAuthenticated,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
