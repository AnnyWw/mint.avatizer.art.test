(function ($) {
    $("#up").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 500);
        return false;
    });

    var FSHeight = $("#first_screen_wrap").innerHeight();
    $(window).on('scroll', function () {
        const position = $(this).scrollTop();
        if (position >= FSHeight) {
            $("#up").css('opacity','1');
        } else {
            $("#up").css("opacity", "0");
        }
    });
})(jQuery);
