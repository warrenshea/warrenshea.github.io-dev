storm_eagle.module("show_more", function () {
  "use strict";

  var $w = $(window);
  var tableState = [];

  return {
    initialize: function() {
      var self = this;
      $(".table--show-more").each(function (index) {
        tableState[index] = {
          "tableShowMore": $(this),
          "tableShowMoreTransitionDuration": $(this).data("table-show-more-transition-duration"),
          "tableShowMoreOffset": $(this).data("table-show-more-offset"),
          "tableShowMoreContainer": $(this).parent(".table--show-more-container"),
          "tableShowMoreContainerHeight": ""
        };
        self.initUI(index);
        self.resizeListener(index);
        self.addTableShowMoreListener(index);
      });
    },
    initUI: function(index) {
      var self = this;
      var $table = tableState[index];
      $table["tableShowMoreContainer"].css("transition-property", "height");
      $table["tableShowMoreContainer"].css("transition-timing-function", "ease");
    },
    updateTableShowMoreContainerHeight: function(index) {
      var $table = tableState[index];

      setTimeout(function () {
        $table["tableShowMoreContainer"].css("transition-duration", "0s");
      }, tableState[index]["tableShowMoreTransitionDuration"] * 1000);

      $table["tableShowMoreContainer"].css("height", $table["tableShowMoreContainerHeight"] - $table["tableShowMoreOffset"]);
    },
    addTableShowMoreListener: function(index) {
      var self = this;
      var $table = tableState[index];

      $table["tableShowMoreContainer"].siblings().find(".table--show-more-button, .table--show-less-button").on("click", function (e) {
        var $showMoreButton = $table["tableShowMoreContainer"].siblings().find(".table--show-more-button");
        var $showLessButton = $table["tableShowMoreContainer"].siblings().find(".table--show-less-button");

        e.preventDefault();
        $table["tableShowMoreContainer"].css("transition-duration", tableState[index]["tableShowMoreTransitionDuration"] + "s");

        if ($table["tableShowMoreContainer"].hasClass("table-is-showing-more")) {
          $showMoreButton.removeClass("display--none").addClass("display--flex");
          $showLessButton.removeClass("display--flex").addClass("display--none");
          $table["tableShowMoreContainer"].removeClass("table-is-showing-more");
        } else {
          $showMoreButton.removeClass("display--flex").addClass("display--none");
          $showLessButton.removeClass("display--none").addClass("display--flex");
          $table["tableShowMoreContainer"].addClass("table-is-showing-more");
        }
        self.forceResize();
      });
    },
    resizeListener: function(index) {
      var self = this;
      $w.on('load resize', function (event) {
        self.forceResize();
      });
    },
    forceResize: function() {
      var self = this;
      var $table = void 0;

      $(".table--show-more").each(function (index) {
        $table = tableState[index];
        if ($table["tableShowMoreContainer"].hasClass("table-is-showing-more")) {
          $table["tableShowMoreContainerHeight"] = $table["tableShowMore"].outerHeight();
        } else {
          $table["tableShowMoreContainerHeight"] = $table["tableShowMore"].find("[data-table-show-more-bottom]").offset().top - $table["tableShowMore"].find("[data-table-show-more-top]").offset().top;
        }
        self.updateTableShowMoreContainerHeight(index);
      });
    }
  };
});