import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { isAuthenticated } from '../utils/auth';
import { useLocation } from 'react-router-dom'
import { SignUp } from '.';


export const PrivateRoute = ({
  component,
  ...rest
}) => {
  const location = useLocation();
  console.log(location.pathname)
  return <Route
    {...rest}
    render={(props) =>
      isAuthenticated() === true ?  (
        React.createElement(component, props)
      ) : location.pathname === '/signup' ? "" : (
        <Redirect to="/login" />
      )
    }
  />
;
}