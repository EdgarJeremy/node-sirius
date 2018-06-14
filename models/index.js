import Sequelize from "sequelize";
import { database } from "../config.json";

const sequelize = new Sequelize(
    database.database,
    database.user,
    database.password,
    {
        host: database.host,
        dialect: database.dialect
    }
);

const models = {
    user: sequelize.import("./user")
};

Object.keys(models).forEach((model) => {
    if("associate" in models[model]) {
        models[model].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;