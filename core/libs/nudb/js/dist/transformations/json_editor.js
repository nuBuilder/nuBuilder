"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[73],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 79:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * JSON syntax highlighting transformation plugin
 *
 * @package PhpMyAdmin
 */

window.AJAX.registerOnload('transformations/json_editor.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('textarea.transform_json_editor').each(function () {
    window.CodeMirror.fromTextArea(this, {
      lineNumbers: true,
      matchBrackets: true,
      indentUnit: 4,
      mode: 'application/json',
      lineWrapping: true
    });
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(79));
/******/ }
]);
//# sourceMappingURL=json_editor.js.map