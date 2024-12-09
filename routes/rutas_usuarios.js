import {Router} from 'express'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import { validarJWT } from '../middlewares/validar-jwt.js'
import { esAdminRole } from '../middlewares/validar-roles.js'

import { emailExiste,esRolValido, existeUsuarioPorId} from '../helpers/db-validators.js'
import {getUsers, getUser,postUser, putUser, deleteUser} from '../controllers/controladores_usuarios.js'

const router = Router()


router.get('/',
     [
        validarJWT,
        esAdminRole,
     ]
    , getUsers)

router.get(
    "/:id",
    [
      validarJWT,
      check("id", "No es un Id valido").isMongoId(),
      check("id").custom(existeUsuarioPorId),
      validarCampos,
    ],
    getUser
)

router.post('/',[
    check("nombre","El nombre es obligatorio").notEmpty(),
    check("password", "la contraseña debe tener minimo 8 caracteres, mayusculas, minusculas, numeros y simmbolos especiales").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).isLength({min:8, max:12}),
    check("email", "El email no es valido").isEmail(), 
    check("email").custom(emailExiste),  
    check("rol").custom(esRolValido), 
    validarCampos,
], postUser) 


router.put('/:id', 
    [
       validarJWT,
        check("id").custom(existeUsuarioPorId), 
        check("id",  "No es un ID valido").isMongoId(), 
        // check("rol").custom(esRolValido),
        validarCampos 
    ]
    ,putUser )

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    // validarRol,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId), 
    validarCampos,
] ,deleteUser)

export default router