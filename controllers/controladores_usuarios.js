import {request, response} from 'express'
import Modelo_Usuario from '../models/modelo_de_usuarios.js'
import bcryptjs from 'bcryptjs'

const getUsers = async (req = request, res = response)=>{
    const {limite = 5, desde= 0} = req.query
    const todosLosUsuarios = await Modelo_Usuario.find({estado: true}).limit(limite).skip(desde);
    const usuariosActivos = await Modelo_Usuario.countDocuments({estado:true});
    res.json({
        usuariosActivos,
        todosLosUsuarios,
    });
};

const postUser = async (req = request, res = response) =>{

    const datos = req.body;
    const {nombre, email, password, rol} = datos;



    const usuario = new Modelo_Usuario({nombre, email, password, rol})




    // Encriptar contraseña

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt)

    // Guardar en la base de datos

    await usuario.save()
    res.status(201).json({
        msg: "¡Usuario creado con éxito!",
        usuario,

    });
};

const putUser = async (req = request, res = response) =>{

    const {id} = req.params;

    const {password, _id, email, ...resto} = req.body;

     // Encriptar contraseña

     const salt = bcrypt.genSaltSync();
     resto.password = bcrypt.hashSync(password, salt);

     const usuario = await Modelo_Usuario.findByIdAndUpdate(id, resto, {new: true});

     res.status(200).json({
        message: "Usuario actualizado",
        usuario
     })


};

const deleteUser = async (req = request, res = response) =>{
    const {id} = req.params;
    const usuarioBorrado = await Modelo_Usuario.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.json({
        message: "Usuario Eliminado",
        usuarioBorrado
    })
};

export {getUsers, postUser, putUser, deleteUser};