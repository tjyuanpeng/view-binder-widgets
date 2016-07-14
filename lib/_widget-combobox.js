var ViewBinder = require('alpha-view-binder/view-binder');
var $ = require('alpha-jquery/jquery');
var Combobox = require('alpha-combobox/combobox');

var _upper = function(v) {
    return String.prototype.toUpperCase.call(v);
};

/**
 * DO NOT USE！
 * Incomplete Implementation
 */
module.exports = {
    init: function() {
        ViewBinder.addCommand('widget-combobox', {
            _setvalue: function() {
            },
            bindUI: function() {
                var $el = this.element;

                // store initial value from model
                var defaultValue = this.links.get();

                var newKey;
                var widgetConfig = {};
                $.each(this.options, function(key, value) {
                    if (key.indexOf('combobox') !== 0) {
                        return;
                    }
                    // convert key: prefixParam -> param
                    key = key.slice('combobox'.length);
                    newKey = key.substring(0,1).toLowerCase() + key.substring(1);
                    widgetConfig[newKey] = value;
                });

                // need deep-copy, resolving property`s value with json format
                widgetConfig = $.extend(true, {
                    element: $el
                }, widgetConfig);

                var instance = new Combobox(widgetConfig).render();

                // item match strategy
                instance._onInputChange = function() {
                    var $input = this.get("inputElement");
                    var dataSource = this.get("dataSource");

                    var val = $input.val() || '';

                    var matched;
                    var item;
                    for (var i = dataSource.length - 1; i >= 0; i--) {
                        item = dataSource[i];

                        // case insensitive
                        if (_upper(item.name) === _upper(val)) {
                            matched = item;
                            break;
                        }
                    }

                    if (matched) {
                        this.set('value', matched);
                        $input.val(matched.value);

                        this.trigger('after:select', matched);
                    } else {
                        // no matched, clear input value
                        this.set('value', '');
                        $input.val('');
                    }

                    // for re-firing validator check
                    setTimeout(function() {
                        $input.trigger('blur');
                    }, 0);
                };

                // set options from model
                var optionsName = this.options.comboboxOptions;
                if(optionsName) {
                    // add additional dependency for listening model change
                    this.links.addDependency(optionsName);

                    var model = this.links.model.get(optionsName);
                    if (model && model.toJSON && model.toJSON() && model.toJSON().length > 0) {
                        var _data = $.map(model.toJSON(), function(datum) {
                            return {
                                id: datum.value,
                                name: datum.text,
                                value: datum.value
                            };
                        });
                        instance.set('dataSource', _data);
                    }
                }

                // set default value
                instance.get('inputElement').val(defaultValue);

                this.__instance__ = instance;
            },
            refresh: function(args) {
                if (!args) {
                    return;
                }
                if (!this.__instance__) {
                    return;
                }

                var optionsName = this.options.comboboxOptions;
                if (args.key === optionsName) {
                    // useless event, skip it
                    if (args.action === 'itemchange') {
                        return;
                    }

                    // refresh options after model chaning
                    var model = this.links.model.get(optionsName);
                    if (model && model.toJSON && model.toJSON() && model.toJSON().length > 0) {
                        var _data = $.map(model.toJSON(), function(datum) {
                            return {
                                id: datum.value,
                                name: datum.name,
                                value: datum.value
                            };
                        });
                        this.__instance__.set('dataSource', _data);
                    }
                } else {
                    var value = this.links.get();
                    this.__instance__.get('inputElement').val(value);
                }
            },
            destroy: function() {
                this.__instance__.destroy();
            }
        });
    }
};
