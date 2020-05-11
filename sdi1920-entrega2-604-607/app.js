//Módulos
let express = require('express');
let app = express();

app.listen(app.get('port'), function() {
    console.log("Servidor activo");
})


let rest = require('request');
app.set('rest', rest);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    // Debemos especificar todas las headers que se aceptan. Content-Type , token
    next();
});

var jwt = require('jsonwebtoken');
app.set('jwt', jwt);

let fs = require('fs');
let https = require('https');

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

let crypto = require('crypto');

let fileUpload = require('express-fileupload');
app.use(fileUpload());
let mongo = require('mongodb');
let swig = require('swig');
let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app, mongo);


var log4js = require('log4js');

// Configuramos el logger
log4js.configure({
    appenders: {
        out: { 	// para la salida estándar
            type: 'stdout'
        },
        file: { 	// para la salida a un fichero de log
            type: 'file', filename: 'logs/RedSocialNode.log'
        }
    },
    categories: {
        default: { appenders: [ 'out', 'file' ], level: 'info' }
    }
});
var logger = log4js.getLogger();

// routerUsuarioToken
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function (req, res, next) {
    // obtener el token, vía headers (opcionalmente GET y/o POST).
    var token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', function (err, infoToken) {
            if (err || infoToken.usuario == null) {
                res.status(403); // Forbidden
                res.json({
                    acceso: false,
                    error: 'Token inválido'
                });
                return;
            } else {
                // dejamos correr la petición
                // Añadimos el usuario a la respuesta
                res.usuario = infoToken.usuario;
                next();
            }
        });
    } else {
        res.status(403); // Forbidden
        res.json({
            acceso: false,
            mensaje: 'No hay Token'
        });
    }
});
// Aplicar routerUsuarioToken
app.use('/api/amigos', routerUsuarioToken);
app.use('/api/amigos/*', routerUsuarioToken);
app.use('/api/mensaje', routerUsuarioToken);
app.use('/api/mensajes/*', routerUsuarioToken);


// routerUsuarioSession
let routerUsuarioSession = express.Router();
routerUsuarioSession.use(function (req, res, next) {
    console.log("routerUsuarioSession");
    if (req.session.usuario) { // dejamos correr la petición
        next();
    } else {
        console.log("va a : " + req.session.destino);
        res.redirect("/identificarse" +
            "?mensaje=Intento de acceso a zona restringida"+
            "&tipoMensaje=alert-danger ");
    }
});

//Aplicar routerUsuarioSession
app.use("/usuarios", routerUsuarioSession);
app.use("/usuario/amigos", routerUsuarioSession);
app.use("/peticion", routerUsuarioSession);
app.use("/invitaciones", routerUsuarioSession);


app.use(express.static('public'));

//Variables
app.set('port', 8081);
app.set('db', 'mongodb://admin:sdiadmin1920607@tiendamusica-shard-00-00-9fg70.mongodb.net:27017,tiendamusica-shard-00-01-9fg70.mongodb.net:27017,tiendamusica-shard-00-02-9fg70.mongodb.net:27017/test?ssl=true&replicaSet=tiendamusica-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('clave', 'abcdefg');
app.set('crypto', crypto);
app.set('logger', logger);


//Rutas/controladores por lógica
require("./routes/rusuarios")(app, swig, gestorBD); //(app,param1, param2, etc.)
require("./routes/rinvitaciones")(app, swig, gestorBD);
require("./routes/rapiusuarios.js")(app, gestorBD);
require("./routes/rapimensajes.js")(app, gestorBD);

app.get('/', function (req, res) {
    res.redirect('/identificarse');
});


app.use(function (err, req, res, next) {
    console.log("Error producido: " + err); //mostramos el error en consola
    if (!res.headersSent) {
        res.status(400);
        res.send("Recurso no disponible");
    }
});

//lanzar el servidor
https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), function () {
    console.log("Servidor activo");
});
