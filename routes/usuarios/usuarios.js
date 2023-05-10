module.exports = (fastify) => {

    fastify.route({
        url: "/usuarios",
        method: "POST",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const {filtros, paginacion} = req.body
            console.log( filtros, paginacion );
        }
    })
}