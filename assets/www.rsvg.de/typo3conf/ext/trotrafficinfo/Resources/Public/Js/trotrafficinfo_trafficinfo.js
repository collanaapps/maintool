$(document).ready(function() {
    if(!$('.tx_trotrafficinfo').length) return;

    $('#line').change(function() {
        $(this).closest('form').submit();
    });
});