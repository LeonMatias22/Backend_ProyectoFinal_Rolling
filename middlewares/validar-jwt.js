import jwt from "jsonwebtoken";
import Usuario from "../models/modelo_de_usuarios.js";

const validarJWT = async (req, res, next) => {
  //recibir el token
  const token = req.header("x-token");

  // si no hay un token devolver un mensaje y detener el proceso
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  //validar el token
  try {
    const { uid } = jwt.verify(token, process.env.PRIVATESECRETEKEY);
    //obtener los datos del usuario por su id
    const usuario = await Usuario.findById({ _id: uid });

    //verificar si el usuario existe
    if (!usuario) {
      return res.status(401).json({
        msg: "El usuario no existe en la BD",
      });
    }

    //Verificar si el usuario está activo
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no es válido",
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no es válido",
    });
  }
};

export { validarJWT };