import faker from "faker";
import utils from "../core/utils";

faker.locale = "id_ID";

export default {
    default_times: 100,
    entities: {
        user: {
            name: faker.name.findName,
            username: faker.internet.userName,
            password: {
                wrap: utils.hash,
                method: faker.internet.password
            }
        }
    }
};