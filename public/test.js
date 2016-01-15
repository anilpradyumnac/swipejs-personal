var initial = {};
var start = {};
var s;
start.StartX;
var touchobj = {};

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
function foldp = function(eventStream, step, initial) {
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

function touchMove(element) {
    var ele = document.getElementById(element);
    var event = on(ele, 'touchmove', false);
    event(ontouchMove);
    s  = foldp(event, step, initial);
    
}

function ontouchMove(e) {
    initial = e.targetTouches[0].pageX;
    touchobj.StartX = s();
    console.log(touchobj);
}
