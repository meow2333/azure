/*!
    _______________________________________
       __      __
      / /_____/ /
     / __/ __  / 
    / /_/ /_/ /  
    \__/\__,_/  created by toasted digital. 
    _______________________________________
                
    Toasted Digital Ltd. 
    
    { Javascript Core }
    
    [ Sam Clarke ]
    [ v beta 0.45 ]
    [ Last Edited 1 Nov 2013 ]

    [ master branch ]
                         
    
    Hi there, enjoy your look around. 
    If you have any questions we're at 
    studio@toasteddigital.com

    View the uncompressed version: /core.js
 
*/
 
    
/*
    _______________________________________________________
        
    The Main Class.
    _______________________________________________________
        
*/
    
    function TD() { 
        
        var me = this;


        me.init = function() {
            me.objsCache();
            me.funcs();
        }
        
    }

    
/*
    _______________________________________________________
        
    Globals.
    _______________________________________________________
        
*/
    
    var version         = 'beta 0.44';
    var w               = 0;
    var h               = 0;
    var mobile          = false;
    var visoranime      = false;
    var hit             = false;
    var animate         = false;
    var mobile_break    = 706;
    var gmaps           = false;

/*
    _______________________________________________________
    
    Functions to be initiated after main Class has loaded
    _______________________________________________________
        
*/
    
    TD.prototype.funcs = function() { 

        var me = this; 

        /*
            _______________________________________________________
                
            Update Version
            _______________________________________________________
                
        */

        //$('.version').html(version);

         /*
            _______________________________________________________
                
            Modernizr conditions
            _______________________________________________________
                
        */
        
        Modernizr.load({
          test: Modernizr.mq('only all'),
          nope: '/assets/templates/td/js/polys/respond.min.js'
        });
      
        me.animations();
    
         /*
            _______________________________________________________
                
            Fade in the loading graphic and start essential functions
            _______________________________________________________
                
        */

        TweenLite.to(me.introLogo, .4, {autoAlpha: 1, top: 0, ease: Back.easeOut, delay: .5, onComplete: function() {
            me.preload();
            me.roboInit(); 
            me.addImages();
            me.slidesInit();
            me.scrollingAnime();
            me.UI();  
            me.services();
            me.contactForm();
        }});


        /*
            _______________________________________________________
                
            Initial Sizing
            _______________________________________________________
                
        */


        w = me.win.width();
        h = me.win.height();

        if (h < 835 || w < 1024) {

            $('.hero').removeAttr('style');

        } else {

            $('.hero').css({'height':(h - 40)+'px'});

        }


        /*
            _______________________________________________________
                
            Check if we have a hash location and position the screen accordingly.
            _______________________________________________________
                
        */

        if (window.location.hash.substring(1)) {
            
            hash = window.location.hash.substring(1);
            var s = $('.'+hash).offset().top;
            TweenLite.to(me.win, .5, {scrollTo:{y:s},ease: Circ.easeInOut});
            
        }

        
    }


/*
    _______________________________________________________
    
    Resets on size change
    We need these just in case the user resizes and the intro animations haven't completed
    _______________________________________________________
        
*/

    TD.prototype.resetMob = function() {

        me.robomobile.css({'opacity':'1'});
        if (me.mobileImagesAdded) return;
        me.mobileImagesAdded = true;
        me.addImages();
    }


    TD.prototype.resetDesktop = function() {

        me.robothead.css({'opacity':'1'}).removeClass('hidden');
        me.robotstick.removeClass('hidden');
        me.robot2.removeClass('hidden');
        me.robot.removeClass('hidden');
        me.robot3.removeClass('hidden');
        me.intro.addClass('hidden');
        me.bgs.show();
        me.cont.css({'visibility':'visible'});
        if (me.desktopImagesAdded) return;
        me.desktopImagesAdded = true;
        me.addImages();

    }


/*
    _______________________________________________________
    
    Replace the src of the images 
    - this helps us make sure we don't load any unecessary images depending on device size
    _______________________________________________________
        
*/

    TD.prototype.addImages = function() {

        me = this; 
        
        if (w > mobile_break) {

            imgs = $('.robo img, .backgrounds img');

        } else {

            imgs = $('.mobile-robot img, .backgrounds img');

        }

        imgs.each(function() {
            data = $(this).data('src');
            $(this).attr('src',data)
        })

    }

/*
    _______________________________________________________
    
    Preloader 
    _______________________________________________________
        
*/

    TD.prototype.preload = function() {

        if (w <= mobile_break) {
            preloader_images = preloader_mobile;
        }

        var me      = this;
        var loader  = new PxLoader();
        var il      = preloader_images.length;

        /*
            _______________________________________________________
            
            User set images to preload. These are set by the CMS and outputted inline.
            _______________________________________________________
                
        */

        for (i=0;i<il;i++) {
            loader.addImage(preloader_images[i]);
        }

        /*
            _______________________________________________________
            
            Get the preloader text and create the timeline object for the preloader animation
            _______________________________________________________
                
        */

        var arr = me.introText.text().split('');
        var l = arr.length;

        me.introText.html('').show();

        me.loadingTl = new TimelineMax({onComplete: function() {
            /*
                _______________________________________________________
                
                headerAnime() is the first reveal of the site.
                _______________________________________________________
                    
            */
            me.headerAnime();
        }});

        me.loadingTl.pause();

        for (i=0;i<l;i++) {
            me.introText.append('<span class="intro-letter-'+i+' intro-letter">'+arr[i]+'</span>');
            me.loadingTl.to($('.intro-letter-'+i), .1, {autoAlpha: 1, ease: Circ.easeIn, delay: -.07});
        }

        if (!Modernizr.opacity) {
            $('.intro-letter').css({'visibility':'hidden'});
        } else {
            $('.intro-letter').css({'opacity':'.2'});
        }

        /*
            _______________________________________________________
            
            Initiate the preloader
            _______________________________________________________
                
        */

        var total = me.loadingTl.totalDuration();

        loader.addProgressListener(function(e) { 

            //me.loadingTl.pause();

            var perc = e.completedCount / e.totalCount;
            var pos = perc * total;

            me.loadingTl.tweenTo(pos);

            if (perc >= 1) me.loadingTl.play();

        }); 

        loader.start();

    }

