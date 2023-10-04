'use strict';

/* Define global constants and map */
const keyboard = {};
keyboard.keys = {
  backspace: 8,
  tab: 9,
  enter: 13,
  esc: 27,
  space: 32,
  delete: 46,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  end: 35,
  home: 36,
  shift: 16,
};

const breakpoints = {
  sm_min: 320,
  md_min: 768,
  lg_min: 1024,
  xl_min: 1280,
};

const focus_trap_selector = `a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), li[role="tab"]:not([disabled]), div[role="tabpanel"]:not([disabled]), label`;
const remove_focus_selector = `.form\\:theme\\:gl0b3x input[type="radio"]+label, .form\\:theme\\:gl0b3x input[type="text"]+label, .form\\:theme\\:gl0b3x input[type="email"]+label, [data-module="popover"] button, [data-module="popover"] a`;

/**
 * storm_eagle Object
 * storm_eagle.module()
 * storm_eagle.throw_exception()
 * storm_eagle.cookie.get()
 * storm_eagle.cookie.set()
 * storm_eagle.cookie.unset()
 * storm_eagle.validation.is_number()
 * storm_eagle.validation.is_string()
 * storm_eagle.format.number()
 * storm_eagle.format.currency()
 * storm_eagle.format.percentage()
 * storm_eagle.reverse_format.get_numeric_value()
 * storm_eagle.checkbox.is_checked()
 * storm_eagle.checkbox.set_checked()
 * storm_eagle.checkbox.get_values()
 * storm_eagle.radiobutton.is_checked()
 * storm_eagle.radiobutton.set_checked()
 * storm_eagle.radiobutton.get_value()
 * storm_eagle.client.viewport.get_width()
 * storm_eagle.client.viewport.get_breakpoint()
 * storm_eagle.client.viewport.get_height()
 * storm_eagle.client.viewport.is_sm_only()
 * storm_eagle.client.viewport.is_sm_up()
 * storm_eagle.client.viewport.is_md_down()
 * storm_eagle.client.viewport.is_md_only()
 * storm_eagle.client.viewport.is_md_up()
 * storm_eagle.client.viewport.is_lg_down()
 * storm_eagle.client.viewport.is_lg_only()
 * storm_eagle.client.viewport.is_lg_up()
 * storm_eagle.client.viewport.is_xl_up()
 * storm_eagle.client.get_user_agent()
 * storm_eagle.client.is_android()
 * storm_eagle.client.is_blackberry()
 * storm_eagle.client.is_ios()
 * storm_eagle.client.is_opera()
 * storm_eagle.client.is_windows()
 * storm_eagle.client.is_any()
 * storm_eagle.page.get_query_value()
 * storm_eagle.page.get_hash()
 * storm_eagle.page.set_hash()
 * storm_eagle.page.get_language_code()
 * storm_eagle.util.replace_all()
 * storm_eagle.util.index_in_parent()
 * storm_eagle.open_window()
 * storm_eagle.scroll_to()
 * storm_eagle.debounce()
 * storm_eagle.resize_observer()
 **/

