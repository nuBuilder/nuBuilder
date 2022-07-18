"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[30],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 35:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview    functions used in GIS data editor
 *
 * @requires    jQuery
 *
 */

/* global addZoomPanControllers, storeGisSvgRef, selectVisualization, styleOSM, zoomAndPan */
// js/table/gis_visualization.js

/* global themeImagePath */
// templates/javascript/variables.twig

window.gisEditorLoaded = false;
/**
 * Closes the GIS data editor and perform necessary clean up work.
 */

function closeGISEditor() {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#popup_background').fadeOut('fast');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#gis_editor').fadeOut('fast', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).empty();
  });
}
/**
 * Prepares the HTML received via AJAX.
 */


function prepareJSVersion() {
  // Change the text on the submit button
  jquery__WEBPACK_IMPORTED_MODULE_0__('#gis_editor').find('input[name=\'gis_data[save]\']').val(window.Messages.strCopy).insertAfter(jquery__WEBPACK_IMPORTED_MODULE_0__('#gis_data_textarea')).before('<br><br>'); // Add close and cancel links

  jquery__WEBPACK_IMPORTED_MODULE_0__('#gis_data_editor').prepend('<a class="close_gis_editor" href="#">' + window.Messages.strClose + '</a>');
  jquery__WEBPACK_IMPORTED_MODULE_0__('<a class="cancel_gis_editor" href="#"> ' + window.Messages.strCancel + '</a>').insertAfter(jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=\'gis_data[save]\']')); // Remove the unnecessary text

  jquery__WEBPACK_IMPORTED_MODULE_0__('div#gis_data_output p').remove(); // Remove 'add' buttons and add links

  jquery__WEBPACK_IMPORTED_MODULE_0__('#gis_editor').find('input.add').each(function () {
    var $button = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    $button.addClass('addJs').removeClass('add');
    var classes = $button.attr('class');
    $button.replaceWith('<a class="' + classes + '" name="' + $button.attr('name') + '" href="#">+ ' + $button.val() + '</a>');
  });
}
/**
 * Returns the HTML for a data point.
 *
 * @param {number} pointNumber point number
 * @param {string} prefix      prefix of the name
 * @return {string} the HTML for a data point
 */


function addDataPoint(pointNumber, prefix) {
  return '<br>' + Functions.sprintf(window.Messages.strPointN, pointNumber + 1) + ': ' + '<label for="x">' + window.Messages.strX + '</label>' + '<input type="text" name="' + prefix + '[' + pointNumber + '][x]" value="">' + '<label for="y">' + window.Messages.strY + '</label>' + '<input type="text" name="' + prefix + '[' + pointNumber + '][y]" value="">';
}
/**
 * Initialize the visualization in the GIS data editor.
 */


function initGISEditorVisualization() {
  storeGisSvgRef(); // Loads either SVG or OSM visualization based on the choice

  selectVisualization(); // Adds necessary styles to the div that contains the openStreetMap

  styleOSM(); // Adds controllers for zooming and panning

  addZoomPanControllers();
  zoomAndPan();
}
/**
 * Loads JavaScript files and the GIS editor.
 *
 * @param value      current value of the geometry field
 * @param field      field name
 * @param type       geometry type
 * @param inputName name of the input field
 * @param token      token
 */


function loadJSAndGISEditor(value, field, type, inputName) {
  var head = document.getElementsByTagName('head')[0];
  var script;
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'js/dist/table/gis_visualization.js';
  head.appendChild(script); // OpenLayers.js is BIG and takes time. So asynchronous loading would not work.
  // Load the JS and do a callback to load the content for the GIS Editor.

  script = document.createElement('script');
  script.type = 'text/javascript';

  script.onreadystatechange = function () {
    if (this.readyState === 'complete') {
      loadGISEditor(value, field, type, inputName);
    }
  };

  script.onload = function () {
    loadGISEditor(value, field, type, inputName);
  };

  script.onerror = function () {
    loadGISEditor(value, field, type, inputName);
  };

  script.src = 'js/vendor/openlayers/OpenLayers.js';
  head.appendChild(script);
  window.gisEditorLoaded = true;
}

window.loadJSAndGISEditor = loadJSAndGISEditor;
/**
 * Loads the GIS editor via AJAX
 *
 * @param value      current value of the geometry field
 * @param field      field name
 * @param type       geometry type
 * @param inputName name of the input field
 */

function loadGISEditor(value, field, type, inputName) {
  var $gisEditor = jquery__WEBPACK_IMPORTED_MODULE_0__('#gis_editor');
  jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/gis-data-editor', {
    'field': field,
    'value': value,
    'type': type,
    'input_name': inputName,
    'get_gis_editor': true,
    'ajax_request': true,
    'server': window.CommonParams.get('server')
  }, function (data) {
    if (typeof data !== 'undefined' && data.success === true) {
      $gisEditor.html(data.gis_editor);
      initGISEditorVisualization();
      prepareJSVersion();
    } else {
      Functions.ajaxShowMessage(data.error, false);
    }
  }, 'json');
}

