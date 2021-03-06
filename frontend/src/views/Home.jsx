import React, { useState } from 'react';

import { getMessage } from '../utils/api';
import { isAuthenticated } from '../utils/auth';




export const Home = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const queryBackend = async () => {
    try {
      const message = await getMessage();
      setMessage(message);
    } catch (err) {
      setError(err);
    }
  };

  return (

    <>
      {!message && !error && (
        <a href="#" onClick={() => queryBackend()}>
          Click to make request to backend
        </a>
      )}
      {message && (
        <p>
          <code>{message}</code>
        </p>
      )}
      {error && (
        <p>
          Error: <code>{error}</code>
        </p>
      )}
      <a href="/protected">
        Protected Route
      </a>
      {isAuthenticated() ? (
        <a href="/logout">
          Logout
        </a>
      ) : (
        <>
          <a href="/login">
            Login
          </a>
          <a href="/signup">
            Sign Up
          </a>
        </>
      )}
    </>
  );
};
