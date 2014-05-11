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
            tag: '113',
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

KISSY.use('dom, node, pkg/modernizr, pkg/onepageScroll, io, gallery/HashX/1.0/index, promise', function(S, Dom, Node, Modernizr, OnepageScroll, IO, HashX, Promise) {
    var $ = Node.all;
    function AZ() {
        var me = this;

        me.init = function() {
            me.data = {};
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
        me.descInfo = me.descDiv.one('.info');
        me.descMoreBtn = me.descDiv.one('.more-btn');
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
        me.scroll = new OnepageScroll({
            "container": ".viewport",
            "sectionContainer": "section",
            "easing": "ease",
            "animationTime": 600,
            "pagination": true,
            "updateURL": false,
            "keyboard": true,
            "beforeMove": function(index){
                //判断在第几页，分别触发当前页面的下一步按钮
                if (index == 1 && !window.Highcharts) {
                    me.startBtn.fire('click');
                }
            },
            "afterMove": function(index){

            },
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
                me.scroll.moveDown();
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
        me.descMoreBtn.on('click', function() {
            
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
        var loada = false;
        var loadh = false;

        function initAV() {
            AV.initialize("blgx18bu3llnxjmstq0q528k7ogjwgqnlv3tm9b1926af47x", "zwdgquddmljlde2crhfztjk0csrzplv0x5wlk2odpgqmoh0u");

            var SendMessage = AV.Object.extend('main');
            var sendMessage = new SendMessage();
            
            var query = new AV.Query(SendMessage);
            query.containedIn('area', [city]);
            query.select('time','area','aqi','no','no2','o3','pm2_5','pm10','primary_pollutant','quality','so2');
            query.descending('time');
            query.limit(12);
            query.find().then(function(results) {
                renderChart(results);
            });

        }
        function renderChart(results) {
            // spinner.stop();
            if (!results) {
                //城市不对或者网络没数据
                console.log('城市不对或者网络没数据');
                return;
            }
            var data = me.data;
            var t;
            data.time=[];
            data.aqi=[];
            data.no=[];
            data.no2=[];
            data.o3=[];
            data.pm2_5=[];
            data.pm10=[];
            data.primary_pollutant=[];
            data.quality=[];
            data.so2=[];
            for (var i=results.length-1,l=0;i>=l;i--) {
                //时间处理 2014-04-25T13:00:00Z
                t = new Date(results[i].attributes.time).getHours();
                
                data.time.push(t);
                data.aqi.push(results[i].attributes.aqi);
                // no.push(results[i].attributes.no);
                data.no2.push(results[i].attributes.no2);
                data.o3.push(results[i].attributes.o3);
                data.pm2_5.push(results[i].attributes.pm2_5);
                data.pm10.push(results[i].attributes.pm10);
                data.primary_pollutant.push(results[i].attributes.primary_pollutant);
                data.quality.push(results[i].attributes.quality);
                data.so2.push(results[i].attributes.so2);
            }
            me.chart = new Highcharts.Chart({
                chart: {
                    animation: {
                        duration: 1500
                    },
                    backgroundColor: '#f3f3f3',
                    type: 'areaspline',
                    renderTo: $('#chart').getDOMNode()
                },
                title: {
                    text: '空气质量详情',
                    x: -20,
                    style: {
                        color: '#4b4b4b',
                        'font-family': 'Microsoft Yahei',
                        'font-size': '16px'
                    }
                },
                subtitle: {
                    text: 'Source: PM2.5in',
                    x: -20,
                    style: {
                        'font-size': '8px'
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: '0.2',
                        marker: {
                            radius: 2,
                            lineColor: '#666666',
                            lineWidth: 1,
                            enabled: false,
                            states: {
                                hover: {
                                    enabled: false
                                }
                            }
                        },
                        stickyTracking:true
                    }
                },
                xAxis: {
                    categories: data.time
                },
                yAxis: {
                    title: {
                        text: '数值',
                        style: {
                            color: '#999999',
                            'font-family': 'Microsoft Yahei'
                        }
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }],
                    min: 0,
                    // minRange: 300
                },
                tooltip: {
                    crosshairs: true,
                    shared: true,
                    useHTML: true,
                    //<small>时间：{point.key}</small>
                    headerFormat: '<table>',
                    pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
                    '<td style="text-align: right"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0,
                    itemHiddenStyle: {color: '#999999'},
                    itemHoverStyle: {color: '#ffffff'},
                    itemStyle: {
                        'padding-bottom': '10px',
                        'font-size': '14px',
                        'font-family': 'tohoma',
                        'font-weight': 'bold'
                    }
                },
                series: [{
                    name: 'AQI',
                    id: 'aqi',
                    data: data.aqi,
                    color: '#7f81e7'
                }, {
                    name: 'PM2.5',
                    id: 'pm2_5',
                    data: data.pm2_5,
                    color: '#e9de62'
                }, {
                    name: 'PM10',
                    id: 'pm10',
                    data: data.pm10,
                    color: '#d8dc9d'
                }, {
                    name: 'SO2',
                    id: 'so2',
                    data: data.so2,
                    color: '#e7907f'
                }, {
                    name: 'NO2',
                    id: 'no2',
                    data: data.no2,
                    color: '#addbdb'
                }, {
                    name: 'O3',
                    id: 'o3',
                    data: data.o3,
                    color: '#7fe7b0'
                }]
            }); 
            me.checkStandard();
        }
        S.getScript('./js/av-0.3.1.min.js', function() {
            if (loadh === true) {
                initAV();
                return;
            }
            loada = true;
        });
        S.getScript('src/highcharts.js', function() {
            if (loada === true) {
                initAV();
                return;
            }
            loadh = true;
        });

    };

/*
    _______________________________________________________
    
    根据我国标准判断空气质量《环境空气质量标准》（GB3095-2012）
    _______________________________________________________
    PM2.5  25    37.5    50    75
    PM10   50    75      100   150
    O3     100   160
    NO2    200
    SO2    20    50      125
*/ 

    AZ.prototype.checkStandard = function() {
        var result = {},
            me = this,
            data = me.data,
            infos;

        function haveInfo() {
            for (var i in result) {
                return true;
            }
            return false;
        }
        function renderInfo() {
            if (haveInfo()) {
                for (var i in result) {
                    infos = infos + result.i + '&nbsp';
                }
            } else {
                infos = '空气质量很好，没有任何超标数值';
            }
            
            me.descInfo.html(infos);
        }

        if (data.pm2_5[11] >= 75) {
            result.pm2_5 = 'PM2.5含量过高';
        } else if (data.pm2_5 >= 50) {
            result.pm2_5 = 'PM2.5含量偏高';
        } else if (data.pm2_5 >= 37.5) {
            result.pm2_5 = 'PM2.5含量偏高';
        } else if (data.pm2_5 >= 25) {
            result.pm2_5 = 'PM2.5含量略高';
        } 

        if (data.pm10[11] >= 150) {
            result.pm10 = 'PM10含量过高';
        } else if (data.pm10 >= 100) {
            result.pm10 = 'PM10含量偏高';
        } else if (data.pm10 >= 75) {
            result.pm10 = 'PM10含量偏高';
        } else if (data.pm10 >= 50) {
            result.pm10 = 'PM10含量略高';
        }

        if (data.o3[11] >= 160) {
            result.o3 = 'O3含量过高';
        } else if (data.o3 >= 100) {
            result.o3 = 'O3含量偏高';
        }

        if (data.no2[11] >= 200) {
            result.o3 = 'NO2含量过高';
        }

        if (data.so2[11] >= 125) {
            result.so2 = 'SO2含量过高';
        } else if (data.so2 >= 50) {
            result.so2 = 'SO2含量偏高';
        } else if (data.so2 >= 20) {
            result.so2 = 'SO2含量略高';
        }

        renderInfo();
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
        //     var target = $('body').getDOMNode();
        //     var spinner = new Spinner(opts).spin(target);

            
        // };


    KISSY.ready(function() {
        var az = new AZ();
        az.init();
    });
});