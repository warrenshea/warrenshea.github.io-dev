;(function ( $, window, document, undefined ) {

	var pluginName = 'ik_accordion',
		defaults = { // set default parameters
			autoCollapse: false,
			animationSpeed: 200
		};

	/**
	 * @constructs Plugin
	 * @param {Object} element - Current DOM element from selected collection.
	 * @param {Object} options - Configuration options.
	 * @param {boolean} options.autoCollapse - Automatically collapse inactive panels.
	 * @param {number} options.animationSpeed - Panel toggle speed in milliseconds.
	 */
	function Plugin( element, options ) {

		this._name = pluginName;
		this._defaults = defaults;
		this.element = $(element);
		this.options = $.extend( {}, defaults, options) ; // override default parameters if setup object is present

		this.init();
	}

	/** Initializes plugin. */
	Plugin.prototype.init = function () {

		var id, $elem, plugin;

		id = 'acc' + $('.ik_accordion').length; // create unique id
		$elem = this.element;
		plugin = this;

		$elem.attr({
			'id': id,
			'role': 'region', // add the accordion to the landmarked regions
			'aria-multiselectable': !this.options.autoCollapse // define if more than one panel can be expanded
		}).addClass('ik_accordion');

		this.headers = $elem.children('dt')
			.attr({'role': 'heading'}) // set heading role for each accordion header
			.each(function(i, el) {
				var $me, $btn;

				$me = $(el);
				$btn = $('<div/>').attr({
						'id': id + '_btn_' + i,
						'role': 'button', // (Criteria 2)
						'aria-controls': id + '_panel_' + i, // associate button with corresponding panel
						'aria-expanded': false, // toggle expanded state (Criteria 4)
						'tabindex': 0 //add keyboard focus (Criteria 1)
					})
					.addClass('button')
					.html($me.html())
					.on('keydown', {'plugin': plugin}, plugin.onKeyDown) // enable keyboard navigation (Criteria 3)
					.on('click', {'plugin': plugin}, plugin.togglePanel); // (Criteria 3)

				$me.empty().append($btn); // wrap content of each header in an element with role button
			});

		this.panels = $elem.children('dd').each(function(i, el) {
			var $me = $(this), id = $elem.attr('id') + '_panel_' + i;
			$me.attr({
				'id': id,
				'role': 'region', // add role region to each panel
				'tabindex': 0 // add panels into the tab order (Criteria 5)
			});
		}).hide();

	};

	/**
	 * Toggles accordion panel.
	 *
	 * @param {Object} event - Keyboard or mouse event.
	 * @param {object} event.data - Event data.
	 * @param {object} event.data.plugin - Reference to plugin.
	 */
	Plugin.prototype.togglePanel = function (event) {

		var plugin, $elem, $panel, $me, isVisible;

		plugin = event.data.plugin;
		$elem = $(plugin.element);
		$me = $(event.target);
		$panel = $me.parent('dt').next();

 		if(plugin.options.autoCollapse) { // expand current panel and collapse the rest (open one at a time)

			plugin.headers.each(function(i, el) {
				var $hdr, $btn;

				$hdr = $(el);
				$btn = $hdr.find('.button');

				if($btn[0] != $(event.currentTarget)[0]) {
					$btn.removeClass('expanded');
					$btn.attr({
						'aria-disabled': true,
						'aria-expanded': true // (Criteria 4)
					});
					$hdr.next().slideUp(plugin.options.animationSpeed);
					$hdr.next().attr({'aria-expanded': false});
				} else {
					$btn.addClass('expanded');
					$btn.attr({
						'aria-disabled': false,
						'aria-expanded': true // (Criteria 4)
					});
					$hdr.next().slideDown(plugin.options.animationSpeed);
					$hdr.next().attr({'aria-expanded': true});
				}
			});

		} else { // toggle current panel depending on the state (open multiple at a time)

			isVisible = !!$panel.is(':visible');
			$panel.slideToggle({ duration: plugin.options.animationSpeed });
			if (isVisible) {
				$me.removeClass('expanded');
				$me.attr({
					'aria-disabled': false,
					'aria-expanded': false // (Criteria 4)
				});
				$panel.attr({'aria-expanded': false});
			} else {
				$me.addClass('expanded');
				$me.attr({
					'aria-disabled': false,
					'aria-expanded': true // (Criteria 4)
				});
				$panel.attr({'aria-expanded': true});
			}

		}
	};

	/**
	 * Handles keydown event on header button.
	 *
	 * @param {Object} event - Keyboard event.
	 * @param {object} event.data - Event data.
	 * @param {object} event.data.plugin - Reference to plugin.
	 */
	Plugin.prototype.onKeyDown = function (event) {

		var $me, $header, plugin, $elem, $current, ind;

		$me = $(event.target);
		$header = $me.parent('dt');
		plugin = event.data.plugin;
		$elem = $(plugin.element);

		switch (event.keyCode) { //Criteria 6

			// toggle panel by pressing enter key, or spacebar
			case ik_utils.keys.enter:
			case ik_utils.keys.space:
				event.preventDefault();
				event.stopPropagation();
				plugin.togglePanel(event);
				break;

			// use up arrow to jump to the previous header
			case ik_utils.keys.up:
				ind = plugin.headers.index($header);
				if (ind > 0) {
					plugin.headers.eq(--ind).find('.button').focus();
				}
				break;

			// use down arrow to jump to the next header
			case ik_utils.keys.down:
				ind = plugin.headers.index($header);
				if (ind < plugin.headers.length - 1) {
					plugin.headers.eq(++ind).find('.button').focus();
				}
				break;
		}
	};

	$.fn[pluginName] = function ( options ) {

		return this.each(function () {

			if ( !$.data(this, pluginName )) {
				$.data( this, pluginName,
				new Plugin( this, options ));
			}

		});

	}

})( jQuery, window, document );