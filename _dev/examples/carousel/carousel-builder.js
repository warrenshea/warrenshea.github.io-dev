'use strict';
storm_eagle.module('carousel_builder', () => {

  return {
    update: (carousel_number, property, value) => {
      //console.log(carousel_number,property,value);
      let el = document.querySelector(`#carousel-${carousel_number} [data-module='carousel']`);
      switch (property) {
        case 'container_size':
          document.querySelector(`#carousel-${carousel_number}`).classList.remove('w:100%');
          document.querySelector(`#carousel-${carousel_number}`).classList.remove('mw:1280px');
          document.querySelector(`#carousel-${carousel_number}`).classList.add(value);
          break;
        case 'num_slides':
          document.querySelectorAll(`#carousel-${carousel_number} [data-module='carousel.item']`).forEach((el, index) => {
              el.classList.remove('display:none');
              document.querySelectorAll(`#carousel-active-${carousel_number} option`)[index].removeAttribute('disabled');
              document.querySelectorAll(`#carousel-num-active-sm-${carousel_number} option`)[index].removeAttribute('disabled');
              document.querySelectorAll(`#carousel-num-active-md-${carousel_number} option`)[index].removeAttribute('disabled');
              document.querySelectorAll(`#carousel-num-active-lg-${carousel_number} option`)[index].removeAttribute('disabled');
              document.querySelectorAll(`#carousel-num-active-xl-${carousel_number} option`)[index].removeAttribute('disabled');
              if (index >= value) {
                document.querySelectorAll(`#carousel-active-${carousel_number} option`)[index].setAttribute('disabled', true);
                document.querySelectorAll(`#carousel-num-active-sm-${carousel_number} option`)[index].setAttribute('disabled', true);
                document.querySelectorAll(`#carousel-num-active-md-${carousel_number} option`)[index].setAttribute('disabled', true);
                document.querySelectorAll(`#carousel-num-active-lg-${carousel_number} option`)[index].setAttribute('disabled', true);
                document.querySelectorAll(`#carousel-num-active-xl-${carousel_number} option`)[index].setAttribute('disabled', true);
                el.classList.add('display:none');
              }
            });
          break;
        case 'breakpoint':
          document.querySelector(`#carousel-${carousel_number} [data-module='carousel']`).setAttribute('data-carousel-breakpoint', value);
          break;
        case 'focused-item':
          document.querySelectorAll(`#carousel-${carousel_number} [data-module='carousel.item']`).forEach((item) => {
            item.setAttribute("data-carousel-item-active","");
            item.setAttribute("data-carousel-item-secondary-active","");
          });
          document.querySelector(`#carousel-${carousel_number} [data-module='carousel']`).setAttribute('data-carousel-item-active', value - 1);
          break;
        case 'number-active-elements-sm':
        case 'number-active-elements-md':
        case 'number-active-elements-lg':
        case 'number-active-elements-xl':
          el.setAttribute('data-carousel-number-active', `[${document.getElementById(`carousel-num-active-sm-${carousel_number}`).value},${document.getElementById(`carousel-num-active-md-${carousel_number}`).value},${document.getElementById(`carousel-num-active-lg-${carousel_number}`).value},${document.getElementById(`carousel-num-active-xl-${carousel_number}`).value}]`);
          break;
        case 'left-offset-sm':
        case 'left-offset-md':
        case 'left-offset-lg':
        case 'left-offset-xl':
          if (document.getElementById(`${property}-${carousel_number}`).value.toString().substring(0, 1) === '.') {
            document.getElementById(`${property}-${carousel_number}`).value = `0` + document.getElementById(`${property}-${carousel_number}`).value.toString();
          }
          el.setAttribute('data-carousel-offset', `[${document.getElementById(`left-offset-sm-${carousel_number}`).value},${document.getElementById(`left-offset-md-${carousel_number}`).value},${document.getElementById(`left-offset-lg-${carousel_number}`).value},${document.getElementById(`left-offset-xl-${carousel_number}`).value}]`);
          break;
        case 'transition-speed-sm':
        case 'transition-speed-md':
        case 'transition-speed-lg':
        case 'transition-speed-xl':
          el.setAttribute('data-carousel-transition-duration', `[${parseFloat(document.getElementById(`transition-speed-sm-${carousel_number}`).value)},${parseFloat(document.getElementById(`transition-speed-md-${carousel_number}`).value)},${parseFloat(document.getElementById(`transition-speed-lg-${carousel_number}`).value)},${parseFloat(document.getElementById(`transition-speed-xl-${carousel_number}`).value)}]`);
          break;
        default:
      }
      document.querySelectorAll("[data-module='carousel']").forEach((el) => {
        const id = el.getAttribute('id');
        storm_eagle.carousel.ui.disable(id);
      });
      document.querySelectorAll("[data-module='carousel']").forEach((el) => {
        const id = el.getAttribute('id');
        storm_eagle.carousel.ui.update(id);
      });
    },
  };
});
