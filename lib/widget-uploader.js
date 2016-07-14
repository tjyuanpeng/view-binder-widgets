var ViewBinder = require('alpha-view-binder/view-binder');
var $ = require('alpha-jquery/jquery');

var FileUploader = require('alpha-uploader/file-uploader.js');
var ItemsProgresssbar = require('alpha-uploader/plugins/items-progressbar.js');
// var TotalProgresssbar = require('alpha-uploader/plugins/total-progressbar.js');

module.exports = {
    init: function(config) {
        var opt = $.extend({
            runtimes: 'html5, flash, iframe',
            scene: 'rfqFileRule',
            validatorConfig: [
                {
                    ruleName: 'allowTypes',
                    params: { fileTypes: 'xlsx;xls;doc;docx;jpg;png;jpeg;gif;tif;pdf;txt' },
                    message: '{{fileName}} File type error.'
                }, {
                    ruleName: 'fileNum',
                    params: { max: 5 },
                    message: 'Only allowed to upload up to {{max}} files.'
                }, {
                    ruleName: 'fileSize',
                    params: { max: 10 * 1024 * 1024 },
                    message: '{{fileName}} File exceeds 10M, upload failed.'
                }
            ]
        }, config);
        ViewBinder.addCommand('widget-uploader', {
            bindUI: function() {
                var $ref = this.element.parent();

                var instance = new FileUploader({
                    runtimes: opt.runtimes,
                    parentNode: $ref.find(this.options.uploaderParentNode),
                    inputElement: $ref.find(this.options.uploaderInput),
                    uploadButton: $ref.find(this.options.uploaderBtn),
                    container: $ref.find(this.options.uploaderBtnContainer),
                    postParams: {
                        scene: opt.scene
                    },
                    plugins: {
                        itemsProgresssbar: ItemsProgresssbar
                        // totalProgresssbar: TotalProgresssbar
                    },
                    validatorConfig: opt.validatorConfig,
                    convertName: function (fileName) {
                        var str = fileName;
                        if (fileName.length > 20) {
                            str = fileName.substring(0, 14) + '...' + fileName.substr(fileName.length - 6, 6);
                        }
                        return str;
                    },
                    ready: function() {}
                });
                instance.render();

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
