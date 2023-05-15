const { ObjectId } = require("mongodb");
const { generaPaginacion } = require("../../utils/generador");

const usuarios = global.mongo.minijuegos.collection('usuarios');

const defaultOrden = {
    order: "ascend",
    sorterId: "role"
}

const getUsuarios = async ({
    filtros,
    paginacion
}) => {
    const { skip, limit, sort } = generaPaginacion({ paginacion, defaultOrden })

    const list = await usuarios
        .find({ ...filtros })
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .toArray()
    const total = await usuarios.countDocuments({ ...filtros })

    return {
        ok: true,
        list: list,
        total: total
    }
};
exports.getUsuarios = getUsuarios;


const getEmail = async ({
    filtros
}) => {
    const list = await usuarios
        .find({ ...filtros }, { "projection": { "email": 1 } })
        .toArray()

    return {
        ok: true,
        list: list
    }
};
exports.getEmail = getEmail;


const eliminarUsuario = async ({
    id
}) => {
    const borrarUsuario = await usuarios
        .deleteOne({ _id: new ObjectId(id) })

    if (!borrarUsuario) return { ok: false }

    return {
        ok: true
    }
};
exports.eliminarUsuario = eliminarUsuario;


const getUsuariosBusqueda = async ({
    filtros
}) => {
    const list = await usuarios
        .find({ ...filtros }, { "projection": { "password": 0, "email": 0, "role": 0 } })
        .toArray()
    return {
        ok: true,
        list: list
    }
};
exports.getUsuariosBusqueda = getUsuariosBusqueda;


const editarUsuario = async ({
    usuarioEditado
}) => {
    const { _id } = usuarioEditado
    delete usuarioEditado._id

    const editar = await usuarios
    .updateOne({_id: new ObjectId(_id)}, {$set: {...usuarioEditado}})

    if (!editar) return {ok: false}

    return {
        ok: true
    }
};
exports.editarUsuario = editarUsuario;


const getUsuarioById = async ({
    _id
}) => {
    const usuario = await usuarios
        .findOne({ _id: new ObjectId(_id) }, { "projection": { "password": 0 } })

    return usuario
};
exports.getUsuarioById = getUsuarioById;


const encuentraUsuario = async ({
    username,
    email,
    usernameUsuario, 
    emailUsuario
}) => {
    if (username !== usernameUsuario) {
        const usernameCount = await usuarios
        .countDocuments({username: username})

        if (usernameCount > 0) return {
            existe: true,
            error: `Usuario con username: ${username}, ya existe`
        }
    }

    if (email !== emailUsuario) {
        const emailCount = await usuarios
        .countDocuments({email: email})

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