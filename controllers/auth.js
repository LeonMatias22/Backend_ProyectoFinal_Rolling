import Usuarios from "../models/modelo_de_usuarios.js";
import bcrypt from "bcryptjs";
import { generarJWT } from "../helpers/generar_jwt.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario e incluir los datos de los productos referenciados
    const usuario = await Usuarios.findOne({ email })
      .populate("favoritos.productoId", "nombre precio img") // Incluye datos relevantes de los productos en favoritos
      .populate("carrito.productoId", "nombre precio img");  // Incluye datos relevantes de los productos en el carrito

    if (!usuario) {
      return res.status(400).json({
        msg: "Correo o contraseña incorrectos",
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "El usuario está inactivo, contacte al administrador",
      });
    }

    // Verificar la contraseña
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Correo o contraseña incorrectos",
      });
    }

    // Generar el Token
    const token = await generarJWT(usuario.id);

    // Retornar datos esenciales del usuario con productos poblados
    res.status(200).json({
      msg: "Login exitoso",
      usuario: {
        uid: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        favoritos: usuario.favoritos, 
        carrito: usuario.carrito,   
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Ocurrió un error en el servidor. Por favor, contacte al administrador.",
    });
  }
};

export { login };