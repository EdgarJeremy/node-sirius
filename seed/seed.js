import models from "../models";
import utils from "../core/utils";
import seedconfig from "./seedconfig";

const args = process.argv[2];

if (args) {
    const entity = args.split(":")[0];
    const times = args.split(":")[1] ? args.split(":")[1] : seedconfig.default_times;

    if (seedconfig.entities[entity]) {

        models.sequelize.sync().then(async () => {
            let target = seedconfig.entities[entity];
            let bulk = [];

            if(models[entity]) {
                for(let i = 0; i < times; i++) {
                    bulk.push(await utils.craft_seed_data(target));
                }
                models[entity].bulkCreate(bulk).then((ret) => {
                    console.log(`✓ ${times} data ${entity} tersimpan`);
                }).catch(console.log);
            } else {
                console.log(`✗ Model untuk entity ${entity} tidak ditemukan`);
            }

        });

    } else {
        console.log(`✗ Entity ${entity} tidak ditemukan. Sertakan konfigurasi seed untuk entity ${entity} di ./seed/seedconfig.js`);
    }
} else {
    console.log(`✗ Sertakan target entity dan jumlah seed {entity:n}`);
}