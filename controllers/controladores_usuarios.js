import { request, response } from "express";
import Usuario from "../models/modelo_de_usuarios.js";
import bcrypt from "bcryptjs";

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
  const { password, _id, email, carrito, favoritos, ...resto } = req.body;
  if (password) {
  const salt = bcrypt.genSaltSync();
  resto.password = bcrypt.hashSync(password, salt);
  }
  if (carrito && Array.isArray(carrito)) {
  resto.carrito = carrito; }
  if (favoritos && Array.isArray(favoritos)) {
  resto.favoritos = favoritos;
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });
  res.status(200).json({
  message: "Usuario actualizado",
  usuario,
  });
  } catch (error) {
  console.error(error);
  res.status(500).json({
  message: "Error al actualizar el usuario",
  error,
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
