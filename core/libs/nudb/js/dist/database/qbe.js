"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[11],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 16:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview    function used in QBE for DB
 * @name            Database Operations
 *
 * @requires    jQuery
 * @requires    jQueryUI
 * @requires    js/functions.js
 *
 */

/**
 * Ajax event handlers here for /database/qbe
 *
 * Actions Ajaxified here:
 * Select saved search
 */

/**
 * Unbind all event handlers before tearing down a page
 */

window.AJAX.registerTeardown('database/qbe.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', 'select[name^=criteriaColumn]');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', '#searchId');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#saveSearch');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#updateSearch');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#deleteSearch');
});
window.AJAX.registerOnload('database/qbe.js', function () {
  Functions.getSqlEditor(jquery__WEBPACK_IMPORTED_MODULE_0__('#textSqlquery'), {}, 'none');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tblQbe').width(jquery__WEBPACK_IMPORTED_MODULE_0__('#tblQbe').parent().width());
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tblQbeFooters').width(jquery__WEBPACK_IMPORTED_MODULE_0__('#tblQbeFooters').parent().width());
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tblQbe').on('resize', function () {
    var newWidthTblQbe = jquery__WEBPACK_IMPORTED_MODULE_0__('#textSqlquery').next().width();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#tblQbe').width(newWidthTblQbe);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#tblQbeFooters').width(newWidthTblQbe);
  });
  /**
   * Ajax handler to check the corresponding 'show' checkbox when column is selected
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', 'select[name^=criteriaColumn]', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val()) {
      var index = /\d+/.exec(jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('name'));
      jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=criteriaShow\\[' + index + '\\]]').prop('checked', true);
    }
  });
  /**
   * Ajax event handlers for 'Select saved search'
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '#searchId', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#action').val('load');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#formQBE').trigger('submit');
  });
  /**
   * Ajax event handlers for 'Create bookmark'
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#saveSearch', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#action').val('create');
  });
  /**
   * Ajax event handlers for 'Update bookmark'
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#updateSearch', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#action').val('update');
  });
  /**
   * Ajax event handlers for 'Delete bookmark'
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#deleteSearch', function () {
    var question = Functions.sprintf(window.Messages.strConfirmDeleteQBESearch, jquery__WEBPACK_IMPORTED_MODULE_0__('#searchId').find('option:selected').text());

    if (!confirm(question)) {
      return false;
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('#action').val('delete');
  });
  var windowwidth = jquery__WEBPACK_IMPORTED_MODULE_0__(window).width();
  jquery__WEBPACK_IMPORTED_MODULE_0__('.jsresponsive').css('max-width', windowwidth - 35 + 'px');
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(16));
/******/ }
]);
//# sourceMappingURL=qbe.js.map