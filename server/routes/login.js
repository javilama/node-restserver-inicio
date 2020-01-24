const express = require('express'); //Libreria Express
const bcrypt = require('bcrypt'); // Importa bcrypt plugin
const jwt = require('jsonwebtoken'); // importa la libreria jsonwebtoken, para generar un token despues de autenticar
const Usuario = require('../models/usuario'); //Se importa el Schema usuario

const app = express(); //inicializa la libreria express




app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => { //Busca un usuario por email

        if (err) { // valida un error en la persistencia
            return res.status(500).json({
                ok: false,
                err

            });
        }

        if (!usuarioDB) { // Valida si el usuario no existe o no escorrecto.

            return res.status(400).json({
                ok: false,
                err: {
                    message: ' (Usuario) o contraseña invalidos'
                }

            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) { // Valida si la contraseña no es correcta.

            return res.status(400).json({
                ok: false,
                err: {
                    message: ' Usuario o (contraseña) invalidos'
                }

            });


        }
        //Genera token usando la libreria jsonwebtoken
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.TOKEN_SEED, { expiresIn: process.env.EXP_TOKEN }); // configuracion del "secret" y el expiracion del token (segundos, minutos,horas,dias)
        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        })

    });


});



module.exports = app;