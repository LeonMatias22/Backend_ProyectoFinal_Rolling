import express from "express";
import router_usuarios from "../routes/rutas_usuarios.js"

class Server{
    constructor(){
        this.app = express()
        this.port = process.env.PORT;
        this.usuarioPath = '/api/usuarios'

        this.middlewares();
        this.routes();
    }

    routes(){
        this.app.use(this.usuarioPath, router_usuarios)

            }


    middlewares(){
        this.app.use(express.json());
        this.app.use(express.static("public"));
    }


    listen(){
        this.app.listen(this.port, ()=>console.log('Server online, port: ', this.port) )
    }

}

export default Server