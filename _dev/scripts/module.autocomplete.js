'use strict';
storm_eagle.module('autocomplete', () => {
  let self;
  let state = {};
  let query;
  return {
    i18n: {
      notify: {
        "en-CA": 'As you start typing the application might suggest similar search terms. Use tab, up, or down arrow keys to select a suggested search string. Use Enter key to confirm that value. Use ESC key to exit the results and return focus to the input.',
        "fr-CA": "",
      }
    },
    initialize: () => {
      self = storm_eagle.autocomplete;
      state = {};
      self.setup();
    },
    setup: () => {
      document.querySelectorAll("[data-module='autocomplete']").forEach((el) => {
        let autocomplete_id = el.getAttribute('id');
        state[autocomplete_id] = {
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
      let sr_description_id = state[autocomplete_id]['sr_description_id'];
      document.getElementById(sr_description_id).innerHTML = (value === '') ? self.i18n.notify[LANG] : value;
    },
    close: (autocomplete_id, reset_results) => {
      const results_id = state[autocomplete_id]['results_id'];
      const input_id = state[autocomplete_id]['input_id'];

      document.getElementById(results_id).classList.add('display:none');
      document.getElementById(autocomplete_id).classList.remove('active');
      document.getElementById(autocomplete_id).setAttribute('aria-expanded', 'false');
      if (reset_results) {
        document.getElementById(results_id).innerHTML = '';
      }
    },
    execute_search: (autocomplete_id) => {
      const search_function = state[autocomplete_id]['search_function'];
      const input_id = state[autocomplete_id]['input_id'];
      const query = document.getElementById(input_id).value.trim();
      const results_id = state[autocomplete_id]['results_id'];
      const num_results = state[autocomplete_id]['num_results'];

      if (query.length > 0) {
        storm_eagle.util.run_str_func(search_function, { query, input_id, results_id, autocomplete_id, num_results } );
      }
    },
    add_event_listeners: (autocomplete_id) => {
      const results_id = state[autocomplete_id]['results_id'];
      const input_id = state[autocomplete_id]['input_id'];
      const num_results = state[autocomplete_id]['num_results'];
      const error_message_id = state[autocomplete_id]['error_message_id'];
      const multiselect_id = state[autocomplete_id]['multiselect_id'];
      const keys_to_ignore = [keyboard.keys.tab, keyboard.keys.esc, keyboard.keys.down, keyboard.keys.up, keyboard.keys.enter, keyboard.keys.shift];
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
          if (!keys_to_ignore.includes(event.keyCode)) {
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
