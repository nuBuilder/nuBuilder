"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[33],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 40:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/* global Navigation */

/**
 * @fileoverview    function used for index manipulation pages
 * @name            Table Structure
 *
 * @requires    jQuery
 * @requires    jQueryUI
 * @required    js/functions.js
 */

var Indexes = {};
window.Indexes = Indexes;
/**
 * Returns the array of indexes based on the index choice
 *
 * @param {string} indexChoice index choice
 *
 * @return {null|object}
 */

Indexes.getIndexArray = function (indexChoice) {
  var sourceArray = null;

  switch (indexChoice.toLowerCase()) {
    case 'primary':
      sourceArray = window.primaryIndexes;
      break;

    case 'unique':
      sourceArray = window.uniqueIndexes;
      break;

    case 'index':
      sourceArray = window.indexes;
      break;

    case 'fulltext':
      sourceArray = window.fulltextIndexes;
      break;

    case 'spatial':
      sourceArray = window.spatialIndexes;
      break;

    default:
      return null;
  }

  return sourceArray;
};
/**
 * Hides/shows the inputs and submits appropriately depending
 * on whether the index type chosen is 'SPATIAL' or not.
 */


Indexes.checkIndexType = function () {
  /**
   * @var {JQuery<HTMLElement}, Dropdown to select the index choice.
   */
  var $selectIndexChoice = jquery__WEBPACK_IMPORTED_MODULE_0__('#select_index_choice');
  /**
   * @var {JQuery<HTMLElement}, Dropdown to select the index type.
   */

  var $selectIndexType = jquery__WEBPACK_IMPORTED_MODULE_0__('#select_index_type');
  /**
   * @var {JQuery<HTMLElement}, Table header for the size column.
   */

  var $sizeHeader = jquery__WEBPACK_IMPORTED_MODULE_0__('#index_columns').find('thead tr').children('th').eq(1);
  /**
   * @var {JQuery<HTMLElement}, Inputs to specify the columns for the index.
   */

  var $columnInputs = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="index[columns][names][]"]');
  /**
   * @var {JQuery<HTMLElement}, Inputs to specify sizes for columns of the index.
   */

  var $sizeInputs = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="index[columns][sub_parts][]"]');
  /**
   * @var {JQuery<HTMLElement}, Footer containing the controllers to add more columns
   */

  var $addMore = jquery__WEBPACK_IMPORTED_MODULE_0__('#index_frm').find('.add_more');

  if ($selectIndexChoice.val() === 'SPATIAL') {
    // Disable and hide the size column
    $sizeHeader.hide();
    $sizeInputs.each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).prop('disabled', true).parent('td').hide();
    }); // Disable and hide the columns of the index other than the first one

    var initial = true;
    $columnInputs.each(function () {
      var $columnInput = jquery__WEBPACK_IMPORTED_MODULE_0__(this);

      if (!initial) {
        $columnInput.prop('disabled', true).parent('td').hide();
      } else {
        initial = false;
      }
    }); // Hide controllers to add more columns

    $addMore.hide();
  } else {
    // Enable and show the size column
    $sizeHeader.show();
    $sizeInputs.each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).prop('disabled', false).parent('td').show();
    }); // Enable and show the columns of the index

    $columnInputs.each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).prop('disabled', false).parent('td').show();
    }); // Show controllers to add more columns

    $addMore.show();
  }

  if ($selectIndexChoice.val() === 'SPATIAL' || $selectIndexChoice.val() === 'FULLTEXT') {
    $selectIndexType.val('').prop('disabled', true);
  } else {
    $selectIndexType.prop('disabled', false);
  }
};
/**
 * Sets current index information into form parameters.
 *
 * @param {any[]}  sourceArray Array containing index columns
 * @param {string} indexChoice Choice of index
 *
 * @return {void}
 */


