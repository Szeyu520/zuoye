// 其他各个html页面都要引入的js文件。
// common.js文件是项目统一的配置文件

// 判断token是否存在，如果不存在，跳转到登录页
if (!localStorage.getItem('token')) {
    location.href = './login.html';
}

$(function () {
    // 
    $.ajaxPrefilter(function (options) {
        // options就是ajax请求选项，是一个对象形式
        // console.log(options);
        // 配置url
        // options.url = 'http://localhost:3007' + options.url;
        options.url = 'http://btapi.ehomespace.com' + options.url;
        // 配置headers
        options.headers = {
            Authorization: localStorage.getItem('token')
        };
        options.beforeSend =function () {
            // 请求之前做什么
            NProgress.start(); // 注意NP大写
        },
        options.complete = function (xhr) {
            // 请求响应过程，完成之后做什么
            NProgress.done();
            // console.log(xhr); // 输入看到，xhr.responseJSON 里面有服务器的返回结果
            // 每次ajax请求完成，判断 status 和 message，判断一下，是否是身份认证失败
            if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                // 说明客户端使用了假token，或者是过期的token
                localStorage.removeItem('token');
                location.href = '/login.html';
            }
        }
    });
});