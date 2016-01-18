'use strict'
//Stepper function added from FRPJS
function stepper(eventStream, initial) {
    var valueAtLastStep = initial;
    eventStream(function nextStep(value) {
        valueAtLastStep = value
    })
    return (function behaveAtLastStep() {
        return valueAtLastStep
    })
}
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
        })
    }
}

//on function from FRPJS
function on(element, name, useCapture) {
    return function(next) {
        element.addEventListener(name, next, !!useCapture);
    }
}
function touchHandler(element) {
   const container = document.getElementById(element);
   let touchMove$ = on(container, "touchmove", false);
   touchMove$ = map(touchMove$, event => ({pageX: event.targetTouches[0].clientX,}));
   touchMove$(page => console.log(page));
   touchMove$ = stepper(touchMove$, 0);
   touchMove$(value => console.log(value));
}
