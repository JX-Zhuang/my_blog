var express = require('express');
var path = require('path');
var flash = require('connect-flash');
/**
 * 处理收藏夹图标的
 */
var favicon = require('serve-favicon');
/**
 * 处理日志
 */
var logger = require('morgan');
/**
 * 解析cookie
 * res.cookie   方法，用来设置cookie
 * req.cookies  把请求中的cookie封装成对象
 */
var cookieParser = require('cookie-parser');
/**
 * 解析请求体  req.body
 */
var bodyParser = require('body-parser');
var session = require('express-session');
/**
 * 把session存进数据库里
 */
var MongoStore = require('connect-mongo/es5')(session);
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://127.0.0.1:27017/myblog');

/**
 * 加载路由
 * 根据请求的路径不同，进行不同的处理
 */
var index = require('./routes/index');
var users = require('./routes/users');

var articles = require('./routes/articles');

var app = express();

// view engine setup
/**
 * 设置模版文件的存放路径
 */
app.set('views', path.join(__dirname, 'views'));
/**
 * 设置模版引擎
 */
app.set('view engine', 'html');
/**
 * 设置一下对于html格式的文件，渲染的时候委托ejs的方法来进行渲染
 */
app.engine('html', require('ejs').renderFile);

app.use(session({
    secret: 'myBlog',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true,
        maxAge:60*1000000
    },
    /**
     * 指定保存的位置
     */
    store:new MongoStore({
        mongooseConnection:mongoose.connection
    })
}));
app.use(flash());
/**
 * 需要你把收藏夹的图标文件放在public下面
 */
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/**
 * 使用日志中间件
 */
app.use(logger('dev'));
/**
 * 解析JSON类型的请求
 * 通过请求中的Content-Type
 */
app.use(bodyParser.json());
/**
 * 解析urlencoded类型的请求

 */
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
/**
 * 静态文件服务中间件
 */
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    //res.locals才是真正的渲染模版的对象
    res.locals.user = req.session.user;
    if(req.session.user){
        res.locals.username = req.session.user.username;
    }else{
        res.locals.username = null;
    }
    /**
     * flash 取出来是一个数组
     * @type {string}
     */
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});
/**
 * 路由配置
 * 一级路径，真正的根目录
 */
app.use('/', index);
app.use('/users', users);

app.use('/articles', articles);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
