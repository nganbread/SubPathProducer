(function(ns) {

    ns.setDistanceOfPath = function (element, percentage) {
        var $element = $(element);

        var dString = $element.data('d');
        var data = $element.data('svgCache');
        if (dString) {
            if (!data) {
                var pathParts = ns.parsePath(dString);
				
				var totalLength = 0;
				for(var i = 0; i < pathParts.length; i++){
					totalLength += pathParts[i].length;
				}

                data = {
                    totalLength: totalLength,
                    parts: pathParts,
                    cache: {}
                };

                $element.data('svgCache', data);
            }

            var key = percentage + "";
            if (!data.cache[key]) {
                var val = ns.calculatePathStringAtDistance(data.parts, percentage * data.totalLength);
                data.cache[key] = val;
            }

            $element.attr('d', data.cache[key]);
        }
    };
	
	ns.animate = function(element, start, end, duration, easing, callback){
		ns.setDistanceOfPath(element, start);
		
		ns.tween(start, end, duration, function(value){
			ns.setDistanceOfPath(element, value);
		},callback, easing);
	
	};

})(window.svgPathAnimator = window.svgPathAnimator || {});
