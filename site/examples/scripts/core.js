      var sandbox = (function($, window, document, undefined) {
        /**
         * Return the core object
         *
         * @var object core
         * @scope public
         */
        return { 
          core : {
            /**
             * Extend the sandbox object
             *
             * @param string nameSpace
             * @param object moduleObject
             * @return mixed
             * @scope public
             */
            extend : function(nameSpace, moduleObject) {
              if(sandbox[nameSpace] === undefined) {
                sandbox[nameSpace] = moduleObject();
                if(sandbox[nameSpace] !== undefined) {
                  if(typeof sandbox[nameSpace]._initialize === 'function') {
                    sandbox[nameSpace]._initialize();
                  }
                  if(typeof sandbox[nameSpace]._ready === 'function') {
                    $(document).ready(function() {
                      sandbox[nameSpace]._ready();
                    });
                  }
                  return sandbox[nameSpace];
                }
              } else {
                sandbox.core.throwException('Cannot extend "sandbox" to "sandbox."' + nameSpace + '", the name space already exists');
              }
            },
            /**
             * Runs the core functionality
             */
            run : function() {
            },
            /**
             * Throws an exception
             *
             * @param string message
             * @return void
             * @scope public
             */
            throwException : function(message) {
              if(message !== undefined) {
                throw message;
                console.log(message);
              } else {
                throw true;
              }
              console.trace();
            },
            /**
             * Replaces all instances of a string
             *
             * @param string stringVar
             * @return string
             * @scope public
             */
            replaceAll : function(stringVar,search,replacement) {
              return stringVar.split(search).join(replacement);
            }
          }
        };
      })(jQuery, window, document);
      sandbox.core.run();