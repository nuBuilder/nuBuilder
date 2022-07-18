"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[52],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 58:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview    Javascript functions used in server status query page
 * @name            Server Status Query
 *
 * @requires    jQuery
 * @requires    jQueryUI
 * @requires    js/functions.js
 */

/* global initTableSorter */
// js/server/status/sorter.js

/**
 * Unbind all event handlers before tearing down a page
 */

window.AJAX.registerTeardown('server/status/queries.js', function () {
  if (document.getElementById('serverstatusquerieschart') !== null) {
    var queryPieChart = jquery__WEBPACK_IMPORTED_MODULE_0__('#serverstatusquerieschart').data('queryPieChart');

    if (queryPieChart) {
      queryPieChart.destroy();
    }
  }
});
window.AJAX.registerOnload('server/status/queries.js', function () {
  // Build query statistics chart
  var cdata = [];

  try {
    if (document.getElementById('serverstatusquerieschart') !== null) {
      jquery__WEBPACK_IMPORTED_MODULE_0__.each(jquery__WEBPACK_IMPORTED_MODULE_0__('#serverstatusquerieschart').data('chart'), function (key, value) {
        cdata.push([key, parseInt(value, 10)]);
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#serverstatusquerieschart').data('queryPieChart', Functions.createProfilingChart('serverstatusquerieschart', cdata));
    }
  } catch (exception) {// Could not load chart, no big deal...
  }

  initTableSorter('statustabs_queries');
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(58));
/******/ }
]);
//# sourceMappingURL=queries.js.map