var ViewBinder = require('alpha-view-binder/view-binder');
var $ = require('alpha-jquery/jquery');

module.exports = {
    init: function() {
        ViewBinder.addCommand('validator-item', {
            _findValidatorInstance: function recur(context, counter) {
                counter = counter || 0;
                var ctx = context.context;
                if (!ctx || counter++ > 9) {
                    return null;
                }
                if (ctx.validatorInstance) {
                    return ctx.validatorInstance;
                }
                return recur(ctx, counter);
            },
            bindUI: function(){
                var validator = this._findValidatorInstance(this);
                if (!validator) {
                    return;
                }

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
                widgetConfig = $.extend(true, {
                    element: this.element
                }, widgetConfig);

                validator.addItem(widgetConfig);
            },
            refresh: function(){
            },
            destroy: function() {
                var validator = this._findValidatorInstance(this);
                if (!validator) {
                    return;
                }
                validator.removeItem(this.element);
            }
        });
    }
};
