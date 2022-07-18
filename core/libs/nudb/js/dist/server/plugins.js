"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[48],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 54:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * Make columns sortable, but only for tables with more than 1 data row.
 */

function makeColumnsSortable() {
  var $tables = jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins_plugins table:has(tbody tr + tr)');
  $tables.tablesorter({
    sortList: [[0, 0]],
    headers: {
      1: {
        sorter: false
      }
    }
  });
  $tables.find('thead th').append('<div class="sorticon"></div>');
}

window.AJAX.registerOnload('server/plugins.js', function () {
  makeColumnsSortable();
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(54));
/******/ }
]);
//# sourceMappingURL=plugins.js.map