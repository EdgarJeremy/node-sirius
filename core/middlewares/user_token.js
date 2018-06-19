/**
 * Token decoder
 */
import jwt from "jsonwebtoken";

async function generateTokens(userId, userModel, tokenSecret, refreshTokenSecret, tokenExpire, refreshTokenExpire) {
    const user = await userModel.findOne({ where: { id: userId } }, { raw: true });
    if (user) {
        return {
            token: jwt.sign({ id: userId }, tokenSecret, { expiresIn: tokenExpire }),
            refreshToken: jwt.sign({ id: userId }, refreshTokenSecret + user.password, { expiresIn: refreshTokenExpire })
        }
    } else {
        return {};
    }
}

async function getNewTokens(refreshToken, userModel, tokenSecret, refreshTokenSecret, tokenExpire, refreshTokenExpire) {
    let userId = -1;
    try {
        const { id } = jwt.decode(refreshToken);
        userId = id;
    } catch (err) {
        return {};
    }

    if (!userId) return {};

    const user = await userModel.findOne({ where: { id: userId } }, { raw: true });
    if (!user) return {};

    const refreshKey = refreshTokenSecret + user.password;
    try {
        jwt.verify(refreshToken, refreshKey);
    } catch (err) {
        return {};
    }

    const newTokens = await generateTokens(userId, userModel, tokenSecret, refreshTokenSecret, tokenExpire, refreshTokenExpire);
    newTokens.user = user;
    return newTokens;
}

export default (opts) => {
    const { tokenSecret, refreshTokenSecret, userModel, tokenExpire, refreshTokenExpire } = opts;

    return async (req, res, next) => {

        /**
         * Attach helper function to req object
         */
        req.generateUserToken = async (userId) => {
            return await generateTokens(userId, userModel, tokenSecret, refreshTokenSecret, tokenExpire, refreshTokenExpire);
        }

        /**
         * Get headers data
         */
        const token = req.headers["x-access-token"];
        const refreshToken = req.headers["x-refresh-token"];

        if (token) {
            try {
                const { id } = jwt.verify(token, tokenSecret);
                const user = await userModel.findOne({ where: { id } }, { raw: true });
                user.password = undefined;
                req.user = user;
            } catch (err) {
                if(err.name === "TokenExpiredError") {
                    const newTokens = await getNewTokens(refreshToken, userModel, tokenSecret, refreshTokenSecret, tokenExpire, refreshTokenExpire);
                    if(newTokens.token && newTokens.refreshToken) {
                        res.set("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
                        res.set("x-access-token", newTokens.token);
                        res.set("x-refresh-token", newTokens.refreshToken);
                        newTokens.user.password = undefined;
                        req.user = newTokens.user;
                    }
                }
            }
        }
        next();
        
    }

}