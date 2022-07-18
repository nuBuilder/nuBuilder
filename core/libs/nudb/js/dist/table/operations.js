"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[65],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 71:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/* global Navigation */

/**
 * Unbind all event handlers before tearing down a page
 */

window.AJAX.registerTeardown('table/operations.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', '#copyTable.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', '#moveTableForm');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', '#tableOptionsForm');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', '#partitionsForm');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#tbl_maintenance li a.maintain_action.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#drop_tbl_anchor.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#drop_view_anchor.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#truncate_tbl_anchor.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#delete_tbl_anchor.ajax');
});
/**
 * Confirm and send POST request
 *
 * @param {JQuery} linkObject
 * @param {'TRUNCATE'|'DELETE'} action
 *
 * @return {void}
 */

var confirmAndPost = function (linkObject, action) {
  /**
   * @var {String} question String containing the question to be asked for confirmation
   */
  var question = '';

  if (action === 'TRUNCATE') {
    question += window.Messages.strTruncateTableStrongWarning + ' ';
  } else if (action === 'DELETE') {
    question += window.Messages.strDeleteTableStrongWarning + ' ';
  }

  question += Functions.sprintf(window.Messages.strDoYouReally, linkObject.data('query'));
  question += Functions.getForeignKeyCheckboxLoader();
  linkObject.confirm(question, linkObject.attr('href'), function (url) {
    Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
    var params = Functions.getJsConfirmCommonParam(this, linkObject.getPostData());
    jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, function (data) {
      if (jquery__WEBPACK_IMPORTED_MODULE_0__('.sqlqueryresults').length !== 0) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('.sqlqueryresults').remove();
      }

      if (jquery__WEBPACK_IMPORTED_MODULE_0__('.result_query').length !== 0) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('.result_query').remove();
      }

      if (typeof data !== 'undefined' && data.success === true) {
        Functions.ajaxShowMessage(data.message);
        jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="sqlqueryresults ajax"></div>').prependTo('#page_content');
        jquery__WEBPACK_IMPORTED_MODULE_0__('.sqlqueryresults').html(data.sql_query);
        Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content'));
      } else {
        Functions.ajaxShowMessage(data.error, false);
      }
    });
  }, Functions.loadForeignKeyCheckbox);
};
/**
 * jQuery coding for 'Table operations'. Used on /table/operations
 * Attach Ajax Event handlers for Table operations
 */


