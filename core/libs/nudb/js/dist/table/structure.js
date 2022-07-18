"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[68],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 74:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview    functions used on the table structure page
 * @name            Table Structure
 *
 * @requires    jQuery
 * @requires    jQueryUI
 * @required    js/functions.js
 */

/* global Navigation */

/**
 * AJAX scripts for /table/structure
 *
 * Actions ajaxified here:
 * Drop Column
 * Add Primary Key
 * Drop Primary Key/Index
 *
 */

/**
 * Reload fields table
 */

function reloadFieldForm() {
  jquery__WEBPACK_IMPORTED_MODULE_0__.post(jquery__WEBPACK_IMPORTED_MODULE_0__('#fieldsForm').attr('action'), jquery__WEBPACK_IMPORTED_MODULE_0__('#fieldsForm').serialize() + window.CommonParams.get('arg_separator') + 'ajax_request=true', function (formData) {
    var $tempDiv = jquery__WEBPACK_IMPORTED_MODULE_0__('<div id=\'temp_div\'><div>').append(formData.message);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#fieldsForm').replaceWith($tempDiv.find('#fieldsForm'));
    jquery__WEBPACK_IMPORTED_MODULE_0__('#addColumns').replaceWith($tempDiv.find('#addColumns'));
    jquery__WEBPACK_IMPORTED_MODULE_0__('#move_columns_dialog').find('ul').replaceWith($tempDiv.find('#move_columns_dialog ul'));
    jquery__WEBPACK_IMPORTED_MODULE_0__('#moveColumns').removeClass('move-active');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content').show();
}

function checkFirst() {
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('select[name=after_field] option:selected').data('pos') === 'first') {
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=field_where]').val('first');
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=field_where]').val('after');
  }
}
/**
 * Unbind all event handlers before tearing down a page
 */