Indexes.setIndexFormParameters = function (sourceArray, indexChoice) {
  if (indexChoice === 'index') {
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="indexes"]').val(JSON.stringify(sourceArray));
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="' + indexChoice + '_indexes"]').val(JSON.stringify(sourceArray));
  }
};
/**
 * Removes a column from an Index.
 *
 * @param {string} colIndex Index of column in form
 *
 * @return {void}
 */


Indexes.removeColumnFromIndex = function (colIndex) {
  // Get previous index details.
  var previousIndex = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="field_key[' + colIndex + ']"]').attr('data-index');

  if (previousIndex.length) {
    previousIndex = previousIndex.split(',');
    var sourceArray = Indexes.getIndexArray(previousIndex[0]);

    if (sourceArray === null) {
      return;
    } // Remove column from index array.


    var sourceLength = sourceArray[previousIndex[1]].columns.length;

    for (var i = 0; i < sourceLength; i++) {
      if (sourceArray[previousIndex[1]].columns[i].col_index === colIndex) {
        sourceArray[previousIndex[1]].columns.splice(i, 1);
      }
    } // Remove index completely if no columns left.


    if (sourceArray[previousIndex[1]].columns.length === 0) {
      sourceArray.splice(previousIndex[1], 1);
    } // Update current index details.


    jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="field_key[' + colIndex + ']"]').attr('data-index', ''); // Update form index parameters.

    Indexes.setIndexFormParameters(sourceArray, previousIndex[0].toLowerCase());
  }
};
/**
 * Adds a column to an Index.
 *
 * @param {any[]}  sourceArray Array holding corresponding indexes
 * @param {string} arrayIndex  Index of an INDEX in array
 * @param {string} indexChoice Choice of Index
 * @param {string} colIndex    Index of column on form
 *
 * @return {void}
 */


Indexes.addColumnToIndex = function (sourceArray, arrayIndex, indexChoice, colIndex) {
  if (colIndex >= 0) {
    // Remove column from other indexes (if any).
    Indexes.removeColumnFromIndex(colIndex);
  }

  var indexName = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="index[Key_name]"]').val();
  var indexComment = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="index[Index_comment]"]').val();
  var keyBlockSize = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="index[Key_block_size]"]').val();
  var parser = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="index[Parser]"]').val();
  var indexType = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="index[Index_type]"]').val();
  var columns = [];
  jquery__WEBPACK_IMPORTED_MODULE_0__('#index_columns').find('tbody').find('tr').each(function () {
    // Get columns in particular order.
    var colIndex = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('select[name="index[columns][names][]"]').val();
    var size = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('input[name="index[columns][sub_parts][]"]').val();
    columns.push({
      'col_index': colIndex,
      'size': size
    });
  }); // Update or create an index.

  sourceArray[arrayIndex] = {
    'Key_name': indexName,
    'Index_comment': indexComment,
    'Index_choice': indexChoice.toUpperCase(),
    'Key_block_size': keyBlockSize,
    'Parser': parser,
    'Index_type': indexType,
    'columns': columns
  }; // Display index name (or column list)

  var displayName = indexName;

  if (displayName === '') {
    var columnNames = [];
    jquery__WEBPACK_IMPORTED_MODULE_0__.each(columns, function () {
      columnNames.push(jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="field_name[' + this.col_index + ']"]').val());
    });
    displayName = '[' + columnNames.join(', ') + ']';
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__.each(columns, function () {
    var id = 'index_name_' + this.col_index + '_8';
    var $name = jquery__WEBPACK_IMPORTED_MODULE_0__('#' + id);

    if ($name.length === 0) {
      $name = jquery__WEBPACK_IMPORTED_MODULE_0__('<a id="' + id + '" href="#" class="ajax show_index_dialog"></a>');
      $name.insertAfter(jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="field_key[' + this.col_index + ']"]'));
    }

    var $text = jquery__WEBPACK_IMPORTED_MODULE_0__('<small>').text(displayName);
    $name.html($text);
  });

  if (colIndex >= 0) {
    // Update index details on form.
    jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="field_key[' + colIndex + ']"]').attr('data-index', indexChoice + ',' + arrayIndex);
  }

  Indexes.setIndexFormParameters(sourceArray, indexChoice.toLowerCase());
};
/**
 * Get choices list for a column to create a composite index with.
 *
 * @param {any[]} sourceArray Array hodling columns for particular index
 * @param {string} colIndex Choice of index
 *
 * @return {JQuery} jQuery Object
 */


