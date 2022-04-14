storm_eagle.module("example_form", () => {
  'use strict';
  let self;

  return {
    validate_form: () => {
      self = storm_eagle["example_form"];

      if (
        storm_eagle.form_validation.validate("name-mandatory", ["not_empty","alpha_numeric"]) &&
        (true)


      ) {
      //storm_eagle.form_validation.validate("name2", "alpha_numeric");
      // storm_eagle.form_validation.validate("province_contact_us", "dropdown");
      // storm_eagle.form_validation.validate("household_investible_assets_contact_us", "dropdown");
      // storm_eagle.form_validation.validate("current_invest_contact_us", "dropdown");
      // storm_eagle.form_validation.validate("what_to_discuss_contact_us", "dropdown");
      // if (document.querySelector("input[type='radio'][name='contact_preference_contact_us']:checked").value === "phone") {
      //   storm_eagle.form_validation.validate("phone_number_contact_us", "alpha_numeric");
      //   storm_eagle.form_validation.validate("best_time_contact_contact_us", "dropdown");
      // } else if (document.querySelector("input[type='radio'][name='contact_preference_contact_us']:checked").value === "email") {
      //   storm_eagle.form_validation.validate("email_contact_us", "email");
      // }
        return true;
      } else {
        return false;
      }

    }
  }
});