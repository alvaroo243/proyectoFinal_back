const bcrypt = require('bcryptjs');
const { encuentraUsuario } = require('../usuarios/usuarios');

// Cogemos la colección de usuarios
const usuarios = global.mongo.minijuegos.collection('usuarios');

// Función con la que realizaremos el registro
const hacerRegistro = async ({
    registro
}) => {

    // Cogemos el username email y password
    const {username, email, password} = registro

    // Buscamos el usuario por ver si existe
    const {existe, error} = await encuentraUsuario({username, email})

    if (existe) return {ok: false, message: error}

    // Encriptamos la contraseña
    const encryptedPass = await bcrypt.hash(password, 10)

    // Editamos registro con la nueva contraseña
    registro = {...registro, password: encryptedPass}

    // Creamos el usuario
    const usuarioCreado = await crearUsuario({registro})

    if (!usuarioCreado) return {ok: false, message: "No se ha podido crear el usuario"}

    // Si todo ha salido bien
    return {
        ok: true,
        message: "Usuario creado correctamente."
    }
};
exports.hacerRegistro = hacerRegistro;

// Función para crear usuarios
const crearUsuario = async ({
    registro
}) => {
    // Hacemos la llamada y cogemos un atributo que nos indica si ha salido bien o no
    const {acknowledged} = await usuarios
    .insertOne({...registro})

    return acknowledged
};
exports.crearUsuario = crearUsuario;