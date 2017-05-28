/**
 * Created by Jesse on 17/5/22.
 */
var express = require('express');
var router = express.Router();
var articleModel = require('../model/article');
var multer = require('multer');
var path = require('path');
var markdown = require('markdown').markdown;
//指定文件元素的存储方式
var storage = multer.diskStorage({
    //保存文件的路径
    destination: function (req, file, cb) {
        cb(null, path.resolve('../public/images'));
        // cb(null, '../public/images');
    },
    //指定保存的文件名
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.slice(file.mimetype.indexOf('/') + 1));
    }
});

var upload = multer({storage: storage});
/**
 * 请求一个空白的发表文章页面
 */
router.get('/add', (req, res) => {
    res.render('article/add',{
        detail:{}
    });
});
/**
 * 提交文章数据
 * 里面放置的是文件域的名字
 */
router.post('/add', upload.single('img'), (req, res) => {
    var article = req.body,
        _id = article.id;
    if (req.file) {
        article.img = '/images/' + req.file.filename;
    }
    if (_id) {
        /**
         * set 表示要更新的字段
         * @type {{title: string, content: (*)}}
         */
        var set = {
            title: article.title,
            content: article.content
        };
        if (req.file) {
            set.img = '/images/' + req.file.filename;
        }
        articleModel.update({
            _id: _id
        }, {$set: set}, (err,doc) => {
            if(err){
                req.flash('error', err);
                res.redirect('back');
            }else{
                req.flash('success', '更新成功');
                res.redirect('/');
            }
        });
    } else {
        if (req.file) {
            article.img = '/images/' + req.file.filename;
        }
        article.user = req.session.user;
        console.log(article);
        /**
         * create 是类的静态方法
         * save   是实例的方法
         */
        articleModel.create(article, (err, doc) => {
            if (err) {
                req.flash('error', err);
                res.redirect('back');
            } else {
                req.flash('success', '发表成功');
                res.redirect('/');
            }

        });
    }
});

/**
 * 文章详情页
 */
router.get('/detail/:id', (req, res) => {
    articleModel.findById(req.params.id, (err, doc) => {
        if (err) {
            req.flash('error', err);
            res.redirect('back');
        } else {
            doc.content = markdown.toHTML(doc.content);
            res.render('article/detail', {
                detail: doc
            });
        }
    });
});

/**
 * 文章详情页
 * 删除
 */
router.get('/delete/:id', (req, res) => {
    articleModel.remove({_id: req.params.id}, (err) => {
        if (err) {
            req.flash('error', err);
            res.redirect('back');
        } else {
            req.flash('success', '删除成功');
            res.redirect('/');
        }
    });
});
/**
 * 文章详情页
 * 跳转到修改文章页面
 */
router.get('/update/:id', (req, res) => {
    articleModel.findById({_id: req.params.id}, (err, doc) => {
        if (err) {
            req.flash('error', err);
            res.redirect('back');
        } else {
            res.render('article/add', {
                detail: doc
            });
        }
    });
});
module.exports = router;