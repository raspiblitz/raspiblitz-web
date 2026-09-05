const jwt = require("jsonwebtoken");
require("dotenv").config();

const signToken = () => {
  console.info("call to signToken");
  return jwt.sign(
    { user_id: "admin" },
    process.env.JWT_SECRET || "secret",
    { expiresIn: 630 },
  );
};

module.exports = { signToken };
