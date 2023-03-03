const User = require('../models/User');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.create({ username, email, password });
  
  if (user) res.status(201).json(user);
}

module.exports = { register }
