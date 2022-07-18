"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[10],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 15:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/* global Navigation */

/**
 * @fileoverview    function used in server privilege pages
 * @name            Database Operations
 *
 * @requires    jQuery
 * @requires    jQueryUI
 * @requires    js/functions.js
 *
 */

/**
 * Ajax event handlers here for /database/operations
 *
 * Actions Ajaxified here:
 * Rename Database
 * Copy Database
 * Change Charset
 * Drop Database
 */

/**
 * Unbind all event handlers before tearing down a page
 */

window.AJAX.registerTeardown('database/operations.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', '#rename_db_form.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', '#copy_db_form.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', '#change_db_charset_form.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#drop_db_anchor.ajax');
});
window.AJAX.registerOnload('database/operations.js', function () {
  /**
   * Ajax event handlers for 'Rename Database'
   */
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '#rename_db_form.ajax', function (event) {
    event.preventDefault();

    if (Functions.emptyCheckTheField(this, 'newname')) {
      Functions.ajaxShowMessage(window.Messages.strFormEmpty, false, 'error');
      return false;
    }

    var oldDbName = window.CommonParams.get('db');
    var newDbName = jquery__WEBPACK_IMPORTED_MODULE_0__('#new_db_name').val();

    if (newDbName === oldDbName) {
      Functions.ajaxShowMessage(window.Messages.strDatabaseRenameToSameName, false, 'error');
      return false;
    }

    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var question = Functions.escapeHtml('CREATE DATABASE ' + newDbName + ' / DROP DATABASE ' + oldDbName);
    Functions.prepareForAjaxRequest($form);
    $form.confirm(question, $form.attr('action'), function (url) {
      Functions.ajaxShowMessage(window.Messages.strRenamingDatabases, false);
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, jquery__WEBPACK_IMPORTED_MODULE_0__('#rename_db_form').serialize() + window.CommonParams.get('arg_separator') + 'is_js_confirmed=1', function (data) {
        if (typeof data !== 'undefined' && data.success === true) {
          Functions.ajaxShowMessage(data.message);
          window.CommonParams.set('db', data.newname);
          Navigation.reload(function () {
            jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').find('a:not(\'.expander\')').each(function () {
              var $thisAnchor = jquery__WEBPACK_IMPORTED_MODULE_0__(this);

              if ($thisAnchor.text() === data.newname) {
                // simulate a click on the new db name
                // in navigation
                $thisAnchor.trigger('click');
              }
            });
          });
        } else {
          Functions.ajaxShowMessage(data.error, false);
        }
      }); // end $.post()
    });
  }); // end Rename Database

  /**
   * Ajax Event Handler for 'Copy Database'
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '#copy_db_form.ajax', function (event) {
    event.preventDefault();

    if (Functions.emptyCheckTheField(this, 'newname')) {
      Functions.ajaxShowMessage(window.Messages.strFormEmpty, false, 'error');
      return false;
    }

    Functions.ajaxShowMessage(window.Messages.strCopyingDatabase, false);
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    Functions.prepareForAjaxRequest($form);
    jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), $form.serialize(), function (data) {
      // use messages that stay on screen
      jquery__WEBPACK_IMPORTED_MODULE_0__('.alert-success, .alert-danger').fadeOut();

      if (typeof data !== 'undefined' && data.success === true) {
        if (jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_switch').is(':checked')) {
          window.CommonParams.set('db', data.newname);
          window.CommonActions.refreshMain(false, function () {
            Functions.ajaxShowMessage(data.message);
          });
        } else {
          window.CommonParams.set('db', data.db);
          Functions.ajaxShowMessage(data.message);
        }

        Navigation.reload();
      } else {
        Functions.ajaxShowMessage(data.error, false);
      }
    }); // end $.post()
  }); // end copy database

  /**
   * Change tables columns visible only if change tables is checked
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('#span_change_all_tables_columns_collations').hide();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_change_all_tables_collations').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#span_change_all_tables_columns_collations').toggle();
  });
  /**
   * Ajax Event handler for 'Change Charset' of the database
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '#change_db_charset_form.ajax', function (event) {
    event.preventDefault();
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    Functions.prepareForAjaxRequest($form);
    Functions.ajaxShowMessage(window.Messages.strChangingCharset);
    jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), $form.serialize(), function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        Functions.ajaxShowMessage(data.message);
      } else {
        Functions.ajaxShowMessage(data.error, false);
      }
    }); // end $.post()
  }); // end change charset

  /**
   * Ajax event handlers for Drop Database
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#drop_db_anchor.ajax', function (event) {
    event.preventDefault();
    var $link = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    /**
     * @var {String} question String containing the question to be asked for confirmation
     */

    var question = window.Messages.strDropDatabaseStrongWarning + ' ';
    question += Functions.sprintf(window.Messages.strDoYouReally, 'DROP DATABASE `' + Functions.escapeHtml(window.CommonParams.get('db') + '`'));
    var params = Functions.getJsConfirmCommonParam(this, $link.getPostData());
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).confirm(question, jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href'), function (url) {
      Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, function (data) {
        if (typeof data !== 'undefined' && data.success) {
          // Database deleted successfully, refresh both the frames
          Navigation.reload();
          window.CommonParams.set('db', '');
          window.CommonActions.refreshMain('index.php?route=/server/databases', function () {
            Functions.ajaxShowMessage(data.message);
          });
        } else {
          Functions.ajaxShowMessage(data.error, false);
        }
      });
    });
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(15));
/******/ }
]);
//# sourceMappingURL=operations.js.map