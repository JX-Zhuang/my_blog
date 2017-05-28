/**
 * Created by Jesse on 17/5/24.
 */
var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    title:String,
    content:String,
    img:String,
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},    //类型是主键类型，引用模型是user
    createAt:{type:Date,default:Date.now}
});

var articleModel = mongoose.model('articles',articleSchema);

module.exports = articleModel;