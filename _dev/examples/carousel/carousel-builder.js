'use strict';
storm_eagle.module('carousel_builder', () => {
  let self;

  return {
    initialize: () => {
      self = storm_eagle['carousel_builder'];
    },
    update: (carousel_number, property, value) => {
      //console.log(carousel_number,property,value);
      let el = document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel']");
      switch (property) {
        case 'container_size':
          document.getElementById(`carousel-${carousel_number}`).classList.remove('w:100%');
          document.getElementById(`carousel-${carousel_number}`).classList.remove('mw:1200px');
          document.getElementById(`carousel-${carousel_number}`).classList.add(value);
          break;
        case 'num_slides':
          document
            .getElementById(`carousel-${carousel_number}`)
            .querySelectorAll("[data-module='carousel.item']")
            .forEach((el, index) => {
              el.classList.remove('display:none');
              document.getElementById(`carousel-active-${carousel_number}`).querySelectorAll('option')[index].removeAttribute('disabled');
              document.getElementById(`carousel-num-active-sm-${carousel_number}`).querySelectorAll('option')[index].removeAttribute('disabled');
              document.getElementById(`carousel-num-active-md-${carousel_number}`).querySelectorAll('option')[index].removeAttribute('disabled');
              document.getElementById(`carousel-num-active-lg-${carousel_number}`).querySelectorAll('option')[index].removeAttribute('disabled');
              document.getElementById(`carousel-num-active-xl-${carousel_number}`).querySelectorAll('option')[index].removeAttribute('disabled');
              if (index >= value) {
                document.getElementById(`carousel-active-${carousel_number}`).querySelectorAll('option')[index].setAttribute('disabled', true);
                document.getElementById(`carousel-num-active-sm-${carousel_number}`).querySelectorAll('option')[index].setAttribute('disabled', true);
                document.getElementById(`carousel-num-active-md-${carousel_number}`).querySelectorAll('option')[index].setAttribute('disabled', true);
                document.getElementById(`carousel-num-active-lg-${carousel_number}`).querySelectorAll('option')[index].setAttribute('disabled', true);
                document.getElementById(`carousel-num-active-xl-${carousel_number}`).querySelectorAll('option')[index].setAttribute('disabled', true);
                el.classList.add('display:none');
              }
            });
          break;
        case 'breakpoint':
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel']").setAttribute('data-carousel-breakpoint', value);
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel.indicators-group']").classList.remove('sm=:hide', 'sm+:hide', 'md-:hide', 'md=:hide', 'md+:hide', 'lg-:hide', 'lg=:hide', 'lg+:hide', 'xl+:hide');
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel.controls-prev']").classList.remove('sm=:hide', 'sm+:hide', 'md-:hide', 'md=:hide', 'md+:hide', 'lg-:hide', 'lg=:hide', 'lg+:hide', 'xl+:hide');
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel.controls-next']").classList.remove('sm=:hide', 'sm+:hide', 'md-:hide', 'md=:hide', 'md+:hide', 'lg-:hide', 'lg=:hide', 'lg+:hide', 'xl+:hide');
          break;
        case 'type':
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel']").classList.remove('carousel:center-mode-all-equal', 'carousel:center-mode-bigger');
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel']").classList.add(value);
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel']").removeAttribute('data-carousel-item-height-variable');
          if (value === 'carousel:center-mode-bigger') {
            document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel']").setAttribute('data-carousel-item-height-variable', 'true');
          }
          break;
        case 'focused-item':
          document
            .getElementById(`carousel-${carousel_number}`)
            .querySelectorAll("[data-module='carousel.item']")
            .forEach((el, index) => {
              el.classList.remove('active-item');
            });
          document.getElementById(`carousel-${carousel_number}`).querySelectorAll("[data-module='carousel.item']")[value - 1].classList.add('active-item');
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
        let carousel_id = el.getAttribute('id');
        storm_eagle.carousel.disable_carousel(carousel_id);
      });
      storm_eagle.carousel.initialize();
    },
  };
});
