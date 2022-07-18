"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[74],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 80:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * SQL syntax highlighting transformation plugin js
 *
 * @package PhpMyAdmin
 */

window.AJAX.registerOnload('transformations/sql_editor.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('textarea.transform_sql_editor').each(function () {
    Functions.getSqlEditor(jquery__WEBPACK_IMPORTED_MODULE_0__(this), {}, 'both');
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(80));
/******/ }
]);
//# sourceMappingURL=sql_editor.js.map