const Router = require("koa-router");
const router = Router();
const gravatar = require('gravatar');
const bcrypt = require("bcryptjs");
const tools = require("../../config/tools");
const jwt = require("jsonwebtoken");
const keys = require('../../config/keys');
const passport = require("koa-passport");

// 引入 User
const User = require("../../models/User");

// 引入 input 验证
const { validateRegisterInput, validateUserInfoItemInput } = require("../../validation/register");
const { validateLoginInput } = require("../../validation/login");
const { clearEmpty } = require("../../config/utils");

/**
 * @route GET api/users/template
 * @desc template api
 * @access api public
 */
router.get("/template", async ctx => {
    ctx.status = 200;
    ctx.body = { msg: "users works" };
});

/**
 * @route POST api/users/register
 * @desc register api
 * @access api public
 */
router.post("/register", async ctx => {
    // console.log(ctx.request.body);
    let params = ctx.request.body;
    const { errors, isValid } = validateRegisterInput(params);

    // 判断是否验证通过
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    // 存储到数据库
    const find_result = await User.find({ email: params.email })
    if (find_result.length > 0) {
        ctx.status = 502;
        ctx.body = { "email": "邮箱已被占用" };
    } else {
        const avatar = gravatar.url(params.email, { s: '200', r: 'pg', d: 'mm' });
        const new_user = new User({
            name: params.name,
            email: params.email,
            password: tools.enbcrypt(params.password),
            avatar
        });

        // 存储到数据库
        await new_user.save().then(user => {
            ctx.body = user;
        }).catch(err => {
            console.log(err);
        });
    }
});

/**
 * @route PUT api/users/register
 * @desc register api
 * @access api private
 */
router.put("/register/:id", passport.authenticate('jwt', { session: false }), async ctx => {
    // console.log(ctx.request.body);
    let _id = ctx.params.id;
    let params = clearEmpty(ctx.request.body);
    if (!params) {
        ctx.status = 400;
        return;
    }

    const { errors, isValid } = validateUserInfoItemInput(params);

    // 判断是否验证通过
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    // 存储到数据库
    const find_result = await User.find({ _id });
    if (find_result.length > 0) {
        if (params.password) {
            delete params.re_password;
            params.password = tools.enbcrypt(params.password);
        }

        ctx.status = 200;
        await User.updateOne({ _id }, params);
        const updated_user = await User.find({ _id });
        ctx.body = {
            id: updated_user[0].id,
            name: updated_user[0].name,
            email: updated_user[0].email,
            avatar: updated_user[0].avatar
        }
    } else {
        ctx.status = 502;
        ctx.body = { "msg": "id不存在" };
    }
});

/**
 * @route POST api/users/login
 * @desc login api
 * @access api public
 */
router.post("/login", async ctx => {
    // 查询
    let params = ctx.request.body;
    const { errors, isValid } = validateLoginInput(params);

    // 判断是否验证通过
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    const find_result = await User.find({ email: params.email });
    let user = find_result[0];
    if (!user) {
        ctx.status = 502;
        ctx.body = { msg: "用户不存在" };
    } else {
        var result = await bcrypt.compareSync(params.password, user.password);
        if (result === true) {
            const payload = { id: user.id, name: user.name, avatar: user.avatar };
            const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });

            ctx.status = 200;
            ctx.body = { success: true, token: "Bearer " + token };
        } else {
            ctx.status = 400;
            ctx.body = { msg: "密码错误" }
        }
    }
});

/**
 * @route GET api/users/current
 * @desc current api
 * @access api private
 */
router.get("/current", passport.authenticate('jwt', { session: false }), async ctx => {
    ctx.body = {
        id: ctx.state.user.id,
        name: ctx.state.user.name,
        email: ctx.state.user.email,
        avatar: ctx.state.user.avatar
    };
});

module.exports = router.routes();