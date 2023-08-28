const bcrypt = require("bcrypt");
const saltRounds = 10;

const generateHashPassword = async (password) => {
  const hash = await bcrypt.hashSync(password, saltRounds);
  return hash;
};

const comparePassword = (password, hashPass) => {
  const result = bcrypt.compareSync(password, hashPass);
  return result;
};

module.exports = { generateHashPassword, comparePassword };
