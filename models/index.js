import Sequelize from "sequelize";
import { database, environment } from "../config.json";
import fs from "fs";

const sequelize = new Sequelize(
    database.database,
    database.user,
    database.password,
    {
        host: database.host,
        dialect: database.dialect,
        logging: environment === "development",
        dialectOptions: {
            useUTC: true
        },
        timezone: "+08:00"
    }
);

const models = {
    user: sequelize.import("./user"),
    article: sequelize.import("./article")
};

/**
 * Using below code to do automatic models object crafting
 */
// const models = { }
// fs.readdirSync(__dirname).forEach((file) => {
//     if(file.indexOf(".js") !== -1 && file !== "index.js") {
//         models[file.replace(".js", "")] = sequelize.import(`${__dirname}/${file}`);
//     }
// });

Object.keys(models).forEach((model) => {
    if("associate" in models[model]) {
        models[model].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;