var storm_eagle = (function () {
  return {
    /**
     * Add module and module name_space to the storm_eagle object
     *
     * @param string name_space
     * @param object module_object
     * @return mixed
     * @scope public
     */
    module: (name_space, module_object) => {
      if (storm_eagle[name_space] === undefined) {
        storm_eagle[name_space] = module_object();
        if (storm_eagle[name_space] !== undefined) {
          if (typeof storm_eagle[name_space].initialize === 'function') {
            storm_eagle[name_space].initialize();
          }
          if (typeof storm_eagle[name_space].ready === 'function') {
            storm_eagle.document_ready(() => {
              storm_eagle[name_space].ready();
            });
          }
          return storm_eagle[name_space];
        }
      } else {
        console.warn(`Cannot create module. The module: '${name_space}' already exists`);
      }
    },

    destroy_module: (name_space) => {
      storm_eagle[name_space] = undefined;
    },

    /**
     * Throws an exception
     *
     * @param string message
     * @return void
     * @scope public
     */
    throw_exception: (message) => {
      if (message !== undefined) {
        throw message;
        console.log(message);
      } else {
        throw true;
      }
      console.trace();
    },

    document_ready: (fn) => {
      /* see if DOM is already available */
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(fn, 1); /* call on next available tick */
      } else {
        document.addEventListener('DOMContentLoaded', fn);
      }
    },

    cookie: {
      /**
       * Gets a cookie value
       *
       * @param string name
       * @return string
       * @scope public
       */
      get: (name) => {
        let start = document.cookie.indexOf(name + '=');
        if (start == -1) {
          return null;
        } else {
          start = start + name.length + 1;
          let end = document.cookie.indexOf(';', start);
          if (end == -1) {
            end = document.cookie.length;
          }
          return unescape(document.cookie.substring(start, end));
        }
      },

      /**
       * Sets a cookie value
       *
       * @param string name
       * @param string value
       * @param integer expires
       * @return void
       * @scope public
       */
      set: (name, value, expires) => {
        let milliseconds = expires === undefined ? 0 : parseInt(expires) * 1000 * 60 * 60 * 24;
        let greenwichMeanTime = new Date(new Date().getTime() + milliseconds).toGMTString();
        document.cookie = name + '=' + escape(value) + (expires > 0 ? ';expires=' + greenwichMeanTime : '') + '; path=/';
      },

      /**
       * Unsets a cookie
       *
       * @param string name
       * @return void
       * @scope public
       */
      unset: (name) => {
        let value = storm_eagle.cookie.get(name);
        if (value !== null) {
          document.cookie = name + '=;expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';
        }
      },
    },

    validation: {
      /**
       * Checks if a value is of type Number
       *
       * @param mixed value
       * @return boolean
       * @scope public
       */
      is_number: (value) => {
        switch (typeof value) {
          case 'number':
            return true;
            break;
          case 'object':
            return value instanceof Number;
            break;
          default:
            return false;
        }
      },

      /**
       * Checks if a value is of type String
       *
       * @param mixed value
       * @return boolean
       * @scope public
       */
      is_string: (value) => {
        switch (typeof value) {
          case 'string':
            return true;
            break;
          case 'object':
            return value instanceof String;
            break;
          default:
            return false;
        }
      },
    },

    format: {
      /**
       * Formats a number
       *
       * @param mixed number
       * @param integer factor
       * @return string
       * @scope public
       */
      number: (number, factor) => {
        let decimal_symbol;
        let thousands_symbol;
        let sign;
        let i;
        let j;
        let n;

        if (storm_eagle.validation.is_number(number)) {
          number = number.toString();
        }
        factor = isNaN((factor = Math.abs(factor))) ? 0 : factor;
        switch (LANG) {
          case 'fr':
            decimal_symbol = ',';
            thousands_symbol = ' ';
            break;
          default:
            decimal_symbol = '.';
            thousands_symbol = ',';
            break;
        }
        (number = Number(number.replace(RegExp('[^0-9\\.]', 'g'), ''))),
          (sign = number < 0 ? '-' : ''),
          (i = parseInt((number = Math.abs(+number || 0).toFixed(factor))) + ''),
          (j = (j = i.length) > 3 ? j % 3 : 0),
          (n =
            sign +
            (j ? i.substr(0, j) + thousands_symbol : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands_symbol) +
            (factor
              ? decimal_symbol +
                Math.abs(number - i)
                  .toFixed(factor)
                  .slice(2)
              : ''));
        return n;
      },

      /**
       * Formats a number to currency
       *
       * @param mixed number
       * @param integer factor
       * @return string
       * @scope public
       */
      currency: (number, factor) => {
        factor = isNaN((factor = Math.abs(factor))) ? 2 : factor;
        number = storm_eagle.format.number(number, factor);
        switch (LANG) {
          case 'fr':
            return number + ' $';
          default:
            return '$' + number;
        }
      },

      /**
       * Formats a number to percentage
       *
       * @param mixed number
       * @param integer factor
       * @return string
       * @scope public
       */
      percentage: (number, factor) => {
        factor = isNaN((factor = Math.abs(factor))) ? 3 : factor;
        number = storm_eagle.format.number(number, factor);
        switch (LANG) {
          case 'fr':
            return number + ' %';
          default:
            return number + '%';
        }
      },
    },

    reverse_format: {
      /**
       * Gets a formatted number as a number
       *
       * @param mixed number
       * @return float
       * @scope public
       */
      get_numeric_value: (number) => {
        switch (LANG) {
          case 'fr':
            number = number.replace(',', '.');
            break;
        }
        number = Number(
          number
            .replace(/[^0-9.]/gi, '')
            .replace('.', ' ')
            .replace(/\./g, '')
            .replace(' ', '.'),
        );
        if (isNaN(number)) {
          number = 0;
        }
        return number;
      },
    },

    checkbox: {
      is_checked: (element) => {
        if (typeof element.checked === 'boolean') {
          return element.checked;
        }
        // If ARIA checkbox widget
        return element.getAttribute('aria-checked') === 'true';
      },

      set_checked: (element, value) => {
        if (typeof element.checked === 'boolean') {
          switch (value.toString()) {
            case 'true':
              element.checked = true;
              break;
            case 'false':
              element.checked = false;
              break;
            default:
              break;
          }
        }
      },

      /* this is specifically helpful for 'parent' checkboxes where the aria-checked could be 'mixed' */
      set_aria_checked: (element, value) => {
        element.setAttribute('aria-checked', value);
      },

      get_values: (selector) => {
        let checkbox_values = [];
        let elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          if (storm_eagle.checkbox.is_checked(el)) {
            checkbox_values.push(el.value);
          }
        });
        return checkbox_values;
      },
    },

    radiobutton: {
      is_checked: (element) => {
        if (typeof element.checked === 'boolean') {
          return element.checked;
        }
      },

      set_checked: (selector_or_element, value) => {
        if (typeof selector_or_element === 'string') {
          document.querySelector(selector_or_element).checked = value;
        } else {
          selector_or_element.checked = value;
        }
      },

      set_checked_from_value: (selector, value) => {
        document.querySelectorAll(selector).forEach((el) => {
          if (el.value === value) {
            el.checked = true;
            return;
          }
        });
      },

      get_value: (selector) => {
        return document.querySelector(`${selector}:checked`) ? document.querySelector(`${selector}:checked`).value : null;
      },
    },

    client: {
      viewport: {
        /**
         * Gets the viewport width
         *
         * @return float
         * @scope public
         */
        get_width: () => {
          return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        },

        /**
         * Gets the breakpoint
         *
         * @return string
         * @scope public
         */
        get_breakpoint: () => {
          const viewportWidth = storm_eagle.client.viewport.get_width();

          if (viewportWidth >= breakpoints['xl_min']) return 'xl';
          else if (viewportWidth >= breakpoints['lg_min']) return 'lg';
          else if (viewportWidth >= breakpoints['md_min']) return 'md';
          else if (viewportWidth >= breakpoints['sm_min']) return 'sm';
          else {
            storm_eagle.throw_exception('smaller than sm');
            return;
          }
        },

        /**
         * Gets the viewport height
         *
         * @return float
         * @scope public
         */
        get_height: () => {
          return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        },

        /**
         * Checks if the viewport is a retina display
         *
         * @return boolean
         * @scope public
         */
        is_retina: () => {
          if (window.devicePixelRatio > 1 || (window.matchMedia && window.matchMedia('(-webkit-min-device-pixel-ratio:1.5),(-moz-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5)').matches)) {
            return true;
          } else {
            return false;
          }
        },

        /**
         * Checks if the viewport is within "is_sm_only" threshhold
         * Checks if the viewport is within "is_sm_up" threshhold
         * Checks if the viewport is within "is_md_down" threshhold
         * Checks if the viewport is within "is_md_only" threshhold
         * Checks if the viewport is within "is_md_up" threshhold
         * Checks if the viewport is within "is_lg_down" threshhold
         * Checks if the viewport is within "is_lg_only" threshhold
         * Checks if the viewport is within "is_lg_up" threshhold
         * Checks if the viewport is within "is_xl_up" threshhold
         *
         * @return boolean
         * @scope public
         */
        is_sm_only: () => {
          return storm_eagle.client.viewport.get_width() >= breakpoints['sm_min'] && storm_eagle.client.viewport.get_width() < breakpoints['md_min'] ? true : false;
        },
        is_sm_up: () => {
          return storm_eagle.client.viewport.get_width() >= breakpoints['sm_min'] ? true : false;
        },
        is_md_down: () => {
          return storm_eagle.client.viewport.get_width() >= breakpoints['sm_min'] && storm_eagle.client.viewport.get_width() < breakpoints['lg_min'] ? true : false;
        },
        is_md_only: () => {
          return storm_eagle.client.viewport.get_width() >= breakpoints['md_min'] && storm_eagle.client.viewport.get_width() < breakpoints['lg_min'] ? true : false;
        },
        is_md_up: () => {
          return storm_eagle.client.viewport.get_width() >= breakpoints['md_min'] ? true : false;
        },
        is_lg_down: () => {
          return storm_eagle.client.viewport.get_width() >= breakpoints['sm_min'] && storm_eagle.client.viewport.get_width() < breakpoints['xl_min'] ? true : false;
        },
        is_lg_only: () => {
          return storm_eagle.client.viewport.get_width() >= breakpoints['lg_min'] && storm_eagle.client.viewport.get_width() < breakpoints['xl_min'] ? true : false;
        },
        is_lg_up: () => {
          return storm_eagle.client.viewport.get_width() >= breakpoints['lg_min'] ? true : false;
        },
        is_xl_up: () => {
          return storm_eagle.client.viewport.get_width() >= breakpoints['xl_min'] ? true : false;
        },
      },

      /**
       * get the navigator.userAgent
       * @return string
       * @scope public
       */
      get_user_agent: () => {
        return navigator.userAgent;
      },

      /**
       * Check if device type is Mobile
       * Verify mobile OS
       * @return boolean
       * @scope public
       **/
      is_android: () => {
        return storm_eagle.client.get_user_agent().match(/Android/i) ? true : false;
      },
      is_blackberry: () => {
        return storm_eagle.client.get_user_agent().match(/BlackBerry|BB10/i) ? true : false;
      },
      is_ios: () => {
        return storm_eagle.client.get_user_agent().match(/iPhone|iPad|iPod/i) ? true : false;
      },
      is_opera: () => {
        return storm_eagle.client.get_user_agent().match(/Opera Mini/i) ? true : false;
      },
      is_windows: () => {
        return storm_eagle.client.get_user_agent().match(/IEMobile/i) ? true : false;
      },
      is_any: () => {
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            storm_eagle.client.get_user_agent().substr(0, 4),
          )
          ? true
          : false;
      },
    },

    page: {
      /**
       * Gets a query parameter value from the query string
       *
       * @param string key
       * @return string
       * @scope public
       */
      get_query_value: (key) => {
        key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + key + '=([^&#]*)'),
          results = regex.exec(location.search);
        if (results !== null) {
          return decodeURIComponent(results[1].replace(/\+/g, ' '));
        } else {
          return null;
        }
      },

      /**
       * Gets the hash value of the URL (without the "#" character)
       *
       * @return string
       * @scope public
       */
      get_hash: () => {
        if (window.location.hash) {
          return window.location.hash.substr(1);
        } else {
          return '';
        }
      },

      /**
       * sets the hash value of the URL
       *
       * @param string hash
       * @return void
       * @scope public
       */
      set_hash: (hash) => {
        if (hash.length > 1) {
          window.location.replace(('' + window.location).split('#')[0] + '#' + hash);
        }
      },

      get_language_code: () => {
        return document.getElementsByTagName('html')[0].getAttribute('lang');
      },
    },

    util: {
      replace_all: (original_str, find_str, replace_str, ignore) => {
        return original_str.replace(new RegExp(find_str.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'), ignore ? 'gi' : 'g'), typeof replace_str == 'string' ? replace_str.replace(/\$/g, '$$$$') : replace_str);
      },

      index_in_parent: (node) => {
        let children = node.parentNode.childNodes;
        let num = 0;
        for (let i = 0; i < children.length; i++) {
          if (children[i] == node) return num;
          if (children[i].nodeType == 1) num++;
        }
        return -1;
      },
    },

    /**
     * Opens a new window
     *
     * @param string url
     * @param string name
     * @param integer width
     * @param integer height
     * @return void
     */
    open_window: (url, name, width, height) => {
      name = name === undefined ? '_blank' : name;
      width = width === undefined ? 800 : parseInt(width) + '';
      height = height === undefined ? 600 : parseInt(height) + '';
      window.open(url, '_blank', 'scrollbars=1,resizable=1,width=' + width + ',height=' + height);
    },

    /**
     * Scrolls the browser to an element
     *
     * @param string selector
     * @param integer index
     * @return void
     * @scope public
     */
    scroll_to: (selector) => {
      window.scrollTo({
        behavior: 'auto',
        left: 0,
        top: document.querySelector(selector).offsetTop,
      });
    },

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing.
     * @param  { function } func      callback function
     * @param  { number } wait        time in ms
     * @param  { boolean } immediate  flag to trigger function on the leading edge or trailing
     * @return { function }           debounce function
     */
    debounce: (func, wait, immediate) => {
      let timeout;
      return function () {
        let context = this,
          args = arguments;
        let later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    /**
     * Observes an element and runs a function when the element is resized
     * Replaces window.addEventListener("resize", event = { function(); }) as it performs better
     *
     * @param  { array } elements     elements we want to observe
     * @param  { function } func      callback function
     */
    resize_observer: (elements, func) => {
      let resize_observer = new ResizeObserver((el) => {
        func();
      });
      //@TODO: write cleaner way to iterate through one DOM Element OR NodeList
      elements instanceof HTMLElement
        ? resize_observer.observe(elements)
        : elements.forEach((el) => {
            resize_observer.observe(el);
          });
    },
  };
})();

const LANG = storm_eagle.page.get_language_code();

storm_eagle.module('autopopulate_empty_ids', () => {
  let self;

  return {
    initialize: () => {
      self = storm_eagle['autopopulate_empty_ids'];
      self.fill_empty_ids();
    },
    fill_empty_ids: () => {
      function get_random_id() {
        return '_' + Math.random().toString(36).substr(2, 9);
      }

      document.querySelectorAll('*[id]').forEach((el) => {
        if (el.id === '') {
          el.id = get_random_id();
        }
      });
    },
  };
});

/**
 * Allows console.log() to work in non-production environments and
 * Disable console.log() on production environments (unless a querystring on the page exists)
 */
storm_eagle.module('console_log', () => {
  return {
    initialize: () => {
      if (window.location.hostname.indexOf('localhost') > -1) {
        console.log('console.log() enabled');
      } else {
        if (storm_eagle.page.get_query_value('consolelog') === 'true') {
          console.log('console.log() enabled');
        } else {
          console.log('console.log() disabled');
          console.log = () => {};
        }
      }
    },
  };
});

/**
 * Allows the height of various block level HTML elements to be the same by taking the largest height and applying it to all items.
 * This will occur for any item regardless of viewport. To affect medium size and up, see Options.
 *
 * How to use this:
 * Add the attribute 'data-equalize-height="(key)"' to any block level HTML element where key is a value you use to link the items you want to height equalize. All the items with the same 'key' will have the same height.
 *
 * Options:
 * If you only want height equalizing to occur on medium size up, add 'data-equalize-md-up' to the HTML element as well
 * If you only want height equalizing to occur on small size only, add 'data-equalize-sm-only' to the HTML element as well
 */
storm_eagle.module('equalize_heights', () => {
  let self;
  let _data_equal_height_array = [];

  /*
   * Sorts items in array from smallest to largest
   */
  let sort_number = (a, b) => {
    return a - b;
  };

  /*
   * For each "key", determine the largest height and apply to all items with that key
   */
  let max_height = () => {
    _data_equal_height_array.forEach((index, value) => {
      let _highest = 0;
      let _heights = [];
      document.querySelectorAll(`[data-equalize-height=${index}]`).forEach((el) => {
        /* get the height including the padding of an item */
        el.style.height = 'auto';
        _heights.push(el.getBoundingClientRect().height);
      });
      _heights = _heights.sort(sort_number).reverse();
      _highest = _heights[0];
      document.querySelectorAll(`[data-equalize-height=${index}]`).forEach((el) => {
        el.style.height = _highest + 'px';
      });
    });
  };

  return {
    initialize: () => {
      self = storm_eagle['equalize_heights'];
      self.get_data_equal_height_items();
      self.resize_listener();
    },
    ready: () => {
      self.force_resize();
    },
    /*
     * Checks all the items that need to equalize height, and add keys to array
     */
    get_data_equal_height_items: () => {
      document.querySelectorAll('[data-equalize-height]').forEach((el) => {
        let newItem = el.dataset['equalizeHeight'];
        if (_data_equal_height_array.indexOf(newItem) < 0) {
          _data_equal_height_array.push(newItem);
        }
      });
    },
    /*
     * Re-evaluate the equalizing of the height when the page loads or is resized
     */
    resize_listener: () => {
      function force_resize() {
        return self.force_resize();
      }
      storm_eagle.resize_observer(document.querySelector('body'), force_resize);
    },
    /*
     * Check for any new items to equalize, and then equalize them
     * Do not equalize height for small size if the item contains [data-equalize-md-up] data attribute
     */
    force_resize: () => {
      self.get_data_equal_height_items();
      max_height();
      if (storm_eagle.client.viewport.is_sm_only()) {
        document.querySelectorAll('[data-equalize-height][data-equalize-md-up]').forEach((el) => {
          el.style.height = 'auto';
        });
      }
      if (storm_eagle.client.viewport.is_md_up()) {
        document.querySelectorAll('[data-equalize-height][data-equalize-sm-only]').forEach((el) => {
          el.style.height = 'auto';
        });
      }
    },
  };
});

storm_eagle.module('responsive_dom_manipulator', () => {
  let self;
  let array_of_keys = [];

  return {
    initialize: () => {
      self = storm_eagle['responsive_dom_manipulator'];
      self.resize_listener();
    },
    ready: () => {
      self.force_resize();
    },
    /*
     * Re-evaluate moving the dom when the page loads or is resized
     */
    resize_listener: () => {
      function force_resize() {
        return self.force_resize();
      }
      storm_eagle.resize_observer(document.querySelector('body'), force_resize);
    },
    /*
     * Check for any new items to equalize, and then equalize them
     * Do not equalize height for small size if the item contains [data-equalize-md-up] data attribute
     */
    force_resize: () => {
      array_of_keys = [];
      document.querySelectorAll('[data-move]').forEach((el) => {
        array_of_keys.push(el.dataset['move']);
      });
      //console.log(array_of_keys);
      if (storm_eagle.client.viewport.is_sm_only()) {
        document.querySelectorAll('[data-move-container-sm]').forEach((el) => {
          el.appendChild(document.querySelector(`[data-move=${el.dataset['moveContainer']}]`));
        });
      }
      if (storm_eagle.client.viewport.is_md_only()) {
        document.querySelectorAll('[data-move-container-md]').forEach((el) => {
          el.appendChild(document.querySelector(`[data-move=${el.dataset['moveContainer']}]`));
        });
      }
      if (storm_eagle.client.viewport.is_lg_only()) {
        document.querySelectorAll('[data-move-container-lg]').forEach((el) => {
          el.appendChild(document.querySelector(`[data-move=${el.dataset['moveContainer']}]`));
        });
      }
      if (storm_eagle.client.viewport.is_xl_up()) {
        document.querySelectorAll('[data-move-container-xl]').forEach((el) => {
          el.appendChild(document.querySelector(`[data-move=${el.dataset['moveContainer']}]`));
        });
      }
    },
  };
});
