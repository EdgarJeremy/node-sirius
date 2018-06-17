/**
 * Api routes
 */

function api(app, models, socketListener) {
    let router = app.get("express").Router();

    /**
     * Router disini..
     */
    router.get("/users", async (req, res) => {
        res.setStatus(res.OK);
        res.setData(await models.user.findAll({
            include: [{ model: models.article }]
        }));
        res.go();
    });

    return router;
}

module.exports = api;
