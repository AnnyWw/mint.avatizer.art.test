$(".manage-checkbox").click(function () {
    if ($(this).is(":checked")) {
        $(this).parents('.modal-body--content').removeClass('paused').addClass('active');
        $('.generic-status').text('Active');
        $('.generic-status').removeClass('paused').addClass('active');
    } else {
         $(this).parents('.modal-body--content').removeClass('active').addClass('paused');
        $('.generic-status').text('Paused');
        $('.generic-status').removeClass('active').addClass('paused');
    }
});
