const express = require('express'); //importa la Libreria Express
const fileUpload = require('express-fileupload'); //importa la Libreria express-fileupload
const Photo = require('../models/photos');
const fs = require('fs'); //importa la libreria fileSystem de node
const path = require('path'); //importa la libreria path para generar y gestionar rutas de archivos
const app = express(); //inicializa la libreria express



app.use(fileUpload());


app.post('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {

        return res.status(400).json({

            ok: false,
            err: {
                message: 'no se ha seleccionado ninguna imagen'
            }
        });
    }
    let file = req.files.file;
    let cutName = file.name.split('.');
    let extension = cutName[cutName.length - 1];

    //extensiones validas
    let ext = ['png', 'jpg', 'gif', 'jpeg'];
    //Se verifica que la extension sea válida
    if (ext.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: ' Only file extension: ' + ext.join(', '),
                ext: extension
            }
        })

    }
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`

    file.mv(`uploads/${tipo}/${fileName}`, (err) => {

        if (err) {

            return res.status(500).json({

                ok: false,
                err
            });
        }
        // <==========================>
        // imagen cargada
        // <==========================>
        imagen(id, res, fileName);




    });

});

function imagen(id, res, fileName) {
    Photo.findById(id, (err, photoBD) => {
        // if (err) {
        //     return res.status(500).json({
        //         ok: false,

        //     })
        // }
        // if (!photoBD) {
        //     return res.status(400).json({
        //         ok: false,
        //         err: {
        //             message: 'No existe la imagen'
        //         }

        //     });
        // }



        photoBD.img = fileName;
        photoBD.save((err, imagenGuardada) => {
            res.json({
                ok: true,
                imagen: imagenGuardada,
                img: fileName
            })
        })
    });
}


module.exports = app;