/*
    _______________________________________________________
    
    Post Intro Functions
    _______________________________________________________
        
*/

    TD.prototype.introComplete = function() {

        me.doc.mousemove(function(e) {  
            animate = true;
            moveEvent(e);
        });

        me.doc.mousemove( $.throttle( 200, true, function(e){
            me.render();
        }))

        // Tracking
        me.track('Loading Milestones','User waited for the introduction animation','');

        /*
            _______________________________________________________
                
            Window resize function
            _______________________________________________________
                
        */

        me.win.resize($.throttle(250, function() {
            
            s = me.stage.width();
            w = me.win.width();
            h = me.win.height();

            me.offset = (w - s) /2;
            animate = false;
            
            moveEvent(false);

             if (h < 835 || w < 1024) {

                $('.hero').removeAttr('style');

            } else {

                $('.hero').css({'height':(h - 40)+'px'});

            }

            if (w > mobile_break) {
                me.resetDesktop();
            } else {
                me.resetMob();
            }

            if (gmaps) me.map.setCenter(new google.maps.LatLng(51.511187,-0.125701));  

            me.win.trigger('scroll');
            me.slidesReset();

        }));

        me.win.scroll($.debounce(300, function() {

            if (me.workBoxTween) me.workBoxTween.pause();
            
            if (w <= mobile_break) return;

            st = $(window).scrollTop();
            wst = $('.work').offset().top;

            if (st >= (wst - 200) && st <= (wst + (h / 4))) {
                   
                var s = $('.work').offset().top;
                me.workBoxTween = TweenLite.to(me.win, .5, {scrollTo:{y:s},ease: Circ.easeInOut});

            }

        }));

    }

/*
    _______________________________________________________
    
    Animations
    _______________________________________________________
        
*/

    TD.prototype.animations = function() {

        var me = this;

        /*
            _______________________________________________________
            
            The initial site reveal
            _______________________________________________________
                
        */

        me.headerAnime = function() {

            $('.version').fadeOut();
            
            me.header           = $('header');
            me.headerContent    = $('header .content');

            var tl = new TimelineLite();

            tl.to(me.introText, .1, {autoAlpha: 0, ease: Circ.easeOut, delay: .1});
            tl.to(me.introLogo, .1, {autoAlpha: 0, ease: Circ.easeOut, delay: -.1});


            tl.to(me.header, .3, {className:'+=header-compact', ease: Circ.easeOut, delay: .2, onComplete: function() {
                me.headerContent.css({'opacity':'0'}).show();
                me.loaderdiv.hide();
                me.header.css({'position':'relative'});
                $('.page').css({'padding-top':'0'});
            }});

            tl.to(me.headerContent, .2, {autoAlpha: 1, ease: Circ.easeOut, onComplete: function() {              
                
                // Tracking
                me.track('Loading Milestones','User waited for loading gif and header animation','');

                me.roboAnimate();
                me.lazy();
            }});
            
        }

        /*
            _______________________________________________________
            
            Scrolling animations triggered on window position
            - Limited for touch devices
            _______________________________________________________
                
        */

        me.scrollingAnime = function() {

            

         /*   var controller = $.superscrollorama({
                triggerAtCenter: false,
                playoutAnimations: false
            });

            if (!Modernizr.touch && Modernizr.opacity) {


                controller.addTween(
                  '.hero',
                  (new TimelineLite())
                    .append([
                        TweenLite.to(me.bg1, 1,
                            {marginLeft: -620}
                        ),
                        TweenLite.to(me.bg2, 1,
                            {marginLeft: -680}
                        )
                    ]),
                  (h* 1.5),
                  -50
                );
                 
            }*/    

        }

    }


