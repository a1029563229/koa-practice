const Validator = require('validator');
const isEmpty = require("./is-empty");

function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.re_password = !isEmpty(data.re_password) ? data.re_password : "";

    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = "名字的长度不能小于2位且不能超过30位";
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = "名字不能为空";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "邮箱不能为空";
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = "邮箱不合法";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "密码不能为空";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "密码的长度不能小于6位且不能超过30位";
    }

    if (Validator.isEmpty(data.re_password)) {
        errors.re_password = "密码不能为空";
    }

    if (!Validator.equals(data.password, data.re_password)) {
        errors.re_password = "两次密码不一致";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

function validateUserInfoItemInput(data) {
    let errors = {};

    if (data.name && !Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.msg = "名字的长度不能小于2位且不能超过30位";
    }

    if (data.password && !Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.msg = "密码的长度不能小于6位且不能超过30位";
    }

    if (data.password && !Validator.equals(data.password, data.re_password)) {
        errors.msg = "两次密码不一致";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = {
    validateUserInfoItemInput,
    validateRegisterInput
}