const { name }  = require("../package.json");



module.exports = async (fastify, options) => {

	// ***********************************************************
	// Rutas
	// ***********************************************************

	fastify.route({
		url: "/prueba",
		method: 'GET',
		handler: (req, res) => {
			console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
			return res.code(200).send({
                ok: true,
                list: "YES"
            });
		}
	})

};
