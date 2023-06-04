const bcrypt = require('bcryptjs');

// Cogemos la coleccion usuarios
const usuarios = global.mongo.minijuegos.collection('usuarios');

// Función que hara el login de usuario, generando el token
const loginUsuario = async ({email, username, password, res}) => {
    // Buscamos el usuario por el email o por el username
    const usuario = await buscarUsuario({email, username})
    if(!usuario) return {message: "Email o username incorrecto"}

    // Miramos si contraseña recibida y la del usuario encontrado son iguales
    // Esto mediante el compareSync ya que la contraseña del usuario está encriptada
    const correctPassword = bcrypt.compareSync(password, usuario.password)

    if(!correctPassword) return {message: "Contraseña incorrecta"}

    // Borramos la contraseña del usuario ya que no queremos que este en el token
    delete usuario.password


    // Creamos el token con el usuario y el tiempo hasta la expiración del token
    const token = await res.jwtSign(
        {
            ...usuario
        }, 
        {
            expiresIn: "12h"
        }
    )

    if(!token) return {message: "No se ha podido generar el token"}

    // Devolvemos el usuario, el token y un mensaje de que todo ha ido bien
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
    // Creamos la variable dinamica para almacenar el usuario encontrado
    let usuarioEncontrado
    // Si existe username
    if (username) {
        // Hacemos un regex para que busque exactamente el username que le pasamos pero sin importar mayusculas o minusculas
        const regex = new RegExp('^' + username + '$', 'i');
        // Hacemos el findOne en mongoDb con el regex creado
        usuarioEncontrado = await usuarios.findOne({ username: regex })
    } else {
        // Lo mismo que con el username pero si no existe el email
        const regex = new RegExp('^' + email + '$', 'i');
        usuarioEncontrado = await usuarios.findOne({ email: regex })
    }
    return usuarioEncontrado
};
exports.buscarUsuario = buscarUsuario;