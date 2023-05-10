const bcrypt = require('bcryptjs');

const usuarios = global.mongo.minijuegos.collection('usuarios');

const loginUsuario = async ({email, password, res}) => {
    const usuario = await buscarUsuario({email})
    if(!usuario) return {message: "Email incorrecto"}

    const correctPassword = bcrypt.compareSync(password, usuario.password)

    if(!correctPassword) return {message: "Contraseña incorrecta"}

    delete usuario.password


    const token = await res.jwtSign(
        {
            ...usuario
        }, 
        {
            expiresIn: "12h"
        }
    )

    if(!token) return {message: "No se ha podido generar el token"}

    return {
        usuario: usuario,
        token: token,
        message: "Login correcto"
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