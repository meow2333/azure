KISSY.config({
    combine:true,
    // kissy 库内置模块的时间戳
    // kissy 的基准路径
    tag: '11112',
    base:'http://g.tbcdn.cn/kissy/k/1.4.2/',
    packages:{
        pkg: {
            // x 包的基准路径
            base:'./src/',
            tag: '1123',
            // 开启 x 包 debug 模式
            combine: false,
            debug:true
        }
    },
    modules:{
        "pkg/modernizr":{

        }
    }
});
KISSY.ready(function (S) {

    S.use('dom, node, pkg/modernizr ', function(S, Dom, Node, Modernizr, Highcharts) {
        var $ = Node.all;
        var tl = new TimelineLite();
        var title = $('.start .title');
        var subT = $('.start .subTitle');
        var btn = $('.start .start-btn');

        tl.to(title.getDOMNode(), 0.6, {
            'margin-left':'5px',
            opacity: 1,
            ease:Expo.easeInOut
        });
        tl.to(subT.getDOMNode(), 0.6, {
            'margin-right':'5px',
            opacity: 1,
            ease:Expo.easeInOut
        });
        tl.to(btn.getDOMNode(), 1, {
            opacity: 1,
            ease:Expo.easeInOut
        });
        tl.play();
        $('body').css('height', Dom.viewportHeight());

    });

});