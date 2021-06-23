storm_eagle.module("carousel_builder", function () {
  "use strict";

  return {
    initialize: function(){

    },
    update: function(carousel_number,property,value) {
      console.log(carousel_number,property,value);
      let el = document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel']");
      switch (property){
        case "container_size":
          document.getElementById(`carousel-${carousel_number}`).removeClass("w:100%").removeClass("mw:1200px").addClass(value);
          break;
        case "num_slides":
          document.getElementById(`carousel-${carousel_number}`).querySelectorAll("[data-module='carousel.item']").forEach((el,index) => {
            el.removeClass("display:none");
            document.getElementById(`carousel-active-${carousel_number}`).querySelectorAll("option")[index].removeAttribute("disabled");
            document.getElementById(`carousel-num-active-sm-${carousel_number}`).querySelectorAll("option")[index].removeAttribute("disabled");
            document.getElementById(`carousel-num-active-md-${carousel_number}`).querySelectorAll("option")[index].removeAttribute("disabled");
            document.getElementById(`carousel-num-active-lg-${carousel_number}`).querySelectorAll("option")[index].removeAttribute("disabled");
            document.getElementById(`carousel-num-active-xl-${carousel_number}`).querySelectorAll("option")[index].removeAttribute("disabled");
            if (index >= value) {
              document.getElementById(`carousel-active-${carousel_number}`).querySelectorAll("option")[index].setAttribute("disabled",true);
              document.getElementById(`carousel-num-active-sm-${carousel_number}`).querySelectorAll("option")[index].setAttribute("disabled",true);
              document.getElementById(`carousel-num-active-md-${carousel_number}`).querySelectorAll("option")[index].setAttribute("disabled",true);
              document.getElementById(`carousel-num-active-lg-${carousel_number}`).querySelectorAll("option")[index].setAttribute("disabled",true);
              document.getElementById(`carousel-num-active-xl-${carousel_number}`).querySelectorAll("option")[index].setAttribute("disabled",true);
              el.addClass("display:none");
            }
          });
          break;
        case "breakpoint":
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel']").setAttribute("data-carousel-breakpoint",value);
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel.indicators-group']").removeClass("sm=:hide").removeClass("sm+:hide").removeClass("md-:hide").removeClass("md=:hide").removeClass("md+:hide").removeClass("lg-:hide").removeClass("lg=:hide").removeClass("lg+:hide").removeClass("xl+:hide");
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel.controls-prev']").removeClass("sm=:hide").removeClass("sm+:hide").removeClass("md-:hide").removeClass("md=:hide").removeClass("md+:hide").removeClass("lg-:hide").removeClass("lg=:hide").removeClass("lg+:hide").removeClass("xl+:hide");
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel.controls-next']").removeClass("sm=:hide").removeClass("sm+:hide").removeClass("md-:hide").removeClass("md=:hide").removeClass("md+:hide").removeClass("lg-:hide").removeClass("lg=:hide").removeClass("lg+:hide").removeClass("xl+:hide");
          break;
        case "type":
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel']").removeClass("carousel:center-mode-all-equal").removeClass("carousel:center-mode-bigger");
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel']").addClass(value);
          document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel']").removeAttribute("data-carousel-item-height-variable");
          if (value === "carousel:center-mode-bigger") {
            document.getElementById(`carousel-${carousel_number}`).querySelector("[data-module='carousel']").setAttribute("data-carousel-item-height-variable","true");
          }
          break;
        case "focused-item":
          document.getElementById(`carousel-${carousel_number}`).querySelectorAll("[data-module='carousel.item']").forEach((el,index) => {
            el.removeClass("active-item");
          });
          document.getElementById(`carousel-${carousel_number}`).querySelectorAll("[data-module='carousel.item']")[value - 1].addClass("active-item");
          break;
        case "number-active-elements-sm":
        case "number-active-elements-md":
        case "number-active-elements-lg":
        case "number-active-elements-xl":
          el.setAttribute("data-carousel-number-active",`[${document.getElementById(`carousel-num-active-sm-${carousel_number}`).value},${document.getElementById(`carousel-num-active-md-${carousel_number}`).value},${document.getElementById(`carousel-num-active-lg-${carousel_number}`).value},${document.getElementById(`carousel-num-active-xl-${carousel_number}`).value}]`);
          break;
        case "left-offset-sm":
        case "left-offset-md":
        case "left-offset-lg":
        case "left-offset-xl":
          el.setAttribute("data-carousel-offset",`[${document.getElementById(`left-offset-sm-${carousel_number}`).value},${document.getElementById(`left-offset-md-${carousel_number}`).value},${document.getElementById(`left-offset-lg-${carousel_number}`).value},${document.getElementById(`left-offset-xl-${carousel_number}`).value}]`);
          break;
        case "transition-speed-sm":
        case "transition-speed-md":
        case "transition-speed-lg":
        case "transition-speed-xl":
          el.setAttribute("data-carousel-transition-duration",`[${parseFloat(document.getElementById(`transition-speed-sm-${carousel_number}`).value)},${parseFloat(document.getElementById(`transition-speed-md-${carousel_number}`).value)},${parseFloat(document.getElementById(`transition-speed-lg-${carousel_number}`).value)},${parseFloat(document.getElementById(`transition-speed-xl-${carousel_number}`).value)}]`);
          break;
        default :
      }
      document.querySelectorAll("[data-module='carousel']").forEach(function (el) {
        let carousel_id = el.getAttribute("id");
        storm_eagle.carousel.disable_carousel(carousel_id);
      });
      storm_eagle.carousel.initialize();
    }
  };
});