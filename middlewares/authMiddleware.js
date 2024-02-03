// authMiddleware.js
const jwt = require('jsonwebtoken');
const { generateSecret } = require('../crypto/config.js');

// Función para generar un token JWT utilizando la información del usuario.
function generateToken(user) {
  const hashedSecret = generateSecret(); // Generamos el secreto cada vez
  return jwt.sign({ user: user.id }, hashedSecret, { expiresIn: '1h' });
}

// Middleware que verifica la validez del token almacenado en la sesión.
function verifyToken(req, res, next) {
  const token = req.session.token;

  if (!token) {
    console.error('Token no proporcionado en la sesión');
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, generateSecret(), (err, decoded) => {
    if (err) {
      console.error('Error al verificar token:', err);
      return res.status(401).json({ message: 'Token inválido', error: err.message });
    }

    req.user = decoded.user;
    console.log('Token verificado correctamente. Usuario:', req.user);
    next();
  });
}

module.exports = { generateToken, verifyToken };
