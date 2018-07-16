/**
* File : ./routes/admin.js 
* Tanggal Dibuat : 2018-7-16 17:36:27
* Penulis : zero
*/
import { onlyAuth } from "../middlewares/validator/auth";

function admin(app, models, socketListener) {
    let router = app.get("express").Router();
    router.use(onlyAuth());
    
    /**
     * Router disini..
     */
    router.get("/index", (req, res) => {
        res.setStatus(res.OK);
        res.setData(req.user);
        res.go();
    });

    return router;
}

module.exports = admin;