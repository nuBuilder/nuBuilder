"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[6],{

/***/ 10:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/**
 * Conditionally included if framing is not allowed.
 * @return {void}
 */
window.crossFramingProtection = () => {
  if (window.allowThirdPartyFraming) {
    return;
  }

  if (window.self !== window.top) {
    window.top.location = window.self.location;
    return;
  }

  const styleElement = document.getElementById('cfs-style'); // check if styleElement has already been removed to avoid frequently reported js error

  if (typeof styleElement === 'undefined' || styleElement === null) {
    return;
  }

  styleElement.parentNode.removeChild(styleElement);
};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(10));
/******/ }
]);
//# sourceMappingURL=cross_framing_protection.js.map