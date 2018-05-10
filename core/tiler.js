const tilelive = require("@mapbox/tilelive");
require("tilelive-postgis").registerProtocols(tilelive);
const config = require("../config.json");
const uri = `postgis://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.database}?layerName=${config.spatials.layerName}`;
const pg = require("knex")({
    client: "pg",
    connection: uri
});

module.exports = {

    load: function(table, z,x,y) {
        z = parseInt(z);
        x = parseInt(x);
        y = parseInt(y);

        var self = this;
        var sql = pg.select("*").from(table);
        var queryString = self.queryString(sql);

        return new Promise(function(fulfilled,rejected) {
            tilelive.load(queryString, (err,source) => {
                if(err) return rejected(err);
                source.getTile(z,x,y, (err, tile, headers) => {
                    if(err) return rejected(err);
                    fulfilled({tile: tile, headers: headers});
                });
            });
        });
    },

    queryString: function(pgSql) {
        var sql = `(${pgSql.toString()} WHERE st_intersects(feature, !bbox!)) as query`
        return `${uri}&query=${encodeURI(sql)}`;
    }

}