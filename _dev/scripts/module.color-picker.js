storm_eagle.module("color_picker", () => {
  "use strict";
  let self;
  let baseColours = ["#3169b2","#ab1e23","#f4c026","#0f3c78","#004370","#77dcf3","#b9ecf3","#e6f9fe","#000000","#202020","#505050","#888888","#dbdbdb","#f3f3f3","#ffffff","#09681d","#9dcda7","#064112","#a01010","#e9a1a1","#640a0a","#c0791d","#eeeeec"];
  let baseName = ["blue","red","yellow","dark-cerulean","atenoe-blue","sky-blue-crayola","pale-blue","bubbles","black","raisin-black","dark-liver","taupe-gray","gainsboro","anti-flash-white","white","positive","positive-light","positive-dark","negative","negative-light","negative-dark","warning","disabled"];
  /**
   * Function to convert HEX to RGB
   * @param  {string} color to match
   **/
  function hex2rgb(colour) {
    let cr, cg, cb;
    if (colour.charAt(0) === '#') {
      colour = colour.substr(1);
    }
    cr = colour.charAt(0) + colour.charAt(1);
    cg = colour.charAt(2) + colour.charAt(3);
    cb = colour.charAt(4) + colour.charAt(5);
    cr = parseInt(cr, 16);
    cg = parseInt(cg, 16);
    cb = parseInt(cb, 16);
    return cr + ',' + cg + ',' + cb;
  }

  return {
    initialize: () => {
      self = storm_eagle["color_picker"];
    },
    find_closest_color: () => {
      let color = document.getElementById("color-picker").value;
      let colorRgb = hex2rgb(color);
      let colorR = colorRgb.split(',')[0];
      let colorG = colorRgb.split(',')[1];
      let colorB = colorRgb.split(',')[2];
      // Create an emtyp array for the difference betwwen the colors
      let differenceArray = [];
      // Function to find the smallest value in an array
      let smallestValue = function(array) {
        return Math.min.apply(Math, array);
      };
      // Convert the HEX color in the array to RGB colors, split them up to R-G-B, then find out the difference between the "color" and the colors in the array
      baseColours.forEach(( value) => {
        let baseColorRgb = hex2rgb(value);
        let baseColoursR = baseColorRgb.split(',')[0];
        let baseColoursG = baseColorRgb.split(',')[1];
        let baseColoursB = baseColorRgb.split(',')[2];
        // Add the difference to the differenceArray
        differenceArray.push(Math.sqrt((colorR - baseColoursR) * (colorR - baseColoursR) + (colorG - baseColoursG) * (colorG - baseColoursG) + (colorB - baseColoursB) * (colorB - baseColoursB)));
      });
      // Get the lowest number from the differenceArray
      let lowest = smallestValue(differenceArray);
      // Get the index for that lowest number
      let index = differenceArray.indexOf(lowest);
      let theColour = baseColours[index];
      if (color === theColour || "#" + color === theColour) {
        document.getElementById("picked-color").style.backgroundColor = color;
        document.getElementById("picked-hex").innerHTML = `${color}`;
        document.getElementById("suggested-color").style.backgroundColor = theColour;
        document.getElementById("suggested-hex").innerHTML = theColour + " is already in the codebase";
      } else {
        document.getElementById("picked-color").style.backgroundColor = color;
        document.getElementById("picked-hex").innerHTML = `${color}`;
        document.getElementById("suggested-color").style.backgroundColor = baseColours[index];
        document.getElementById("suggested-hex").innerHTML = `${theColour}<br>${baseName[index]}`;
      }
      return false;
    }
  }
});