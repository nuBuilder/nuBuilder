"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[55],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 61:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview    Javascript functions used in server user groups page
 * @name            Server User Groups
 *
 * @requires    jQuery
 */

/**
 * Unbind all event handlers before tearing down a page
 */

window.AJAX.registerTeardown('server/user_groups.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#deleteUserGroupModal').off('show.bs.modal');
});
/**
 * Bind event handlers
 */

window.AJAX.registerOnload('server/user_groups.js', function () {
  const deleteUserGroupModal = jquery__WEBPACK_IMPORTED_MODULE_0__('#deleteUserGroupModal');
  deleteUserGroupModal.on('show.bs.modal', function (event) {
    const userGroupName = jquery__WEBPACK_IMPORTED_MODULE_0__(event.relatedTarget).data('user-group');
    this.querySelector('.modal-body').innerText = Functions.sprintf(window.Messages.strDropUserGroupWarning, Functions.escapeHtml(userGroupName));
  });
  deleteUserGroupModal.on('shown.bs.modal', function (event) {
    const userGroupName = jquery__WEBPACK_IMPORTED_MODULE_0__(event.relatedTarget).data('user-group');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#deleteUserGroupConfirm').on('click', function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/server/user-groups', {
        'deleteUserGroup': true,
        'userGroup': userGroupName,
        'ajax_request': true
      }, window.AJAX.responseHandler);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#deleteUserGroupModal').modal('hide');
    });
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(61));
/******/ }
]);
//# sourceMappingURL=user_groups.js.map