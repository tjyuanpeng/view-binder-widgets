var ViewBinder = require('alpha-view-binder/view-binder');

var Calendar = require('alpha-svn/js/6v/lib/icbu/calendar/calendar.js');
var Moment = require('alpha-svn/js/6v/lib/gallery/moment/moment');

module.exports = {
    init: function() {
        ViewBinder.addCommand('widget-calendar', {
            bindUI: function() {
                var $el = this.element;

                var instance = new Calendar({
                    trigger: $el,
                    range : [Moment().format('YYYY-MM-DD'), null]
                }).render().on('selectDate', function() {
                    $el.trigger('blur');
                });

                this.__instance__ = instance;
            },
            refresh: function () {
            },
            destroy: function() {
                this.__instance__.destroy();
            }
        });
    }
};
