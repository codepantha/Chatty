import axios from 'axios';

import Register from "./Register"

function App() {
  axios.defaults.baseURL = 'http://localhost:5000/api/v1';
  axios.defaults.withCredentials = true;
  return (
    <Register />
  )
}

export default App
