/* Define global constants and map */
const keyboard = {};
keyboard.keys = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'esc': 27,
  'space': 32,
  'delete': 46,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'end': 35,
  'home': 36,
  'shift': 16
};

const breakpoints = {
  'small_min': 320,
  'small_max': 767,
  'medium_min': 768,
  'medium_max': 1023,
  'large_min': 1024,
  'large_max': 1279,
  'xlarge_min': 1280
};

const focus_trap_selector = `a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), li[role="tab"]:not([disabled]), div[role="tabpanel"]:not([disabled]), label`;
const remove_focus_selector = `.form\\:style\\:1 input[type="radio"]+label, .form\\:style\\:1 input[type="text"]+label, .form\\:style\\:1 input[type="email"]+label, .form\\:style\\:2 label, [data-module="popover"] button, [data-module="popover"] a`;

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
 * storm_eagle.client.viewport.get_width()
 * storm_eagle.client.viewport.get_breakpoint()
 * storm_eagle.client.viewport.get_height()
 * storm_eagle.client.viewport.is_retina()
 * storm_eagle.client.viewport.is_xlarge()
 * storm_eagle.client.viewport.is_large()
 * storm_eagle.client.viewport.is_medium()
 * storm_eagle.client.viewport.is_small()
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
 * storm_eagle.open_window()
 * storm_eagle.scroll_to()
 * storm_eagle.debounce()
 **/

