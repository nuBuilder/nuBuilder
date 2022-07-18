"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[69],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 75:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * Unbind all event handlers before tearing down the page
 */

window.AJAX.registerTeardown('table/tracking.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('body').off('click', '#versionsForm.ajax button[name="submit_mult"], #versionsForm.ajax input[name="submit_mult"]');
  jquery__WEBPACK_IMPORTED_MODULE_0__('body').off('click', 'a.delete_version_anchor.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__('body').off('click', 'a.delete_entry_anchor.ajax');
});
/**
 * Bind event handlers
 */

window.AJAX.registerOnload('table/tracking.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#versions tr').first().find('th').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="sorticon"></div>'));
  jquery__WEBPACK_IMPORTED_MODULE_0__('#versions').tablesorter({
    sortList: [[1, 0]],
    headers: {
      0: {
        sorter: false
      },
      1: {
        sorter: 'integer'
      },
      5: {
        sorter: false
      },
      6: {
        sorter: false
      }
    }
  });

  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#ddl_versions tbody tr').length > 0) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#ddl_versions tr').first().find('th').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="sorticon"></div>'));
    jquery__WEBPACK_IMPORTED_MODULE_0__('#ddl_versions').tablesorter({
      sortList: [[0, 0]],
      headers: {
        0: {
          sorter: 'integer'
        },
        3: {
          sorter: false
        },
        4: {
          sorter: false
        }
      }
    });
  }

  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#dml_versions tbody tr').length > 0) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#dml_versions tr').first().find('th').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="sorticon"></div>'));
    jquery__WEBPACK_IMPORTED_MODULE_0__('#dml_versions').tablesorter({
      sortList: [[0, 0]],
      headers: {
        0: {
          sorter: 'integer'
        },
        3: {
          sorter: false
        },
        4: {
          sorter: false
        }
      }
    });
  }
  /**
   * Handles multi submit for tracking versions
   */


  jquery__WEBPACK_IMPORTED_MODULE_0__('body').on('click', '#versionsForm.ajax button[name="submit_mult"], #versionsForm.ajax input[name="submit_mult"]', function (e) {
    e.preventDefault();
    var $button = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var $form = $button.parent('form');
    var argsep = window.CommonParams.get('arg_separator');
    var submitData = $form.serialize() + argsep + 'ajax_request=true' + argsep + 'ajax_page_request=true' + argsep + 'submit_mult=' + $button.val();

    if ($button.val() === 'delete_version') {
      var question = window.Messages.strDeleteTrackingVersionMultiple;
      $button.confirm(question, $form.attr('action'), function (url) {
        Functions.ajaxShowMessage();
        window.AJAX.source = $form;
        jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, submitData, window.AJAX.responseHandler);
      });
    } else {
      Functions.ajaxShowMessage();
      window.AJAX.source = $form;
      jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), submitData, window.AJAX.responseHandler);
    }
  });
  /**
   * Ajax Event handler for 'Delete version'
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('body').on('click', 'a.delete_version_anchor.ajax', function (e) {
    e.preventDefault();
    var $anchor = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var question = window.Messages.strDeleteTrackingVersion;
    $anchor.confirm(question, $anchor.attr('href'), function (url) {
      Functions.ajaxShowMessage();
      window.AJAX.source = $anchor;
      var argSep = window.CommonParams.get('arg_separator');
      var params = Functions.getJsConfirmCommonParam(this, $anchor.getPostData());
      params += argSep + 'ajax_page_request=1';
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, window.AJAX.responseHandler);
    });
  });
  /**
   * Ajax Event handler for 'Delete tracking report entry'
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('body').on('click', 'a.delete_entry_anchor.ajax', function (e) {
    e.preventDefault();
    var $anchor = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var question = window.Messages.strDeletingTrackingEntry;
    $anchor.confirm(question, $anchor.attr('href'), function (url) {
      Functions.ajaxShowMessage();
      window.AJAX.source = $anchor;
      var argSep = window.CommonParams.get('arg_separator');
      var params = Functions.getJsConfirmCommonParam(this, $anchor.getPostData());
      params += argSep + 'ajax_page_request=1';
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, window.AJAX.responseHandler);
    });
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(75));
/******/ }
]);
//# sourceMappingURL=tracking.js.map