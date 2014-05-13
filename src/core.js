KISSY.config({
    combine:true,
    tag: 'hahah',
    base:'http://g.tbcdn.cn/kissy/k/1.4.2/',
    packages:{
        pkg: {
            base:'./src/',
            tag: '2011',
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

KISSY.use('dom, node, pkg/modernizr, pkg/onepageScroll, io, gallery/HashX/1.0/index, promise, xtemplate, gallery/multiellipsis/1.0/index, gallery/kprogress/1.0/index', function(S, Dom, Node, Modernizr, OnepageScroll, IO, HashX, Promise, Xtemplate, mu, KProgress) {
    var $ = Node.all;
    function AZ() {
        var me = this;

        me.init = function() {
            me.data = {};
            me.click = (function() {
                if (S.UA.mobile) {
                    return 'tap';
                } else {
                    return 'click';
                }
            })();
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
        me.showCityDiv = $('.city');

        me.loaderDiv = $('#loading');

        me.startDiv = $('.start');
        me.startBtn = me.startDiv.one('.start-btn');
        me.startTitle = me.startDiv.one('.title');
        me.startSubTitle = me.startDiv.one('.subTitle');

        me.gas1 = $('.gas1');
        me.gas2 = $('.gas2');
        me.pipe1 = $('.pipe1');
        me.pipe2 = $('.pipe2');
        me.bubble1 = $('.bubble1');
        me.bubble2 = $('.bubble2');
        me.bubble3 = $('.bubble3');
        me.print = $('.transition .print');

        me.chartDiv = $('#chart');

        me.descDiv = $('.desc');
        me.descInfo = me.descDiv.one('.info');
        me.descMoreBtn = me.descDiv.one('.more-btn');
        me.input = $('#search');

        me.newsUL = $('.more .news-ul');
        me.valueUl = $('.more .value-ul');
        me.moreDiv = $('.more');
        me.face = me.moreDiv.one('.face');
        me.faceDesc = me.moreDiv.one('.face-desc');
        me.moreBtn = me.moreDiv.one('.more-btn');
        me.tipsUl = $('.tips .tips-u');
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
        me.transition = function() {
            var tl = new TimelineLite();

            function gas1() {
                TweenLite.to(me.gas1.getDOMNode(), 0.3, {
                    'top': '10px',
                    opacity: 0.5,
                    ease: Expo.easeInOut,
                    onComplete: function() {
                        TweenLite.to(me.gas1.getDOMNode(), 0.3, {
                            'top': '0px',
                            opacity: 1,
                            ease: Expo.easeInOut,
                            onComplete: function() {
                                gas1();
                            }
                        });
                    }
                });
            }
            function gas2() {
                TweenLite.to(me.gas2.getDOMNode(), 0.5, {
                    'top': '20px',
                    opacity: 0.7,
                    ease: Expo.easeInOut,
                    onComplete: function() {
                        TweenLite.to(me.gas2.getDOMNode(), 0.5, {
                            'top': '83px',
                            opacity: 1,
                            ease: Expo.easeInOut,
                            onComplete: function() {
                                gas2();
                            }
                        });
                    }
                });
            }
            function pipe1() {
                TweenLite.to(me.pipe1.getDOMNode(), 0.4, {
                    'top': '130px',
                    ease: Expo.easeInOut,
                    onComplete: function() {
                        TweenLite.to(me.pipe1.getDOMNode(), 0.3, {
                            'top': '139px',
                            ease: Expo.easeInOut,
                            onComplete: function() {
                                pipe1();
                            }
                        });
                    }
                });
            }
            function pipe2() {
                TweenLite.to(me.pipe2.getDOMNode(), 0.3, {
                    'top': '360px',
                    ease: Expo.easeInOut,
                    onComplete: function() {
                        TweenLite.to(me.pipe2.getDOMNode(), 0.4, {
                            'top': '353px',
                            ease: Expo.easeInOut,
                            onComplete: function() {
                                pipe2();
                            }
                        });
                    }
                });
            }
            function bubble1() {
                TweenLite.to(me.bubble1.getDOMNode(), 1, {
                    'top': '200px',
                    'left': '550px',
                    ease: Expo.easeInOut,
                    onComplete: function() {
                        me.bubble1.css('top', '262px');
                        me.bubble1.css('left', '509px');
                        bubble1();
                    }
                });
            }
            function bubble2() {
                TweenLite.to(me.bubble2.getDOMNode(), 0.8, {
                    'top': '200px',
                    'left': '500px',
                    ease: Expo.easeOut,
                    onComplete: function() {
                        me.bubble2.css('top', '261px');
                        me.bubble2.css('left', '540px');
                        bubble2();
                    }
                });
            }
            function bubble3() {
                TweenLite.to(me.bubble3.getDOMNode(), 1.2, {
                    'top': '200px',
                    'left': '500px',
                    ease: Expo.easeInOut,
                    onComplete: function() {
                        me.bubble3.css('top', '220px');
                        me.bubble3.css('left', '542px');
                        bubble3();
                    }
                });
            }

            gas1();
            gas2();
            pipe1();
            pipe2();
            bubble1();
            bubble2();
            bubble3();
        };
        me.printAnime = function() {
            $('.desc .main .main-m').css('margin-top', '-60%');
            TweenLite.to($('.desc .main .main-m').getDOMNode(), 3, {
                'margin-top': '124px'
            });
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
                    me.startBtn.fire(me.click);
                }
            },
            "afterMove": function(index){

            },
            "loop": false
        });
        me.animations();
        me.transition();
        me.startBtn.on(me.click, function() {
            var ak = '9cwuN4BgCeu9MCMfGuGsKaGF';
            me.scroll.moveDown(true);

            function getPosition(position) {
                var la = position.coords.latitude;
                var ln = position.coords.longitude;
                var urlForGeo = "http://api.map.baidu.com/geocoder/v2/";

                KProgress.start();
                KProgress.move();
                new IO({
                    dataType:'jsonp',
                    url: urlForGeo, 
                    data:{
                        'output': 'json',
                        'ak': ak,
                        'location': la + ',' + ln
                    },
                    success: function (data) {
                        KProgress.done();
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

                KProgress.start();
                KProgress.move();
                new IO({
                    url: urlForIp,
                    dataType: 'jsonp',
                    data: {
                        ak: ak
                    },
                    success: function(data) {
                        KProgress.done();
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
        
        me.print.on(me.click, function() {
            me.scroll.moveDown(true);
            me.printAnime();
        });
        me.descMoreBtn.on(me.click, function() {
            me.scroll.moveDown(true);
        });
        me.input.on('submit', function(e) {
            e.preventDefault();
            var city = me.input.one('input').val();
            var hashX = new HashX();

            hashX.hash('city', city);
            me.initChart(city);
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
            KProgress.start();
            KProgress.move();
            query.find().then(function(results) {
                KProgress.done();
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
            me.showCity();
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
            me.showNews();
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
    AQI    50    100     150   200    300
*/ 

    AZ.prototype.checkStandard = function() {
        var result = {},
            me = this,
            data = me.data,
            infos = '';

        function haveInfo() {
            for (var i in result) {
                return true;
            }
            return false;
        }
        function renderInfo() {
            var tipsTpl = '{{#each tips}}<li class="tip clearfix"><img src="{{img}}"><div class="solution"><p class="titile">{{titile}}</p><p class="desc">{{{desc}}}</p></div></li>{{/each}}';
            var aqi = me.data.aqi[11];
            var tpl = '{{#each rdata}}<li><span class="cricle" style="background-color:{{color}}"></span><span class="type">{{type}}</span><span class="dashed_line"></span><span class="value">{{value}}</span></li>{{/each}}';
            var rdata = {
                rdata: []
            };
            var tips = {
                tips: []
            };
            var o,to,html;
            var map = {
                pm2_5: '#e9de62',
                pm10: '#d8dc9d',
                o3: '#7fe7b0',
                no2: '#addbdb',
                so2: '#e7907f'
            };
            var nameMap = {
                pm2_5: 'PM2.5',
                pm10: 'PM10',
                o3: 'O3',
                no2: 'NO2',
                so2: 'SO2'
            };

            if (haveInfo()) {
                for (var i in result) {
                    o = {
                        color: map[i],
                        type: nameMap[i],
                        value: data[i][11]
                    };

                    rdata.rdata.push(o);
                    infos = infos + result[i] + '。';
                }

                html = new Xtemplate(tpl).render(rdata);
                me.valueUl.html(html);
            } else {
                infos = '空气质量很好，没有任何超标数值';
                me.valueUl.html('空气质量很好，没有任何超标数值');
            }
            
            if (aqi >= 300) {
                me.face.addClass('icon-confused');
                me.faceDesc.html('严重');
            } else if (aqi >= 200) {
                me.face.addClass('icon-sad');
                me.faceDesc.html('重度');
            } else if (aqi >= 150) {
                me.face.addClass('icon-wondering');
                me.faceDesc.html('中度');
            } else if (aqi >= 100) {
                me.face.addClass('icon-neutral');
                me.faceDesc.html('轻度');
            } else if (aqi >= 50) {
                me.face.addClass('icon-smiley');
                me.faceDesc.html('良');
            } else {
                me.face.addClass('icon-happy');
                me.faceDesc.html('优');
            }

            if (aqi >= 50 && aqi < 100) {
                //显示戴口罩
                tips.tips.push({
                    img: './azure_png/face.png',
                    titile: '佩戴口罩',
                    desc: '外出请佩戴口罩（<a href="http://meow2333.github.io" target="_blank">？如何挑选口罩</a>）'
                });

            } else if (aqi >= 100) {
                //+室内
                tips.tips.push({
                    img: './azure_png/face.png',
                    titile: '佩戴口罩',
                    desc: '外出请佩戴口罩（<a href="http://meow2333.github.io" target="_blank">？如何挑选口罩</a>）'
                });
                tips.tips.push({
                    img: './azure_png/house.png',
                    titile: '室内活动',
                    desc: '请尽量在室内活动，减少外出，同时关好门窗'
                });
            } else {
                //室外
                tips.tips.push({
                    img: './azure_png/house.png',
                    titile: '室外运动',
                    desc: '空气不错，可以尽情的室外活动'
                });
            }
            me.tipsUl.html(new Xtemplate(tipsTpl).render(tips));
            me.descInfo.html(infos);
        }

        if (data.pm2_5[11] >= 75) {
            result.pm2_5 = 'PM2.5含量过高';
        } else if (data.pm2_5[11] >= 50) {
            result.pm2_5 = 'PM2.5含量偏高';
        } else if (data.pm2_5[11] >= 37.5) {
            result.pm2_5 = 'PM2.5含量偏高';
        } else if (data.pm2_5[11] >= 25) {
            result.pm2_5 = 'PM2.5含量略高';
        } 

        if (data.pm10[11] >= 150) {
            result.pm10 = 'PM10含量过高';
        } else if (data.pm10[11] >= 100) {
            result.pm10 = 'PM10含量偏高';
        } else if (data.pm10[11] >= 75) {
            result.pm10 = 'PM10含量偏高';
        } else if (data.pm10[11] >= 50) {
            result.pm10 = 'PM10含量略高';
        }

        if (data.o3[11] >= 160) {
            result.o3 = 'O3含量过高';
        } else if (data.o3[11] >= 100) {
            result.o3 = 'O3含量偏高';
        }

        if (data.no2[11] >= 200) {
            result.o3 = 'NO2含量过高';
        }

        if (data.so2[11] >= 125) {
            result.so2 = 'SO2含量过高';
        } else if (data.so2[11] >= 50) {
            result.so2 = 'SO2含量偏高';
        } else if (data.so2[11] >= 20) {
            result.so2 = 'SO2含量略高';
        }

        renderInfo();
    };

/*
    _______________________________________________________
    
    根据hash取得当前的地理定位
    _______________________________________________________
        
*/

    AZ.prototype.showCity = function() {
        var hashX = new HashX();
        var city = hashX.hash('city');

        this.showCityDiv.html(city);

        return city;
    };

/*
    _______________________________________________________
    
    从后台调新闻
    _______________________________________________________
        
*/

    AZ.prototype.showNews = function() {
        var me = this;

        function initAV () {
            AV.initialize("blgx18bu3llnxjmstq0q528k7ogjwgqnlv3tm9b1926af47x", "zwdgquddmljlde2crhfztjk0csrzplv0x5wlk2odpgqmoh0u");

            var SendMessage = AV.Object.extend('article');
            var sendMessage = new SendMessage();
            
            var query = new AV.Query(SendMessage);
            query.select('content','updatedAt','objectId');
            query.descending('createdAt');
            query.limit(3);
            KProgress.start();
            KProgress.move();
            query.find().then(function(results) {
                KProgress.done();
                renderNews(results);
            });
        }
        function renderNews(results) {
            var data = {
                    data: []
                },
                o,
                html,
                y,m,d;
            var tpl = '{{#each data}}<li><a href="http://meow2333.github.io/article/{{objectId}}" target="_blank"><p class="time">{{time}}</p><div class="content">'+'{{{content}}}'+'</div></a></li>{{/each}}';

            for (var i=0,l=results.length;i<l;i++) {
                y = results[i].createdAt.getFullYear();
                m = + results[i].createdAt.getMonth() + 1;
                d = results[i].createdAt.getDate();

                o = {
                    objectId: results[i].id,
                    time: y + '.' + m + '.' + d,
                    content: results[i].attributes.content
                };
                data.data.push(o);
            }

            html = new Xtemplate(tpl).render(data);
            me.newsUL.html(html);
            mu('.news-ul li', {
                child: '.content'
            });
        }
        initAV();
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

/*
    _______________________________________________________
    
    入口
    _______________________________________________________
        
*/

    KISSY.ready(function() {
        var az = new AZ();
        az.init();
    });
});