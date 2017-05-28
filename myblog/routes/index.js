var express = require('express');
var articleModel = require('../model/article');
var markdown = require('markdown').markdown;
/**
 * 路由的实例
 */
var router = express.Router();

router.use(function (req,res,next) {
    console.log('user');
    next();
});
// urlencoded application/json
/* GET home page. */
router.get('/', function(req, res, next) {
  //第二个参数对象最后会合并到res.locals对象上，并渲染模版
    if(req.session.user){
    //我们查出来的user是ID，需要通过populate转成对象
        articleModel.find({
            user:req.session.user
        }).populate('user').exec((err,docs)=>{
            if(err){
                req.flash('error',err);
                res.redirect('back');
            }else{
                docs.forEach(function (doc) {
                    doc.content = markdown.toHTML(doc.content);
                });
                res.render('index',{
                    docs:docs
                });
            }
        });
    }else {
        res.render('index',{
            docs:[]
        });
    }

});
module.exports = router;
