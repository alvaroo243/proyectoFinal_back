// const dayjs = require("dayjs");
const bcrypt = require('bcryptjs')

const generadorCuando = function (fecha, format = "DD/MM/YYYY HH:mm") {

	if (!fecha) fecha = dayjs();

	fecha = dayjs(fecha);
	if (!fecha.isValid()) return null;


	const ts = Math.ceil(fecha.valueOf() / 1000);

	if (Number.isNaN(ts)) return {
		ts: null,
		str: null,
	};
	const str = fecha.tz().format(format);
	return {
		ts: ts,
		str: str,
	};

};
exports.generadorCuando = generadorCuando;


const generadorQuien = function (objUsuario = {}) {

	const {
		id = "no_id",
		username = "Desconocido",
		name = "Desconocido",
		role = "no_role",
	} = objUsuario;


	return {
		id,
		username,
		name,
		role,
	};

};
exports.generadorQuien = generadorQuien;



const generadorMime = ({ extension = 'pdf' }) => {

	const mimesList = {
		'3dmf': 'x-world/x-3dmf',
		'3dm': 'x-world/x-3dmf',
		'avi': 'video/x-msvideo',
		'ai': 'application/postscript',
		'bin': 'application/octet-stream',
		'bin': 'application/x-macbinary',
		'bmp': 'image/bmp',
		'cab': 'application/x-shockwave-flash',
		'c': 'text/plain',
		'c++': 'text/plain',
		'class': 'application/java',
		'css': 'text/css',
		'csv': 'text/comma-separated-values',
		'cdr': 'application/cdr',
		'doc': 'application/msword',
		'dot': 'application/msword',
		'docx': 'application/msword',
		'dwg': 'application/acad',
		'eps': 'application/postscript',
		'exe': 'application/octet-stream',
		'gif': 'image/gif',
		'gz': 'application/gzip',
		'gtar': 'application/x-gtar',
		'flv': 'video/x-flv',
		'fh4': 'image/x-freehand',
		'fh5': 'image/x-freehand',
		'fhc': 'image/x-freehand',
		'help': 'application/x-helpfile',
		'hlp': 'application/x-helpfile',
		'html': 'text/html',
		'htm': 'text/html',
		'ico': 'image/x-icon',
		'imap': 'application/x-httpd-imap',
		'inf': 'application/inf',
		'jpe': 'image/jpeg',
		'jpeg': 'image/jpeg',
		'jpg': 'image/jpeg',
		'js': 'application/x-javascript',
		'java': 'text/x-java-source',
		'latex': 'application/x-latex',
		'log': 'text/plain',
		'm3u': 'audio/x-mpequrl',
		'midi': 'audio/midi',
		'mid': 'audio/midi',
		'mov': 'video/quicktime',
		'mp3': 'audio/mpeg',
		'mpeg': 'video/mpeg',
		'mpg': 'video/mpeg',
		'mp2': 'video/mpeg',
		'ogg': 'application/ogg',
		'phtml': 'application/x-httpd-php',
		'php': 'application/x-httpd-php',
		'pdf': 'application/pdf',
		'pgp': 'application/pgp',
		'png': 'image/png',
		'pps': 'application/mspowerpoint',
		'ppt': 'application/mspowerpoint',
		'ppz': 'application/mspowerpoint',
		'pot': 'application/mspowerpoint',
		'ps': 'application/postscript',
		'qt': 'video/quicktime',
		'qd3d': 'x-world/x-3dmf',
		'qd3': 'x-world/x-3dmf',
		'qxd': 'application/x-quark-express',
		'rar': 'application/x-rar-compressed',
		'ra': 'audio/x-realaudio',
		'ram': 'audio/x-pn-realaudio',
		'rm': 'audio/x-pn-realaudio',
		'rtf': 'text/rtf',
		'spr': 'application/x-sprite',
		'sprite': 'application/x-sprite',
		'stream': 'audio/x-qt-stream',
		'swf': 'application/x-shockwave-flash',
		'svg': 'text/xml-svg',
		'sgml': 'text/x-sgml',
		'sgm': 'text/x-sgml',
		'tar': 'application/x-tar',
		'tiff': 'image/tiff',
		'tif': 'image/tiff',
		'tgz': 'application/x-compressed',
		'tex': 'application/x-tex',
		'txt': 'text/plain',
		'vob': 'video/x-mpg',
		'wav': 'audio/x-wav',
		'wrl': 'model/vrml',
		'wrl': 'x-world/x-vrml',
		'xla': 'application/msexcel',
		'xls': 'application/msexcel',
		'xls': 'application/vnd.ms-excel',
		'xlc': 'application/vnd.ms-excel',
		'xml': 'text/xml',
		'zip': 'application/x-zip-compressed',
		'zip': 'application/zip',
	}

	return mimesList[extension]
}
exports.generadorMime = generadorMime;