/*
    _______________________________________________________
    
    Sprite Service animations
    _______________________________________________________
        
*/

    TD.prototype.services = function() {

        me = this;
        services = $('.service');

        /*
            _______________________________________________________
            
            Grab the values of the service animation
            _______________________________________________________
            
        */

        services.each(function() {
    
            t = this;
            t.div = $(this);
            t.img = t.div.data('spritesheet');
            t.frames = parseFloat(t.div.data('frames'));
            t.cols = parseFloat(t.div.data('columns'));
            t.tooltip = $('.tooltip',t.div)

        })

        /*
            _______________________________________________________
                
            The Mouse events for the services
            _______________________________________________________
                
        */

        var animations = $('.animation');
        var tooltips   = $('.tooltip');


        services.mouseenter(function(e){

            if (w <= mobile_break) return;

            t = this;
            t.div = $(this);
            
            tooltips.hide();
            t.tooltip.show();
            animations.hide();
            

            TweenLite.fromTo(t.tooltip, .3,{marginTop: -10, ease: Circ.easeIn}, {marginTop: 0, ease: Elastic.easeOut});
            
            if (this.playing) return;

            if (this.loaded) {
                me.playSprite(this); 
                return;
            }
            me.loadService(this);

        })

        services.mouseleave(function(e){

            if (w <= mobile_break) return;

            this.playing = false;
            t.tooltip.hide();
            animations.hide();
            if (t.tl) t.tl.pause();
            
        })

        var touchmoving = false;

        me.doc.on('touchstart click',function() {

            if (Modernizr.touch) me.doc.off('click');

            var servicehover = 0

            services.each(function() {

                if ($(this).is(':hover')) {
                    me.serviceClick(this)
                    servicehover++;
                } 

            })

            if (servicehover <= 0) {

                tooltips.hide();
                var images = $('.service img');
                images.each(function() {
                    var image = $(this);
                    image.removeClass('active');
                    var img = image.data('src');
                    image.attr('src',img);
                })

            }

        })

        me.serviceClick = function(t) {

            if (w > mobile_break) return;

            tooltips.hide();
            t.tooltip.show();
            TweenLite.fromTo(t.tooltip, .3,{marginTop: -10, ease: Circ.easeIn}, {marginTop: 0, ease: Elastic.easeOut});

            if (!Modernizr.touch) {
                var s = t.div.offset().top - 100;
                TweenLite.to(me.win, .5, {scrollTo:{y:s},ease: Circ.easeInOut});
            }

            var image = $('img',t);
            var images = $('.service img');

            if (image.hasClass('active')) {

                image.removeClass('active');
                img = image.data('src');
                image.attr('src',img);
                tooltips.hide();

            } else {

                images.each(function() {
                    var image = $(this);
                    image.removeClass('active');
                    var img = image.data('src');
                    image.attr('src',img);
                })

                image.addClass('active');
                img = image.data('hover');
                image.attr('src',img);

            } 

        }

        /*
            _______________________________________________________
                
            Load service preloader, controls the circular preloader that appears as well
            _______________________________________________________
                
        */

        me.loadService = function(t) {

            t.loader = new PxLoader();

            t.loader.addImage(t.img);

            t.div.append('<div class="pie"> <div class="bg"></div><div class="slice1 hold"><div class="draw"></div></div><div class="slice2 hold"><div class="draw"></div></div></div>')

            t.loadingTl = new TimelineMax({repeat: 20});

            t.loadingTl.to($('.slice1 .draw',t.div), 0,{autoAlpha: 0, ease: Linear.easeNone})
            t.loadingTl.to($('.slice2 .draw',t.div), 0,{autoAlpha: .5, ease: Linear.easeNone})
            t.loadingTl.to($('.slice1 .draw',t.div), .3,{rotation: "180deg", autoAlpha: .5, ease: Linear.easeNone})
            t.loadingTl.to($('.slice2 .draw',t.div), .3,{rotation: "180deg", autoAlpha: .5, ease: Linear.easeNone})
            t.loadingTl.to($('.slice1 .draw',t.div), .3,{rotation: "360deg", ease: Linear.easeNone})
            t.loadingTl.to($('.slice2 .draw',t.div), .3,{rotation: "360deg", autoAlpha: 0, ease: Linear.easeNone})
            t.loadingTl.to($('.slice1 .draw',t.div), 0,{rotation: "0deg", ease: Linear.easeNone})
            t.loadingTl.to($('.slice2 .draw',t.div), 0,{rotation: "0deg", ease: Linear.easeNone})

            t.loader.start();

            t.loader.addCompletionListener(function() { 
                t.loadingTl._repeat = 0;
                t.loaded = true;
                TweenLite.to($('.pie',t.div), .2,{autoAlpha: 0, ease: Circ.easeOut})
                me.playSprite(t);
            });

        }

        /*
            _______________________________________________________
                
            The Animation Function
            _______________________________________________________
                
        */

        me.playSprite = function(t) {

            t.playing = true;

            var anime = $('.animation',t.div);

            var title = $('.tooltip h4',t.div).text();

            me.track('Service Hover','User hovered over: '+title,'');

            anime.css({'background':'url('+t.img+') no-repeat -2px -2px transparent'}).show();
            
            var rowTick = 0;
            var row = 0;

            var spritePos = -158;
            var spriteHeight = -158;

            t.loadingTl.kill();

            t.tl = new TimelineMax({repeat: -1, overwrite:1, onUpdate: function() {

                /*
                    _______________________________________________________
                        
                    Because of how unreliable mouseout/mouseleave are, we check if the user is actually hovering on each frame and if not halt the animation
                    _______________________________________________________
                        
                */

                if (!t.div.is(':hover')) {

                    t.playing = false;
                    t.tooltip.hide();

                    animations.hide();
                    if (t.tl) t.tl.pause();

                }

            }});

            for (var i=0;i<t.frames;i++) {
                
                if (rowTick > (t.cols - 1)) {
                    row++;
                    rowTick = 0;
                }

                t.tl.to(anime, 0.0, {backgroundPosition: (spritePos * rowTick -2)+"px "+(spriteHeight * row -2)+"px", ease:Circ.easeInOut, delay: 0.03});
                
                rowTick++;

            }
        
        }
    }



/*
    _______________________________________________________
        
    Interface / Buttons
    _______________________________________________________
        
*/

    TD.prototype.UI = function() {

        var me = this;

        me.buttons.on('click touchend',function(e) {
            if ($(this).hasClass('actuallink')) return true;
            e.preventDefault();
            var l = $(this).attr('href').split('#')[1];
            _gaq.push(['_trackPageview', l+".html"]);
            var s = $('.'+l).offset().top;
            TweenLite.to(me.win, .5, {scrollTo:{y:s},ease: Circ.easeInOut});
            me.header.removeClass('active');
        });


        me.cont.click(function() {
            var s = $('.about').offset().top;
            TweenLite.to(me.win, .5, {scrollTo:{y:s},ease: Circ.easeInOut});
             me.track('UI Interactions','User used the continue button','');
        })

        me.bgs.click(function() {
            var s = $('.about').offset().top;
            TweenLite.to(me.win, .5, {scrollTo:{y:s},ease: Circ.easeInOut});
             me.track('UI Interactions','User clicked the background div','');
        })

        me.robomobile.click(function() {
            var s = $('.about').offset().top;
            TweenLite.to(me.win, .5, {scrollTo:{y:s},ease: Circ.easeInOut});
        })

        me.people.mouseover(function() {
            $(this).addClass('people_hover');
        })

        me.people.mouseout(function() {
            $(this).removeClass('people_hover');
        })

        if (document.addEventListener) {

            document.addEventListener('touchmove', function(e) {
                moveEvent(e);
            });

        }

        me.mapbtn.click(function(e) {

    
            e.preventDefault();

            var t = me.mapbtn;
            var tdmap = $('#tdmap');

            if (t.hasClass('open')) {
                t.html('<span></span>View Map');
                t.removeClass('open');
                tdmap.hide();
                return;
            }

            // Tracking
            me.track('UI Interactions','User opened the google maps panel','');

            t.addClass('open');

            t.html('<span></span>Hide Map X');

            tdmap.show();
            
             var s = t.offset().top;
            TweenLite.to(me.win, .7, {scrollTo:{y:s},ease: Circ.easeInOut});

            if (gmaps) return;

            setTimeout(function() {
                me.gmaps();
            },500);

        })

        $('.menu-small .logo a').on('click',function(e) {

            e.preventDefault();

        })

        me.smallmenu.on('mouseover touchstart',function() {

            if (me.smallmenu.hasClass('open')) {
                me.smallmenu.addClass('active');
            } else {
                me.smallmenu.removeClass('active');
            }

        })

        me.smallmenu.on('mouseout',function() {
            me.smallmenu.removeClass('active');
        })

        $('li a',me.smallmenu).on('click touchend',function() {
            me.smallmenu.removeClass('active');
        })

        

    }

