const { hacerRegistro } = require("../../controllers/registro/registro")

module.exports = (fastify) => {

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