'use strict';
storm_eagle.module('slider', () => {
  let self;
  let module_state = {};

  const handle_slider_change = (event) => {
    self.update_slider_track(event.currentTarget.getAttribute('id'));
  }

  return {
    initialize: () => {
      self = storm_eagle.slider;
      module_state = {};
      document.querySelectorAll('[data-module="slider.input-container"]').forEach((container) => {
        const el = container.querySelector(":scope > [data-module='slider.input']");
        const id = el.getAttribute('id');
        module_state[id] = {
          id,
          el,
          slider_container: container,
          label_container: container.querySelector(':scope > [data-module="slider.labels"]'),
          labels: container.querySelectorAll(':scope > [data-module="slider.labels"] > * '),
          slider_fill: container.querySelector(':scope > [data-module="slider.background"] > [data-module="slider.fill"]'),
        };
        self.manage_slider_input_listener(id);
        //self.resize_listener(id);
        self.update_slider_track(id);
      });
    },
    update_slider_track: (id) => {
      const { el, slider_fill } = module_state[id];
      let percentage = Math.round(((el.value - el.getAttribute('min')) / (el.getAttribute('max') - el.getAttribute('min'))) * 100);
      slider_fill.style.width = `${percentage}%`;
    },
    manage_slider_input_listener: (id) => {
      const { el } = module_state[id];
      el.removeEventListener('input', handle_slider_change);
      el.addEventListener('input', handle_slider_change);
    },
    // resize_listener: (id) => {
    //   const { slider_container, labels, label_container } = module_state[id];
    //   let num_labels = labels.length;
    //   const force_resize = () => {
    //     let container_width = slider_container.offsetWidth;
    //     let full_label_width = (container_width * num_labels) / (num_labels - 1);
    //     label_container.style.width = `${full_label_width}px`;
    //     let transform_left = (50 / num_labels) * -1;
    //     label_container.style.transform = `translateX(${transform_left}%)`;
    //   }
    //   storm_eagle.resize_observer(id, force_resize);
    // },
  };
});
