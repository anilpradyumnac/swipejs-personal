'use strict'

//Stepper function added from FRPJS
// function stepper(eventStream, initial) {
//     var valueAtLastStep = initial, valueAtCurrentStep;
//     var skipFirst = true;
//     eventStream(function nextStep(value) {
//         if (skipFirst) skipFirst = false;
//         else valueAtLastStep = valueAtCurrentStep;
//         valueAtCurrentStep = value;
//     });
//     return (function behaveAtLastStep() {
//         return valueAtLastStep
//     });
// }
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

// function bind(eventStream, valueToEvent) {
//     return function(next) {
//         eventStream(function(value) {
//             valueToEvent(value)(next)
//         })
//     }
// }
function touchHandler(element) {
   const container = document.getElementById(element);

   let touchMove$   = on(container, "touchmove", false);

   touchMove$ = map(touchMove$, event => ({
     pageX: event.targetTouches[0].pageX,
     pageY: event.targetTouches[0].pageY
   }));

   touchMove$ = foldp(touchMove$, (prev, curr) => {
       let dx = curr.pageX - prev.pageX;
       let current = parseFloat(container.style.left) || 0;
       container.style.left = current + dx;
       return curr;
   }, { pageX: 0, pageY: 0 })

   touchMove$(value => value);
}
// function touchHandler(element) {
//     const container = document.getElementById(element)
//     let touchMove$ = on(container, "touchmove", false)
//     touchMove$ = map(touchMove$, event => ({
//         pageX: event.targetTouches[0].pageX
//     }));
//     touchMove$ = foldp(touchMove$, (prev,curr) => {
//         console.log(curr, prev);
//         let dx = curr.pageX - prev.pageX;
//         let current  = parseFloat(container.style.left) || 0;
//         console.log(current + dx)
//         container.style.left = current + dx;
//         return curr ;
//     }, { pageX: 0 });
//     touchMove$(value => value);
//
// }
