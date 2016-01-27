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
function touchHandler(element){
    const container = document.getElementById(element);

    let touchStart$ = on(container, "touchstart", false);
    touchStart$ = map(touchStart$, event =>(

        let pageX = event.targetTouches[0].clientX;
        console.log("Touch Start X: "+ pageX);
        // let touchMove$ = on(container, "touchmove", fauytrilse);
        // touchMove$ = map(touchMove$, event =>{
        //     let moveX = event.targetTouches[0].clientX;
        //     console.log("Touch Move X: "+ moveX);
        // })
    )})
    touchStart$(value => value);
}
