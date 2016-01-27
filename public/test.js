<<<<<<< HEAD
"use strict"

function on(element, name, useCapture) {
  return function(next) {
    element.addEventListener(name, next, !!useCapture)
  }
}

function map(eventStream, valueTransform) {
  return function(next) {
    eventStream(function(value) {
      next(valueTransform(value))
    })
  }
}

function foldp(eventStream, step, initial) {
  return (function(next) {
    var accumulated = initial
    eventStream(function (value) {
      next(accumulated = step(accumulated, value))
    })
  })
}

// function merge(...eventStreams) {
//  return function(next) {
//    eventStreams.forEach(function(eventStream) {
//      eventStream(function(value) {
//        next(value)
//      })
//    })
//  }
// }

function merge() {
  for (var _len = arguments.length, eventStreams = Array(_len), _key = 0; _key < _len; _key++) {
    eventStreams[_key] = arguments[_key]
  }

  return function (next) {
    eventStreams.forEach(function (eventStream) {
      eventStream(function (value) {
        next(value)
      })
    })
  }
}

function touchHandler(element) {
  const container = document.getElementById(element)

  let touchStart$ = on(container, "touchstart", false)
  let touchMove$ = on(container, "touchmove", false)
  let touchEvents$ = merge(touchStart$, touchMove$)

  touchEvents$ = map(touchEvents$, event => ({
    eType: event.type,
    pageX: event.targetTouches[0].clientX,
    pageY: event.targetTouches[0].clientY
  }))
  
  touchEvents$ = foldp(touchEvents$, (prev, curr) => {
    if (curr.eType != "touchstart") {
      let dx = curr.pageX - prev.pageX
      let current = parseFloat(container.style.left) || 0
      container.style.left = current + dx + "px"
    }
    return curr
  }, null)

  touchEvents$(value => console.log(value))
}
=======
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
function doSomething(value){
    return value;
}
//main function that runs the other functions
function touchHandler(element) {
   const container = document.getElementById(element);

   let touchStart$ = on(container, "touchstart", false);

   touchStart$ = map(touchStart$, event => ( {
       eType: event.type,
       startX: event.targetTouches[0].clientX,


   }))


   touchStart$(value => console.log("Touch StartX Value: "+ value.startX))

   let touchMove$ = on(container, "touchmove", false);
   touchMove$ = map(touchMove$, event => ({
       eType: event.Type,
       pageX: event.targetTouches[0].clientX,

   }));
   touchMove$(value => console.log("MovingX Value: "+ value.pageX ))








  
}
>>>>>>> master
