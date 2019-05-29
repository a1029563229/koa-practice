const Validator = require('validator');
const isEmpty = require("./is-empty");

function validateUploadFile(data) {
    let errors = {};

    if (!data || isEmpty(data)) {
        errors.msg = "上传的文件不能为空";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = {
    validateUploadFile
}