/*
     _______________________________________________________
            
    Slideshow Functions
    _______________________________________________________
            
*/
    
    currentSlide = 0;

    TD.prototype.slidesInit = function() {


        me.slidesReset = function() {

            me = this;

            me.slides       = $('.slide');
            me.slidesa      = $('.slide a');
            me.slideslinks  = $('.slide a.mainlink');
            me.casestudies  = $('.casestudies');

            me.ssLeft       = $('.casestudies .left_btn');
            me.ssRight      = $('.casestudies .right_btn');

            var length      = me.slides.length;
            var max         = length - 1;

            me.slides.each(function() {

                t           = this;
                t.div       = $(this);
                t.up        = $('.up_btn',t);
                t.down      = $('.down_btn',t);
                t.mainimg   = $('img.main',t);
                t.div.css({'width':w+'px'});

                articles = $('article',t);

                $(articles[1]).css({'z-index':'1','position':'absolute','top':h+'px'});


                if (t.div.hasClass('down')) {

                    $('.down_btn',t).hide();
                    $('.up_btn',t).show();

                    $(articles[0]).css({'z-index':'0','position':'absolute','top':-h+'px'});
                    $(articles[1]).css({'z-index':'1','position':'absolute','top':'0px'});

                    img = $('img',$(articles[0]));
                    img.css({'opacity':'1','visibility':'visible'});

                } else {

                }

                t.up.off('click').on('click', function() {

                    p = $(this).parent()

                    articles = $('article',p);
                    
                    var s = me.casestudies.offset().top;
                    TweenLite.to(window, 1, {scrollTo:{y:s},ease: Circ.easeOut});

                    $(this).hide();
                    $('.down_btn',p).show();

                    img = $('img',$(articles[0]));

                    p.removeClass('down');     
     
                    TweenLite.to(img, .7, {autoAlpha:1, ease:Circ.easeInOut});

                    TweenLite.to(articles[0], .4, {top:0, ease:Circ.easeInOut});
                    TweenLite.to(articles[1], .4, {top:h, ease:Circ.easeInOut});

                    if (Modernizr.history) history.pushState(null, "Next Page", site_url);

                   

                })

                function downFunc(t) {

                    p = $(t).parent()
                    articles = $('article',p);

                    p.addClass('down'); 

                    if (Modernizr.history) history.pushState(null, "Next Page", p.data('url'));

                    var title = $('h4',p).first().text();
                    
                    // Tracking
                    me.track('Slideshow More Info Button','User wanted more on: '+title,'');

                    var s = me.casestudies.offset().top;
                    TweenLite.to(window, 1, {scrollTo:{y:s},ease: Circ.easeOut});

                    $('.down_btn',p).hide();
                    $('.up_btn',p).show();

                    $(articles[0]).css({'z-index':'0','position':'absolute'});
                    $(articles[1]).css({'z-index':'1','position':'absolute'});

                    img = $('img',$(articles[0]));
     
                    TweenLite.to(img, .7, {autoAlpha:0, ease:Circ.easeInOut});
                    
                    TweenLite.to(articles[0], .4, {top:-h, ease:Circ.easeInOut});
                    TweenLite.fromTo(articles[1], .4, {top:h, ease:Circ.easeInOut}, {top:0, ease:Circ.easeInOut, onComplete: function() {
                        me.lazy();
                    }});


                }

                t.mainimg.off('click').on('click', function() {
                    downFunc($(this).parent().parent());
                });

                t.down.off('click').on('click', function() {
                    downFunc(this);             
                })

               
            })

            /*
                Defaults
            */

            if (w <= mobile_break || h <= 646) {

                if (w <= mobile_break || h <= 380) {

                    me.casestudies.css({'height':'380px'});
                    me.slides.css({'height':'380px', 'width':w+'px'}).removeClass('down');

                } else {

                    me.casestudies.css({'height':'400px'});
                    me.slides.css({'height':'400px', 'width':w+'px'}).removeClass('down');

                }

                articles = $('.casestudies article');
                articledetail = $('.casestudies article.detail');

                $('.casestudies .down_btn').show();
                $('.casestudies .up_btn').hide();
  
                articles.css({'top':'0'});
                articledetail.css({'top':h+'px'});

                if (Modernizr.history) history.pushState(null, "Next Page", site_url);

            } else {

                me.casestudies.css({'height':h+'px'});
                me.slides.css({'height':h+'px', 'width':w+'px'});

            }

            me.ssLeft.show();
            me.ssRight.show();

            if (currentSlide <= 0) {
                me.ssLeft.hide();
            }

            if (currentSlide >= max) {
                me.ssRight.hide();
            }


            me.slides.hide();
            me.slides[currentSlide].div.css({'left':'0'}).show();

            var noslide = false;

            me.slideLeft = function() {


                if (noslide) return;

                if (currentSlide <= 0) return;

                noslide = true;

                if (Modernizr.history) history.pushState(null, "Next Page", site_url);

                me.ssLeft.show();
                me.ssRight.show();

                var l = w;

                var s = me.casestudies.offset().top;
                TweenLite.to(window, 1, {scrollTo:{y:s},ease: Circ.easeOut});

                me.slides.hide();
                me.slides[currentSlide-1].div.show();
                me.slides[currentSlide].div.show();

                if (!Modernizr.touch) {
                    img = $('img.main',me.slides[currentSlide-1]);
                    TweenLite.fromTo(img, .6, {marginLeft:400}, {marginLeft:0, ease:Circ.easeOut});

                    img2 = $('img.main',me.slides[currentSlide]);
                    TweenLite.fromTo(img2, 1, {marginLeft:0}, {marginLeft:400, ease:Circ.easeInOut});
                }

                TweenLite.fromTo(me.slides[currentSlide-1], .6, {left:-(w /2), ease:Circ.easeIn}, {left:0, ease:Circ.easeOut});
                TweenLite.to(me.slides[currentSlide], .6, {left:w, ease:Circ.easeInOut, onComplete: function() {
                    noslide = false;
                }});

                currentSlide--;

                if (currentSlide <= 0) me.ssLeft.hide();

            }

            me.slideRight = function() {

            
                if (noslide) return;

                if (currentSlide >= max) return;

                noslide = true;

                if (Modernizr.history) history.pushState(null, "Next Page", site_url);

                me.ssRight.show();
                me.ssLeft.show();


                var l = w;

                var s = me.casestudies.offset().top;
                TweenLite.to(window, 1, {scrollTo:{y:s},ease: Circ.easeOut});
      
                me.slides.css({'left':'0', 'z-index':'1000'}).hide();
                me.slides[currentSlide].div.css({'left':'0', 'z-index':'1100'}).show();
                me.slides[currentSlide+1].div.css({'left':w+'px', 'z-index':'2000'}).show();

                if (!Modernizr.touch) {
                    img = $('img.main',me.slides[currentSlide]);
                    TweenLite.to(img, .6, {marginLeft:400, ease:Circ.easeInOut});

                    img2 = $('img.main',me.slides[currentSlide+1]);
                    TweenLite.fromTo(img2, .8, {marginLeft:400}, {marginLeft:0, ease:Circ.easeOut});
                }

                TweenLite.to(me.slides[currentSlide].div, .6, {left:-(w /2), ease:Circ.easeInOut});
                TweenLite.to(me.slides[currentSlide+1].div, .6, {left:0, ease:Circ.easeInOut, onComplete: function() {
                    noslide = false;
                }});

                currentSlide++;

                if (currentSlide >= max) me.ssRight.hide();

            }

        }

        me.slidesReset();

        me.casestudies.touchwipe({
             wipeLeft: function(e) {
                e.preventDefault();
                me.slideRight()
             },
             wipeRight: function(e) {
                e.preventDefault()
                me.slideLeft()
             },
             min_move_x: 30,
             min_move_y: 30,
             preventDefaultEvents: false
        });

        me.ssRight.on('click',function() {
            me.slideRight();        
        });

        me.ssLeft.on('click',function() {
            me.slideLeft();             
        });



        me.doc.keydown(function (e) {
            if (e.keyCode == 37) {
                me.slideLeft();   
                return false;
            }
            if (e.keyCode == 39) {
                me.slideRight();
                return false;
            }
        });


    }


