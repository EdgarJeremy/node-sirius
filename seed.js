import models from "./models";
import utils from "./core/utils";
import faker from "faker";
import _ from "lodash";

models.sequelize.sync().then(() => {
    _.times(100, async function() {
        let data = {
            username: faker.name.firstName(),
            password: await utils.hash(faker.internet.password(8))
        };
        models.user.create(data);
    });
});