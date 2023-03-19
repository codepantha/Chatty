import axios from 'axios';
import React, { useState } from 'react';

const RegisterAndLoginPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState({
    success: '',
    error: null
  });
  const [registerPage, setRegisterPage] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponse({ success: '', error: null });
    name === 'username'
      ? setUsername(value)
      : name === 'email'
      ? setEmail(value)
      : setPassword(value);
  };

  const submitHandler = async (e) => {
    const url = `auth/${registerPage ? 'register' : 'login'}`;
    e.preventDefault();
    try {
      const res = await axios.post(url, {
        username,
        email: email ? email : null,
        password
      });

      if (res.status === 201 || res.status === 200) {
        const data = await res.data;
        setResponse({ error: null, success: data.msg });
        resetForm();
      }
    } catch (err) {
      setResponse({ ...response, error: err.response.data.msg });
    }
  };

  function resetForm() {
    setUsername('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className="bg-blue-50 h-screen flex flex-col items-center justify-center">
      <form onSubmit={submitHandler} className="w-64 mx-auto">
      <p
        className={`${
          response.error ? 'text-red-600' : 'text-green-500'
        } font-semibold text-sm p-2 mb-2 text-center w-full`}
      >
        {response.success || response.error}
      </p>
        <input
          value={username}
          onChange={handleChange}
          type="text"
          name="username"
          placeholder="username"
          className="w-full rounded-sm p-2 mb-2 border"
        />
        {registerPage && (
          <input
            value={email}
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="johndoe@example.como"
            className="w-full rounded-sm p-2 mb-2 border"
          />
        )}
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
          {registerPage ? 'Register' : 'Login'}
        </button>
        <div className="text-center mt-2">
          {registerPage ? (
            <p>
              Already have an account?{' '}
              <span
                className="loginText"
                role="button"
                onClick={() => setRegisterPage(false)}
              >
                Login
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <span
                className="loginText"
                role="button"
                onClick={() => setRegisterPage(true)}
              >
                Register
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterAndLoginPage;
