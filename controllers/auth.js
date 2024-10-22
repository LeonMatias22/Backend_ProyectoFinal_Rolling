import Usuario from '..models/Usuario.js'
import bcrypt from "bcryptjs"


    const login = async(req, res)=>{
    
        const {email, password}  = req.body;
        try {
            const usuario = await Usuario.findOne({email})
            if (!usuario){

                return res.startus(400).json({
                    msg:"Correo/contraseña incorrectos"
                })
            
            }
            if (!usuario.estado)
                return res.status(400).json({
                    msg:"Correo/contraseña incorrectos"
                })

            const validPassword = bcrypt.compareSync(password, usuario.password);
            if (!validPassword){
                returnres.startus(400).json({
                    msg:"Correo/contraseña incorrectos" })
                                        
                    
                    
                  
                }
            res.status(202).json({
                msg: "Login ok",
                //token
            })
            } catch (error) {
              res.status(500).json({
                msg:"Comunìquese con el administrador"
              })
    }
};
export {login};