/*
    _______________________________________________________
        
    Robot
    _______________________________________________________
        
*/

    TD.prototype.roboInit = function() {

        var me = this;
        
        s = me.stage.width();
        w = me.win.width();
        var lastpos     = 0;
        var speed       = 0;
        var rvl          = parseFloat(me.robotvisor.css('left'));

        this.dir        = 'left';
        this.side       = 'left';
        this.offset     = (w - s) /2;
        this.mousePerc  = 0;
        
        
        moveEvent = function(e) {


            // Correct the event position to the stage size.
            if (e && !Modernizr.touch) {
                e.preventDefault();
            }

            if (w > mobile_break) {

                pageX =  e.pageX - me.offset;
            
                if (pageX >= s) pageX = s;
                if (pageX <= 0) pageX = 0;
                me.mousePerc = (pageX / s);

                if (me.mousePerc < 0.2 || me.mousePerc > 0.8) {
                    hit = false
                    return;
                } else {
                    hit = true;
                }

                me.x = pageX;

                this.dir = (pageX < lastpos) ? this.dir = 'left' : this.dir = 'right';
                
                var hzX = me.hz.position().left - (me.hz.width() / 2);
                var hzW = hzX + me.hz.width();
                
                if (me.x > hzW) me.x = hzW;
                if (me.x < hzX) me.x = hzX;
                
                me.x = Math.ceil(me.x);

                speed = Math.abs(lastpos - pageX);
                lastpos = pageX;

            }

            if (w <= mobile_break || !e) {

                me.robot.removeAttr('style').css({'left':'50%'});
                me.robot2.removeAttr('style').css({'left':'50%'});
                me.robot3.removeAttr('style').css({'left':'50%'});
                me.robotHighlight.removeAttr('style');
                me.robot2Highlight.removeAttr('style');
                me.robot3Highlight.removeAttr('style');
                me.robothead.removeAttr('style').css({'left':'50%'});
                me.robotvisor.removeAttr('style');

                me.render();

                return;

            }
            
            
            me.visorPos = (me.robothead.width() * me.mousePerc) - (me.robotvisor.width() / 2); 
            
            // Restrict the visor boundaries
            if (me.visorPos <= -15) me.visorPos = -15;  
            if (me.visorPos >= 30) me.visorPos = 30;
            
            
            var arm1 = new threedee(5,14,28);
            var arm2 = new threedee(5,14,28);
            var body = new threedee(30,40,133);
            
            if (!visoranime) me.robotvisor.css({'left': me.visorPos+'px'});

            
            me.robot.css({'width':(body.width)+'px'});
            me.robot2.css({'width':(arm1.width)+'px'});
            me.robot3.css({'width':(arm2.width)+'px'});
            me.robotHighlight.css({'width':body.fWidth+'px','left':body.fLeft+'px'});
            me.robot2Highlight.css({'width':arm1.fWidth+'px','left':arm1.fLeft+'px'});
            me.robot3Highlight.css({'width':arm2.fWidth+'px','left':arm2.fLeft+'px'});

            
        }
        
        threedee = function(ts,tf,tw) {
            
            // 3D perspective
            
            var diffr           = 50 - (me.mousePerc*100);
            var diff            = Math.abs(diffr);
            var distPerc        = (diff / 50);
                
            var t = this;
            var tDiff           = ts;   // Target Difference
            var ftDiff          = tf;   // The front pane's target difference
            
            t.width             = tw - (tDiff * distPerc);      // Width of the side panes
            t.fWidth            = tw - (ftDiff * distPerc);     // width of the front pane
            
            // Left position of the front pane
            
            t.fLeft = (diffr < 0) ? t.width - t.fWidth : 0;
            
            return t;
            
        }
        
        
        headEnterEvent = function(e) {

            if (w <= mobile_break) return;
            
            var s = (mobile) ? 80 : 40;
            
            if (speed > s) {
            
                visoranime = true;

                var tl2 = new TimelineMax();

                tl2.to(me.robothead, .2, {marginTop: -200, ease: Quint.easeOut});
                tl2.to(me.robothead, .4, {marginTop: -167, ease: Bounce.easeOut});
                
                var tl = new TimelineMax();

                var to   = ('left' === this.dir) ? -70 : 90;
                var from = ('left' === this.dir) ? 70 : -90;

                
                tl.to(me.robotvisor, .2, {left:to, ease: Circ.easeOut});
                tl.fromTo(me.robotvisor, .3, {left:from, ease: Circ.easeIn}, {left:to, ease: Circ.easeOut})
                tl.fromTo(me.robotvisor, .4, {left:from, ease: Circ.easeIn}, {left:to, ease: Circ.easeOut})
                tl.fromTo(me.robotvisor, .5, {left:from, ease: Circ.easeIn}, {left:to, ease: Circ.easeOut})     
                tl.fromTo(me.robotvisor, 1, {left:from, ease: Circ.easeIn}, {left:me.visorPos, ease: Circ.easeOut, onComplete: function() {
                    visoranime = false;
                }})

            }
        }
    
        var mt  = parseInt(me.robothead.css('margin-top'));
        
        me.robothead.mouseenter(function() {

            headEnterEvent();

        });


    }

    TD.prototype.roboAnimate = function() {

        var me = this;

        me.render = function() {

            if (!me.x || me.x === undefined || me.x === NaN) return;


            if (w <= mobile_break || !animate) return;

            TweenLite.to(me.robot, .2, {left:me.x, ease:Circ.easeOut, delay: 0});
            TweenLite.to(me.robot2, .2, {left:me.x, ease:Circ.easeOut, delay: 0});
            TweenLite.to(me.robot3, .2, {left:me.x, ease:Circ.easeOut, delay: 0});
            TweenLite.to(me.robothead, .2, {left:me.x, ease:Circ.easeOut, delay: 0.1});        

        }
        
        
        /*
            _______________________________________________________
                
            Set up the scene
            _______________________________________________________
                
        */

        if (w > mobile_break) {

            me.robot.addClass('robot-compact').removeClass('hidden').css({'opacity':'0'});
            me.robothead.addClass('robot-head-compact').removeClass('hidden').css({'opacity':'0'});
            me.robot2.addClass('robot-arm1-compact');
            me.robot3.addClass('robot-arm2-compact');
            me.heroh1.css({'opacity':'0'});
            me.herop.css({'opacity':'0'});
            me.herohr.css({'opacity':'0'});

        } else {

            me.robomobile.css({'opacity':'0'});

        }

        var arr = $('span',me.heroh1)


        if (w > mobile_break) {

            if (Modernizr.opacity) me.bg1.addClass('background-1-compact');
            if (Modernizr.opacity) me.bg2.addClass('background-2-compact');
            if (Modernizr.opacity) me.bg3.addClass('background-3-compact');
            if (Modernizr.opacity)me.headerphone.addClass('header-phone-compact');
        }

        var tl = new TimelineMax();

        /*
            _______________________________________________________
                
            Reshow the text elements once the scene is loaded
            _______________________________________________________
                
        */

        tl.addCallback(function() {

            me.heroh1.css({'opacity':'1'});
            me.herop.css({'opacity':'1'});
            me.herohr.css({'opacity':'1'});
            me.herohr.css({'opacity':'1'});
            me.robomobile.css({'opacity':'0'});
            me.bgs.show();
            

        },0)


        /*
            _______________________________________________________
                
            Animate the h1 tag's spans
            - Alternative for no text shadow devices
            _______________________________________________________
                
        */


        tl.delay(.1)


        if (w <= mobile_break) {

            me.herop.css({'height':'80px'});
            arr.css({'opacity':'1'});

        }

        if (Modernizr.opacity && w > mobile_break) {

            arr.each(function() {
                 tl.fromTo($(this), .2,{opacity: 0, left: -40, ease: Circ.easeIn},  {opacity: 1, left: 0, ease: Circ.easeOut, delay: -.1});
            })

        }




        /*
            _______________________________________________________
                
            Border and p tag animations
            _______________________________________________________
                
        */
        

        if (Modernizr.opacity) {

            tl.to(me.herop, .1, {height: 80, paddingTop: 0, ease: Circ.easeOut, delay: -.3});

        } else {

            tl.to(me.herop, .5, {height: 80, paddingTop: 0, ease: Circ.easeOut, delay: -.3});

        }


        /*
            _______________________________________________________
                
            The robot introduction - only load if not mobile break size.
            This is made using a spritesheet
            _______________________________________________________
                
        */

        
        
        if (w > mobile_break) {

            
            if (Modernizr.opacity) tl.to(me.headerphone, .4, {className: "-=header-phone-compact", ease: Circ.easeOut});
            if (Modernizr.opacity) tl.to(me.bg3, .4, {className: "-=background-3-compact", ease: Circ.easeOut, delay: -.2});    
            if (Modernizr.opacity) tl.to(me.bg1, .4, {className: "-=background-1-compact", ease: Back.easeOut});
            if (Modernizr.opacity) tl.to(me.bg2, .4, {className: "-=background-2-compact", ease: Back.easeOut, delay: -.4});
            tl.to(me.cont, .4, {autoAlpha: 1, ease: Circ.easeOut, delay: -.2});
            


            var rowTick         = 0;
            var row             = 0;
            var spritePos       = -135;
            var spriteHeight    = -163;
            var frames          = 46;
            var cols            = 6;

            for (var i=0;i<frames;i++) {
                    
                if (rowTick > (cols - 1)) {
                    row++;
                    rowTick = 0;
                }

                tl.to(me.intro, 0, {backgroundPosition: (spritePos * rowTick -2)+"px "+(spriteHeight * row - 2)+"px", ease:Circ.easeInOut, delay: 0.02});
                rowTick++;

            }




            /*
                _______________________________________________________
                    
                Start animating the robot parts in
                _______________________________________________________
                    
            */

            me.robot.addClass('robot-highlight-fill');

            tl.to(me.robot, .1, {autoAlpha:1, ease: Circ.easeOut, delay: -.1});

            tl.to(me.robotHighlight, .2, {width:133, ease: Circ.easeOut, onComplete: function() {
                me.robothead.css({'opacity':'1'})
                me.robotstick.removeClass('hidden');
                me.robot2.removeClass('hidden');
                me.robot3.removeClass('hidden');
                me.robot.removeClass('robot-highlight-fill');
                
            }});


            tl.to(me.intro, .1, {autoAlpha:0, ease: Circ.easeOut});

            tl.to(me.robot, .1, {className:'-=robot-compact', delay: .1, ease: Circ.easeOut});
            
            tl.to(me.robothead, .1, {className: '+=robot-head-mid', ease: Circ.easeOut, delay: -.1, onComplete: function() {
                me.robothead.removeClass('robot-head-compact');
            }});

            
            if (Modernizr.opacity) {

                tl.to(me.robot2, .1, {className: '+=robot-arm1-mid', ease: Circ.easeOut, onComplete: function() {
                    me.robot2.removeClass('robot-arm1-compact');
                }});

                tl.to(me.robot3, .1, {className: '+=robot-arm2-mid', ease: Circ.easeOut, onComplete: function() {
                    me.robot3.removeClass('robot-arm2-compact');
                }});

                

                tl.to(me.robot2, .1, {className: '-=robot-arm1-mid', ease: Circ.easeOut});

                tl.to(me.robot3, .1, {className: '-=robot-arm2-mid', ease: Circ.easeOut});

            } else {

                tl.to(me.robot2, .1, {className: '-=robot-arm1-compact', ease: Circ.easeOut, onComplete: function() {
                    me.robot2.removeClass('robot-arm1-compact');
                }});

                tl.to(me.robot3, .1, {className: '-=robot-arm2-compact', ease: Circ.easeOut, onComplete: function() {
                    me.robot3.removeClass('robot-arm2-compact');
                }});

            }


            tl.to(me.robothead, .2, {className: '+=robot-head-extend', ease: Quint.easeOut, onComplete: function() {
                    me.robothead.removeClass('robot-head-mid');
            }});

            tl.to(me.robothead, .2, {className: '-=robot-head-extend', ease: Bounce.easeOut});

        }

        /*
            _______________________________________________________
                
            Mobile Robot
            If we're mobile breakpoint, animate that icon in.
            _______________________________________________________
                
        */

       


        if (w <= mobile_break) {
   
            tl.fromTo(me.robomobile, .5,{autoAlpha: 0, left: -500},{autoAlpha: 1, left: 0, ease: Back.easeOut});

        }


        /*
            _______________________________________________________
                
            Finish the intro animation
            _______________________________________________________
                
        */

        tl.call(function() {

            me.introComplete();

        })
        
    }


