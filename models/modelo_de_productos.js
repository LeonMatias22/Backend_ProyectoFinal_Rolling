import { Schema, model } from "mongoose";
const ProductoSchema = Schema({  
  nombre: {
    type: String,
    unique: true,
    required: [true, "El nombre es obligatorio"], 
  },
  estado: {  
    type: Boolean,
    default: true, 
  },
  usuario: { 
    type: Schema.Types.ObjectId, 
    ref: "Usuario", 
    required: true, 
  },
  categoria: {  
    type: Schema.Types.ObjectId,  
    ref: "Categoria",
    required: true,
  },
  precio: {
    type: Number,
    default: 0,
  },
  descripcion: {
    type: String, 
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  destacado: {
    type: Boolean,
    default: false,
  },
  img: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNK7-n-r_w_qCEIjsnu8VXMBamUkSmLUr9Eg&s",
  },
  stock: {
    type: Number,
    default: 0,
  },
});

export default model("Producto", ProductoSchema);