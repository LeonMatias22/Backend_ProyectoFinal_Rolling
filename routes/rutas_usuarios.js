import { Router } from "express";
import {getUsers, postUser, putUser, deleteUser} from "../controllers/controladores_usuarios.js"

const router_usuarios = Router()

router_usuarios.get('/', getUsers);

router_usuarios.post('/', postUser);

router_usuarios.put('/:id', putUser);

router_usuarios.delete('/:id', deleteUser);

export default router_usuarios