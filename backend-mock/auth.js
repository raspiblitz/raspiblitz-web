const jwt = require('jsonwebtoken');
require('dotenv').config();

const signToken = () => {
  console.info('call to signToken');
  return jwt.sign(
    { user_id: 'admin', expires: Date.now() + 630_000 },
    process.env.JWT_SECRET || 'secret',
  );
};

module.exports = { signToken };