window.loadGISEditor = loadGISEditor;
/**
 * Opens up the dialog for the GIS data editor.
 */

function openGISEditor() {
  // Center the popup
  var windowWidth = document.documentElement.clientWidth;
  var windowHeight = document.documentElement.clientHeight;
  var popupWidth = windowWidth * 0.9;
  var popupHeight = windowHeight * 0.9;
  var popupOffsetTop = windowHeight / 2 - popupHeight / 2;
  var popupOffsetLeft = windowWidth / 2 - popupWidth / 2;
  var $gisEditor = jquery__WEBPACK_IMPORTED_MODULE_0__('#gis_editor');
  var $background = jquery__WEBPACK_IMPORTED_MODULE_0__('#popup_background');
  $gisEditor.css({
    'top': popupOffsetTop,
    'left': popupOffsetLeft,
    'width': popupWidth,
    'height': popupHeight
  });
  $background.css({
    'opacity': '0.7'
  });
  $gisEditor.append('<div id="gis_data_editor">' + '<img class="ajaxIcon" id="loadingMonitorIcon" src="' + themeImagePath + 'ajax_clock_small.gif" alt="">' + '</div>'); // Make it appear

  $background.fadeIn('fast');
  $gisEditor.fadeIn('fast');
}

window.openGISEditor = openGISEditor;
/**
 * Prepare and insert the GIS data in Well Known Text format
 * to the input field.
 */

function insertDataAndClose() {
  var $form = jquery__WEBPACK_IMPORTED_MODULE_0__('form#gis_data_editor_form');
  var inputName = $form.find('input[name=\'input_name\']').val();
  var argsep = window.CommonParams.get('arg_separator');
  jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/gis-data-editor', $form.serialize() + argsep + 'generate=true' + argsep + 'ajax_request=true', function (data) {
    if (typeof data !== 'undefined' && data.success === true) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=\'' + inputName + '\']').val(data.result);
    } else {
      Functions.ajaxShowMessage(data.error, false);
    }
  }, 'json');
  closeGISEditor();
}
/**
 * Unbind all event handlers before tearing down a page
 */


