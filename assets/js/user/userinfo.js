$(function () {
    var form = layui.form;
    // 发送ajax请求，获取用户新，设置输入框的默认值（为表单赋值）
    function renderForm() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                // 为表单赋值
                // $('input[name="username"]').val(res.data.username);
                // $('input[name="nickname"]').val(res.data.nickname);
                // $('input[name="email"]').val(res.data.email);
                form.val('abc', res.data);
                /**
                 * form.val() 使用注意事项
                 * - abc 是 表单的 lay-filter属性值
                 * - res.data 是一个对象，并且要求对象的 key 要和 input的name属性值一样才行
                 */
            }
        });
    }

    renderForm();


    // 监听表单的提交事件，完成更新。
    $('form').on('submit', function (e) {

        // 阻止默认行为
        e.preventDefault();
        // 获取id、nickname、email的值
        var data = $(this).serialize();
        // console.log(data);
        // ajax提交给接口，从而完成更新
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: data,
            success: function (res) {
                // 无论成功还是失败，都要提示
                layer.msg(res.message);
                if (res.status === 0) {
                    window.parent.getUserInfo();
                }
            }
        });
    });


    // 重置
    $('button[type="reset"]').on('click', function (e) {
        // console.log(123);
        e.preventDefault();
        renderForm();
    });
});