Handlebars.registerHelper('formatDate', function(date) {
    return new Handlebars.SafeString(
        new Date(date).toLocaleString()
        // moment(dateString).format("MMM D").toUpperCase()
    );
});

obtenerMensajes().then(cargarMensajes)

function obtenerMensajes() {
    return fetch('/api/mensajes')
        .then(response => response.json())
}

async function cargarMensajes(mensajes) {
    const plantilla = await obtenerPlantillaMensajes()
    const render = Handlebars.compile(plantilla);
    const html = render({ mensajes })
    document.getElementById('mensajes').innerHTML = html
}

function obtenerPlantillaMensajes() {
    return fetch('/plantillas/listaMensajes.hbs')
        .then(respuesta => respuesta.text())
}


socket.on('actualizarMensajes', Mensajes => {
    cargarMensajes(Mensajes)
});


function agregarMensaje(form) {
    const mensaje = {
        mail: form["mail"].value,
        mensaje: form["mensaje"].value,
        fecha: new Date()
    }
    socket.emit('nuevoMensaje', mensaje);
    form["mensaje"].value=""
    return false;
}