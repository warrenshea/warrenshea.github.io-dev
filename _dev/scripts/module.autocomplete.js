'use strict';
storm_eagle.module('autocomplete', () => {
  let self;
  let autocomplete_state = {};
  let query;
  const notify = {
    en: 'As you start typing the application might suggest similar search terms. Use tab, up, or down arrow keys to select a suggested search string. Use Enter key to confirm that value. Use ESC key to exit the results and return focus to the input.',
    fr: '',
  };
  return {
    initialize: () => {
      self = storm_eagle['autocomplete'];
      document.querySelectorAll("[data-module='autocomplete']").forEach((el) => {
        let autocomplete_id = el.getAttribute('id');
        autocomplete_state[autocomplete_id] = {
          input_id: el.querySelector("[data-module='autocomplete.input']").getAttribute('id'),
          search_function: el.querySelector("[data-module='autocomplete.input']").getAttribute('data-autocomplete-search'),
          results_id: el.querySelector("[data-module='autocomplete.results']").getAttribute('id'),
          num_results: parseInt(el.querySelector("[data-module='autocomplete.results']").getAttribute('data-autocomplete-results')),
          sr_description_id: el.querySelector("[data-module='autocomplete.sr-description']").getAttribute('id'),
          error_message_id: el.querySelector("[data-module='autocomplete.error']") ? el.querySelector("[data-module='autocomplete.error']").getAttribute('id') : null,
          multiselect_id: el.querySelector("[data-module='autocomplete.multiselect']") ? el.querySelector("[data-module='autocomplete.multiselect']").getAttribute('id') : null,
          multiselect_tags_id: el.querySelector("[data-module='autocomplete.multiselect-tags']") ? el.querySelector("[data-module='autocomplete.multiselect-tags']").getAttribute('id') : null,
        };
        self.add_event_listeners(autocomplete_id);
      });
    },
    update_sr_description: (autocomplete_id, value) => {
      let sr_description_id = autocomplete_state[autocomplete_id]['sr_description_id'];
      if (value === '') {
        document.getElementById(sr_description_id).innerHTML = notify[LANG];
      } else {
        document.getElementById(sr_description_id).innerHTML = value;
      }
    },
    close: (autocomplete_id, reset_results) => {
      const results_id = autocomplete_state[autocomplete_id]['results_id'];
      const input_id = autocomplete_state[autocomplete_id]['input_id'];

      document.getElementById(results_id).classList.add('display:none');
      document.getElementById(autocomplete_id).classList.remove('active');
      document.getElementById(autocomplete_id).setAttribute('aria-expanded', 'false');
      if (reset_results) {
        document.getElementById(results_id).innerHTML = '';
      }
      // if (document.activeElement !== document.getElementById(input_id)) {
      //   document.getElementById(input_id).focus();
      // }
    },
    execute_search: (autocomplete_id) => {
      const results_id = autocomplete_state[autocomplete_id]['results_id'];
      const input_id = autocomplete_state[autocomplete_id]['input_id'];
      const search_function = autocomplete_state[autocomplete_id]['search_function'];

      const num_results = autocomplete_state[autocomplete_id]['num_results'];
      query = document.getElementById(input_id).value.trim();
      if (query.length > 0) {
        //note: search_function must be a global function, or accessible through dot notation (not bracket notation)
        //@TODO: refactor if possible
        let search_function_parts = search_function.split('.');
        if (search_function_parts.length === 1) {
          window[search_function](query, input_id, results_id, autocomplete_id, num_results);
        } else if (search_function_parts.length === 2) {
          window[search_function_parts[0]][search_function_parts[1]](query, input_id, results_id, autocomplete_id, num_results);
        } else if (search_function_parts.length === 3) {
          window[search_function_parts[0]][search_function_parts[1]][search_function_parts[2]](query, input_id, results_id, autocomplete_id, num_results);
        }
      }
    },
    add_event_listeners: (autocomplete_id) => {
      const results_id = autocomplete_state[autocomplete_id]['results_id'];
      const input_id = autocomplete_state[autocomplete_id]['input_id'];
      const num_results = autocomplete_state[autocomplete_id]['num_results'];
      const error_message_id = autocomplete_state[autocomplete_id]['error_message_id'];
      const multiselect_id = autocomplete_state[autocomplete_id]['multiselect_id'];
      document.getElementById(input_id).addEventListener('keydown', (event) => {
        let selected_dropdown = document.getElementById(results_id).querySelector('.selected');

        switch (event.keyCode) {
          case keyboard.keys.down:
            // select next suggestion from list
            if (selected_dropdown) {
              selected_dropdown.classList.remove('selected');

              if (selected_dropdown === document.getElementById(results_id).querySelector('li:last-child')) {
                document.getElementById(results_id).querySelector('li:nth-child(1)').classList.add('selected'); //.text();
              } else {
                selected_dropdown.nextElementSibling.classList.add('selected'); //.text();
              }
            } else {
              document.getElementById(results_id).querySelector('li:nth-child(1)').classList.add('selected'); //.text();
            }

            self.update_sr_description(autocomplete_id, document.getElementById(results_id).querySelector('.selected').getAttribute('data-sr-description'));
            document.getElementById(input_id).setAttribute('aria-activedescendant', document.getElementById(results_id).querySelector('.selected').getAttribute('id'));
            break;

          case keyboard.keys.up:
            // select previous suggestion from list
            if (selected_dropdown) {
              selected_dropdown.classList.remove('selected');

              if (selected_dropdown === document.getElementById(results_id).querySelector('li:nth-child(1)')) {
                document.getElementById(results_id).querySelector('li:last-child').classList.add('selected'); //.text();
              } else {
                selected_dropdown.previousElementSibling.classList.add('selected'); //.text();
              }

              self.update_sr_description(autocomplete_id, document.getElementById(results_id).querySelector('.selected').getAttribute('data-sr-description'));
              document.getElementById(input_id).setAttribute('aria-activedescendant', document.getElementById(results_id).querySelector('.selected').getAttribute('id'));
            }
            break;

          case keyboard.keys.esc:
          case keyboard.keys.tab:
            // empty list and hide suggestion box
            storm_eagle.autocomplete.close(autocomplete_id, true);
            break;

          case keyboard.keys.enter:
            event.preventDefault();

            if (selected_dropdown) {
              selected_dropdown.click();
            }
            break;
        }
      });
      document.getElementById(input_id).addEventListener(
        'keydown',
        storm_eagle.debounce((event) => {
          if (event.keyCode != keyboard.keys.tab && event.keyCode != keyboard.keys.esc && event.keyCode != keyboard.keys.down && event.keyCode != keyboard.keys.up && event.keyCode != keyboard.keys.enter && event.keyCode != 16) {
            self.execute_search(autocomplete_id);
          }
        }, 250),
      );
      document.getElementById(input_id).addEventListener('focus', (event) => {
        document.getElementById(autocomplete_id).classList.add('active');
        document.getElementById(autocomplete_id).setAttribute('aria-expanded', 'true');
        document.getElementById(error_message_id).classList.remove('has-error');
      });
      document.addEventListener('click', (event) => {
        if (event.target.getAttribute('data-module') !== 'autocomplete.results-item' && event.target.getAttribute('data-module') !== 'autocomplete.tag.button') {
          setTimeout(() => {
            storm_eagle.autocomplete.close(autocomplete_id, true);
          }, 250);
        }
      });
    },
  };
});
