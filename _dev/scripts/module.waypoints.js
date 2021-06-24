maverick.core.extend('waypoint', function () {
  "use strict";

  return {
    initialize: function () {
      const self = this;
      self.waypoint_listener();
    },
    waypoint_listener: function () {
      let persHowToStepOne = new Waypoint({
        element: document.getElementById('persHowToStepOne'),
        handler: function() {
          document.getElementById('persHowToStepOne').classList.remove('small-opacity--0');
          if (maverick.core.isViewportSmall()) {
            document.getElementById('persHowToStepOne').classList.add('animated','fadeInUp');
          } else {
            document.getElementById('persHowToStepOne').classList.add('animated','fadeInLeft');
          }
        },
        offset: "75%"
      })
    },
  }
});

/*
LEGEND:
  STEPS TO DO
  TYPES OF ANIMATED CLASSES
  TYPES OF OFFSETS
  TO OPTIMIZE

STEPS TO DO:
  Add ID to item
  Add class="small-opacity--0" or appropriate class
  Create waypoint function

TYPES OF ANIMATED CLASSES:
  Attention Seekers
    bounce
    flash
    pulse
    rubberBand
    shake
    swing
    tada
    wobble
    jello
    heartBeat

  Bouncing Entrances
    bounceIn
    bounceInDown
    bounceInLeft
    bounceInRight
    bounceInUp

  Bouncing Exits
    bounceOut
    bounceOutDown
    bounceOutLeft
    bounceOutRight
    bounceOutUp

  Fading Entrances
    fadeIn
    fadeInDown
    fadeInDownBig
    fadeInLeft
    fadeInLeftBig
    fadeInRight
    fadeInRightBig
    fadeInUp
    fadeInUpBig

  Fading Exits
    fadeOut
    fadeOutDown
    fadeOutDownBig
    fadeOutLeft
    fadeOutLeftBig
    fadeOutRight
    fadeOutRightBig
    fadeOutUp
    fadeOutUpBig

  Flippers
    flip
    flipInX
    flipInY
    flipOutX
    flipOutY

  Lightspeed
    lightSpeedIn
    lightSpeedOut

  Rotating Entrances
    rotateIn
    rotateInDownLeft
    rotateInDownRight
    rotateInUpLeft
    rotateInUpRight

  Rotating Exits
    rotateOut
    rotateOutDownLeft
    rotateOutDownRight
    rotateOutUpLeft
    rotateOutUpRight

  Sliding Entrances
    slideInUp
    slideInDown
    slideInLeft
    slideInRight

  Sliding Exits
    slideOutUp
    slideOutDown
    slideOutLeft
    slideOutRight

  Zoom Entrances
    zoomIn
    zoomInDown
    zoomInLeft
    zoomInRight
    zoomInUp

  Zoom Exits
    zoomOut
    zoomOutDown
    zoomOutLeft
    zoomOutRight
    zoomOutUp

  Specials
    hinge
    jackInTheBox
    rollIn
    rollOut

TYPES OF OFFSETS:
  number - A number of pixels. (from the top)
  percentage string - Ex: '50%'. A percentage of the viewport's height.
  'bottom-in-view' string - This is a shortcut, an alias for a function offset that will trigger the handler when the bottom of the element hits the bottom of the viewport.
  'right-in-view' string - This is a shortcut, an alias for a function offset that will trigger the handler when the right of the element hits the right of the viewport. This is only useful in conjunction with the horizontal option.
*/