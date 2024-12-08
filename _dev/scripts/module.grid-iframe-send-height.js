'use strict';
storm_eagle.module('grid_send_height', () => {
  let self;
  return {
    initialize: () => {
      self = storm_eagle.grid_send_height;
      self.add_message_listener();
      self.add_iframe_resize_listener();
    },
    add_message_listener: () => {
      window.addEventListener('message', event => {
        //console.log(`receiving message: ${event.data}`);
        if (event.data !== "") {
          let { action, type, css } = JSON.parse(event.data);
          self.send_height();
        }
      });
    },
    add_iframe_resize_listener: () => {
      function force_resize() {
        self.send_height();
      }
      storm_eagle.resize_observer(document.querySelector('body'), force_resize);
    },
    send_height: () => {
      let height = document.querySelector('body').offsetHeight;
      if (height !== 0) {
        const action = 'update_height';
        const new_height = height;
        const id = document.querySelector('body').getAttribute('data-iframe-id');
        const query = { action, new_height, id };
        parent.postMessage(JSON.stringify(query), window.location.origin);
      }
    }
  };
})