const storm_eagle = (function(window, document, undefined) {
  'use strict';

  return {

    /**
     * Add module and module name_space to the storm_eagle object
     *
     * @param string name_space
     * @param object module_object
     * @return mixed
     * @scope public
     */
    module : function(name_space, module_object) {
      if(storm_eagle[name_space] === undefined) {
        storm_eagle[name_space] = module_object();
        if(storm_eagle[name_space] !== undefined) {
          if(typeof storm_eagle[name_space].initialize === 'function') {
            storm_eagle[name_space].initialize();
          }
          if(typeof storm_eagle[name_space].ready === 'function') {
            storm_eagle.document_ready(function() {
              storm_eagle[name_space].ready();
            });
          }
          return storm_eagle[name_space];
        }
      } else {
        console.warn(`Cannot create module. The module: '${name_space}' already exists`);
      }
    },

    destroy_module: function(name_space) {
      storm_eagle[name_space] = undefined;
    },

    /**
     * Throws an exception
     *
     * @param string message
     * @return void
     * @scope public
     */
    throw_exception : function(message) {
      if(message !== undefined) {
        throw message;
        console.log(message);
      } else {
        throw true;
      }
      console.trace();
    },

    document_ready : function(fn) {
      /* see if DOM is already available */
      if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1); /* call on next available tick */
      } else {
        document.addEventListener("DOMContentLoaded", fn);
      }
    },

    cookie : {
     /**
       * Gets a cookie value
       *
       * @param string name
       * @return string
       * @scope public
       */
      get : function(name) {
        let start = document.cookie.indexOf(name + '=');
        if(start == -1) {
          return null;
        } else {
          start = start + name.length + 1;
          let end = document.cookie.indexOf(';', start);
          if(end == -1) {
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
      set : function(name, value, expires) {
        let milliseconds = (expires === undefined ? 0 : parseInt(expires) * 1000 * 60 * 60 * 24);
        let greenwichMeanTime = new Date(new Date().getTime() + milliseconds).toGMTString();
        document.cookie = name + '=' + escape(value) + ((expires > 0) ? ';expires=' + greenwichMeanTime : '') + '; path=/';
      },

      /**
       * Unsets a cookie
       *
       * @param string name
       * @return void
       * @scope public
       */
      unset : function(name) {
        let value = storm_eagle.cookie.get(name);
        if(value !== null) {
          document.cookie = name + '=;expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';
        }
      }
    },

    validation : {
     /**
       * Checks if a value is of type Number
       *
       * @param mixed value
       * @return boolean
       * @scope public
       */
      is_number : function(value) {
        switch(typeof value) {
          case 'number' :
            return true;
            break;
          case 'object' :
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
      is_string : function(value) {
        switch(typeof value) {
          case 'string' :
            return true;
            break;
          case 'object' :
            return value instanceof String;
            break;
          default:
            return false;
        }
      },
    },

    format : {
     /**
       * Formats a number
       *
       * @param mixed number
       * @param integer factor
       * @return string
       * @scope public
       */
      number : function(number, factor) {
        let decimal_symbol;
        let thousands_symbol;
        let sign;
        let i;
        let j;
        let n;

        if(storm_eagle.validation.is_number(number)) {
          number = number.toString();
        }
        factor = isNaN(factor = Math.abs(factor)) ? 0 : factor;
        switch(LANG) {
          case 'fr':
            decimal_symbol = ',';
            thousands_symbol = ' ';
            break;
          default:
            decimal_symbol = '.';
            thousands_symbol = ',';
            break;
        }
        number = Number(number.replace(RegExp('[^0-9\\.]', 'g'), '')),
          sign = (number < 0 ? '-' : ''),
          i = parseInt(number = Math.abs(+number || 0).toFixed(factor)) + '',
          j = (j = i.length) > 3 ? j % 3 : 0,
          n = sign + (j ? i.substr(0, j) + thousands_symbol : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands_symbol) + (factor ? decimal_symbol + Math.abs(number - i).toFixed(factor).slice(2) : '');
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
      currency : function(number, factor) {
        factor = isNaN(factor = Math.abs(factor)) ? 2 : factor;
        number = storm_eagle.format.number(number, factor);
        switch(LANG) {
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
      percentage : function(number, factor) {
        factor = isNaN(factor = Math.abs(factor)) ? 3 : factor;
        number = storm_eagle.format.number(number, factor);
        switch(LANG) {
          case 'fr':
            return number + ' %';
          default:
            return number + '%';
        }
      },
    },

    reverse_format : {
      /**
       * Gets a formatted number as a number
       *
       * @param mixed number
       * @return float
       * @scope public
       */
      get_numeric_value : function(number) {
        switch(LANG) {
          case 'fr':
            number = number.replace(',', '.');
            break;
        }
        number = Number(number.replace(/[^0-9.]/gi, '').replace('.', ' ').replace(/\./g, '').replace(' ', '.'));
        if(isNaN(number)) {
          number = 0;
        }
        return number;
      },
    },

    client : {

      viewport : {
        /**
         * Gets the viewport width
         *
         * @return float
         * @scope public
         */
        get_width : function() {
          return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        },

        /**
         * Gets the breakpoint
         *
         * @return string
         * @scope public
         */
        get_breakpoint : function() {
          const viewportWidth = storm_eagle.client.viewport.get_width();

          if (viewportWidth >= breakpoints["xlarge_min"])
            return 'xl'
          else if (viewportWidth >= breakpoints["large_min"])
            return 'lg'
          else if (viewportWidth >= breakpoints["medium_min"])
            return 'md'
          else if (viewportWidth >= breakpoints["small_min"])
            return 'sm'
          else {
            storm_eagle.throw_exception("smaller than sm");
            return
          }
        },

        /**
         * Gets the viewport height
         *
         * @return float
         * @scope public
         */
        get_height : function() {
          return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        },

        /**
         * Checks if the viewport is a retina display
         *
         * @return boolean
         * @scope public
         */
        is_retina : function() {
          if(
            window.devicePixelRatio > 1 ||
            (window.matchMedia && window.matchMedia('(-webkit-min-device-pixel-ratio:1.5),(-moz-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5)').matches)
          ) {
            return true;
          } else {
            return false;
          }
        },

        /**
         * Checks if the viewport is within the "xlarge" threshhold
         *
         * @return boolean
         * @scope public
         */
        is_xlarge : function() {
          return (storm_eagle.client.viewport.get_width() >= breakpoints["xlarge_min"]) ? true : false;
        },

        /**
         * Checks if the viewport is within the "xlarge" threshhold
         *
         * @return boolean
         * @scope public
         */
        is_large : function() {
          return (storm_eagle.client.viewport.get_width() >= breakpoints["large_min"] && storm_eagle.client.viewport.get_width() <= breakpoints["large_max"]) ? true : false;
        },

        /**
         * Checks if the viewport is within the "medium" threshhold
         *
         * @return boolean
         * @scope public
         */
        is_medium : function() {
          return (storm_eagle.client.viewport.get_width() >= breakpoints["medium_min"] && storm_eagle.client.viewport.get_width() <= breakpoints["medium_max"]) ? true : false;
        },

        /**
         * Checks if the viewport is within the "small" threshhold
         *
         * @return boolean
         * @scope public
         */
        is_small : function() {
          return (storm_eagle.client.viewport.get_width() >= breakpoints["small_min"] && storm_eagle.client.viewport.get_width() <= breakpoints["small_max"]) ? true : false;
        },

      },


      /**
       * get the navigator.userAgent
       * @return string
       * @scope public
       */
      get_user_agent :  function(){
        return(navigator.userAgent);
      },

      /**
        * Check if device type is Mobile
        * Verify mobile OS
        * @return boolean
        * @scope public
        **/
      is_android: function() {
        return storm_eagle.client.get_user_agent().match(/Android/i) ? true : false;
      },
      is_blackberry: function() {
        return storm_eagle.client.get_user_agent().match(/BlackBerry|BB10/i) ? true : false;
      },
      is_ios: function() {
        return storm_eagle.client.get_user_agent().match(/iPhone|iPad|iPod/i) ? true : false;
      },
      is_opera: function() {
        return storm_eagle.client.get_user_agent().match(/Opera Mini/i) ? true : false;
      },
      is_windows: function() {
        return storm_eagle.client.get_user_agent().match(/IEMobile/i) ? true : false;
      },
      is_any: function() {
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(storm_eagle.client.get_user_agent().substr(0,4)) ? true : false;
      }
    },

    page : {
     /**
       * Gets a query parameter value from the query string
       *
       * @param string key
       * @return string
       * @scope public
       */
      get_query_value : function(key) {
        key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + key + '=([^&#]*)'),
            results = regex.exec(location.search);
        if(results !== null) {
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
      get_hash : function() {
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
      set_hash : function(hash) {
        if (hash.length > 1) {
          window.location.replace(('' + window.location).split('#')[0] + '#' + hash);
        }
      },

      get_language_code : function() {
        return document.getElementsByTagName('html')[0].getAttribute('lang');
      }
    },


    util : {
      replace_all : function(original_str,find_str,replace_str, ignore) {
        return original_str.replace(new RegExp(find_str.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(replace_str)=="string")?replace_str.replace(/\$/g,"$$$$"):replace_str);
      }
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
    open_window : function(url, name, width, height)
    {
      name = (name === undefined ? '_blank' : name);
      width = (width === undefined ? 800 : parseInt(width) + "");
      height = (height === undefined ? 600 : parseInt(height) + "");
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
    scroll_to : function(selector) {
      window.scrollTo({
        'behavior': 'auto',
        'left': 0,
        'top': document.querySelector(selector).offsetTop
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
    debounce : function(func, wait, immediate){
      let timeout;
      return function() {
        let context = this, args = arguments;
        let later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }
  };
})(window, document);

const LANG = storm_eagle.page.get_language_code();

storm_eagle.module('ie11_polyfill', function () {
  return {
    initialize: function () {
      if (window.document.documentMode) {

        // missing forEach on NodeList for IE11
        if ('NodeList' in window && !NodeList.prototype.forEach) {
          console.info('polyfill for IE11');
          NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
              callback.call(thisArg, this[i], i, this);
            }
          };
        }

        // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
        if (!Array.prototype.findIndex) {
          Object.defineProperty(Array.prototype, 'findIndex', {
            value: function(predicate) {
             // 1. Let O be ? ToObject(this value).
              if (this == null) {
                throw new TypeError('"this" is null or not defined');
              }

              var o = Object(this);

              // 2. Let len be ? ToLength(? Get(O, "length")).
              var len = o.length >>> 0;

              // 3. If IsCallable(predicate) is false, throw a TypeError exception.
              if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
              }

              // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
              var thisArg = arguments[1];

              // 5. Let k be 0.
              var k = 0;

              // 6. Repeat, while k < len
              while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return k.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                  return k;
                }
                // e. Increase k by 1.
                k++;
              }

              // 7. Return -1.
              return -1;
            }
          });
        }

        /* polyfill for DOMELEMENT.remove() */
        if (!('remove' in Element.prototype)) {
            Element.prototype.remove = function() {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            };
        }
      }

    }
  };
});

/**
 * Allows console.log() to work in non-production environments and
 * Disable console.log() on production environments (unless a querystring on the page exists)
 */
storm_eagle.module('console_log', function () {
  'use strict';

  return {
    initialize: function () {
      if (window.location.hostname.indexOf("poc") > -1 || window.location.hostname.indexOf("localhost") > -1) {
        console.log('console.log() enabled');
      } else {
        if (storm_eagle.page.get_query_value("consolelog") === "true") {
          console.log('console.log() enabled');
        } else {
          console.log('console.log() disabled');
          console.log = function() {}
        }
      }
    }
  }
});

/**
 * Allows the height of various divs to be the same by taking the biggest height and applying it to all items.
 * This will occur for any item regardless of viewport. To affect medium size and up, see Options.
 *
 * How to use this:
 * Add 'data-equalize-height="(key)"' to any item where key is a value you input yourself, to link the items.
 * All the items with the same 'key' will have the same height
 *
 * Options:
 * If you only want this to occur on medium size up, add 'data-equalize-md-up' to the item as well
 */
storm_eagle.module('equalize_heights', function () {
  'use strict';

  let _data_equal_height_array = [];

  /*
   * Sorts items in array from smallest to largest
   */
  let sortNumber = function (a, b) {
    return a - b;
  };

  /*
   * For each "key", determine the largest height and apply to all items with that key
   */
  let max_Height = function () {
    _data_equal_height_array.forEach((index, value) => {
      let _highest = 0;
      let _heights = [];
      document.querySelectorAll(`[data-equalize-height=${index}]`).forEach((el) => {
        /* get the height including the padding of an item */
        el.style.height = "auto";
        _heights.push(el.getBoundingClientRect().height);
      });
      _heights = _heights.sort(sortNumber).reverse();
      _highest = _heights[0];
      document.querySelectorAll(`[data-equalize-height=${index}]`).forEach((el) => {
        el.style.height = _highest + 'px';
      });
    });
  };

  return {
    initialize: function () {
      const self = this;
      self.get_data_equal_height_items();
      self.resize_listener();
    },
    /*
    * Checks all the items that need to equalize height, and add keys to array
    */
    get_data_equal_height_items: function () {
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
    resize_listener: function () {
      const self = this;
      window.addEventListener("resize", (event) => {
        self.force_resize();
      })
      window.addEventListener('DOMContentLoaded', (event) => {
        self.force_resize();
      });
    },
    /*
    * Check for any new items to equalize, and then equalize them
    * Do not equalize height for small size if the item contains [data-equalize-md-up] data attribute
    */
    force_resize: function () {
      const self = this;
      self.get_data_equal_height_items();
      max_Height();
      if (storm_eagle.client.viewport.is_small()) {
        document.querySelectorAll('[data-equalize-height][data-equalize-md-up]').forEach((el) => {
          el.style.height = "auto";
        });
      }
      if (!storm_eagle.client.viewport.is_small()) {
        document.querySelectorAll('[data-equalize-height][data-equalize-sm-only]').forEach((el) => {
          el.style.height = "auto";
        });
      }
    }
  };
});

/**
 * Disables the telephone number link from calling in medium and up
 */
storm_eagle.module('disable_tel_medium_up', function () {
  return {
    initialize: function () {
      document.querySelectorAll('a[href^="tel"]').forEach((el) => {
        el.addEventListener("click", function(event) {
          if (!storm_eagle.client.viewport.is_small()) {
            event.preventDefault();
          }
        });
      });
    }
  };
});

storm_eagle.module('form_validation', function () {
  "use strict";

  return {
    //validate(): highlights/hides the border of the input that has an issue + adds/hides the error message; this function is customizable
    //@param {string} element_name is the name of the DOM object being tested - used here for 'error-message'
    //@param {string} type is the character set to be validated again (e.g. alpha_numeric, numeric, email, postalCode, dropDown, checkBox, radioButton)
    validate: function (element_name, type) {
      const self = this;
      if (self.check_field(element_name, type)) {
        document.querySelector(`[name='${element_name}']`).parentElement.querySelector('label').classList.add("error-field");

        if (type === "radiobutton") {
          document.getElementById(element_name).classList.add("has-error");
        } else {
          document.querySelector(`[name='${element_name}']`).parentElement.querySelector("span.error-message").classList.add("has-error");
        }

        errormessage += element_name + " ";
      } else {
        document.querySelector(`[name='${element_name}']`).parentElement.querySelector('label').classList.remove("error-field");

        if (type === "radiobutton") {
          document.getElementById(element_name).classList.remove("has-error");
        } else {
          document.querySelector(`[name='${element_name}']`).parentElement.querySelector("span.error-message").classList.remove("has-error");
        }
      }
    },
    //check_field(): form validation based on input type
    //@param {string} element_name is the name of the form element being checked
    //@param {string} type is the character set to test (e.g. alphaNumeric, numeric, email, postalCode)
    //@returns true to show an error
    //@returns false to hide an error
    check_field:function(element_name,type) {
      let itemSelected = false;
      let el;
      if (type == "radiobutton" || type == "checkbox") {
        el = document.querySelectorAll(`[name='${element_name}']`); //returns array, el gets first el
      } else {
        el = document.querySelector(`[name='${element_name}']`); //returns array, el gets first el
      }
      let value = el.value;

      if (type == "radiobutton" || type == "checkbox") {
        for (let i = 0; i < el.length; i++) {
          if (el[i].checked) {
            itemSelected = true;
          }
        }
        if (!itemSelected) {
          for (let i = 0; i < el.length; i++) {
            return true;
          }
        } else {
          return false;
        }
      } else if (type == "dropdown") {
        if (el) {
          return (value === "")
        }
      } else { //input boxes, email, postcalcode
        if (el) {
          if (value === "" || !(this.is_value_valid(type,value)))
            return true;
          else
            return false;
        }
      }
    },
    //is_value_valid(): returns true if value successfully tested again regex
    //@param {string} type is the character set to test (e.g. alphaNumeric, numeric, email, postalCode)
    //@param {string} value is the value being tested
    is_value_valid:function(type,value) {
      var regex;
      switch (type) {
        case "alpha_numeric": // alphaNumeric + french characters
          regex = /^[A-Za-z\u00E0-\u00FC0-9 ]/;
          break;
        case "numeric": // numbers
          regex = /^\d+$/;
          break;
        case "phone": //phone
          regex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
          break;
        case "email": //email
          regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          break;
        case "postal_code": //postal code
          regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
          break;
        case "zip_code": //zip code
          regex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
          break;
        default:
          return true;
          break;
      }
      return regex.test(value);
    }
  }
});

/**
 * Enables floating labels
 */
storm_eagle.module('form_style_1_floating_labels', function () {
  "use strict";

  function setActiveLabel() {
    this.nextElementSibling.classList[(this.value.length ? 'add' : 'remove')]('active-label');
  }

  return {
    initialize: function () {
      document.querySelectorAll('.form\\:style\\:1 input, .form\\:style\\:1 select, .form\\:style\\:1 textarea').forEach((el) => {
        if (el.type !== 'radio') {
            setActiveLabel.call(el);
            el.addEventListener('change', setActiveLabel);
        }
      });
    }

  };
});

storm_eagle.module("accordion", function () {
  "use strict";
  let accordion_state = [];

  return {
    initialize : function(){
      const self = this;
      document.querySelectorAll("[data-module='accordion']").forEach(function(el){
        var accordion_id = el.getAttribute("id");
        accordion_state[accordion_id] = {
          "focusable_elements": []
        };
       self.get_accordion_focusable_elements(accordion_id);
      });
    },
    open: function(accordion_id) {
      const self = this;
      /* updates accordion visuals */
      document.getElementById(accordion_id).classList.add('active');
      document.getElementById(accordion_id).classList.toggle('display:none');
      /* removes focus from elements except in accordion */
      accordion_state[accordion_id]["focusable_elements"].forEach(function (el) {
        el.setAttribute("tabindex","0");
      });
    },
    close: function(accordion_id) {
      const self = this;
      /* updates accordion visuals */
      document.getElementById(accordion_id).setAttribute('tabIndex', '-1');
      document.getElementById(accordion_id).setAttribute('aria-expanded', false);
      document.getElementById(accordion_id).classList.remove('active');
      document.getElementById(accordion_id).classList.toggle('display:none');
      document.querySelectorAll("[data-target='accordion']").forEach(function(accordion,index) {
        /* remove focus from accordion elements */
        accordion_state[accordion_id]["focusable_elements"].forEach(function (el) {
          el.setAttribute("tabindex","-1");
        });
      });
      document.querySelectorAll("[data-target='accordion-trigger']").forEach(function(accordion_trigger,index) {
        accordion_trigger.setAttribute("aria-expanded",false);
      });
    },
    get_accordion_focusable_elements: function(accordion_id) {
      const self = this;
      const accordion = document.getElementById(accordion_id);
      accordion_state[accordion_id]["focusable_elements"] = accordion.querySelectorAll(focus_trap_selector);
    },
    toggle: function (accordion_trigger, accordion_id) {
      const self = this;
      accordion_trigger.querySelector(".accordion\\:show-more-button").classList.toggle("display:none");
      accordion_trigger.querySelector(".accordion\\:show-less-button").classList.toggle("display:none");

      if (document.getElementById(accordion_id).classList.contains("active")) {
        /* if the accordion is open */
        accordion_trigger.setAttribute("aria-expanded", false);
        accordion_trigger.classList.remove("active");
        self.close(accordion_id);
      } else {
        /* if the accordion is closed */
        accordion_trigger.setAttribute("aria-expanded", true);
        accordion_trigger.classList.add("active");
        self.open(accordion_id);
      }
    }
  }
});

/* data-module: poopver         the modal
 data-module: poopver-overlay the full screen part behind the modal
 data-module: poopver-trigger the button that opens the modal */
storm_eagle.module('popover', function () {
  'use strict';

  let focus_placeholder;
  let popover_first_tab_stop;
  let popover_last_tab_stop;
  let popover_state = {};

  function keyboard_popover_focus_trap(event) {
    if (event.keyCode === keyboard.keys.tab) {
      if (event.shiftKey) {
        if (document.activeElement === popover_first_tab_stop) {
          event.preventDefault();
          popover_last_tab_stop.focus();
        }
      } else {
        if (document.activeElement === popover_last_tab_stop) {
          event.preventDefault();
          popover_first_tab_stop.focus();
        }
      }
    }
    if (event.keyCode === keyboard.keys.esc || (event.keyCode === keyboard.keys.enter && document.activeElement.hasAttribute("[data-module='popover.close']"))) {
      storm_eagle.popover.close();
    }
  }

  return {
    initialize: function () {
      const self = this;
      document.querySelectorAll("[data-module='popover']").forEach(function(el,index){
        let popover_id = el.getAttribute("id");
        popover_state[popover_id] = {
          "focusable_elements": []
        }
        self.get_popover_focusable_elements(popover_id);
      });
      self.add_popover_resize_listener();
      self.add_popover_overlay_close_listener();
    },
    open: function(popover_trigger,popover_id) {
      const self = this;

      /* updates popover visuals */
      document.querySelector("[data-module='popover.overlay']").classList.add('active');
      popover_trigger.classList.add('active');
      document.getElementById(popover_id).classList.add('active');
      self.set_popover_location(popover_id);

      /* removes focus from elements except in popover */
      popover_state[popover_id]["focusable_elements"].forEach(function (el) {
        el.setAttribute("tabindex","0");
      });

      /* saves item that opened popover for later */
      focus_placeholder = document.activeElement;
      popover_first_tab_stop = popover_state[popover_id]["focusable_elements"][0];
      popover_last_tab_stop = popover_state[popover_id]["focusable_elements"][popover_state[popover_id]["focusable_elements"].length - 1];

      /* set focus to popover (but not the popover_first_tab_stop */
      popover_first_tab_stop.focus();

      /* add keyboard event listener */
      document.getElementById(popover_id).addEventListener('keydown', keyboard_popover_focus_trap);
    },
    close: function() {
      const self = this;

      /* updates popover visuals */
      document.querySelector("[data-module='popover.overlay'].active").classList.remove('active');
      document.querySelector("[data-module='popover'].active").setAttribute('tabIndex', '-1');
      document.querySelector("[data-module='popover'].active").setAttribute('aria-expanded', false);
      document.querySelector("[data-module='popover'].active").classList.remove('active');
      document.querySelector("[data-module='popover.trigger'].active").classList.remove('active');
      document.querySelectorAll("[data-target='popover']").forEach(function(popover,index) {
        let popover_id =  popover.getAttribute("id");

        /* remove focus from popover elements */
        popover_state[popover_id]["focusable_elements"].forEach(function (el) {
          el.setAttribute("tabindex","-1");
        });

        /* remove keyboard event listener */
        document.getElementById(popover_id).removeEventListener('keydown', keyboard_popover_focus_trap);
      });
      document.querySelectorAll("[data-module='popover.trigger']").forEach(function(popover_trigger) {
        popover_trigger.setAttribute("aria-expanded",false);
      });

      /* set focus to focus_placeholder */
      focus_placeholder.focus();
    },
    get_popover_focusable_elements: function(popover_id) {
      const self = this;
      popover_state[popover_id]["focusable_elements"] = document.getElementById(popover_id).querySelectorAll(focus_trap_selector);
      console.log(popover_state[popover_id]["focusable_elements"]);
    },
    add_popover_overlay_close_listener: function() {
      const self = this;
      if (document.querySelector("[data-module='popover.overlay']")) {
        document.querySelector("[data-module='popover.overlay']").addEventListener('click', function() {
          self.close();
        });
      }
    },
    add_popover_resize_listener: function() {
      const self = this;
      window.addEventListener("resize", function (event) {
        if (document.querySelector("[data-module='popover'].active")){
          self.set_popover_location(document.querySelector("[data-module='popover'].active").getAttribute("id"));
        }
      });
    },
    set_popover_location: function(popover_id) {
      let popover_trigger = document.querySelector("[data-module='popover.trigger'].active");
      let popover = document.getElementById(popover_id);

      if (storm_eagle.client.viewport.is_small() || storm_eagle.client.viewport.is_medium()) {
        popover.style.top = "initial";
        popover.style.left = "0px";
      } else if (storm_eagle.client.viewport.is_large() || storm_eagle.client.viewport.is_xlarge()) {
        popover.style.top = popover_trigger.offsetTop + "px";
        popover.style.left = popover_trigger.offsetLeft + 40 + "px";
      }
    }
  };
});

storm_eagle.module('modal', function () {
  'use strict';

  let focus_placeholder;
  let modal_first_tab_stop;
  let modal_last_tab_stop;
  let modal_state = {};

  function modal_close(event) {
    //console.log(event.target.classList);
    if (event.target.classList.contains("modal-container") || event.target.classList.contains("modal-overlay")) {
      storm_eagle.modal.close();
    }
  }

  function keyboard_modal_focus_trap(event) {
    if (event.keyCode === keyboard.keys.tab) {
      if (event.shiftKey) {
        if (document.activeElement === modal_first_tab_stop) {
          event.preventDefault();
          modal_last_tab_stop.focus();
        }
      } else {
        if (document.activeElement === modal_last_tab_stop) {
          event.preventDefault();
          modal_first_tab_stop.focus();
        }
      }
    }
    if (event.keyCode === keyboard.keys.esc || (event.keyCode === keyboard.keys.enter && document.activeElement.hasAttribute("[data-trigger='modal-close']"))) {
      storm_eagle.modal.close();
    }
  }

  return {
    initialize: function () {
      const self = this;
      document.querySelectorAll("[data-module='modal']").forEach(function (el) {
        let modal_id = el.getAttribute("id");
        modal_state[modal_id] = {
          "focusable_elements": [],
          "remove_focusable_elements": []
        };
        self.get_modal_focusable_elements(modal_id);
      });
    },
    open: function(modal_trigger, modal_id) {
      const self = this;
      document.addEventListener('mousedown', modal_close);

      /* updates modal visuals */
      document.querySelector("body").classList.add("overflow:hidden");
      if (modal_trigger) {
        modal_trigger.classList.add('active');
      }
      document.getElementById(modal_id).classList.add('active');
      document.getElementById(modal_id).querySelector(".modal-container").classList.add('active');

      /* removes focus from elements except in modal */
      modal_state[modal_id]["focusable_elements"].forEach(function (el) {
        el.setAttribute("tabindex", "0");
      });
      modal_state[modal_id]["remove_focusable_elements"].forEach(function (el) {
        el.setAttribute("tabindex", "-1");
      });

      /* remove focusable elements from nodelist, e.g. popover inside modal */
      modal_state[modal_id]["focusable_elements"] = [...modal_state[modal_id]["focusable_elements"]].filter( function( el ) {
        return ![...modal_state[modal_id]["remove_focusable_elements"]].includes(el);
      });

      /* saves item that opened modal for later */
      focus_placeholder = document.activeElement;
      modal_first_tab_stop = modal_state[modal_id]["focusable_elements"][0];
      modal_last_tab_stop = modal_state[modal_id]["focusable_elements"][modal_state[modal_id]["focusable_elements"].length - 1];

      /* set focus to modal (but not the modal_first_tab_stop */
      setTimeout(function () {
        if (modal_first_tab_stop) {
          modal_first_tab_stop.focus();
        }
      }, 100);

      /* add keyboard event listener */
      document.getElementById(modal_id).addEventListener('keydown', keyboard_modal_focus_trap);
    },
    close: function() {
      const self = this;
      document.removeEventListener('mousedown', modal_close);
      document.querySelector("body").classList.remove("overflow:hidden");

      /* updates modal visuals */
      document.querySelector("[data-module='modal'].active").setAttribute('tabIndex', '-1');
      document.querySelector("[data-module='modal'].active").setAttribute('aria-expanded', false);
      if (document.querySelector("[data-module='modal.trigger'].active")) {
        document.querySelector("[data-module='modal.trigger'].active").classList.remove('active');
      }
      document.querySelector("[data-module='modal'].active").querySelector(".modal-container").classList.remove('active');
      document.querySelector("[data-module='modal'].active").classList.remove('active');
      document.querySelectorAll("[data-module='modal']").forEach(function (modal, index) {
        let modal_id = modal.getAttribute("id");

        /* remove focus from modal elements */
        modal_state[modal_id]["focusable_elements"].forEach(function (el) {
          el.setAttribute("tabindex", "-1");
        });

        /* remove keyboard event listener */
        document.getElementById(modal_id).removeEventListener('keydown', keyboard_modal_focus_trap);
      });
      document.querySelectorAll("[data-module='modal.trigger']").forEach(function (modal_trigger) {
        modal_trigger.setAttribute("aria-expanded", false);
      });

      /* set focus to focus_placeholder */
      focus_placeholder.focus();
    },
    get_modal_focusable_elements: function get_modal_focusable_elements(modal_id) {
      const self = this;
      modal_state[modal_id]["focusable_elements"] = document.getElementById(modal_id).querySelectorAll(focus_trap_selector);
      console.log(modal_state[modal_id]["focusable_elements"]);
      modal_state[modal_id]["remove_focusable_elements"] = document.getElementById(modal_id).querySelectorAll(remove_focus_selector);
      console.log(modal_state[modal_id]["remove_focusable_elements"]);
    }
  };
});