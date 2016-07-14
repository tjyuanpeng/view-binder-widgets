var ViewBinder = require('alpha-view-binder/view-binder');

module.exports = {
    init: function() {
        ViewBinder.addCommand('src', {
            refresh: function() {
                var src = this.links.get();
                var origin = this.element.attr('src');

                if (origin !== src) {
                    this.element.attr('src', src);
                }
            }
        });
    }
};
