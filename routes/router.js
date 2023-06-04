module.exports = async (fastify, options) => {

	//////////////////////
	// Auth
	//////////////////////

	// Indicamos como guardara las contraseñas en secreto
	fastify.register(require("@fastify/jwt"), {
		secret: process.env.JWT_SECRET,
	});

	// Por si necesita cargar ficheros
	fastify.register(require("@fastify/multipart"), { attachFieldsToBody: true });

	// Se utilizará para la autenticación y la obtención del usuario
	fastify.decorate("checkJwt", async function (req, rep) {
		try {
		req.user = await req.jwtVerify();
		} catch (err) {
		delete err.stack;
		rep.send(err);
		}
	});

	//////////////////////
	// Rutas
	//////////////////////

	// Creamos la primera ruta, la cual es una prueba para ver si funciona todo
	fastify.route({
		url: "/prueba",
		method: 'GET',
		handler: (req, res) => {
			return res.code(200).send({
                ok: true,
                list: "Funciona"
            });
		}
	})

	// Importamos las demás rutas
	require('./login/login')(fastify);
	require('./registro/registro')(fastify);
	require('./usuarios/usuarios')(fastify)
	require('./puntuaciones/puntuaciones')(fastify)

};
