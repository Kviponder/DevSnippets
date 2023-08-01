import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/queries';
import { Button, Form, Alert } from 'react-bootstrap'; // Import Button, Form, and Alert from react-bootstrap
import '../styles.css'; // Import the styles.css file

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [addUser, { error }] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Call the ADD_USER mutation with the form data
      const { data } = await addUser({
        variables: { ...formData },
      });

      // Handle the response, such as displaying success messages or redirecting the user
      console.log('User created:', data.addUser);

      // Reset the form after successful submission
      setFormData({ username: '', email: '', password: '' });
    } catch (error) {
      // Handle any errors that occur during the mutation
      console.error('Error creating user:', error.message);
    }
  };

  return (
    <Form className="signup-form" onSubmit={handleSubmit}>
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </Form.Group>
      {error && <Alert variant="danger">{error.message}</Alert>}
      <Button type="submit" variant="gold" className="signup-button">
        Sign Up
      </Button>
    </Form>
  );
};

export default SignupForm;
