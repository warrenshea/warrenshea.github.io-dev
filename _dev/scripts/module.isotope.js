'use strict';
storm_eagle.module('isotope', () => {
  return {
    combine_obj_value: (obj) => {
      // Get an array of property values
      const values = Object.values(obj);

      // Use reduce to iterate through the arrays and combine values
      const combined_values = values.reduce((acc, current_value) => {
        // Ensure that the current value is an array
        if (Array.isArray(current_value)) {
          // Combine each element of the current array with existing elements in acc
          return acc.flatMap((existing_value) =>
            current_value.map((current_element) => `${existing_value}${current_element}`)
          );
        }

        // If the current value is not an array, just concatenate it with existing elements in acc
        return acc.map((existing_value) => `${existing_value}${current_value}`);
      }, ['']); // Initialize with an array containing an empty string

      // Join the combined values with a comma and return
      return combined_values.join(",");
    },
  };
});
