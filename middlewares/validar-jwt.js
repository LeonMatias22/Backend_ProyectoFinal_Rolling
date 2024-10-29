import jwt from "jsonwebtoken";// Aquí tenemos todos los métodos necesarios para poder generar el token
import Usuario from "../models/modelo_de_usuarios.js";


const validarJWT = async (req, res, next) => {
  // Primero tenemos que recibir el token
  const token = req.header('x-token') // Si esta clave está en los headers, la almaceno en el token

  // Si no hay un token, devolver un mensaje y detener el proceso
  if (!token) {
    return res.status(401).json({ // 401 => No autorizado
      msg: 'No hay token en la petición'
    });
  }

  // Validar el token
  try {
    // Aquí hacemos el proceso para ver si el token es válido.
    // Primero tenemos que obtener el payload (los datos que vienen del token).
    const { uid } = jwt.verify(token, process.env.PRIVATESECRETEKEY);

    // Ya teniendo el id, podemos obtener los datos del usuario por su id
    const usuario = await Usuario.findById({ _id: uid }); 

    // Verificar si el usuario existe
    if (!usuario) {
      return res.status(401).json({
        msg: "El usuario no existe en la base de datos"
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no es válido",
      });
    }

    // Genero dentro del servidor (en tiempo de ejecución) una req con los datos del usuario
    req.usuario = usuario;
     console.log(req.usuario);
     

    next(); 

  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no es válido"
    });
  }
}

export { validarJWT };
