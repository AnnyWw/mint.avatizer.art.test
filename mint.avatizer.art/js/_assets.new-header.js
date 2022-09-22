$(document).ready(function () {

    $(".menu-tab").click(function () {
        $(".main-menu").toggleClass("show");
        $(".menu-tab").toggleClass("active");
    });

    $(document).mouseup(function (e) {
        var container = $(".main-menu");
        var container2 = $(".logo-header")
        if (container.has(e.target).length === 0 && container2.has(e.target).length === 0){
            container.removeClass("show");
            $(".menu-tab").removeClass("active");
        }
    });


});

