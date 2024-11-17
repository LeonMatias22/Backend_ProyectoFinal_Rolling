import jwt from "jsonwebtoken";
import Usuario from "../models/modelo_de_usuarios.js";


const validarJWT = async (req, res, next) => {

  const token = req.header('x-token') 


  if (!token) {
    return res.status(401).json({ 
      msg: 'No hay token en la petición'
    });
  }

  // Validar el token
  try {
    const { uid } = jwt.verify(token, process.env.PRIVATESECRETEKEY);
    
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
