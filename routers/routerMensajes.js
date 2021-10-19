const { Router } = require('express');
const Contenedor = require('./../contenedor.js')

const routerMensajes = Router();

/**** Constantes ****/
const ARCHIVO_MENSAJES = 'resources/mensajes.txt'

/**** Helpers ****/
const mensajes = new Contenedor(ARCHIVO_MENSAJES)

class IdNoNumerico extends Error {
    constructor() {
        super('id no numerico')
        this.name = this.constructor.name
        this.httpStatusCode = 400
        Error.captureStackTrace(this, this.constructor)
    }
}

class MensajeNoEncontrado extends Error {
    constructor() {
        super('mensaje no encontrado')
        this.name = this.constructor.name
        this.httpStatusCode = 404
        Error.captureStackTrace(this, this.constructor)
    }
}

function getRequestID(req){
    if (isNaN(req.params.id)) {
        throw new IdNoNumerico()
    }
    const id = parseInt(req.params.id)
    return id
}

/**** Rutas ****/
routerMensajes.get('/', async (req, res, next) => {  
    try {
        const listaMensajes = await mensajes.getAll()
        res.json(listaMensajes)    
    } catch (error) {
        next(error)
    }
})

routerMensajes.get('/:id', async (req, res, next) => {  
    try {
        const id = getRequestID(req)
        const mensaje = await mensajes.getById(id)
        if (mensaje == null){
            throw new MensajeNoEncontrado()
        }
        res.json(mensaje)    
    } catch (error) {
        return next(error)
    }
})

routerMensajes.post('/', async (req, res, next) => {  
    try {
        const mensaje = await mensajes.save(req.body)
        res.status(201).json(mensaje)
    } catch (error) {
        next(error)
    }
})

routerMensajes.put('/:id', async (req, res, next) => {  
    try {
        const id = getRequestID(req)
        const mensaje = await mensajes.saveById(req.body, id)
        if (mensaje == null){
            throw new MensajeNoEncontrado()
        }
        res.json(mensaje)
    } catch (error) {
        next(error)
    }
})

routerMensajes.delete('/:id', async (req, res, next) => {  
    try {
        const id = getRequestID(req)
        const mensaje = await mensajes.deleteById(id)
        if (mensaje == null) {
            throw new MensajeNoEncontrado()
        }
        res.json({})
    } catch (error) {
        next(error)
    }
})


exports.routerMensajes = routerMensajes;