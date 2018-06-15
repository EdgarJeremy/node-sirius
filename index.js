/**
 * Packages & modules
 */
import express from "express";
import http from "http";
import socketio from "socket.io";
import fs from "fs";
import sirius from "sirius-express";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";
import Table from "cli-table";
import ip from "ip";

import config from "./config.json";
import packageInfo from "./package.json";
import socketListener from "./websocket/listener";
import models from "./models";

const app = express();
const server = http.Server(app);
const io = socketio(server);

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
    origin: config.cors,
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
 * Load semua routes
 */
fs.readdirSync(config.folders.routes).forEach(function (file, index) {
    let route = file.split(".")[0];
    app.use(`/${route}`, require(`./${config.folders.routes}/${file}`)(app, socketListener));
});

/**
 * Root routes
 */
app.get("/", function (req, res) {
    res.setStatus(res.OK);
    res.setData({
        app: packageInfo.name,
        version: packageInfo.version
    });
    res.go();
});

/**
 * Synchronize & motd 
 */
models.sequelize.sync({
    alter: config.migration.watch,
    force: config.migration.renew
}).then(() => {
    server.listen(config.server.port);
    socketListener.listen(io);
    const motd = new Table();
    motd.push(
        { "Nama App": packageInfo.name },
        { "Versi": packageInfo.version },
        { "Running Port": config.server.port },
        { "Root Endpoint": `${config.server.protocol}://${ip.address()}:${config.server.port}/` }
    );
    console.log(motd.toString());
});