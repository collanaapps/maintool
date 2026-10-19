$(document).ready(function() {
    const form = $('#search-form'),
        baseUrl = (function() {
            const link = document.createElement('a');

            link.href = form[0].action;

            return link.origin + '/?type=1591185322';
        })();

    form.append('<div class="dropdown-menu"></div>');

    const dropdown = form.find('.dropdown-menu');
    let ajaxRequest = null;

    function highlightSearch(search, text) {
        const index = text.toLowerCase().indexOf(search.toLowerCase()),
            start = Math.max(index - 15, 0),
            end = Math.min(index + search.length + 15, text.length - 1),
            escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        return text
            .slice(start, end)
            .trim()
            .replace(new RegExp('('+escapedSearch+')', 'gi'), '<b>$&</b>');
    }

    $('#tx-indexedsearch-searchbox-sword').on('input', function() {
        if(ajaxRequest !== null) ajaxRequest.abort();

        if($(this).val().length < 3) {
            dropdown.removeClass('show');

            return;
        }

        const search = $(this).val(),
            data = form.serializeArray().concat([
                {name: 'tx_indexedsearch_pi2[livesearch]', value: '1'}
            ]);

        ajaxRequest = $.ajax({
            url: baseUrl,
            method: 'POST',
            data: $.param(data),
            dataType: 'json'
        })
        .done(function(result) {
            dropdown.html('');

            if(result && result.length) {
                result.slice(0, 5).forEach(function(resultPage) {
                    dropdown.append(
                        '<a href="'+resultPage.link+'" class="dropdown-item">' +
                            '<span class="d-block page-title">'+resultPage.title+'</span>' +
                            '<span class="d-block small page-description text-truncate">&hellip;'+highlightSearch(search, resultPage.description)+'&hellip;</span>' +
                        '</a>'
                    );
                });
            } else {
                dropdown.append('<span class="dropdown-item disabled">Keine Ergebnisse gefunden.</span>')
            }

            dropdown.addClass('show');
        });
    });

    $('#tx-indexedsearch-searchbox-sword').focus(function() {
        if($(this).val().length < 3 || dropdown.find('.dropdown-item').length === 0) return;

        dropdown.addClass('show');
    });

    $('body').click(function(event) {
        if(!dropdown.is('.show') || $(event.target).is('#tx-indexedsearch-searchbox-sword') || $(event.target).closest('#search-form .dropdown-menu').length) return;

        dropdown.removeClass('show');
    });
});