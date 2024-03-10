'use strict';
storm_eagle.module('autocomplete', () => {
  let self;
  let state = {};
  return {
    i18n: {
      notify: {
        "en": 'As you start typing the application might suggest similar search terms. Use tab, up, or down arrow keys to select a suggested search string. Use Enter key to confirm that value. Use ESC key to exit the results and return focus to the input.',
        "en-CA": 'As you start typing the application might suggest similar search terms. Use tab, up, or down arrow keys to select a suggested search string. Use Enter key to confirm that value. Use ESC key to exit the results and return focus to the input.',
        "fr": "",
      }
    },
    initialize: () => {
      self = storm_eagle.autocomplete;
      state = {};
      self.setup();
    },
    setup: () => {
      document.querySelectorAll("[data-module='autocomplete']").forEach(async (el) => {
        let id = el.getAttribute('id');
        state[id] = {
          el,
          input: el.querySelector("[data-module='autocomplete.input']"),
          input_format: JSON.parse(el.querySelector("[data-module='autocomplete.input']").getAttribute('data-autocomplete-input-format')),
          filter: el.getAttribute("data-autocomplete-filter"),
          input_values: el.getAttribute("data-autocomplete-values") ? JSON.parse(el.getAttribute("data-autocomplete-values")) : null,
          type: el.getAttribute("data-autocomplete-type"),
          data_source_type: el.getAttribute("data-autocomplete-source-type"),
          data_source: el.getAttribute("data-autocomplete-source"),
          data_raw: "",
          data_working: "",
          results: el.querySelector("[data-module='autocomplete.results']"),
          results_format: JSON.parse(el.querySelector("[data-module='autocomplete.results']").getAttribute('data-autocomplete-results-format')),
          max_num_results: parseInt(el.querySelector("[data-module='autocomplete.results']").getAttribute('data-autocomplete-max-results')),
          sr_description: el.querySelector("[data-module='autocomplete.sr-description']"),
          error_message: el.querySelector("[data-module='autocomplete.error']") || false,
          multiselect: el.querySelector("[data-module='autocomplete.multiselect']") || false,
          multiselect_tags_container: el.querySelector("[data-module='autocomplete.multiselect-tags']") || false,
          onupdate: el.getAttribute('data-autocomplete-onupdate-func') || false,
        };
        await self.data.initialize(id);
        self.ui.create_default_tags(id);
        self.event_listeners.initialize(id);
      });
    },
    data: {
      initialize: async (id) => {
        try {
          const { input_values, filter, data_source_type, data_source } = state[id];
          let data;
          if (data_source_type === "fetch") {
            data = await storm_eagle.util.fetch(data_source);
          } else if (data_source_type === "file") {
            data = data_source;
          }
          if (data) {
            state[id]["data_raw"] = data;

            // Initialize data_working with data, assuming no entry is selected initially
            state[id]["data_working"] = data.map(item => ({ ...item, status: '' }));

            // If there are input_values, mark the corresponding entries in data_working as "selected"
            if (input_values && input_values.length > 0) {
              // Iterate over data_working to find and mark input_values
              state[id]["data_working"].forEach(item => {
                if (input_values.includes(item[filter])) {
                  // Mark this item as selected
                  item.status = 'selected';
                }
              });
            }
          }

        } catch (error) {
          console.error('Failed to initialize data:', error);
        }
      },
      update_input_value: (id, selected_values) => {
        const { el, onupdate } = state[id];
        state[id].input_values = selected_values;
        el.setAttribute('data-autocomplete-values', JSON.stringify(selected_values));
        if (onupdate) {
          storm_eagle.util.run_str_func( onupdate, { id } );
        }
      }
    },
    a11y: {
      update_sr_description: (id, value) => {
        const { sr_description } = state[id];
        sr_description.innerHTML = (value === '') ? self.i18n.notify[LANG] : value;
      },
    },
    event_listeners: {
      keys_to_ignore: [keyboard.keys.tab, keyboard.keys.esc, keyboard.keys.down, keyboard.keys.up, keyboard.keys.enter, keyboard.keys.shift],
      initialize: (id) => {
        const { results, input, max_num_results, error_message } = state[id];

        input.removeEventListener('keydown', self.event_listeners.input.keydown_navigate_dropdown);
        input.addEventListener('keydown', self.event_listeners.input.keydown_navigate_dropdown);
        input.removeEventListener('keydown', self.event_listeners.input.keydown_search_string);
        input.addEventListener('keydown', self.event_listeners.input.keydown_search_string);
        input.removeEventListener('focus', self.event_listeners.input.focus);
        input.addEventListener('focus', self.event_listeners.input.focus);
        document.removeEventListener('click', self.event_listeners.outside_dropdown.click.close);
        document.addEventListener('click', self.event_listeners.outside_dropdown.click.close);
      },
      input: {
        keydown_navigate_dropdown: (event) => {
          const id = storm_eagle.util.closest_parent(event.currentTarget, '[data-module="autocomplete"]').getAttribute('id');
          const { results, input } = state[id];
          let selected_dropdown = results.querySelector('.selected');

          switch (event.keyCode) {
            case keyboard.keys.down:
              // select next suggestion from list
              if (selected_dropdown) {
                selected_dropdown.classList.remove('selected');

                if (selected_dropdown === results.querySelector('li:last-child')) {
                  results.querySelector('li:nth-child(1)').classList.add('selected');
                } else {
                  selected_dropdown.nextElementSibling.classList.add('selected');
                }
              } else {
                results.querySelector('li:nth-child(1)') && results.querySelector('li:nth-child(1)').classList.add('selected');
              }

              if (results.querySelector('.selected')) {
                self.a11y.update_sr_description(id, results.querySelector('.selected').getAttribute('data-sr-description'));
                input.setAttribute('aria-activedescendant', results.querySelector('.selected').getAttribute('id'));
              }
              break;

            case keyboard.keys.up:
              // select previous suggestion from list
              if (selected_dropdown) {
                selected_dropdown.classList.remove('selected');

                if (selected_dropdown === results.querySelector('li:nth-child(1)')) {
                  results.querySelector('li:last-child').classList.add('selected');
                } else {
                  selected_dropdown.previousElementSibling.classList.add('selected');
                }

                self.a11y.update_sr_description(id, results.querySelector('.selected').getAttribute('data-sr-description'));
                input.setAttribute('aria-activedescendant', results.querySelector('.selected').getAttribute('id'));
              }
              break;

            case keyboard.keys.esc:
            case keyboard.keys.tab:
              // empty list and hide suggestion box
              self.action.close(id, true);
              break;

            case keyboard.keys.enter:
              event.preventDefault();

              if (selected_dropdown) {
                selected_dropdown.click();
              }
              break;
          }
        },
        keydown_search_string: (event) => {
          const keydown_search_string_handler = storm_eagle.debounce(self.event_listeners.input.keydown_search_string_debounced, 250);
          keydown_search_string_handler(event);
        },
        keydown_search_string_debounced: (event) => {
          const id = storm_eagle.util.closest_parent(event.target, '[data-module="autocomplete"]').getAttribute('id');
          if (!self.event_listeners.keys_to_ignore.includes(event.keyCode)) {
            self.action.execute_search(id);
          }
        },
        focus: (event) => {
          const id = storm_eagle.util.closest_parent(event.target, '[data-module="autocomplete"]').getAttribute('id');
          const { error_message } = state[id];
          document.getElementById(id).classList.add('active');
          document.getElementById(id).setAttribute('aria-expanded', 'true');
          error_message.classList.remove('has-error');
        },
      },
      outside_dropdown: {
        click: {
          close: () => {
            if (event.target.getAttribute('data-module') !== 'autocomplete.results-item' && event.target.getAttribute('data-module') !== 'autocomplete.tag.button') {
              setTimeout(() => {
                self.action.close();
              }, 250);
            }
          }
    }
      },
    },
    action: {
      execute_search: (id) => {
        const { input } = state[id];
        const query = input.value.trim();
        if (query.length > 0) {
          self.ui.show_autocomplete_list(id);
        }
      },
      close: () => {
        document.querySelectorAll("[data-module='autocomplete']").forEach((el) => {
          el.classList.remove('active');
          el.setAttribute('aria-expanded', 'false');
          el.querySelector("[data-module='autocomplete.results']").classList.add('display:none');
          el.querySelector("[data-module='autocomplete.results']").innerHTML = '';
        });
      },
    },
    ui: {
      create_default_tags: (id) => {
        const { data_working, filter, multiselect_tags_container } = state[id];
        if (data_working && multiselect_tags_container) {
          // Find the container for the tags
          data_working.forEach((item, index) => {
            if (item.status === 'selected') {
              let tag = self.util.create_tag_html(id, index, item[filter]);
              multiselect_tags_container.innerHTML += tag;
            }
          });
        }
      },
      show_autocomplete_list: (id) => {
        const { type, input, filter, data_working, results, max_num_results } = state[id];
        const query = input.value.trim();
        let database_temp_keyword;
        if (data_working.length > 0) {
          results.innerHTML = "";
          let count = 0;
          for (let i = 0; i < data_working.length; i++) {
            database_temp_keyword = data_working[i][filter].toLowerCase();
            if (data_working[i]["status"] === "" && data_working[i][filter] !== "" && ((database_temp_keyword.indexOf(query.toLowerCase()) > -1 || database_temp_keyword.toLowerCase().indexOf(query.toLowerCase()) > -1) ? true : false)) {
              count++;
              results.insertAdjacentHTML('beforeend', self.ui.render_autocomplete_result(id, i, data_working[i]));
              results.classList.remove("display:none");
              document.getElementById(id).classList.add("active");
              document.getElementById(id).setAttribute("aria-expanded", "true");
              if (count === max_num_results) {
                break;
              }
            }
          }
        }
      },
      render_autocomplete_result: (id, index, entry) => {
        const { type, input, input_format, max_num_results } = state[id];
        const result_string = input_format.reduce((acc, key) => {
          if (key in entry || key === '-') {
              return acc + (entry[key] ? entry[key] : key) + ' ';
          }
          return acc;
        }, '').trim();
        const input_id = input.getAttribute("id");
        if (type === "single-select") {
          return `\n        <li role="option" data-module="autocomplete.results-item" id="autocomplete-suggestion-${index}" class="unstyle w:100% display:flex align:middle" data-sr-description="${result_string}" onclick="storm_eagle.autocomplete.ui.autocomplete_fill('${id}', ${index}, '${result_string}');storm_eagle.autocomplete.action.close();">${result_string}</li>`;
        } else if (type === "multiselect") {
          return `\n        <li role='option' data-module="autocomplete.results-item" id='autocomplete-suggestion-${index}' class='unstyle w:100% display:flex align:middle' data-sr-description='${result_string}' onclick='storm_eagle.autocomplete.ui.autocomplete_fill("${id}", ${index}, "${result_string}");document.getElementById("${input_id}").focus();'>${result_string}</li>`;
        }
      },
      autocomplete_fill: (id, index, result_string) => {
        const { el, filter, type, input, max_num_results, results, data_working } = state[id];
        const input_id = input.getAttribute("id");
        const query = input.value.trim();
        if (type === "single-select") {
          results.innerHTML = "";
          input.value = result_string;
        } else if (type === "multiselect") {
          const { multiselect_tags_container } = state[id];
          data_working[index]["status"] = "selected";

          input.value = "";
          self.ui.show_autocomplete_list(id);
          let tag = self.util.create_tag_html(id, index, result_string);
          multiselect_tags_container.innerHTML += tag;

          const selected_values = state[id].input_values || [];
          const new_value = data_working[index][filter]; // Assuming 'name' is the identifier
          if (!selected_values.includes(new_value)) {
            selected_values.push(new_value);
          }
          self.data.update_input_value(id, selected_values);
        }
      },
      remove_selected: (id, index) => {
        const { el, filter, input, max_num_results, results, data_working } = state[id];
        document.getElementById(id).querySelector(`[data-autocomplete-tag="${index}"]`).remove();
        data_working[index]["status"] = "";
        //self.ui.show_autocomplete_list(id);

        const selected_values = state[id].input_values || [];
        const value_to_remove = data_working[index][filter]; // Assuming 'name' is the identifier
        const updated_values = selected_values.filter(value => value !== value_to_remove);
        self.data.update_input_value(id, updated_values);
      }
    },
    util: {
      create_tag_html: (id, index, result_string) => {
        return `<div class='bgc:blue color:white heebo:bold py:2px px:8px brr:4px mr:4px my:2px b-silver:1px' data-autocomplete-tag='${index}'>${result_string} <button data-module='autocomplete.tag.button' class='heebo:bold fs:18px color:white' onclick='storm_eagle.autocomplete.ui.remove_selected("${id}", ${index});'>&times;</button></div>`;
      }
    }
  };
});
