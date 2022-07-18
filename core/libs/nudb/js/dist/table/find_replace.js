"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[63],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 69:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * Unbind all event handlers before tearing down a page
 */

window.AJAX.registerTeardown('table/find_replace.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#find_replace_form').off('submit');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#toggle_find').off('click');
});
/**
 * Bind events
 */

window.AJAX.registerOnload('table/find_replace.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('<div id="toggle_find_div"><a id="toggle_find"></a></div>').insertAfter('#find_replace_form').hide();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#toggle_find').html(window.Messages.strHideFindNReplaceCriteria).on('click', function () {
    var $link = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#find_replace_form').slideToggle();

    if ($link.text() === window.Messages.strHideFindNReplaceCriteria) {
      $link.text(window.Messages.strShowFindNReplaceCriteria);
    } else {
      $link.text(window.Messages.strHideFindNReplaceCriteria);
    }

    return false;
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#find_replace_form').on('submit', function (e) {
    e.preventDefault();
    var findReplaceForm = jquery__WEBPACK_IMPORTED_MODULE_0__('#find_replace_form');
    Functions.prepareForAjaxRequest(findReplaceForm);
    var $msgbox = Functions.ajaxShowMessage();
    jquery__WEBPACK_IMPORTED_MODULE_0__.post(findReplaceForm.attr('action'), findReplaceForm.serialize(), function (data) {
      Functions.ajaxRemoveMessage($msgbox);

      if (data.success === true) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#toggle_find_div').show();
        jquery__WEBPACK_IMPORTED_MODULE_0__('#toggle_find').trigger('click');
        jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlqueryresultsouter').html(data.preview);
      } else {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlqueryresultsouter').html(data.error);
      }
    });
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(69));
/******/ }
]);
//# sourceMappingURL=find_replace.js.map