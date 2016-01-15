var initial = 0;
var start = {};
var s;
var StartX;

//Stepper function from FRPjs
function stepper(eventStream, initial) {
    var valueAtLastStep = initial;
    eventStream(function nextStep(value) {
        valueAtLastStep = value;
    })
    return (function behaveAtLastStep() {
        return valueAtLastStep;
    })
}

//map from FRP
function map(eventStream, valueTransform) {
    return function(next) {
        eventStream(function(value) {
            next(valueTransform(value))
        })
    }
}
//on from FRP
function on(element, name, useCapture) {
    return function(next) {
        element.addEventListener(name, next, !!useCapture);
    }
}
function touchMove(element) {
    var ele = document.getElementById(element);
    var event = on(ele, 'touchmove', false);
    event(ontouchMove);
    s  = stepper(event,initial);
    
}

function ontouchMove(e) {
    
    
    start = s();
    StartX = start.changedTouches[0].pageX;
    console.log(StartX);
}
