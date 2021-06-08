const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

const signToken = () => {
  console.log('call to signToken');
  const token = jwt.sign({}, env.JWT_SECRET);
  return token;
};

module.exports = { signToken };
