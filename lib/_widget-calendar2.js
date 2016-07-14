var ViewBinder = require('alpha-view-binder/view-binder');
var $ = require('alpha-jquery/jquery');

var Calendar = require('alpha-calendar/calendar');
// var Moment = require('alpha-svn/js/6v/lib/gallery/moment/moment');


// <div bd-widget-calendar2="date2"
//         data-calendar-format="yyyy-MM-dd" ></div>


/**
 * DO NOT USE！
 * Incomplete Implementation
 */
module.exports = {
    init: function() {
        ViewBinder.addCommand('widget-calendar2', {
            bindUI: function() {
                var $el = this.element;
                var self = this;

                var defaultValue = this.links.get();

                var newKey;
                var widgetConfig = {};
                $.each(this.options, function(key, value) {
                    if (key.indexOf('calendar') !== 0) {
                        return;
                    }
                    // convert key: prefixParam -> param
                    key = key.slice('calendar'.length);
                    newKey = key.substring(0,1).toLowerCase() + key.substring(1);
                    widgetConfig[newKey] = value;
                });

                // need deep-copy, resolving property`s value with json format
                widgetConfig = $.extend(true, {
                    parentNode: $el,
                    rangeStart: '2016-03-27'
                }, widgetConfig);

                var instance = new Calendar(widgetConfig);
                instance.on('selected',function(data) {
                    self.links.set(data.formatValue);
                });

                // set default value
                instance.setValue(defaultValue);

                // trigger popup show while clicking input dom
                instance._getValEl().on('click', function() {
                    instance._doShowCalendar();
                });

                this.__instance__ = instance;
            },
            refresh: function() {
                if (!this.__instance__) {
                    return;
                }

                var value = this.links.get();
                this.__instance__.setValue(value);
            },
            destroy: function() {
                this.__instance__.destroy();
            }
        });
    }
};
