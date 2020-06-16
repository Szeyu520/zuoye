$(function () {
    //  表单验证
    var form = layui.form;

    // 自定义验证规则
    form.verify({
        // 键（验证规则）: 值（验证方法，可以是数组、也可以是函数）

        // 验证长度6~12位，不能出现空格
        len: [/^\w{6,12}$/, '长度必须是6~12位，且不能出现空格'],
        // 新密码和旧密码不能一样
        diff: function (val) {
            // val 表示使用该验证规则的输入框的值
            // 该验证规则，被新密码使用了。所以val表示新密码
            // 获取原密码
            var oldPwd = $('input[name="oldPwd"]').val();
            if (val === oldPwd) {
                return '新密码不能和原密码一致';
            }
        },
        // 新密码和重复密码要一致
        same: function (value) {
            // 重复密码使用了该验证规则，所以value表示重复密码
            // 获取新密码
            var newPwd = $('input[name="newPwd"]').val();
            if (newPwd !== value) {
                return '两次密码不一致';
            }
        }
    });


    // ajax请求，完成更新
    $('form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                layer.msg(res.message);
                // 更新成功，重置输入框
                if (res.status === 0) {
                    // reset是dom方法，所以要加 [0] 把jQuery对象转成dom对象
                    $('form')[0].reset();
                }
            }
        });
    });
})