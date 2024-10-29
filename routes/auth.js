import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { login } from "../controllers/auth.js"

const routerAuth = Router()
routerAuth.post("/login", 
[
  check("email", "El correo es necesario ingresar ").isEmail(),
  check("password", "La contraseña es requerida").notEmpty(),
  validarCampos,


],

login);

export default routerAuth;