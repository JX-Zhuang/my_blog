/**
 * Created by Jesse on 17/5/24.
 */
/**
 * 要求下面的路由必须登录后才能访问
 * @param req
 * @param res
 * @param next
 */
exports.checkLogin = function (req,res,next) {
    if(req.session.user){
        next();
    }else {
        req.flash('error','未登录');
        res.redirect('/users/login');
    }
};
/**
 * 要求下面的路由必须未登录后才能访问
 * @param req
 * @param res
 * @param next
 */
exports.checkNotLogin = function (req,res,next) {
    if(req.session.user){
        req.flash('error','已登录');
        res.redirect('/');
    }else {
        next();
    }
};