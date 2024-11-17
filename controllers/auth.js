import Usuarios from "../models/modelo_de_usuarios.js";
import bcrypt from "bcryptjs";
import { generarJWT} from '../helpers/generar_jwt.js'

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Verificar si el email existe en la base de datos
    const usuario = await Usuarios.findOne({ email });
    if (!usuario) {
      
      return res.status(400).json({
        msg: "Correo / contraseña no son correctos",
      });
    }

    //Verificar si el usuario esta activo
    if (!usuario.estado) {
      
      return res.status(400).json({
        msg: "Correo / contraseña no son correctos",
      });
    }

    //Verificar la contraseña
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Correo / contrasela no son correctos",
      });
    }

    //Genero el Token
   const token = await generarJWT(usuario.id);

    res.status(202).json({
      msg: "Login ok",
      uid: usuario.id,
      token,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Comuniquese con el administrador",
    });
  }
};

export { login };
