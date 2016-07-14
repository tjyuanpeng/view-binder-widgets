var ViewBinder = require('alpha-view-binder/view-binder');
var $ = require('alpha-jquery/jquery');

var Validator = require('alpha-validator/validator');

module.exports = {
    init: function() {
        ViewBinder.addCommand('validator-instance', {
            bindUI: function() {
                var defaultConfig = {
                    element: this.element
                };
                var newKey;
                var widgetConfig = {};
                $.each(this.options, function(key, value) {
                    if (key.indexOf('validator') !== 0) {
                        return;
                    }
                    // convert key: prefixParam -> param
                    key = key.slice('validator'.length);
                    newKey = key.substring(0,1).toLowerCase() + key.substring(1);
                    widgetConfig[newKey] = value;
                });

                // need deep-copy, resolving property`s value as a json
                widgetConfig = $.extend(true, defaultConfig, widgetConfig);

                var instance = new Validator(widgetConfig);

                this.context.validatorInstance = instance;
                // this.element.data(KEY, instance);
                this.__instance__ = instance;
            },
            refresh: function () {
            },
            destroy: function() {
                this.context.validatorInstance = undefined;
                // this.element.removeData(KEY);
                this.__instance__.destroy();
            }
        });
    }
};
