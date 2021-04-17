const Proyecto = require('../models/Proyecto')
const {validationResult} = require('express-validator')


exports.crearProyecto = async (req, res)=>{
    // revisar si hay errores 
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    try {
        const proyecto = new Proyecto(req.body);
        // guardar el creado por jwt 
        proyecto.creador = req.usuario.id;

        // guardamos el proyecto  
        proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }

}

// obtiene todos los proyectos del usuario actual 

exports.obtenerProyectos = async(req,res)=>{
    try {
        // console.log(req.usuarios)
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1})
        res.json({proyectos})
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error')
    }
}

// actualiza un proyecto 

exports.actualizarProyecto = async(req,res)=>{
    // revisar si hay errores 

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    // extraer la informacion del proyecto 
    const {nombre} = req.body;
    const nuevoProyecto = {};
    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // revisar el ID 
        let proyecto = await Proyecto.findById(req.params.id);
        // si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({msg: 'proyecot no encontrado'})
        }
    
        // verificar el creador del proyecto 
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'no autorizado'})
        }
    

        // actualizar 
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set : nuevoProyecto},{new: true})

        res.json({proyecto})


    } catch (error) {
        console.log(error);
        res.status(500).send('error en el servidor');
    }
}

// elimina un proyecto por su id 

exports.eliminarProyecto = async (req,res)=>{
      // revisar el ID 
    try {
          // revisar el ID 
        let proyecto = await Proyecto.findById(req.params.id);
          // si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({msg: 'proyecto no encontrado'})
        }
          // verificar el creador del proyecto 
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'no autorizado'})
        }
        // eliminar el proyecto 
        await  Proyecto.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Proyecto eliminado'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }
}