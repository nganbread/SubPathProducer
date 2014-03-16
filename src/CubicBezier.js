(function(ns) {
    ns.getCubicSubControlPoint = function (start, controlPoint1, controlPoint2, end, pointOnLine) {

        var getPercentageAlongPath2 = function (start, controlPoint1, controlPoint2, end, pointOnLine) {

            var d = (start[0] - pointOnLine[0]) - (start[1] - pointOnLine[1]);
            var c = (3 * (controlPoint1[0] - start[0])) - (3 * (controlPoint1[1] - start[1]));
            var b = (3 * (start[0] - 2 * controlPoint1[0] + controlPoint2[0])) - (3 * (start[1] - 2 * controlPoint1[1] + controlPoint2[1]));
            var a = (end[0] - 3 * controlPoint2[0] + 3 * controlPoint1[0] - start[0]) - (end[1] - 3 * controlPoint2[1] + 3 * controlPoint1[1] - start[1]);

            var discriminant = 18 * a * b * c * d - 4 * b * b * b * d + b * b * c * c - 4 * a * c * c * c - 27 * a * a * d * d;
            if (discriminant < 0) {
                //one real root, 2 complex - ignore the complex
                var j = ((-b * b * b) / (27 * a * a * a)) + ((b * c) / (6 * a * a) - ((d) / (2 * a)));
                var k = ((c) / (3 * a)) - ((b * b) / (9 * a * a));
                var l = Math.sqrt(j * j + k * k * k);

                var percentage = ns.curt(j + l) + ns.curt(j - l) - (b / (3 * a));
                return [percentage];
            } else {
                //three real roots
                var f = ((3 * c) / a - (b * b) / (a * a)) / 3;
                var g = (((2 * b * b * b) / (a * a * a)) - ((9 * b * c) / (a * a)) + ((27 * d) / (a))) / 27;
                var h = (g * g / 4) + (f * f * f / 27);

                var i = Math.sqrt((g * g / 4) - h);
                var j = -ns.curt(i);
                var k = Math.acos(-(g / (2 * i)));
                var m = Math.cos(k / 3);
                var n = Math.sqrt(3) * Math.sin(k / 3);
                var p = -(b / (3 * a));

                return [
                    -2 * j * m + p,
                    j * (m + n) + p,
                    j * (m - n) + p
                ];
            }
        };

        var getBezierPoints = function (percentage, start, controlPoint1, controlPoint2, end) {

            var c1 /*f*/ = [start[0] + percentage * (controlPoint1[0] - start[0]), start[1] + percentage * (controlPoint1[1] - start[1])];
            var c2 /*h*/ = [controlPoint1[0] + percentage * (controlPoint2[0] - controlPoint1[0]), controlPoint1[1] + percentage * (controlPoint2[1] - controlPoint1[1])];
            var c3 /*j*/ = [controlPoint2[0] + percentage * (end[0] - controlPoint2[0]), controlPoint2[1] + percentage * (end[1] - controlPoint2[1])];
            var c4 /*g*/ = [c1[0] + percentage * (c2[0] - c1[0]), c1[1] + percentage * (c2[1] - c1[1])];
            var c5 /*i*/ = [c2[0] + percentage * (c3[0] - c2[0]), c2[1] + percentage * (c3[1] - c2[1])];
            var pointOnLine /*e*/ = [c4[0] + percentage * (c5[0] - c4[0]), c4[1] + percentage * (c5[1] - c4[1])];

            //return the 4 points that make up the sub bezier path
            return [start, c1, c4, pointOnLine];
        };

        var z = getPercentageAlongPath2(start, controlPoint1, controlPoint2, end, pointOnLine);

        //remove null and invalid values
        for (var i = 0; i < z.length; i++) {
            if (!z[i] || z[i] < 0 || z[i] > 1) {
                z.splice(i, 1);
                i--;
            }
        }

        //find the closest solution
        var solution;
        if (z.length == 1) {
            solution = getBezierPoints(z[0], start, controlPoint1, controlPoint2, end);
        } else {
            var delta = null;
            for (var i = 0; i < z.length; i++) {
                var possibleSolution = getBezierPoints(z[i], start, controlPoint1, controlPoint2, end);
                var difference = ns.getHypotenuseLength(possibleSolution[3][0], possibleSolution[3][1], pointOnLine[0], pointOnLine[1]);
                if (!delta || Math.min(delta, difference) == difference) {
                    delta = difference;
                    solution = possibleSolution;
                }
            }
        }

        return [solution[1], solution[2]];
    };

})(window.subPathProducer = window.subPathProducer || {});
