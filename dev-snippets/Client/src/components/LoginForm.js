import React, { useState, useContext } from 'react'; // Make sure useContext is imported from 'react'
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/queries';
import Auth from '../utils/auth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await loginUser({
        variables: {
          email: email,
          password: password,
        },
      });

      // The login mutation should return a token upon successful login
      if (data.login.token) {
        // Save the token to localStorage or wherever you handle user authentication
        Auth.login(data.login.token);
      } else {
        // If the token is not returned, display an error message
        setShowAlert(true);
      }
    } catch (err) {
      console.error(err);
    }

    // Clear form values
    setEmail('');
    setPassword('');
  };

  return (
    <div>
      <h1>Welcome to the Login Page</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        {showAlert && <Alert variant="danger">Invalid credentials!</Alert>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
