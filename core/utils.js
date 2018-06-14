/** 
 * Utilities
*/
import bcrypt from "bcrypt";
import config from "../config.json";

module.exports = {

    table_prefix: function (fields, prefix) {
        let newFields = {};
        Object.keys(new Object(fields)).forEach((field, index) => {
            newFields[`${prefix}.${field}`] = fields[field];
        });
        return newFields;
    },

    check_props: function (obj, proper = []) {
        obj = new Object(obj);
        for (var i = 0; i < proper.length; i++) {
            if (!obj.hasOwnProperty(proper[i])) {
                return proper[i];
            }
        }
        return null;
    },

    format_nota: function (no_urut) {
        var waktu = new Date();
        return `${this.format_date(waktu)}/${no_urut}`;
    },

    num_pad: function (num, size) {
        var s = String(num);
        while (s.length < (size || 2)) { s = "0" + s }
        return s;
    },

    format_date: function (waktu = new Date()) {
        return `${waktu.getFullYear()}-${this.num_pad(waktu.getMonth() + 1)}-${this.num_pad(waktu.getDate())}`;
    },

    hash: function (password) {
        const { salt_rounds } = config.encryption;
        return bcrypt.hashSync(password, salt_rounds);
    },

    verify: function (hashed, plain) {
        const { salt_rounds } = config.encryption;
        return bcrypt.compareSync(plain, hashed);
    },

    craft_seed_data: function craft_data(target) {
        let data = {};
        Object.keys(target).forEach((key) => {
            if(typeof target[key] === "function") {
                data[key] = target[key]();
            } else {
                if(typeof target[key] !== "undefined") {
                    if(key.async_wrap) {
                        data[key] = target[key].wrap(target[key].method());
                    } else {
                        data[key] = target[key].wrap(target[key].method());
                    }
                }
            }
        });
        return data;
    }

}