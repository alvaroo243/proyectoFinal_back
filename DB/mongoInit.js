module.exports.mongoInit = async () => {
	
	const MongoClient = require("mongodb").MongoClient;
	const dbUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";

    console.log(process.env.MODE);

	
	try {
		
		const client = new MongoClient(dbUrl);

		const conexion = await client.connect();
		
		const prueba = conexion.db("prueba");
		
		if (prueba) {
			console.log("    ✅ MongoDB");
		};
		
	} catch (err) {
		console.log( err );
		console.log("    ❌ MongoDB error");
	};	
	
};