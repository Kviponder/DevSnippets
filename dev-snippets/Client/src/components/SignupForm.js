import React, { useState } from 'react';
import API from '../utils/API';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the signup route with the signup data
      const response = await API.post('/users/signup', { username, password });

      if (response.status === 200) {
        // If the signup is successful, clear the form and display a success message
        setUsername('');
        setPassword('');
        setErrorMessage('Signup successful! Please login.');
      }
    } catch (error) {
      // If there's an error, display the error message
      setErrorMessage('Error during signup. Please try again.');
      console.error('Error during signup:', error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Signup</button>
        </div>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default SignupForm;
