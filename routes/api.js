/**
 * Api routes
 */
import bcrypt from "bcrypt";

function api(app, models, socketListener) {
    let router = app.get("express").Router();

    /**
     * Router disini..
     */

    router.post("/login", async (req, res) => {
        const body = req.body;
        const user = await models.user.findOne({
            include: [{ model: models.token }],
            where: { username: body.username },
        });
        if (bcrypt.compareSync(body.password, user.password)) {
            /** Invalidate old tokens */
            const oldTokenPromises = [];
            user.tokens.forEach((tokenModel) => {
                oldTokenPromises.push(tokenModel.update({ used: 1 }));
            });
            await Promise.all(oldTokenPromises);
            delete user.dataValues.tokens;
            /** Generate new tokens */
            const userToken = await req.generateUserToken(user.id);
            res.setStatus(res.OK);
            res.setData({
                user,
                token: userToken.token,
                refreshToken: userToken.refreshToken
            });
            res.go();
        } else {
            res.setStatus(res.GAGAL);
            res.setMessage("Username / Password salah");
            res.go();
        }
    });

    router.get("/check", (req, res) => {
        res.setStatus(res.OK);
        res.setData(req.user);
        res.go();
    });

    router.get("/logout", (req, res) => {
        res.set("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
        res.set("x-access-token", "");
        res.set("x-refresh-token", "");
        res.setStatus(res.OK);
        res.setData("Berhasil logout");
        res.go();
    });

    return router;
}

module.exports = api;
