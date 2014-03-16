PathProducer
===============

A small library that generates SVG sub-paths.

[http://buildwithco.de/Blog/2014/03/13/TrueSvgLineAnimation](http://buildwithco.de/Blog/2014/03/13/TrueSvgLineAnimation)


Why?
==============

Almost all techniques used to progressively draw an SVG path make use of the `stroke-dashoffset` or `stroke-dasharray`. The method doesn't progressively *draw* the path, but progressively *shows* it. Coupled with the non-conventional use of the dash properties; **several limitations become apparent**:

* Dashed lines that behave as if theyre being drawn on the screen
* Markers that follow the tip of the line being drawn
* Line Caps that are visible while the path is being drawn
* Stroke and Fill effects that have a dependency on the length of the line (eg, gradients)

PathProducer gets around these problems by drawing sub-path instead of just hiding a portion of it. PathProducer can quickly generate SVG path data that represents the required path, allowing the SVG Path specification to be used as it should be, in it's complete entirety.


Dependencies
===============

PathProducer has a weak dependency on jQuery which will be removed upon further development.

Usage
==============


To use PathProducer simply define the path data of an SVG <Path> element in a `data-d` attribute instead of the regular `d`. 


    
      <svg>
        <path id="myPath" data-d="M0,0 L100,100" />
      </svg>



Call `pathProducer.set($pathElement, percentage)` to instruct PathProducer to calculate the path data for a path that represents the `data-d` path data at the given percentage. The calculated path data string will then be injected into the elements `d` attribute to be presented on the DOM. 

      pathParser.set($("#myPath), 0.5);

If we were to inspect the element after calling `set()`, we would see the following:

      <svg>
        <path id="myPath" data-d="M0,0 L100,100" d="M0,0 L50,50"/>
      </svg>
      
Notice how the `d` attribute looks like regular SVG path data, but simply represents half of the data provided in `data-d`. This flexibility allows us to make use of all of the features of the `<path>` tag, as outlined in the SVG specification by w3.


`pathProducer.animate($pathElement, startPercentage, endPercentage, duration, easing, callback)` calls a tweening function to animate between the provided percentages. Under the hood, `animate()` calls `set()`

Examples and More Information
============
Hit the below link to see an example of the `animate()` function being used to progressively draw a dashed line with a fluid looking `marker`. 

[http://buildwithco.de/Blog/2014/03/13/TrueSvgLineAnimation](http://buildwithco.de/Blog/2014/03/13/TrueSvgLineAnimation)
