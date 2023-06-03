const { generaPaginacion } = require("../../utils/generador");

const puntuaciones = global.mongo.minijuegos.collection('puntuaciones');

const actualizarPuntuacionTresEnRaya = async ({
    puntuacion,
    username
}) => {

    const puntuacionJugador = await puntuaciones
        .findOne({ "username": username })

    if (!puntuacionJugador) {
        puntuaciones
            .insertOne({ "username": username, "tresEnRaya": puntuacion })
        return {
            ok: true
        }
    }

    const tresEnRaya = puntuacionJugador.tresEnRaya

    if(tresEnRaya && tresEnRaya >= puntuacion) return {ok: false};

    puntuaciones
        .updateOne({ "username": username }, { $set: { "tresEnRaya": puntuacion } })

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
    const { skip, limit, sort } = generaPaginacion({ paginacion, defaultOrden: defaultOrdenTresEnRaya })
    const jugadoresConPuntuaciones = await puntuaciones
        .find({ "tresEnRaya": { $exists: true } })
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .toArray()

    console.log(jugadoresConPuntuaciones);

    return {
        ok: true,
        list: jugadoresConPuntuaciones
    }
};
exports.getPuntuacionesTresEnRaya = getPuntuacionesTresEnRaya;

const getPuntuacionesJugador = async ({
    username
}) => {

    const puntuacionesJugador = await puntuaciones
        .findOne({ username: username }, { "projection": { "_id": 0, "username": 0 } })

    return puntuacionesJugador
};
exports.getPuntuacionesJugador = getPuntuacionesJugador;

const getPuntuacionBlackJack = async ({
    username
}) => {

    const blackJack = await puntuaciones
        .findOne({ username: username }, { "projection": { "_id": 0, "blackJack": 1 } })

    if (!blackJack?.blackJack) return {
        ok: false,
        puntuacion: null
    }

    return {
        ok: true,
        puntuacion: blackJack.blackJack
    }
}
exports.getPuntuacionBlackJack = getPuntuacionBlackJack;

const actualizarPuntuacionBlackJack = async ({
    presupuesto,
    username
}) => {

    const { modifiedCount } = await puntuaciones
        .updateOne({ username: username }, { $set: { "blackJack": presupuesto } })

    if (modifiedCount === 0) {
        const puntuacionJugador = await puntuaciones
            .findOne({ "username": username })

        if (!puntuacionJugador || puntuacionJugador.blackJack === undefined) {
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

const defaultOrdenBlackJack = {
    order: "descend",
    sorterId: "blackJack"
}

const getPuntuacionesBlacJack = async ({
    filtros,
    paginacion
}) => {

    const { skip, limit, sort } = generaPaginacion({ paginacion, defaultOrden: defaultOrdenBlackJack })

    const list = await puntuaciones
        .find({ "blackJack": { $exists: true } })
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .toArray()

    return {
        ok: true,
        list: list
    }
}
exports.getPuntuacionesBlacJack = getPuntuacionesBlacJack;