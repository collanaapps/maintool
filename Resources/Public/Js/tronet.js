// Tronet JS

$.fn.dropdown = (function() {
    var $bsDropdown = $.fn.dropdown;
    return function(config) {
        if (typeof config === 'string' && config === 'toggle') { // dropdown toggle trigged
            $('.has-child-dropdown-show').removeClass('has-child-dropdown-show');
            $(this).closest('.dropdown').parents('.dropdown').addClass('has-child-dropdown-show');
        }
        var ret = $bsDropdown.call($(this), config);
        $(this).off('click.bs.dropdown'); // Turn off dropdown.js click event, it will call 'this.toggle()' internal
        return ret;
    }
})();

$(function() {
    $('.dropdown [data-toggle="dropdown"]').on('click', function(e) {
        $(this).dropdown('toggle');
        e.stopPropagation();
    });
    $('.dropdown').on('hide.bs.dropdown', function(e) {
        if ($(this).is('.has-child-dropdown-show')) {
            $(this).removeClass('has-child-dropdown-show');
            e.preventDefault();
        }
        e.stopPropagation();
    });
});

$(document).ready(function() {
    for(let i = 1; i < 21; i++) {
        $('.matchheight[mh-group="'+i+'"]').length && $('.matchheight[mh-group="'+i+'"]').matchHeight({ byRow: false });
    }

    $('[id^="news-container"] .card-text').matchHeight({ byRow: false });

    const pswp = $('.pswp')[0];

    $('.lightbox').click(function(event) {
        const src = $(this).attr('href'),
            rel = $(this).attr('rel'),
            items = $('.lightbox[rel="'+rel+'"]').map(function() {
                return {
                    src: $(this).attr('href'),
                    w: $(this).data('lightbox-width'),
                    h: $(this).data('lightbox-height')
                };
            }).get(),
            options = {
                index: items.findIndex(function(item) {
                    return item.src === src;
                }),
                clickToCloseNonZoomable: false,
                closeOnScroll: false
            },
            gallery = new PhotoSwipe(pswp, PhotoSwipeUI_Default, items, options);

        gallery.init();
        gallery.listen('afterChange', function() {
            $('.pswp__thumb').removeClass('active');
            $('.pswp__thumb[data-index="'+gallery.getCurrentIndex()+'"]').addClass('active');
        });

        if($('.pswp__thumbnails_scrollbox').length) {
            $('.pswp__thumbnails_scrollbox').text('');
        } else {
            $('.pswp__scroll-wrap').append('<div class="pswp__thumbnails"><div class="pswp__thumbnails_scrollbox"></div></div>');
        }

        items.forEach(function(item, index) {
            $('.pswp__thumbnails_scrollbox').append(
                '<a class="pswp__thumb" data-index="'+index+'" style="background-image: url('+item.src+'")"></a>'
            );
        });

        $('.pswp__thumbnails_scrollbox').css({width: (items.length * 6.5)+'rem'});
        $('.pswp__thumb[data-index="'+options.index+'"]').addClass('active');
        $('.pswp__thumb').click(function() {
            $('.pswp__thumb').removeClass('active');
            $(this).addClass('active');

            gallery.goTo(parseInt($(this).data('index')));
        });

        event.preventDefault();
    });

    $('.collapse-container').each(function() {
        $(this).find('.collapse-container-box').each(function(index) {
            $(this).css('order', index*10+10);
        });
    });

    $('.collapse-container .newsbox_mehr[data-toggle="collapse"]').click(function() {
        const collapse = $($(this).data('target'));

        if(!$(this).data('collapseSettings')) {
            const currentTop = $(this).closest('.collapse-container-box').offset().top,
                collapseLast = $(this)
                    .closest('.collapse-container')
                    .find('.collapse-container-box')
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

    /* $(window).on('load', function() {
        $('.masonry').each(function() {
            const top = $(this).offset().top;
            let bottom = top;

            $(this).find('.masonry-item').each(function() {
                let thisBottom = $(this).offset().top + $(this).outerHeight() + parseFloat($(this).css('margin-bottom'));

                if(thisBottom > bottom) bottom = thisBottom;
            });

            $(this).height(Math.ceil(bottom - top));
        });
    }); */

    $(window).on('resize', function() {
        $('.collapse-container .newsbox_mehr[data-toggle="collapse"]').data('collapseSettings', null);

        /* $('.masonry').each(function() {
            $(this).css('height', '');

            const top = $(this).offset().top;
            let bottom = top;

            $(this).find('.masonry-item').each(function() {
                let thisBottom = $(this).offset().top + $(this).outerHeight() + parseFloat($(this).css('margin-bottom'));

                if(thisBottom > bottom) bottom = thisBottom;
            });

            $(this).height(Math.ceil(bottom - top));
        }); */
    });

    $(window).on('message', function(event) {
        const data = JSON.parse(event.originalEvent.data);

        if(data && data.id === 'scroll-height') {
            $('iframe[seamless]').height(data.data);
        }
    });

    $('.tro-verkaufsstelle a[href^="javascript:linkTo_UnCryptMailto"]').addClass('stretched-link').append(' <i class="fas fa-envelope mail-icon"></i>');

    $('.externer_link').addClass('btn newsbox_mehr').html('<i class="las la-external-link-alt"></i>');
    $('.interner_link').addClass('btn newsbox_mehr').html('<i class="las la-link"></i>');
    $('.download_link').addClass('btn newsbox_mehr').html('Download <i class="la la-cloud-download"></i>');
});


// JS für Dropdown
// Code aus https://jira.tro.net/browse/RSVG-126
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggles = document.querySelectorAll('[data-toggle="dropdown"]');
    dropdownToggles.forEach(toggle => {
        const menuId = toggle.getAttribute('aria-controls');
        const menu = document.getElementById(menuId);
        // Initial ARIA-Zustände setzen
        toggle.setAttribute('aria-expanded', 'false');
        if (menu) {
          menu.hidden = true;
        }
        // Öffnen/Schließen per Klick
        toggle.addEventListener('click', function(e) {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            menu.hidden = expanded;
            if (!expanded) { // Fokus auf ersten Menüpunkt setzen 
                const firstItem = menu.querySelector('[role="menuitem"]'); if (firstItem) firstItem.focus(); }
            });
          // Tastatursteuerung
          toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggle.click();
            }
          });
          // Escape zum Schließen
          if (menu) {
            menu.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') {
                toggle.setAttribute('aria-expanded', 'false');
                menu.hidden = true;
                toggle.focus();
              }
            });
            // Klick außerhalb schließt das Menü
            document.addEventListener('click', function(e) {
              if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                toggle.setAttribute('aria-expanded', 'false');
                menu.hidden = true;
              }
            });
          }
        });
});
    
