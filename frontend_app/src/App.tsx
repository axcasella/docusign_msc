import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { Login, Certificate, DocusignAuth } from 'pages';
import { AuthRoute } from 'components';
import { useAuth, AuthProvider } from './services/auth';


const Home = () => {
  const history = useHistory();
  const auth = useAuth();
  useEffect(() => {
    if (!auth.isAuth) {
      history.push('/login');
    }
  }, [auth.isAuth, history]);
  return null;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signingComplete">
            <DocusignAuth />
          </Route>
          <AuthRoute path="/certification">
            <Certificate />
          </AuthRoute>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </AuthProvider>
    </Router>
  );
};

export default App;
