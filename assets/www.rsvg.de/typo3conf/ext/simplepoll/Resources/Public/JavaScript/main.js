var cookieBlock = '{settings.cookieBlock}';

$(document).ready(function() {

    // this is the ajax override for the vote button
    $('#simplePollVote').on('click', function(e) {
        if (cookieBlock == '1' || cookieBlock == 'true') {
            if ( ! navigator.cookieEnabled) {
                alert('Cookies need to be activated.');
                return false;
            }
        }

        // if no radio button is active, don't do anything
        if ($('input[class=simplePollRadioClass]:checked').length === 0) {
            return false;
        }

        var form = $('#simplePollForm');
        $.post(form.data('ajax-url'), form.serialize(), function(response) {
            // replace the contents of the simple poll with the view returned from PHP
            $('.simplePollWrap').replaceWith($(response).find('.simplePollWrap'));
        });

        return false;
    });

    // this is the ajax override for the see votes link
    $('#simplePollSeeVotes').on('click', function(e) {
        $.post($(this).data('ajax-url'), function(response) {
            // replace the contents of the simple poll with the view returned from PHP
            $('.simplePollWrap').replaceWith($(response).find('.simplePollWrap'));
        });

        return false;
    });

});