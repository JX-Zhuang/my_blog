/**
 * Created by Jesse on 17/5/22.
 */
var mongoose = require('mongoose');
// var db = mongoose.connect('mongodb://127.0.0.1:27017/myblog');
/**
 * 定义模型 确定数据库里表结构
 * @type {mongoose.Schema}
 */
var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    avatar:String
});
/**
 * 再定义model
 */
var userModel = mongoose.model('user',userSchema);

module.exports = userModel;