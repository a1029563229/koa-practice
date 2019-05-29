/**
 *
 * @Exm Model
 * Qiniu文件上传
 * @Dmr
 * @DateTime  Mon Jul 02 2018 16:48:06 GMT+0800 (中国标准时间)
 * @Param
 *
 *      {
 *          bucket          :    // 七牛空间名
 *          filePath        :    // 文件路径
 *          access_key      :    // 七牛的accessKey
 *          secret_key      :    // 七牛的secretKey
 *          qiniuFileName   :    // 上传到服务器上的文件名
 *      }
 */


var qiniu = require("qiniu");
const keys = require("./keys");

module.exports = function (options) {

    if (!options.qiniuFileName) {
        console.log('请设置文件名!');
        return false;
    }

    //默认参数
    options = Object.assign({
        bucket: keys.bucket,
        filePath: keys.filePath,
        qiniuFileName: ''
    }, options);


    const accessKey = keys.access_key
    const secretKey = keys.secret_key

    //生成一个上传的凭证
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

    //设置七牛的上传空间
    const putPolicy = new qiniu.rs.PutPolicy({
        scope: options.bucket,
        returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    });

    //生成上传的Token
    const uploadToken = putPolicy.uploadToken(mac)

    //实例化config
    const config = new qiniu.conf.Config()

    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z0

    const localFile = options.filePath
    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()

    // 文件上传
    return new Promise((resolved, reject) => {
        formUploader.putFile(uploadToken, options.qiniuFileName, localFile, putExtra, function (respErr, respBody, respInfo) {
            if (respErr) {
                reject(respErr)
            }
            if (respInfo.statusCode == 200) {
                resolved(respBody)
            } else {
                resolved(respBody)
            }
        })
    })

}