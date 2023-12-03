'use strict';
storm_eagle.module('slider', () => {
  let self;
  let module_state = {};

  const update_slider_track = (event) => {
    self.update_slider_track(module_state[event.currentTarget.getAttribute('id')]);
  }

  return {
    initialize: () => {
      self = storm_eagle.slider;
      module_state = {};
      document.querySelectorAll('[data-module="slider.input-container"]').forEach((container) => {
        let id = container.querySelector("[data-module='slider.input']").getAttribute('id');
        module_state[id] = {
          id,
          slider_container: container,
          slider_input: container.querySelector("[data-module='slider.input']"),
          label_container: container.querySelector('[data-module="slider.labels"]'),
          labels: container.querySelectorAll('[data-module="slider.labels"] > * '),
          slider_fill: container.querySelector('[data-module="slider.fill"]'),
        };
        self.slider_listener(module_state[id]);
        self.resize_listener(module_state[id]);
        self.update_slider_track(module_state[id]);
      });
    },
    slider_listener: (state) => {
      const { slider_input } = state;
      slider_input.removeEventListener('input', update_slider_track);
      slider_input.addEventListener('input', update_slider_track);
    },
    update_slider_track: (state) => {
      const { id, slider_input, slider_fill } = state;
      let percentage = Math.round(((slider_input.value - slider_input.getAttribute('min')) / (slider_input.getAttribute('max') - slider_input.getAttribute('min'))) * 100);
      slider_fill.style.width = `${percentage}%`;
    },
    update_all_slider_track: () => {
      document.querySelectorAll('[data-module="slider.input-container"] [data-module="slider.input"]').forEach((el) => {
        self.update_slider_track(module_state[el.getAttribute('id')]);
      });
    },
    resize_listener: (state) => {
      const { id, slider_container, labels, label_container } = state;
      let num_labels = labels.length;
      const force_resize = () => {
        let container_width = slider_container.offsetWidth;
        let full_label_width = (container_width * num_labels) / (num_labels - 1);
        label_container.style.width = `${full_label_width}px`;
        let transform_left = (50 / num_labels) * -1;
        label_container.style.transform = `translateX(${transform_left}%)`;
      }
      storm_eagle.resize_observer(id, force_resize);
    },
  };
});
