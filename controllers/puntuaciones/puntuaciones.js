const puntuaciones = global.mongo.minijuegos.collection('puntuaciones');

const actualizarPuntuacionTresEnRaya = async ({
    puntuacion,
    username
}) => {

    const {tresEnRaya} = await puntuaciones
    .findOne({"username": username})

    if (!tresEnRaya) {
        puntuaciones
        .insertOne({"username": username, "tresEnRaya": {"puntuacion": puntuacion}})
        return {
            ok: true
        }
    }
    
    if (tresEnRaya.puntuacion > puntuacion) return {ok: false}

    puntuaciones
    .updateOne({"username": username}, {$set: {"tresEnRaya": {"puntuacion": puntuacion}}})

    return {
        ok: true
    }
};
exports.actualizarPuntuacionTresEnRaya = actualizarPuntuacionTresEnRaya;