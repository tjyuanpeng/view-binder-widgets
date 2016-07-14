var ViewBinder = require('alpha-view-binder/view-binder');

module.exports = {
    init: function() {
        ViewBinder.addCommand('show', {
            refresh: function () {
                var isShow = this.links.get();
                if (isShow) {
                    this.element.show();
                } else {
                    this.element.hide();
                }
            }
        });
        ViewBinder.addCommand('hide', {
            refresh: function () {
                var isHidden = this.links.get();
                if (isHidden) {
                    this.element.hide();
                } else {
                    this.element.show();
                }
            }
        });
    }
};
