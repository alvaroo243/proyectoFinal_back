const { actualizarPuntuacionTresEnRaya, getPuntuacionesTresEnRaya, getPuntuacionesJugador } = require("../../controllers/puntuaciones/puntuaciones")

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

    fastify.route({
        url:"/puntuaciones/getTresEnRaya",
        method: "POST",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {filtros, paginacion} = req.body
            const {ok, list} = await getPuntuacionesTresEnRaya({filtros, paginacion})

            return res.code(200).send({
                ok: ok,
                list: list
            })
        }
    })

    fastify.route({
        url:"/puntuaciones",
        method: "POST",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {username} = req.body
            
            const puntuacionesJugador = await getPuntuacionesJugador({username})

            return puntuacionesJugador
        }
    })
}