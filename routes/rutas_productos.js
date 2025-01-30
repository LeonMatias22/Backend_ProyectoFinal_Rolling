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
  obtenerProductosPorCategoria, // Importación de la nueva función
} from "../controllers/controladores_productos.js";

const routerProd = Router();

// Obtener todos los productos
routerProd.get("/", obtenerProductos);

// Obtener productos por categoría
routerProd.get(
  "/categoria/:id",
  [
    check("id", "El id de categoría no es válido").isMongoId(),
    validarCampos,
  ],
  obtenerProductosPorCategoria
);

// Obtener un producto por su ID
routerProd.get(
  "/:id",
  [
    check("id", "El id no es válido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  obtenerProducto
);

// Agregar un producto
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

// Actualizar un producto
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

// Eliminar un producto (cambia su estado a inactivo)
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
