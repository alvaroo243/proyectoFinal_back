module.exports = async (fastify, options) => {

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

};
