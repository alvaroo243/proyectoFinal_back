const { loginUsuario } = require("../../controllers/login/login")

// Creamos un modulo en el que crearemos las rutas, las cuales podremos acceder desde el front
// Cogemos fastify ya que lo pasamos desde el router
module.exports = (fastify) => {
    // Creamos la ruta de fastify
    // Ruta que hará el login
    fastify.route({
        // Metodo de la llamada
        method: "POST",
        // Endpoint de la llamada
        url: "/login",
        // Función que se realizará cuando se realice la llamada con el request y el response
        handler: async (req, res) => {
            // Recogemos los datos pasados enn el body ya que es una llamada post
            const {email, username, password} = req.body
            // Realizamos el login
            const {usuario, token, message} = await loginUsuario({email, username, password, res})

            // Devolvemos un codigo de estado 200 que significa que la respuesta ha sido buena, con el usuario, el token y un mensaje
            return res.code(200).send({
                ...usuario,
                token,
                message
            })
        }
    })

    // Ruta para recoger el usuario loggeado
    fastify.route({
        // Metodo GET
        method: "GET",
        url: "/usuario",
        // Con esto indicamos que para acceder a esta ruta se necesita un token para la autenticación
        preValidation: [fastify.checkJwt],
        handler: async (req, res) => {
            // Con req.user lo que hacemos es coger el usuario guardado en la sesión el cual lo introducimos al hacer el loggeo
            const user  = req.user
            return res.code(200).send({user})
        }
    })
}