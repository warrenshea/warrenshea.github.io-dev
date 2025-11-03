'use strict';
/**
 * Anchor Module
 *
 * A utility to manage text content with optional left and right icon wrappers.
 * Handles text distribution between content area and icon wrappers based on word count.
 *
 * Methods Overview:
 * - anchor.initialize()
 * - anchor.setup()
 * - anchor.ui.distribute_text()
 *
 * Data Attributes:
 * - data-module="anchor"
 * - data-module="anchor.content"
 * - data-module="anchor.left-icon-wrapper"
 * - data-module="anchor.left-icon"
 * - data-module="anchor.right-icon-wrapper"
 * - data-module="anchor.right-icon"
 */

storm_eagle.module('anchor', () => {
  let self;
  let state = {};

  return {
    /**
     * Initializes the anchor module.
     * Sets up the module's self reference and resets the state object.
     */
    initialize: () => {
      self = storm_eagle.anchor;
      state = {};
      self.setup();
    },

    /**
     * Configures all anchor elements on the page.
     * Finds all elements with data-module="anchor" and initializes their state with
     * content area and optional icon wrappers.
     */
    setup: () => {
      document.querySelectorAll('[data-module="anchor"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          content: el.querySelector(':scope > [data-module="anchor.content"]'),
          left_icon: el.querySelector(':scope > [data-module="anchor.left-icon-wrapper"] > [data-module="anchor.left-icon"]'),
          left_icon_wrapper: el.querySelector(':scope > [data-module="anchor.left-icon-wrapper"]'),
          right_icon: el.querySelector(':scope > [data-module="anchor.right-icon-wrapper"] > [data-module="anchor.right-icon"]'),
          right_icon_wrapper: el.querySelector(':scope > [data-module="anchor.right-icon-wrapper"]'),
        };
        self.ui.initialize(id);
      });
    },
    /**
     * UI-related functions for managing text layout and distribution
     */
    ui: {
      initialize: (id) => {
        self.ui.distribute_text(id);
      },
      /**
       * Distributes text content between main area and icon wrappers, handling text layout.
       * For single-word content, adds display and whitespace classes.
       * For multi-word content, optionally moves first/last words to icon wrappers.
       * @param {string} id - The ID of the anchor instance to process
       */
      distribute_text: (id) => {
        const { el, content, left_icon, right_icon, left_icon_wrapper, right_icon_wrapper } = state[id];
        if (content) {
          const text = content.textContent.trim(); // Get the full text
          const words = text.split(' '); // Split into words
          if (words.length === 1) {
            el.classList.add("display:inline-block","ws:nowrap");
          } else {
            if (left_icon) {
              if (words.length > 1) {
                const firstWord = words.shift(); // Remove the first word
                left_icon_wrapper.innerHTML += `${firstWord}`;
                content.textContent = words.join(' ');
              }
            }
            if (right_icon) {
              const lastWord = words.pop(); // Remove the last word
              right_icon_wrapper.innerHTML = `${lastWord}${right_icon_wrapper.innerHTML}`
              content.textContent = words.join(' ');
            }
          }
        }
      },
    },
  };
});