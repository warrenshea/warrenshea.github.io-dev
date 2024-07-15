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

  const load_javascript = (key) => {
    return new Promise((resolve, reject) => {
      const script_element = document.createElement('script');
      script_element.src = chill_penguin_module[key]['script_src'];
      script_element.defer = true;
      script_element.onload = resolve;
      script_element.onerror = reject;
      document.head.appendChild(script_element);
    });
  };

  return {
    initialize: () => {
      const accordion = document.querySelectorAll('[data-module="accordion"]').length > 0;
      const autocomplete = document.querySelectorAll("[data-module='autocomplete']").length > 0;
      const carousel = document.querySelectorAll("[data-module='carousel']").length > 0;
      const dialog = document.querySelectorAll("[data-module='dialog']").length > 0;
      const form_parent_checkbox = document.querySelectorAll('[data-module="parent-checkbox"]').length > 0;
      const form_select_all = document.querySelectorAll('[data-module="select-all"]').length > 0;
      const form_switch_button = document.querySelectorAll('[data-module="switch.button"]').length > 0;
      const form_theme_gl0b3x = document.querySelectorAll('.form\\:theme\\:gl0b3x').length > 0;
      const form_validation = document.querySelectorAll(`[data-module='form']`).length > 0;
      const header = document.querySelectorAll("[data-module='header']").length > 0;
      const menu_submenu = document.querySelectorAll('[data-module="menu"]').length > 0;
      const popover = document.querySelectorAll("[data-module='popover']").length > 0;
      const range_slider = document.querySelectorAll("[data-module='range-slider.input-container']").length > 0;
      const show_more = document.querySelectorAll("[data-module='show-more']").length > 0;
      const slider = document.querySelectorAll("[data-module='slider.input-container']").length > 0;
      const tabs = document.querySelectorAll("[data-module='tabs']").length > 0;
      const waypoint = document.querySelectorAll("[data-module='waypoint']").length > 0;

      const scripts = [
        'accordion',
        'autocomplete',
        'carousel',
        'dialog',
        'form_parent_checkbox',
        'form_select_all',
        'form_switch_button',
        'form_theme_gl0b3x',
        'form_validation',
        'header',
        'menu_submenu',
        'popover',
        'range_slider',
        'show_more',
        'slider',
        'tabs',
        'waypoint'
      ];

      scripts.forEach(script => {
        if (window[script]) {
          load_javascript(script).catch(error => {
            console.error(`autoload_scripts -> ${error}`);
          });
        }
      });
    },
  };
});
