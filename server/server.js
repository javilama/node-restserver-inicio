require('./config/config');

const express = require('express'); //Libreria Express
const cors = require('cors');
const mongoose = require('mongoose'); // Libreria mongoose

const app = express();
const bodyParser = require('body-parser'); // libreria bodyParser

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    //Configuracion global de rutas
app.use(require('./routes/index')); // importa todas las rutas configuradas en index.js


//Conexion a la BD en Mongo usando la libreria mongoose
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {

    if (err) throw err;

    console.log('Database is connected');




});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});