Indexes.getCompositeIndexList = function (sourceArray, colIndex) {
  // Remove any previous list.
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#composite_index_list').length) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#composite_index_list').remove();
  } // Html list.


  var $compositeIndexList = jquery__WEBPACK_IMPORTED_MODULE_0__('<ul id="composite_index_list">' + '<div>' + window.Messages.strCompositeWith + '</div>' + '</ul>'); // Add each column to list available for composite index.

  var sourceLength = sourceArray.length;
  var alreadyPresent = false;

  for (var i = 0; i < sourceLength; i++) {
    var subArrayLen = sourceArray[i].columns.length;
    var columnNames = [];

    for (var j = 0; j < subArrayLen; j++) {
      columnNames.push(jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="field_name[' + sourceArray[i].columns[j].col_index + ']"]').val());

      if (colIndex === sourceArray[i].columns[j].col_index) {
        alreadyPresent = true;
      }
    }

    $compositeIndexList.append('<li>' + '<input type="radio" name="composite_with" ' + (alreadyPresent ? 'checked="checked"' : '') + ' id="composite_index_' + i + '" value="' + i + '">' + '<label for="composite_index_' + i + '">' + columnNames.join(', ') + '</label>' + '</li>');
  }

  return $compositeIndexList;
};

var addIndexGo = function (sourceArray, arrayIndex, index, colIndex) {
  var isMissingValue = false;
  jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="index[columns][names][]"]').each(function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() === '') {
      isMissingValue = true;
    }
  });

  if (!isMissingValue) {
    Indexes.addColumnToIndex(sourceArray, arrayIndex, index.Index_choice, colIndex);
  } else {
    Functions.ajaxShowMessage('<div class="alert alert-danger" role="alert"><img src="themes/dot.gif" title="" alt=""' + ' class="icon ic_s_error"> ' + window.Messages.strMissingColumn + ' </div>', false);
    return false;
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModal').modal('hide');
};
/**
 * Shows 'Add Index' dialog.
 *
 * @param {any[]}  sourceArray   Array holding particular index
 * @param {string} arrayIndex    Index of an INDEX in array
 * @param {any[]}  targetColumns Columns for an INDEX
 * @param {string} colIndex      Index of column on form
 * @param {object} index         Index detail object
 * @param {boolean} showDialog   Whether to show index creation dialog or not
 *
 * @return {void}
 */


