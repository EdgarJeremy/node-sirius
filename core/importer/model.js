import Sequelize from "sequelize";
import path from "path";
import fs from "fs";
import { database, environment, folders, time } from "../../config.json";

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
        timezone: time.zone
    }
);

const models = { }
let folder = path.join(__dirname, "..", "..", folders.models);
fs.readdirSync(folder).forEach((file) => {
    if(file.indexOf(".js") !== -1 && file !== "index.js") {
        models[file.replace(".js", "")] = sequelize.import(`${folder}/${file}`);
    }
});

Object.keys(models).forEach((model) => {
    if("associate" in models[model]) {
        models[model].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;