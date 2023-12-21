'use strict';
storm_eagle.module('color_picker', () => {
  const base_colors = ['#3169b2', '#ab1e23', '#f4c026', '#1c3b65', '#27528c', '#789ccc', '#9bb6d9', '#becfe6', '#80171a', '#9b1b20', '#b63b3f', '#c0575a', '#d58f91', '#b7901d', '#fdf0c9', '#000000', '#202020', '#404040', '#808080', '#c0c0c0', '#e0e0e0', '#f0f0f0', '#ffffff', '#d08888', '#a01010', '#500808', '#84b48e', '#09681d', '#05340f', '#c0791d', '#eeeeec'];
  const base_name = ['blue', 'red', 'yellow', 'yale-blue', 'yinmn-blue', 'vista-blue', 'powder-blue', 'columbia-blue', 'falu-red', 'carmine', 'auburn', 'bittersweet-shimmer', 'old-rose', 'dark-goldenrod', 'dutch-white', 'black', 'eerie-black', 'onyx', 'gray', 'silver', 'platinum', 'white-smoke', 'white', 'negative-light', 'negative', 'negative-dark', 'positive-light', 'positive', 'positive-dark', 'warning'];
  /**
   * Function to convert HEX to RGB
   * @param  {string} color to match
   **/
  const hex2rgb = (color) => {
    let cr, cg, cb;
    if (color.charAt(0) === '#') {
      color = color.substr(1);
    }
    cr = color.charAt(0) + color.charAt(1);
    cg = color.charAt(2) + color.charAt(3);
    cb = color.charAt(4) + color.charAt(5);
    cr = parseInt(cr, 16);
    cg = parseInt(cg, 16);
    cb = parseInt(cb, 16);
    return `${cr},${cg},${cb}`;
  }

  return {
    find_closest_color: () => {
      let color = document.getElementById('color-picker').value;
      let color_rgb = hex2rgb(color);
      let color_r = color_rgb.split(',')[0];
      let color_g = color_rgb.split(',')[1];
      let color_b = color_rgb.split(',')[2];
      // Create an emtyp array for the difference betwwen the colors
      let difference_array = [];
      // Function to find the smallest value in an array
      const smallestValue = (array) => {
        return Math.min.apply(Math, array);
      };
      // Convert the HEX color in the array to RGB colors, split them up to R-G-B, then find out the difference between the "color" and the colors in the array
      base_colors.forEach((value) => {
        let base_color_rgb = hex2rgb(value);
        let base_colors_r = base_color_rgb.split(',')[0];
        let base_colors_g = base_color_rgb.split(',')[1];
        let base_colors_b = base_color_rgb.split(',')[2];
        // Add the difference to the difference_array
        difference_array.push(Math.sqrt((color_r - base_colors_r) * (color_r - base_colors_r) + (color_g - base_colors_g) * (color_g - base_colors_g) + (color_b - base_colors_b) * (color_b - base_colors_b)));
      });
      // Get the lowest number from the difference_array
      let lowest = smallestValue(difference_array);
      // Get the index for that lowest number
      let index = difference_array.indexOf(lowest);
      let the_color = base_colors[index];
      if (color === the_color || '#' + color === the_color) {
        document.getElementById('picked-color').style.backgroundColor = color;
        document.getElementById('picked-hex').innerHTML = `${color}`;
        document.getElementById('suggested-color').style.backgroundColor = the_color;
        document.getElementById('suggested-hex-error').classList.remove('display:none');
        document.getElementById('suggested-hex-error').innerHTML = `${the_color} is already in the codebase`;
        document.getElementById('suggested-hex-button').classList.add('display:none');
        document.getElementById('suggested-hex').innerHTML = ``;
        document.getElementById('suggested-hex-name-button').classList.add('display:none');
        document.getElementById('suggested-hex-name').innerHTML = ``;
      } else {
        document.getElementById('picked-color').style.backgroundColor = color;
        document.getElementById('picked-hex').innerHTML = `${color}`;
        document.getElementById('suggested-color').style.backgroundColor = base_colors[index];
        document.getElementById('suggested-hex-error').classList.add('display:none');
        document.getElementById('suggested-hex-error').innerHTML = ``;
        document.getElementById('suggested-hex-button').classList.remove('display:none');
        document.getElementById('suggested-hex').innerHTML = `${the_color}`;
        document.getElementById('suggested-hex-name-button').classList.remove('display:none');
        document.getElementById('suggested-hex-name').innerHTML = `${base_name[index]}`;
      }
      return false;
    },
  };
});
