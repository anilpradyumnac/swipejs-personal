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

//bind function
function bind(eventStream, valueToEvent) {
    return function(next) {
        eventStream(function(value) {
            valueToEvent(value)(next)
        })
    }
}

//main function that runs the other functions
function touchHandler(element) {
   const container = document.getElementById(element);

   let touchStart$ = on(container, "touchstart", false);

   touchStart$ = map(touchStart$, event => ({
       startX: event.targetTouches[0].pageX,
       startY: event.targetTouches[0].pageY,

   }))


   touchStart$(value => console.log("Touch StartX Value: "+ value.startX))

   let touchMove$ = on(container, "touchmove", false);
   touchMove$ = map(touchMove$, event => ({
       pageX: event.targetTouches[0].pageX,
       pageY: event.targetTouches[0].pageY
   }));

   // touchMove$ = foldp(touchMove$, (prev, curr) => {
   //     console.log(prev.pageX, curr.pageX)
   //     let dx = curr.pageX - prev.pageX;
   //     let current = parseFloat(container.style.left) || 0;
   //     container.style.left = current + dx + "px";
   //     return curr;
   // }, { pageX: touchStart$(value => { return value.startX }), pageY: touchStart$(value => { return value.startY }) })
   //
   // touchMove$(value => value);

   touchEnd$(value => console.log(value))
   let touchEvents$ = bind(touchStart$, (value) => foldp(touchMove$, (prev, curr) => {
       console.log("Curr: "+curr.pageX, ", prev: "+prev.pageX);
       let dx = curr.pageX - prev.pageX;
       let current = parseFloat(container.style.left) || 0;
       container.style.left = current + dx + "px";
       return curr;
   }, { pageX: value.startX, pageY: value.startY } ) )
   //touchEvents = bind(touchEnd$, (value) => )
   touchEvents$(value => value);

}
