const express = require('express'); //Libreria Express
const app = express(); //inicializa la libreria express




app.use(require('./usuario')); // importa la ruta de usuarios.

app.use(require('./login')); //importa la ruta login















module.exports = app;