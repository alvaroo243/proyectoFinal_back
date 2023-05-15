const { getUsuarios, getEmail, eliminarUsuario, getUsuariosBusqueda, editarUsuario, encuentraUsuario } = require("../../controllers/usuarios/usuarios");

module.exports = (fastify) => {

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

    fastify.route({
        url: "/usuarios/eliminar/:id",
        method: "DELETE",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {id} = req.params

            const {ok} = await eliminarUsuario({id})

            return res.code(200).send({
                ok: ok
            })
        }
    })

    fastify.route({
        url: "/usuarios/busqueda",
        method: "POST",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {filtros} = req.body;
            const {ok, list} = await getUsuariosBusqueda({filtros})

            return res.code(200).send({
                ok: ok,
                list: list
            })
        }
    })

    fastify.route({
        url: "/usuarios/editar",
        method: "PUT",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {usuarioEditado} = req.body;
            const {ok, token} = await editarUsuario({usuarioEditado, res})

            res.code(200).send({
                ok: ok,
                token: token
            })
        }
    })

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