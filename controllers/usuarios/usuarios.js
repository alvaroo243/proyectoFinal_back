const { ObjectId } = require("mongodb");
const { generaPaginacion } = require("../../utils/generador");
const { getPuntuacionesJugador } = require("../puntuaciones/puntuaciones");

// Cogemos la colección usuarios
const usuarios = global.mongo.minijuegos.collection('usuarios');
const puntuaciones = global.mongo.minijuegos.collection('puntuaciones')

// Orden por defecto para la tabla de usuarios
const defaultOrden = {
    order: "ascend",
    sorterId: "role"
}

// Función para coger los usuarios existentes
const getUsuarios = async ({
    filtros,
    paginacion
}) => {
    // Generamos la paginación
    const { skip, limit, sort } = generaPaginacion({ paginacion, defaultOrden })

    // Hacemos la llamda a mongoDb
    const list = await usuarios
        .find({ ...filtros })
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .toArray()
    // Cogemos el total de usuarios existentes
    const total = await usuarios.countDocuments({ ...filtros })

    // Devolvemos la lista de usuarios, el total y un boolean true
    return {
        ok: true,
        list: list,
        total: total
    }
};
exports.getUsuarios = getUsuarios;

// Función para coger los emails
const getEmail = async ({
    filtros
}) => {
    // Llamada al back con los filtros reocgidos
    const list = await usuarios
        .find({ ...filtros }, { "projection": { "email": 1 } })
        .toArray()

    return {
        ok: true,
        list: list
    }
};
exports.getEmail = getEmail;

// Función para eliminar usuarios
const eliminarUsuario = async ({
    id
}) => {
    // Llamada a mongoDb para eliminar el usuario escogido con el _id
    const borrarUsuario = await usuarios
        .deleteOne({ _id: new ObjectId(id) })

    if (!borrarUsuario) return { ok: false }

    return {
        ok: true
    }
};
exports.eliminarUsuario = eliminarUsuario;

// Función que devuelve la busqueda de los usuarios indicados en el campo, en esta llamada se devolverá
// los que contengan los parametros pasados en los filtros(por ejemplo, buscamos el usuario alvaro y ponemos al y lo encuentra)
const getUsuariosBusqueda = async ({
    filtros,
    paginacion
}) => {
    // Generamos la paginación
    const { skip, limit, sort } = generaPaginacion({ paginacion })
    // Hacemos la llamada a mongoDb
    const list = await usuarios
        .find({ ...filtros }, { "projection": { "password": 0, "email": 0, "role": 0 } })
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .toArray()
    const total = await usuarios.countDocuments({...filtros})
    return {
        ok: true,
        list: list,
        total: total
    }
};
exports.getUsuariosBusqueda = getUsuariosBusqueda;

// Función para editar usuarios
const editarUsuario = async ({
    usuarioEditado,
    res, 
    usernameActual
}) => {
    // Cogemos el _id del usuarioEditado
    const { _id } = usuarioEditado
    // Creamos el nuevo token del usuarioEditado
    const token = await res.jwtSign(
        {
            ...usuarioEditado
        }, 
        {
            expiresIn: "12h"
        }
    )
    if (!token) return {ok: false}
    delete usuarioEditado._id

    // Editamos el usuario
    const editar = await usuarios
    .updateOne({_id: new ObjectId(_id)}, {$set: {...usuarioEditado}})
    // Si se ha cambiado el username
    if (usernameActual !== usuarioEditado.username) {
        // Miramos si el usuario tiene puntuaciones
        const puntuacionesUsuario = await getPuntuacionesJugador({username: usernameActual});
        // Si tiene
        if (puntuacionesUsuario) {
            // Actualizamos el username de las puntuaciones
            puntuaciones
            .updateOne({username: usernameActual}, {$set: {username: usuarioEditado.username}})
        }
    }

    if (!editar) return {ok: false}

    return {
        ok: true,
        token: token
    }
};
exports.editarUsuario = editarUsuario;

// Función para obtener un usuario por su id
const getUsuarioById = async ({
    _id
}) => {
    const usuario = await usuarios
        .findOne({ _id: new ObjectId(_id) }, { "projection": { "password": 0 } })

    return usuario
};
exports.getUsuarioById = getUsuarioById;

// Funcion para buscar usuarios
const encuentraUsuario = async ({
    username,
    email,
    usernameUsuario, 
    emailUsuario
}) => {
    // Si el username pasado a la llamada es diferente al del usuario
    if (username !== usernameUsuario) {
        const usernameCount = await usuarios
        .countDocuments({username: username})

        // Si hay alguno que tenga ya ese username devolveremos un error
        if (usernameCount > 0) return {
            existe: true,
            error: `Usuario con username: ${username}, ya existe`
        }
    }

    // Si el email pasado a la llamada es diferente al del usuario
    if (email !== emailUsuario) {
        const emailCount = await usuarios
        .countDocuments({email: email})

        // Si ya hay alguno con el email devolveremos un error
        if (emailCount > 0) return {
            existe: true,
            error: `Usuario con email: ${email}, ya existe`
        }
    }


    return {
        existe: false,
        error: ``
    }
};
exports.encuentraUsuario = encuentraUsuario;