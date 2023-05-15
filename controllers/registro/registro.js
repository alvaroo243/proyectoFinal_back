const bcrypt = require('bcryptjs');
const { encuentraUsuario } = require('../usuarios/usuarios');

const usuarios = global.mongo.minijuegos.collection('usuarios');

const hacerRegistro = async ({
    registro
}) => {

    const {username, email, password} = registro

    const {existe, error} = await encuentraUsuario({username, email})

    if (existe) return {ok: false, message: error}

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

const crearUsuario = async ({
    registro
}) => {
    const {acknowledged} = await usuarios
    .insertOne({...registro})

    return acknowledged
};
exports.crearUsuario = crearUsuario;