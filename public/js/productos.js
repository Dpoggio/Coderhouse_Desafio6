const socket = io();

cargarProductos()

async function cargarProductos() {
    const [ plantilla, productos ] = await Promise.all(
        [ obtenerPlantillaProductos(), obtenerProductos() ]
    )

    const render = Handlebars.compile(plantilla);
    const html = render({ productos })
    document.getElementById('productos').innerHTML = html
}

function obtenerProductos() {
    return fetch('/api/productos')
        .then(response => response.json())
}

function obtenerPlantillaProductos() {
    return fetch('/plantillas/productos.hbs')
        .then(respuesta => respuesta.text())
}


socket.on('actualizarProductos', () => {
    cargarProductos()
});
