import jwt from "jsonwebtoken";

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.PRIVATESECRETEKEY, { expiresIn: "10h" }, (err, token) => {
            if (err) {
                console.log(err);
                reject("No se pudo generar el token");
            } else {
                resolve(token);
            }
        });
    });
};

export { generarJWT };
