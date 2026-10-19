$(document).ready(function() {
    if(!$('#tx-troplatform').length) return;
    
    $('#start, #stop, #bikeamount, #termsofuse').prop('required', true);
    $('form[name="newOrder"]').attr('novalidate', true);

    const container = $('#tx-troplatform'),
        formData = {
            data: {},
            setData: function(name, value) {
                this.data[name] = value;
            },
            isValid: function() {
                return Object.values(this.data).filter(function(data) {
                    return !data;
                }).length === 0;
            },
            invalidFields: function() {
                const invalid = [];

                for(let name in this.data) {
                    if(!this.data[name]) {
                        invalid.push(name);
                    }
                }
                return invalid;
            },
            update: function() {
                ['start', 'stop', 'ordertime', 'name', 'email', 'bikeamount', 'termsofuse', 'orderdate'].forEach(function(field) {
                    const element = $('#'+field);

                    formData.setData(field, element.is('[type="checkbox"]') ? element.prop('checked') : element.val());
                });
            }
        };

    function buildDistancePlan() {
        $('.distance-plan .route, .distance-plan .visualized').html('');
        $('.distance-plan').toggleClass('show', !!($('#start').val() && $('#stop').val()));

        if($('#start').val() && $('#stop').val()) {
            const start = container.data('distancePlanStops').findIndex(function(stop) {return stop.uid === parseInt($('#start').val());}),
                end = container.data('distancePlanStops').findIndex(function(stop) {return stop.uid === parseInt($('#stop').val());}),
                stops = container.data('distancePlanStops').slice(Math.min(start, end), Math.max(start, end) + 1);

            (start > end ? stops.reverse() : stops).forEach(function(stop) {
                $('.distance-plan .route').append('<div class="stop">'+stop.title+'</div>');
                $('.distance-plan .visualized').append('<div class="stop"></div>');
            });
        }
    }

    function updateChooseTime() {
        $('.choose-time .times').html('');
        $('.choose-time').toggleClass('show', !!($('#start').val() && $('#stop').val() && $('#orderdate').val()));
        $('#ordertime').val('');

        if($('#start').val() && $('#stop').val() && $('#orderdate').val()) {
            const data = $.param([
                    {name: 'tx_troplatform_platform[controller]', value: 'Order'},
                    {name: 'tx_troplatform_platform[action]', value: 'chooseTime'},
                    {name: 'tx_troplatform_platform[start]', value: $('#start').val()},
                    {name: 'tx_troplatform_platform[stop]', value: $('#stop').val()},
                    {name: 'tx_troplatform_platform[date]', value: $('#orderdate').val()},
                    {name: 'tx_troplatform_platform[route]', value: container.data('routeId')},
                    {name: 'tx_troplatform_platform[bikeamount]', value: container.data('bikeAmount')}
                ]);

            $('.choose-time .times').append('<div class="spinner"><i class="fas fa-circle-notch fa-spin fa-3x"></i></div>');

            $.ajax({
                url: container.data('apiUrl'),
                method: 'POST',
                data: data,
                dataType: 'json'
            }).done(function(res) {
                for(let time in res) {
                    const bikes = res[time];

                    $('.choose-time .times .spinner').remove();
                    $('.choose-time .times').append(
                        '<div class="time'+(bikes < parseInt($('#bikeamount').val()) ? ' unavailable' : '')+'" time="'+time+'" bikes="'+bikes+'">' +
                            '<span class="clock">'+time+'</span>' +
                            '<span class="bikes">'+bikes+' <i class="fas fa-bicycle"></i></span>' +
                        '</div>'
                    );
                }
            });
        }
    }

    function parseDate(date, time) {
        let gmt = new Date().toTimeString().match(/(GMT[+-][\d]{4})/g)[0].replace('GMT', '');
        const dates = date.split('.'),
            times = time.split(':'),
            year = dates[2],
            month = dates[1],
            day = dates[0],
            hour = times[0],
            minute = times[1],
            second = times[2] || '00',
            offset = gmt.substr(0, 3)+':'+gmt.substr(3, 2);

        return year+'-'+month+'-'+day+'T'+hour+':'+minute+':'+second+offset;
    }

    const datePicker = new Lightpick({
        field: $('#orderdate')[0],
        format: 'DD.MM.YYYY',
        minDate: moment(container.data('datepickerOptions').minDate, 'DD.MM.YYYY'),
        maxDate: moment(container.data('datepickerOptions').maxDate, 'DD.MM.YYYY'),
        disableDates: (function() {
            let currentDate = moment(container.data('datepickerOptions').minDate, 'DD.MM.YYYY');
            const endDate = moment(container.data('datepickerOptions').maxDate, 'DD.MM.YYYY'),
                allowedDates = container.data('datepickerOptions').holidays,
                disabledDates = [];

            while(currentDate.isBefore(endDate)) {
                if(!allowedDates.includes(currentDate.format('DD.MM.YYYY'))) {
                    disabledDates.push(currentDate.format('DD.MM.YYYY'));
                }
                
                currentDate.add(1, 'd');
            }

            console.log(disabledDates);

            return disabledDates.map(function(date) { return moment(date, 'DD.MM.YYYY') });
        })(),
        onSelect: function() {
            updateChooseTime();
        }
    });

    /* $('#orderdate').datepicker({
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        minDate: new Date(container.data('datepickerOptions').minDate),
        maxDate: new Date(container.data('datepickerOptions').maxDate),
        beforeShowDay: function(date) {
            const holidays = Object.values(container.data('datepickerOptions').holidays);

            return [holidays.includes(date.getTime()), ''];
        },
        onSelect: function() {
            updateChooseTime();
        }
    }); */

    $('#start').change(function() {
        $('#stop option').prop('disabled', false);

        if($(this).val()) {
            if($(this).val() === $('#stop').val()) {
                $('#stop').val('');
            }

            $('#stop option[value="'+$(this).val()+'"]').prop('disabled', true);
        }

        buildDistancePlan();
        updateChooseTime();
    });

    $('#stop').change(function() {
        buildDistancePlan();
        updateChooseTime();
    });

    $('.choose-time').on('click', '.time', function() {
        if(parseInt($(this).attr('bikes')) >= parseInt($('#bikeamount').val()) && parseInt($(this).attr('bikes')) > 0) {
            const date = parseDate($('#orderdate').val(), $(this).attr('time'));

            $('.choose-time .time.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#ordertime').val(date);
        }
    });

    $('#bikeamount').change(function() {
        const bikeamount = parseInt($('#bikeamount').val());

        $('.choose-time .time').each(function() {
            if(parseInt($(this).attr('bikes')) < bikeamount) {
                $(this).removeClass('selected').addClass('unavailable');
            } else {
                $(this).removeClass('unavailable');
            }
        });

        if(!$('.choose-time .time.selected').length) {
            $('#ordertime').val('');
        }
    });

    $('form[name="newOrder"]').submit(function(event) {
        formData.update();

        if(!formData.isValid()) {
            event.preventDefault();

            formData.invalidFields().forEach(function(field) {
                $('label[for="'+field+'"]').addClass('invalid');
            });
        }
    });

    $('form[name="newOrder"]').on('input, change', 'input, select', function() {
        $('label[for="'+$(this).attr('id')+'"]').toggleClass('invalid', !$(this).val());
    });
});
