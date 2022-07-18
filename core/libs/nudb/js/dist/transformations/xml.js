"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[75],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 81:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * XML syntax highlighting transformation plugin
 */

window.AJAX.registerOnload('transformations/xml.js', function () {
  var $elm = jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content').find('code.xml');
  $elm.each(function () {
    var $json = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var $pre = $json.find('pre');
    /* We only care about visible elements to avoid double processing */

    if ($pre.is(':visible')) {
      var $highlight = jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="xml-highlight cm-s-default"></div>');
      $json.append($highlight);
      window.CodeMirror.runMode($json.text(), 'application/xml', $highlight[0]);
      $pre.hide();
    }
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(81));
/******/ }
]);
//# sourceMappingURL=xml.js.map