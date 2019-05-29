const Router = require("koa-router");
const router = Router();

const Post = require("../../models/Post");

router.get("/", async ctx => {
    const find_result = await Post.find();
    ctx.status = 200;
    ctx.body = find_result;
});

router.post("/", async ctx => {
    const params = ctx.request.body;
    const new_post = new Post({
        title: params.title,
        description: params.description
    });

    await new_post.save().then(post => {
        ctx.status = 200;
        ctx.body = post;
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router.routes();