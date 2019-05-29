const Router = require("koa-router");
const fs = require("fs");
const router = Router();
const qiniu = require("../../config/qiniu");
const keys = require("../../config/keys");

const { validateUploadFile } = require("../../validation/file");

/**
 * @route POST api/common/upload
 * @desc upload api
 * @access api public
 */
router.post("/upload", async ctx => {
    let files = ctx.request.files;

    const { errors, isValid } = validateUploadFile(files);

    // 判断是否验证通过
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    let data;
    for (let filename in files) {
        let name_collects = files[filename].path.split("/");
        let original_name = name_collects[name_collects.length - 1];
        let file_name = original_name.replace("upload", filename)
        data = await qiniu({
            qiniuFileName: file_name,
            filePath: files[filename].path
        });
        fs.unlink(files[filename].path, () => { });
        data.url = keys.qiniu_prefix + data.key;
    }

    ctx.status = 200;
    ctx.body = data;
});

router.get("/mock", async ctx => {
    ctx.status = 200;
    ctx.body = [
        {
            id: 1,
            name: "Jack",
            description: "This is Jack",
            count: 20
        },
        {
            id: 2,
            name: "Dove",
            description: "This is Dove",
            count: 15
        },
        {
            id: 3,
            name: "Left",
            description: "This is Left",
            count: 90
        },
        {
            id: 4,
            name: "Max",
            description: "This is Max",
            count: 2
        },
        {
            id: 5,
            name: "Right",
            description: "This is Right",
            count: 5
        }
    ]
})


module.exports = router.routes();