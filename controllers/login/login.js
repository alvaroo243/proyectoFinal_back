const bcrypt = require('bcryptjs');

const usuarios = global.mongo.minijuegos.collection('usuarios');

const loginUsuario = async ({email, username, password, res}) => {
    const usuario = await buscarUsuario({email, username})
    if(!usuario) return {message: "Email o username incorrecto"}

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
    email,
    username
}) => {
    let usuarioEncontrado
    if (username) {
        usuarioEncontrado = await usuarios.findOne({ username: { $regex: username, $options: 'i' } })
    } else {
        usuarioEncontrado = await usuarios.findOne({ email: { $regex: email, $options: 'i' } })
    }
    return usuarioEncontrado
};
exports.buscarUsuario = buscarUsuario;