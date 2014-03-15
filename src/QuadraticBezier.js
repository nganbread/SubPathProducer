(function(ns) {

    ns.getQuadraticSubControlPoint = function(start, controlPoint, end, pointOnLine) {

        var getPercentageAlongPath = function(start, controlPoint, end, pointOnLine) {
            var a = end - 2 * controlPoint + start;
            var b = 2 * controlPoint - 2 * start;
            var c = start - pointOnLine;

            //quadratic equation
            return (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
            ;
        };

        var subControlPoint = [];

        if (controlPoint[0] == start[0] && controlPoint[1] == start[1]) {
            subControlPoint = start;
        } else if (controlPoint[0] == end[0] && controlPoint[1] == end[1]) {
            var otherSubControlPoint = end;
            subControlPoint = (pointOnLine * controlPoint - pointOnLine * start + otherSubControlPoint * start - start * pointOnLine) / (otherSubControlPoint - pointOnLine + controlPoint - start);
        } else {
            //we want to rotate our bezier curve around the control point so that the control point and the end form a horizontal line
            //this is to ensure that the direction of the curve is always in the same direction, making it easy for us to determine
            //which solution, of the quadratics 2 possible, is correct
            var horizontal = [1, 0];
            var angle = ns.angleFunction(horizontal, [end[0] - controlPoint[0], end[1] - controlPoint[1]]); //relative to horizontal (positive = anticlockwise)

            //rotate all points by -angle
            var startRotated = ns.rotateCoordinate(start, controlPoint, -angle);
            var pointOnLineRotated = ns.rotateCoordinate(pointOnLine, controlPoint, -angle);
            var endRotated = ns.rotateCoordinate(end, controlPoint, -angle);
            endRotated[1] = controlPoint[1]; //there might be a SLIGHT discrepency

            //the start may be below the controlpoint/end line. lets reflect it, if it is
            if (startRotated[1] < controlPoint[1]) {
                startRotated[1] = controlPoint[1] + (controlPoint[1] - startRotated[1]);
                pointOnLineRotated[1] = controlPoint[1] + (controlPoint[1] - pointOnLineRotated[1]);
            }

            var percentage = getPercentageAlongPath(startRotated[1], controlPoint[1], endRotated[1], pointOnLineRotated[1]);

            subControlPoint[0] = start[0] + percentage * (controlPoint[0] - start[0]);
            subControlPoint[1] = start[1] + percentage * (controlPoint[1] - start[1]);
        }

        return subControlPoint;
    };
})(window.svgPathAnimator = window.svgPathAnimator || {});