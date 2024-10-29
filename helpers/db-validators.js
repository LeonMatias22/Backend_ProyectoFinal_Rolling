import Role from "../models/modelo_roles.js";
import Usuario from "../models/modelo_de_usuarios.js";
//import Producto from "../models/productos.js";

const rolValido = async (rol) => {
  const esRolValido = await Role.findOne({ rol });

  if (!esRolValido) {
    throw new Error(`${rol} no es un rol válido`);
  }
};

const emailExiste = async (email) => {
  const existeEmail = await Usuario.findOne({ email });

  if (existeEmail) {
    throw new Error(`El correo ${email} ya existe`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe`);
  }

  //Si el usuario existe verifico su estado
  if (!existeUsuario.estado) {
    throw new Error(`El usuario ${existeUsuario.nombre} ya está inactivo`);
  }
};

//validar Producto por id
const productoExiste = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El id ${id} no existe en la BD`);
  }
};

export { rolValido, emailExiste, existeUsuarioPorId, productoExiste };