const { loginUsuario } = require("../../controllers/login/login")

module.exports = (fastify) => {
    fastify.route({
        method: "POST",
        url: "/login",
        handler: async (req, res) => {
            res.header('Access-Control-Allow-Origin', '*');
            const {email, username, password} = req.body
            const {usuario, token, message} = await loginUsuario({email, username, password, res})

            return res.code(200).send({
                ...usuario,
                token,
                message
            })
        }
    })

    fastify.route({
        method: "GET",
        url: "/usuario",
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            const user  = req.user
            return res.code(200).send({user})
        }
    })
}