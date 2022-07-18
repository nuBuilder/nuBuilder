"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[37],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 44:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/* global Indexes */

/* global Navigation */

window.AJAX.registerOnload('functions.js', () => window.AJAX.removeSubmitEvents());
jquery__WEBPACK_IMPORTED_MODULE_0__(window.AJAX.loadEventHandler());
/**
 * Attach a generic event handler to clicks on pages and submissions of forms.
 */

jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a', window.AJAX.requestHandler);
jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', 'form', window.AJAX.requestHandler);
jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('ajaxError', window.AJAX.getFatalErrorHandler());
window.AJAX.registerTeardown('keyhandler.js', window.KeyHandlerEvents.off());
window.AJAX.registerOnload('keyhandler.js', window.KeyHandlerEvents.on());
window.crossFramingProtection();
window.AJAX.registerTeardown('config.js', window.Config.off());
window.AJAX.registerOnload('config.js', window.Config.on());
jquery__WEBPACK_IMPORTED_MODULE_0__.ajaxPrefilter(Functions.addNoCacheToAjaxRequests());
window.AJAX.registerTeardown('functions.js', Functions.off());
window.AJAX.registerOnload('functions.js', Functions.on());
jquery__WEBPACK_IMPORTED_MODULE_0__(Functions.dismissNotifications());
jquery__WEBPACK_IMPORTED_MODULE_0__(Functions.initializeMenuResizer());
jquery__WEBPACK_IMPORTED_MODULE_0__(Functions.floatingMenuBar());
jquery__WEBPACK_IMPORTED_MODULE_0__(Functions.breadcrumbScrollToTop());
jquery__WEBPACK_IMPORTED_MODULE_0__(Navigation.onload());
window.AJAX.registerTeardown('indexes.js', Indexes.off());
window.AJAX.registerOnload('indexes.js', Indexes.on());
jquery__WEBPACK_IMPORTED_MODULE_0__(() => Functions.checkNumberOfFields());
window.AJAX.registerTeardown('page_settings.js', window.PageSettings.off());
window.AJAX.registerOnload('page_settings.js', window.PageSettings.on());

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(44));
/******/ }
]);
//# sourceMappingURL=main.js.map