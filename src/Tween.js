(function(ns) {
    var defaultEasing = function (t, b, c, d) {
        return c * t / d + b;
    };
    var easings = {
        linear: defaultEasing,
        easeInQuad: function (t, b, c, d) {
            t /= d;
            return c * t * t + b;
        },
        easeOutQuad: function (t, b, c, d) {
            t /= d;
            return -c * t * (t - 2) + b;
        }
    };

    var requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            setTimeout(callback, 16);
        };

    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }
    
    ns.tween = function (startValue, endValue, duration, action, callback, easing) {
        if (!isFunction(easing)) {
            easing = easings[easing] || defaultEasing;
        }

        var startTime;
        var animate = function (timestamp) {
            startTime = startTime || timestamp;

            var elapsedTime = timestamp - startTime;
            var value = easing(elapsedTime, startValue, (endValue - startValue), duration);
            action(value, elapsedTime);

            if (timestamp - startTime < duration) {
                requestAnimationFrame(animate);
            } else {
                callback && callback();
            }
        };
        requestAnimationFrame(animate);
    };
})(window.svgPathAnimator = window.svgPathAnimator || {});