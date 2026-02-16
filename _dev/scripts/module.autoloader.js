'use strict';
/**
 * Autoloader Module
 *
 * Automatically loads JavaScript modules based on the presence of specific elements in the DOM.
 *
 * Methods Overview:
 * - autoloader.initialize()
 *
 * Structure:
 * - Each module is defined with:
 *   - `script_src`: Path to the module's script.
 *   - `module_name`: Name of the module.
 * - Modules are dynamically loaded when their corresponding DOM elements are found.
 */

storm_eagle.module('autoloader', () => {
  /**
   * Configuration object for all available modules.
   * Maps module names to their script source and module names.
   */
  const storm_eagle_module = {
    accordion: {
      script_src: '/scripts/module.accordion.js',
      module_name: 'accordion',
    },
    anchor: {
      script_src: '/scripts/module.anchor.js',
      module_name: 'anchor',
    },
    carousel: {
      script_src: '/scripts/module.carousel.js',
      module_name: 'carousel',
    },
    dialog: {
      script_src: '/scripts/module.dialog.js',
      module_name: 'dialog',
    },
    form_autocomplete: {
      script_src: '/scripts/module.form.autocomplete.js',
      module_name: 'form_autocomplete',
    },
    form_parent_checkbox: {
      script_src: '/scripts/module.form.parent-checkbox.js',
      module_name: 'form_parent_checkbox',
    },
    form_select_all: {
      script_src: '/scripts/module.form.select-all.js',
      module_name: 'form_select_all',
    },
    form_switch_button: {
      script_src: '/scripts/module.form.switch.button.js',
      module_name: 'form_switch_button',
    },
    form_theme_gl0b3x: {
      script_src: '/scripts/module.form.theme.gl0b3x.js',
      module_name: 'form_theme_gl0b3x',
    },
    form_validation: {
      script_src: '/scripts/module.form.validation.js',
      module_name: 'form_validation',
    },
    header: {
      script_src: '/scripts/module.header.js',
      module_name: 'header',
    },
    isotope: {
      script_src: '/scripts/module.isotope.js',
      module_name: 'isotope',
    },
    menu_submenu: {
      script_src: '/scripts/module.menu-submenu.js',
      module_name: 'menu_submenu',
    },
    popover: {
      script_src: '/scripts/module.popover.js',
      module_name: 'popover',
    },
    range_slider: {
      script_src: '/scripts/module.range-slider.js',
      module_name: 'range_slider',
    },
    show_more: {
      script_src: '/scripts/module.show-more.js',
      module_name: 'show_more',
    },
    slider: {
      script_src: '/scripts/module.slider.js',
      module_name: 'slider',
    },
    tabs: {
      script_src: '/scripts/module.tabs.js',
      module_name: 'tabs',
    },
    waypoint: {
      script_src: '/scripts/module.waypoint.js',
      module_name: 'waypoint',
    },
  };

  return {
    /**
     * Initializes the autoloader module.
     * Checks for DOM elements corresponding to each module and dynamically loads the required JavaScript files.
     */
    initialize: async () => {
      /**
       * Maps module names to their respective DOM query selectors.
       */
      const modules = {
        accordion: '[data-module="accordion"]',
        anchor: '[data-module="anchor"]',
        carousel: "[data-module='carousel']",
        dialog: "[data-module='dialog']",
        form_autocomplete: "[data-module='autocomplete']",
        form_parent_checkbox: '[data-module="parent-checkbox"]',
        form_select_all: '[data-module="select-all"]',
        form_switch_button: '[data-module="switch.button"]',
        form_theme_gl0b3x: '.form\\:theme\\:gl0b3x',
        form_validation: `[data-module='form']`,
        header: "[data-module='header']",
        isotope: "[data-module='isotope']",
        menu_submenu: '[data-module="menu"]',
        popover: "[data-module='popover']",
        range_slider: "[data-module='range-slider.input-container']",
        show_more: "[data-module='show-more']",
        slider: "[data-module='slider.input-container']",
        tabs: "[data-module='tabs']",
        waypoint: "[data-module='waypoint']"
      };

      for (const [script, query] of Object.entries(modules)) {
        // Check if any elements matching the query exist in the DOM
        if (document.querySelectorAll(query).length > 0) {
          try {
            // Dynamically load the script for the module
            await storm_eagle.util.load_javascript(storm_eagle_module[script]['script_src']);
          } catch (error) {
            console.error(`autoloader -> ${error}`);
          }
        }
      }
    },
  };
});
