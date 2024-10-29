import Usuario from "../models/modelo_de_usuarios.js";
import bcrypt from "bcryptjs";
import { generarJWT } from "../helpers/genera-jwt.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //verificar si el email existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        msg: "Correo / contraseña nos son correctos",
      });
    }
    // si el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Correo / contraseña nos son correctos",
      });
    }

    // verificar la contraseña
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Correo / contraseña nos son correctos",
      });
    }

    // genero el token
    const token = await generarJWT(usuario._id);

    res.status(202).json({
      msg: "Login ok",
      uid: usuario.id,
      token,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Comuníquese con el administrador",
    });
  }
};

export { login };