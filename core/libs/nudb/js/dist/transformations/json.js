"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[72],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 78:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * JSON syntax highlighting transformation plugin
 */

window.AJAX.registerOnload('transformations/json.js', function () {
  var $elm = jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content').find('code.json');
  $elm.each(function () {
    var $json = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var $pre = $json.find('pre');
    /* We only care about visible elements to avoid double processing */

    if ($pre.is(':visible')) {
      var $highlight = jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="json-highlight cm-s-default"></div>');
      $json.append($highlight);
      window.CodeMirror.runMode($json.text(), 'application/json', $highlight[0]);
      $pre.hide();
    }
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(78));
/******/ }
]);
//# sourceMappingURL=json.js.map