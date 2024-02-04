  'use strict';
  storm_eagle.module('grid_overlay', () => {
    let self;
    let state = {};
    let prev_body_width = 0;
    return {
      initialize: () => {
        self = storm_eagle.grid_overlay;
        document.querySelectorAll('[data-module="iframe-grid-overlay"]').forEach((el, index) => {
          let id = el.getAttribute('id');
          state[id] = {
            iframe: el.querySelector('[data-module="iframe-grid"]'),
            container: el.querySelector('[data-module="range-slider.input-container"]'),
            slider_1: el.querySelector('[data-module="range-slider.input-1"]'),
            slider_2: el.querySelector('[data-module="range-slider.input-2"]'),
            range_slider_width: el.querySelector('[data-module="range-slider-width"]'),
          };
        });
        self.add_message_listener();
        self.resize_listener();
        self.slider_listener();
      },
      add_message_listener: () => {
        window.addEventListener('message', (event) => {
          // console.log(`receiving message: ${event.data}`);
          if (event.data !== "") {
            let { action, new_height, id } = JSON.parse(event.data);
            if (action === "update_height") {
              // console.log(state[id]['iframe']);
              // console.log(`grid_overlay.js > message recieved > ${new_height}:${id}`);
              new_height = parseInt(new_height);
              state[id]['iframe'].style.height = `${new_height + 1}px`;
              self.update_range_sliders(id);
              if (storm_eagle.isotope_cards) {
                storm_eagle.isotope_cards.refresh_isotope();
              }
            }
          }
        });
      },
      update_range_sliders: (id) => {
        //console.log(`grid_overlay.js > update_range_sliders > ${id}`);
        let min_range = state[id]['container'].offsetWidth * 2 * -1;
        let max_range = state[id]['container'].offsetWidth * 2;
        state[id]['slider_1'].min = min_range;
        state[id]['slider_2'].min = min_range;
        state[id]['slider_1'].max = max_range;
        state[id]['slider_2'].max = max_range;
        state[id]['slider_1'].setAttribute('value', min_range);
        state[id]['slider_2'].setAttribute('value', max_range);
        if (storm_eagle.range_slider) {
          storm_eagle.range_slider.ui.update_slider_track(state[id]['slider_1'].getAttribute('id'));
        }
      },
      show_grid: (id) => {
        document.querySelector(`.${id}`).classList.remove('hide');
      },
      hide_grid: (id) => {
        document.querySelector(`.${id}`).classList.add('hide');
      },
      calculate_grid_lines: (grid_overlay_wrapper, width) => {
        const wrapper = document.querySelector(`.${grid_overlay_wrapper}`);
        wrapper.classList.remove("sm","md","lg","xl");
        if (width >= breakpoints.sm_min && width < breakpoints.md_min) {
          wrapper.classList.add("sm");
        } else if (width >= breakpoints.md_min && width < breakpoints.lg_min) {
          wrapper.classList.add("md");
        } else if (width >= breakpoints.lg_min && width < breakpoints.xl_min) {
          wrapper.classList.add("lg");
        } else {
          wrapper.classList.add("xl");
        }
        wrapper.style.width = `${width}px`;
      },
      range_slider_input_1: (id) => {
        let val1 = state[id]['slider_1'].value;
        let val2 = state[id]['slider_2'].value;
        if (val1 > (breakpoints.sm_min * -2)) {
          val1 = (breakpoints.sm_min * -2).toString();
          state[id]['slider_1'].value = val1;
          state[id]['slider_1'].setAttribute('value', val1);
          state[id]['slider_2'].value = val2;
          state[id]['slider_2'].setAttribute('value', val2);
        } else {
          state[id]['slider_2'].value = -val1;
          state[id]['slider_2'].setAttribute('value', -val1);
        }
        state[id]['range_slider_width'].value = `  ${Math.abs(Math.ceil(val1 / 2))}px`;
        //console.log(`range_slider_input_1 > ${id} > asking_for_height`);
        const action = "asking_for_height";
        const query = { action };
        state[id]['iframe'].contentWindow.postMessage(JSON.stringify(query), window.location.origin);
        state[id]['iframe'].style.width = `${Math.abs(val1 / 2)}px`;
        self.calculate_grid_lines(id, Math.min(1280, Math.abs(val1 / 2)));
      },
      range_slider_input_2: (id) => {
        let val1 = state[id]['slider_1'].value;
        let val2 = state[id]['slider_2'].value;
        if (val2 < (breakpoints.sm_min * 2)) {
          val2 = (breakpoints.sm_min * 2).toString();
          state[id]['slider_1'].value = val1;
          state[id]['slider_1'].setAttribute('value', val1);
          state[id]['slider_2'].value = val2;
          state[id]['slider_2'].setAttribute('value', val2);
        } else {
          state[id]['slider_1'].value = -val2;
          state[id]['slider_1'].setAttribute('value', -val2);
        }
        state[id]['range_slider_width'].value = `  ${Math.abs(Math.ceil(val2 / 2))}px`;
        //console.log(`range_slider_input_2 > ${id} > asking_for_height`);
        const action = "asking_for_height";
        const query = { action };
        state[id]['iframe'].contentWindow.postMessage(JSON.stringify(query), window.location.origin);
        state[id]['iframe'].style.width = `${Math.abs(val2 / 2)}px`;
        self.calculate_grid_lines(id, Math.min(breakpoints.xl_min, Math.abs(val2 / 2)));
      },
      force_grid: (id, grid_value) => {
        const action = "asking_for_height";
        const query = { action };
        switch (grid_value) {
          case 1280:
            //console.log(`force_grid (1280) > asking_for_height`);
            state[id]['iframe'].contentWindow.postMessage(JSON.stringify(query), window.location.origin);
            state[id]['slider_1'].value = breakpoints.xl_min * 2 * -1;
            state[id]['slider_1'].setAttribute('value', breakpoints.xl_min * 2 * -1);
            state[id]['slider_2'].value = breakpoints.xl_min * 2;
            state[id]['slider_2'].setAttribute('value', breakpoints.xl_min * 2);
            state[id]['iframe'].style.width = `${breakpoints.xl_min}px`;
            self.calculate_grid_lines(id, breakpoints.xl_min);
            state[id]['range_slider_width'].value = `  ${breakpoints.xl_min}px`;
            storm_eagle.range_slider.ui.update_slider_track(state[id]['slider_1'].getAttribute('id'));
            break;
          case 1024:
            //console.log(`force_grid (1024) > asking_for_height`);
            state[id]['iframe'].contentWindow.postMessage(JSON.stringify(query), window.location.origin);
            state[id]['slider_1'].value = breakpoints.lg_min * 2 * -1;
            state[id]['slider_1'].setAttribute('value', breakpoints.lg_min * 2 * -1);
            state[id]['slider_2'].value = breakpoints.lg_min * 2;
            state[id]['slider_2'].setAttribute('value', breakpoints.lg_min* -1);
            state[id]['iframe'].style.width = `${breakpoints.lg_min}px`;
            self.calculate_grid_lines(id, breakpoints.lg_min);
            state[id]['range_slider_width'].value = `  ${breakpoints.lg_min}px`;
            storm_eagle.range_slider.ui.update_slider_track(state[id]['slider_1'].getAttribute('id'));
            break;
          case 768:
            //console.log(`force_grid (768) > asking_for_height`);
            state[id]['iframe'].contentWindow.postMessage(JSON.stringify(query), window.location.origin);
            state[id]['slider_1'].value = breakpoints.md_min * 2 * -1;
            state[id]['slider_1'].setAttribute('value', breakpoints.md_min * 2 * -1);
            state[id]['slider_2'].value = breakpoints.md_min * 2;
            state[id]['slider_2'].setAttribute('value', breakpoints.md_min* -1);
            state[id]['iframe'].style.width = `${breakpoints.md_min}px`;
            self.calculate_grid_lines(id, breakpoints.md_min);
            state[id]['range_slider_width'].value = `  ${breakpoints.md_min}px`;
            storm_eagle.range_slider.ui.update_slider_track(state[id]['slider_1'].getAttribute('id'));
            break;
          case 375:
            //console.log(`force_grid (375) > asking_for_height`);
            state[id]['iframe'].contentWindow.postMessage(JSON.stringify(query), window.location.origin);
            state[id]['slider_1'].value = breakpoints.sm_min * 2 * -1;
            state[id]['slider_1'].setAttribute('value', breakpoints.sm_min * 2 * -1);
            state[id]['slider_2'].value = breakpoints.sm_min * 2;
            state[id]['slider_2'].setAttribute('value', breakpoints.sm_min * 2);
            state[id]['iframe'].style.width = `${breakpoints.sm_min}px`;
            self.calculate_grid_lines(id, breakpoints.sm_min);
            state[id]['range_slider_width'].value = `  ${breakpoints.sm_min}px`;
            storm_eagle.range_slider.ui.update_slider_track(state[id]['slider_1'].getAttribute('id'));
            break;
          default:
            break;
        }
      },
      //if the entire window changes in width, update the range sliders for all the grids
      resize_listener: () => {
        const force_resize_on_width_change = () => {
          if (prev_body_width !== document.querySelector('body').offsetWidth) {
            prev_body_width = document.querySelector('body').offsetWidth;
            Object.keys(state).forEach((key) => {
              self.update_range_sliders(key);
            });
          }
        }
        storm_eagle.resize_observer(document.querySelector('body'), force_resize_on_width_change);
      },
      slider_listener: () => {
        const change_fill_color = (el) => {
          let width = Math.ceil(el.getBoundingClientRect().width);
          if (storm_eagle.client.viewport.is_sm_only(width)) {
            el.style.backgroundColor = "#f4c026";
          } else if (storm_eagle.client.viewport.is_md_only(width)) {
            el.style.backgroundColor = "#09681d";
          } else if (storm_eagle.client.viewport.is_lg_only(width)) {
            el.style.backgroundColor = "#ab1e23";
          } else if (storm_eagle.client.viewport.is_xl_up(width)) {
            el.style.backgroundColor = "#3169b2";
          }
        }
        document.querySelectorAll(`[data-module="iframe-grid-overlay"] [data-module="slider.fill"]`).forEach((el) => {
          storm_eagle.resize_observer(el, change_fill_color, { "props": el });
        });
      },
    };
  });
