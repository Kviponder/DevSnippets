import React, { useState } from 'react';
import { Button, Alert, Form } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/queries';
import Auth from '../utils/auth';
import '../styles.css'; // Import the styles.css file

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(email + " " + password);
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
    <div className="login-container">
      <h1 className="login-title">Welcome to the Login Page</h1>
      <Form className="login-form" onSubmit={handleFormSubmit}>
        <Form.Group controlId="email">
          <Form.Label className="form-label">Email:</Form.Label>
          <Form.Control
            type="text"
            value={email}
            onChange={handleEmailChange}
            required
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label className="form-label">Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="form-control"
          />
        </Form.Group>
        {showAlert && <Alert variant="danger" className="alert-danger">Invalid credentials!</Alert>}
        <Button
          type="submit"
          variant="gold"
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
