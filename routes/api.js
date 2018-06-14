/**
 * Api routes
 */
import models from "../models";

function api(app, socketListener) {
    var router = app.get("express").Router();

    /**
     * Router here..
     */
    router.get("/users", async (req,res) => {
        res.setStatus(res.OK);
        res.setData(await models.user.findAll());
        res.go();
    });
    
    return router;
}

module.exports = api;
