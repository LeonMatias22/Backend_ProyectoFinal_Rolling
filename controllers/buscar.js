import { response, request } from "express";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types; // Asegura que sea 'ObjectId' en mayúscula

// Importar modelos
import Categoria from "../models/categorias.js";
import Producto from "../models/modelo_de_productos.js";

// Colecciones permitidas
const coleccionesPermitidas = ["categorias", "productos"];

// Función para buscar por categoría
const buscarCategorias = async (termino, res = response) => {
  const isMongoId = ObjectId.isValid(termino); //si el ID es valido de mongo nos va a devolver un true

  if (isMongoId) {
    const categoria = await Categoria.findById(termino).populate("usuario", "nombre");
    return res.json({
      result: categoria ? [categoria] : [],
    });
  }

  // Realizar búsqueda por nombre
  const regex = new RegExp(termino, "i");
  const categorias = await Categoria.find({
    nombre: regex,
    estado: true,
  }).populate("usuario", "nombre");

  res.json({
    result: categorias,
  });
};

// Función para buscar productos
const buscarProductos = async (termino, res = response) => {
  const isMongoId = ObjectId.isValid(termino);

  if (isMongoId) {
    const producto = await Producto.findById(termino)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre");
    return res.json({
      result: producto ? [producto] : [],
    });
  }

  // Realizar búsqueda por nombre
  const regex = new RegExp(termino, "i");
  const productos = await Producto.find({
    nombre: regex,
    estado: true,
  })
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json({
    result: productos,
  });
};

// Función principal de búsqueda
const buscar = async (req = request, res = response) => {
  const { coleccion, termino } = req.params;

  // Verificar si la colección es válida
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "categorias":
      await buscarCategorias(termino, res);
      break;
    case "productos":
      await buscarProductos(termino, res);
      break;
    default:
      res.status(500).json({
        msg: "No se generaron las búsquedas",
      });
      break;
  }
};

export default buscar;
