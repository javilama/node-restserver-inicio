require('./config/config');

const express = require('express'); //Libreria Express
const mongoose = require('mongoose'); // Libreria mongoose

const app = express();
const bodyParser = require('body-parser'); // libreria bodyParser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario')); // importa la ruta de usuarios.


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {

    if (err) throw err;

    console.log('Database is connected');




});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});