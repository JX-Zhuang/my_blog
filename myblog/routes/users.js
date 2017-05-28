var express = require('express');
var userModel = require('../model/user');
var validate = require('../middle/index');
var md5 = require('../util/md5');
/**
 * 生成一个路由实例
 */
var router = express.Router();
/**
 * 用户注册
 */
/**
 * 要求未登陆才能访问
 */
router.get('/reg',validate.checkNotLogin,(req,res)=>{
    res.render('user/reg');
});
/**
 * 提交用户注册的表单
 */
router.post('/reg',validate.checkNotLogin,(req,res)=>{
    var user = req.body;
    user.password = md5(user.password);
    user.avatar = 'https://secure.gravatar.com/avatar/'+md5(user.email);
    userModel.findOne({
        username:user.username
    },(err,doc)=>{
        if(err){
            req.flash('error',err);
            res.redirect('back'); //返回到上一个页面
        }else if(doc){
            req.flash('error','该用户已被注册');
            res.redirect('back');
        }else {
            userModel.create(user,(err,doc)=>{
                if(err){
                    req.flash('error',err);

                    res.redirect('back'); //返回到上一个页面
                }else{
                    /**
                     * 把保存之后的用户放置到此用户会话的user属性上
                     */
                    req.session.user = doc;
                    console.log(doc);
                    /**
                     * 增加一个成功的提示
                     */
                    req.flash('success','注册成功');
                    res.redirect('/');
                }
            })
        }
    });

});

/**
 * 用户登录
 */
router.get('/login',validate.checkNotLogin,(req,res)=>{
    res.render('user/login');
});
/**
 * 提交用户登录的表单
 */
router.post('/login',validate.checkNotLogin,(req,res)=>{
    var user = req.body;
    user.password = md5(user.password);
    userModel.findOne(user,(err,doc)=>{
        if(err){
            req.flash('error',err);
            res.redirect('back'); //返回到上一个页面
        }else if(doc){
            req.session.user = doc;
            req.flash('success','你好：'+user.username);
            res.redirect('/');
        }else {
            req.flash('error','没有该用户');
            res.redirect('back'); //返回到上一个页面
        }
    });
});
/**
 * 退出
 */
router.get('/logout',validate.checkLogin,(req,res)=>{
    req.session.user = null;
    res.redirect('/');
});
module.exports = router;