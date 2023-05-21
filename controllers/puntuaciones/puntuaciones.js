const { generaPaginacion } = require("../../utils/generador");

const puntuaciones = global.mongo.minijuegos.collection('puntuaciones');

const actualizarPuntuacionTresEnRaya = async ({
    puntuacion,
    username
}) => {

    const puntuacionJugador = await puntuaciones
    .findOne({"username": username})

    if (!puntuacionJugador || puntuacionJugador.tresEnRaya === undefined) {
        puntuaciones
        .insertOne({"username": username, "tresEnRaya":  puntuacion})
        return {
            ok: true
        }
    }

    const tresEnRaya = puntuacionJugador.tresEnRaya
    
    if (tresEnRaya >= puntuacion) return {ok: false}

    puntuaciones
    .updateOne({"username": username}, {$set: {"tresEnRaya": puntuacion}})

    return {
        ok: true
    }
};
exports.actualizarPuntuacionTresEnRaya = actualizarPuntuacionTresEnRaya;

const defaultOrdenTresEnRaya = {
    order: "descend",
    sorterId: "tresEnRaya"
}

const getPuntuacionesTresEnRaya = async ({
    filtros, 
    paginacion
}) => {
    const {skip, limit, sort} = generaPaginacion({paginacion, defaultOrden: defaultOrdenTresEnRaya })
    const jugadoresConPuntuaciones = await puntuaciones
    .find({"tresEnRaya": {$exists: true}})
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .toArray()

    return {
        ok: true, 
        list: jugadoresConPuntuaciones
    }
};
exports.getPuntuacionesTresEnRaya = getPuntuacionesTresEnRaya;

const getPuntuacionesJugador = async ({
    username
}) => {
    
    const puntuacionesJugador= await puntuaciones
    .findOne({username: username}, {"projection": {"_id": 0, "username": 0}})

    return puntuacionesJugador
};
exports.getPuntuacionesJugador = getPuntuacionesJugador;