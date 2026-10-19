$(document).ready(function() {
    if(!$('#trotimetableinfo-search').length) return;

    let runningSearch = null;
    const container = $('#trotimetableinfo-search'),
        route = {
            origin: $('.autofill-stop[name*="origin"]').data('initial') || {value: '', text: ''},
            destination: $('.autofill-stop[name*="destination"]').data('initial') || {value: '', text: ''}
        },
        searchEventFactory = function(routeId) {
            return function(query, callback) {
                const data = [
                    {name: 'tx_trotimetableinfo_timetable[ajax]', value: 'autofill-stop'},
                    {name: 'tx_trotimetableinfo_timetable[query]', value: query}
                ];

                if(runningSearch !== null) runningSearch.abort();

                runningSearch = $.ajax({
                    url: container.data('url'),
                    method: 'POST',
                    data: $.param(data),
                    dataType: 'json'
                })
                .done(function(result) {
                    if(result.success) {
                        callback(result.data.filter(function(dataRoute) {
                            return dataRoute.value !== route[routeId].value;
                        }));
                    }
                });
            }
        };

    container.on('click', '.bootstrap-autocomplete .dropdown-item', function(event) {
        event.preventDefault();
    });

    $('.autofill-stop[name*="origin"]').autoComplete({
        resolver: 'custom',
        bootstrapVersion: 4,
        events: {
            search: searchEventFactory('destination')
        }
    });
    $('.autofill-stop[name*="destination"]').autoComplete({
        resolver: 'custom',
        bootstrapVersion: 4,
        events: {
            search: searchEventFactory('origin')
        }
    });

    if(route.origin.value) $('.autofill-stop[name*="origin"]').autoComplete('set', route.origin);
    if(route.destination.value) $('.autofill-stop[name*="destination"]').autoComplete('set', route.destination);

    $('.autofill-stop[name*="origin"]').prop('required', true);
    $('.autofill-stop[name*="destination"]').prop('required', true);
    $('#timing-departure, #timing-arrival').prop('required', true);

    const datePicker = new Lightpick({
        field: $('#date-picker')[0],
        format: 'DD.MM.YYYY',
        minDate: moment($('#date-picker').val(), 'DD.MM.YYYY')
    });

    const timePicker = new Timepick({
        field: $('#time-picker')[0]
    });

    $('.autofill-stop').on('autocomplete.select', function(event, item) {
        if($(this).is('[name*="origin"]')) {
            route.origin = item;
        } else {
            route.destination = item;
        }
    });

    $('.change_direction').click(function() {
        const origin = route.origin;

        route.origin = route.destination;
        route.destination = origin;

        if(route.origin.value) {
            $('.autofill-stop[name*="origin"]').autoComplete('set', route.origin);
        } else {
            $('.autofill-stop[name*="origin"]').autoComplete('set', '');
        }

        if(route.destination.value) {
            $('.autofill-stop[name*="destination"]').autoComplete('set', route.destination);
        } else {
            $('.autofill-stop[name*="destination"]').autoComplete('set', '');
        }
    });

    $('#routes').on('click', '.station-list .show-via', function() {
        $(this).closest('.station-list').addClass('unfolded');
    });

    $('#routes').on('click', '.station-list .hide-via', function() {
        $(this).closest('.station-list').removeClass('unfolded');
    });

    $('.trotimetableinfo-list-form').submit(function(event) {
        event.preventDefault();

        const where = $(this).data('where'),
            button = $(this).find('button');

        button.prop('disabled', true);

        $.ajax({
            url: container.data('url'),
            method: 'POST',
            data: $(this).serialize(),
            dataType: 'json'
        })
        .done(function(result) {
            if(!result.success) return;

            if(where === 'before') {
                $('#routes').prepend(result.data.html);

                $('#earlier-date').val(result.data.earlierDate);
                $('#earlier-time').val(result.data.earlierTime);
            } else {
                $('#routes').append(result.data.html);

                $('#later-date').val(result.data.laterDate);
                $('#later-time').val(result.data.laterTime);
            }

            button.prop('disabled', false);
        });
    });

    $('#routes').on('click', '.print-route', function() {
        $('body').addClass('print-route-active');

        $('body').append(
            '<div id="print-view">' +
                $('.fahrplan_head')[0].outerHTML +
                $(this).closest('.route')[0].outerHTML +
            '</div>'
        );

        window.print();
    });

    $(window).on('afterprint', function() {
        $('body').removeClass('print-route-active');

        $('#print-view').remove();
    });

    $('.trotimetableinfo-search-container').click(function() {
        $('#trotimetableinfo-search').addClass('open');
    });

    $('.trotimetableinfo-search-backdrop').click(function() {
        $('#trotimetableinfo-search').removeClass('open');
    });

    $('#stop-select').selectpicker({
        liveSearch: true,
        liveSearchPlaceholder: 'Haltestelle auswählen',
        noneSelectedText: 'Haltestelle auswählen',
        noneResultsText: 'Haltestelle {0} nicht gefunden'
    });

    $('#stop-select').on('show.bs.select', function() {
        const select = $(this),
            data = [
                {name: 'tx_trotimetableinfo_timetable[ajax]', value: 'stop-list'},
            ];
            
        select.selectpicker('refresh');

        if(select.find('option').length > 1) return;

        $.ajax({
            url: container.data('url'),
            method: 'POST',
            data: $.param(data),
            dataType: 'json'
        })
        .done(function(result) {
            if(!result.success) return;
            
            select.html('');

            result.data.forEach(function(stop) {
                select.append('<option value="'+stop.assid+'">'+stop.title+'</option>');
            });

            select.selectpicker('refresh');
        });
    });
});