"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[45],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 52:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview    Javascript functions used in server replication page
 * @name            Server Replication
 *
 * @requires    jQuery
 * @requires    jQueryUI
 * @requires    js/functions.js
 */

var randomServerId = Math.floor(Math.random() * 10000000);
var confPrefix = 'server-id=' + randomServerId + '\nlog_bin=mysql-bin\nlog_error=mysql-bin.err\n';

function updateConfig() {
  var confIgnore = 'binlog_ignore_db=';
  var confDo = 'binlog_do_db=';
  var databaseList = '';

  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#db_select option:selected').length === 0) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#rep').text(confPrefix);
  } else if (jquery__WEBPACK_IMPORTED_MODULE_0__('#db_type option:selected').val() === 'all') {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#db_select option:selected').each(function () {
      databaseList += confIgnore + jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() + '\n';
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#rep').text(confPrefix + databaseList);
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#db_select option:selected').each(function () {
      databaseList += confDo + jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() + '\n';
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#rep').text(confPrefix + databaseList);
  }
}
/**
 * Unbind all event handlers before tearing down a page
 */


window.AJAX.registerTeardown('replication.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_type').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_select').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#primary_status_href').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#primary_replicas_href').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#replica_status_href').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#replica_control_href').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#replica_errormanagement_href').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#replica_synchronization_href').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_reset_href').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_select_href').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#reset_replica').off('click');
});
window.AJAX.registerOnload('replication.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#rep').text(confPrefix);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_type').on('change', updateConfig);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_select').on('change', updateConfig);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#primary_status_href').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#replication_primary_section').toggle();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#primary_replicas_href').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#replication_replicas_section').toggle();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#replica_status_href').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#replication_replica_section').toggle();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#replica_control_href').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#replica_control_gui').toggle();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#replica_errormanagement_href').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#replica_errormanagement_gui').toggle();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#replica_synchronization_href').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#replica_synchronization_gui').toggle();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_reset_href').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#db_select option:selected').prop('selected', false);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#db_select').trigger('change');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_select_href').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#db_select option').prop('selected', true);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#db_select').trigger('change');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#reset_replica').on('click', function (e) {
    e.preventDefault();
    var $anchor = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var question = window.Messages.strResetReplicaWarning;
    $anchor.confirm(question, $anchor.attr('href'), function (url) {
      Functions.ajaxShowMessage();
      window.AJAX.source = $anchor;
      var params = Functions.getJsConfirmCommonParam({
        'ajax_page_request': true,
        'ajax_request': true
      }, $anchor.getPostData());
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, window.AJAX.responseHandler);
    });
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#button_generate_password').on('click', function () {
    Functions.suggestPassword(this.form);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#nopass_1').on('click', function () {
    this.form.pma_pw.value = '';
    this.form.pma_pw2.value = '';
    this.checked = true;
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#nopass_0').on('click', function () {
    document.getElementById('text_pma_change_pw').focus();
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(52));
/******/ }
]);
//# sourceMappingURL=replication.js.map