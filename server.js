
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const { routerProductos } = require("./routers/routerProductos.js")
const handlebars = require('express-handlebars')


/**** CONSTANTES ****/
const PORT = process.env.PORT || 8080
const ERROR_CODE = 500
const ARCHIVO_PRODUCTOS = 'resources/productos.txt'

/*** TMP ****/
const Contenedor = require('./contenedor.js')
const productos = new Contenedor(ARCHIVO_PRODUCTOS)
const mensajes = []

/**** Inicio App ****/
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

// Configuracion WebSocket
io.on('connection', socket => {
    console.log('Nuevo cliente conectado')

    socket.on('nuevoProducto', async producto => {
        await productos.save(producto)
        io.sockets.emit('actualizarProductos', await productos.getAll())
    })

    socket.on('nuevoMensaje', mensaje => {
        mensajes.push(mensaje)
        io.sockets.emit('actualizarMensajes', mensajes)
    })
})

// Configuracion Vista
app.engine('hbs', 
    handlebars({
        extname: '.hbs',
        defaultLayout: 'default.hbs',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials'
    })
)
app.set('view engine', 'hbs')
app.set('views', './views')


// Middleware incio
app.use(express.json())
app.use('/', express.static('public'))
app.use(express.urlencoded({extended: true}))

// Routers
app.get('/', (req, res) => {
    res.render('main')
})

app.use('/api/productos', routerProductos)

//TMP
app.get('/api/mensajes',  (req, res) => {
    res.json(mensajes)
})

// Middleware Errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    const { httpStatusCode = ERROR_CODE } = err
    res.status(httpStatusCode).json({
        error: err.message
    });
})

// Inicio server
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.error(`Error en servidor ${error}`))