"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[76],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 82:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * XML editor plugin
 *
 * @package PhpMyAdmin
 */

window.AJAX.registerOnload('transformations/xml_editor.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('textarea.transform_xml_editor').each(function () {
    window.CodeMirror.fromTextArea(this, {
      lineNumbers: true,
      indentUnit: 4,
      mode: 'application/xml',
      lineWrapping: true
    });
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(82));
/******/ }
]);
//# sourceMappingURL=xml_editor.js.map