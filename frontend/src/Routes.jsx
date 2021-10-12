import React, {useContext} from 'react';
import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router';

import { Home, Login, SignUp, Protected, PrivateRoute, Dashboard } from './views';
import { logout } from './utils/auth';
import { mainContext } from './views/context/mainContext';


export const Routes = () => {
  const history = useHistory();
  const { setUser } = useContext(mainContext)

  return (
    <Switch>
        <header>
          <Route path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route
            path="/logout"
            render={() => {
              logout();
              setUser(null)
              history.push('/');
              return null;
            }}
          />
          <PrivateRoute path="/" component={Dashboard} />
          <Route exact path="/home" component={Home} />
        </header>
    </Switch>
  );
};
