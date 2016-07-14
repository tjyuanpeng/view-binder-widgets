var ViewBinder = require('alpha-view-binder/view-binder');
var $ = require('alpha-jquery/jquery');
var Select2 = require('./select2/select2');

module.exports = {
    init: function() {
        ViewBinder.addCommand('widget-select2', {
            bindUI: function() {
                var self = this;

                var $el = this.element;

                // save initial attributes from dom before widget`s initializing
                var className = $el.attr('class');
                var styleText = $el.attr('style');

                var newKey;
                var widgetConfig = {};
                $.each(this.options, function(key, value) {
                    if (key.indexOf('select2') !== 0) {
                        return;
                    }
                    // convert key: prefixParam -> param
                    key = key.slice('select2'.length);
                    newKey = key.substring(0,1).toLowerCase() + key.substring(1);
                    widgetConfig[newKey] = value;
                });

                // need deep-copy, because some properties`s value is json format
                widgetConfig = $.extend(true, {
                    minimumResultsForSearch: 10
                }, widgetConfig);

                // set options from model
                var optionsName = this.options.select2Options;
                if (optionsName) {
                    // add additional dependency for listening model change
                    this.links.addDependency(optionsName);

                    var model = this.links.model.get(optionsName);
                    if (model && model.toJSON && model.toJSON() && model.toJSON().length > 0) {
                        this._setData(widgetConfig, model.toJSON());
                    }
                }

                // save config for re-initializing
                this.__config__ = widgetConfig;
                var instance = new Select2($el, widgetConfig);

                // backfill initial attributes
                if (className) {
                    instance.$container.addClass(className);
                }
                if (styleText) {
                    instance.$container.attr('style', styleText);
                }

                // backfill value to model while selecting the item
                $el.on('change.viewBinderWidget', function (e) {
                    var val = $(e.target).val();
                    self.links.set(val);
                });

                // set default value
                var defaultValue = this.links.get();

                // only trigger select2 to change
                $el.val(defaultValue).trigger('change.select2');

                this.__instance__ = instance;
            },
            refresh: function(args) {
                if (!args) {
                    return;
                }
                if (!this.__instance__) {
                    return;
                }

                var optionsName = this.options.select2Options;
                if (args.key === optionsName) {
                    // useless event, skip it
                    // just handle 'add' event
                    if (args.action === 'itemchange' || args.action === 'remove') {
                        return;
                    }

                    // refresh options while options model chaning
                    var model = this.links.model.get(optionsName);
                    if (model && model.toJSON && model.toJSON() && model.toJSON().length > 0) {
                        // remove all options dom
                        this.element.empty();

                        this._setData(this.__config__, model.toJSON());

                        // re-initializing
                        this.__instance__ = new Select2(this.element, this.__config__);
                    }
                } else {
                    var value = this.links.get();

                    // only trigger select2 to change
                    this.element.val(value).trigger('change.select2');
                }
            },
            _setData: function(config, data) {

                // indicate which properties should be used
                var valueProperty = config.optionValueField || 'id';
                var textProperty = config.optionTextField || 'text';

                var result = $.map(data, function(item) {
                    var newItem = $.extend({
                        id: item[valueProperty],
                        text: item[textProperty],
                        title: item[textProperty]
                    }, item);

                    return newItem;
                });

                // if set placeholder, push a blank option to the head
                if (config.placeholder) {
                    result.unshift({
                        id: ""
                    });
                }

                config.data = result;
            },
            destroy: function() {
                this.element.off('change.viewBinderWidget');
                this.__instance__.destroy();
            }
        });
    }
};