/*
    _______________________________________________________
        
    Google Maps
    _______________________________________________________
        
*/

    TD.prototype.gmaps = function() {

        me = this;

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyBMArNh1a8_qqxtvwpxfQ94OUHR5AgPHpU&sensor=false&v=3.6&callback=me.gmapsLoaded";
        document.body.appendChild(script);

        
        me.gmapsLoaded = function() {
        
            gmaps = true;

            var myLatlng = new google.maps.LatLng(51.511187,-0.125701);

            var dragit = true;
            if (Modernizr.touch) dragit = false;

            var styles = [ ]

            var myOptions = {
                center: myLatlng,
                zoom: 17,
                scrollwheel: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                panControl: true,
                draggable: dragit,
                panControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                streetViewControl: true,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                mapTypeControlOptions: {
                  mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                }
            };
            
            var styledMap = new google.maps.StyledMapType(styles,{name: "TD"});
            
            me.map = new google.maps.Map(document.getElementById("tdmap"), myOptions);

            me.map.mapTypes.set('map_style', styledMap);
            me.map.setMapTypeId('map_style');

            var markerImage = new google.maps.MarkerImage('http://td2013.toasteddigital.modxcloud.com/assets/templates/td/images/marker.png',
                new google.maps.Size(60, 47),
                new google.maps.Point(0, 0),
                new google.maps.Point(15, 47)
            );
            
            var marker = new google.maps.Marker({
              position: myLatlng,
              map: me.map,
              icon:  markerImage,
              title:"TD"
            });

            me.map.setCenter(myLatlng);
        
        }
        
    }

