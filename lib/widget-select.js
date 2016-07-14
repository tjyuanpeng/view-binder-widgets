var ViewBinder = require('alpha-view-binder/view-binder');
var $ = require('alpha-jquery/jquery');
var Select = require('alpha-select/select');

module.exports = {
    init: function() {
        ViewBinder.addCommand('widget-select', {
            bindUI: function() {
                var $el = this.element;
                var self = this;

                // store initial value from model
                var defaultValue = this.links.get();

                // store initial attributes from element
                var className = $el.attr('class');
                var styleText = $el.attr('style');

                $el.on('change.viewBinderWidget', function (e) {
                    var target = $(e.target),
                        val = target.val();
                    self.links.set(val);
                });

                var newKey;
                var widgetConfig = {};
                $.each(this.options, function(key, value) {
                    if (key.indexOf('select') !== 0) {
                        return;
                    }
                    // convert key: prefixParam -> param
                    key = key.slice('select'.length);
                    newKey = key.substring(0,1).toLowerCase() + key.substring(1);
                    widgetConfig[newKey] = value;
                });

                // need deep-copy, resolving property`s value with json format
                widgetConfig = $.extend(true, {
                    trigger: $el,
                    autoCompute: false,
                    style: {
                        maxHeight: '400px' // limit max height to fix option list too long to display
                    }
                }, widgetConfig);
                var instance = new Select(widgetConfig).render();

                // set options from model
                var optionsName = this.options.selectOptions;
                if (optionsName) {
                    // add additional dependency for listening model change
                    this.links.addDependency(optionsName);

                    var model = this.links.model.get(optionsName);
                    if (model && model.toJSON && model.toJSON() && model.toJSON().length > 0) {
                        instance.syncModel(model.toJSON());
                    }
                }

                // backfill initial attributes
                var $trigger = instance.get('trigger');
                if (className) {
                    $trigger.addClass(className);
                }
                if (styleText) {
                    $trigger.attr('style', styleText);
                }

                // backfill initial value after initializing
                // because before that, no option in select dom
                // and vb can`t bind value to it
                instance.select('[data-value="' + defaultValue + '"]');

                this.__instance__ = instance;
            },
            refresh: function (args) {
                if (!args) {
                    return;
                }
                if (!this.__instance__) {
                    return;
                }

                var optionsName = this.options.selectOptions;
                if (args.key === optionsName) {
                    // useless event, skip it
                    if (args.action === 'itemchange') {
                        return;
                    }

                    // refresh options after model chaning
                    var model = this.links.model.get(optionsName);
                    if (model && model.toJSON && model.toJSON() && model.toJSON().length > 0) {
                        this.__instance__.syncModel(model.toJSON());
                    }
                } else {
                    var value = this.links.get();
                    this.__instance__.select('[data-value="' + value + '"]');
                }
            },
            destroy: function() {
                this.element.off('change.viewBinderWidget');
                this.__instance__.destroy();
            }
        });
    }
};
