"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[15],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 20:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/* global Navigation */

/**
 * @fileoverview    functions used on the database structure page
 * @name            Database Structure
 *
 * @requires    jQuery
 * @requires    jQueryUI
 * @required    js/functions.js
 */

var DatabaseStructure = {};
window.DatabaseStructure = DatabaseStructure;
/**
 * AJAX scripts for /database/structure
 *
 * Actions ajaxified here:
 * Drop Database
 * Truncate Table
 * Drop Table
 *
 */

/**
 * Unbind all event handlers before tearing down a page
 */

window.AJAX.registerTeardown('database/structure.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'a.truncate_table_anchor.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'a.drop_table_anchor.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#real_end_input');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'a.favorite_table_anchor.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a.real_row_count').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a.row_count_sum').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('select[name=submit_mult]').off('change');
});
/**
 * Adjust number of rows and total size in the summary
 * when truncating, creating, dropping or inserting into a table
 */

DatabaseStructure.adjustTotals = function () {
  var byteUnits = [window.Messages.strB, window.Messages.strKiB, window.Messages.strMiB, window.Messages.strGiB, window.Messages.strTiB, window.Messages.strPiB, window.Messages.strEiB];
  /**
   * @var $allTr jQuery object that references all the rows in the list of tables
   */

  var $allTr = jquery__WEBPACK_IMPORTED_MODULE_0__('#tablesForm').find('table.data tbody').first().find('tr'); // New summary values for the table

  var tableSum = $allTr.length;
  var rowsSum = 0;
  var sizeSum = 0;
  var overheadSum = 0;
  var rowSumApproximated = false;
  $allTr.each(function () {
    var $this = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var i;
    var tmpVal; // Get the number of rows for this SQL table

    var strRows = $this.find('.tbl_rows').text(); // If the value is approximated

    if (strRows.indexOf('~') === 0) {
      rowSumApproximated = true; // The approximated value contains a preceding ~ (Eg 100 --> ~100)

      strRows = strRows.substring(1, strRows.length);
    }

    strRows = strRows.replace(/[,.\s]/g, '');
    var intRow = parseInt(strRows, 10);

    if (!isNaN(intRow)) {
      rowsSum += intRow;
    } // Extract the size and overhead


    var valSize = 0;
    var valOverhead = 0;
    var strSize = $this.find('.tbl_size span:not(.unit)').text().trim();
    var strSizeUnit = $this.find('.tbl_size span.unit').text().trim();
    var strOverhead = $this.find('.tbl_overhead span:not(.unit)').text().trim();
    var strOverheadUnit = $this.find('.tbl_overhead span.unit').text().trim(); // Given a value and a unit, such as 100 and KiB, for the table size
    // and overhead calculate their numeric values in bytes, such as 102400

    for (i = 0; i < byteUnits.length; i++) {
      if (strSizeUnit === byteUnits[i]) {
        tmpVal = parseFloat(strSize);
        valSize = tmpVal * Math.pow(1024, i);
        break;
      }
    }

    for (i = 0; i < byteUnits.length; i++) {
      if (strOverheadUnit === byteUnits[i]) {
        tmpVal = parseFloat(strOverhead);
        valOverhead = tmpVal * Math.pow(1024, i);
        break;
      }
    }

    sizeSum += valSize;
    overheadSum += valOverhead;
  }); // Add some commas for readability:
  // 1000000 becomes 1,000,000

  var strRowSum = rowsSum + '';
  var regex = /(\d+)(\d{3})/;

  while (regex.test(strRowSum)) {
    strRowSum = strRowSum.replace(regex, '$1' + ',' + '$2');
  } // If approximated total value add ~ in front


  if (rowSumApproximated) {
    strRowSum = '~' + strRowSum;
  } // Calculate the magnitude for the size and overhead values


  var sizeMagnitude = 0;
  var overheadMagnitude = 0;

  while (sizeSum >= 1024) {
    sizeSum /= 1024;
    sizeMagnitude++;
  }

  while (overheadSum >= 1024) {
    overheadSum /= 1024;
    overheadMagnitude++;
  }

  sizeSum = Math.round(sizeSum * 10) / 10;
  overheadSum = Math.round(overheadSum * 10) / 10; // Update summary with new data

  var $summary = jquery__WEBPACK_IMPORTED_MODULE_0__('#tbl_summary_row');
  $summary.find('.tbl_num').text(Functions.sprintf(window.Messages.strNTables, tableSum));

  if (rowSumApproximated) {
    $summary.find('.row_count_sum').text(strRowSum);
  } else {
    $summary.find('.tbl_rows').text(strRowSum);
  }

  $summary.find('.tbl_size').text(sizeSum + ' ' + byteUnits[sizeMagnitude]);
  $summary.find('.tbl_overhead').text(overheadSum + ' ' + byteUnits[overheadMagnitude]);
};
/**
 * Gets the real row count for a table or DB.
 * @param {object} $target Target for appending the real count value.
 */