// JS für Focus Trap (wichtig für tastaturbedienung)
// Code aus https://jira.tro.net/browse/RSVG-126
document.addEventListener('DOMContentLoaded', function() {
    const toggler = document.querySelector('[data-toggle="offcanvas"]');
    const menu = document.getElementById(toggler?.getAttribute('aria-controls'));
    const focusableSelectors = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

    function trapFocus(container) {
      const focusableEls = container.querySelectorAll(focusableSelectors);
      const firstFocusableEl = focusableEls[0];
      const lastFocusableEl = focusableEls[focusableEls.length - 1];
      container.addEventListener('keydown', function(e) {
        const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
        if (!isTabPressed) return;
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableEl) {
            e.preventDefault();
            lastFocusableEl.focus();
          }
        } else {
          if (document.activeElement === lastFocusableEl) {
            e.preventDefault();
            firstFocusableEl.focus();
          }
        }
      });
    }

    function openMenu() {
      toggler.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
      trapFocus(menu); // Fokus auf erstes Element im Menü setzen 
      const firstItem = menu.querySelector(focusableSelectors); if (firstItem) firstItem.focus(); }
      function closeMenu() {
        toggler.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        toggler.focus();
      }
      toggler.addEventListener('click', function() {
        const expanded = toggler.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          closeMenu();
        } else {
          openMenu();
        }
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && toggler.getAttribute('aria-expanded') === 'true') {
          closeMenu();
        }
      });
      // Optional: Klick außerhalb schließt das Menü
      document.addEventListener('click', function(e) {
        if (toggler.getAttribute('aria-expanded') === 'true' && !menu.contains(e.target) && !toggler.contains(e.target)) {
          closeMenu();
        }
      });      
});
