"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[44],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 51:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview    function used for page-related settings
 * @name            Page-related settings
 *
 * @requires    jQuery
 * @requires    jQueryUI
 * @required    js/functions.js
 */

function showSettings(selector) {
  // Keeping a clone to restore in case the user cancels the operation
  var $clone = jquery__WEBPACK_IMPORTED_MODULE_0__(selector + ' .page_settings').clone(true);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#pageSettingsModalApplyButton').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('.config-form').trigger('submit');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#pageSettingsModalCloseButton,#pageSettingsModalCancelButton').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(selector + ' .page_settings').replaceWith($clone);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pageSettingsModal').modal('hide');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#pageSettingsModal').modal('show');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#pageSettingsModal').find('.modal-body').first().html(jquery__WEBPACK_IMPORTED_MODULE_0__(selector));
  jquery__WEBPACK_IMPORTED_MODULE_0__(selector).css('display', 'block');
}

function showPageSettings() {
  showSettings('#page_settings_modal');
}

function showNaviSettings() {
  showSettings('#pma_navigation_settings');
}

window.PageSettings = {};

window.PageSettings.off = () => function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#page_settings_icon').css('display', 'none');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#page_settings_icon').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_settings_icon').off('click');
};

window.PageSettings.on = () => function () {
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#page_settings_modal').length) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#page_settings_icon').css('display', 'inline');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#page_settings_icon').on('click', showPageSettings);
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_settings_icon').on('click', showNaviSettings);
};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(51));
/******/ }
]);
//# sourceMappingURL=page_settings.js.map