window.AJAX.registerTeardown('gis_data_editor.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#gis_editor input[name=\'gis_data[save]\']');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', '#gis_editor');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', '#gis_editor input[type=\'text\']');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', '#gis_editor select.gis_type');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#gis_editor a.close_gis_editor, #gis_editor a.cancel_gis_editor');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#gis_editor a.addJs.addPoint');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#gis_editor a.addLine.addJs');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#gis_editor a.addJs.addPolygon');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#gis_editor a.addJs.addGeom');
});
window.AJAX.registerOnload('gis_data_editor.js', function () {
  /**
   * Prepares and insert the GIS data to the input field on clicking 'copy'.
   */
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#gis_editor input[name=\'gis_data[save]\']', function (event) {
    event.preventDefault();
    insertDataAndClose();
  });
  /**
   * Prepares and insert the GIS data to the input field on pressing 'enter'.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '#gis_editor', function (event) {
    event.preventDefault();
    insertDataAndClose();
  });
  /**
   * Trigger asynchronous calls on data change and update the output.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '#gis_editor input[type=\'text\']', function () {
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__('form#gis_data_editor_form');
    var argsep = window.CommonParams.get('arg_separator');
    jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/gis-data-editor', $form.serialize() + argsep + 'generate=true' + argsep + 'ajax_request=true', function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#gis_data_textarea').val(data.result);
        jquery__WEBPACK_IMPORTED_MODULE_0__('#placeholder').empty().removeClass('hasSVG').html(data.visualization);
        jquery__WEBPACK_IMPORTED_MODULE_0__('#openlayersmap').empty();
        /* TODO: the gis_data_editor should rather return JSON than JS code to eval */
        // eslint-disable-next-line no-eval

        eval(data.openLayers);
        initGISEditorVisualization();
      } else {
        Functions.ajaxShowMessage(data.error, false);
      }
    }, 'json');
  });
  /**
   * Update the form on change of the GIS type.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '#gis_editor select.gis_type', function () {
    var $gisEditor = jquery__WEBPACK_IMPORTED_MODULE_0__('#gis_editor');
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__('form#gis_data_editor_form');
    var argsep = window.CommonParams.get('arg_separator');
    jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/gis-data-editor', $form.serialize() + argsep + 'get_gis_editor=true' + argsep + 'ajax_request=true', function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        $gisEditor.html(data.gis_editor);
        initGISEditorVisualization();
        prepareJSVersion();
      } else {
        Functions.ajaxShowMessage(data.error, false);
      }
    }, 'json');
  });
  /**
   * Handles closing of the GIS data editor.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#gis_editor a.close_gis_editor, #gis_editor a.cancel_gis_editor', function () {
    closeGISEditor();
  });
  /**
   * Handles adding data points
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#gis_editor a.addJs.addPoint', function () {
    var $a = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var name = $a.attr('name'); // Eg. name = gis_data[0][MULTIPOINT][add_point] => prefix = gis_data[0][MULTIPOINT]

    var prefix = name.substring(0, name.length - 11); // Find the number of points

    var $noOfPointsInput = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=\'' + prefix + '[no_of_points]' + '\']');
    var noOfPoints = parseInt($noOfPointsInput.val(), 10); // Add the new data point

    var html = addDataPoint(noOfPoints, prefix);
    $a.before(html);
    $noOfPointsInput.val(noOfPoints + 1);
  });
  /**
   * Handles adding linestrings and inner rings
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#gis_editor a.addLine.addJs', function () {
    var $a = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var name = $a.attr('name'); // Eg. name = gis_data[0][MULTILINESTRING][add_line] => prefix = gis_data[0][MULTILINESTRING]

    var prefix = name.substring(0, name.length - 10);
    var type = prefix.slice(prefix.lastIndexOf('[') + 1, prefix.lastIndexOf(']')); // Find the number of lines

    var $noOfLinesInput = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=\'' + prefix + '[no_of_lines]' + '\']');
    var noOfLines = parseInt($noOfLinesInput.val(), 10); // Add the new linesting of inner ring based on the type

    var html = '<br>';
    var noOfPoints;

    if (type === 'MULTILINESTRING') {
      html += window.Messages.strLineString + ' ' + (noOfLines + 1) + ':';
      noOfPoints = 2;
    } else {
      html += window.Messages.strInnerRing + ' ' + noOfLines + ':';
      noOfPoints = 4;
    }

    html += '<input type="hidden" name="' + prefix + '[' + noOfLines + '][no_of_points]" value="' + noOfPoints + '">';

    for (var i = 0; i < noOfPoints; i++) {
      html += addDataPoint(i, prefix + '[' + noOfLines + ']');
    }

    html += '<a class="addPoint addJs" name="' + prefix + '[' + noOfLines + '][add_point]" href="#">+ ' + window.Messages.strAddPoint + '</a><br>';
    $a.before(html);
    $noOfLinesInput.val(noOfLines + 1);
  });
  /**
   * Handles adding polygons
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#gis_editor a.addJs.addPolygon', function () {
    var $a = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var name = $a.attr('name'); // Eg. name = gis_data[0][MULTIPOLYGON][add_polygon] => prefix = gis_data[0][MULTIPOLYGON]

    var prefix = name.substring(0, name.length - 13); // Find the number of polygons

    var $noOfPolygonsInput = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=\'' + prefix + '[no_of_polygons]' + '\']');
    var noOfPolygons = parseInt($noOfPolygonsInput.val(), 10); // Add the new polygon

    var html = window.Messages.strPolygon + ' ' + (noOfPolygons + 1) + ':<br>';
    html += '<input type="hidden" name="' + prefix + '[' + noOfPolygons + '][no_of_lines]" value="1">' + '<br>' + window.Messages.strOuterRing + ':' + '<input type="hidden" name="' + prefix + '[' + noOfPolygons + '][0][no_of_points]" value="4">';

    for (var i = 0; i < 4; i++) {
      html += addDataPoint(i, prefix + '[' + noOfPolygons + '][0]');
    }

    html += '<a class="addPoint addJs" name="' + prefix + '[' + noOfPolygons + '][0][add_point]" href="#">+ ' + window.Messages.strAddPoint + '</a><br>' + '<a class="addLine addJs" name="' + prefix + '[' + noOfPolygons + '][add_line]" href="#">+ ' + window.Messages.strAddInnerRing + '</a><br><br>';
    $a.before(html);
    $noOfPolygonsInput.val(noOfPolygons + 1);
  });
  /**
   * Handles adding geoms
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#gis_editor a.addJs.addGeom', function () {
    var $a = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var prefix = 'gis_data[GEOMETRYCOLLECTION]'; // Find the number of geoms

    var $noOfGeomsInput = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=\'' + prefix + '[geom_count]' + '\']');
    var noOfGeoms = parseInt($noOfGeomsInput.val(), 10);
    var html1 = window.Messages.strGeometry + ' ' + (noOfGeoms + 1) + ':<br>';
    var $geomType = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name=\'gis_data[' + (noOfGeoms - 1) + '][gis_type]\']').clone();
    $geomType.attr('name', 'gis_data[' + noOfGeoms + '][gis_type]').val('POINT');
    var html2 = '<br>' + window.Messages.strPoint + ' :' + '<label for="x"> ' + window.Messages.strX + ' </label>' + '<input type="text" name="gis_data[' + noOfGeoms + '][POINT][x]" value="">' + '<label for="y"> ' + window.Messages.strY + ' </label>' + '<input type="text" name="gis_data[' + noOfGeoms + '][POINT][y]" value="">' + '<br><br>';
    $a.before(html1);
    $geomType.insertBefore($a);
    $a.before(html2);
    $noOfGeomsInput.val(noOfGeoms + 1);
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(35));
/******/ }
]);
//# sourceMappingURL=gis_data_editor.js.map