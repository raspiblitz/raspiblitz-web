const jwt = require('jsonwebtoken');
require('dotenv').config();

const signToken = () => {
  console.log('call to signToken');
  const token = jwt.sign({}, process.env.JWT_SECRET);
  return token;
};

module.exports = { signToken };
