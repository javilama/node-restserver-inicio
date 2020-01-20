const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let photosSchema = new Schema({

    name: {
        type: String,
        required: [true, 'debe poner un nombre a la foto']
    },
    detail: {
        type: String
    },

    date: {
        type: String
    },
    img: {
        type: String
    }

})












module.exports = mongoose.model('Photos', photosSchema);