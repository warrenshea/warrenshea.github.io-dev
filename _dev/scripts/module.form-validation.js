storm_eagle.module('form_validation', function () {
  "use strict";

  return {
    //validate(): highlights/hides the border of the input that has an issue + adds/hides the error message; this function is customizable
    //@param {string} element_name is the name of the DOM object being tested - used here for 'error-message'
    //@param {array} validation_rules is the character set to be validated again (e.g. alpha_numeric, numeric, email, postal_code, dropDown, checkBox, radioButton)
    validate: function (element_name, validation_rules) {
      const self = this;
      let status = self.check_field(element_name, validation_rules);
      self.display_error(element_name, validation_rules, status);
      return status;
    },
    display_error:function(element_name,validation_rules,bool_show) {


      if (bool_show) {
        document.querySelector(`[name='${element_name}']`).parentElement.querySelector('label').classList.add("error-field");

        if (type === "radiobutton" || type === "checkbox") {
          document.getElementById(element_name).classList.add("has-error");
        } else {
          document.querySelector(`[name='${element_name}']`).parentElement.querySelector("span.error-message").classList.add("has-error");
        }
      } else {
        document.querySelector(`[name='${element_name}']`).parentElement.querySelector('label').classList.remove("error-field");

        if (type === "radiobutton" || type === "checkbox") {
          document.getElementById(element_name).classList.remove("has-error");
        } else {
          document.querySelector(`[name='${element_name}']`).parentElement.querySelector("span.error-message").classList.remove("has-error");
        }
      }
    },
    //check_field(): form validation based on input type
    //@param {string} element_name is the name of the form element being checked
    //@param {string} type is the character set to test (e.g. alpha_numeric, numeric, email, postal_code)
    //@returns true to show an error
    //@returns false to hide an error
    check_field:function(element_name,type) {
      const self = this;
      let item_selected = false;
      let el;
      if (type == "radiobutton" || type == "checkbox") {
        el = document.querySelectorAll(`[name='${element_name}']`); //returns array, el gets first el
      } else {
        el = document.querySelector(`[name='${element_name}']`);
      }
      let value = el.value;

      if (type == "radiobutton" || type == "checkbox") {
        for (let i = 0; i < el.length; i++) {
          if (el[i].checked) {
            item_selected = true;
          }
        }
        if (!item_selected) {
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
      } else { //input boxes, email, postal_code
        if (el) {
          if (value === "" || !(self.is_value_valid(type,value)))
            return true;
          else
            return false;
        }
      }
    },
    //is_value_valid(): returns true if value successfully tested again regex
    //@param {string} type is the character set to test (e.g. alphaNumeric, numeric, email, postal_code)
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