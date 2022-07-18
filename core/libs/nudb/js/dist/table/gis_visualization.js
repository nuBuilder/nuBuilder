"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[64],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 70:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview    functions used for visualizing GIS data
 *
 * @requires    jquery
 */

/* global drawOpenLayers */
// templates/table/gis_visualization/gis_visualization.twig
// Constants

var zoomFactor = 1.5;
var defaultX = 0;
var defaultY = 0;
var defaultScale = 1; // Variables

var x = defaultX;
var y = defaultY;
var scale = defaultScale;
/** @type {SVGElement|undefined} */

var gisSvg;
/** @type {ol.Map|undefined} */

var map;
/**
 * Zooms and pans the visualization.
 */

function zoomAndPan() {
  var g = gisSvg.getElementById('groupPanel');

  if (!g) {
    return;
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__('#groupPanel', gisSvg).attr('transform', 'translate(' + x + ', ' + y + ') scale(' + scale + ')');
  jquery__WEBPACK_IMPORTED_MODULE_0__('circle.vector', gisSvg).attr('r', 3 / scale);
  jquery__WEBPACK_IMPORTED_MODULE_0__('circle.vector', gisSvg).attr('stroke-width', 2 / scale);
  jquery__WEBPACK_IMPORTED_MODULE_0__('polyline.vector', gisSvg).attr('stroke-width', 2 / scale);
  jquery__WEBPACK_IMPORTED_MODULE_0__('path.vector', gisSvg).attr('stroke-width', 0.5 / scale);
}

window.zoomAndPan = zoomAndPan;
/**
 * Initially loads either SVG or OSM visualization based on the choice.
 */

function selectVisualization() {
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#choice').prop('checked') !== true) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#openlayersmap').hide();
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder').hide();
  }
}

window.selectVisualization = selectVisualization;
/**
 * Adds necessary styles to the div that contains the openStreetMap.
 */

function styleOSM() {
  var $placeholder = jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder');
  var cssObj = {
    'border': '1px solid #aaa',
    'width': $placeholder.width(),
    'height': $placeholder.height(),
    'float': 'right'
  };
  jquery__WEBPACK_IMPORTED_MODULE_0__('#openlayersmap').css(cssObj);
}

window.styleOSM = styleOSM;
/**
 * Store a reference to the gis svg element.
 */

function storeGisSvgRef() {
  gisSvg = jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder').find('svg').get(0);
}

window.storeGisSvgRef = storeGisSvgRef;
/**
 * Adds controls for zooming and panning.
 */

function addZoomPanControllers() {
  if (!gisSvg) {
    return;
  }

  var themeImagePath = jquery__WEBPACK_IMPORTED_MODULE_0__('#themeImagePath').val();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder').append( // pan arrows
  '<img class="button" id="left_arrow" src="' + themeImagePath + 'west-mini.png">', '<img class="button" id="right_arrow" src="' + themeImagePath + 'east-mini.png">', '<img class="button" id="up_arrow" src="' + themeImagePath + 'north-mini.png">', '<img class="button" id="down_arrow" src="' + themeImagePath + 'south-mini.png">', // zoom controls
  '<img class="button" id="zoom_in" src="' + themeImagePath + 'zoom-plus-mini.png">', '<img class="button" id="zoom_world" src="' + themeImagePath + 'zoom-world-mini.png">', '<img class="button" id="zoom_out" src="' + themeImagePath + 'zoom-minus-mini.png">');
}

window.addZoomPanControllers = addZoomPanControllers;
/**
 * Resizes the GIS visualization to fit into the space available.
 */

function resizeGISVisualization() {
  var $placeholder = jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder');
  var oldWidth = $placeholder.width();
  var visWidth = jquery__WEBPACK_IMPORTED_MODULE_0__('#div_view_options').width() - 48; // Assign new value for width

  $placeholder.width(visWidth);
  jquery__WEBPACK_IMPORTED_MODULE_0__(gisSvg).attr('width', visWidth); // Assign the offset created due to resizing to defaultX and center the svg.

  defaultX = (visWidth - oldWidth) / 2;
  x = defaultX;
  y = defaultY;
  scale = defaultScale;
}
/**
 * Initialize the GIS visualization.
 */


function initGISVisualization() {
  storeGisSvgRef(); // Loads either SVG or OSM visualization based on the choice

  selectVisualization(); // Resizes the GIS visualization to fit into the space available

  resizeGISVisualization();

  if (typeof ol !== 'undefined') {
    // Adds necessary styles to the div that contains the openStreetMap
    styleOSM();
  } // Adds controllers for zooming and panning


  addZoomPanControllers();
  zoomAndPan();
}

function drawOpenLayerMap() {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder').hide();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#openlayersmap').show(); // Function doesn't work properly if #openlayersmap is hidden

  if (typeof map !== 'object') {
    // Draws openStreetMap with openLayers
    map = drawOpenLayers();
  }
}

function getRelativeCoords(e) {
  var position = jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder').offset();
  return {
    x: e.pageX - position.left,
    y: e.pageY - position.top
  };
}
/**
 * @param {WheelEvent} event
 */


