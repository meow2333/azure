$(document).ready(function(){
    AV.initialize("blgx18bu3llnxjmstq0q528k7ogjwgqnlv3tm9b1926af47x", "zwdgquddmljlde2crhfztjk0csrzplv0x5wlk2odpgqmoh0u");
    var chart;
    var Controller = {
        config: {},
        method: {},
        states: {
            singleShow: false
        }
    };

    //render
    var renderChart = function (results) {
        var time_point = [];
        var aqi = [];
        var pm2_5 = [];
        var pm10 = [];
        var co = [];
        var o3 = [];
        var no2 = [];
        var so2 = [];
        var primary_pollutant = [];
        var quality = [];
        var map = ['aqi','co','no2','o3','pm2_5','pm10','primary_pollutant','quality','so2'];
        var t;

        for (var i=results.length-1,l=0;i>=l;i--) {
            //时间处理 2014-04-25T13:00:00Z
            t = results[i].attributes.time_point.split('T')[1];
            t = t.split(':')[0];
            if (t == '00') {
                t = results[i].attributes.time_point.split('T')[0];
                t = t.split('-')[2] + '日';
            }
            time_point.push(t);
            //如果有容错
            aqi.push(results[i].attributes.aqi);
            co.push(results[i].attributes.co);
            no2.push(results[i].attributes.no2);
            o3.push(results[i].attributes.o3);
            pm2_5.push(results[i].attributes.pm2_5);
            pm10.push(results[i].attributes.pm10);
            primary_pollutant.push(results[i].attributes.primary_pollutant);
            quality.push(results[i].attributes.quality);
            so2.push(results[i].attributes.so2);
        }

        $('#pm25-value').html(pm2_5[pm2_5.length-1]);

        $(function () {
            $('#pm25-charts').highcharts({
                chart: {
                    animation: {
                        duration: 1500
                    },
                    backgroundColor: '#efece2',
                    type: 'spline'
                },
                title: {
                    text: 'Air Quality Information',
                    x: -20,
                    style: {
                        color: '#999999',
                        'font-family': 'Microsoft Yahei'
                    }
                },
                subtitle: {
                    text: 'Source: PM2.5in',
                    x: -20
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    spline: {
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
                    categories: time_point
                },
                yAxis: {
                    title: {
                        text: 'Value',
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
                    minRange: 300
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
                    data: aqi,
                    color: '#7f81e7'
                }, {
                    name: 'PM2.5',
                    id: 'pm2_5',
                    data: pm2_5,
                    color: '#e9de62'
                }, {
                    name: 'PM10',
                    id: 'pm10',
                    data: pm10,
                    color: '#d8dc9d'
                }, {
                    name: 'SO2',
                    id: 'so2',
                    data: so2,
                    color: '#e7907f'
                }, {
                    name: 'NO2',
                    id: 'no2',
                    data: no2,
                    color: '#addbdb'
                }, {
                    name: 'O3',
                    id: 'o3',
                    data: o3,
                    color: '#7fe7b0'
                }]
            });
        });
    }

    //getdata
    ;(function() {
        var SendMessage = AV.Object.extend("azure_" + 'aqi');
        var sendMessage = new SendMessage();
   
        var query = new AV.Query(SendMessage);
        query.select("time_point",'aqi','co','no2','o3','pm2_5','pm10','primary_pollutant','quality','so2');
        query.descending('createdAt');
        query.limit(12);
        query.find().then(function(results) {
            renderChart(results)
        });
    })()
    //getInfos
    ;(function() {
        var SendMessage = AV.Object.extend('Infos');
        var sendMessage = new SendMessage();
   
        var query = new AV.Query(SendMessage);
        query.select('info', 'forecast');
        query.descending('createdAt');
        query.limit(1);
        query.find().then(function(results) {
            var info = results[0].attributes.info;
            var forecast = results[0].attributes.forecast;

            $('#info').html(info);
            $('#forecast').html(forecast);
            console.log(forecast)
        });
    })()
    //getWeather
    ;(function() {
        var url = 'http://api.openweathermap.org/data/2.5/weather';
        $.ajax({
            type: 'get',
            dataType: 'jsonp',
            url: url,
            data: {
                q: 'Beijing',
                lang: 'zh_cn',
                units: 'metric'
            },
            success: function(data) {
                var temp = data.main.temp;
             var icon = $('#w-icon');
                function setIcon() {
                    var id = data.weather[0].id;

                    if (id >= 200 && id < 300) {
                        //thunderstorm
                     icon.html('&#xf020b;');
                        return;
                    }
                    if (id >= 300 && id < 400) {
                        //drizzle
                     icon.html('&#xf020a;');
                        return;
                    }
                    if (id >= 500 && id < 600) {
                        //rain
                     icon.html('&#xf0209;');
                        return;
                    }
                    if (id >= 600 && id < 700) {
                        //snow
                        icon.html('&#xf0276;');
                        return;
                    }

                    if (id >= 700 && id < 800) {
                        //atmosphere
                        icon.html('&#xf0208;');
                        return;
                    }
                    if (id >= 800 && id < 900) {
                        //clouds
                        if (id == 800) {
                            icon.html('&#xf0205;');
                            return;
                        }
                        icon.html('&#xf0206;');
                        return;
                    }
                    if (id >= 900 && id < 1000) {
                        //extreme&additional
                        icon.html('&#xf0205;');
                        return;
                    }
                }
                setIcon();
                $('#render-temp').html(temp);
            }
        });
    })()
    //业务代码
    ;(function() {
        //图标切换
        $('#toggle-charts').on('change', function() {
            var chart = Highcharts.charts[0];
            var map = ['aqi', 'no2', 'o3', 'pm10', 'so2'];

            if (!Controller.states.singleShow) {
                for (var i=0;i<map.length;i++) {
                    chart.get(map[i]).hide();
                }
                Controller.states.singleShow = true;
            } else {
                for (var i=0;i<map.length;i++) {
                    chart.get(map[i]).show();
                }
                Controller.states.singleShow = false;
            }
            chart.exportChart();
        })
        $('.switch').css('height', $(window).height())

    })()
});
