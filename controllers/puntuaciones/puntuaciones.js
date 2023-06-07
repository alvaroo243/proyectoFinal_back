const { generaPaginacion } = require("../../utils/generador");

// Cogemos la colección de puntuaciones
const puntuaciones = global.mongo.minijuegos.collection('puntuaciones');

// Función con la que actualizaremos la puntuación del Tres En Raya
const actualizarPuntuacionTresEnRaya = async ({
    puntuacion,
    username
}) => {

    // Buscamos si el usuario tiene puntuaciones
    const puntuacionJugador = await puntuaciones
        .findOne({ "username": username })

    // Si no tiene puntuaciones
    if (!puntuacionJugador) {
        // Creamos el documento con el username y la puntuación
        puntuaciones
            .insertOne({ "username": username, "tresEnRaya": puntuacion })
        // Es record
        return {
            ok: true
        }
    }

    // Si tiene puntuaciones cogemos la de tresEnRaya
    const tresEnRaya = puntuacionJugador.tresEnRaya

    // Si ya tiene y es mayor a la nueva devolvemos que no es record
    if(tresEnRaya && tresEnRaya >= puntuacion) return {ok: false};

    // Sinos la modificamos y devolvemos que es record
    puntuaciones
        .updateOne({ "username": username }, { $set: { "tresEnRaya": puntuacion } })

    return {
        ok: true
    }
};
exports.actualizarPuntuacionTresEnRaya = actualizarPuntuacionTresEnRaya;

// Orden por defecto de la tabla de puntuaciones de tresEnRaya
const defaultOrdenTresEnRaya = {
    order: "descend",
    sorterId: "tresEnRaya"
}

// Función con la que cogeremos todos los usuarios que tengan alguna puntuación en el tresEnRaya
const getPuntuacionesTresEnRaya = async ({
    filtros,
    paginacion
}) => {
    // Generamos la paginación
    const { skip, limit, sort } = generaPaginacion({ paginacion, defaultOrden: defaultOrdenTresEnRaya })
    // Hacemos la llamada al mongoDb para que nos devuelva la lista que queremos
    const jugadoresConPuntuaciones = await puntuaciones
        .find({ "tresEnRaya": { $exists: true } })
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .toArray()

    const total = await puntuaciones.countDocuments({"tresEnRaya": {$exists: true}})
    return {
        ok: true,
        list: jugadoresConPuntuaciones,
        total: total
    }
};
exports.getPuntuacionesTresEnRaya = getPuntuacionesTresEnRaya;

// Función que utilizaremos para coger las puntuaciones del usuario indicado
const getPuntuacionesJugador = async ({
    username
}) => {

    // Hacemos la llamada con un projection para que solo nos devuelva las puntuaciones
    const puntuacionesJugador = await puntuaciones
        .findOne({ username: username }, { "projection": { "_id": 0, "username": 0 } })

    return puntuacionesJugador
};
exports.getPuntuacionesJugador = getPuntuacionesJugador;

// Función que utilizaremos para coger la puntuación del blackJack para saber los beneficios que tiene el jugador
const getPuntuacionBlackJack = async ({
    username
}) => {

    // Cogermos solo la puntuacion de blackJack
    const blackJack = await puntuaciones
        .findOne({ username: username }, { "projection": { "_id": 0, "blackJack": 1 } })

    // Si no existe devolvemos null
    if (!blackJack?.blackJack) return {
        ok: false,
        puntuacion: null
    }

    // Sinos la devolvemos
    return {
        ok: true,
        puntuacion: blackJack.blackJack
    }
}
exports.getPuntuacionBlackJack = getPuntuacionBlackJack;

// Función para actualizar la puntuación del blackJack
const actualizarPuntuacionBlackJack = async ({
    presupuesto,
    username
}) => {

    // Hacemos la llamada para actualizar 
    // Cogemos los documentos modificados
    const { modifiedCount } = await puntuaciones
        .updateOne({ username: username }, { $set: { "blackJack": presupuesto } })

    if (modifiedCount === 0) {
        // Buscamos si existe, ya que puede que el modifiedCount sea 0 porque existe y tiene el mismo valor 
        // y por lo tanto no hace ninguna modificación; o tambien puede ser porque no existe
        const puntuacionJugador = await puntuaciones
            .findOne({ "username": username })
        
        // Si no existe o no tiene blackJack
        if (!puntuacionJugador || puntuacionJugador.blackJack === undefined) {
            // Creamos uno nuevo o se modifica el que esta con blackJack
            puntuaciones
                .insertOne({ "username": username, "blackJack": presupuesto })
            return {
                ok: true
            }
        }

    }

    return {
        ok: true
    }
}
exports.actualizarPuntuacionBlackJack = actualizarPuntuacionBlackJack;

// Orden por defecto en la tabla de puntuaciones BlackJack
const defaultOrdenBlackJack = {
    order: "descend",
    sorterId: "blackJack"
}

// Función para coger las puntuaciones de los jugadores que han jugado al BlackJack
const getPuntuacionesBlacJack = async ({
    filtros,
    paginacion
}) => {

    // Generamos la paginación
    const { skip, limit, sort } = generaPaginacion({ paginacion, defaultOrden: defaultOrdenBlackJack })

    // Hacemos la llamada a mongoDb
    const list = await puntuaciones
        .find({ "blackJack": { $exists: true } })
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .toArray()
    const total = await puntuaciones.countDocuments({"blackJack": { $exists: true } })
    return {
        ok: true,
        list: list,
        total: total
    }
}
exports.getPuntuacionesBlacJack = getPuntuacionesBlacJack;