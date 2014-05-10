KISSY.add('pkg/onepageScroll',function (S, Node, Base) {
    var EMPTY = '';
    var $ = Node.all,
        el,
        sections,
        total = 0,
        status = "off",
        topPos = 0,
        lastAnimation = 0,
        quietPeriod = 500,
        paginationList = "";

    /**
     * 
     * @class onepageScroll
     * @constructor
     * @extends Base
     */
    function onepageScroll(comConfig) {
        var self = this;
        //调用父类构造函数
        onepageScroll.superclass.constructor.call(self, comConfig);
        self.init();
    }
    S.extend(onepageScroll, Base, /** @lends onepageScroll.prototype*/{

        init: function() {
            var self = this,
                $el = this.get("container"),
                sectionName = this.get("sectionContainer"),
                $sections = $(sectionName),
                pagination = this.get("pagination"),
                updateURL = this.get("updateURL"),
                keyboard = this.get("keyboard");

            if (!$el) {
                return;
            }
            el = $el;
            sections = $sections;
            total = sections.length;

            el.addClass("onepage-wrapper").css("position", "relative");
            S.each(sections, function(section, i) {
                $(section).css({
                    position: "absolute",
                    top: topPos + "%"
                }).addClass("section").attr("data-index", i+1);
                topPos = topPos + 100;
                if (pagination) {
                    paginationList += "<li><a data-index='" + (i+1) + "' href='#" + (i+1) + "'></a></li>";
                }
            });

            this.swipeEvents().on("swipeDown", function() {
                .moveUp();
            }).on("swipeUp", function() {
                this.moveDown();
            });

            if (pagination) {
                $("<ul class='onepage-pagination'>" + paginationList + "</ul>").prependTo("body");
                var posTop = (el.all(".onepage-pagination").height()/2) * -1;
                el.all(".onepage-pagintaion").css("margin-top", posTop+"px");
            }

            if (window.location.hash != "" && window.location.hash != "#1") {
                var init_index = window.location.hash.replace("#", "");
                $(sectionName+"[data-index='"+init_index+"']").addClass("active");
                $("body").addClass("viewing-page-"+init_index);
                if (pagination) {
                    $(".onepage-pagination li a"+"[data-index='"+init_index+"']").addClass("active");
                }

                var pos = ((init_index - 1) * 100) * -1;
                this.transformPage(pos, init_index);
            } else {
                $(sectionName+"[data-index='1']").addClass("active");
                $("body").addClass("viewing-page-1");
                if (pagination) {
                    $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
                }
            }

            if (pagination) {
                $(".onepage-pagination li a").on("click", function(e) {
                    var $this = $(e.target),
                        page_index = $this.attr("data-index");
                    if (!$this.hasClass("active")) {
                        var current = $(sectionName+".active"),
                            next = $(sectionName+"[data-index='"+(page_index)+"']");
                        if (next) {
                            current.removeClass("active");
                            next.addClass("active");
                            $(".onepage-pagination li a"+".active").removeClass("active");
                            $(".onepage-pagination li a"+"[data-index='" + (page_index) + "']").addClass("active");
                            $("body")[0].className = $("body")[0].className.replace("/\bviewing-page-\d.*?\b/g", '');
                            $("body").addClass("viewing-page-"+next.attr("data-index"));
                        }
                        var pos = ((page_index - 1) * 100) * -1;
                        self.transformPage(pos, page_index);
                    }
                    if (!updateURL) {
                        return false;
                    }
                });
            }

            $(document).on("mousewheel DOMMouseScroll", function(event) {
                event.preventDefault();
                var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
                self._init_scroll(event, delta);
            });

            if (keyboard) {
                $(document).on("keydown", function(e) {
                    var tag = e.target.tagName.toLowerCase();
                    switch(e.which) {
                        case 38:
                            if (tag != 'input' && tag != "textarea") {
                                self.moveUp();
                            }
                            break;
                        case 40:
                            if (tag != 'input' && tag != "textarea") {
                                self.moveDown();
                            }
                            break;
                        default:
                            return;
                    }
                    e.preventDefault();
                });
            }
            return false;
        },

        swipeEvents: function() {

            return el.each(function(element) {
                var startX,
                    startY,
                    $this = $(element);

                $this.on("touchstart", touchstart);

                function touchstart(event) {
                    var touches = event.originalEvent.touches;
                    if (touches && touches.length) {
                        startX = touches[0].pageX;
                        startY = touches[0].pageY;
                        $this.on("touchmove", touchmove);
                    }
                    event.preventDefault();
                }

                function touchmove(event) {
                    var touches = event.originalEvent.touches;
                    if (touches && touches.length) {
                        var deltaX = startX - touches[0].pageX,
                            deltaY = startY - touches[0].pageY;

                        if (deltaX >= 50) {
                            $this.fire("swipeLeft");
                        }
                        if (deltaX <= -50) {
                            $this.fire("swipeRight");
                        }
                        if (deltaY >= 50) {
                            $this.fire("swipeUp");
                        }
                        if (deltaY <= -50) {
                            $this.fire("swipeDown");
                        }
                        if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
                            $this.detach("touchmove", touchmove);
                        }
                    }
                    event.preventDefault();
                }
            });
        },

        transformPage: function(pos, index) {
            var animationTime = this.get("animationTime"),
                easing = this.get("easing"),
                afterMove = this.get("afterMove");

            $(el).css({
                "-webkit-transform": "translate3d(0, " + pos + "%, 0)",
                "-webkit-transition": "all " + animationTime + "ms " + easing,
                "-moz-transform": "translate3d(0, " + pos + "%, 0)",
                "-moz-transition": "all " + animationTime + "ms " + easing,
                "-ms-transform": "translate3d(0, " + pos + "%, 0)",
                "-ms-transition": "all " + animationTime + "ms " + easing,
                "transform": "translate3d(0, " + pos + "%, 0)",
                "transition": "all " + animationTime + "ms " + easing
            });
            $(el).on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
                if (S.isFunction(afterMove)) {
                    afterMove(index);
                    $(el).detach("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");
                }
            });
        },

        moveDown: function() {
            var sectionContainer = this.get("sectionContainer"),
                loop = this.get("loop"),
                beforeMove = this.get("beforeMove"),
                pagination = this.get("pagination"),
                updateURL = this.get("updateURL"),
                index = parseInt($(sectionContainer+".active").attr("data-index")),
                current = $(sectionContainer+"[data-index='"+index+"']"),
                next = $(sectionContainer+"[data-index='"+(index+1)+"']"),
                pos;

            if (next.length < 1) {
                if (loop == true) {
                    pos = 0;
                    next = $(sectionContainer+"[data-index='1']");
                } else {
                    return;
                }
            }else {
                pos = (index * 100) * -1;
            }

            if (S.isFunction(beforeMove)) {
                beforeMove(current.attr("data-index"));
            }
            current.removeClass("active");
            next.addClass("active");
            if (pagination == true) {
                $(".onepage-pagination li a" + "[data-index='"+index+"']").removeClass("active");
                $(".onepage-pagination li a" + "[data-index='"+next.attr("data-index")+"']").addClass("active");
            }

            $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
            $("body").addClass("viewing-page-"+next.attr("data-index"));

            if (history.replaceState && updateURL == true) {
                var href = window.location.href.substr(0, window.location.href.indexOf("#")) + "#" + (index+1);
                history.pushState({}, document.title, href);
            }
            this.transformPage(pos, index);
        },

        moveUp: function() {
            var sectionContainer = this.get("sectionContainer"),
                loop = this.get("loop"),
                beforeMove = this.get("beforeMove"),
                pagination = this.get("pagination"),
                updateURL = this.get("updateURL"),
                index = parseInt($(sectionContainer+".active").attr("data-index")),
                current = $(sectionContainer+"[data-index='"+index+"']"),
                next = $(sectionContainer+"[data-index='"+(index-1)+"']"),
                pos;

            if (next.length < 1) {
                if (loop == true) {
                    pos = ((total - 1) * 100) * -1;
                    next = $(sectionContainer+"[data-index='"+total+"']");
                } else {
                    return;
                }
            }else {
                pos = ((next.attr("data-index") - 1) * 100) * -1;
            }

            if (S.isFunction(beforeMove)) {
                beforeMove(current.attr("data-index"));
            }
            current.removeClass("active");
            next.addClass("active");
            if (pagination == true) {
                $(".onepage-pagination li a" + "[data-index='"+index+"']").removeClass("active");
                $(".onepage-pagination li a" + "[data-index='"+next.attr("data-index")+"']").addClass("active");
            }

            $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
            $("body").addClass("viewing-page-"+next.attr("data-index"));

            if (history.replaceState && updateURL == true) {
                var href = window.location.href.substr(0, window.location.href.indexOf("#")) + "#" + (index-1);
                history.pushState({}, document.title, href);
            }
            this.transformPage(pos, index);
        },

        _init_scroll: function(event, delta) {
            var timeNow = +new Date(),
                animationTime = this.get("animationTime");

            if (timeNow - lastAnimation < quietPeriod + animationTime) {
                event.preventDefault();
                return;
            }

            if (delta < 0) {
                this.moveDown();
            } else {
                this.moveUp();
            }
            lastAnimation = timeNow;
        }

    }, {
        ATTRS : /** @lends KOnepageScroll*/{
            container: {
                value: '',
                setter: function(el) {
                    return $(el);
                }
            },
            sectionContainer: {
                value: 'section'
            },
            easing: {
                value: 'ease'
            },
            animationTime: {
                value: 1000
            },
            pagination: {
                value: true
            },
            updateURL: {
                value: false
            },
            keyboard: {
                value: true
            },
            beforeMove: {
                value: function(){}
            },
            afterMove: {
                value: function(){}
            },
            loop: {
                value: false
            }
        }
    });
    return OnepageScroll;
}, {
    requires: [
        'node',
        'base'
    ]
});