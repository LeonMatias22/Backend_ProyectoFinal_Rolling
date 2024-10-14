import mongoose from 'mongoose'

const dbConection = async () =>{
    try {
        await mongoose.connect(process.env.DATABASE_CNN);
        console.log("Base de Datos onLine");
    } catch (error) {
        throw new Error("Error de conección a la base de Datos")
    }
};

export {dbConection};