/*
    _______________________________________________________
        
    Check Menu Position
    _______________________________________________________
        
*/

    TD.prototype.menuCheck = function() {7


        me = this;

        if (me.win.scrollTop() >= 70 && !me.smallmenu.hasClass('open') && w > mobile_break) {

            TweenLite.to(me.smallmenu, .3, {right:0, ease: Circ.easeOut});
            me.smallmenu.addClass('open');

        } else if (me.win.scrollTop() < 70 && me.smallmenu.hasClass('open') && w > mobile_break) {

           
           me.smallmenu.css({'right':'-100px'}).removeClass('open');
        }

    }

/*
    _______________________________________________________
        
    Contact Form Submission
    _______________________________________________________
        
*/


    TD.prototype.contactForm = function() {
        
        me = this;

        
        this.contactInit = function() {
            
            me.form     = $('.submit-form');
            me.footer   = $('.contact');
            me.formurl  = $('.contact form').attr('action');
            me.name     = $('#name');
            me.email    = $('#email');
            me.message  = $('#message');
            
        }
        
        this.contactSend = function() {

            me.track('UI Interactions','User submitted the contact form','');

            me.name.attr('disabled','disabled').css({'opacity':'0.5'});
            me.email.attr('disabled','disabled').css({'opacity':'0.5'});;
            me.message.attr('disabled','disabled').css({'opacity':'0.5'});;
            
            var name    = me.name.val();
            var email   = me.email.val();
            var message = me.message.val();

            $.ajax({
                type: "POST",
                url: me.formurl,
                headers: { "cache-control": "no-cache" },
                data: { 
                    name: name, 
                    email: email, 
                    message: message 
                },
                dataType: "html"
            }).done(function(d) {
                me.footer.html(d);
                me.contactInit();
            });
            
        }
        
        me.contactInit();
        
        me.doc.on('submit','.submit-form',function(e) {
            e.preventDefault();
            me.contactSend();
        });
        
    }


