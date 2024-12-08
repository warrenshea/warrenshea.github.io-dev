'use strict';
storm_eagle.module('responsive_emulation', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = storm_eagle.responsive_emulation;
      self.setup();
    },
    setup: () => {
      document.querySelectorAll('[data-module="responsive-emulation"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          container: el.querySelector('[data-module="responsive-emulation.container"]'),
          width: el.querySelector('[data-module="responsive-emulation.container"]').style.width,
        };
      });
    },
    update_container_width: (id, value) => {
      const { container } = state[id];
      container.style.width = `${value}px`;
      state[id]['width'] = parseInt(value);
      self.add_emulate_class(id);
    },
    add_emulate_class: (id) => {
      const { container } = state[id];
      container.classList.remove('emulate:sm=', 'emulate:sm+', 'emulate:md-', 'emulate:md=', 'emulate:md+', 'emulate:lg-', 'emulate:lg=', 'emulate:lg+', 'emulate:xl+');
      if (self.is_sm_only(id)) {
        container.classList.add('emulate:sm=');
      }
      if (self.is_sm_up(id)) {
        container.classList.add('emulate:sm+');
      }
      if (self.is_md_down(id)) {
        container.classList.add('emulate:md-');
      }
      if (self.is_md_only(id)) {
        container.classList.add('emulate:md=');
      }
      if (self.is_md_up(id)) {
        container.classList.add('emulate:md+');
      }
      if (self.is_lg_down(id)) {
        container.classList.add('emulate:lg-');
      }
      if (self.is_lg_only(id)) {
        container.classList.add('emulate:lg=');
      }
      if (self.is_lg_up(id)) {
        container.classList.add('emulate:lg+');
      }
      if (self.is_xl_up(id)) {
        container.classList.add('emulate:xl+');
      }
    },
    is_sm_only: (id) => {
      const { width } = state[id];
      return width >= breakpoints['sm_min'] && width < breakpoints['md_min'];
    },
    is_sm_up: (id) => {
      const { width } = state[id];
      return width >= breakpoints['sm_min'];
    },
    is_md_down: (id) => {
      const { width } = state[id];
      return width >= breakpoints['sm_min'] && width < breakpoints['lg_min'];
    },
    is_md_only: (id) => {
      const { width } = state[id];
      return width >= breakpoints['md_min'] && width < breakpoints['lg_min'];
    },
    is_md_up: (id) => {
      const { width } = state[id];
      return width >= breakpoints['md_min'];
    },
    is_lg_down: (id) => {
      const { width } = state[id];
      return width >= breakpoints['sm_min'] && width < breakpoints['xl_min'];
    },
    is_lg_only: (id) => {
      const { width } = state[id];
      return width >= breakpoints['lg_min'] && width < breakpoints['xl_min'];
    },
    is_lg_up: (id) => {
      const { width } = state[id];
      return width >= breakpoints['lg_min'];
    },
    is_xl_up: (id) => {
      const { width } = state[id];
      return width >= breakpoints['xl_min'];
    },
  };
});