window.AJAX.registerOnload('table/operations.js', function () {
  /**
   * Ajax action for submitting the "Copy table"
   */
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '#copyTable.ajax', function (event) {
    event.preventDefault();
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    Functions.prepareForAjaxRequest($form);
    var argsep = window.CommonParams.get('arg_separator');
    jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), $form.serialize() + argsep + 'submit_copy=Go', function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        if ($form.find('input[name=\'switch_to_new\']').prop('checked')) {
          window.CommonParams.set('db', $form.find('select[name=\'target_db\'],input[name=\'target_db\']').val());
          window.CommonParams.set('table', $form.find('input[name=\'new_name\']').val());
          window.CommonActions.refreshMain(false, function () {
            Functions.ajaxShowMessage(data.message);
          });
        } else {
          Functions.ajaxShowMessage(data.message);
        } // Refresh navigation when the table is copied


        Navigation.reload();
      } else {
        Functions.ajaxShowMessage(data.error, false);
      }
    }); // end $.post()
  }); // end of copyTable ajax submit

  /**
   * Ajax action for submitting the "Move table"
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '#moveTableForm', function (event) {
    event.preventDefault();
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    Functions.prepareForAjaxRequest($form);
    var argsep = window.CommonParams.get('arg_separator');
    jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), $form.serialize() + argsep + 'submit_move=1', function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        window.CommonParams.set('db', data.params.db);
        window.CommonParams.set('table', data.params.table);
        window.CommonActions.refreshMain('index.php?route=/table/sql', function () {
          Functions.ajaxShowMessage(data.message);
        }); // Refresh navigation when the table is copied

        Navigation.reload();
      } else {
        Functions.ajaxShowMessage(data.error, false);
      }
    });
  });
  /**
   * Ajax action for submitting the "Table options"
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '#tableOptionsForm', function (event) {
    event.preventDefault();
    event.stopPropagation();
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var $tblNameField = $form.find('input[name=new_name]');
    var $tblCollationField = $form.find('select[name=tbl_collation]');
    var collationOrigValue = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="tbl_collation"] option[selected]').val();
    var $changeAllColumnCollationsCheckBox = jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_change_all_collations');
    var question = window.Messages.strChangeAllColumnCollationsWarning;

    if ($tblNameField.val() !== $tblNameField[0].defaultValue) {
      // reload page and navigation if the table has been renamed
      Functions.prepareForAjaxRequest($form);

      if ($tblCollationField.val() !== collationOrigValue && $changeAllColumnCollationsCheckBox.is(':checked')) {
        $form.confirm(question, $form.attr('action'), function () {
          submitOptionsForm();
        });
      } else {
        submitOptionsForm();
      }
    } else {
      if ($tblCollationField.val() !== collationOrigValue && $changeAllColumnCollationsCheckBox.is(':checked')) {
        $form.confirm(question, $form.attr('action'), function () {
          $form.removeClass('ajax').trigger('submit').addClass('ajax');
        });
      } else {
        $form.removeClass('ajax').trigger('submit').addClass('ajax');
      }
    }

    function submitOptionsForm() {
      jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), $form.serialize(), function (data) {
        if (typeof data !== 'undefined' && data.success === true) {
          window.CommonParams.set('table', data.params.table);
          window.CommonActions.refreshMain(false, function () {
            jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content').html(data.message);
            Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content'));
          }); // Refresh navigation when the table is renamed

          Navigation.reload();
        } else {
          Functions.ajaxShowMessage(data.error, false);
        }
      });
    }
  });
  /**
   * Ajax events for actions in the "Table maintenance"
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#tbl_maintenance li a.maintain_action.ajax', function (event) {
    event.preventDefault();
    var $link = jquery__WEBPACK_IMPORTED_MODULE_0__(this);

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('.sqlqueryresults').length !== 0) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('.sqlqueryresults').remove();
    }

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('.result_query').length !== 0) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('.result_query').remove();
    } // variables which stores the common attributes


    var params = jquery__WEBPACK_IMPORTED_MODULE_0__.param({
      'ajax_request': 1,
      'server': window.CommonParams.get('server')
    });
    var postData = $link.getPostData();

    if (postData) {
      params += window.CommonParams.get('arg_separator') + postData;
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__.post($link.attr('href'), params, function (data) {
      function scrollToTop() {
        jquery__WEBPACK_IMPORTED_MODULE_0__('html, body').animate({
          scrollTop: 0
        });
      }

      var $tempDiv;

      if (typeof data !== 'undefined' && data.success === true && data.sql_query !== undefined) {
        Functions.ajaxShowMessage(data.message);
        jquery__WEBPACK_IMPORTED_MODULE_0__('<div class=\'sqlqueryresults ajax\'></div>').prependTo('#page_content');
        jquery__WEBPACK_IMPORTED_MODULE_0__('.sqlqueryresults').html(data.sql_query);
        Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content'));
        scrollToTop();
      } else if (typeof data !== 'undefined' && data.success === true) {
        $tempDiv = jquery__WEBPACK_IMPORTED_MODULE_0__('<div id=\'temp_div\'></div>');
        $tempDiv.html(data.message);
        var $success = $tempDiv.find('.result_query .alert-success');
        Functions.ajaxShowMessage($success);
        jquery__WEBPACK_IMPORTED_MODULE_0__('<div class=\'sqlqueryresults ajax\'></div>').prependTo('#page_content');
        jquery__WEBPACK_IMPORTED_MODULE_0__('.sqlqueryresults').html(data.message);
        Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content'));
        jquery__WEBPACK_IMPORTED_MODULE_0__('.sqlqueryresults').children('fieldset,br').remove();
        scrollToTop();
      } else {
        $tempDiv = jquery__WEBPACK_IMPORTED_MODULE_0__('<div id=\'temp_div\'></div>');
        $tempDiv.html(data.error);
        var $error;

        if ($tempDiv.find('.error code').length !== 0) {
          $error = $tempDiv.find('.error code').addClass('error');
        } else {
          $error = $tempDiv;
        }

        Functions.ajaxShowMessage($error, false);
      }
    }); // end $.post()
  }); // end of table maintenance ajax click

  /**
   * Ajax action for submitting the "Partition Maintenance"
   * Also, asks for confirmation when DROP partition is submitted
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '#partitionsForm', function (event) {
    event.preventDefault();
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);

    function submitPartitionMaintenance() {
      var argsep = window.CommonParams.get('arg_separator');
      var submitData = $form.serialize() + argsep + 'ajax_request=true' + argsep + 'ajax_page_request=true';
      Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
      window.AJAX.source = $form;
      jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), submitData, window.AJAX.responseHandler);
    }

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#partitionOperationRadioDrop').is(':checked')) {
      $form.confirm(window.Messages.strDropPartitionWarning, $form.attr('action'), function () {
        submitPartitionMaintenance();
      });
    } else if (jquery__WEBPACK_IMPORTED_MODULE_0__('#partitionOperationRadioTruncate').is(':checked')) {
      $form.confirm(window.Messages.strTruncatePartitionWarning, $form.attr('action'), function () {
        submitPartitionMaintenance();
      });
    } else {
      submitPartitionMaintenance();
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#drop_tbl_anchor.ajax', function (event) {
    event.preventDefault();
    var $link = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    /**
     * @var {String} question String containing the question to be asked for confirmation
     */

    var question = window.Messages.strDropTableStrongWarning + ' ';
    question += Functions.sprintf(window.Messages.strDoYouReally, $link[0].getAttribute('data-query'));
    question += Functions.getForeignKeyCheckboxLoader();
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).confirm(question, jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href'), function (url) {
      var $msgbox = Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
      var params = Functions.getJsConfirmCommonParam(this, $link.getPostData());
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, function (data) {
        if (typeof data !== 'undefined' && data.success === true) {
          Functions.ajaxRemoveMessage($msgbox); // Table deleted successfully, refresh both the frames

          Navigation.reload();
          window.CommonParams.set('table', '');
          window.CommonActions.refreshMain(window.CommonParams.get('opendb_url'), function () {
            Functions.ajaxShowMessage(data.message);
          });
        } else {
          Functions.ajaxShowMessage(data.error, false);
        }
      });
    }, Functions.loadForeignKeyCheckbox);
  }); // end of Drop Table Ajax action

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#drop_view_anchor.ajax', function (event) {
    event.preventDefault();
    var $link = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    /**
     * @var {String} question String containing the question to be asked for confirmation
     */

    var question = window.Messages.strDropTableStrongWarning + ' ';
    question += Functions.sprintf(window.Messages.strDoYouReally, 'DROP VIEW `' + Functions.escapeHtml(window.CommonParams.get('table') + '`'));
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).confirm(question, jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href'), function (url) {
      var $msgbox = Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
      var params = Functions.getJsConfirmCommonParam(this, $link.getPostData());
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, function (data) {
        if (typeof data !== 'undefined' && data.success === true) {
          Functions.ajaxRemoveMessage($msgbox); // Table deleted successfully, refresh both the frames

          Navigation.reload();
          window.CommonParams.set('table', '');
          window.CommonActions.refreshMain(window.CommonParams.get('opendb_url'), function () {
            Functions.ajaxShowMessage(data.message);
          });
        } else {
          Functions.ajaxShowMessage(data.error, false);
        }
      });
    });
  }); // end of Drop View Ajax action

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#truncate_tbl_anchor.ajax', function (event) {
    event.preventDefault();
    confirmAndPost(jquery__WEBPACK_IMPORTED_MODULE_0__(this), 'TRUNCATE');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#delete_tbl_anchor.ajax', function (event) {
    event.preventDefault();
    confirmAndPost(jquery__WEBPACK_IMPORTED_MODULE_0__(this), 'DELETE');
  });
}); // end $(document).ready for 'Table operations'

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(71));
/******/ }
]);
//# sourceMappingURL=operations.js.map