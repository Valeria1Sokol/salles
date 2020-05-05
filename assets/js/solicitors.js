loadScriptThen('/assets/js/ext/jquery-ui-1.12.1.min.js', function() {
	
	$(function() {
		// solicitor profile page only
		$('a.delete-image').click(function(e) {
			e.preventDefault();
			var $a = $(this);
			$.ajax({
				type: 'GET',
				url: $a.attr('href'),
				success: function(data) {
					if(data) {
						$a.closest('div.profile-img').addClass('empty-pic');
						$a.closest('form').find('.fileinput-holder').css('display', 'block');
						$a.closest('div.img-holder').remove();
					}
				}
			});
		});
		

		$('#locationForm .custom-select').on('change', function (e) {
			$('#locationForm').submit();
		});
		$('#locationForm .custom-select-profile').on('change', function (e) {
			$('#locationForm').submit();
		});

        $('#headOfficeForm .custom-select-head-office').on('change', function (e) {
            $('#headOfficeForm').submit();
        });
		
		// solicitors dash settings page only
		$('ul#account-tab-list.tabs-nav li > a').click(function(e) {
			e.preventDefault();

			var active_tab_selector = $('ul.tabs-nav > li.active > a').attr('href');
			
			$('ul.tabs-nav li').removeClass();
			$(this).parent().addClass('active');
		
			//hide displaying tab content
			$(active_tab_selector).removeClass('active');
			$(active_tab_selector).addClass('hide');

			//show target tab content
			var target_tab_selector = $(this).attr('href');
			$(target_tab_selector).removeClass('hide');
			$(target_tab_selector).addClass('active');
		});
		
		// solicitor dash reviews page only
		/* if($('.review-date').length > 0)
			$('.review-date').datepicker({
				showOn: "both", 
				buttonText: "<i class='fa fa-calendar'></i>",
				dateFormat: "dd/mm/yy"
			});
			*/
		
		$('#submitAllButton').click(function() {
			
			//$("#dim").fadeToggle();
			//$(".dim-wrapper").fadeToggle();

			$('input[name=copyToAllBranches]').val('true');
			$('#solicitor-manage').submit();
			
		});
		
		$('#confirm-copy-contents').click(function() {
			//$("#dim").fadeToggle();
			//$(".dim-wrapper").fadeToggle();
			$('input[name=copyToAllBranches]').val('true');
			$('#solicitor-manage').submit();
		});
		
		$('#dont-copy-contents').click(function() {
			$("#dim").fadeToggle();
			$(".dim-wrapper").fadeToggle();
		})
		
		
		$('#fillMondayFriday').click(function() {
			for(var i = 0; i <= 4; ++i) {
				$('form#solicitor-manage [name=openTime\\['+i+'\\]]').val('09.00');
				$('form#solicitor-manage [name=closeTime\\['+i+'\\]]').val('17.30');
			}
			
			for(var i = 5; i <= 6; ++i) {
				$('form#solicitor-manage [name=openTime\\['+i+'\\]]').val('00.00');
				$('form#solicitor-manage [name=closeTime\\['+i+'\\]]').val('00.00');
			}
		});
		
		$('#copyMonday').click(function() {
			var closeTime = $('form#solicitor-manage [name=closeTime\\[0\\]]').val();
			var openTime = $('form#solicitor-manage [name=openTime\\[0\\]]').val();
			
			for(var i = 1; i <= 4; ++i) {
				$('form#solicitor-manage [name=openTime\\['+i+'\\]]').val(openTime);
				$('form#solicitor-manage [name=closeTime\\['+i+'\\]]').val(closeTime);
			}
			
		});
		
		if($('.number-input').length > 0) {
				$('.number-input').keydown(function (e) {
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
		}
		
		//loadScriptThen('/assets/js/ext/jquery.timepicker.min.js', function() { 
		//		$('.timepick').timepicker({
		//			step:15,
		//			scrollDefault:'09.00',
		//			timeFormat:'H.i'
		//		});
		//});
		
	});
	
	// x-editable extension for radio buttons checklist //

	( function($) {

		var Radiolist = function(options) {
			this.init('radiolist', options, Radiolist.defaults);
		};
		$.fn.editableutils.inherit(Radiolist, $.fn.editabletypes.checklist);

		$.extend(Radiolist.prototype, {
			renderList : function() {
				var $label;
				this.$tpl.empty();
				if (!$.isArray(this.sourceData)) {
					return;
				}

				for (var i = 0; i < this.sourceData.length; i++) {
					$label = $('<label>', {'class':this.options.inputclass}).append($('<input>', {
						type : 'radio',
						name : this.options.name,
						value : this.sourceData[i].value
					})).append($('<span>').text(this.sourceData[i].text));

					// Add radio buttons to template
					this.$tpl.append($label);
				}

				this.$input = this.$tpl.find('input[type="radio"]');
			},
			input2value : function() {
				var val = this.$input.filter(':checked').val();
				return val;
			},
			str2value: function(str) {
				return str || null;
			},

			value2input: function(value) {
				this.$input.val([value]);
			},
			value2str: function(value) {
				return value || '';
			}
		});

		Radiolist.defaults = $.extend({}, $.fn.editabletypes.list.defaults, {
			/**
		         @property tpl
		         @default <div></div>
			 **/
			tpl : '<div class="editable-radiolist"></div>',

			/**
		         @property inputclass, attached to the <label> wrapper instead of the input element
		         @type string
		         @default null
			 **/
			inputclass : '',

			name : 'defaultname'
		});

		$.fn.editabletypes.radiolist = Radiolist;

	}(window.jQuery));
});