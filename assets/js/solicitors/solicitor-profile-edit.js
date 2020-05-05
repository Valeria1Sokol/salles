if($('.number-input').length > 0) {
    $('.number-input').each(function() {
        $(this).keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl+A, Command+A
                (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    });
}

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


$('#add-legal-case-button').click(function() {
    var elementsCount = $('.legal-case-element').length;
    $(this).before('<div class="form legal-case-element">\n' +
        '                                    \n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element case-name-input" type="text" id="legalCases' + elementsCount + '.caseName" name="legalCases[' + elementsCount + '].caseName" value="">\n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element case-outcome-input" type="text" id="legalCases' + elementsCount + '.caseOutcome" name="legalCases[' + elementsCount + '].caseOutcome" value="">\n' +
        '                                    <a class="delete-element delete-legal-case-element" href="">\n' +
        '                                        <i class="fa fa-remove fa-2x" style="color:red; margin-left:20px;"> </i>\n' +
        '                                    </a>\n' +
        '                                </div>');
    bindDeleteLegalCaseButton();
});

function bindDeleteLegalCaseButton() {
    $('.delete-legal-case-element').off();
    $('.delete-legal-case-element').click(function (e) {
        e.preventDefault();
        $(this).parent().remove();
        var i = 0;
        $('.legal-case-element').each(function () {
            $(this).find('.case-name-input').attr('id', 'legalCases' + i + '.caseName');
            $(this).find('.case-name-input').attr('name', 'legalCases[' + i + '].caseName');

            $(this).find('.case-outcome-input').attr('id', 'legalCases' + i + '.caseOutcome');
            $(this).find('.case-outcome-input').attr('name', 'legalCases[' + i + '].caseOutcome');

            i++;
        });
    });
}

$('#add-publication-button').click(function() {
    var elementsCount = $('.publication-element').length;
    $(this).before('<div class="form publication-element">\n' +
        '                                    \n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element publication-name-input" type="text" id="publications' + elementsCount + '.publicationName" name="publications['+ elementsCount + '].publicationName" value="">\n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element publication-title-input" type="text" id="publications' + elementsCount + '.title" name="publications[' + elementsCount + '].title" value="">\n' +
        '                                    <input class="form-control input-block number-input bordered solicitor-list-element publication-date-input" type="text" id="publications' + elementsCount + '.date" name="publications[' + elementsCount + '].date" value="">\n' +
        '                                    <a class="delete-element delete-publication-element" href="">\n' +
        '                                        <i class="fa fa-remove fa-2x" style="color:red; margin-left:20px;"> </i>\n' +
        '                                    </a>\n' +
        '                                </div>');
    bindDeletePublicationButton();
});

function bindDeletePublicationButton() {
    $('.delete-publication-element').off();
    $('.delete-publication-element').click(function (e) {
        e.preventDefault();
        $(this).parent().remove();
        var i = 0;
        $('.publication-element').each(function () {
            $(this).find('.publication-name-input').attr('id', 'publications' + i + '.publicationName');
            $(this).find('.publication-name-input').attr('name', 'publications[' + i + '].publicationName');

            $(this).find('.publication-title-input').attr('id', 'publications' + i + '.title');
            $(this).find('.publication-title-input').attr('name', 'publications[' + i + '].title');

            $(this).find('.publication-date-input').attr('id', 'publications' + i + '.date');
            $(this).find('.publication-date-input').attr('name', 'publications[' + i + '].date');

            i++;
        });
    });
}

$('#add-education-button').click(function() {
    var elementsCount = $('.education-element').length;
    $(this).before('<div class="form education-element">\n' +
        '                                    \n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element education-school-name-input" type="text" id="education' + elementsCount + '.schoolName" name="education[' + elementsCount + '].schoolName" value="">\n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element education-major-input" type="text" id="education' + elementsCount + '.major" name="education[' + elementsCount + '].major" value="">\n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element education-degree-input" type="text" id="education' + elementsCount + '.degree" name="education[' + elementsCount + '].degree" value="">\n' +
        '                                    <input class="form-control input-block number-input bordered solicitor-list-element education-graduated-input" type="text" id="education' + elementsCount + '.graduated" name="education[' + elementsCount + '].graduated" value="">\n' +
        '                                    <a class="delete-element delete-education-element" href="">\n' +
        '                                        <i class="fa fa-remove fa-2x" style="color:red; margin-left:20px;"> </i>\n' +
        '                                    </a>\n' +
        '                                </div>');
    bindDeleteEducationButton();
});

function bindDeleteEducationButton() {
    $('.delete-education-element').off();
    $('.delete-education-element').click(function (e) {
        e.preventDefault();
        $(this).parent().remove();
        var i = 0;
        $('.education-element').each(function () {
            $(this).find('.education-school-name-input').attr('id', 'education' + i + '.schoolName');
            $(this).find('.education-school-name-input').attr('name', 'education[' + i + '].schoolName');

            $(this).find('.education-major-input').attr('id', 'education' + i + '.major');
            $(this).find('.education-major-input').attr('name', 'education[' + i + '].major');

            $(this).find('.education-degree-input').attr('id', 'education' + i + '.degree');
            $(this).find('.education-degree-input').attr('name', 'education[' + i + '].degree');

            $(this).find('.education-graduated-input').attr('id', 'education' + i + '.graduated');
            $(this).find('.education-graduated-input').attr('name', 'education[' + i + '].graduated');

            i++;
        });
    });
}

$('#add-speaking-engagement-button').click(function() {
    var elementsCount = $('.speaking-engagement-element').length;
    $(this).before('<div class="form speaking-engagement-element">\n' +
        '                                    \n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element speaking-engagement-conference-name-input" type="text" id="speakingEngagements' + elementsCount + '.conferenceName" name="speakingEngagements[' + elementsCount + '].conferenceName" value="">\n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element speaking-engagement-title-input" type="text" id="speakingEngagements' + elementsCount + '.title" name="speakingEngagements[' + elementsCount + '].title" value="">\n' +
        '                                    <input class="form-control input-block number-input bordered solicitor-list-element speaking-engagement-date-input" type="text" id="speakingEngagements' + elementsCount + '.date" name="speakingEngagements[' + elementsCount + '].date" value="">\n' +
        '                                    <a class="delete-element delete-speaking-engagement-element" href="">\n' +
        '                                        <i class="fa fa-remove fa-2x" style="color:red; margin-left:20px;"> </i>\n' +
        '                                    </a>\n' +
        '                                </div>');
    bindDeleteSpeakingEngagementButton();
});

function bindDeleteSpeakingEngagementButton() {
    $('.delete-speaking-engagement-element').off();
    $('.delete-speaking-engagement-element').click(function (e) {
        e.preventDefault();
        $(this).parent().remove();
        var i = 0;
        $('.speaking-engagement-element').each(function () {
            $(this).find('.speaking-engagement-conference-name-input').attr('id', 'speakingEngagements' + i + '.conferenceName');
            $(this).find('.speaking-engagement-conference-name-input').attr('name', 'speakingEngagements[' + i + '].conferenceName');

            $(this).find('.speaking-engagement-title-input').attr('id', 'speakingEngagements' + i + '.title');
            $(this).find('.speaking-engagement-title-input').attr('name', 'speakingEngagements[' + i + '].title');

            $(this).find('.speaking-engagement-date-input').attr('id', 'speakingEngagements' + i + '.date');
            $(this).find('.speaking-engagement-date-input').attr('name', 'speakingEngagements[' + i + '].date');

            i++;
        });
    });
}

$('#add-resume-license-button').click(function() {
    var elementsCount = $('.resume-license-element').length;
    $(this).before('<div class="form resume-license-element">\n' +
        '                                    \n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element resume-license-country-input" type="text" id="resume.licenses' + elementsCount + '.country" name="resume.licenses[' + elementsCount + '].country" value="">\n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element resume-license-status-input" type="text" id="resume.licenses' + elementsCount + '.status" name="resume.licenses[' + elementsCount + '].status" value="">\n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element resume-license-acquired-input" type="text" id="resume.licenses' + elementsCount + '.acquired" name="resume.licenses[' + elementsCount + '].acquired" value="">\n' +
        '                                    <a class="delete-element delete-resume-license-element" href="">\n' +
        '                                        <i class="fa fa-remove fa-2x" style="color:red; margin-left:20px;"> </i>\n' +
        '                                    </a>\n' +
        '                                </div>');
    bindDeleteResumeLicenseButton();
});

function bindDeleteResumeLicenseButton() {
    $('.delete-resume-license-element').off();
    $('.delete-resume-license-element').click(function (e) {
        e.preventDefault();
        $(this).parent().remove();
        var i = 0;
        $('.resume-license-element').each(function () {
            $(this).find('.resume-license-country-input').attr('id', 'resume.licenses' + i + '.country');
            $(this).find('.resume-license-country-input').attr('name', 'resume.licenses[' + i + '].country');

            $(this).find('.resume-license-status-input').attr('id', 'resume.licenses' + i + '.status');
            $(this).find('.resume-license-status-input').attr('name', 'resume.licenses[' + i + '].status');

            $(this).find('.resume-license-acquired-input').attr('id', 'resume.licenses' + i + '.acquired');
            $(this).find('.resume-license-acquired-input').attr('name', 'resume.licenses[' + i + '].acquired');

            i++;
        });
    });
}

$('#add-resume-award-button').click(function() {
    var elementsCount = $('.resume-award-element').length;
    $(this).before('<div class="form resume-award-element">\n' +
        '                                    \n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element resume-award-name-input" type="text" id="resume.awards' + elementsCount + '.awardName" name="resume.awards[' + elementsCount + '].awardName" value="">\n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element resume-award-grantor-input" type="text" id="resume.awards' + elementsCount + '.grantor" name="resume.awards[' + elementsCount + '].grantor" value="">\n' +
        '                                    <input class="form-control input-block number-input bordered solicitor-list-element resume-award-date-input" type="text" id="resume.awards' + elementsCount + '.dateGranted" name="resume.awards[' + elementsCount + '].dateGranted" value="">\n' +
        '                                    <a class="delete-element delete-resume-award-element" href="">\n' +
        '                                        <i class="fa fa-remove fa-2x" style="color:red; margin-left:20px;"> </i>\n' +
        '                                    </a>\n' +
        '                                </div>');
    bindDeleteResumeAwardButton();
});

function bindDeleteResumeAwardButton() {
    $('.delete-resume-award-element').off();
    $('.delete-resume-award-element').click(function (e) {
        e.preventDefault();
        $(this).parent().remove();
        var i = 0;
        $('.resume-award-element').each(function () {
            $(this).find('.resume-award-name-input').attr('id', 'resume.awards' + i + '.awardName');
            $(this).find('.resume-award-name-input').attr('name', 'resume.awards[' + i + '].awardName');

            $(this).find('.resume-award-grantor-input').attr('id', 'resume.awards' + i + '.grantor');
            $(this).find('.resume-award-grantor-input').attr('name', 'resume.awards[' + i + '].grantor');

            $(this).find('.resume-award-date-input').attr('id', 'resume.awards' + i + '.dateGranted');
            $(this).find('.resume-award-date-input').attr('name', 'resume.awards[' + i + '].dateGranted');

            i++;
        });
    });
}

$('#add-resume-work-experience-button').click(function() {
    var elementsCount = $('.resume-work-experience-element').length;
    $(this).before('<div class="form resume-work-experience-element">\n' +
        '                                    \n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element resume-work-experience-title-input" type="text" id="resume.workExperiences' + elementsCount + '.title" name="resume.workExperiences[' + elementsCount + '].title" value="">\n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element resume-work-experience-company-name-input" type="text" id="resume.workExperiences' + elementsCount + '.companyName" name="resume.workExperiences[' + elementsCount + '].companyName" value="">\n' +
        '                                    <input class="form-control input-block number-input bordered solicitor-list-element resume-work-experience-start-input" type="text" id="resume.workExperiences' + elementsCount + '.start" name="resume.workExperiences[' + elementsCount + '].start" value="">\n' +
        '                                    <input class="form-control input-block number-input bordered solicitor-list-element resume-work-experience-end-input" type="text" id="resume.workExperiences'+ elementsCount + '.end" name="resume.workExperiences[' + elementsCount + '].end" value="">\n' +
        '                                    <a class="delete-element delete-resume-work-experience-element" href="">\n' +
        '                                        <i class="fa fa-remove fa-2x" style="color:red; margin-left:20px;"> </i>\n' +
        '                                    </a>\n' +
        '                                </div>');
    bindDeleteResumeWorkExperienceButton();
});

function bindDeleteResumeWorkExperienceButton() {
    $('.delete-resume-work-experience-element').off();
    $('.delete-resume-work-experience-element').click(function (e) {
        e.preventDefault();
        $(this).parent().remove();
        var i = 0;
        $('.resume-work-experience-element').each(function () {
            $(this).find('.resume-work-experience-title-input').attr('id', 'resume.workExperiences' + i + '.title');
            $(this).find('.resume-work-experience-title-input').attr('name', 'resume.workExperiences[' + i + '].title');

            $(this).find('.resume-work-experience-company-name-input').attr('id', 'resume.workExperiences' + i + '.companyName');
            $(this).find('.resume-work-experience-company-name-input').attr('name', 'resume.workExperiences[' + i + '].companyName');

            $(this).find('.resume-work-experience-start-input').attr('id', 'resume.workExperiences' + i + '.start');
            $(this).find('.resume-work-experience-start-input').attr('name', 'resume.workExperiences[' + i + '].start');

            $(this).find('.resume-work-experience-end-input').attr('id', 'resume.workExperiences' + i + '.end');
            $(this).find('.resume-work-experience-end-input').attr('name', 'resume.workExperiences[' + i + '].end');

            i++;
        });
    });
}

$('#add-resume-legal-case-button').click(function() {
    var elementsCount = $('.resume-legal-case-element').length;
    $(this).before('<div class="form resume-legal-case-element">\n' +
        '                                    \n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element resume-legal-case-name-input" type="text" id="resume.legalCases' + elementsCount + '.caseName" name="resume.legalCases[' + elementsCount + '].caseName" value="">\n' +
        '                                    <input class="form-control input-block bordered solicitor-list-element resume-legal-case-outcome-input" type="text" id="resume.legalCases' + elementsCount + '.outcome" name="resume.legalCases[' + elementsCount + '].outcome" value="">\n' +
        '                                    <a class="delete-element delete-resume-legal-case-element" href="">\n' +
        '                                        <i class="fa fa-remove fa-2x" style="color:red; margin-left:20px;"> </i>\n' +
        '                                    </a>\n' +
        '                                </div>');
    bindDeleteResumeLegalCaseButton();
});

function bindDeleteResumeLegalCaseButton() {
    $('.delete-resume-legal-case-element').off();
    $('.delete-resume-legal-case-element').click(function (e) {
        e.preventDefault();
        $(this).parent().remove();
        var i = 0;
        $('.resume-legal-case-element').each(function () {
            $(this).find('.resume-legal-case-name-input').attr('id', 'resume.legalCases' + i + '.caseName');
            $(this).find('.resume-legal-case-name-input').attr('name', 'resume.legalCases[' + i + '].caseName');

            $(this).find('.resume-legal-case-outcome-input').attr('id', 'resume.legalCases' + i + '.outcome');
            $(this).find('.resume-legal-case-outcome-input').attr('name', 'resume.legalCases[' + i + '].outcome');

            i++;
        });
    });
}

bindDeleteLegalCaseButton();
bindDeletePublicationButton();
bindDeleteEducationButton();
bindDeleteSpeakingEngagementButton();
bindDeleteResumeLicenseButton();
bindDeleteResumeAwardButton();
bindDeleteResumeWorkExperienceButton();
bindDeleteResumeLegalCaseButton();