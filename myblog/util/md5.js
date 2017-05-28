/**
 * Created by Jesse on 17/5/26.
 */
var crypto = require('crypto');
module.exports = function (str) {
    return crypto.createHash('md5').update(str).digest('hex');//hex十六进制
};