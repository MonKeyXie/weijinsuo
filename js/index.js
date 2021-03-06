$(function() {
   /*动态轮播图 */
   banner();
   /*移动端页签 不换行 可滑动*/
   initMoblieTab();
   /*初始化 工具提示 */
   $('[data-toggle="tooltip"]').tooltip()
});

var banner = function() {
    /* 轮播图 */
    // 1.获取轮播图数据 ajax
    // 2.根据数据动态渲染 根据当前设备 屏幕宽度判断
    // 2.1 准备数据 
    // 2.1 把数据转化成html格式的字符串 （动态创建元素/字符串拼接/模板引擎 【artTemplate】）
    // 2.3 把字符渲染到页面中 html
    // 3.测试功能 监听页面尺寸发生改变 重新渲染
    // 4.移动端手势切换(非滑动) touch

    /*ui框架：bootstrap,妹子UI,jQueryUI,easyUI,jQueryMobile,mui,framework7 */
    // 关于移动端的UI框架：bootstrap，jQueryMobile，mui,framework7 
    // 模板引擎： artTemplate，handle把人生，mustache，BaiduTemplate，velocity，underscore
    
    /*做数据缓存(拿数据，有直接执行callback没有Ajax取到再执行callback) */
    var getData = function (callback) {
        if(window.data){
            callback && callback(window.data);
        }else{
            /*1.获取轮播图数据 ajax*/
            $.ajax({
                type:'get',
                url:'js/data.json',
                // 强制转换后台返回的数据为json对象
                // 强制转换不成功程序报错，不会执行sucess，执行error回调
                dataType:'json',
                data:'',
                success:function (data) {
                    window.data = data;
                    callback && callback(window.data);
                },
                error:function() {
                    console.log("false")
                }
            });
        }

    };

    var render = function () {
        getData(function (data){
            /*2.根据数据动态渲染 根据当前设备 屏幕宽度判断*/
            var isMobile = $(window).width() < 768;
            /*2.1 准备数据 */
            /*2.1 把数据转化成html格式的字符串 （动态创建元素/字符串拼接/模板引擎 【artTemplate】） */
            // 使用模板引擎：哪些HTML静态要变成动态
            // 发现： 点容器  图片容器 新建模板
            // 开始使用模板引擎(需要传对象)
            // <% console.log(list) 模板引擎类不可使用外部变量 %>
            var pointHtml = template('pointTemplate',{list:data}); //需传入对象
            var imageHtml = template('imageTemplate',{list:data,isM:isMobile});
            /*2.3 把字符渲染到页面中 */
            $('.carousel-indicators').html(pointHtml);
            $('.carousel-inner').html(imageHtml);
        });
    };

    /*3.测试功能 监听页面尺寸发生改变 重新渲染 */
    $(window).on('resize',function () {
        render();
    }).trigger('resize');  //通过JS主动触发某个事件(resize为页面尺寸改变事件)

    /*4.移动端手势切换(非滑动) touch */
    var startX = 0;
    var distanceX = 0;
    var isMove = false;
    $('.carousel').on('touchstart', function(e) {
        startX = e.originalEvent.touches[0].clientX;
    }).on('touchmove', function(e) {
        isMove = true;
        var MoveX = e.originalEvent.touches[0].clientX;
        distanceX = MoveX - startX;
    }).on('touchend', function(e) {
        // 距离足够 50px 一定要滑动过
        if( isMove && Math.abs(distanceX) > 50 ){
            // 右滑动,上一张
            if(distanceX < 0){
                $('.carousel').carousel('next')   
            }else{ //左滑动
                $('.carousel').carousel('prev')
            }
        }
        stratX = 0;
        distanceX = 0;
        isMove = false;
    })
};

var initMoblieTab = function () {
    /*1.解决换行问题 */
    var $navTabs = $('.wjs_product .nav-tabs');
    var width = 0;
    $navTabs.find('li').each(function(i, item) {
        var $currLi  = $(this);
        var liWidth = $currLi.outerWidth(true);
        width += liWidth;
    });
    $navTabs.width(width);

    /*2.修改结构使之区域滑动的结构 */
    // 加一个父容器给 nav-tabs 叫 nav-tabs-parent 

    /*3.自己实现滑动效果 或者 使用iSCroll */
    new IScroll($('.nav-tabs-parent ')[0],{
        scrollX: true,
        scrollY: false,
        click:true
    })
}
