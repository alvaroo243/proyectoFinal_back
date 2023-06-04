
// Función para generar la paginación
const generaPaginacion = ({
    paginacion = {
        paginaActual: 1,
        tamanoPorPagina: 10,
    },
    defaultOrden = {
        order: "ascend",
        sorterId: "_id",
    }
}) => {
    // Si no tiene orden le indicamos el defaultOrden
    if (paginacion && !paginacion.orden) paginacion.orden = defaultOrden;
    // Pagina actual
    const pagina = paginacion.paginaActual - 1;
    // Hacemos el skip
    const skip = (paginacion.tamanoPorPagina * pagina) ? paginacion.tamanoPorPagina * pagina : 0;
    // Hacemos el limite
    const limit = (paginacion.tamanoPorPagina) ? paginacion.tamanoPorPagina : 0;
    // Y hacemos el sort
    const sort = { [paginacion?.orden?.sorterId]: (paginacion?.orden?.order === 'descend' ? -1 : 1) };

    return {
        skip,
        limit,
        sort
    }
}
exports.generaPaginacion = generaPaginacion;