module.exports = async (fastify, options) => {

	//////////////////////
	// Auth
	//////////////////////

	fastify.register(require("@fastify/jwt"), {
		secret: process.env.JWT_SECRET,
	});

	fastify.register(require("@fastify/multipart"), { attachFieldsToBody: true });

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

	require('./login/login')(fastify);
	require('./registro/registro')(fastify);
	require('./usuarios/usuarios')(fastify)
	require('./puntuaciones/puntuaciones')(fastify)

};
