import { validationResult } from "express-validator";

const validarCampos = (req, res, next) => { //req = es lo que viene como informacion del usuario, res = es lo que recibe como respuesta del servidor, next = es un metodo que le va a decir a mi Middleware cuando puede continuar 
    
    const errors = validationResult(req) //verifica los errores(por la validacion)
    
    if(!errors.isEmpty()) {
        return res.status(400).json(errors) //Si encuentra algun error, va a retornar el estatus 400 y no va a continuar
    }
    next(); //Si noe encuentra los errores continuara
}

export{validarCampos}