const express = require('express');
const session = require('express-session');
const axios = require('axios');
const cors = require('cors');
const app = express();
const usersRoutes = require('./routes/users.js');

app.use(cors());

// Middlewares para el manejo de datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(
  session({
    secret: 'tu-secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Rutas
app.use('/', usersRoutes);


// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
