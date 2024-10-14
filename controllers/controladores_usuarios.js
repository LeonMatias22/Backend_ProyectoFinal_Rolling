import {request, response} from 'express'

const getUsers = (req = request, res = response)=>{
    res.json({ message: "Peticion GET desde controllers"});
};

const postUser = (req = request, res = response) =>{
    const {nombre, puesto} = req.body
    res.json({ message: "Peticion POST desde controllers",
        nombre,
        puesto
    })
};

const putUser = (req = request, res = response) =>{
    res.json({ message: "Peticion PUT desde controllers"})
};

const deleteUser = (req = request, res = response) =>{
    res.json({ message: "Peticion DELETE desde controllers"})
};

export {getUsers, postUser, putUser, deleteUser};