Indexes.showAddIndexDialog = function (sourceArray, arrayIndex, targetColumns, colIndex, index, showDialog) {
  var showDialogLocal = typeof showDialog !== 'undefined' ? showDialog : true; // Prepare post-data.

  var $table = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table"]');
  var table = $table.length > 0 ? $table.val() : '';
  var postData = {
    'server': window.CommonParams.get('server'),
    'db': jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="db"]').val(),
    'table': table,
    'ajax_request': 1,
    'create_edit_table': 1,
    'index': index
  };
  var columns = {};

  for (var i = 0; i < targetColumns.length; i++) {
    var columnName = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="field_name[' + targetColumns[i] + ']"]').val();
    var columnType = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="field_type[' + targetColumns[i] + ']"]').val().toLowerCase();
    columns[columnName] = [columnType, targetColumns[i]];
  }

  postData.columns = JSON.stringify(columns);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModalGoButton').on('click', function () {
    addIndexGo(sourceArray, arrayIndex, index, colIndex);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModalCancelButton').on('click', function () {
    if (colIndex >= 0) {
      // Handle state on 'Cancel'.
      var $selectList = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="field_key[' + colIndex + ']"]');

      if (!$selectList.attr('data-index').length) {
        $selectList.find('option[value*="none"]').attr('selected', 'selected');
      } else {
        var previousIndex = $selectList.attr('data-index').split(',');
        $selectList.find('option[value*="' + previousIndex[0].toLowerCase() + '"]').attr('selected', 'selected');
      }
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModal').modal('hide');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModalCloseButton').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModal').modal('hide');
  });
  var $msgbox = Functions.ajaxShowMessage();
  jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/table/indexes', postData, function (data) {
    if (data.success === false) {
      // in the case of an error, show the error message returned.
      Functions.ajaxShowMessage(data.error, false);
    } else {
      Functions.ajaxRemoveMessage($msgbox);
      var $div = jquery__WEBPACK_IMPORTED_MODULE_0__('<div></div>');

      if (showDialogLocal) {
        // Show dialog if the request was successful
        if (jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndex').length > 0) {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndex').remove();
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModal').on('keypress', function (e) {
          if (e.which === 13 || e.keyCode === 13 || window.event.keyCode === 13) {
            e.preventDefault();
            console.log('BOOM');
            addIndexGo(sourceArray, arrayIndex, index, colIndex);
            jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModal').modal('hide');
          }
        });
        jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModal').modal('show');
        jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModalLabel').first().text(window.Messages.strAddIndex);
        jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModal').find('.modal-body').first().html(data.message);
        Functions.checkIndexName('index_frm');
        Functions.showHints($div);
        jquery__WEBPACK_IMPORTED_MODULE_0__('#index_columns').find('td').each(function () {
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).css('width', jquery__WEBPACK_IMPORTED_MODULE_0__(this).width() + 'px');
        });
        jquery__WEBPACK_IMPORTED_MODULE_0__('#index_columns').find('tbody').sortable({
          axis: 'y',
          containment: jquery__WEBPACK_IMPORTED_MODULE_0__('#index_columns').find('tbody'),
          tolerance: 'pointer'
        });
      } else {
        $div.append(data.message);
        $div.css({
          'display': 'none'
        });
        $div.appendTo(jquery__WEBPACK_IMPORTED_MODULE_0__('body'));
        $div.attr({
          'id': 'addIndex'
        });
        var isMissingValue = false;
        jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="index[columns][names][]"]').each(function () {
          if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() === '') {
            isMissingValue = true;
          }
        });

        if (!isMissingValue) {
          Indexes.addColumnToIndex(sourceArray, arrayIndex, index.Index_choice, colIndex);
        } else {
          Functions.ajaxShowMessage('<div class="alert alert-danger" role="alert"><img src="themes/dot.gif" title="" alt=""' + ' class="icon ic_s_error"> ' + window.Messages.strMissingColumn + ' </div>', false);
          return false;
        }
      }
    }
  });
};

var removeIndexOnChangeEvent = function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#composite_index').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#single_column').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModal').modal('hide');
};
/**
 * Creates a advanced index type selection dialog.
 *
 * @param {any[]}  sourceArray Array holding a particular type of indexes
 * @param {string} indexChoice Choice of index
 * @param {string} colIndex    Index of new column on form
 *
 * @return {void}
 */


