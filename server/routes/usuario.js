const express = require('express'); //Libreria Express
const bcrypt = require('bcrypt'); // Importa bcrypt plugin
const _ = require('underscore'); //Importa libreria undercore instalada.
const Usuario = require('../models/usuario'); //Se importa el Schema usuario
const { tokenAuth } = require('../middleware/auth'); // se importan middlewares personalizados 
const app = express(); //inicializa la libreria express


//metodo get (buscar)
app.get('/usuario', (req, res) => {
    // res.json('get Usuario LOCAL!!');
    let since = req.query.since || 0; // Se declara variable que maneja la funcion skip()
    since = Number(since);
    let limit = req.query.limit || 5; // se declara variable que maneja la funcion limit()
    limit = Number(limit);


    Usuario.find({ estado: true }, 'nombre email estado google img')
        .skip(since) // funcion skip para saltar una cantidad requerida de registros
        .limit(limit) // funcion limit para traer una cantidad especifica de registros
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err

                });
            }
            Usuario.count({ estado: true }, (err, count) => {


                res.json({
                    ok: true,
                    usuarios,
                    count
                });

            });


        });


});
// metodo post (crear)
app.post('/usuario', (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        // usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });



    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensage: 'El nombre es necesario'
    //     })
    // }
    // res.json({
    //     persona: body
    // });
});

// metodo put(actualizar)
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    // let body = _.pick(req.body, [nombre, email, password, img, role, estado]);
    let body = req.body;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        };
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })


});

// metodo delete(eliminar)
app.delete('/usuario/:id', (req, res) => {
    // res.json('delete Usuario');
    let id = req.params.id;
    let cambioEstado = {
            estado: false
        }
        // Usuario.findByIdAndRemove(id, cambioEstado, { new: true }, (err, userDeleted) // elimina el registro de la BD
    Usuario.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, userDeleted) => { // cambia el estado de activo a inactivo pero no elimina de la BD
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        };
        if (userDeleted === null) {
            return res.status(400).json(

                res.json({
                    ok: true,
                    err: {

                        message: 'Usuario no encontrado'
                    }
                })
            )
        }
        res.json({
            ok: true,
            userDeleted

        })



    })



});

module.exports = app;