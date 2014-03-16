(function(ns) {
    var inheritsFrom = function (base, extender) {
        var copy = extender;
        extender = function () {
            copy.apply(this, arguments);
            base.apply(this, arguments);
        };
        extender.prototype = new base();
        return extender;
    };

    ns.BasePathSubstringGenerator = function (endX, endY, startX, startY, actualParameter) {
        if (arguments.length == 0) return;

        this.endX = this.endX || endX;
        this.endY = this.endY || endY;
        this.startX = this.startX || startX;
        this.startY = this.startY || startY;
        this.actualParameter = this.actualParameter || actualParameter;

        //raw svg element
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        this.svg.setAttribute("d", "M" + this.startX + ',' + this.startY + this.pathString);

        this.length = this.svg.getTotalLength();
    };

    ns.BasePathSubstringGenerator.prototype.getPathAtLength = function (distance) {
        if (distance < this.length) {
            return this.calculateDStringAtLength(distance);
        } else {
            return this.pathString;
        }
    };
    ns.BasePathSubstringGenerator.prototype.getPointAtLength = function (distance) {
        return this.svg.getPointAtLength(distance);
    };

    ns.MSubstringGenerator = inheritsFrom(ns.BasePathSubstringGenerator, function (endX, endY, startX, startY) {
        this.pathString = "M" + endX + "," + endY;
        this.length = 0;
        this.calculateDStringAtLength = function () {
            return this.pathString;
        };
    });

    ns.LSubstringGenerator = inheritsFrom(ns.BasePathSubstringGenerator, function (endX, endY, startX, startY, actualParamter) {
        this.pathString = "L" + endX + ',' + endY;
        this.calculateDStringAtLength = function (distance) {
            var coordinate = this.getPointAtLength(distance);
            return "L" + coordinate.x + "," + coordinate.y;
        };
    });

    ns.ZSubstringGenerator = inheritsFrom(ns.LSubstringGenerator, function (endX, endY, startX, startY) {
        //use an L to get a correctly reported length
        this.pathString = "L" + endX + ',' + endY;

        //treat this as an L unless we are at full length
        this.getPathAtLength = function (distance) {
            if (distance < this.length) {
                return this.calculateDStringAtLength(distance);
            } else {
                return 'z';
            }
        };
    });

    ns.HSubstringGenerator = inheritsFrom(ns.BasePathSubstringGenerator, function (endX, endY, startX, startY) {
        this.pathString = "H" + endX;
        this.calculateDStringAtLength = function (distance) {
            var coordinate = this.getPointAtLength(distance);
            return "H" + coordinate.x;
        };
    });

    ns.VSubstringGenerator = inheritsFrom(ns.BasePathSubstringGenerator, function (endX, endY, startX, startY) {
        this.pathString = "V" + endY;
        this.calculateDStringAtLength = function (distance) {
            var coordinate = this.getPointAtLength(distance);
            return "V" + coordinate.y;
        };
    });

    ns.BezierSubstringGenerator = inheritsFrom(ns.BasePathSubstringGenerator, function (endX, endY, startX, startY, controlPoints) {
        this.end = [this.endX, this.endY];
        this.controlPoints = controlPoints;
    });

    ns.CSubstringGenerator = inheritsFrom(ns.BezierSubstringGenerator, function (endX, endY, startX, startY, controlPoints) {
        if (arguments.length == 0) return;
        this.pathString = "C" + controlPoints[0][0] + "," + controlPoints[0][1] + " " + controlPoints[1][0] + "," + controlPoints[1][1] + " " + endX + "," + endY;

        this.calculateDStringAtLength = function (distance) {
            var coordinate = this.getPointAtLength(distance);
            var subControlPoints = ns.getCubicSubControlPoint([this.startX, this.startY], this.controlPoints[0], this.controlPoints[1], [this.endX, this.endY], [coordinate.x, coordinate.y]);

            return "C" +
                subControlPoints[0][0] + ',' + subControlPoints[0][1] + ' ' +
                subControlPoints[1][0] + ',' + subControlPoints[1][1] + ' ' +
                coordinate.x + "," + coordinate.y;
        };
    });

    ns.QSubstringGenerator = inheritsFrom(ns.BezierSubstringGenerator, function (endX, endY, startX, startY, controlPoints) {
        if (arguments.length == 0) return;
        this.pathString = "Q" + controlPoints[0][0] + "," + controlPoints[0][1] + " " + endX + "," + endY;

        this.calculateDStringAtLength = function (distance) {
            var coordinate = this.getPointAtLength(distance);
            var subControlPoints = ns.getQuadraticSubControlPoint([this.startX, this.startY], this.controlPoints[0], [this.endX, this.endY], [coordinate.x, coordinate.y]);

            return "Q" +
                subControlPoints[0] + ',' + subControlPoints[1] + ' ' +
                coordinate.x + "," + coordinate.y;
        };
    });

    ns.ASubstringGenerator = inheritsFrom(ns.BasePathSubstringGenerator, function (endX, endY, startX, startY, rx, ry, rotation, flagArc, flagSweep) {
        this.pathString = "A" + rx + "," + ry + ' ' + rotation + ' ' + flagArc + ',' + flagSweep + ' ' + endX + ',' + endY;
        this.rx = rx;
        this.ry = ry;
        this.rotation = rotation;
        this.flagArc = flagArc;
        this.flagSweep = flagSweep;

        this.subString = "A" + this.rx + "," + this.ry + ' ' + this.rotation + ' ';

        this.calculateFa = ns.getCalculateFaFunction(this.startX, this.startY, this.endX, this.endY, this.rx, this.ry, this.rotation, this.fa, this.fs);

        this.calculateDStringAtLength = function (distance) {
            var coordinate = this.getPointAtLength(distance);
            return this.subString + this.calculateFa(coordinate) + ',' + this.flagSweep + ' ' + coordinate.x + ',' + coordinate.y;
        };
    });

    ns.getCalculateFaFunction = function (x1, y1, x2, y2, rx, ry, rotation, fa, fs) {

        //convert to radians
        rotation *= (Math.PI / 180);

        var cosRot = Math.cos(rotation);
        var sinRot = Math.sin(rotation);

        //Calculate the center of the ellipse
        var a = (x1 - x2) / 2;
        var b = (y1 - y2) / 2;

        var x1Prime = cosRot * a + sinRot * b;
        var y1Prime = -sinRot * a + cosRot * b;

        var aa = (rx * y1Prime) / ry;
        var bb = -(ry * x1Prime) / rx;

        var cc = Math.abs(rx * rx * ry * ry - rx * rx * y1Prime * y1Prime - ry * ry * x1Prime * x1Prime);
        cc /= rx * rx * y1Prime * y1Prime + ry * ry * x1Prime * x1Prime;
        cc = Math.sqrt(cc);

        var cxPrime = (fa == fs ? -1 : 1) * cc * aa;
        var cyPrime = (fa == fs ? -1 : 1) * cc * bb;

        //the vector between the center and the start
        var vector1 = [x1 - cxPrime, y1 - cyPrime];

        return function (coordinate) {
            //the vector between the center and the end
            var vector2 = [coordinate.x - cxPrime, coordinate.y - cyPrime];

            //the angle between the two vectors
            var sweepingAngle = ns.angleFunction(vector1, vector2);

            //angles larger than 180deg will become negative
            return sweepingAngle < 0 ? 1 : 0;
        };
    };


})(window.subPathProducer = window.subPathProducer || {});