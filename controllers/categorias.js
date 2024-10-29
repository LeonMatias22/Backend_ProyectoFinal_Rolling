import Categoria from "../models/categorias.js";

const traerCategorias = async (req, res) => {
  try {
    const { limite = 5, desde = 0 } = req.query;

    // Obtiene las categorías con estado activo
    const [categorias, total] = await Promise.all([
      Categoria.find({ estado: true })
        .limit(Number(limite))
        .skip(Number(desde))
        .populate("usuario", "nombre email"),
      Categoria.countDocuments({ estado: true }),
    ]);

    res.json({
      total,
      categorias,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al obtener las categorías",
    });
  }
};

const agregarCategoria = async (req, res) => {
  const nombre = req.body.nombre.toUpperCase();

  // Si existe esa categoría
  const categoriaEncontrada = await Categoria.findOne({ nombre });
  if (categoriaEncontrada) {
    return res.status(400).json({
      msg: `La categoría ${nombre} ya existe`,
    });
  }

  const usuario = req.usuario._id;

  const categoria = new Categoria({ nombre, usuario });

  categoria.save();

  res.status(200).json({
    msg: "Categoría guardada",
    categoria,
  });
};

const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    // Convertir el nombre a mayúsculas
    const nombreActualizado = nombre.toUpperCase();

    // Verificar si ya existe otra categoría con el mismo nombre
    const categoriaExistente = await Categoria.findOne({
      nombre: nombreActualizado,
    });
    if (categoriaExistente && categoriaExistente._id.toString() !== id) {
      return res.status(400).json({
        msg: `La categoría ${nombreActualizado} ya existe`,
      });
    }

    // Actualizar la categoría
    const categoria = await Categoria.findByIdAndUpdate(
      id,
      { nombre: nombreActualizado },
      { new: true }
    );

    res.json({
      msg: "Categoría actualizada",
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al actualizar la categoría",
    });
  }
};

//Borrar Categoría
const borrarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    // Cambiar el estado de la categoría a false
    const categoria = await Categoria.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    res.json({
      msg: "Categoría eliminada",
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al eliminar la categoría",
    });
  }
};

export {
  traerCategorias,
  agregarCategoria,
  actualizarCategoria,
  borrarCategoria,
};
