import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole } from "../middlewares/validar-roles.js";
import { 
    rolValido, 
    //emailExiste, 
    existeUsuarioPorId } from "../helpers/db-validators.js";
import {getUsers, postUser, putUser, deleteUser} from "../controllers/controladores_usuarios.js"

const router_usuarios = Router()

router_usuarios.get('/', [validarJWT, esAdminRole], getUsers,);

router_usuarios.post('/',
[check("nombre", "El nombre es obligatorio").notEmpty(),
check("password", "La contraseña debe tener al menos 8 caracteres").isLength({min:8, max:12}),
check("password", "La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas y un simbolo").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
check("email", "El mail no es válido").isEmail(),
//check("email").custom(emailExiste),
//check("rol").custom(rolValido),

validarCampos,
],


postUser);

router_usuarios.put('/:id',[

    validarJWT,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol"). custom(rolValido),
    validarCampos,
], putUser);

router_usuarios.delete('/:id', [validarJWT,
esAdminRole,
check("id", "El id no es válido").isMongoId(),
check("id").custom(existeUsuarioPorId),
validarCampos,
], deleteUser);

export default router_usuarios