'use strict';
storm_eagle.module('autoload_scripts', () => {
  const storm_eagle_module = {
    accordion: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.accordion.js',
      module_name: 'accordion',
    },
    autocomplete: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.autocomplete.js',
      module_name: 'autocomplete',
    },
    carousel: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.carousel.js',
      module_name: 'carousel',
    },
    dialog: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.dialog.js',
      module_name: 'dialog',
    },
    form_parent_checkbox: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.form.parent-checkbox.js',
      module_name: 'form_parent_checkbox',
    },
    form_select_all: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.form.select-all.js',
      module_name: 'form_select_all',
    },
    form_switch_button: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.form.switch.button.js',
      module_name: 'form_switch_button',
    },
    form_theme_gl0b3x: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.form.theme.gl0b3x.js',
      module_name: 'form_theme_gl0b3x',
    },
    form_validation: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.form.validation.js',
      module_name: 'form_validation',
    },
    header: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.header.js',
      module_name: 'header',
    },
    menu_submenu: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.menu-submenu.js',
      module_name: 'menu_submenu',
    },
    popover: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.popover.js',
      module_name: 'popover',
    },
    range_slider: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.range-slider.js',
      module_name: 'range_slider',
    },
    show_more: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.show-more.js',
      module_name: 'show_more',
    },
    slider: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.slider.js',
      module_name: 'slider',
    },
    tabs: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.tabs.js',
      module_name: 'tabs',
    },
    waypoint: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.waypoint.js',
      module_name: 'waypoint',
    },
  };

  return {
    initialize: () => {
      const modules = {
        accordion: '[data-module="accordion"]',
        autocomplete: "[data-module='autocomplete']",
        carousel: "[data-module='carousel']",
        dialog: "[data-module='dialog']",
        form_parent_checkbox: '[data-module="parent-checkbox"]',
        form_select_all: '[data-module="select-all"]',
        form_switch_button: '[data-module="switch.button"]',
        form_theme_gl0b3x: '.form\\:theme\\:gl0b3x',
        form_validation: `[data-module='form']`,
        header: "[data-module='header']",
        menu_submenu: '[data-module="menu"]',
        popover: "[data-module='popover']",
        range_slider: "[data-module='range-slider.input-container']",
        show_more: "[data-module='show-more']",
        slider: "[data-module='slider.input-container']",
        tabs: "[data-module='tabs']",
        waypoint: "[data-module='waypoint']"
      };

      Object.entries(modules).forEach(([script, query]) => {
        if (document.querySelectorAll(query).length > 0) {
          storm_eagle.util.load_javascript(storm_eagle_module[script]['script_src']).catch(error => {
            console.error(`autoload_scripts -> ${error}`);
          });
        }
      });
    },
  };
});
