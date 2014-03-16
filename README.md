PathProducer
===============

A small library that generates SVG sub-paths.

Dependencies
===============

PathProducer has a weak dependency on jQuery which will be removed upon further development.

Usage
==============


To use PathProducer simply define the path data of an SVG <Path> element in a `data-d` attribute instead of the regular `d`. 


    
      <svg>
        <path id="myPath" data-d="M0,0 L100,100" />
      </svg>



Call `pathProducer.set($pathElement, percentage)` to instruct PathProducer to calculate the path data for a path that represents the `data-d` path data at the given percentage. The calculated path data string will then be inject into the elements `d` element to be represented on the DOM. If we were to inspect the path element after calling `set()`, we would see the following:

      <svg>
        <path id="myPath" data-d="M0,0 L100,100" d="M0,0 L50,50"/>
      </svg>
      
Notice how the `d` attribute looks like regular SVG path data, but simply represents half of the data provided in `data-d`. This flexibility allows us to make use of all of the features of the `<path>` tag, as outlined in the SVG specification by w3.


`pathProducer.animate($pathElement, startPercentage, endPercentage, duration, easing, callback)` calls a tweening function to animate between the provided percentages. Under the hood, `animate` calls on `set`

Examples and More Information
============
Hit the below link to see an example of the `animate()` function being used to progressively draw a thick dashed line with a fluid looking `marker`. 

http://buildwithco.de/Blog/2014/03/13/TrueSvgLineAnimation
