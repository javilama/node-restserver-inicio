const express = require('express'); //Libreria Express
const Photo = require('../models/photos'); // Se importa el schema photos
const fs = require('fs'); //importa la libreria fileSystem de node
const path = require('path'); //importa la libreria path para generar y gestionar rutas de archivos
const Upload = require('./upload');
const app = express(); //inicializa la libreria express
//const Usuario = require('../models/usuario'); //Se importa el Schema usuario


app.post('/photo', (req, res) => {
    // let dateTime = new Date();
    let body = req.body
    let photo = new Photo({
        name: body.name,
        detail: body.detail,
        date: new Date().toDateString(),
        img: body.img
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

app.delete('/photo/:id', (req, res) => {

    let id = req.params.id;
    Photo.findByIdAndDelete(id, (err, photoDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        };

        if (photoDelete === null) {

            return res.status(400).json(

                res.json({
                    ok: true,
                    err: {

                        message: 'La imagen ya no existe'
                    }
                })
            )

        };
        // let upload = new Upload();
        let nameImg = photoDelete.img;
        let urlDelete = '../../uploads/photos'

        deleteImg(urlDelete, nameImg);

        res.json({
            ok: true,
            message: 'deleted image succesfull!!'
        })

    })

});

function deleteImg(route, nameFile) {

    let pathImage = path.resolve(__dirname, `${ route }/${nameFile}`);

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)

    };

};



module.exports = app;