const generadorQuery = function (options) {

	const keys = Object.keys(options)
	return keys.map(key => {
		let value = options[key];

		if (typeof options[key] === 'object') value = JSON.stringify(value);
		if (typeof options[key] === 'undefined') return key;
		return `${key}=${value}`;

	}).join('&')

}
exports.generadorQuery = generadorQuery;

const parseJson = (element) => {

	try { return JSON.parse(element) }
	catch (error) { return element }
}
exports.parseJson = parseJson;

const generarCodigo = (length = 10) => {
	let codigo = ""
	for (let i = 0; i < length; i++) {
		codigo += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
	}
	return codigo
}
exports.generarCodigo = generarCodigo;


const generarObjetoContratacion = (contratacion, user) => {

	try {

		const esEmpresa = (contratacion.tipoSuministro === "empresa");
		const esGas = (contratacion.origenContrato === 1);
		const esDomiciliado = contratacion.banco.iban ? true : false;
		const esCambioPotencia = (!esGas && contratacion.cambio_potencia ? true : false)
		const esCambioTitular = contratacion.esCambioTitular;
		const esMismaDireccion = contratacion.mismaDireccion;
		const esAltaNueva = contratacion.esAltaNueva;

		const cliente = (contratacion.cliente || {});
		const banco = (contratacion.banco || {});
		const tarifa = (contratacion.tarifa || {});
		const direccionFacturacion = (contratacion.direccionFacturacion || {});
		const tipoActividad = (contratacion.tipoActividad || {});
		const documento = banco.documentoContacto ? banco.documentoContacto.toUpperCase() : banco.documento.toUpperCase();

		const nombre = banco.titular
			? banco.titular
			: (`${banco.nombre.toUpperCase()} ${banco.primerApellido.toUpperCase()}${banco.segundoApellido && " " + banco.segundoApellido.toUpperCase()}`);
		const nacionalidad = cliente.nacionalidad ? cliente.nacionalidad : "ES";
		const signing = generarFirma(user);
		const fechaActual = generadorCuando(null, "DD/MM/YYYY");
		const codigoCambio = (() => {

			if (esAltaNueva) return esGas ? "38" : "AZ";
			if (!esCambioPotencia && !esCambioTitular) return esGas ? "02" : "CZ"; // ALTA SIN CAMBIOS
			if (esCambioPotencia && !esCambioTitular) return "KZ"; // CAMBIO POTENCIA
			if (!esCambioPotencia && esCambioTitular) return esGas ? "41" : "MZ"; // CAMBIO TITULAR 
			if (esCambioPotencia && esCambioTitular) return "JZ"; // CAMBIO POTENCIA Y TITULAR

			return esGas ? "02" : "CZ";

		})();

		let titular = {};
		if (esEmpresa) {
			titular = {
				tipo: 1,
				razon_social: cliente.razonSocial,
				contacto_nombre: cliente.nombreContacto,
				contacto_documento: cliente.documentoContacto,
				documento: cliente.cif,
				fijo: cliente.telefono.telefono,
				movil: cliente.telefono.telefono,
				prefijo: cliente.telefono.prefijo.replace("+", ""),
				email: cliente.email,
				cnae: tipoActividad.codigo,
				comerciales: true,
				nombre_razon_social: cliente.razonSocial
			}
		} else {
			titular = {
				tipo: 0,
				nombre: cliente.nombre.toUpperCase(),
				apellido1: (cliente.apellidos[0]).toUpperCase(),
				apellido2: cliente.apellidos[1] ? (contratacion.cliente.apellidos[1]).toUpperCase() : "",
				documento: cliente.documento.toUpperCase(),
				fijo: cliente.telefono.telefono,
				movil: cliente.telefono.telefono,
				prefijo: cliente.telefono.prefijo.replace("+", ""),
				email: cliente.email,
				cnae: undefined,
				comerciales: true,
			}
		}

		const datosBancarios = {
			domiciliado: true,
			titular: nombre,
			documento: documento,
			iban: banco.iban,
			dia_cobro: null
		}

		let _direccionFacturacion = {}
		if (contratacion.mismaDireccion) {

			_direccionFacturacion = {
				tipo_via: direccionFacturacion.tipoVia,
				nombre_via: direccionFacturacion.calle,
				numero: direccionFacturacion.numero,
				duplicador: '',
				escalera: '',
				planta: direccionFacturacion.planta ? direccionFacturacion.planta : "",
				puerta: direccionFacturacion.puerta ? direccionFacturacion.puerta : "",
				tipo_aclarador: '',
				aclarador: '',
				localidad_ine: direccionFacturacion.localidadIne,
				provincia_ine: direccionFacturacion.provinciaIne,
				localidad: direccionFacturacion.localidad,
				provincia: direccionFacturacion.provincia,
				cp: direccionFacturacion.codigoPostal,
				tarifa_id: tarifa._id,
				tarifa_papel: !contratacion.electronica,
				codigo_cambio: codigoCambio,
				observaciones: direccionFacturacion.observaciones ? direccionFacturacion.observaciones : '',
				cups: contratacion.cups,
				tarifa_tipo: tarifa.tipo,
				potencia_contratada_array: contratacion.potencias,
				precio_potencia: tarifa.precios_potencia,
				cliente_paga: 1,
				old_mode: false
			}

		}

		const usuarioOrigen = {
			origen: `EX-${user.username.toUpperCase()}`,
			signing: signing,
			sesionid: user.id,
			sesionusername: user.username,
			sesionname: user.name,
			sesionrole: user.role
		}
		const suministro = {
			tipo_via: contratacion.direccionSuministro.tipoVia,
			nombre_via: contratacion.direccionSuministro.calle,
			numero: contratacion.direccionSuministro.numero,
			duplicador: '',
			escalera: '',
			planta: contratacion.direccionSuministro.planta,
			puerta: contratacion.direccionSuministro.puerta,
			tipo_aclarador: '',
			aclarador: '',
			localidad_ine: contratacion.direccionSuministro.localidadIne,
			provincia_ine: contratacion.direccionSuministro.provinciaIne,
			localidad: contratacion.direccionSuministro.localidad,
			provincia: contratacion.direccionSuministro.provincia,
			cp: contratacion.direccionSuministro.codigoPostal,
			cups: contratacion.cups,
			tarifa_id: tarifa._id,
			tarifa_tipo: tarifa.tipo,
			tarifa_papel: !contratacion.electronica,
			cliente_paga: 1,
			codigo_cambio: codigoCambio,
			observaciones: contratacion.direccionSuministro.observaciones ? contratacion.direccionSuministro.observaciones : '',
			old_mode: false,
			potencia_contratada: contratacion.potencias ? (contratacion.potencias[0] / 1000).toString() : null,
			potencia_contratada_array: contratacion.potencias ? contratacion.potencias.map(_pot => (_pot / 1000).toString()) : [],
			cambiar_potencia: false,
		}

		const datosContratacion = {
			pausarTramitacion: contratacion.pausarTramitacion,
			rol_bloqueado_contratar_avanzado: false,
			signing: signing,
			medio: "28",
			conocio: "16",
			lead: '',
			nacionalidad: nacionalidad,
			suministro_activo: !esAltaNueva,
			bonoSocialAplicable: null,
			derechos_caducados: false,
			amigo: contratacion.promocion ? String(contratacion.promocion).replace(/\s/g, "").toUpperCase() : null,
			busquedaCUPS: 0,
			firma_metodo: 'EMAIL',
			fecha_contrato: fechaActual.str,
			fecha_tramitacion: generadorCuando(contratacion.fechaTramitacion * 1000, 'DD/MM/YYYY').str,
			representa: contratacion.representa,
			origen_contrato: esGas ? 1 : 0,
			tarifa_tipo: tarifa.tipo,
			tarifa_papel: (!contratacion.electronica || tarifa.papel) ? true : false,
			titular_antiguo: contratacion.esCambioTitular ? titular : null,
			titular: titular,
			suministro: suministro,
			datos_bancarios: datosBancarios,
			papel: !contratacion.electronica,
			...usuarioOrigen
		}

		if (contratacion.companiaAnterior) {
			datosContratacion.compania_cliente = {
				id: contratacion.companiaAnterior._id,
				nombre: contratacion.companiaAnterior.nombre
			}
		}

		if (esGas) datosContratacion.luz = contratacion.luz ? contratacion.luz : '1';
		if (!esGas) datosContratacion.gas = contratacion.gas ? contratacion.gas : '3';

		return datosContratacion;

	} catch (err) {

		console.error("ERR: ", err);

	}


}
exports.generarObjetoContratacion = generarObjetoContratacion;

const getIndexAndUpdate = async (counterName) => {

	if (global.mongo.crm) {
		const db = global.mongo.crm;
		const contador = await db.collection("counters").findOneAndUpdate(
			{ '_id': counterName },
			{ '$inc': { "seq": 1 } }
		);

		return contador.value.seq;
	}
}
exports.getIndexAndUpdate = getIndexAndUpdate;

const generarContrasena = async (contrasena = "") => {

	if (!contrasena) for (let i = 0; i < 10; i++) {
		contrasena += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
	}

	const contrasenaEncriptada = await bcrypt.hash(contrasena, 10)
	return {
		ok: true,
		contrasenaOriginal: contrasena,
		contrasenaEncriptada: contrasenaEncriptada
	}
}
exports.generarContrasena = generarContrasena

const separaArray = (array, cantidadPorGrupo = 1) => {
	if (cantidadPorGrupo <= 0) return;

	const arraysSeparados = [];
	for (let i = 0; i < array.length; i += cantidadPorGrupo) {
		const grupo = array.slice(i, i + cantidadPorGrupo);
		arraysSeparados.push(grupo)
	}

	return arraysSeparados;
};
exports.separaArray = separaArray;