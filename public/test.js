'use strict'

//reduce or foldp function
function foldp(eventStream, step, initial) {
    return (function(next) {
      var accumulated = initial
      eventStream(function (value) {
        next(accumulated = step(accumulated, value))
    })
  })
}
//map function
function map(eventStream, valueTransform) {
    return function(next) {
        eventStream(function(value) {
            next(valueTransform(value));
        });
    }
}

//on function
function on(element, name, useCapture) {
    return function(next) {
        element.addEventListener(name, next, !!useCapture);


    }
}

function off(element,name){
    element.removeEventListener(name);
}
//bind function
function bind(eventStream, valueToEvent) {
    return function(next) {
        eventStream(function(value) {
            valueToEvent(value)(next)
        })
    }
}

function merge(...eventStreams) {
    return function(next) {
        eventStreams.forEach(function(eventStream) {
            eventStream(function(value) {
                next(value)
            })
        })
    }
}
//Merge function as retunred by babel.js transpiler
// function merge() {
//   for (var _len = arguments.length, eventStreams = Array(_len), _key = 0; _key < _len; _key++) {
//     eventStreams[_key] = arguments[_key]
//   }
//
//   return function (next) {
//     eventStreams.forEach(function (eventStream) {
//       eventStream(function (value) {
//         next(value)
//       })
//     })
//   }
// }
function throttle(eventStream, ms) {
    return (function(next) {
        var last = 0;
        eventStream(function(value) {
            var now = performance.now()
            if (last == 0 || (now - last) > ms) {
                next(value)
                last = now
            }
        })
    })
}

function debounce(eventStream, ms) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            eventStream.apply(context, args);
        }, ms);
    };
}
//main function that runs the other functions
function touchHandler(element) {
   const container = document.getElementById(element);
   let count = document.getElementsByClassName('box').length;



   let touchStart$ = on(container, "touchstart", false);
   let touchMove$ = on(container, "touchmove", false);

   let touchEvents$ = merge(touchStart$, touchMove$)


   touchEvents$ = map(touchEvents$, event => ({
       eType: event.type,
       pageX: event.touches[0].pageX,
       pageY: event.touches[0].pageY,
       timestamp: Date.now()
   }));

   touchEvents$ = foldp(touchEvents$, (prev, curr) => {
    if (curr.eType != "touchstart") {
      let dx = parseFloat(curr.pageX - prev.pageX);
      console.log(dx);
      let current = parseFloat(container.style.left) || 0
      container.style.left = current + dx + "px";
    }
    return curr
  }, null)

  touchEvents$ = debounce(touchEvents$, 42);
  touchEvents$(value => console.log(value));
}
