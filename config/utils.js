const isEmpty = require("../validation/is-empty");

function clearEmpty(obj) {
    let new_obj = {};
    for (let key in obj) {
        if (!isEmpty(obj[key])) {
            new_obj[key] = obj[key];
        }
    }

    return new_obj;
}

module.exports = {
    clearEmpty
}