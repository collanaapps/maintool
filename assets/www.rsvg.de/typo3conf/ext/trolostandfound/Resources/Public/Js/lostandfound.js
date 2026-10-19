$(document).ready(function() {
    const container = $('.tx-trolostandfound');

    if(!container.length) return;

    const datePicker = new Lightpick({
        field: container.find('.found-date')[0],
        format: 'DD.MM.YYYY',
    });
});