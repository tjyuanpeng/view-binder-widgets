var ViewBinder = require('alpha-view-binder/view-binder');
var $ = require('alpha-jquery/jquery');
var Balloon = require('alpha-balloon/balloon');

module.exports = {
    init: function() {
        ViewBinder.addCommand('widget-balloon', {
            bindUI: function() {
                var newKey;
                var widgetConfig = {};
                $.each(this.options, function(key, value) {
                    if (key.indexOf('balloon') !== 0) {
                        return;
                    }
                    // convert key: prefixParam -> param
                    key = key.slice('balloon'.length);
                    newKey = key.substring(0,1).toLowerCase() + key.substring(1);
                    widgetConfig[newKey] = value;
                });

                // need deep-copy, resolving property`s value with json format
                widgetConfig = $.extend(true, {
                    trigger: this.element,
                    arrowPosition: 'bl' // default value
                }, widgetConfig);

                var instance = new Balloon(widgetConfig);

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
