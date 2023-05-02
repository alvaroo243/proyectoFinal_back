const fastify = require("fastify")({
	logger: {
		timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
	},
	keepAliveTimeout : 300000
});

const {mongoInit} = require("./DB/mongoInit");

const port = process.env.PORT || 5003;
const host = process.env.HOST || 'localhost';

(async() => {
	
	fastify.register(require("./routes/router"));
	fastify.register(require("@fastify/cors"), {
		origin: "*",
		methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
	});
	
	const start = async () => {
		try {
			await fastify.listen(port,host)
		} catch (err) {
			fastify.log.error(err)
			process.exit(1)
		};
	};

	await mongoInit();
	start();
	
	fastify.ready(err => {

		if (err) throw err;
		console.log( `    ✅ Fastify (port: ${port})` );

	});
	
})();