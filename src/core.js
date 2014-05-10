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

    KISSY.use('dom, node, pkg/modernizr, pkg/onepageScroll, io, gallery/HashX/1.0/index', function(S, Dom, Node, Modernizr, OnepageScroll, IO, HashX) {
        var $ = Node.all;
        function AZ() {
            var me = this;

            me.init = function() {
                me.objsCache();
                me.funcs();
            };
        }
/*
    _______________________________________________________
        
    Objects Cache - recycling is good.
    _______________________________________________________
        
*/
        AZ.prototype.objsCache = function() {
            var me = this;

            me.win = $(window);
            me.doc = $(document);
            me.body = $('body');

            me.loaderDiv = $('#loading');

            me.startDiv = $('.start');
            me.startBtn = me.startDiv.one('.start-btn');
            me.startTitle = me.startDiv.one('.title');
            me.startSubTitle = me.startDiv.one('.subTitle');

            me.descDiv = $('.desc');
        };

/*
    _______________________________________________________
    
    Animations
    _______________________________________________________
        
*/      

        AZ.prototype.animations = function() {
            var me = this;

            me.startAnime = function() {
                var tl = new TimelineLite();

                me.loaderDiv.hide();
                tl.to(me.startTitle.getDOMNode(), 0.6, {
                    'margin-left':'5px',
                    opacity: 1,
                    ease:Expo.easeInOut
                });
                tl.to(me.startSubTitle.getDOMNode(), 0.6, {
                    'margin-right':'5px',
                    opacity: 1,
                    ease:Expo.easeInOut
                });
                tl.to(me.startBtn.getDOMNode(), 1, {
                    opacity: 1,
                    ease:Expo.easeInOut
                });
                tl.play();
            };
        };

/*
    _______________________________________________________
    
    Functions to be initiated after main Class has loaded
    _______________________________________________________
        
*/
        AZ.prototype.funcs = function() {
            var me = this;

            me.body.css('height', Dom.viewportHeight());
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
            me.animations();
            me.startBtn.on('click', function() {
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
                    me.initChart(city);
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
            me.startAnime();
        };

/*
    _______________________________________________________
    
    向avos取得数据并绘制图表
    _______________________________________________________
        
*/ 

    AZ.prototype.initChart = function(city) {
        var me = this;

        AV.initialize("blgx18bu3llnxjmstq0q528k7ogjwgqnlv3tm9b1926af47x", "zwdgquddmljlde2crhfztjk0csrzplv0x5wlk2odpgqmoh0u");

        var SendMessage = AV.Object.extend('main');
        var sendMessage = new SendMessage();
        
        var query = new AV.Query(SendMessage);
        query.containedIn('area', [city]);
        query.select('time','area','aqi','no','no2','o3','pm2_5','pm10','primary_pollutant','quality','so2');
        query.descending('time');
        query.limit(12);
        query.find().then(function(results) {
            spinner.stop();
            if (!results) {
                //城市不对或者网络没数据
                console.log('城市不对或者网络没数据');
            }
            var t,times=[];
            for (var i=results.length-1,l=0;i>=l;i--) {
                //时间处理 2014-04-25T13:00:00Z
                t = new Date(results[i].attributes.time);
                
                times.push(t);
            }
            console.log(times);
        });
    };


        //只有菊花转了
        // Controller.getChartData = function(city) {
        //     var opts = {
        //       lines: 9, // The number of lines to draw
        //       length: 0, // The length of each line
        //       width: 30, // The line thickness
        //       radius: 30, // The radius of the inner circle
        //       corners: 1, // Corner roundness (0..1)
        //       rotate: 0, // The rotation offset
        //       direction: 1, // 1: clockwise, -1: counterclockwise
        //       color: '#000', // #rgb or #rrggbb or array of colors
        //       speed: 1.2, // Rounds per second
        //       trail: 80, // Afterglow percentage
        //       shadow: false, // Whether to render a shadow
        //       hwaccel: false, // Whether to use hardware acceleration
        //       className: 'spinner', // The CSS class to assign to the spinner
        //       zIndex: 2e9, // The z-index (defaults to 2000000000)
        //       top: '50%', // Top position relative to parent
        //       left: '50%' // Left position relative to parent
        //     };
        //     // $('#loading').show();
        //     var target = $('body').getDOMNode();
        //     var spinner = new Spinner(opts).spin(target);

            
        // };


        KISSY.ready(function() {
            var az = new AZ();
            az.init();
        });
    });