/*
    _______________________________________________________
        
    Lazy Loading for images
    _______________________________________________________
        
*/

    TD.prototype.lazy = function() {

        var me = this;
        
        me.lazyUpdate = function(elem) {

            me = this;
            el = $(elem);
            
            var win = me.win;
         
            var viewport = {
                top : win.scrollTop(),
                left : win.scrollLeft()
            };
        
            viewport.right = viewport.left + win.width();
            viewport.bottom = viewport.top + win.height();
             
            var bounds = el.offset();
            bounds.right = bounds.left + el.outerWidth();
            bounds.bottom = bounds.top + el.outerHeight();

            //console.log(elem.data('src') + ' - '+ bounds.right + ' - ' + bounds.bottom);

            if (bounds.bottom <= 100) return false;
             
            return (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));
            //return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));


        }

        /*
            Initiate the Lazy loader
        */

        me.lazyInit = function() {

            /* 
                Create references to elements we'll lazy load. Set to true to check they're visible
            */

            me.lazyscroll = Array();

            me.lazyscroll['lazyimages'] = true;
            //me.lazyscroll['gmaps']      = true;

            me.lazyimages       = $('.lazy');
            me.lazyimages.loaded = 0;
            me.lazyimages.each(function() {

                var t = this;

                t.img        = $(t);
                t.datasrc    = $(this).data('src');
                t.loaded     = false;
                t.fadeIn     = true;
                t.isbg       = false;

                if ($(t).hasClass('lazy-bg')) {
                    t.isbg = true;
                }

                if ($(t).hasClass('nofade')) t.fadeIn = false;

                
            });

            me.lazytl = new TimelineMax();

            me.lazyCheck();
            me.menuCheck();



        }

        me.lazyCheck = function() {
        
            me = this;


            if (me.lazyscroll['gmaps']) {
                if (me.lazyUpdate(me.map_holder)) {
                    me.gmaps();
                    me.lazyscroll['gmaps'] = false;
                }
            }
            
            /*
                Lazy load each project image
            */
            
            if (me.lazyscroll['lazyimages']) {
                
                me.lazyimages.each(function() {
                
                    var t = this;
                    
                    if (me.lazyUpdate(t.img) && !t.loaded) {

                        //console.log('loading: '+t.img.data('src'));

                        $.loadImages(t.datasrc,function() {

                            if (t.isbg) {

                                t.img.css({'background-image':'url('+t.datasrc+') ','opacity':'1'});

                            } else {

                                t.img.attr('src',t.datasrc);
                                
                                if (t.fadeIn) {
                                    if (Modernizr.touch) {
                                        t.img.css({'opacity':'1','visibility':'visible'});
                                    } else {
                                        me.lazytl.to(t.img, .3, {autoAlpha:1, ease: Power1.easeInOut, delay: -.1});
                                    }
                                }
                            }
                            
                        })
                        
                        t.loaded = true;
                        me.lazyimages.loaded++;
                        
                        // Stop checking if we've loaded all images.
                        if (me.lazyimages.loaded >= me.lazyimages.size()) me.lazyscroll['lazyimages'] = false;
                    }
                });
                
            }   
            
        }

        me.lazyInit();

        me.win.scroll($.throttle(250, function() {
            me.lazyCheck();
            me.menuCheck();
        }));

        
    }

/*
    _______________________________________________________
        
    Google Tracking
    _______________________________________________________
        
*/

    TD.prototype.track = function(category,action,label) {

        //console.log(category + ' - ' + action + ' - ' + label);
        _gaq.push(['_trackEvent', category, action, label]);

    }
    
/*
    _______________________________________________________
        
    Objects Cache - recycling is good.
    _______________________________________________________
        
*/
    
    TD.prototype.objsCache = function() {

        var me          = this;
        me.win          = $(window);
        me.doc          = $(document);
        me.body         = $('body');

        me.wrapper      = $('.wrapper');
        me.header       = $('header');
        me.smallmenu    = $('.menu-small');
        me.loaderdiv    = $('header .loader');
        me.introText    = $('header .loader p');
        me.introLogo    = $('header .loader img');

        me.versionDiv   = $('header .version');

        me.buttons      = $('.menu-small li a, header li a, .scroll');

        me.mapbtn       = $('.map button, .viewmap');
        me.map_holder   = $('.map');

        me.hero         = $('.hero');
        me.herop        = $('.hero p');
        me.herohr       = $('.hero hr');
        me.heroh1       = $('.hero h1');
        me.cont         = $('.continue');
        me.bgs          = $('.backgrounds')
        me.bg1          = $('.background-1')
        me.bg2          = $('.background-2')
        me.bg3          = $('.background-3')
        me.headerphone  = $('.header-phone')

        // Robot animation objects

        me.stage            = $('.stage');
        me.robo             = $('.robo');
        me.robomobile       = $('.mobile-robot');
        me.robot            = $('.robot');
        me.intro            = $('.intro');
        me.robotHighlight   = $('.robot-highlight');
        me.robot2           = $('.robot-arm1');
        me.robot3           = $('.robot-arm2');
        me.robot2Highlight  = $('.robotarm-highlight1');
        me.robot3Highlight  = $('.robotarm-highlight2');
        me.robothead        = $('.robot-head');
        me.robotvisor       = $('.robot-visor');
        me.robotstick       = $('.robot-stick');
        me.robotbase        = $('.robot-base');
        me.hz               = $('.hitzone');

        me.people           = $('.people li');
        me.work             = $('.work');

    }
 

/*  
    _______________________________________________________
        
    jQuery GO!
    _______________________________________________________
*/
    
    $(document).ready(function() {
        var td = new TD();
        td.init();
    });