DatabaseStructure.fetchRealRowCount = function ($target) {
  var $throbber = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation').find('.throbber').first().clone().css({
    visibility: 'visible',
    display: 'inline-block'
  }).on('click', false);
  $target.html($throbber);
  jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
    type: 'GET',
    url: $target.attr('href'),
    cache: false,
    dataType: 'json',
    success: function (response) {
      if (response.success) {
        // If to update all row counts for a DB.
        if (response.real_row_count_all) {
          jquery__WEBPACK_IMPORTED_MODULE_0__.each(JSON.parse(response.real_row_count_all), function (index, table) {
            // Update each table row count.
            jquery__WEBPACK_IMPORTED_MODULE_0__('table.data td[data-table*="' + table.table + '"]').text(table.row_count);
          });
        } // If to update a particular table's row count.


        if (response.real_row_count) {
          // Append the parent cell with real row count.
          $target.parent().text(response.real_row_count);
        } // Adjust the 'Sum' displayed at the bottom.


        DatabaseStructure.adjustTotals();
      } else {
        Functions.ajaxShowMessage(window.Messages.strErrorRealRowCount);
      }
    },
    error: function () {
      Functions.ajaxShowMessage(window.Messages.strErrorRealRowCount);
    }
  });
};

window.AJAX.registerOnload('database/structure.js', function () {
  /**
   * Event handler on select of "Make consistent with central list"
   */
  jquery__WEBPACK_IMPORTED_MODULE_0__('select[name=submit_mult]').on('change', function (event) {
    var url = 'index.php?route=/database/structure';
    var action = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();

    if (action === 'make_consistent_with_central_list') {
      event.preventDefault();
      event.stopPropagation();
      jquery__WEBPACK_IMPORTED_MODULE_0__('#makeConsistentWithCentralListModal').modal('show').on('shown.bs.modal', function () {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#makeConsistentWithCentralListContinue').on('click', function () {
          const $form = jquery__WEBPACK_IMPORTED_MODULE_0__('#tablesForm');
          const argSep = window.CommonParams.get('arg_separator');
          const data = $form.serialize() + argSep + 'ajax_request=true' + argSep + 'ajax_page_request=true';
          Functions.ajaxShowMessage();
          window.AJAX.source = $form;
          jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/database/structure/central-columns/make-consistent', data, window.AJAX.responseHandler);
          jquery__WEBPACK_IMPORTED_MODULE_0__('#makeConsistentWithCentralListModal').modal('hide');
        });
      });
      return;
    }

    if (action === 'copy_tbl' || action === 'add_prefix_tbl' || action === 'replace_prefix_tbl' || action === 'copy_tbl_change_prefix') {
      event.preventDefault();
      event.stopPropagation();

      if (jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="selected_tbl[]"]:checked').length === 0) {
        return false;
      }

      var formData = jquery__WEBPACK_IMPORTED_MODULE_0__('#tablesForm').serialize();
      var modalTitle = '';

      if (action === 'copy_tbl') {
        url = 'index.php?route=/database/structure/copy-form';
        modalTitle = window.Messages.strCopyTablesTo;
      } else if (action === 'add_prefix_tbl') {
        url = 'index.php?route=/database/structure/add-prefix';
        modalTitle = window.Messages.strAddPrefix;
      } else if (action === 'replace_prefix_tbl') {
        url = 'index.php?route=/database/structure/change-prefix-form';
        modalTitle = window.Messages.strReplacePrefix;
      } else if (action === 'copy_tbl_change_prefix') {
        url = 'index.php?route=/database/structure/change-prefix-form';
        modalTitle = window.Messages.strCopyPrefix;
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
        type: 'POST',
        url: url,
        dataType: 'html',
        data: formData
      }).done(function (modalBody) {
        const bulkActionModal = jquery__WEBPACK_IMPORTED_MODULE_0__('#bulkActionModal');
        bulkActionModal.on('show.bs.modal', function () {
          this.querySelector('.modal-title').innerText = modalTitle;
          this.querySelector('.modal-body').innerHTML = modalBody;
        });
        bulkActionModal.modal('show').on('shown.bs.modal', function () {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#bulkActionContinue').on('click', function () {
            jquery__WEBPACK_IMPORTED_MODULE_0__('#ajax_form').trigger('submit');
            jquery__WEBPACK_IMPORTED_MODULE_0__('#bulkActionModal').modal('hide');
          });
        });
      });
      return;
    }

    if (action === 'analyze_tbl') {
      url = 'index.php?route=/table/maintenance/analyze';
    } else if (action === 'sync_unique_columns_central_list') {
      url = 'index.php?route=/database/structure/central-columns/add';
    } else if (action === 'delete_unique_columns_central_list') {
      url = 'index.php?route=/database/structure/central-columns/remove';
    } else if (action === 'check_tbl') {
      url = 'index.php?route=/table/maintenance/check';
    } else if (action === 'checksum_tbl') {
      url = 'index.php?route=/table/maintenance/checksum';
    } else if (action === 'drop_tbl') {
      url = 'index.php?route=/database/structure/drop-form';
    } else if (action === 'empty_tbl') {
      url = 'index.php?route=/database/structure/empty-form';
    } else if (action === 'export') {
      url = 'index.php?route=/export/tables';
    } else if (action === 'optimize_tbl') {
      url = 'index.php?route=/table/maintenance/optimize';
    } else if (action === 'repair_tbl') {
      url = 'index.php?route=/table/maintenance/repair';
    } else if (action === 'show_create') {
      url = 'index.php?route=/database/structure/show-create';
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tablesForm').trigger('submit');
      return;
    }

    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parents('form');
    var argsep = window.CommonParams.get('arg_separator');
    var data = $form.serialize() + argsep + 'ajax_request=true' + argsep + 'ajax_page_request=true';
    Functions.ajaxShowMessage();
    window.AJAX.source = $form;
    jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, data, window.AJAX.responseHandler);
  });
  /**
   * Ajax Event handler for 'Truncate Table'
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.truncate_table_anchor.ajax', function (event) {
    event.preventDefault();
    /**
     * @var $this_anchor Object  referring to the anchor clicked
     */

    var $thisAnchor = jquery__WEBPACK_IMPORTED_MODULE_0__(this); // extract current table name and build the question string

    /**
     * @var curr_table_name String containing the name of the table to be truncated
     */

    var currTableName = $thisAnchor.parents('tr').children('th').children('a').text();
    /**
     * @var question    String containing the question to be asked for confirmation
     */

    var question = window.Messages.strTruncateTableStrongWarning + ' ' + Functions.sprintf(window.Messages.strDoYouReally, 'TRUNCATE `' + Functions.escapeHtml(currTableName) + '`') + Functions.getForeignKeyCheckboxLoader();
    $thisAnchor.confirm(question, $thisAnchor.attr('href'), function (url) {
      Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
      var params = Functions.getJsConfirmCommonParam(this, $thisAnchor.getPostData());
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, function (data) {
        if (typeof data !== 'undefined' && data.success === true) {
          Functions.ajaxShowMessage(data.message); // Adjust table statistics

          var $tr = $thisAnchor.closest('tr');
          $tr.find('.tbl_rows').text('0');
          $tr.find('.tbl_size, .tbl_overhead').text('-');
          DatabaseStructure.adjustTotals();
        } else {
          Functions.ajaxShowMessage(window.Messages.strErrorProcessingRequest + ' : ' + data.error, false);
        }
      }); // end $.post()
    }, Functions.loadForeignKeyCheckbox);
  }); // end of Truncate Table Ajax action

  /**
   * Ajax Event handler for 'Drop Table' or 'Drop View'
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.drop_table_anchor.ajax', function (event) {
    event.preventDefault();
    var $thisAnchor = jquery__WEBPACK_IMPORTED_MODULE_0__(this); // extract current table name and build the question string

    /**
     * @var $curr_row    Object containing reference to the current row
     */

    var $currRow = $thisAnchor.parents('tr');
    /**
     * @var curr_table_name String containing the name of the table to be truncated
     */

    var currTableName = $currRow.children('th').children('a').text();
    /**
     * @var is_view Boolean telling if we have a view
     */

    var isView = $currRow.hasClass('is_view') || $thisAnchor.hasClass('view');
    /**
     * @var question    String containing the question to be asked for confirmation
     */

    var question;

    if (!isView) {
      question = window.Messages.strDropTableStrongWarning + ' ' + Functions.sprintf(window.Messages.strDoYouReally, 'DROP TABLE `' + Functions.escapeHtml(currTableName) + '`');
    } else {
      question = Functions.sprintf(window.Messages.strDoYouReally, 'DROP VIEW `' + Functions.escapeHtml(currTableName) + '`');
    }

    question += Functions.getForeignKeyCheckboxLoader();
    $thisAnchor.confirm(question, $thisAnchor.attr('href'), function (url) {
      var $msg = Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
      var params = Functions.getJsConfirmCommonParam(this, $thisAnchor.getPostData());
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, function (data) {
        if (typeof data !== 'undefined' && data.success === true) {
          Functions.ajaxShowMessage(data.message);
          $currRow.hide('medium').remove();
          DatabaseStructure.adjustTotals();
          Navigation.reload();
          Functions.ajaxRemoveMessage($msg);
        } else {
          Functions.ajaxShowMessage(window.Messages.strErrorProcessingRequest + ' : ' + data.error, false);
        }
      }); // end $.post()
    }, Functions.loadForeignKeyCheckbox);
  }); // end of Drop Table Ajax action
  // Calculate Real End for InnoDB

  /**
   * Ajax Event handler for calculating the real end for a InnoDB table
   *
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#real_end_input', function (event) {
    event.preventDefault();
    /**
     * @var question    String containing the question to be asked for confirmation
     */

    var question = window.Messages.strOperationTakesLongTime;
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).confirm(question, '', function () {
      return true;
    });
    return false;
  }); // end Calculate Real End for InnoDB
  // Add tooltip to favorite icons.

  jquery__WEBPACK_IMPORTED_MODULE_0__('.favorite_table_anchor').each(function () {
    Functions.tooltip(jquery__WEBPACK_IMPORTED_MODULE_0__(this), 'a', jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('title'));
  }); // Get real row count via Ajax.

  jquery__WEBPACK_IMPORTED_MODULE_0__('a.real_row_count').on('click', function (event) {
    event.preventDefault();
    DatabaseStructure.fetchRealRowCount(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  }); // Get all real row count.

  jquery__WEBPACK_IMPORTED_MODULE_0__('a.row_count_sum').on('click', function (event) {
    event.preventDefault();
    DatabaseStructure.fetchRealRowCount(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(20));
/******/ }
]);
//# sourceMappingURL=structure.js.map