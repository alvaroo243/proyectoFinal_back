const bcrypt = require('bcryptjs');

const usuarios = global.mongo.minijuegos.collection('usuarios');

const hacerRegistro = async ({
    registro
}) => {

    const {username, email, password} = registro

    const existeUsuario = await encuentraUsuario({username, email})

    if (existeUsuario) return {ok: false, message: "¡El usuario ya existe!"}

    const encryptedPass = await bcrypt.hash(password, 10)

    registro = {...registro, password: encryptedPass}

    const usuarioCreado = await crearUsuario({registro})

    if (!usuarioCreado) return {ok: false, message: "No se ha podido crear el usuario"}

    return {
        ok: true,
        message: "Usuario creado correctamente."
    }
};
exports.hacerRegistro = hacerRegistro;


const encuentraUsuario = async ({
    username,
    email
}) => {
    const usernameCount = await usuarios.find({username: username}).count()
    const emailCount = await usuarios.find({email: email}).count()
    if (usernameCount > 0) return true
    if (emailCount > 0) return true

    return false
};
exports.encuentraUsuario = encuentraUsuario;


const crearUsuario = async ({
    registro
}) => {
    const {acknowledged} = await usuarios
    .insertOne({...registro})

    return acknowledged
};
exports.crearUsuario = crearUsuario;