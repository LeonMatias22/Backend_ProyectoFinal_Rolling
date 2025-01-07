import { Schema, model } from "mongoose";

const UsuarioSchema = new Schema({
  nombre: { type: String, required: [true, "El nombre es obligaorio"] },

  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },

  img: {
    type: String,
    default:
      "https://img.freepik.com/vector-premium/icono-circulo-usuario-anonimo-ilustracion-vector-estilo-plano-sombra_520826-1931.jpg",
  },

  rol: {
    type: String,
    required: true,
    // enum: ["USER_ROLE", "ADMIN_ROLE"],
  },

  estado: {
    type: Boolean,
    default: true,
  },

  favoritos: [{ 
    productoId: 
    { type: Schema.Types.ObjectId,
       ref: "Producto" 
      },
 nombre:{
  type:String,
  ref:"Producto"
 }     
       }],
  carrito: [
    {
      productoId: { type: Schema.Types.ObjectId, ref: "Producto" },
      cantidad: { type: Number, required: true },
    },
  ],
});

export default model("Usuario", UsuarioSchema);
