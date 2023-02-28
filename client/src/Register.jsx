import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    name === 'username' ? setUsername(value) : setPassword(value);
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto">
        <input
          value={username}
          onChange={handleChange}
          type="text"
          name="username"
          placeholder="username"
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
