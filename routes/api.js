/**
 * Api routes
 */
const tiler = require("../core/tiler");

function api(app, models, utils) {
    var router = app.get("express").Router();

    router.get("/:object/:z/:x/:y", function(req,res){
        tiler.load(req.params.object, req.params.z, req.params.x, req.params.y)
            .then((data) => {
                console.log(data);
                res.set(data.headers);
                res.send(data.tile);
            }).catch((err) => console.log("Ada error", err));
    });

    // router.get("/kelurahan/:z/:x/:y", function(req,res){
    //     tiler.load("kelurahan", req.params.z, req.params.x, req.params.y)
    //         .then((data) => {
    //             console.log(data);
    //             res.set(data.headers);
    //             res.send(data.tile);
    //         }).catch((err) => console.log("Ada error", err));
    // });
    //
    // router.get("/kecamatan/:z/:x/:y", function(req,res){
    //     tiler.load("kecamatan", req.params.z, req.params.x, req.params.y)
    //         .then((data) => {
    //         console.log(data);
    //         res.set(data.headers);
    //         res.send(data.tile);
    //     }).catch((err) => console.log("Ada error", err));
    // });
    //
    // router.get("/lingkungan/:z/:x/:y", function(req,res){
    //     tiler.load("lingkungan", req.params.z, req.params.x, req.params.y)
    //         .then((data) => {
    //         console.log(data);
    //         res.set(data.headers);
    //         res.send(data.tile);
    //     }).catch((err) => console.log("Ada error", err));
    // });
    //
    // router.get("/jalan/:z/:x/:y",  function(req,res){
    //     tiler.load("jalan", req.params.z, req.params.x, req.params.y)
    //         .then((data) => {
    //         console.log(data);
    //         res.set(data.headers);
    //         res.send(data.tile);
    // 	}).catch((err) => console.log("Ada error", err));
    // });


    /**
     * Router here..
     */

    return router;
}

module.exports = api;
