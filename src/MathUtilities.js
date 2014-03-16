(function(ns) {
    var abs = function(u) {
        return Math.sqrt(u[0] * u[0] + u[1] * u[1]);
    };

    var dot = function (u, v) {
        return u[0] * v[0] + u[1] * v[1];
    };

    var positive = function (u, v) {
        return u[0] * v[1] - u[1] * v[0] >= 0;
    };

    ns.angleFunction = function (u, v) {
        var angle = Math.acos(dot(u, v) / (abs(u) * abs(v)));
        return ((positive(u, v) ? 1 : -1) * angle) % (2 * Math.PI);
    };

    ns.rotateCoordinate = function (coordinate, wrt, angle) {
        //rotate a coordinate with respect to the vector 'wrt'
        return [
            Math.cos(angle) * (coordinate[0] - wrt[0]) - Math.sin(angle) * (coordinate[1] - wrt[1]) + wrt[0],
            Math.sin(angle) * (coordinate[0] - wrt[0]) + Math.cos(angle) * (coordinate[1] - wrt[1]) + wrt[1]
        ];
    };

    ns.curt = function(x) {
        var sign = x < 0 ? -1 : 1;
        return sign * Math.pow(Math.abs(x), 1 / 3);
    };

    ns.getHypotenuseLength = function (x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    };
    
})(window.subPathProducer = window.subPathProducer || {});