import sequelize from 'sequelize';
import _ from 'lodash';

let ops = {
    '=': sequelize.Op.eq,
    '>': sequelize.Op.gt,
    '<': sequelize.Op.lt,
    '>:': sequelize.Op.gte,
    '<:': sequelize.Op.lte,
    '!:': sequelize.Op.ne
};

let filterOp = (item = '') => {
    let r = false;
    Object.keys(ops).forEach((op) => {
        if(item.indexOf(op) !== -1) {
            let [key, value] = item.split(op);
            r = { [key]: { [ops[op]]: value } };
        }
    });
    return r;
}

export function parser(opts) {
    return (req, res, next) => {
        let query = req.query;
        let filter = query.filter || '';
        let order = query.order || '';

        let parsed = {};

        /**
         * Filter
         */
        let andFilter = filter.split('&');
        let orFilter = [];
        andFilter.forEach((andItem, i) => {
            let split = andItem.split('|');
            if (split.length > 1) {
                let and = split[0];
                split.splice(0, 1);
                orFilter = [...orFilter, ...split];
                andFilter[i] = and;
            }
        });
        andFilter = _.compact(andFilter.map(filterOp));
        orFilter = _.compact(orFilter.map(filterOp));
        parsed.filter = { };
        if(andFilter.length) {
            if(parsed.filter[sequelize.Op.or] === undefined) {
                parsed.filter[sequelize.Op.or] = {};
            }
            parsed.filter[sequelize.Op.or][sequelize.Op.and] = andFilter;
        }
        if(orFilter.length) {
            if(parsed.filter[sequelize.Op.or] === undefined) {
                parsed.filter[sequelize.Op.or] = {};
            }
            parsed.filter[sequelize.Op.or][sequelize.Op.or] = orFilter;
        }
        
        /**
         * Order
         */
        let fields = order.split(',').map((item) => item.trim());
        let orderBy = fields.map((field) => {
            let type = field[0];
            return [field.replace(type, ''), type === '*' ? 'asc' : 'desc'];
        });
        parsed.order = orderBy;

        req.parsed = parsed;
        next();
    }
}