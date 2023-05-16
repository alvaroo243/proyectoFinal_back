const { actualizarPuntuacionTresEnRaya } = require("../../controllers/puntuaciones/puntuaciones")

module.exports = (fastify) => {

    fastify.route({
        url: "/puntuaciones/tresEnRaya",
        method: "POST",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {puntuacion} = req.body
            const {username} = req.user
            const {ok} = await actualizarPuntuacionTresEnRaya({puntuacion, username})

            return res.code(200).send({
                ok: ok
            })
        }
    })
}