const {ObjectId} = require('mongodb')

module.exports.mongoInit = async () => {
	
	// Importamos MongoClient de mongodb
	const MongoClient = require("mongodb").MongoClient;
	// Coge la variable del env si existe sinos coge la nombrada
	const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
	
	try {
		// Lo siguiente que vamos a hacer es parecido a un script de MySql
		
		// Creamos una variable con el cliente de nuetro MongoDb
		const client = new MongoClient(dbUrl);

		// Creamos la conexion con la base de datos
		const conexion = await client.connect();
		
		// Cogemos la db si no existe la crea
		const minijuegos = conexion.db("minijuegos");
		
		if (minijuegos) {
			console.log("		🟢 MongoDB");
			console.log( "" );

			// Creamos una variable global
			global.mongo = {
				conexion: conexion,
				ObjectId: ObjectId,
				minijuegos: minijuegos
			}
		};

		// Cogemos un array con los nombres de las collection de la db
		const coleccionesCreadas = (await minijuegos.listCollections().toArray()).map(coleccion => coleccion.name);

		// Si falta alguna collection comprobamos cual es y la creamos
		if (coleccionesCreadas.length < 2) {
			// Si no existe puntuaciones la creamos
			if (!coleccionesCreadas.includes('puntuaciones')) {
				minijuegos.createCollection('puntuaciones')
			}
			// Si no existe usuarios la creamos
			if (!coleccionesCreadas.includes('usuarios')) {
				minijuegos.createCollection('usuarios')
			}
		}
		// Cogemos la tabla usuarios por si falta el admin
		const usuarios = minijuegos.collection('usuarios')
		// Cogemos el usuario admin
		const admin = await usuarios.findOne({username: "admin"});
		// Si existe no hacemos nada
		if (admin) {
			return
		}
		// Si no existe creamos el usuario admin para que esté por defecto siempre
		await usuarios.insertOne({
			name: "Admin", 
			username: "admin", 
			email: "admin@gmail.com", 
			password: "$2a$10$2GlBwygSyRUm/jYvZ33IRugQyCm0HYQ1wHhsF88/4Cw8lD/6ECc1K", // Contraseña de admin es admin
			creado: NaN,
			role: "ADMIN",
			biografia: "Soy el admin"
		})
	} catch (err) {
		console.log( err );
		console.log("		🔴 MongoDB error");
	};
	
};