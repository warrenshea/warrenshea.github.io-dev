storm_eagle.module('form_validation', () => {
  "use strict";
  let self;

  return {
    initialize: () => {
      self = storm_eagle["form_validation"];
    },
    //validate(): highlights/hides the border of the input that has an issue + adds/hides the error message; this function is customizable
    //@param {string} element_name is the name of the DOM object being tested - used here for 'error-message'
    //@param {string} type is the character set to be validated again (e.g. alpha_numeric, numeric, email, postalCode, dropDown, checkBox, radioButton)
    validate: (element_name, type) => {
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
    check_field: (element_name,type) => {
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
    is_value_valid: (type,value) => {
      let regex;
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
storm_eagle.module('form_theme_b33mOe', () => {
  "use strict";
  let self;

  return {
    initialize: () => {
      self = storm_eagle["form_theme_b33mOe"];
      self.input_listener();
      self.textarea_autoexpand_listener();
    },
    ready: () => {
      document.querySelectorAll('.form\\:theme\\:b33mOe input, .form\\:theme\\:b33mOe select, .form\\:theme\\:b33mOe textarea').forEach( element => {
        if (element.type !== 'radio') {
          self.force_set_active_label(element);
        }
      });
      document.querySelectorAll(".form\\:theme\\:b33mOe textarea").forEach( element => {
        self.force_textarea_autoexpand(element);
      });
    },
    force_set_active_label: (element) => {
      element.nextElementSibling.classList[(element.value.length ? 'add' : 'remove')]('active-label');
    },
    input_listener: () => {
      document.querySelectorAll('.form\\:theme\\:b33mOe input, .form\\:theme\\:b33mOe select, .form\\:theme\\:b33mOe textarea').forEach( element => {
        if (element.type !== 'radio') {
          element.addEventListener('change', () => {
            self.force_set_active_label(element);
          });
        }
      });
    },
    force_textarea_autoexpand: (element) => {
      element.style.height = 'inherit';
      element.style.height = element.scrollHeight + 'px';
    },
    textarea_autoexpand_listener: () => {
      document.querySelectorAll(".form\\:theme\\:b33mOe textarea").forEach( element => {
        element.addEventListener('input', () => {
          self.force_textarea_autoexpand(element);
        });
      });
    }
  };
});