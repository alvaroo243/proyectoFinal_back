const bcrypt = require('bcryptjs');
const { generarContrasena } = require('../../utils/generador');

const usuarios = global.mongo.minijuegos.collection('usuarios');

const loginUsuario = async ({email, password, res}) => {
    const usuario = await buscarUsuario({email})
    let message = "Login correcto";

    const correctPassword = bcrypt.compareSync(password, usuario.password)

    if(!correctPassword) message = "Contraseña incorrecta"

    delete usuario.password


    const token = await res.jwtSign(
        {
            ...usuario
        }, 
        {
            expiresIn: "12h"
        }
    )

    if(!token) message = "No se ha podido generar el token"

    return {
        usuario: usuario,
        token: token,
        message: message
    }
};
exports.loginUsuario = loginUsuario;


const buscarUsuario = async ({
    email
}) => {
    const usuarioEncontrado = await usuarios.findOne({"email": email})
    return usuarioEncontrado
};
exports.buscarUsuario = buscarUsuario;