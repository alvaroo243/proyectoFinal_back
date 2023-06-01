////////////////////
// Imports
////////////////////

const fastify = require("fastify")({
	logger: {
		timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
	},
	keepAliveTimeout : 300000
});

const {mongoInit} = require("./DB/mongoInit");

// Modulo para trabajar con rutas de archivos
const path = require("path");
// Modulo con metodos los cuales se utilizan para interactuar con archivos del sistema
const fs = require("fs");


////////////////////
// ENV
////////////////////

// Cogemos el nombre del archivo .env segun en el modo en el que estemos
const ficheroEnv = `${process.env.MODE || "local"}.env`;

// Cogemos la carpeta en la que se encuentra el archivo
const rutaEnv = path.resolve(__dirname, "./env", ficheroEnv);

// Si existe la carpeta entramos en la funcion y hacemos que se escoja el fichero .env para coger sus variables definidas
if (fs.existsSync(rutaEnv)) {
	require("dotenv").config({
		path: rutaEnv,
	});	
	console.log( `
		🟢 ENV cargado en modo ${process.env.MODE}
` );
} else {
	console.log( `
		🔴 ${ficheroEnv} no encontrado
` );
};


////////////////////
// Fastify
////////////////////



// Cogemos el puerto de la variable del env, si existe
const port = process.env.PORT || 3000;
// Lo mismo con el host
const host = process.env.HOST || 'localhost';

// Funcion auto llamada
(async() => {
	
	// Configuramos fastify para que se fije en el archivo router en el cual tendremos todas las rutas
	fastify.register(require("./routes/router"));
	// Y configuramos los accesos que tendra
	fastify.register(require("@fastify/cors"), {
		origin: "*",
		methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
		allowedHeaders: [
			{ "key": "Access-Control-Allow-Credentials", "value": "true" },
			{ "key": "Access-Control-Allow-Origin", "value": "*" },
			{ "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
			{ "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
		  ]
	});
	
	// Funcion para iniciar fastify
	const start = async () => {
		try {
			await fastify.listen(port,host)
		} catch (err) {
			fastify.log.error(err)
			process.exit(1)
		};
	};

	await mongoInit(); // Iniciamos MongoDB
	
	start(); // Iniciamos fastify

	// Indica si fastify se ha iniciado correctamente
	fastify.ready(err => {

		if (err) throw err;
		console.log( `
		🟢 Fastify (port: ${port})
		` );

	});
	
})();