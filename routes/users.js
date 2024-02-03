const express = require('express');
const router = express.Router();
const axios = require('axios');
const { generateToken, verifyToken } = require('../middlewares/authMiddleware.js');
const { comparePasswords, generateSecret } = require('../crypto/config.js');

const users = [
  { id: 1, username: 'usuario1', password: generateSecret('contraseña1'), name: 'Usuario Uno' },
  { id: 2, username: 'usuario2', password: generateSecret('contraseña2'), name: 'Usuario Dos' },
];

// Ruta de inicio
router.get('/', (req, res) => {
  const loginForm = `
    <form action="/login" method="post">
      <label for="username">Usuario:</label>
      <input type="text" id="username" name="username" required><br>

      <label for="password">Contraseña:</label>
      <input type="password" id="password" name="password" required><br>

      <button type="submit">Iniciar sesión</button>
    </form>
    <a href="/characters">characters</a>
  `;
  res.send(loginForm);
});

// Ruta de inicio de sesión
// users.js
// users.js
// users.js
// users.js
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) {
    console.error('Usuario no encontrado');
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const passwordMatch = comparePasswords(password, user.password);

  if (passwordMatch) {
    console.log('Usuario autenticado correctamente:', user);
    req.session.user = user;
    return res.redirect(`/characters`);
  } else {
    console.error('Contraseña incorrecta');
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});




/////////////////////////////////////

router.get('/characters', verifyToken, async (req, res, next) => {
  try {
    const response = await axios.get('https://rickandmortyapi.com/api/character');
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching characters:', error.message);
    next(error);
  }
});

router.get('/characters/:characterName', async (req, res) => {
  const user = req.session.user;

  if (user) {
    const characterName = req.params.characterName;
    const url = `https://rickandmortyapi.com/api/character/?name=${characterName}`;

    try {
      const response = await axios.get(url);
      const character = response.data.results[0];

      if (character) {
        const { name, status, species, gender } = character;
        res.json({ name, status, species, gender });
      } else {
        res.status(404).json({ error: 'Personaje no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching character', details: error.message });
    }
  } else {
    res.status(401).json({ message: 'Usuario no encontrado' });
  }
});

// Ruta de cierre de sesión
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
