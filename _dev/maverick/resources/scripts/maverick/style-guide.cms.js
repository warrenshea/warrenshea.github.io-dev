"use strict";

storm_eagle.module('editable_popup_sender', function () {
  'use strict';

  let defaultClassesItem = [];
  let defaultClassesItemRow = [];
  let defaultClassesItemContainer = [];
  let elementId = storm_eagle.page.get_query_value("item");
  let elementParentRowId = storm_eagle.page.get_query_value("itemParentRow");
  let elementParentContainerId = storm_eagle.page.get_query_value("itemParentContainer");
  let classes = "";
  let classesArray = "";

  let breakpoints = ["sm+", "md+", "lg+", "xl+"];

  return {
    initialize: () => {
      self = storm_eagle["editable_popup_sender"];
      self.init_ui();
      self.init_isotope();
      self.add_isotope_listeners();
      self.add_form_listener();
      self.add_message_listener();
    },
    init_ui: () => {
      $("[data-slider-container-key]").each(function () {
        let key = $(this).attr("data-slider-container-key").replace(":","\:");
        self.createSlider(key);
      });
      storm_eagle.slider.initialize();
    },
    init_isotope: () => {
      var $containerChecklist = $(".isotope-container-cms");
      $containerChecklist.isotope({
        itemSelector: '.isotope-item'
      });
    },
    add_isotope_listeners: () => {
      var $containerChecklist = $(".isotope-container-cms"),
          $optionSetsChecklist = $(".option-set-checklist"),
          filters = {};
      // flatten object by concatting values
      function concatValues(obj) {
        var value = '';
        for (var prop in obj) {
          value += obj[prop];
        }
        return value;
      }

      $(".option-set-checklist a").on("click", function () {
        let $this = $(this);

        $this.parents(".option-set-checklist").find(".selected").removeClass("selected");
        $this.addClass("selected");

        // get group key
        var $buttonGroup = $this.parents('.option-set-checklist');
        var filterGroup = $buttonGroup.attr('data-filter-group');
        // set filter for group
        filters[filterGroup] = $this.attr('data-filter');
        // combine filters
        var filterValue = concatValues(filters);
        $containerChecklist.isotope({ filter: filterValue });
        setTimeout(() => {
          storm_eagle.slider.update_all_slider_track();
          storm_eagle.equalize_heights.force_resize();
        },750);
      });
    },
    createSlider: (key) => {
      let html = `<div class="position:relative w:12 align-self:centered pt:16px pb:32px" id="${key}" data-module="slider" data-equalize-height="slider">
        <div class="text-align:left">
          <span class="description heebo:bold">${classKeyValueConfig[key]["heading"]}</span>
        </div>
        <div class="form:theme:gl0b3x" data-module="slider.input-container">
          <label class="sr-only" for="${key}-slider">
            <span class="description">Slider</span>
          </label>
          <input id="${key}-slider" data-slider name="${key}" data-module="slider.input" value="0" class="display:block align-self:centered w:100% slider" type="range" min="0" max="${(classKeyValueConfig[key]['value'].length - 1)}" steps="1">
          <span class="slider-background"><span class="slider-fill" data-module="slider.fill"></span></span>
          <ul data-module="slider.labels" class="slider-labels position:absolute text-align:center unstyle-pl:0 display:flex align:spaced w:100%">`;
      $(classKeyValueConfig[key]["label"]).each(function (index) {
        html += `<li>${classKeyValueConfig[key]["label"][index]}</li>`;
      });
      html += `</ul>
        </div>
      </div>`;
      $(`[data-slider-container-key='${key}']`).html(html);
    },
    add_form_listener: () => {
      var item = [];
      var itemRow = [];
      var itemContainer = [];

      var containerArray = ["bgc", "bgcgy"];
      var rowArray = ["bgc", "bgcgy", "align-self", "pt", "pl", "pr", "pb", "mt", "ml", "mr", "mb"];
      var itemArray = ["w", "align-self", "pt", "pl", "pr", "pb", "mt", "ml", "mr", "mb", "color", "bgc", "b-silver", "bt-silver", "bb-silver", "bl-silver", "br-silver", "b-eerie-black", "bt-eerie-black", "bb-eerie-black", "bl-eerie-black", "br-eerie-black", "b-blue", "bt-blue", "bb-blue", "bl-blue", "br-blue", "br", "brtl", "brtr", "brbl", "brbr", "box-shadow", "text-align", "fs", "heebo"];

      function pushToItemsArray(keyArray, $itemArray, itemToBeChanged) {
        $(breakpoints).each(function (index, breakpoint) {
          $(keyArray).each(function (index2, key) {
            let keyValue = 0;
            //console.log(itemToBeChanged,breakpoint,key);
            if (itemToBeChanged !== "") {
              if (breakpoint === "") {
                // console.log(`${itemToBeChanged}--${key}`);
                // console.log($(`input[name="${itemToBeChanged}--${key}"]`));
                keyValue = classKeyValueConfig[`${itemToBeChanged}--${key}`]['value'][$(`input[name="${itemToBeChanged}--${key}"]`).val()];
              } else {
                keyValue = classKeyValueConfig[`${itemToBeChanged}--${breakpoint}:${key}`]['value'][$(`input[name="${itemToBeChanged}--${breakpoint}:${key}"]`).val()];
              }
            } else {
              // console.log(classKeyValueConfig[`${breakpoint}:${key}`]);
              // console.log(classKeyValueConfig[`${breakpoint}:${key}`]['value']);
              // console.log($(`input[name='${breakpoint}:${key}']`).val());
              if (breakpoint === "") {
                keyValue = classKeyValueConfig[`${breakpoint}:${key}`]['value'][$(`input[name='${key}']`).val()];
              } else {
                keyValue = classKeyValueConfig[`${breakpoint}:${key}`]['value'][$(`input[name='${breakpoint}:${key}']`).val()];
              }
            }
            if (keyValue !== "") {
              if (breakpoint === "") {
                $itemArray.push(`${key}:${keyValue}`);
              } else {
                $itemArray.push(`${breakpoint}:${key}:${keyValue}`);
              }
              //console.log(`${breakpoint}:${key}:${keyValue}`);
            }
          });
        });
      }

      $("form[name=maker] input").on('change', function (event) {
        item = [];
        itemRow = [];
        itemContainer = [];
        let keyValue = 0;

        //For the container
        pushToItemsArray(containerArray, itemContainer, "container");

        //For the row
        keyValue = classKeyValueConfig['row--mw']['value'][$('input[name="row--mw"]').val()];
        if (keyValue !== "") {
          itemRow.push(`mw:${keyValue}`);
        }
        pushToItemsArray(rowArray, itemRow, "row");

        //For the items
        pushToItemsArray(itemArray, item, "");

        // console.log(itemContainer);
        // console.log(itemRow);
        // console.log(item);

        let mergedItem = item.concat(defaultClassesItem);
        let mergedItemRow = itemRow.concat(defaultClassesItemRow);
        let mergedItemContainer = itemContainer.concat(defaultClassesItemContainer);

        window.opener.postMessage(elementId + mergedItem.toString().replace(/,/g, ' '), window.location.origin);
        window.opener.postMessage(elementParentRowId + "row " + mergedItemRow.toString().replace(/,/g, ' '), window.location.origin);
        window.opener.postMessage(elementParentContainerId + mergedItemContainer.toString().replace(/,/g, ' '), window.location.origin);
      });
    },
    /* on load, gets the messages from the parent to add the the classes, populating the popup with existing values */
    select_range: (elementType, classesArray) => {
      var prefix = "",
          key = "",
          breakpoint = "",
          keyValue = "",
          $targetEl = "";
      // console.log("classesArray");
      // console.log(classesArray);
      if (classesArray.length > 0) {
        /* only run this if there are classes */
        $(classesArray).each(function (index, value) {
          console.info(`elementType: ${elementType}, index ${index},value ${value}`);
          breakpoint = "";
          if (value.indexOf(":") > -1) {
            if (elementType === "item") {
              prefix = "";
            } else if (elementType === "itemRow") {
              prefix = "row--";
            } else if (elementType === "itemContainer") {
              prefix = "container--";
            }
            if (value.indexOf("sm") === 0 || value.indexOf("md") === 0 || value.indexOf("lg") === 0 || value.indexOf("xl") === 0) {
              breakpoint = value.split(":")[0];
              key = value.split(":")[1];
              keyValue = value.split(":")[2];
            } else {
              key = value.split(":")[0];
              keyValue = value.split(":")[1];
            }
            //console.log(`breakpoint ${breakpoint}, key ${key}, keyValue ${keyValue}`);

            /* only set default values of things if they're in the config */
            if (breakpoint === "") {
              if (classKeyValueConfig[`${prefix}${key}`]) {
                $targetEl = $(`input[name="${prefix}${key}"]`);
                $targetEl.val(classKeyValueConfig[`${prefix}${key}`]["value"].indexOf(keyValue));
                // console.log($targetEl);
                // console.log($targetEl.val(classKeyValueConfig[`${prefix}${key}`]["value"].indexOf(keyValue)));
              }
            } else {
              if (classKeyValueConfig[`${prefix}${breakpoint}:${key}`]) {
                $targetEl = $(`input[name="${prefix}${breakpoint}:${key}"]`);
                $targetEl.val(classKeyValueConfig[`${prefix}${breakpoint}:${key}`]["value"].indexOf(keyValue));
                // console.log($targetEl);
                // console.log($targetEl.val(classKeyValueConfig[`${prefix}${breakpoint}:${key}`]["value"].indexOf(keyValue)));
              }
            }
            // if (elementType === "item") {
            //   defaultClassesItem.push(value);
            // } else if (elementType === "itemRow") {
            //   defaultClassesItemRow.push(value);
            // } else if (elementType === "itemContainer") {
            //   defaultClassesItemContainer.push(value);
            // }
          } else {
            // if (elementType === "item") {
            //   defaultClassesItem.push(value);
            // } else if (elementType === "itemRow") {
            //   defaultClassesItemRow.push(value);
            // } else if (elementType === "itemContainer") {
            //   defaultClassesItemContainer.push(value);
            // }
          }
        });
      }
    },
    add_message_listener: () => {
      window.addEventListener('message', message => {
        message = message.data;
        //console.log("Parent to Child: " + message);
        classes = message.split("||")[1];
        //console.log(classes);
        classesArray = classes.split(" ");
        //console.log(classesArray);

        storm_eagle.editable_popup_sender.select_range(message.split("||")[0], classesArray);
      });
    }
  };
});