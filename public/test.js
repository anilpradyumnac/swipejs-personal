var initial = 0
var start = {}
var s;
start.StartX

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

//map function from FRPJS
function map(eventStream, valueTransform) {
    return function(next) {
        eventStream(function(value) {
            next(valueTransform(value))
        })
    }
}

//on function from FRPJS
function on(element, name, useCapture) {
    return function(next) {
        element.addEventListener(name, next, !!useCapture)
    }
}

function touchMove(element) {
    var ele = document.getElementById(element);
    var eventStream = on(ele, 'touchmove', false);
    eventStream(ontouchMove);
    s  = stepper(eventStream,initial);
}
function ontouchMove(e) {
    start.StartX = e.targetTouches[0].pageX;
    var touchobj = {};
    touchobj = s();
    console.log(touchobj.changedTouches[0]);
}
