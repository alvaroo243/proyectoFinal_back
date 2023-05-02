module.exports.mongoInit = async () => {
	
	// Importamos MongoClient de mongodb
	const MongoClient = require("mongodb").MongoClient;
	// Coge la variable del env si existe sinos coge la nombrada
	const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
	
	try {
		
		// Creamos una variable con el cliente de nuetro MongoDb
		const client = new MongoClient(dbUrl);

		// Creamos la conexion con la base de datos
		const conexion = await client.connect();
		
		// Cogemos la BBDD
		const minijuegos = conexion.db("minijuegos");
		
		if (minijuegos) {
			console.log("		🟢 MongoDB");
			console.log( "" );
		};

		const usuarios = minijuegos.collection('usuarios');
		const numUsuarios = await usuarios.countDocuments()

		if (numUsuarios === 0) {
			console.log( "NO EXISTE" );
			usuarios.aggregate()
		} else {
			console.log( "EXISTE" );
		}
		
	} catch (err) {
		console.log( err );
		console.log("		🔴 MongoDB error");
	};	
	
};