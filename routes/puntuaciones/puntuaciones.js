const { actualizarPuntuacionTresEnRaya, getPuntuacionesTresEnRaya, getPuntuacionesJugador, getPuntuacionBlackJack, actualizarPuntuacionBlackJack, getPuntuacionesBlacJack } = require("../../controllers/puntuaciones/puntuaciones")

module.exports = (fastify) => {

    // Ruta para actualizar puntuaciones del tresEnRaya
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

    // Ruta para coger las puntuaciones dell tresEnRaya
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

    // Ruta para coger las puntuaciones del usuario indicado
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

    // Ruta para coger los beneficios del usuario en el blackJack
    fastify.route({
        url: "/puntuaciones/blackJack",
        method: "GET",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {username} = req.user

            const {ok, puntuacion} = await getPuntuacionBlackJack({username})

            return res.code(200).send({
                ok: ok, 
                puntuacion: puntuacion
            })
        }
    })

    // Ruta para actualizar los beneficios en el blackJack
    fastify.route({
        url: "/puntuaciones/blackJack",
        method: "POST",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {presupuesto} = req.body
            const {username} = req.user

            const {ok} = await actualizarPuntuacionBlackJack({presupuesto, username})

            return res.code(200).send({
                ok: ok
            })
        }
    })

    // Ruta para coger las puntuaciones en el blackJack
    fastify.route({
        url: "/puntuaciones/blackJack/todas",
        method: "POST",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {filtros, paginacion} = req.body;

            const {ok, list} = await getPuntuacionesBlacJack({filtros, paginacion})
            
            return res.code(200).send({
                ok: ok,
                list: list
            })
        }
    })
}