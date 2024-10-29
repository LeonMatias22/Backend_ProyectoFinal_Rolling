import { Schema, model } from "mongoose";

const RolSchema = Schema({
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
  },
});

export default model("Role", RolSchema);