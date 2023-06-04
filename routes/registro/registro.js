const { hacerRegistro } = require("../../controllers/registro/registro")

module.exports = (fastify) => {

    // Ruta para hacer el registro del usuario
    fastify.route({
        url: "/registro",
        method: "POST",
        handler: async (req, res) => {
            
            const {registro} = req.body

            const {ok, message} = await hacerRegistro({registro})

            return res.code(200).send({
                ok: ok,
                message: message
            })
        }
    })
}