/**
 * Created by Jesse on 17/5/26.
 */
/**
 * md5
 * 把任意一个长度的字节数组专程固定长度的字符串
 * 1.不同的输入一定会产生不同的输出
 * 2.输出的结果不能返推出输入的内容
 * 3.相同的输入一定会产生相同的输出
 **/

var crypto = require('crypto');
console.log(crypto.getHashes());
var s = crypto.createHash('md5').update('zjx').digest('hex');//hex十六进制