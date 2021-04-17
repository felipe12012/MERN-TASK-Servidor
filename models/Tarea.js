const mongoose = require('mongoose');
const TareasSchema = mongoose.Schema({
    nombre:{
        type: String,
        require: true,
        trim: true
    },
    estado:{
        type: Boolean,
        default: false
    },
    creado:{
        type: Date,
        default: Date.now()
    },
    proyecto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto'
    }
})

module.exports = mongoose.model('Tarea',TareasSchema);