const express = require('express'); //Libreria Express
const Photo = require('../models/photos'); // Se importa el schema photos

const app = express(); //inicializa la libreria express
//const Usuario = require('../models/usuario'); //Se importa el Schema usuario


app.post('/photo', (req, res) => {

    let body = req.body

    let photo = new Photo({
        name: body.name,
        detail: body.detail,
        date: new Date()
    });

    photo.save((err, photoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        res.json({
            ok: true,
            photo: photoDB
        });

    });

});


module.exports = app;