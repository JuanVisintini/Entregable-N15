require('dotenv').config();
const express = require('express');
const app = express();
const util = require('util');
const { engine } = require('express-handlebars');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const os = require('os');
const cluster = require('cluster');

const argumentos = require('./yargs');
const PORT = argumentos.port;
const MODO = argumentos.modo;
const numeroCpu = os.cpus().length;
const processId = process.pid;


//FAKER 
const { productos } = require('./faker/faker');
const elegirContenedor = require('./daos/index');

const { Server: HttpServer } = require('http');
const { Server: IoServer } = require('socket.io');
const httpServer = new HttpServer(app);
const io = new IoServer(httpServer);

//Normalizr
const normalizr = require('normalizr');
const autorSchema = new normalizr.schema.Entity('autor', {}, { idAttribute: 'mail' });
const mensajeSchema = new normalizr.schema.Entity('mensaje', {
    autor: autorSchema,
});

//Midlleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(session({
    store: new MongoStore({
        mongoUrl: process.env.DB_URL,
    }),
    secret: "algunSecrete",
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000,
    }
}))

//Passport
const passport = require('./passport/passport.js');
app.use(passport.initialize());
app.use(passport.session());

//View
app.engine("hbs", engine({
    extname: "hbs",
    defaultLayout: "main-layout",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
}));

function print(data) {
    console.log(util.inspect(data, false, 12, true));
}

app.set("view engine", "hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
    res.redirect("/api/productos");
});

app.use('/api', require('./routes'))

app.use ("/port", (req, res) => {
    res.send(`El puerto es ${PORT}`);
});


//Socket
io.on('connection', async (socket) => {
    console.log(`se conecto el usuario: ${socket.id}`)

    const contendorProductos = await elegirContenedor("products");
    const contendorMensajes = await elegirContenedor("message");
    

    const mensajeNormalizado = normalizr.normalize(await contendorMensajes.getAll(), [mensajeSchema]);

    socket.emit('leerProducto', await contendorProductos.getAll());
    socket.emit('leerMensaje', mensajeNormalizado);

    socket.on('nuevoProducto', async (productoInfo) => {
      const idProducto = await contendorProductos.create(productoInfo);
      if(idProducto){
        const productos = await contendorProductos.getAll();
        io.emit('leerProducto', productos)
      }else{
        console.log("No se pudo crear el producto");
      }
    })

    socket.on('nuevoMensaje', async (messageInfo) => {
        const idMensaje = await contendorMensajes.create(messageInfo);
        if(idMensaje){
        const mensajesNormalizado = normalizr.normalize(await contendorMensajes.getAll(), [mensajeSchema]);
        console.log("MENSAJE NNORMALIZADO", mensajesNormalizado) ;
        io.emit('leerMensaje', mensajesNormalizado)
        console.log("paso")
        }
        else{
            console.log("No se pudo crear el mensaje");
        }
        
    })
})

//server
if(MODO === "FORK"){

    httpServer.listen(PORT, () => { 
        console.log(`Servidor http escuchando en el puerto ${PORT}`);
    });

}else{
    console.log(`Procesos: ${processId} , isMaster: ${cluster.isMaster}, isWorker: ${cluster.isWorker}, numeroCpu: ${numeroCpu}`);
    if(cluster.isPrimary){
        for(let i = 0; i < numeroCpu; i++){
            cluster.fork();
        }
        cluster.on('exit', (worker) => {
            console.log(`Worker ${worker.process.pid} died`);
        });
        
    }else{
        httpServer.listen(PORT, () => { 
            console.log(`Servidor http escuchando en el puerto ${PORT}`);
        });
    }
}
