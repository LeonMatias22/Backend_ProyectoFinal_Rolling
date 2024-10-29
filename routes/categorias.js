import {Router} from 'express'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import { validarJWT } from '../middlewares/validar-jwt.js'
import { esAdminRole } from '../middlewares/validar-roles.js';
import { 
     actualizarCategoria,
     agregarCategoria, 
     borrarCategoria, 
     traerCategorias } from '../controllers/categorias.js';

const routerCat = Router();


routerCat.get("/",
    [
        validarJWT,
    ],
    traerCategorias );

routerCat.post("/", 
    [
        validarJWT,
        esAdminRole,
        check("nombre", "El nombre es obligatorio").notEmpty(),
        validarCampos,
    ]
    ,agregarCategoria  );

    routerCat.put("/:id", 
        [
            validarJWT,
            esAdminRole,
            check("id", "No es un ID válido").isMongoId(),  // Valida el ID
            check("nombre", "El nombre es obligatorio").notEmpty(), // Valida el campo nombre
            validarCampos,
        ], 
        actualizarCategoria 
    );
    
    routerCat.delete("/:id", 
        [
            validarJWT,
            esAdminRole,
            check("id", "No es un ID válido").isMongoId(), // Valida el ID
            validarCampos,
        ], 
        borrarCategoria
    );






export default routerCat







