import React from 'react';
import { Redirect, Route, useLocation, RouteProps } from 'react-router-dom';
import { useAuth } from 'services/auth';


const AuthRoute: React.FC<RouteProps> = (props) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isAuth) {
    return <Route {...props} />;
  } else {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: {
            referrer: location.pathname,
          },
        }}
      />
    );
  }
};

export default AuthRoute;
