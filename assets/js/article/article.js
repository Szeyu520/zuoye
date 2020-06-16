$(function () {
    // 
    var form = layui.form;
    var laypage = layui.laypage;
    form.render('select');

    // ---------------   获取文章列表，渲染 --------------------
    // 定义获取文章列表的请求参数
    let data = {
        pagenum: 1, // 页码值，默认肯定获取第1页的数据
        pagesize: 3, // 每页显示多少条数据
        // cate_id: 
        // state: 
    };

    renderArticle();
    function renderArticle() {
        $.ajax({
            url: '/my/article/list',
            data: data,
            success: function (res) {
                if (res.status === 0) {
                    $('tbody').html(template('tpl-article', res));
                }
                // res.total;
                // 调用显示分页的函数，并传递总记录数
                mypage(res.total);
            }
        });
    }


    // -------------- 实现分页 --------------------------------
    function mypage (t) {
        laypage.render({
            elem: 'page', //注意，这里的 page 是 ID，不用加 # 号
            count: t, //数据总数，从服务端得到
            limit: data.pagesize, // 每页显示多少条
            limits: [data.pagesize, 8, 10, 15], // 下拉框，可以自己选择每页显示多少条
            curr: data.pagenum, // 页码，默认是1
            layout: ['limit', 'prev', 'page', 'next', 'skip', 'count'], // 自定义排版
            jump: function (obj, first) {
                // 页面刷新的时候first==true；后续切换页码的时候，first==undefined
                // console.log(first); 
                // obj是当前分页配置对象
                // console.log(obj);
                if (first === undefined) {
                    data.pagenum = obj.curr;
                    data.pagesize = obj.limit;
                    renderArticle();
                }
            }
        });
    }

    // -------------- ajax获取分类 ------------------------
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            // 模板和数据组合好的结果 = template('模板id', 数据);
            var str = template('tpl-category', res);
            $('#category').html(str);
            // 使用leyui的下拉菜单，需要更新渲染
            form.render('select');
        }
    });

    // -------------- 搜索功能 --------------
    // 监听搜索区表单的提交事件
    $('#search-form').on('submit', function (e) {
        e.preventDefault();
        // 获取下拉框的 值
        var cate_id = $('#category').val(); // 得到分类的id
        var state = $('select[name="state"]').val(); // 得到文章的状态
        // console.log(cate_id);
        // console.log(state);
        // 重置页码
        data.pagenum = 1;

        if (cate_id) {
            data.cate_id = cate_id;
        } else {
            delete data.cate_id; // delete 可以删除对象的属性
        }

        if (state) {
            data.state = state;
        } else {
            delete data.state;
        }

        renderArticle();
    })


    // -------------- 删除功能 ---------------------
    $('body').on('click', '.delete', function () {
        let id = $(this).attr('data-id');
        // 询问是否要删除
        layer.confirm('是否要删除？', function (index) {
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function (res) {
                    layer.msg(res.message);
                    if (res.status === 0) {
                        renderArticle();
                    }
                }
            });
            // 关闭弹层
            layer.close(index);
        });
    })

    // 定义模板引擎的过滤器函数
    // template.defaults.imports.自定义的函数名 = function (val) {
    //     // 形参 val 表示使用过滤器的值
    //     return '最终要显示的值'
    // }
    template.defaults.imports.formatDate = function (val) {
        var d = new Date(val);
        var year = d.getFullYear();
        var month = addZero(d.getMonth() + 1);
        var day = addZero(d.getDate());
        var hour = addZero(d.getHours());
        var minutes =addZero( d.getMinutes());
        var seconds = addZero(d.getSeconds());
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
    }

    // 补零函数
    function addZero (n) {
        return n < 10 ? '0' + n : n;
    }
});