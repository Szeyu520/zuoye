$(function () {
    // ---------------  实现基本的剪裁效果 ---------------
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');

    // 1.2 配置选项
    var options = {
        // 纵横比(宽高比)
        aspectRatio: 1,
        // 指定预览区域(填预览区的选择器)
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    // ---------------  点击 上传 -------------------
    $('#upload').click(function () {
        $('#file').click();
    });

    // ----------------  文件域改变，更换剪裁区的图片 -------
    $('#file').change(function () {
        // console.log(11);
        // 一、找到已选择的图片，并生成一个可访问的url
        // 1. 找到文件对象
        // this  ===>   $(this)   ===>   $(this)[0]
        var fileObj = this.files[0];
        // 2. 调用JS内置URL对象的createObjectURL方法，为文件对象创建一个临时的url，这个临时的url可以放到已选择的图片
        var url = URL.createObjectURL(fileObj);
        // console.log(url);

        // 二、更换剪裁区的图片
        // 1. 销毁剪切区
        // 2. 更换图片
        // 3. 重新生成剪裁区
        $image.cropper('destroy').attr('src', url).cropper(options);

    });

    // -------------  点击 确定 ，完成更换 ------------------
    $('#sure').click(function () {
        // 完成剪裁，并把剪裁后的图片，转成base64格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // ajax提交字符串，完成更新
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function (res) {
                layer.msg(res.message);
                // 更换头像成功，渲染父页面的头像
                if (res.status === 0) {
                    window.parent.getUserInfo();
                }
            }
        });
    });
})