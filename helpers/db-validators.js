import Role from "../models/modelo_roles.js";
import Usuarios from "../models/modelo_de_usuarios.js";
import Producto from "../models/modelo_de_productos.js";

const esRolValido = async (rol) => {
  const esRolValido = await Role.findOne({ rol });
  if (!esRolValido) {
    throw new Error(`El rol ${rol} no es valido`);
  }
};

const emailExiste = async (email) => {
  const existeEmail = await Usuarios.findOne({ email });
  if (existeEmail) {
    throw new Error(`El correo ${email} ya existe`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuarios.findById(id);

  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe`);
  }

  //Si el usuario existe, verifico su estado
  if (!existeUsuario.estado) {
    throw new Error(`El usuario ${existeUsuario.nombre} ya esta inactivo`);
  }
};

const productoExiste = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El id:${id} no existe en la base de datos`); 
  }
};

export { esRolValido, emailExiste, existeUsuarioPorId, productoExiste };
