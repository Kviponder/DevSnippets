import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/queries';

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        {error && <p>{error.message}</p>}
        <button type="submit">Sign Up</button>
      </div>
    </form>
  );
};

export default SignupForm;
