$(function () {
    // 定义一个变量，表示添加的弹出层
    var addIndex;
    // 定义一个变量，表示编辑的弹出层
    var editIndex;
    // 加载layui的form模块
    var form = layui.form;
    // --------------  获取文章列表，并渲染 ------------
    renderCategory();
    function renderCategory() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status === 0) {
                    // 调用模板引擎 template 方法，渲染
                    $('tbody').html(template('tpl-list', res));
                }
            }
        });
    }

    // --------------  点击 添加类别 ，显示弹出层 -------
    $('#showAdd').click(function () {
        addIndex = layer.open({
            type: 1,
            title: '添加文章类别',
            content: $('#tpl-add').html(),
            area: ['500px', '250px']
        });
    });

    // --------------   实现添加类别  ----------------
    // 必须使用事件委托的方案，监听表单的提交事件
    $('body').on('submit', '#add-form', function (e) {
        e.preventDefault();
        // alert(123);
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(), // 当你使用serialize的时候，必须查看表单input的name
            success: function (res) {
                // 无论成功，还是失败，都给提示
                layer.msg(res.message);
                if (res.status === 0) {
                    // 添加成功，重新渲染列表
                    renderCategory();
                    // 关闭弹出层
                    layer.close(addIndex);
                }
            }
        });
    });

    // --------------  完成删除类别 ------------------
    $('body').on('click', '.delete', function () {
        // 获取id
        var id = $(this).attr('data-id');
        // 询问
        layer.confirm('确定不要我了吗？你好狠！', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    layer.msg(res.message);
                    if (res.status === 0) {
                        renderCategory();
                    }
                }
            });

            layer.close(index);
        });

    });



    // function Abc () {
    //     this.id = 2;
    //     this.name = '啦啦啦';
    //     this.alias = 'hahah';
    // }
    // var a = new Abc();
    // console.log(a);

    // --------------  点击编辑，显示弹层  -------------
    $('body').on('click', '.edit', function () {
        // 获取事件源上的三个自定义属性
        // var id = $(this).attr('data-id');
        // var name = $(this).attr('data-name');
        // var alias = $(this).attr('data-alias');

        // 可以使用 h5 提供的 dataset 属性，获取元素所有的 data-xxx 属性值
        var obj = this.dataset; // dataset是DOM属性，所以使用this
        // console.log(  JSON.parse(JSON.stringify(obj))  );
        // console.log(obj);
        
        // 下面是弹出层
        editIndex = layer.open({
            type: 1,
            title: '编辑文章类别',
            content: $('#tpl-edit').html(),
            area: ['500px', '250px'],
            // 表示弹层之后，做什么事情
            success: function () {
                // 为表单快速赋值
                form.val('abcd', JSON.parse(JSON.stringify(obj)));
            }
        });

        
    });

    // ---------------  实现编辑类别 -----------------
    // 事件委托的方案，为编辑的表单注册submit事件
    $('body').on('submit', '#edit-form', function (e) {
        e.preventDefault();
        // 
        // var data = $(this).serialize(); // id=1&name=xxx&alias=yyy
        var data = $(this).serializeArray(); // 得到一个数组，如果你希望修改值，那么操作更加简单
        // 把id换成Id
        data[0].name = 'Id';
        // console.log(data);
        // return;
        $.ajax({
            url: '/my/article/updatecate',
            type: 'POST',
            data: data,
            success: function (res) {
                layer.msg(res.message);
                // 关闭弹层
                layer.close(editIndex);
                if (res.status === 0) {
                    renderCategory();
                }
            }
        });
    })
});