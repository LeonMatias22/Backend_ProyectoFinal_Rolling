import express from "express";

import router_usuarios from "../routes/rutas_usuarios.js";
import  routerAuth  from '../routes/auth.js';
import routerCat from '../routes/categorias.js'
import routerProd from "../routes/rutas_productos.js";
import routerSearch from '../routes/buscar.js';
import { dbConection } from "../database/config.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuarioPath = "/api/usuarios";
    this.authPath = "/api/auth";
    this.categoriaPath = "/api/categorias"
    this.productoPath = "/api/productos"
    this.buscarPath = "/api/buscar"


    this.conectarDb();
    this.middlewares();
    this.routes();
  }

  async conectarDb() {
    await dbConection();
  }

  routes() {
    this.app.use(this.usuarioPath, router_usuarios);
    this.app.use(this.authPath, routerAuth);
    this.app.use(this.categoriaPath, routerCat);
    this.app.use(this.productoPath,routerProd );
    this.app.use(this.buscarPath, routerSearch);
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log(
        `Servidor levantado en el puerto http://localhost:${this.port}`
      )
    );
  }
}

export default Server;
