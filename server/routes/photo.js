const express = require('express'); //Libreria Express
const multer = require('multer');
const Photo = require('../models/photos'); // Se importa el schema photos
const fs = require('fs'); //importa la libreria fileSystem de node
const path = require('path'); //importa la libreria path para generar y gestionar rutas de archivos
const uuid = require('uuid/v4')

const app = express(); //inicializa la libreria express

app.get('/photo', async(req, res) => {

    let since = req.params.since || 0; // Se declara variable que maneja la funcion skip()
    since = Number(since);
    let limit = req.params.limit || 0; // se declara variable que maneja la funcion limit()
    limit = Number(limit);
    let photos = await Photo.find({})
        .skip(since)
        .limit(limit)
        .exec((err, photos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err

                });
            }
            if (!photos) {
                return res.status(500).json({
                    ok: false,
                    err

                });
            }
            Photo.countDocuments({}, (err, count) => {

                res.json({
                    ok: true,
                    photos,
                    count
                });
            })

        })

});

app.get('/photo/:img', (req, res) => {

    let img = req.params.img;


    let imgPath = path.resolve(__dirname, `../../uploads/photos/${img}`);
    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {

        let notImagePath = path.resolve(__dirname, '../assets/notImage.jpg');
        res.sendFile(notImagePath);
    }

});


// ========================
// METODO POST USANDO MULTER

// ========================
// se asigna a la constante storage el uso del metodo storage de multer
const storage = multer.diskStorage({
        destination: path.join(__dirname, '../../uploads/photos'),
        filename: (req, file, cb) => {
            cb(null, uuid() + path.extname(file.originalname).toLowerCase()); //se genera un nombre aleatorio
        }
    })
    // se asigna el proceso mediante multer a una constante y luego se usa en metodo post
const upload = multer({
    storage,
    dest: path.join(__dirname, '../../uploads/photos'),
    //se valida que se reciba una extension válida
    fileFilter: (req, file, cb) => {
        let fileTypes = /png|jpg|gif|jpeg/; //se limita el tipo de extension a recibir
        let mimeType = fileTypes.test(file.mimetype);
        let ext = fileTypes.test(path.extname(file.originalname));
        if (mimeType && ext) {
            return cb(null, true);

        }
        cb('It is not a valid extension!')



    }
}).single('img');


app.post('/photo', upload, (req, res) => {
    // let dateTime = new Date();
    let body = req.body
    let photo = new Photo({
        name: body.name,
        detail: body.detail,
        date: new Date().toDateString(),
        img: req.file.filename
    });
    if (!req.file) {

        return res.status(400).json({

            ok: false,
            err: {
                message: 'no se ha seleccionado ninguna imagen'
            }
        });
    }
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
    // console.log(req.file);
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