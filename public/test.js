'use strict'

//FoldP or reduce
function foldp(eventStream, step, initial) {
    return (function(next) {
      var accumulated = initial
      eventStream(function (value) {
        next(accumulated = step(accumulated, value))
    })
  })
}
//map function from FRPJS
function map(eventStream, valueTransform) {
    return function(next) {
        eventStream(function(value) {
            next(valueTransform(value));
        });
    }
}

//on function from FRPJS
function on(element, name, useCapture) {
    return function(next) {
        element.addEventListener(name, next, !!useCapture);
    }
}

function bind(eventStream, valueToEvent) {
    return function(next) {
        eventStream(function(value) {
            valueToEvent(value)(next)
        })
    }
}
function touchHandler(element) {
   const container = document.getElementById(element);

   let touchStart$ = on(container, "touchstart", false);
   touchStart$ = map(touchStart$, event => ({
       startX: event.targetTouches[0].pageX,
       startY: event.targetTouches[0].pageY
   }))

   let touchMove$ = on(container, "touchmove", false);
   touchMove$ = map(touchMove$, event => ({
    pageX: event.targetTouches[0].pageX,
    pageY: event.targetTouches[0].pageY
   }));

   touchMove$ = foldp(touchMove$, (prev, curr) => {
       let dx = curr.pageX - prev.pageX;
       let current = parseFloat(container.style.left) || 0;
       container.style.left = current + dx + "px";
       return curr;
   }, { pageX:touchStart$(value => value.startX), pageY:touchStart$(value => value.startY) })

   touchMove$(value => value);

   // let touchEvents$ = bind(touchStart$, (value) => { console.log("bind: " + value.startX); return (next) => touchMove$(next); });
   // touchEvents$(value => console.log("activate: " + value.pageX));
}
