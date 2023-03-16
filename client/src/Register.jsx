import axios from 'axios';
import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    name === 'username'
      ? setUsername(value)
      : name === 'email'
      ? setEmail(value)
      : setPassword(value);
  };

  const register = async (e) => {
    e.preventDefault();
    const { data } = await axios.post('/auth/register', { username, email, password });
    console.log(data)
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form onSubmit={register} className="w-64 mx-auto">
        <input
          value={username}
          onChange={handleChange}
          type="text"
          name="username"
          placeholder="username"
          className="w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={email}
          onChange={handleChange}
          type="email"
          name="email"
          placeholder="johndoe@example.como"
          className="w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={handleChange}
          type="password"
          name="password"
          placeholder="password"
          className="w-full rounded-sm p-2 mb-2 border"
        />
        <button
          type="submit"
          className="bg-blue-500 w-full text-white p-2 rounded-sm uppercase hover:bg-blue-400"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
