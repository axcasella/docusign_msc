import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { authenticateUser, logoutUser, isTokenValid, UserType, getTokenDecoded } from './auth.service';

type AuthContextType = {
  isAuth: boolean;
  goToLoginPage: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user?: UserType;
};

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();

  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    setIsAuth(isTokenValid());
  }, []);

  useEffect(() => setUser(getTokenDecoded()?.user), [isAuth]);

  const onAuthenticateUser = () => setIsAuth(isTokenValid());

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        goToLoginPage: () => history.push('/login'),
        login: (email, password) => authenticateUser(email, password).then(onAuthenticateUser),
        logout: () => {
          logoutUser();
          setIsAuth(false);
        },
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => React.useContext(AuthContext);
