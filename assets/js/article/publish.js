$(function () {

    var form = layui.form;

    // --------------- 初始化富文本编辑器，可以正常使用了  ----
    initEditor();

    // --------------- 获取分类，并渲染出来 ----------------
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            if (res.status === 0) {
                // 使用模板引擎，把渲染的结果放到 下拉框里面
                $('select[name="cate_id"]').html(template('tpl-category', res));
                // 处理完数据，使用layui提供的办法，更新下拉框
                form.render('select');
            }
        }
    });


    // ----------------  处理封面 -----------------------
    // 显示默认的剪裁效果
    var $image = $('#image');
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    $image.cropper(options);


    // 点击 选择封面 可以选择图片
    $('#chooseImage').click(function () {
        $('#file').click();
    });

    // 文件域的内容改变的时候，重置剪裁区
    $('#file').change(function () {
        // 找到文件对象，为其创建url
        var url = URL.createObjectURL(this.files[0]);
        // 销毁剪裁区，更换图片，重建剪裁区
        $image.cropper('destroy').attr('src', url).cropper(options);
    });


    // ----------------  处理文章的状态 ------------------
    var state = '';
    $('#fabu').click(function () {
        state = '已发布';
    });
    $('#caogao').click(function () {
        state = '草稿';
    });

    // ----------------  实现发布文章 --------------------
    $('form').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中的数据
        var data = new FormData(this); // 传入表单的DOM对象，可以根据表单各项的name属性获取值

        // 发现，FormData 中没有状态和封面
        // 追加状态
        data.append('state', state);

        // console.log(data.get('title')); // 可以这样检查，FormData中是否有这一项数据
        // console.log(data.get('cate_id')); // 可以这样检查，FormData中是否有这一项数据
        // console.log(data.get('content')); // 可以这样检查，FormData中是否有这一项数据
        // console.log(data.get('cover_img')); // 可以这样检查，FormData中是否有这一项数据
        // console.log(data.get('state')); // 可以这样检查，FormData中是否有这一项数据

        // return;
        // 剪裁图片，并且把图片追加到 FormData 中
        $image.cropper('getCroppedCanvas', {
            height: 280,
            width: 400
        }).toBlob(function (blob) {
            // blob 就是剪裁后，转换后的二进制格式的图片
            data.append('cover_img', blob);

            // 至此，添加接口要求的5项请求参数，全部搞定。下面ajax提交即可
            $.ajax({
                type: 'POST',
                url: '/my/article/add',
                data: data, // jQuery默认会把这个对象转成 id=1&name=zs
                success: function (res) {
                    layer.msg(res.message);
                    // 添加成功了，跳转到文章列表页面
                    if (res.status === 0) {
                        location.href = '/article/article.html';
                    }
                },
                // 只要提交FormData数据，绝对不允许把对象转成字符串
                processData: false, // 告诉jQuery，不要把data转成字符串。
                contentType: false // jQuery默认会设置Content-Type: application/x-www-form-urlencoded，指定为false，告诉jQuery不要设置Content-Type
            });
        });
    })
})