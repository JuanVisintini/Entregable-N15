const express = require('express');
const util = require('util');
const { engine } = require('express-handlebars');

const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

const argumentos = require('./yargs');
const PORT = argumentos.port;

require('dotenv').config();
const app = express();
//const port = process.env.PORT || 8080;

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

// app.get("/api/productos", (req, res) => {
//     res.render("formProductos");
// });

// app.get("/api/productos", (req, res) => {
//     if (req.session.nombreUsuario) {
//         res.render("formProductos", { nombreUsuario: req.session.nombreUsuario });
//     } else {
//         res.render("loginForm")
//     }
// });

// app.post("/api/productos/login", (req, res) => {
//     const { nombreUsuario } = req.body;
//     if (nombreUsuario) {
//         req.session.nombreUsuario = nombreUsuario;
//         res.redirect("/api/productos");
//     } else {
//         res.redirect("/api/productos");
//     }
// });

// app.post("/api/productos/logout", (req, res) => {
//     const nombreUsuario = req.session.nombreUsuario;
//     // res.render("adios", { nombreUsuario: req.session.nombreUsuario });

//     req.session.destroy(err => {
//         if (err) {
//             console.log(err)
//         } else {
//             res.render('chau', { nombreUsuario })
//             res.set({ 'Refresh': '3; url=/api/productos' });
//         }
//     });
// });

// app.get("/api/productos-test", (req, res) => {
//     res.render("listaProductosTest", { products: productos(5) })

// });

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

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
