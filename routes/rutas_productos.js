import { Router } from "express";
import { check } from "express-validator"; 

import { validarCampos } from "../middlewares/validar-campos.js"; 
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole } from "../middlewares/validar-roles.js"; 

import { productoExiste } from "../helpers/db-validators.js";

import {
  productoPost,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} from "../controllers/controladores_productos.js";

const routerProd = Router(); 

routerProd.get("/", 
  // [validarJWT],
   obtenerProductos);

//Listar producto por id
routerProd.get(
  "/:id",
  [
    // validarJWT,
    check("id", "El id no es válido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  obtenerProducto
);

//Agregar producto a la BD
routerProd.post(
  "/",
  [
    validarJWT,
    esAdminRole,
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("categoria", "La categoría es obligatoria").notEmpty(),
    validarCampos,
  ],
  productoPost
);

//Actualizar producto
routerProd.put(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un Id válido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  actualizarProducto
);

//Cambiar el estado del producto
routerProd.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un Id válido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  borrarProducto
);

export default routerProd;