Indexes.indexTypeSelectionDialog = function (sourceArray, indexChoice, colIndex) {
  var $singleColumnRadio = jquery__WEBPACK_IMPORTED_MODULE_0__('<input type="radio" id="single_column" name="index_choice"' + ' checked="checked">' + '<label for="single_column">' + window.Messages.strCreateSingleColumnIndex + '</label>');
  var $compositeIndexRadio = jquery__WEBPACK_IMPORTED_MODULE_0__('<input type="radio" id="composite_index"' + ' name="index_choice">' + '<label for="composite_index">' + window.Messages.strCreateCompositeIndex + '</label>');
  var $dialogContent = jquery__WEBPACK_IMPORTED_MODULE_0__('<fieldset class="pma-fieldset" id="advance_index_creator"></fieldset>');
  $dialogContent.append('<legend>' + indexChoice.toUpperCase() + '</legend>'); // For UNIQUE/INDEX type, show choice for single-column and composite index.

  $dialogContent.append($singleColumnRadio);
  $dialogContent.append($compositeIndexRadio); // 'OK' operation.

  jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModalGoButton').on('click', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#single_column').is(':checked')) {
      var index = {
        'Key_name': indexChoice === 'primary' ? 'PRIMARY' : '',
        'Index_choice': indexChoice.toUpperCase()
      };
      Indexes.showAddIndexDialog(sourceArray, sourceArray.length, [colIndex], colIndex, index);
    }

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#composite_index').is(':checked')) {
      if (jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="composite_with"]').length !== 0 && jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="composite_with"]:checked').length === 0) {
        Functions.ajaxShowMessage('<div class="alert alert-danger" role="alert"><img src="themes/dot.gif" title=""' + ' alt="" class="icon ic_s_error"> ' + window.Messages.strFormEmpty + ' </div>', false);
        return false;
      }

      var arrayIndex = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="composite_with"]:checked').val();
      var sourceLength = sourceArray[arrayIndex].columns.length;
      var targetColumns = [];

      for (var i = 0; i < sourceLength; i++) {
        targetColumns.push(sourceArray[arrayIndex].columns[i].col_index);
      }

      targetColumns.push(colIndex);
      Indexes.showAddIndexDialog(sourceArray, arrayIndex, targetColumns, colIndex, sourceArray[arrayIndex]);
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModal').modal('hide');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModalCancelButton').on('click', function () {
    // Handle state on 'Cancel'.
    var $selectList = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="field_key[' + colIndex + ']"]');

    if (!$selectList.attr('data-index').length) {
      $selectList.find('option[value*="none"]').attr('selected', 'selected');
    } else {
      var previousIndex = $selectList.attr('data-index').split(',');
      $selectList.find('option[value*="' + previousIndex[0].toLowerCase() + '"]').attr('selected', 'selected');
    }

    removeIndexOnChangeEvent();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModalCloseButton').on('click', function () {
    removeIndexOnChangeEvent();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModal').modal('show');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModalLabel').first().text(window.Messages.strAddIndex);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#addIndexModal').find('.modal-body').first().html($dialogContent);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#composite_index').on('change', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).is(':checked')) {
      $dialogContent.append(Indexes.getCompositeIndexList(sourceArray, colIndex));
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#single_column').on('change', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).is(':checked')) {
      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#composite_index_list').length) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#composite_index_list').remove();
      }
    }
  });
};
/**
 * @return {function}
 */


Indexes.off = () => function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#save_index_frm');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#preview_index_frm');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', '#select_index_choice');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'a.drop_primary_key_index_anchor.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#table_index tbody tr td.edit_index.ajax, #index_div .add_index.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#table_index tbody tr td.rename_index.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#index_frm input[type=submit]');
  jquery__WEBPACK_IMPORTED_MODULE_0__('body').off('change', 'select[name*="field_key"]');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '.show_index_dialog');
};
/**
 * @return {function}
 */


