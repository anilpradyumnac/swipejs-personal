'use strict'
function demo(){
    var container = document.getElementById('container'),
    boxleft,
    startx,
    dist = 0,
    touchobj = null

    container.addEventListener('touchstart', function(e){
        touchobj = e.changedTouches[0]
        boxleft = parseInt(container.style.left)
        startx = parseInt(touchobj.clientX)
        console.log("startX:" + startx);
        e.preventDefault()
    }, false)

    container.addEventListener('touchmove', function(e){
        console.log("initial touch :"+touchobj.clientX );
        touchobj = e.changedTouches[0]
        var dist = parseInt(touchobj.clientX) - startx
        container.style.left = ( (boxleft + dist < 0) ? 0: boxleft + dist ) + 'px'
        e.preventDefault()
    }, false)
}
