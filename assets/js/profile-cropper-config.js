(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node / CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals.
        factory(jQuery);
    }
})(function ($) {

    'use strict';

    var console = window.console || { log: function () {} };

    function CropAvatar($element) {
        this.$container = $element;

        //Branch Photos
        this.$branchPhotoBtn = this.$container.find('#branch-upload-button');
        this.$branchPhotoModal = this.$container.find('#branch-photo-modal');
        this.$loading = this.$container.find('.loading');

        this.$branchImageForm = this.$branchPhotoModal.find('.image-form');
        this.$branchImageUpload = this.$branchImageForm.find('.image-upload');
        this.$branchImageSrc = this.$branchImageForm.find('.image-src');
        this.$branchImageData = this.$branchImageForm.find('.image-data');
        this.$branchImageInput = this.$branchImageForm.find('.image-input');
        this.$branchImageSave = this.$branchImageForm.find('.branch-photo-save');

        this.$branchImageWrapper = this.$branchPhotoModal.find('.image-wrapper');
        this.$branchImagePreview = this.$branchPhotoModal.find('.image-preview');

        //Profile Image
        this.$profileImageBtn = this.$container.find('#profile-image-upload-button');
        this.$profileImageModal = this.$container.find('#profile-image-modal');

        this.$profileImageForm = this.$profileImageModal.find('.image-form');
        this.$profileImageUpload = this.$profileImageForm.find('.image-upload');
        this.$profileImageSrc = this.$profileImageForm.find('.image-src');
        this.$profileImageData = this.$profileImageForm.find('.image-data');
        this.$profileImageInput = this.$profileImageForm.find('.image-input');
        this.$profileImageSave = this.$profileImageForm.find('.profile-image-save');

        this.$profileImageWrapper = this.$profileImageModal.find('.image-wrapper');
        this.$profileImagePreview = this.$profileImageModal.find('.image-preview');

        this.init();
    }

    CropAvatar.prototype = {
        constructor: CropAvatar,

        support: {
            fileList: !!$('<input type="file">').prop('files'),
            blobURLs: !!window.URL && URL.createObjectURL,
            formData: !!window.FormData
        },

        init: function () {
            this.support.datauri = this.support.fileList && this.support.blobURLs;

            this.initModal(this.$branchPhotoModal);
            this.initModal(this.$profileImageModal);
            this.addListener();
        },

        addListener: function () {
            this.$branchPhotoBtn.on('click', $.proxy(this.click, this, this.$branchPhotoModal));
            this.$profileImageBtn.on('click', $.proxy(this.click, this, this.$profileImageModal));

            this.$branchImageInput.on('change', $.proxy(this.change, this,
                this.$branchImageInput,
                this.$branchImageWrapper,
                this.$branchImageData,
                this.$branchPhotoModal,
                this.$branchImagePreview,
                this.$branchImageSave));

            this.$profileImageInput.on('change', $.proxy(this.change, this,
                this.$profileImageInput,
                this.$profileImageWrapper,
                this.$profileImageData,
                this.$profileImageModal,
                this.$profileImagePreview,
                this.$profileImageSave));

            this.$branchImageSave.on('click', $.proxy(this.submit, this,
                this.$branchImageSrc,
                this.$branchImageInput,
                this.$branchImageForm,
                this.$branchImageWrapper,
                this.$branchImageData,
                this.$branchPhotoModal,
                this.$branchImagePreview,
                this.$branchImageUpload,
                "branch_photo_file"));

            this.$profileImageSave.on('click', $.proxy(this.submit, this,
                this.$profileImageSrc,
                this.$profileImageInput,
                this.$profileImageForm,
                this.$profileImageWrapper,
                this.$profileImageData,
                this.$profileImageModal,
                this.$profileImagePreview,
                this.$profileImageUpload,
                "profile_image_file"));

            this.$branchPhotoModal.on('hidden.bs.modal', $.proxy(this.closeModal, this, this.$branchImagePreview, this.$branchImageInput));
            this.$profileImageModal.on('hidden.bs.modal', $.proxy(this.closeModal, this, this.$profileImagePreview, this.$profileImageInput));
        },

        initModal: function (modal) {
            modal.modal({
                show: false
            });
        },

        click: function (modal) {
            modal.modal('show');
        },

        change: function (imageInput, imageWrapper, imageData, imageModal, imagePreview, imageSave) {
            var files;
            var file;

            if (this.support.datauri) {
                files = imageInput.prop('files');

                if (files.length > 0) {
                    file = files[0];

                    if (this.isImageFile(file)) {
                        if (this.url) {
                            URL.revokeObjectURL(this.url); // Revoke the old one
                        }

                        this.url = URL.createObjectURL(file);
                        this.startCropper(imageWrapper, imageData, imagePreview, imageInput);
                    }
                }
            } else {
                file = imageInput.val();

                if (this.isImageFile(file)) {
                    this.syncUpload(imageSave);
                }
            }
        },

        submit: function (imageSrc, imageInput, imageForm, imageWrapper, imageData, imageModal, imagePreview, imageUpload, imageFieldName) {
            if (!imageSrc.val() && !imageInput.val()) {
                return false;
            }

            if (this.support.formData) {
                this.ajaxUpload(imageSrc, imageInput, imageForm, imageWrapper, imageData, imageModal, imagePreview, imageUpload, imageFieldName);
                return false;
            }
        },

        isImageFile: function (file) {
            if (file.type) {
                return /^image\/\w+$/.test(file.type);
            } else {
                return /\.(jpg|jpeg|png|gif)$/.test(file);
            }
        },

        startCropper: function (imageWrapper, imageData, imageModal, imagePreview, imageInput) {
            var _this = this;
            var $image = this.$img;
            var minAspectRatio = 1;
            var maxAspectRatio = 10;

            if (this.active) {
                this.$img.cropper('replace', this.url);
            } else {
                this.$img = $('<img src="' + this.url + '">');
                imageWrapper.empty().html(this.$img);
                this.$img.cropper({
                    minCanvasHeight: 10,
                    preview: '.image-preview',
                    crop: function (e) {
                        var json = [
                            '{"x":' + e.x,
                            '"y":' + e.y,
                            '"height":' + e.height,
                            '"width":' + e.width,
                            '"rotate":' + e.rotate + '}'
                        ].join();

                        imageData.val(json);
                    },
                    cropmove: function (e) {
                        var cropBoxData = _this.$img.cropper('getCropBoxData');
                        var cropBoxWidth = cropBoxData.width;
                        var aspectRatio = cropBoxWidth / cropBoxData.height;

                        if (aspectRatio < minAspectRatio) {
                            _this.$img.cropper('setCropBoxData', {
                                height: cropBoxWidth / minAspectRatio
                            });
                        } else if (aspectRatio > maxAspectRatio) {
                            _this.$img.cropper('setCropBoxData', {
                                height: cropBoxWidth / maxAspectRatio
                            });
                        }
                    }
                });

                this.active = true;
            }
        },

        closeModal: function(imagePreview, imageInput) {
            imagePreview.empty();
            this.stopCropper();
            imageInput.val('');
        },

        stopCropper: function () {
            if (this.active) {
                this.$img.cropper('destroy');
                this.$img.remove();
                this.active = false;
            }
        },

        ajaxUpload: function (imageSrc, imageInput, imageForm, imageWrapper, imageData, imageModal, imagePreview, imageUpload, imageFieldName) {
            var url = imageForm.attr('action');
            var data = new FormData(imageForm[0]);
            var _this = this;

            var res = Array.from(data.entries(), ([key, prop]) => (
                {[key]: {

                        "ContentLength":
                            typeof prop === "string"
                                ? prop.length
                                : prop.size
                    }

                }));

            if(res[4][imageFieldName]["ContentLength"] > 1048576) {
                _this.submitFail("Your image is too big - upload an image with a file size less than 1MB.", imageUpload)
            }
            else {
                $.ajax(url, {
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    processData: false,
                    contentType: false,

                    beforeSend: function () {
                        _this.submitStart();
                    },

                    success: function (data) {
                        _this.submitDone(data, imageSrc, imageInput, imageForm, imageWrapper, imageData, imageModal, imagePreview, imageUpload);
                    },

                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        _this.submitFail(textStatus || errorThrown, imageUpload);
                    },

                    complete: function () {
                        _this.submitEnd();
                    }
                });
            }


        },

        syncUpload: function (imageSave) {
            imageSave.click();
        },

        submitStart: function () {
            this.$loading.fadeIn();
        },

        submitDone: function (data, imageSrc, imageInput, imageForm, imageWrapper, imageData, imageModal, imagePreview, imageUpload) {
            console.log(data);

            if ($.isPlainObject(data)) {
                if (data.result) {
                    this.url = data.result;

                    if (this.support.datauri || this.uploaded) {
                        this.uploaded = false;
                        this.cropDone(imageForm, imageModal);
                    } else {
                        this.uploaded = true;
                        imageSrc.val(this.url);
                        this.startCropper(imageWrapper, imageData, imageModal, imagePreview, imageInput);
                    }

                    imageInput.val('');
                } else if (data.message) {
                    this.alert(data.message, imageUpload);
                }
            } else {
                this.alert('Failed to response', imageUpload);
            }
        },

        submitFail: function (msg, imageUpload) {
            this.alert(msg, imageUpload);
        },

        submitEnd: function () {
            this.$loading.fadeOut(400, function() {
                location.reload();
            });
        },

        cropDone: function (imageForm, imageModal) {
            imageForm.get(0).reset();
            this.stopCropper();
            imageModal.modal('hide');
        },

        alert: function (msg, imageUpload) {
            var $alert = [
                '<div class="alert alert-danger image-alert alert-dismissable">',
                '<button type="button" class="close" data-dismiss="alert">&times;</button>',
                msg,
                '</div>'
            ].join('');

            imageUpload.after($alert);
        }
    };

    $(function () {
        return new CropAvatar($('#crop-images'));
    });

});
