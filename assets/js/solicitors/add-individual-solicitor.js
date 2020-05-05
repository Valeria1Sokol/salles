var addCustomSelect = function (element) {
    element.find('.custom-select').select2({
        width: 'element',
        minimumResultsForSearch: Infinity
    });
};

var cloneAreaOfLawSelector = function(clickedElement) {
    var originalSelectContainer = clickedElement.parent().parent();
    originalSelectContainer.after('<div class="text">\n' +
        '                    <div>\n' +
        '                        <p>Practice area</p> <a class="add-area-of-law">Add another area</a></div>\n' +
        '                </div>');

    var clonedSelect = originalSelectContainer.find('select').first().clone();
    clonedSelect.removeClass('select2-hidden-accessible');
    originalSelectContainer.next().append(clonedSelect);

    addCustomSelect(originalSelectContainer.next());
    clickedElement.remove();
    bindAddingAreaOfLaw();

    return clonedSelect;
};

var bindAddingAreaOfLaw = function() {
    $('.add-area-of-law').click(function (e) {
        cloneAreaOfLawSelector($(this));
    });
};

addCustomSelect($('.addNew'));
bindAddingAreaOfLaw();

var cleanAreasOfLaw = function() {
    var selects = $('select[name=areaOfLawIds]');
    var clonedSelect = selects.eq(0).clone();
    var emailField = $('#email').parent();

    emailField.after('<div class="text">\n' +
        '                    <div>\n' +
        '                        <p>Practice area</p> <a class="add-area-of-law">Add another area</a></div>\n' +
        '                </div>');

    clonedSelect.removeClass('select2-hidden-accessible');
    emailField.next().append(clonedSelect);

    selects.parent().remove();

    addCustomSelect(emailField.next());
    bindAddingAreaOfLaw();
};

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

        //Profile Image
        this.$solicitorPhotoBtn = this.$container.find('#solicitor-photo-upload-button');
        this.$solicitorPhotoModal = this.$container.find('#solicitor-profile-photo-modal');
        this.$loading = this.$container.find('.loading');

        this.$solicitorPhotoForm = this.$solicitorPhotoModal.find('.image-form');
        this.$solicitorPhotoUpload = this.$solicitorPhotoForm.find('.image-upload');
        this.$solicitorPhotoSrc = this.$solicitorPhotoForm.find('.image-src');
        this.$solicitorPhotoData = this.$solicitorPhotoForm.find('.image-data');
        this.$solicitorOldPhotoUrl = this.$solicitorPhotoForm.find('.old-solicitor-photo');
        this.$solicitorPhotoInput = this.$solicitorPhotoForm.find('.image-input');
        this.$solicitorPhotoSave = this.$solicitorPhotoForm.find('.solicitor-photo-save');

        this.$solicitorPhotoWrapper = this.$solicitorPhotoModal.find('.image-wrapper');
        this.$solicitorPhotoPreview = this.$solicitorPhotoModal.find('.image-preview');

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

            this.initModal(this.$solicitorPhotoModal);
            this.addListener();
        },

        addListener: function () {
            this.$solicitorPhotoBtn.on('click', $.proxy(this.click, this, this.$solicitorPhotoModal));

            this.$solicitorPhotoInput.on('change', $.proxy(this.change, this,
                this.$solicitorPhotoInput,
                this.$solicitorPhotoWrapper,
                this.$solicitorPhotoData,
                this.$solicitorPhotoModal,
                this.$solicitorPhotoPreview,
                this.$solicitorPhotoSave));

            this.$solicitorPhotoSave.on('click', $.proxy(this.submit, this,
                this.$solicitorPhotoSrc,
                this.$solicitorPhotoInput,
                this.$solicitorPhotoForm,
                this.$solicitorPhotoWrapper,
                this.$solicitorPhotoData,
                this.$solicitorPhotoModal,
                this.$solicitorPhotoPreview,
                this.$solicitorPhotoUpload,
                "solicitor_photo_file"));

            this.$solicitorPhotoModal.on('hidden.bs.modal', $.proxy(this.closeModal, this, this.$solicitorPhotoPreview, this.$solicitorPhotoInput));
        },

        initModal: function (modal) {
            modal.modal({
                show: false
            });
        },

        click: function (modal) {
            modal.modal('show');

            if ($("#photoUrl").val()) {
                this.$solicitorOldPhotoUrl.val($("#photoUrl").val());
            }
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
                        this.fileName = file.name;
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

            if (this.active) {
                this.$img.cropper('replace', this.url);
            } else {
                this.$img = $('<img src="' + this.url + '">');
                imageWrapper.empty().html(this.$img);

                this.$img.cropper({
                    aspectRatio: 1,
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
            this.$loading.fadeOut();
        },

        cropDone: function (imageForm, imageModal) {
            imageForm.get(0).reset();
            $("#photoUrl").val(this.url);
            $("#solicitor-photo").attr('src', this.url);

            if (this.fileName) {
                $('.upload label').text(this.fileName);
            }
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

loadScriptThen('/assets/js/ext/jquery-ui-1.12.1.min.js', function() {
    $("input#sraId").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/solicitor/autocomplete-individual-solicitor",
                type: 'GET',
                cache: false,
                data: request,
                dataType: 'json',
                success: function (json) {
                    response($.map(json, function (item) {
                        item.label = item.sraId;
                        return item;
                    }));
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.log(textStatus + ', ' + errorThrown);
                }
            });
        },
        select: function (event, ui) {
            $("input#id").val(ui.item.id);
            $("input#photoUrl").val(ui.item.photoUrl);
            $("input#name").val(ui.item.name);
            $("input#email").val(ui.item.email);
            $("input#phone").val(ui.item.phone);
            $("textarea#description").val(ui.item.description);

            if (ui.item.photoUrl) {
                $("img#solicitor-photo").attr('src', ui.item.photoUrl);
            }
            if (ui.item.photoFileName) {
                $(".upload label").text(ui.item.photoFileName);
            }

            $("select#branchId").val(ui.item.branchId).trigger('change');

            cleanAreasOfLaw();
            if(ui.item.areaOfLawIds.length > 0) {
                $("select#areaOfLawIds").eq(0).val(ui.item.areaOfLawIds[0]).trigger('change');

                var currentSelect = $("select#areaOfLawIds").eq(0);
                if (ui.item.areaOfLawIds.length > 1) {
                    for (i = 1; i < ui.item.areaOfLawIds.length; i++) {
                        var clonningButton = currentSelect.parent().find('.add-area-of-law');
                        var currentSelect = cloneAreaOfLawSelector(clonningButton);

                        currentSelect.val(ui.item.areaOfLawIds[i]).trigger('change');
                    }
                }
            }
        },
        messages: {
            noResults: '',
            results: function () {
            }
        },
        appendTo: '#individual-solicitor-container',
        delay: 100,
        minLength: 4
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        return $("<li></li>")
            .data("ui-autocomplete-item", item)
            .append("<span><small>" + item.sraId + "</small></span><br>" + item.name)
            .appendTo(ul);
    };

    $('#nonSolicitor1').change(function(e) {
        if($(this).is(":checked")) {
            $('.sra').hide();
            $('.non-sra').show();

            $('form#individualSolicitorForm input#id').val('');
            $('form#individualSolicitorForm input#sraId').val('');
        } else {
            $('.sra').show();
            $('.non-sra').hide();

            $('form#individualSolicitorForm input#jobTitle').val('');
        }
    });

    $('#nonSolicitor1').prop('checked', false);
});