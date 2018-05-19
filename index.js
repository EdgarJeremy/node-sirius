/** Load modules & configuration */
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const fs = require("fs");
const config = require("./config.json");
const package = require("./package.json");
const sirius = require("sirius-express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const knex = require("knex")({
    client: "mysql",
    connection: config.database
});
const utils = require("./core/utils");
server.listen(config.server.port);
const socketListener = require("./websocket/listener");
socketListener.listen(io);

/**
 * App constants
 */
app.set("express", express);

/**
 * Middlewares
 */
app.use(bodyParser.json({ limit: config.request.limit }));
app.use(bodyParser.urlencoded({ limit: config.request.limit, extended: true }));
app.use(cors({
    origin: function(origin, cb){
        // TODO : Filter origin dari request
        // untuk sementara allow semua
        cb(null, true);
    },
    credentials: true
}));
app.use(session({
    secret: config.session.secret,
    cookie: {
        maxAge: config.session.maxAge
    },
    resave: true,
    saveUninitialized: false
}))
app.use(sirius({
    showPost: true,
    showGet: true
}));

/**
 * Load semua models
 */
let models = {};
fs.readdirSync(config.folders.models).forEach(function(file, index){
    let name = file.split(".")[0]
    models[name] = require(`./${config.folders.models}/${file}`)(knex, utils);
});

/**
 * Load semua routes
 */
fs.readdirSync(config.folders.routes).forEach(function(file, index){
    let route = file.split(".")[0];
    app.use(`/${route}`, require(`./${config.folders.routes}/${file}`)(app, models, utils, socketListener));
});

/**
 * Root routes
 */
app.get("/",function(req,res){
    res.setStatus(res.OK);
    res.setData({
        app: package.name,
        version: package.version
    });
    res.go();
});

console.log(`------------------------------------------------`);
console.log(`${package.name} ${package.version} running on port ${config.server.port}`);
console.log(`Akses : http://localhost:${config.server.port}`);
console.log(`------------------------------------------------`);