function onGisMouseWheel(event) {
  if (event.deltaY === 0) {
    return;
  }

  event.preventDefault();
  var relCoords = getRelativeCoords(event);
  var factor = event.deltaY > 0 ? zoomFactor : 1 / zoomFactor; // zoom

  scale *= factor; // zooming keeping the position under mouse pointer unmoved.

  x = relCoords.x - (relCoords.x - x) * factor;
  y = relCoords.y - (relCoords.y - y) * factor;
  zoomAndPan();
}
/**
 * Ajax handlers for GIS visualization page
 *
 * Actions Ajaxified here:
 *
 * Zooming in and zooming out on mouse wheel movement.
 * Panning the visualization on dragging.
 * Zooming in on double clicking.
 * Zooming out on clicking the zoom out button.
 * Panning on clicking the arrow buttons.
 * Displaying tooltips for GIS objects.
 */

/**
 * Unbind all event handlers before tearing down a page
 */


window.AJAX.registerTeardown('table/gis_visualization.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#choice');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('dragstart', 'svg');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('mouseup', 'svg');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('drag', 'svg');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('dblclick', '#placeholder');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#zoom_in');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#zoom_world');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#zoom_out');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#left_arrow');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#right_arrow');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#up_arrow');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#down_arrow');
  jquery__WEBPACK_IMPORTED_MODULE_0__('.vector').off('mousemove').off('mouseout');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder').get(0).removeEventListener('wheel', onGisMouseWheel, {
    passive: false
  });

  if (map) {
    // Removes ol.Map's resize listener from window
    map.setTarget(null);
    map = undefined;
  }
});
window.AJAX.registerOnload('table/gis_visualization.js', function () {
  // If we are in GIS visualization, initialize it
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#gis_div').length > 0) {
    initGISVisualization();
  }

  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#choice').prop('checked') === true) {
    drawOpenLayerMap();
  }

  if (typeof ol === 'undefined') {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#choice, #labelChoice').hide();
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#choice', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).prop('checked') === false) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder').show();
      jquery__WEBPACK_IMPORTED_MODULE_0__('#openlayersmap').hide();
    } else {
      drawOpenLayerMap();
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder').get(0).addEventListener('wheel', onGisMouseWheel, {
    passive: false
  });
  var dragX = 0;
  var dragY = 0;
  jquery__WEBPACK_IMPORTED_MODULE_0__('svg').draggable({
    helper: function () {
      return jquery__WEBPACK_IMPORTED_MODULE_0__('<div>'); // Give a fake element to be used for dragging display
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('dragstart', 'svg', function (event, dd) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder').addClass('placeholderDrag');
    dragX = Math.round(dd.offset.left);
    dragY = Math.round(dd.offset.top);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mouseup', 'svg', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder').removeClass('placeholderDrag');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('drag', 'svg', function (event, dd) {
    var newX = Math.round(dd.offset.left);
    x += newX - dragX;
    dragX = newX;
    var newY = Math.round(dd.offset.top);
    y += newY - dragY;
    dragY = newY;
    zoomAndPan();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('dblclick', '#placeholder', function (event) {
    if (event.target.classList.contains('button')) {
      return;
    }

    scale *= zoomFactor; // zooming in keeping the position under mouse pointer unmoved.

    var relCoords = getRelativeCoords(event);
    x = relCoords.x - (relCoords.x - x) * zoomFactor;
    y = relCoords.y - (relCoords.y - y) * zoomFactor;
    zoomAndPan();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#zoom_in', function (e) {
    e.preventDefault(); // zoom in

    scale *= zoomFactor;
    var width = jquery__WEBPACK_IMPORTED_MODULE_0__(gisSvg).attr('width');
    var height = jquery__WEBPACK_IMPORTED_MODULE_0__(gisSvg).attr('height'); // zooming in keeping the center unmoved.

    x = width / 2 - (width / 2 - x) * zoomFactor;
    y = height / 2 - (height / 2 - y) * zoomFactor;
    zoomAndPan();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#zoom_world', function (e) {
    e.preventDefault();
    scale = 1;
    x = defaultX;
    y = defaultY;
    zoomAndPan();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#zoom_out', function (e) {
    e.preventDefault(); // zoom out

    scale /= zoomFactor;
    var width = jquery__WEBPACK_IMPORTED_MODULE_0__(gisSvg).attr('width');
    var height = jquery__WEBPACK_IMPORTED_MODULE_0__(gisSvg).attr('height'); // zooming out keeping the center unmoved.

    x = width / 2 - (width / 2 - x) / zoomFactor;
    y = height / 2 - (height / 2 - y) / zoomFactor;
    zoomAndPan();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#left_arrow', function (e) {
    e.preventDefault();
    x += 100;
    zoomAndPan();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#right_arrow', function (e) {
    e.preventDefault();
    x -= 100;
    zoomAndPan();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#up_arrow', function (e) {
    e.preventDefault();
    y += 100;
    zoomAndPan();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#down_arrow', function (e) {
    e.preventDefault();
    y -= 100;
    zoomAndPan();
  });
  /**
   * Detect the mousemove event and show tooltips.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('.vector').on('mousemove', function (event) {
    var contents = Functions.escapeHtml(jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('name')).trim();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#tooltip').remove();

    if (contents !== '') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('<div id="tooltip">' + contents + '</div>').css({
        position: 'absolute',
        top: event.pageY + 10,
        left: event.pageX + 10,
        border: '1px solid #fdd',
        padding: '2px',
        'background-color': '#fee',
        opacity: 0.90
      }).appendTo('body').fadeIn(200);
    }
  });
  /**
   * Detect the mouseout event and hide tooltips.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('.vector').on('mouseout', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#tooltip').remove();
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(70));
/******/ }
]);
//# sourceMappingURL=gis_visualization.js.map