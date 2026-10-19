$(document).ready(function() {
    $('.tro-tile-navigation a[data-event-counter]').click(function() {
        const url = $(this).closest('.tro-tile-navigation').data('url'),
            data = [
                {name: 'tx_troviewcounter_tilenavigation[ajax]', value: 'update-event'},
                {name: 'tx_troviewcounter_tilenavigation[uid]', value: $(this).data('uid')}
            ];

        if($(this).data('event-counter-updated')) return;

        $(this).data('event-counter-updated', true);

        $.ajax({
            url: url,
            method: 'POST',
            data: $.param(data),
            dataType: 'json'
        });
    });

    $('.tro-tile-navigation a[data-event-counter][data-toggle="collapse"]').click(function() {
        const collapse = $($(this).attr('href'));

        if(!$(this).data('collapseSettings')) {
            const currentTop = $(this).closest('.tile').offset().top,
                collapseLast = $(this)
                    .closest('.tro-tile-navigation')
                    .find('.tile')
                    .filter(function() {
                        return $(this).offset().top === currentTop;
                    }).last(),
                collapsePosition = parseInt(collapseLast.css('order')) + 5;

            $(this).data('collapseSettings', {
                collapsePosition: collapsePosition,
            });
        }

        collapse.css({order: $(this).data('collapseSettings').collapsePosition});
    });

    $('.tro-tile-navigation .tile').each(function() {
        $(this).css('order', $(this).data('order'));
    });

    $(window).on('resize', function() {
        $('.tro-tile-navigation a[data-event-counter][data-toggle="collapse"]').data('collapseSettings', null);
    });
});