window.AJAX.registerTeardown('table/structure.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'a.drop_column_anchor.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'a.add_key.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#move_columns_anchor');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', '.append_fields_form.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__('body').off('click', '#fieldsForm button.mult_submit');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'a[id^=partition_action].ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#remove_partitioning.ajax');
});
window.AJAX.registerOnload('table/structure.js', function () {
  // Re-initialize variables.
  window.primaryIndexes = [];
  window.indexes = [];
  window.fulltextIndexes = [];
  window.spatialIndexes = [];
  /**
   *Ajax action for submitting the "Column Change" and "Add Column" form
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('.append_fields_form.ajax').off();
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '.append_fields_form.ajax', function (event) {
    event.preventDefault();
    /**
     * @var form object referring to the export form
     */

    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var fieldCnt = $form.find('input[name=orig_num_fields]').val();

    function submitForm() {
      var $msg = Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
      jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), $form.serialize() + window.CommonParams.get('arg_separator') + 'do_save_data=1', function (data) {
        if (jquery__WEBPACK_IMPORTED_MODULE_0__('.sqlqueryresults').length !== 0) {
          jquery__WEBPACK_IMPORTED_MODULE_0__('.sqlqueryresults').remove();
        } else if (jquery__WEBPACK_IMPORTED_MODULE_0__('.error:not(.tab)').length !== 0) {
          jquery__WEBPACK_IMPORTED_MODULE_0__('.error:not(.tab)').remove();
        }

        if (typeof data.success !== 'undefined' && data.success === true) {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content').empty().append(data.message).show();
          Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content'));
          jquery__WEBPACK_IMPORTED_MODULE_0__('.result_query .alert-primary').remove();

          if (typeof data.structure_refresh_route !== 'string') {
            // Do not reload the form when the code below freshly filled it
            reloadFieldForm();
          }

          $form.remove();
          Functions.ajaxRemoveMessage($msg);
          Navigation.reload();

          if (typeof data.structure_refresh_route === 'string') {
            // Fetch the table structure right after adding a new column
            jquery__WEBPACK_IMPORTED_MODULE_0__.get(data.structure_refresh_route, function (data) {
              if (typeof data.success !== 'undefined' && data.success === true) {
                jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content').append(data.message).show();
              }
            });
          } else {
            window.CommonActions.refreshMain('index.php?route=/table/structure');
          }
        } else {
          Functions.ajaxShowMessage(data.error, false);
        }
      }); // end $.post()
    }

    function checkIfConfirmRequired($form) {
      var i = 0;
      var id;
      var elm;
      var val;
      var nameOrig;
      var elmOrig;
      var valOrig;
      var checkRequired = false;

      for (i = 0; i < fieldCnt; i++) {
        id = '#field_' + i + '_5';
        elm = jquery__WEBPACK_IMPORTED_MODULE_0__(id);
        val = elm.val();
        nameOrig = 'input[name=field_collation_orig\\[' + i + '\\]]';
        elmOrig = $form.find(nameOrig);
        valOrig = elmOrig.val();

        if (val && valOrig && val !== valOrig) {
          checkRequired = true;
          break;
        }
      }

      return checkRequired;
    }
    /*
     * First validate the form; if there is a problem, avoid submitting it
     *
     * Functions.checkTableEditForm() needs a pure element and not a jQuery object,
     * this is why we pass $form[0] as a parameter (the jQuery object
     * is actually an array of DOM elements)
     */


    if (Functions.checkTableEditForm($form[0], fieldCnt)) {
      // OK, form passed validation step
      Functions.prepareForAjaxRequest($form);

      if (Functions.checkReservedWordColumns($form)) {
        // User wants to submit the form
        // If Collation is changed, Warn and Confirm
        if (checkIfConfirmRequired($form)) {
          var question = window.sprintf(window.Messages.strChangeColumnCollation, 'https://wiki.phpmyadmin.net/pma/Garbled_data');
          $form.confirm(question, $form.attr('action'), function () {
            submitForm();
          });
        } else {
          submitForm();
        }
      }
    }
  }); // end change table button "do_save_data"

  /**
   * Attach Event Handler for 'Drop Column'
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.drop_column_anchor.ajax', function (event) {
    event.preventDefault();
    /**
     * @var currTableName String containing the name of the current table
     */

    var currTableName = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('form').find('input[name=table]').val();
    /**
     * @var currRow    Object reference to the currently selected row (i.e. field in the table)
     */

    var $currRow = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parents('tr');
    /**
     * @var currColumnName    String containing name of the field referred to by {@link curr_row}
     */

    var currColumnName = $currRow.children('th').children('label').text().trim();
    currColumnName = Functions.escapeHtml(currColumnName);
    /**
     * @var $afterFieldItem    Corresponding entry in the 'After' field.
     */

    var $afterFieldItem = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name=\'after_field\'] option[value=\'' + currColumnName + '\']');
    /**
     * @var question String containing the question to be asked for confirmation
     */

    var question = Functions.sprintf(window.Messages.strDoYouReally, 'ALTER TABLE `' + currTableName + '` DROP `' + currColumnName + '`;');
    var $thisAnchor = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    $thisAnchor.confirm(question, $thisAnchor.attr('href'), function (url) {
      var $msg = Functions.ajaxShowMessage(window.Messages.strDroppingColumn, false);
      var params = Functions.getJsConfirmCommonParam(this, $thisAnchor.getPostData());
      params += window.CommonParams.get('arg_separator') + 'ajax_page_request=1';
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, function (data) {
        if (typeof data !== 'undefined' && data.success === true) {
          Functions.ajaxRemoveMessage($msg);

          if (jquery__WEBPACK_IMPORTED_MODULE_0__('.result_query').length) {
            jquery__WEBPACK_IMPORTED_MODULE_0__('.result_query').remove();
          }

          if (data.sql_query) {
            jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="result_query"></div>').html(data.sql_query).prependTo('#structure_content');
            Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content'));
          } // Adjust the row numbers


          for (var $row = $currRow.next(); $row.length > 0; $row = $row.next()) {
            var newVal = parseInt($row.find('td').eq(1).text(), 10) - 1;
            $row.find('td').eq(1).text(newVal);
          }

          $afterFieldItem.remove();
          $currRow.hide('medium').remove(); // Remove the dropped column from select menu for 'after field'

          jquery__WEBPACK_IMPORTED_MODULE_0__('select[name=after_field]').find('[value="' + currColumnName + '"]').remove(); // by default select the (new) last option to add new column
          // (in case last column is dropped)

          jquery__WEBPACK_IMPORTED_MODULE_0__('select[name=after_field] option').last().attr('selected', 'selected'); // refresh table stats

          if (data.tableStat) {
            jquery__WEBPACK_IMPORTED_MODULE_0__('#tablestatistics').html(data.tableStat);
          } // refresh the list of indexes (comes from /sql)


          jquery__WEBPACK_IMPORTED_MODULE_0__('.index_info').replaceWith(data.indexes_list);
          Navigation.reload();
        } else {
          Functions.ajaxShowMessage(window.Messages.strErrorProcessingRequest + ' : ' + data.error, false);
        }
      }); // end $.post()
    });
  }); // end of Drop Column Anchor action

  /**
   * Ajax Event handler for adding keys
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.add_key.ajax', function (event) {
    event.preventDefault();
    var $this = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var currTableName = $this.closest('form').find('input[name=table]').val();
    var currColumnName = $this.parents('tr').children('th').children('label').text().trim();
    var addClause = '';

    if ($this.is('.add_primary_key_anchor')) {
      addClause = 'ADD PRIMARY KEY';
    } else if ($this.is('.add_index_anchor')) {
      addClause = 'ADD INDEX';
    } else if ($this.is('.add_unique_anchor')) {
      addClause = 'ADD UNIQUE';
    } else if ($this.is('.add_spatial_anchor')) {
      addClause = 'ADD SPATIAL';
    } else if ($this.is('.add_fulltext_anchor')) {
      addClause = 'ADD FULLTEXT';
    }

    var question = Functions.sprintf(window.Messages.strDoYouReally, 'ALTER TABLE `' + Functions.escapeHtml(currTableName) + '` ' + addClause + '(`' + Functions.escapeHtml(currColumnName) + '`);');
    var $thisAnchor = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    $thisAnchor.confirm(question, $thisAnchor.attr('href'), function (url) {
      Functions.ajaxShowMessage();
      window.AJAX.source = $this;
      var params = Functions.getJsConfirmCommonParam(this, $thisAnchor.getPostData());
      params += window.CommonParams.get('arg_separator') + 'ajax_page_request=1';
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, window.AJAX.responseHandler);
    });
  }); // end Add key

  /**
   * Inline move columns
  **/

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#move_columns_anchor', function (e) {
    e.preventDefault();

    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).hasClass('move-active')) {
      return;
    }

    var buttonOptionsError = {};

    buttonOptionsError[window.Messages.strOK] = function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).dialog('close').remove();
    };

    var columns = [];
    jquery__WEBPACK_IMPORTED_MODULE_0__('#tablestructure').find('tbody tr').each(function () {
      var colName = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('input:checkbox').eq(0).val();
      var hiddenInput = jquery__WEBPACK_IMPORTED_MODULE_0__('<input>').prop({
        name: 'move_columns[]',
        type: 'hidden'
      }).val(colName);
      columns[columns.length] = jquery__WEBPACK_IMPORTED_MODULE_0__('<li></li>').addClass('placeholderDrag').text(colName).append(hiddenInput);
    });
    var colList = jquery__WEBPACK_IMPORTED_MODULE_0__('#move_columns_dialog').find('ul').find('li').remove().end();

    for (var i in columns) {
      colList.append(columns[i]);
    }

    colList.sortable({
      axis: 'y',
      containment: jquery__WEBPACK_IMPORTED_MODULE_0__('#move_columns_dialog').find('div'),
      tolerance: 'pointer'
    }).disableSelection();
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__('#move_columns_dialog').find('form');
    $form.data('serialized-unmoved', $form.serialize());
    jquery__WEBPACK_IMPORTED_MODULE_0__('#moveColumnsModal').modal('show');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#designerModalGoButton').on('click', function () {
      // Off event necessary, else the function fires multiple times
      jquery__WEBPACK_IMPORTED_MODULE_0__('#designerModalGoButton').off('click');
      event.preventDefault();
      var $msgbox = Functions.ajaxShowMessage();
      var $this = jquery__WEBPACK_IMPORTED_MODULE_0__('#moveColumnsModal');
      var $form = $this.find('form');
      var serialized = $form.serialize(); // check if any columns were moved at all

      jquery__WEBPACK_IMPORTED_MODULE_0__('#moveColumnsModal').modal('hide');

      if (serialized === $form.data('serialized-unmoved')) {
        Functions.ajaxRemoveMessage($msgbox);
        return;
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.prop('action'), serialized + window.CommonParams.get('arg_separator') + 'ajax_request=true', function (data) {
        if (data.success === false) {
          Functions.ajaxRemoveMessage($msgbox);
          var errorModal = jquery__WEBPACK_IMPORTED_MODULE_0__('#moveColumnsErrorModal');
          errorModal.modal('show');
          errorModal.find('.modal-body').first().html(data.error);
        } else {
          // sort the fields table
          var $fieldsTable = jquery__WEBPACK_IMPORTED_MODULE_0__('table#tablestructure tbody'); // remove all existing rows and remember them

          var $rows = $fieldsTable.find('tr').remove(); // loop through the correct order

          for (var i in data.columns) {
            var theColumn = data.columns[i];
            var $theRow = $rows.find('input:checkbox[value=\'' + theColumn + '\']').closest('tr'); // append the row for this column to the table

            $fieldsTable.append($theRow);
          }

          var $firstrow = $fieldsTable.find('tr').eq(0); // Adjust the row numbers and colors

          for (var $row = $firstrow; $row.length > 0; $row = $row.next()) {
            $row.find('td').eq(1).text($row.index() + 1).end().removeClass('odd even').addClass($row.index() % 2 === 0 ? 'odd' : 'even');
          }

          Functions.ajaxShowMessage(data.message);
        }
      });
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#designerModalPreviewButton').on('click', function () {
      // Function for Previewing SQL
      jquery__WEBPACK_IMPORTED_MODULE_0__('#moveColumnsModal').modal('hide');
      var $form = jquery__WEBPACK_IMPORTED_MODULE_0__('#move_column_form');
      Functions.previewSql($form);
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSQLCloseButton').on('click', function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#moveColumnsModal').modal('show');
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#designerModalCloseButton').on('click', function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#move_columns_anchor').removeClass('move-active');
    });
  });
  /**
   * Handles multi submits in table structure page such as change, browse, drop, primary etc.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('body').on('click', '#fieldsForm button.mult_submit', function (e) {
    e.preventDefault();
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parents('form');
    var argsep = window.CommonParams.get('arg_separator');
    var submitData = $form.serialize() + argsep + 'ajax_request=true' + argsep + 'ajax_page_request=true';
    Functions.ajaxShowMessage();
    window.AJAX.source = $form;
    jquery__WEBPACK_IMPORTED_MODULE_0__.post(this.formAction, submitData, window.AJAX.responseHandler);
  });
  /**
   * Handles clicks on Action links in partition table
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a[id^=partition_action].ajax', function (e) {
    e.preventDefault();
    var $link = jquery__WEBPACK_IMPORTED_MODULE_0__(this);

    function submitPartitionAction(url) {
      var params = 'ajax_request=true&ajax_page_request=true&' + $link.getPostData();
      Functions.ajaxShowMessage();
      window.AJAX.source = $link;
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, window.AJAX.responseHandler);
    }

    if ($link.is('#partition_action_DROP')) {
      $link.confirm(window.Messages.strDropPartitionWarning, $link.attr('href'), function (url) {
        submitPartitionAction(url);
      });
    } else if ($link.is('#partition_action_TRUNCATE')) {
      $link.confirm(window.Messages.strTruncatePartitionWarning, $link.attr('href'), function (url) {
        submitPartitionAction(url);
      });
    } else {
      submitPartitionAction($link.attr('href'));
    }
  });
  /**
   * Handles remove partitioning
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#remove_partitioning.ajax', function (e) {
    e.preventDefault();
    var $link = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var question = window.Messages.strRemovePartitioningWarning;
    $link.confirm(question, $link.attr('href'), function (url) {
      var params = Functions.getJsConfirmCommonParam({
        'ajax_request': true,
        'ajax_page_request': true
      }, $link.getPostData());
      Functions.ajaxShowMessage();
      window.AJAX.source = $link;
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, window.AJAX.responseHandler);
    });
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', 'select[name=after_field]', function () {
    checkFirst();
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(74));
/******/ }
]);
//# sourceMappingURL=structure.js.map