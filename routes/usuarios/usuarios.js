const { getUsuarios, getEmail, eliminarUsuario, getUsuariosBusqueda, editarUsuario, encuentraUsuario } = require("../../controllers/usuarios/usuarios");

module.exports = (fastify) => {

    // Ruta para coger la lista de los usuarios registrados
    fastify.route({
        url: "/usuarios",
        method: "POST",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {filtros, paginacion} = req.body
            const {ok, list, total} = await getUsuarios({filtros, paginacion})

            return res.code(200).send({
                ok: ok,
                list: list,
                total: total
            })
        }
    })

    // Ruta para coger los emails de los usuarios
    fastify.route({
        url: "/usuarios/email",
        method: "POST",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {filtros} = req.body
            const {ok, list} = await getEmail({filtros})
            return res.code(200).send({
                ok: ok,
                list: list
            })
        }
    })

    // Ruta para eliminar el usuario indicado por parametros
    fastify.route({
        url: "/usuarios/eliminar/:id",
        method: "DELETE",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            // Cogemos el id pasado por parametro en la url
            const {id} = req.params

            const {ok} = await eliminarUsuario({id})

            return res.code(200).send({
                ok: ok
            })
        }
    })

    // Ruta para hacer una busqueda de usuarios
    fastify.route({
        url: "/usuarios/busqueda",
        method: "POST",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {filtros, paginacion} = req.body;
            const {ok, list} = await getUsuariosBusqueda({filtros, paginacion})

            return res.code(200).send({
                ok: ok,
                list: list
            })
        }
    })

    // Ruta para editar usuario
    fastify.route({
        url: "/usuarios/editar",
        method: "PUT",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {usuarioEditado} = req.body;
            const {username: usernameActual} = req.user
            const {ok, token} = await editarUsuario({usuarioEditado, res, usernameActual})

            res.code(200).send({
                ok: ok,
                token: token
            })
        }
    })

    // Ruta para validar si hay usuario o no
    fastify.route({
        url: "/usuarios/validar",
        method: "POST",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {username, email} = req.body
            const {username: usernameUsuario, email: emailUsuario} = req.user

            const validacion = encuentraUsuario({username, email, usernameUsuario, emailUsuario})

            return validacion
        }
    })
}