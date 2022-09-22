

if (typeof ($.urlParam) !== "function") {
    $.urlParam = function (_1, _2) {
    	var _3 = new RegExp("[\\?&]" + _1 + "=([^&#]*)").exec(_2);
    	if (!_3) {
    		return 0;
    	}
    	return _3[1] || 0;
    };
}

if (typeof (setCookie) !== "function") {
	setCookie = function(name, value, days) {
	   // var location = String(window.location);
	    
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	        var expires = "; expires=" + date.toGMTString();
	    } else
	        var expires = "";
	    document.cookie = name + "=" + value + expires + "; path=/";
	}
}

if (typeof (getCookie) !== "function") {
	getCookie = function(name) {
	    //var location = String(window.location);
	    
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for (var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ')
	            c = c.substring(1, c.length);
	        if (c.indexOf(nameEQ) == 0)
	            return c.substring(nameEQ.length, c.length);
	    }
	    return null;
	}
}
if (typeof ($.preloadImage) !== "function") {
    $.preloadImage = function() {
                    this.each(function(){
                    $('<img/>')[0].src = this;
                        });
    };
}

$('#copied').click(function() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('#copy-text').text()).select();
    document.execCommand("copy");
    $temp.remove();
    $(this).addClass('done');
  });




$(document).ready(function () {


    $('.img-parallax').each(function(){
        var img = $(this);
        var imgParent = $(this).parent();
        function parallaxImg () {
            var speed = img.data('speed');
            var imgY = imgParent.offset().top;
            var winY = $(this).scrollTop();
            var winH = $(this).height();
            var parentH = imgParent.innerHeight();


            // The next pixel to show on screen      
            var winBottom = winY + winH;

            // If block is shown on screen
            if (winBottom > imgY && winY < imgY + parentH) {
            // Number of pixels shown after block appear
            var imgBottom = ((winBottom - imgY) * speed);
            // Max number of pixels until block disappear
            var imgTop = winH + parentH;
            // Porcentage between start showing until disappearing
            var imgPercent = ((imgBottom / imgTop) * 100) + (50 - (speed * 50));
            }
            img.css({
            top: imgPercent + '%',
            transform: 'translateY(-' + imgPercent + '%)'
            });
        }
        $(document).on({
            scroll: function () {
            parallaxImg();
            }, ready: function () {
            parallaxImg();
            }
        });
    });

    $(".scrollTo").bind('click', function () {
        
        if ($.scrollTo !== undefined)
        {
            if($(this).attr('href').indexOf('#') == 0)
            {
                $.scrollTo($(this).attr('href'), 600);
            
                return false;
            }
        }
        
        
        
    });
    
    
    if ($.colorbox !== undefined) {
     
        $(".colorbox, .screenshot").colorbox({opacity:0.6, speed:200});
      
        $(".overlay").colorbox({
            iframe: true,
			title:'',
			notshowbtns: true, 
			scrolling: false,
			opacity:0.6,
			speed:200,
            innerHeight: function () {
                return $.urlParam("height", $(this).attr("href"));
            },
            innerWidth: function () {
                return $.urlParam("width", $(this).attr("href"));
            },
/*            href: function () {
                return $.urlParam('href', $(this).attr('href'));
            },*/
            onOpen: function(){
                activeScroll = true;
            },
            onClosed: function(){
                activeScroll = false;
            }
        });
    } //end colorbox
    
 
    (function ($) {
        $('a[href*=#].anchor').bind("click", function(e){
            var anchor = $(this);
			var dst = $(anchor.attr('href'));
			if(dst.offset() !== undefined){
            	$('html, body').stop().animate({
                	scrollTop: dst.offset().top
            	}, 1000);
			}

            var wh = $(window).width();
            if(wh <= 768){
                if(dst.offset() !== undefined){
                    $('html, body').stop().animate({
                        scrollTop: dst.offset().top - 50
                    }, 1000);
                }
            }
            e.preventDefault();
        });
        return false;
    })(jQuery);
    
    //function showing a youtube video in iframe
    (function($) {
        $('.if-video').each(function () {
            var parent = $(this).parent('div');
            var myVideo = $(this);

            if (parent.length > 0) {
                var play = parent.find('.play:not(.mobile)');
                if (play.length == 0 || play === undefined || play == "undefined") {
                    play = parent.find('.play-new:not(.mobile)');
                }

                if (play.length > 0) {
                    play.bind('click', function () {
                        $(this).parent('.controls').addClass('hidden').hide();
                        myVideo.attr('src', myVideo.attr('data-src'));
                        myVideo.fadeIn(1500);
                    });
                }
            }
        });

        var play = $('.play:not(.mobile, .overlay)');
        if (play.length == 0 || play === undefined || play == "undefined") {
            play = $('.play-new:not(.mobile, .overlay)');
        }

        $('#videoModal').on('show.bs.modal', function (e) {
            setTimeout(function () {
                play.click();
            }, 200)
        });
        play.on('click', function (event) {
            
            var playThis = event.target.closest('a');
            var play_src = $(playThis).attr("data-src");
            var controls = $(playThis).parent();
            var embedHgPr = controls.parent().height();
            var embedHg = controls.nextAll('img').height();
            var iframeEl = $('<iframe></iframe>').attr({ class: "embed-responsive-item", src: play_src, id: 'video', allow:'autoplay; fullscreen'});
            controls.addClass('embed-responsive embed-responsive-16by9').css({'width':'100%', 'padding-bottom': embedHgPr, 'height':embedHg, 'position':'relative'});
            controls.nextAll('img').remove();
            controls.html(iframeEl);
            iframeEl[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            return false;
        }) ;
    })(jQuery);

    /* replace retina src images if use class image2x */
    var image2x = function () {
        //console.log('images2x');
        var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;

        //var pixelRatio = 2; //hidden for retina

        // verify the existence of the file
        var use_if_file_exists = false;

        if (pixelRatio > 1)
        {
            if (use_if_file_exists){
                var http = new XMLHttpRequest();
            }
            __handleBgImageTo2xBg(use_if_file_exists);

            var els = jQuery("img.image2x").get();

            var len = els.length;

            for(var i = 0; i < len; i++)
            {
                var src = els[i].src;
                var data_src = $(els[i]).data('src');
                var data_srcset = $(els[i]).data('srcset');
                var srcset = $(els[i]).attr('srcset');
                var source = $(els[i]).siblings('source').get();

                if(data_src == undefined){
                    data_src = '';
                }
                if(data_srcset == undefined){
                    data_srcset = '';
                }
                if(srcset == undefined){
                    srcset = '';
                }

                src = __replaceImgTo2Img(src);
                data_src = __replaceImgTo2Img(data_src);
                data_srcset = __replaceImgTo2Img(data_srcset);
                srcset = __replaceImgTo2Img(srcset);
                reolaceSrcset(source);
                if (use_if_file_exists)
                {
                    if (UrlExists(src))
                    {
                        $(els[i]).attr({'src' : src, 'data-src' : data_src, 'data-srcset' : data_srcset, 'srcset' : srcset});
                    }
                }
                else
                {

                    $(els[i]).attr({'src' : src, 'data-src' : data_src, 'data-srcset' : data_srcset, 'srcset' : srcset});
                }


            }
        }

        function __handleBgImageTo2xBg(useIfFileExists) {
            jQuery('.image2x[data-background-image]').each(function (i, el) {
                var jQueryEl = $(el);
                var data_background_image = $(els[i]).data('background-image');

                if (useIfFileExists) {
                    // Example: jQueryEl.css('backgroundImage') = url("/images/upload/bkg-cover/bgHeadLand@2x.jpg")
                    if (UrlExists(__replaceImgTo2Img(data_background_image.substring(5, (data_background_image.length - 2))))) {
                        __replaceBgImageTo2xBg(jQueryEl);
                    }
                } else {
                    __replaceBgImageTo2xBg(jQueryEl);
                }
                return true;
            });
        }

        function __replaceBgImageTo2xBg(jQueryEl) {
            jQueryEl.attr('data-background-image', __replaceImgTo2Img(jQueryEl.data('background-image')));
        }

        function __replaceImgTo2Img(currentString) {
            if (currentString.match('@2x')) {
                return currentString;
            }else{
                return currentString.replace('.png', '@2x.png')
                    .replace('.jpg', '@2x.jpg')
                    .replace('.webp', '@2x.webp');
            }
        }

        function reolaceSrcset(els)
        {
            var len = els.length;
            for(var i = 0; i < len; i++) {
                var src = els[i].srcset;
                els[i].srcset = __replaceImgTo2Img(src);
            }
        }

        function UrlExists(url)
        {
            http.open('HEAD', url, false);
            http.send();
            return http.status!=404;
        }


    };

    /*--------------------------------*/
    /* START init lazyload */
    if (typeof lozad == 'function') {
        if( initLazyload == undefined){
            var initLazyload = function(){
                lozad('.lazyload',{
                    loaded: function(el){el.classList.remove('lazyload')}												}
                ).observe();


                image2x();

                $(window).load(function () {
                    $(document).trigger('scroll', {detail: 'Display on trigger...'});
                });
            };
        };

        initLazyload();

    }else{
        image2x();
    };
    /* STOP init lazyload */
    
});

document.addEventListener("DOMContentLoaded", function(event) {
    $('body').addClass('loaded');
});

/* add Web3modal */
$('#connect').click(function(){
    console.log("here")
})