Indexes.on = () => function () {
  // Re-initialize variables.
  window.primaryIndexes = [];
  window.uniqueIndexes = [];
  window.indexes = [];
  window.fulltextIndexes = [];
  window.spatialIndexes = []; // for table creation form

  var $engineSelector = jquery__WEBPACK_IMPORTED_MODULE_0__('.create_table_form select[name=tbl_storage_engine]');

  if ($engineSelector.length) {
    Functions.hideShowConnection($engineSelector);
  }

  var $form = jquery__WEBPACK_IMPORTED_MODULE_0__('#index_frm');

  if ($form.length > 0) {
    Functions.showIndexEditDialog($form);
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#save_index_frm', function (event) {
    event.preventDefault();
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__('#index_frm');
    var argsep = window.CommonParams.get('arg_separator');
    var submitData = $form.serialize() + argsep + 'do_save_data=1' + argsep + 'ajax_request=true' + argsep + 'ajax_page_request=true';
    Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
    window.AJAX.source = $form;
    jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), submitData, window.AJAX.responseHandler);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#preview_index_frm', function (event) {
    event.preventDefault();
    Functions.previewSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#index_frm'));
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '#select_index_choice', function (event) {
    event.preventDefault();
    Indexes.checkIndexType();
    Functions.checkIndexName('index_frm');
  });
  /**
   * Ajax Event handler for 'Drop Index'
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.drop_primary_key_index_anchor.ajax', function (event) {
    event.preventDefault();
    var $anchor = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    /**
     * @var $currRow Object containing reference to the current field's row
     */

    var $currRow = $anchor.parents('tr');
    /** @var {number} rows Number of columns in the key */

    var rows = $anchor.parents('td').attr('rowspan') || 1;
    /** @var {number} $rowsToHide Rows that should be hidden */

    var $rowsToHide = $currRow;

    for (var i = 1, $lastRow = $currRow.next(); i < rows; i++, $lastRow = $lastRow.next()) {
      $rowsToHide = $rowsToHide.add($lastRow);
    }

    var question = $currRow.children('td').children('.drop_primary_key_index_msg').val();
    Functions.confirmPreviewSql(question, $anchor.attr('href'), function (url) {
      var $msg = Functions.ajaxShowMessage(window.Messages.strDroppingPrimaryKeyIndex, false);
      var params = Functions.getJsConfirmCommonParam(this, $anchor.getPostData());
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, function (data) {
        if (typeof data !== 'undefined' && data.success === true) {
          Functions.ajaxRemoveMessage($msg);
          var $tableRef = $rowsToHide.closest('table');

          if ($rowsToHide.length === $tableRef.find('tbody > tr').length) {
            // We are about to remove all rows from the table
            $tableRef.hide('medium', function () {
              jquery__WEBPACK_IMPORTED_MODULE_0__('div.no_indexes_defined').show('medium');
              $rowsToHide.remove();
            });
            $tableRef.siblings('.alert-primary').hide('medium');
          } else {
            // We are removing some of the rows only
            $rowsToHide.hide('medium', function () {
              jquery__WEBPACK_IMPORTED_MODULE_0__(this).remove();
            });
          }

          if (jquery__WEBPACK_IMPORTED_MODULE_0__('.result_query').length) {
            jquery__WEBPACK_IMPORTED_MODULE_0__('.result_query').remove();
          }

          if (data.sql_query) {
            jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="result_query"></div>').html(data.sql_query).prependTo('#structure_content');
            Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content'));
          }

          Navigation.reload();
          window.CommonActions.refreshMain('index.php?route=/table/structure');
        } else {
          Functions.ajaxShowMessage(window.Messages.strErrorProcessingRequest + ' : ' + data.error, false);
        }
      }); // end $.post()
    });
  }); // end Drop Primary Key/Index

  /**
   * Ajax event handler for index edit
   **/

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#table_index tbody tr td.edit_index.ajax, #index_div .add_index.ajax', function (event) {
    event.preventDefault();
    var url;
    var title;

    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('a').length === 0) {
      // Add index
      var valid = Functions.checkFormElementInRange(jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('form')[0], 'added_fields', 'Column count has to be larger than zero.');

      if (!valid) {
        return;
      }

      url = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('form').serialize();
      title = window.Messages.strAddIndex;
    } else {
      // Edit index
      url = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('a').getPostData();
      title = window.Messages.strEditIndex;
    }

    url += window.CommonParams.get('arg_separator') + 'ajax_request=true';
    Functions.indexEditorDialog(url, title, function (data) {
      window.CommonParams.set('db', data.params.db);
      window.CommonParams.set('table', data.params.table);
      window.CommonActions.refreshMain('index.php?route=/table/structure');
    });
  });
  /**
   * Ajax event handler for index rename
   **/

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#table_index tbody tr td.rename_index.ajax', function (event) {
    event.preventDefault();
    var url = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('a').getPostData();
    var title = window.Messages.strRenameIndex;
    url += window.CommonParams.get('arg_separator') + 'ajax_request=true';
    Functions.indexRenameDialog(url, title, function (data) {
      window.CommonParams.set('db', data.params.db);
      window.CommonParams.set('table', data.params.table);
      window.CommonActions.refreshMain('index.php?route=/table/structure');
    });
  });
  /**
   * Ajax event handler for advanced index creation during table creation
   * and column addition.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('body').on('change', 'select[name*="field_key"]', function (e, showDialog) {
    var showDialogLocal = typeof showDialog !== 'undefined' ? showDialog : true; // Index of column on Table edit and create page.

    var colIndex = /\d+/.exec(jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('name'));
    colIndex = colIndex[0]; // Choice of selected index.

    var indexChoice = /[a-z]+/.exec(jquery__WEBPACK_IMPORTED_MODULE_0__(this).val());
    indexChoice = indexChoice[0]; // Array containing corresponding indexes.

    var sourceArray = null;

    if (indexChoice === 'none') {
      Indexes.removeColumnFromIndex(colIndex);
      var id = 'index_name_' + '0' + '_8';
      var $name = jquery__WEBPACK_IMPORTED_MODULE_0__('#' + id);

      if ($name.length === 0) {
        $name = jquery__WEBPACK_IMPORTED_MODULE_0__('<a id="' + id + '" href="#" class="ajax show_index_dialog"></a>');
        $name.insertAfter(jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="field_key[' + '0' + ']"]'));
      }

      $name.html('');
      return false;
    } // Select a source array.


    sourceArray = Indexes.getIndexArray(indexChoice);

    if (sourceArray === null) {
      return;
    }

    if (sourceArray.length === 0) {
      var index = {
        'Key_name': indexChoice === 'primary' ? 'PRIMARY' : '',
        'Index_choice': indexChoice.toUpperCase()
      };
      Indexes.showAddIndexDialog(sourceArray, 0, [colIndex], colIndex, index, showDialogLocal);
    } else {
      if (indexChoice === 'primary') {
        var arrayIndex = 0;
        var sourceLength = sourceArray[arrayIndex].columns.length;
        var targetColumns = [];

        for (var i = 0; i < sourceLength; i++) {
          targetColumns.push(sourceArray[arrayIndex].columns[i].col_index);
        }

        targetColumns.push(colIndex);
        Indexes.showAddIndexDialog(sourceArray, arrayIndex, targetColumns, colIndex, sourceArray[arrayIndex], showDialogLocal);
      } else {
        // If there are multiple columns selected for an index, show advanced dialog.
        Indexes.indexTypeSelectionDialog(sourceArray, indexChoice, colIndex);
      }
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '.show_index_dialog', function (e) {
    e.preventDefault(); // Get index details.

    var previousIndex = jquery__WEBPACK_IMPORTED_MODULE_0__(this).prev('select').attr('data-index').split(',');
    var indexChoice = previousIndex[0];
    var arrayIndex = previousIndex[1];
    var sourceArray = Indexes.getIndexArray(indexChoice);

    if (sourceArray !== null) {
      var sourceLength = sourceArray[arrayIndex].columns.length;
      var targetColumns = [];

      for (var i = 0; i < sourceLength; i++) {
        targetColumns.push(sourceArray[arrayIndex].columns[i].col_index);
      }

      Indexes.showAddIndexDialog(sourceArray, arrayIndex, targetColumns, -1, sourceArray[arrayIndex]);
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#index_frm').on('submit', function () {
    if (typeof this.elements['index[Key_name]'].disabled !== 'undefined') {
      this.elements['index[Key_name]'].disabled = false;
    }
  });
};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(40));
/******/ }
]);
//# sourceMappingURL=indexes.js.map