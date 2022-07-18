"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[28],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 32:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

window.AJAX.registerOnload('export_output.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('keydown', function (e) {
    if ((e.which || e.keyCode) === 116) {
      e.preventDefault();
      jquery__WEBPACK_IMPORTED_MODULE_0__('#export_refresh_form').trigger('submit');
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('.export_refresh_btn').on('click', function (e) {
    e.preventDefault();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#export_refresh_form').trigger('submit');
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(32));
/******/ }
]);
//# sourceMappingURL=export_output.js.map