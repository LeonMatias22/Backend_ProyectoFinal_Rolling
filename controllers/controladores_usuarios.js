import { request, response } from "express";
import Usuario from "../models/modelo_de_usuarios.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const getUsers = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const todosLosUsuarios = await Usuario.find({ estado: true })
    .limit(limite)
    .skip(desde);
  const usuariosActivos = await Usuario.countDocuments({ estado: true });
  res.json({
    usuariosActivos,
    todosLosUsuarios,
  });
};

// Obtener un usuario específico por ID
const getUser = async (req = request, res = response) => {
  const { id } = req.params;
  const usuario = await Usuario.findById(id);
  res.json({
    usuario,
  });
};

const postUser = async (req = request, res = response) => {
  const datos = req.body;
  const { nombre, email, password, rol } = datos;

  const usuario = new Usuario({ nombre, email, password, rol });

  // Verificar si el email ya existe
  const existeEmail = await Usuario.findOne({ email });
  if (existeEmail) {
    return res.status(400).json({
      msg: "El correo ya existe",
    });
  }

  // Encriptar contraseña
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  // Guardar en la base de datos
  await usuario.save();
  res.status(201).json({
    msg: "¡Usuario creado con éxito!",
    usuario,
  });
};

const putUser = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const {
      password,
      _id,
      email,
      carrito,
      favoritos,
      eliminarFavorito, // Ahora esperará un arreglo de _id(s) de favoritos
      eliminarCarrito,
      productoId,
      cantidad,
      ...resto
    } = req.body;

    // Encriptar contraseña si está presente
    if (password) {
      const salt = bcrypt.genSaltSync();
      resto.password = bcrypt.hashSync(password, salt);
    }

    // Construir el objeto de actualización
    let update = { ...resto };

    // Manejo de carrito: agregar o eliminar productos
    if (carrito && Array.isArray(carrito)) {
      update = {
        ...update,
        $push: { carrito: { $each: carrito } }, // Agregar productos al carrito
      };
    }
    if (eliminarCarrito && Array.isArray(eliminarCarrito)) {
      update = {
        ...update,
        $pull: { carrito: { productoId: { $in: eliminarCarrito.map((item) => item.productoId) } } }, // Eliminar productos del carrito
      };
    }

    // Manejo de favoritos: agregar o eliminar productos
    if (favoritos && Array.isArray(favoritos)) {
      update = {
        ...update,
        $push: { favoritos: { $each: favoritos } }, // Agregar productos a favoritos
      };
    }
    if (eliminarFavorito && Array.isArray(eliminarFavorito)) {
      console.log(eliminarFavorito);
      
      update = {
        ...update,
        $pull: { favoritos: { productoId: { $in: eliminarFavorito } } }, // Eliminar favoritos por productoId
      };
    }

    // Actualizar la cantidad del producto en el carrito
    if (productoId && cantidad) {
      if (cantidad <= 0) {
        return res.status(400).json({
          message: "La cantidad debe ser un número positivo",
        });
      }

      update = {
        ...update,
        $set: { "carrito.$[elem].cantidad": cantidad },
      };

      const usuario = await Usuario.findOneAndUpdate(
        { _id: id },
        update,
        {
          arrayFilters: [{ "elem.productoId": productoId }],
          new: true,
        }
      );

      if (!usuario) {
        return res.status(404).json({
          message: "Usuario o producto no encontrado",
        });
      }

      return res.status(200).json({
        message: "Cantidad actualizada",
        usuario,
      });
    }

    // Actualizar el usuario en la base de datos
    const usuario = await Usuario.findByIdAndUpdate(id, update, { new: true });
    res.status(200).json({
      message: "Usuario actualizado",
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message || error,
    });
  }
};


const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;

  // Desactivar usuario en lugar de eliminar
  const usuarioBorrado = await Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    message: `El usuario ${usuarioBorrado.nombre} ha sido eliminado`,
    usuarioBorrado,
  });
};

export { getUsers, getUser, postUser, putUser, deleteUser };
