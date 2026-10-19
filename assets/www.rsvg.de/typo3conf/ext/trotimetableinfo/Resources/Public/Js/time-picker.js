// https://tc39.github.io/ecma262/#sec-array.prototype.find
if(!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function(predicate) {
            if(this == null) throw new TypeError('"this" is null or not defined');
    
            var o = Object(this);
            var len = o.length >>> 0;
    
            if(typeof predicate !== 'function') throw new TypeError('predicate must be a function');
    
            var thisArg = arguments[1];
            var k = 0;
    
            while (k < len) {
                var kValue = o[k];

                if(predicate.call(thisArg, kValue, k, o)) return kValue;
    
                k++;
            }
    
            return undefined;
        },
        configurable: true,
        writable: true
    });
}

function Timepick(userConfig) {
    const id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString(),
        elementFromHtml = function(html) {
            const div = document.createElement('div');
            div.innerHTML = html.trim();

            return div.firstChild;
        };

    document.body.append(elementFromHtml(
        '<section id="timepick-'+id+'" class="timepick timepick__container">' +
            '<div class="timepick__inner">' +
                '<div class="timepick__time">' +
                    '<input type="text" maxlength="2" class="timepick__input timepick__time_hours">' +
                    '<span class="timepick__divider">:</span>' +
                    '<input type="text" maxlength="2" class="timepick__input timepick__time_minutes">' +
                '</div>' +
            '</div>' +
        '</section>'
    ));

    const picker = document.getElementById('timepick-'+id);

    this.hidden = true;
    this.config = {
        field: userConfig.field,
        time: moment(userConfig.field.value, 'HH:mm'),
        picker: picker,
        hourField: picker.querySelector('.timepick__time_hours'),
        minuteField: picker.querySelector('.timepick__time_minutes'),
        id: id
    };

    document.body.addEventListener('click', function(event) {
        if(this.hidden) return;

        const picker = event.path.find(function(element) {
            return element.classList && element.classList.contains('timepick');
        });

        if(typeof picker !== 'undefined') return;

        this.hide();
    }.bind(this));

    this.config.field.addEventListener('focusin', function() {
        this.show();
    }.bind(this));

    this.config.field.classList.add('timepick');

    [this.config.hourField, this.config.minuteField].forEach(function(field) {
        field.addEventListener('keypress', function(event) {
            if(event.key === null || /\d/.test(event.key)) return;

            event.preventDefault();
        }.bind(this));

        field.addEventListener('focusin', function() {
            this.select();
        });

        field.addEventListener('focusout', function() {
            field.value = ('00'+field.value).substr(-2);

            this.config.field.value = this.getValue();
        }.bind(this));
    }, this)
}

Timepick.prototype.show = function() {
    const rect = this.config.field.getBoundingClientRect();

    this.config.picker.style.top = window.scrollY + rect.bottom+'px';
    this.config.picker.style.left = window.scrollX + rect.left+'px';

    this.setValue(this.config.field.value);

    this.config.picker.classList.add('timepick__show');

    this.config.hourField.focus();

    this.hidden = false;
}

Timepick.prototype.hide = function() {
    this.config.field.value = this.getValue();

    this.config.picker.classList.remove('timepick__show');
    this.hidden = true;
}

Timepick.prototype.setValue = function(timestamp) {
    const hours = timestamp.replace(/^(\d{2}):(\d{2})$/, '$1'),
        minutes = timestamp.replace(/^(\d{2}):(\d{2})$/, '$2');

    this.config.hourField.value = hours;
    this.config.minuteField.value = minutes;
}

Timepick.prototype.getValue = function() {
    return this.config.hourField.value + ':' + this.config.minuteField.value;
}