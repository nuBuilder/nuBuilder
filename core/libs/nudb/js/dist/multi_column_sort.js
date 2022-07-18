"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[40],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 47:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview    Implements the shiftkey + click remove column
 *                  from order by clause functionality
 * @name            columndelete
 *
 * @requires    jQuery
 */

window.AJAX.registerOnload('keyhandler.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('th.draggable.column_heading.pointer.marker a').on('click', function (event) {
    var orderUrlRemove = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().find('input[name="url-remove-order"]').val();
    var orderUrlAdd = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().find('input[name="url-add-order"]').val();
    var argsep = window.CommonParams.get('arg_separator');

    if (event.ctrlKey || event.altKey) {
      event.preventDefault();
      window.AJAX.source = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
      Functions.ajaxShowMessage();
      orderUrlRemove += argsep + 'ajax_request=true' + argsep + 'ajax_page_request=true';
      jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/sql', orderUrlRemove, window.AJAX.responseHandler);
    } else if (event.shiftKey) {
      event.preventDefault();
      window.AJAX.source = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
      Functions.ajaxShowMessage();
      orderUrlAdd += argsep + 'ajax_request=true' + argsep + 'ajax_page_request=true';
      jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/sql', orderUrlAdd, window.AJAX.responseHandler);
    }
  });
});
window.AJAX.registerTeardown('keyhandler.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'th.draggable.column_heading.pointer.marker a');
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(47));
/******/ }
]);
//# sourceMappingURL=multi_column_sort.js.map