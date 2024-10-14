import express from "express";
import router_usuarios from "../routes/rutas_usuarios.js"
import {dbConection} from "../database/config.js"

class Server{
    constructor(){
        this.app = express()
        this.port = process.env.PORT;
        this.usuarioPath = '/api/usuarios'


        this.conectarDb();
        this.middlewares();
        this.routes();
    }

    async conectarDb(){
        await dbConection()
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