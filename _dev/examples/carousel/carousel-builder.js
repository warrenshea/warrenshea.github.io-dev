storm_eagle.module("carousel_builder", function () {
  "use strict";

  return {
    update: function(carousel_number,property,value) {
      console.log(carousel_number,property,value);
      switch (property){
        case "container_size":
          document.getElementById(`carousel-${carousel_number}`).removeClass("w:100%").removeClass("mw:1200px").addClass(value);
          break;
        case "num_slides":
          document.getElementById(`carousel-${carousel_number}`).querySelectorAll("[data-module='carousel.item']").forEach((el,index) => {
            console.log(el);
            el.removeClass("display:none");
            if (index >= value) {
              el.addClass("display:none");
            }
          });
          break;
        default :
      }
      document.querySelectorAll("[data-module='carousel']").forEach(function (el) {
        let carousel_id = el.getAttribute("id");
        storm_eagle.carousel.disable_carousel(carousel_id)
      });
      storm_eagle.carousel.initialize();
    }
  };
});