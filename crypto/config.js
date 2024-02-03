const bcrypt = require('bcrypt');
const crypto = require('node:crypto');

// Generar secreto aleatorio
const generateSecret = () => {
  const secret = crypto.randomBytes(64).toString('hex');
  return bcrypt.hashSync(secret, 10);
};

// Comparar contraseñas
const comparePasswords = (inputPassword, hashedPassword) => {
  return bcrypt.compareSync(inputPassword, hashedPassword);
};

module.exports = {
  generateSecret,
  comparePasswords,
};
