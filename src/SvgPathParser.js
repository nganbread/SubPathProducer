(function(ns) {

    var last = function (array) {
        return array.length == 0 ? null : array[array.length - 1];
    };

    var getAbsoluteStartPoint = function (commands) {
        var previousCommand = last(commands);
        var x, y;
        if (previousCommand) {
            x = previousCommand.endX;
            y = previousCommand.endY;
        } else {
            x = y = 0;
        }

        return { x: x, y: y };
    };

    var getNextFloat = function (constituents) {
        return parseFloat(constituents.shift());
    };

    var M = function (constituents, commands, relative, actualParameter) {
        actualParameter = actualParameter || 'M';

        var lastCommand = commands[commands.length - 1];
        if (lastCommand && lastCommand.actualParameter && lastCommand.actualParameter.toLowerCase() == 'm') {
            return L(constituents, commands, relative, actualParameter);
        }

        var endX = getNextFloat(constituents);
        var endY = getNextFloat(constituents);
        if (isNaN(endX) || isNaN(endY)) return null;

        var start = getAbsoluteStartPoint(commands);
        if (relative) {
            endX += start.x;
            endY += start.y;
        }

        return new ns.MSubstringGenerator(endX, endY, start.x, start.y, actualParameter);
    };
    var m = function (constituents, commands) {
        return M(constituents, commands, true, 'm');
    };

    var Z = function (constituents, commands) {
        var startOfSubpath = { x: 0, y: 0 };
        for (var i = commands.length - 1; i >= 0; i--) {
            if (commands[i] instanceof MSubstringGenerator) {
                startOfSubpath.x = commands[i].endX;
                startOfSubpath.y = commands[i].endY;
                break;
            }
        }
        var start = getAbsoluteStartPoint(commands);

        return new ns.ZSubstringGenerator(startOfSubpath.x, startOfSubpath.y, start.x, start.y);
    };

    var L = function (constituents, commands, relative, actualParameter) {
        actualParameter = actualParameter || "L";

        var x = getNextFloat(constituents);
        var y = getNextFloat(constituents);
        if (isNaN(x) || isNaN(y)) return null;

        var start = getAbsoluteStartPoint(commands);
        if (relative) {
            x += start.x;
            y += start.y;
        }

        return new ns.LSubstringGenerator(x, y, start.x, start.y, actualParameter);
    };
    var l = function (constituents, commands, relative) {
        return L(constituents, commands, true, 'l');
    };

    var H = function (constituents, commands, relative) {
        var x = getNextFloat(constituents);
        if (isNaN(x)) return null;

        var start = getAbsoluteStartPoint(commands);
        if (relative) {
            x += start.x;
        }

        return new ns.HSubstringGenerator(x, start.y, start.x, start.y);
    };
    var h = function (constituents, commands, relative) {
        return H(constituents, commands, true);
    };

    var V = function (constituents, commands, relative) {
        var y = getNextFloat(constituents);
        if (isNaN(y)) return null;

        var start = getAbsoluteStartPoint(commands);
        if (relative) {
            y += start.y;
        }

        return new VSubstringGenerator(start.x, y, start.x, start.y);
    };
    var v = function (constituents, commands, relative) {
        return V(constituents, commands, true);
    };

    var C = function (constituents, commands, relative) {
        var cx1 = getNextFloat(constituents);
        var cy1 = getNextFloat(constituents);
        var cx2 = getNextFloat(constituents);
        var cy2 = getNextFloat(constituents);
        var destX = getNextFloat(constituents);
        var destY = getNextFloat(constituents);

        if (isNaN(cx1) || isNaN(cy1) || isNaN(cx2) || isNaN(cy2) || isNaN(destX) || isNaN(destY)) return null;

        var start = getAbsoluteStartPoint(commands);

        if (relative) {
            destX += start.x;
            destY += start.y;
            cx1 += start.x;
            cy1 += start.y;
            cx2 += start.x;
            cy2 += start.y;
        }

        var controlPoints = [[cx1, cy1], [cx2, cy2]];

        return new ns.CSubstringGenerator(destX, destY, start.x, start.y, controlPoints);
    };
    var c = function (constituents, commands, relative) {
        return C(constituents, commands, true);
    };

    var S = function (constituents, commands, relative) {
        var cx2 = getNextFloat(constituents);
        var cy2 = getNextFloat(constituents);
        var destX = getNextFloat(constituents);
        var destY = getNextFloat(constituents);

        if (isNaN(cx2) || isNaN(cy2) || isNaN(destX) || isNaN(destY)) return null;

        var start = getAbsoluteStartPoint(commands);

        if (relative) {
            destX += start.x;
            destY += start.y;
            cx2 += start.x;
            cy2 += start.y;
        }

        var lastCommand = commands[commands.length - 1];
        var cx1, cy1;
        if (commands[commands.length - 1] instanceof CSubstringGenerator) {
            //use the reflection through the start point of the last control point
            var controlPoint = lastCommand.controlPoints[1];
            cx1 = start.x + (start.x - controlPoint[0]);
            cy1 = start.y + (start.y - controlPoint[1]);
        } else {
            //use the start as the controlpoint
            cx1 = start.x;
            cy1 = start.y;
        }

        var controlPoints = [[cx1, cy1], [cx2, cy2]];

        return new ns.CSubstringGenerator(destX, destY, start.x, start.y, controlPoints);
    };
    var s = function (constituents, commands, relative) {
        return S(constituents, commands, true);
    };

    var Q = function (constituents, commands, relative) {
        var cx = getNextFloat(constituents);
        var cy = getNextFloat(constituents);
        var destX = getNextFloat(constituents);
        var destY = getNextFloat(constituents);

        if (isNaN(cx) || isNaN(cy) || isNaN(destX) || isNaN(destY)) return null;

        var start = getAbsoluteStartPoint(commands);

        if (relative) {
            destX += start.x;
            destY += start.y;
            cx += start.x;
            cy += start.y;
        }

        var controlPoints = [[cx, cy]];

        return new ns.QSubstringGenerator(destX, destY, start.x, start.y, controlPoints);
    };
    var q = function (constituents, commands, relative) {
        return Q(constituents, commands, true);
    };

    var T = function (constituents, commands, relative) {
        var destX = getNextFloat(constituents);
        var destY = getNextFloat(constituents);

        if (isNaN(destX) || isNaN(destY)) return null;

        var start = getAbsoluteStartPoint(commands);

        if (relative) {
            destX += start.x;
            destY += start.y;
        }

        var lastCommand = commands[commands.length - 1];
        var cx, cy;
        if (commands[commands.length - 1] instanceof QSubstringGenerator) {
            //use the reflection through the start point of the last control point
            var controlPoint = lastCommand.controlPoints[0];
            cx = start.x + (start.x - controlPoint[0]);
            cy = start.y + (start.y - controlPoint[1]);
        } else {
            //use the start as the controlpoint
            cx = start.x;
            cy = start.y;
        }

        var controlPoints = [[cx, cy]];

        return new ns.QSubstringGenerator(destX, destY, start.x, start.y, controlPoints);
    };
    var t = function (constituents, commands, relative) {
        return T(constituents, commands, true);
    };

    var A = function (constituents, commands, relative) {
        var rx = getNextFloat(constituents);
        var ry = getNextFloat(constituents);
        var rotation = getNextFloat(constituents);
        var flagArc = getNextFloat(constituents);
        var flagSweep = getNextFloat(constituents);
        var destX = getNextFloat(constituents);
        var destY = getNextFloat(constituents);

        if (isNaN(rx) || isNaN(ry) || isNaN(rotation) || isNaN(flagArc) || isNaN(flagSweep) || isNaN(destX) || isNaN(destY)) return null;

        var start = getAbsoluteStartPoint(commands);

        if (relative) {
            destX += start.x;
            destY += start.y;
        }

        return new ns.ASubstringGenerator(destX, destY, start.x, start.y, rx, ry, rotation, flagArc, flagSweep);
    };
    var a = function (constituents, commands, relative) {
        return A(constituents, commands, true);
    };

    var number = /^-?[0-9]+/;
    ns.parsePath = function (pathString) {
        var constituents =
            pathString
                .replace(/([a-zA-Z])/g, ' $1 ') //insert spaces before and after letters
                .replace(/-/g, ' -') //insert spaces before negative signs
                .trim() //remove leading and trailing whitespace (affects the split)
                .split(/[\s,]+/); //split at all commas and spaces
        var commands = [];

        var handler;
        while (constituents.length > 0) {
            var element = constituents.shift();

            if (number.test(element)) {
                //its a number, so its the same type of path as the previous.
                //the handler will be the same
                //but we need to put the number back into the list
                constituents.unshift(element);
            } else {
                switch (element) {
                    case 'M': handler = M; break;
                    case 'm': handler = m; break;
                    case 'Z':
                    case 'z': handler = Z; break;
                    case 'L': handler = L; break;
                    case 'l': handler = l; break;
                    case 'V': handler = V; break;
                    case 'v': handler = v; break;
                    case 'H': handler = H; break;
                    case 'h': handler = h; break;
                    case 'C': handler = C; break;
                    case 'c': handler = c; break;
                    case 'Q': handler = Q; break;
                    case 'q': handler = q; break;
                    case 'A': handler = A; break;
                    case 'a': handler = a; break;
                    case 'T': handler = T; break;
                    case 't': handler = t; break;
                    case 'S': handler = S; break;
                    case 's': handler = s; break;
                    default: handler = null; break;
                }
            }

            if (handler) {
                var command = handler(constituents, commands);
                if (!command) {
                    //something went wrong
                    throw "Parse exception - the handler failed to return a command";
                }
                commands.push(command);
            } else {
                //something went wrong
                throw "Parse exception - no handler was found";
            }
        }

        return commands;
    };

    ns.calculatePathStringAtDistance = function (parts, totalLength) {
        var path = "";
        
        for (var i = 0; i < parts.length; i++) {
            if (totalLength > 0) {
                var pathString = parts[i].getPathAtLength(totalLength);
                totalLength -= parts[i].length;

                path += " " + pathString;
            } else {
                return path;
            }
        }

        return path;
    };

})(window.svgPathAnimator = window.svgPathAnimator || {});
