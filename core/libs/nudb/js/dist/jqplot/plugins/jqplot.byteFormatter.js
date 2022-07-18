"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[34],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 41:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * jqplot formatter for byte values
 *
 * @package phpMyAdmin
 */

(function ($) {
  'use strict';

  var formatByte = function (value, index) {
    var val = value;
    var i = index;
    var units = [window.Messages.strB, window.Messages.strKiB, window.Messages.strMiB, window.Messages.strGiB, window.Messages.strTiB, window.Messages.strPiB, window.Messages.strEiB];

    while (val >= 1024 && i <= 6) {
      val /= 1024;
      i++;
    }

    var format = '%.1f';

    if (Math.floor(val) === val) {
      format = '%.0f';
    }

    return $.jqplot.sprintf(format + ' ' + units[i], val);
  };
  /**
   * The index indicates what unit the incoming data will be in.
   * 0 for bytes, 1 for kilobytes and so on...
   *
   * @param index
   *
   * @return {String}
   */


  $.jqplot.byteFormatter = function (index) {
    var i = index || 0;
    return function (format, value) {
      var val = value;

      if (typeof val === 'number') {
        val = parseFloat(val) || 0;
        return formatByte(val, i);
      } else {
        return String(val);
      }
    };
  };
})(jquery__WEBPACK_IMPORTED_MODULE_0__);

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(41));
/******/ }
]);
//# sourceMappingURL=jqplot.byteFormatter.js.map