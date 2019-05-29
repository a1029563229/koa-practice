const Koa = require("koa");
const json = require("koa-json");
const cors = require("koa2-cors");
const KoaRouter = require("koa-router");
const path = require("path");
const render = require("koa-ejs");
const koaBody = require('koa-body');
const mongoose = require("mongoose");
const passport = require("koa-passport");
const app = new Koa();
const router = new KoaRouter();

// json pretty
app.use(json());

app.use(koaBody({
    multipart: true, // 支持文件上传
    // encoding: 'gzip',
    formidable: {
        uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
        keepExtensions: true,    // 保持文件的后缀
        maxFieldsSize: 2000 * 1024 * 1024, // 文件上传大小
        onFileBegin: (name, file) => { // 文件上传前的设置
            // console.log(`name: ${name}`);
            // console.log(file);
        }
    }
}));

// 引入users.js
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const file = require("./routes/common/file");

// 给上下文 context 添加属性
app.context.user = "米斯特务";

// DB
const things = [{ name: 'my family' }, { name: 'programming' }, { name: 'music' }];

// 配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: "html",
    cache: false,
    debug: false
});

// 路由跳转 index
router.get("/", index);

// 函数声明
async function index(ctx) {
    await ctx.render("index", {
        title: "Things1 i love",
        things
    });
}

router.get("/add", showAdd);

async function showAdd(ctx) {
    await ctx.render("add")
}

// 添加路由方法
router.post("/add", add);

async function add(ctx) {
    const body = ctx.request.body;
    // console.log(body);
    things.push({ name: body.thing });
    ctx.redirect("/");
}

router.get("/test", ctx => {
    ctx.body = `Hello ${ctx.user}`;
});

router.get("/test2/:id", ctx => {
    ctx.body = `Hello ${ctx.params.id}`;
});

// app.use(async ctx => {
//     ctx.body = { msg: "Hello Koa!" };
// });

// config
const db = require("./config/keys").mongoURI;

// 连接数据库
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log("Mongodb Connected...");
    }).catch(err => {
        console.log("Mongodb Failed...");
        console.log(err);
    });

// 回调到config文件中，passport.js
require("./config/passport")(passport);

app.use(cors({
    origin: function (ctx) {
        return "*";
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(passport.initialize())
app.use(passport.session())

// 配置路由地址
router.use("/api/users", users);
router.use("/api/posts", posts);
router.use("/api/common", file);

// 配置路由模块
app.use(router.routes()).use(router.allowedMethods());

app.listen(7788, () => {
    console.log("Server Stared...")
});