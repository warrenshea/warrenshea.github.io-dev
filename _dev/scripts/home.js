storm_eagle.module('homepage', () => {
  return {
    initialize: () => {
      document.querySelectorAll(".heading,.description-line,.description-notes-line").forEach((el,index) => {
        setTimeout(() => {
          el.classList.add("opacity:100%");
        }, index * 50);
      });
    }
  }
});