/**
 * Packages & modules
 */
import express from "express";
import http from "http";
import socketio from "socket.io";
import sirius from "sirius-express";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";
import Table from "cli-table";
import ip from "ip";

import config from "./config.json";
import packageInfo from "./package.json";
import socketListener from "./websocket/listener";
import models from "./core/importer/model";
import routes from "./core/importer/route";
import getRoutesData from "./core/inspector/route";
import utils from "./core/utils";

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
}));
app.use(sirius({
    showPost: config.request.show_post,
    showGet: config.request.show_get,
    secret: config.session.secret
}));

/**
 * Load semua routes
 */
Object.keys(routes).forEach(function (route) {
    app.use(`/${route}`, routes[route](app, models, socketListener));
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
    const routesData = getRoutesData(app);
    utils.log("Server berjalan! Selamat bekerja :)", "success", "", "\n");
    utils.log("Info Aplikasi : ", "", "", " ");
    console.log(motd.toString());
    utils.log("Daftar endpoint : ", "", "", "");
    console.log(routesData.string);
});