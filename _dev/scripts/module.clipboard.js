'use strict';
storm_eagle.module('clipboard', () => {
  return {
    copy: function (text,text_color,background) {
      /*https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript*/
      function fallback_copy_text_to_clipboard(text) {
        var text_area = document.createElement('textarea');
        text_area.value = text;

        // Avoid scrolling to bottom
        text_area.style.top = '0';
        text_area.style.left = '0';
        text_area.style.position = 'fixed';

        document.body.appendChild(textArea);
        text_area.focus();
        text_area.select();

        try {
          var successful = document.execCommand('copy');
          var msg = successful ? 'successful' : 'unsuccessful';
          //console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
          //console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(text_area);
      }
      if (!navigator.clipboard) {
        fallback_copy_text_to_clipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(
        () => {
          console.log(`Clipboard: ${text}`);
          if (storm_eagle.toast) {
            storm_eagle.toast.add(`Copied: ${text}`,text_color, background);
          }
          //console.log('Async: Copying to clipboard was successful!');
        },
        function (err) {
          //console.error('Async: Could not copy text: ', err);
        },
      );
    },
  };
});
