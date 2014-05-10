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

        },
        'onepageScroll':{
            // alias: ['node']
        }
    }
});
KISSY.ready(function (S) {

    S.use('dom, node, pkg/modernizr, pkg/onepageScroll, io, gallery/HashX/1.0/index', function(S, Dom, Node, Modernizr, OnepageScroll, IO, HashX) {
        var $ = Node.all;
        var tl = new TimelineLite();
        var title = $('.start .title');
        var subT = $('.start .subTitle');
        var btn = $('.start .start-btn');
        var Controller = {};
        var scorll = new OnepageScroll({
            "container": ".viewport",
            "sectionContainer": "section",
            "easing": "ease",
            "animationTime": 600,
            "pagination": true,
            "updateURL": false,
            "keyboard": true,
            "beforeMove": function(index){},
            "afterMove": function(index){},
            "loop": false
        });

        Controller.getChartData = function(city) {
            AV.initialize("blgx18bu3llnxjmstq0q528k7ogjwgqnlv3tm9b1926af47x", "zwdgquddmljlde2crhfztjk0csrzplv0x5wlk2odpgqmoh0u");

            var SendMessage = AV.Object.extend('main');
            var sendMessage = new SendMessage();
            
            var query = new AV.Query(SendMessage);
            query.containedIn('area', [city]);
            query.select('time','area','aqi','no','no2','o3','pm2_5','pm10','primary_pollutant','quality','so2');
            query.descending('time');
            query.limit(12);
            query.find().then(function(results) {
                if (!results) {
                    //城市不对或者网络没数据
                    console.log('城市不对或者网络没数据');
                }
                var t,times=[];
                for (var i=results.length-1,l=0;i>=l;i--) {
                    //时间处理 2014-04-25T13:00:00Z
                    t = results[i].attributes.pm2_5;
                    
                    times.push(t);
                }
                console.log(times);
            });
        };
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
        btn.on('click', function() {
            var ak = '9cwuN4BgCeu9MCMfGuGsKaGF';

            function getPosition(position) {
                var la = position.coords.latitude;
                var ln = position.coords.longitude;
                var urlForGeo = "http://api.map.baidu.com/geocoder/v2/";

                new IO({
                    dataType:'jsonp',
                    url: urlForGeo, 
                    data:{
                        'output': 'json',
                        'ak': ak,
                        'location': la + ',' + ln
                    },
                    success: function (data) {
                        if (data.status === 0) {
                            var ucity = data.result.addressComponent.province;
                            var city;

                            city = ucity.split('市')[0].split('省')[0];
                            setHash(city);
                        } else {
                            errorFunc();
                        }
                    }
                });
            }
            function errorFunc(err) {
                var urlForIp = 'http://api.map.baidu.com/location/ip';

                new IO({
                    url: urlForIp,
                    dataType: 'jsonp',
                    data: {
                        ak: ak
                    },
                    success: function(data) {
                        // address: "CN|北京|北京|None|UNICOM|0|None"
                        var city = data.address.split('|')[1];

                        setHash(city);
                    }
                });
            }
            function setHash(city) {
                var hashX = new HashX();

                hashX.hash('city', city);
                Controller.getChartData(city);
            }

            if(Modernizr.geolocation) {
                navigator.geolocation.getCurrentPosition(getPosition, errorFunc, {
                    enableHighAcuracy: false,
                    timeout: 1800
                });
            } else {
                errorFunc();
            }
        });
    });

});