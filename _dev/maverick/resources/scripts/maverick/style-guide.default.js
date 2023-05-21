'use strict';

/* Using Prism to create code snippets.
Container needs `data-code-reference=${key}`
Code needs `data-code-snippet=${key}`
e.g.
Note: Indenting matters
<section data-code-reference=${key}>
...
</section>

      <section>
        <div class="row max-width--80">
          <pre class="width--100"><code class="language-html" data-code-snippet=${key}></code></pre>
        </div>
      </section>
*/
storm_eagle.module('embed_code_snippet', function () {
  'use strict';

  let self;

  return {
    initialize: () => {
      self = storm_eagle["embed_code_snippet"];
      if ($("[data-code-reference]").length > 0) {
        self.link_code_with_prism_snippet();
      }
    },
    link_code_with_prism_snippet: () => {

      function html_encode(value) {
        // Create a in-memory div, set its inner text (which jQuery automatically encodes)
        // Then grab the encoded contents back out. The div never exists on the page.
        return $('<div/>').text(value).html();
      }
      $("[data-code-reference]").each(function () {
        var $cleanse = $(this).clone();

        $cleanse.removeAttr("id");
        $cleanse.find("[data-container]").removeAttr("id");
        $cleanse.find("[data-code-reference]").removeAttr("id");
        $cleanse.find("[data-row]").removeAttr("id");
        $cleanse.find("[data-editable]").removeAttr("id");

        //For Presentation Purposes
        //Comment out for better usage
        $cleanse.removeAttr("data-container");
        $cleanse.removeAttr("data-code-reference");
        $cleanse.find("[data-container]").removeAttr("data-container");
        $cleanse.find("[data-code-reference]").removeAttr("data-code-reference");
        $cleanse.find("[data-row]").removeAttr("data-row");
        $cleanse.find("[data-editable]").removeAttr("data-editable");

        $('code[data-code-snippet=' + $(this).attr("data-code-reference") + ']').html(html_encode($cleanse[0].outerHTML));
      });
    },
    force_prism_reinit: () => {
      Prism.highlightAll();
    }
  };
});

storm_eagle.module('editable_popup', function () {
  'use strict';

  let self = "";
  var __CMS_WINDOW = null;
  return {
    initialize: () => {
      self = storm_eagle["editable_popup"];
      if ($("[data-editable]").length > 0) {
        self.create_ids();
        self.add_editable_listener();
        self.add_message_listener();
      }
    },
    create_ids: () => {
      $("[data-editable],[data-row],[data-container]").each(function () {
        $(this).attr("id", Math.random().toString(36).substr(2, 5));
      });
    },
    add_editable_listener: () => {
      $("[data-editable]").on('click', function (event) {
        let $this = $(this);
        event.stopPropagation();
        let params = 'location=1, status=1, menubar=1, toolbar=1, width=850, height=800, left=900, top=200';
        __CMS_WINDOW = window.open(`/maverick/cms/?item=${$this.attr("id")}&itemParentRow=${$this.closest("[data-row]").attr("id")}&itemParentContainer=${$this.closest("[data-container]").attr("id")}`, '_blank', params);
        let classContainer = $(this).closest("[data-container]").attr("class") || "";
        let classRow = $this.closest("[data-row]").attr("class") || "";
        let classItem = $this.attr("class") || "";
        setTimeout(function () {
          // console.log(`Webpage to CMS: itemContainer||${classContainer}`);
          // console.log(`Webpage to CMS: itemRow||${classRow}`);
          // console.log(`Webpage to CMS: item||${classItem}`);
          __CMS_WINDOW.postMessage("itemContainer||" + classContainer, window.location.origin);
          __CMS_WINDOW.postMessage("itemRow||" + classRow, window.location.origin);
          __CMS_WINDOW.postMessage("item||" + classItem, window.location.origin);
        }, 750);
      });
    },
    add_message_listener: () => {
      window.addEventListener('message', message => {
        message = message.data;
        // console.log(`CMS to Webpage: ${message.substring(0, 5)} ${message.substring(5)}`);
        // console.log(`Code: ${message.substring(0, 5)} | Message: ${message.substring(5)}`);
        if ($(`#${message.substring(0, 5)}`).attr("class") === undefined) {
          $(`#${message.substring(0, 5)}`).addClass(message.substring(5));
        } else {
          //console.log(message.substring(5));
          $(`#${message.substring(0, 5)}`).attr("class", "").addClass(message.substring(5));
        }
        storm_eagle.embed_code_snippet.link_code_with_prism_snippet();
        storm_eagle.embed_code_snippet.force_prism_reinit();
      });
    }
  };
});