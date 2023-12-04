'use strict';
storm_eagle.module('range_slider', () => {
  let self;
  let module_state = {};

  const handle_slider_change_1 = (event) => {
    self.update_slider_track(event.currentTarget.getAttribute('id'));
  }

  const handle_slider_change_2 = (event) => {
    self.update_slider_track(event.currentTarget.previousElementSibling.getAttribute('id'));
  }

  return {
    initialize: () => {
      self = storm_eagle.range_slider;
      module_state = {};
      document.querySelectorAll('[data-module="range-slider.input-container"]').forEach((container) => {
        const el1 = container.querySelector('[data-module="range-slider.input-1"]');
        const id1 = el1.getAttribute('id');
        const el2 = container.querySelector('[data-module="range-slider.input-2"]');
        const id2 = el2.getAttribute('id');
        module_state[id1] = {
          id1,
          el1,
          id2,
          el2,
          slider_container: container,
          label_container: container.querySelector(':scope > [data-module="slider.labels"]'),
          labels: container.querySelectorAll(':scope > [data-module="slider.labels"] > * '),
          slider_fill: container.querySelector(':scope > [data-module="slider.background"] > [data-module="slider.fill"]'),
        };
        self.manage_slider_input_listeners(id1);
        self.update_slider_track(id1);
        self.resize_listener(id1);
      });
    },
    ready: () => {
      document.querySelectorAll('[data-module="range-slider.input-1"]').forEach((el) => {
        self.label_resize(el.getAttribute('id'));
      });
    },
    manage_slider_input_listeners: (id1) => {
      const { el1, el2 } = module_state[id1];
      el1.removeEventListener('input', handle_slider_change_1);
      el1.addEventListener('input', handle_slider_change_1);
      el2.removeEventListener('input', handle_slider_change_2);
      el2.addEventListener('input', handle_slider_change_2);
    },
    update_slider_track: (id1) => {
      const { slider_fill } = module_state[id1];

      let { el1, el2 } = module_state[id1];
      if (parseInt(el1.value) > parseInt(el2.value)) {
        let temp = el1;
        el1 = el2;
        el2 = temp;
      }
      const left = ((el1.value - el1.getAttribute('min')) / (el1.getAttribute('max') - el1.getAttribute('min'))) * 100;
      slider_fill.style.left = `${left}%`;
      const percentage = ((el2.value - el2.getAttribute('min')) / (el2.getAttribute('max') - el2.getAttribute('min'))) * 100;
      slider_fill.style.width = `${percentage - left}%`;
    },
    label_resize: (id1) => {
      const { slider_container, labels, label_container } = module_state[id1];
      const num_labels = labels.length;
      let container_width = slider_container.offsetWidth;
      let full_label_width = (container_width * num_labels) / (num_labels - 1);
      label_container.style.width = `${full_label_width}px`;
      let transform_left = (50 / num_labels) * -1;
      label_container.style.transform = `translateX(${transform_left}%)`;
    },
    resize_listener: (id1) => {
      const { el1 } = module_state[id1];
      const label_resize = () => {
        self.label_resize(id1);
      }
      storm_eagle.resize_observer(el1, label_resize);
    },
  };
});
