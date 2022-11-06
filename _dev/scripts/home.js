storm_eagle.module('homepage', () => {
  return {
    initialize: () => {
      document.querySelectorAll(".opacity\\:0\\%").forEach((el,index) => {
        setTimeout(() => {
          el.classList.remove("opacity:0%")
          el.classList.add("opacity:100%");
        }, index * 50);
      });
      document.querySelectorAll(".heading,.description-line,.description-notes-line").forEach((el,index) => {
        setTimeout(() => {
          el.classList.add("opacity:100%");
        }, index * 50);
      });
    }
  }
});