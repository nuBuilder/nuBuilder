"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[7],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 12:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview   events handling from central columns page
 * @name            Central columns
 *
 * @requires    jQuery
 */

/**
 * AJAX scripts for /database/central-columns
 *
 * Actions ajaxified here:
 * Inline Edit and save of a result row
 * Delete a row
 * Multiple edit and delete option
 *
 */

window.AJAX.registerTeardown('database/central_columns.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('.edit').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('.edit_save_form').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('.edit_cancel_form').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('.del_row').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('keyup', '.filter_rows');
  jquery__WEBPACK_IMPORTED_MODULE_0__('.edit_cancel_form').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#table-select').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#column-select').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#add_col_div').find('>a').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#add_new').off('submit');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#multi_edit_central_columns').off('submit');
  jquery__WEBPACK_IMPORTED_MODULE_0__('select.default_type').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('button[name=\'delete_central_columns\']').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('button[name=\'edit_central_columns\']').off('click');
});
window.AJAX.registerOnload('database/central_columns.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableslistcontainer input,#tableslistcontainer select,#tableslistcontainer .default_value,#tableslistcontainer .open_enum_editor').hide();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableslistcontainer').find('.checkall').show();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableslistcontainer').find('.checkall_box').show();

  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#table_columns').find('tbody tr').length > 0) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#table_columns').tablesorter({
      headers: {
        0: {
          sorter: false
        },
        1: {
          sorter: false
        },
        // hidden column
        4: {
          sorter: 'integer'
        }
      }
    });
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableslistcontainer').find('button[name="delete_central_columns"]').on('click', function (event) {
    event.preventDefault();
    var multiDeleteColumns = jquery__WEBPACK_IMPORTED_MODULE_0__('.checkall:checkbox:checked').serialize();

    if (multiDeleteColumns === '') {
      Functions.ajaxShowMessage(window.Messages.strRadioUnchecked);
      return false;
    }

    Functions.ajaxShowMessage();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#del_col_name').val(multiDeleteColumns);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#del_form').trigger('submit');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableslistcontainer').find('button[name="edit_central_columns"]').on('click', function (event) {
    event.preventDefault();
    var editColumnList = jquery__WEBPACK_IMPORTED_MODULE_0__('.checkall:checkbox:checked').serialize();

    if (editColumnList === '') {
      Functions.ajaxShowMessage(window.Messages.strRadioUnchecked);
      return false;
    }

    var argsep = window.CommonParams.get('arg_separator');
    var editColumnData = editColumnList + '' + argsep + 'edit_central_columns_page=true' + argsep + 'ajax_request=true' + argsep + 'ajax_page_request=true' + argsep + 'db=' + encodeURIComponent(window.CommonParams.get('db')) + argsep + 'server=' + window.CommonParams.get('server');
    Functions.ajaxShowMessage();
    window.AJAX.source = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/database/central-columns', editColumnData, window.AJAX.responseHandler);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#multi_edit_central_columns').on('submit', function (event) {
    event.preventDefault();
    event.stopPropagation();
    var argsep = window.CommonParams.get('arg_separator');
    var multiColumnEditData = jquery__WEBPACK_IMPORTED_MODULE_0__('#multi_edit_central_columns').serialize() + argsep + 'multi_edit_central_column_save=true' + argsep + 'ajax_request=true' + argsep + 'ajax_page_request=true' + argsep + 'db=' + encodeURIComponent(window.CommonParams.get('db')) + argsep + 'server=' + window.CommonParams.get('server');
    Functions.ajaxShowMessage();
    window.AJAX.source = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/database/central-columns', multiColumnEditData, window.AJAX.responseHandler);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#add_new').find('td').each(function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('name') !== 'undefined') {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('input,select').first().attr('name', jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('name'));
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#field_0_0').attr('required', 'required');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#add_new input[type="text"], #add_new input[type="number"], #add_new select').css({
    'width': '10em',
    'box-sizing': 'border-box'
  });
  window.scrollTo(0, 0);
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('keyup', '.filter_rows', function () {
    // get the column names
    var cols = jquery__WEBPACK_IMPORTED_MODULE_0__('th.column_heading').map(function () {
      return jquery__WEBPACK_IMPORTED_MODULE_0__(this).text().trim();
    }).get();
    jquery__WEBPACK_IMPORTED_MODULE_0__.uiTableFilter(jquery__WEBPACK_IMPORTED_MODULE_0__('#table_columns'), jquery__WEBPACK_IMPORTED_MODULE_0__(this).val(), cols, null, 'td span');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('.edit').on('click', function () {
    var rownum = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().data('rownum');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#save_' + rownum).show();
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).hide();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td span').hide();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' input, #f_' + rownum + ' select, #f_' + rownum + ' .open_enum_editor').show();
    var attributeVal = jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td[name=col_attribute] span').html();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' select[name=field_attribute\\[' + rownum + '\\] ] option[value="' + attributeVal + '"]').attr('selected', 'selected');

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' .default_type').val() === 'USER_DEFINED') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' .default_type').siblings('.default_value').show();
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' .default_type').siblings('.default_value').hide();
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('.del_row').on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    var $td = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var question = window.Messages.strDeleteCentralColumnWarning;
    $td.confirm(question, null, function () {
      var rownum = $td.data('rownum');
      jquery__WEBPACK_IMPORTED_MODULE_0__('#del_col_name').val('selected_fld%5B%5D=' + jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_row_' + rownum).val());
      jquery__WEBPACK_IMPORTED_MODULE_0__('#del_form').trigger('submit');
    });
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('.edit_cancel_form').on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    var rownum = jquery__WEBPACK_IMPORTED_MODULE_0__(this).data('rownum');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#save_' + rownum).hide();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#edit_' + rownum).show();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td span').show();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' input, #f_' + rownum + ' select,#f_' + rownum + ' .default_value, #f_' + rownum + ' .open_enum_editor').hide();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#tableslistcontainer').find('.checkall').show();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('.edit_save_form').on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    var rownum = jquery__WEBPACK_IMPORTED_MODULE_0__(this).data('rownum');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td').each(function () {
      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('name') !== 'undefined') {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).find(':input[type!="hidden"],select').first().attr('name', jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('name'));
      }
    });

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' .default_type').val() === 'USER_DEFINED') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' .default_type').attr('name', 'col_default_sel');
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' .default_value').attr('name', 'col_default_val');
    }

    var datastring = jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' :input').serialize();
    jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
      type: 'POST',
      url: 'index.php?route=/database/central-columns',
      data: datastring + window.CommonParams.get('arg_separator') + 'ajax_request=true',
      dataType: 'json',
      success: function (data) {
        if (data.message !== '1') {
          Functions.ajaxShowMessage('<div class="alert alert-danger" role="alert">' + data.message + '</div>', false);
        } else {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td input[id=checkbox_row_' + rownum + ']').val(jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' input[name=col_name]').val()).html();
          jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td[name=col_name] span').text(jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' input[name=col_name]').val()).html();
          jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td[name=col_type] span').text(jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' select[name=col_type]').val()).html();
          jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td[name=col_length] span').text(jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' input[name=col_length]').val()).html();
          jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td[name=collation] span').text(jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' select[name=collation]').val()).html();
          jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td[name=col_attribute] span').text(jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' select[name=col_attribute]').val()).html();
          jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td[name=col_isNull] span').text(jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' input[name=col_isNull]').is(':checked') ? 'Yes' : 'No').html();
          jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td[name=col_extra] span').text(jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' input[name=col_extra]').is(':checked') ? 'auto_increment' : '').html();
          jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td[name=col_default] span').text(jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' :input[name=col_default]').val()).html();
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__('#save_' + rownum).hide();
        jquery__WEBPACK_IMPORTED_MODULE_0__('#edit_' + rownum).show();
        jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' td span').show();
        jquery__WEBPACK_IMPORTED_MODULE_0__('#f_' + rownum + ' input, #f_' + rownum + ' select,#f_' + rownum + ' .default_value, #f_' + rownum + ' .open_enum_editor').hide();
        jquery__WEBPACK_IMPORTED_MODULE_0__('#tableslistcontainer').find('.checkall').show();
      },
      error: function () {
        Functions.ajaxShowMessage('<div class="alert alert-danger" role="alert">' + window.Messages.strErrorProcessingRequest + '</div>', false);
      }
    });
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#table-select').on('change', function () {
    var selectValue = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();
    var defaultColumnSelect = jquery__WEBPACK_IMPORTED_MODULE_0__('#column-select').find('option').first();
    var href = 'index.php?route=/database/central-columns/populate';
    var params = {
      'ajax_request': true,
      'server': window.CommonParams.get('server'),
      'db': window.CommonParams.get('db'),
      'selectedTable': selectValue
    };
    jquery__WEBPACK_IMPORTED_MODULE_0__('#column-select').html('<option value="">' + window.Messages.strLoading + '</option>');

    if (selectValue !== '') {
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(href, params, function (data) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#column-select').empty().append(defaultColumnSelect);
        jquery__WEBPACK_IMPORTED_MODULE_0__('#column-select').append(data.message);
      });
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#add_column').on('submit', function (e) {
    var selectvalue = jquery__WEBPACK_IMPORTED_MODULE_0__('#column-select').val();

    if (selectvalue === '') {
      e.preventDefault();
      e.stopPropagation();
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#add_col_div').find('>a').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#add_new').slideToggle('slow');
    var $addColDivLinkSpan = jquery__WEBPACK_IMPORTED_MODULE_0__('#add_col_div').find('>a span');

    if ($addColDivLinkSpan.html() === '+') {
      $addColDivLinkSpan.html('-');
    } else {
      $addColDivLinkSpan.html('+');
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#add_new').on('submit', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#add_new').toggle();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableslistcontainer').find('select.default_type').on('change', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() === 'USER_DEFINED') {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.default_value').attr('name', 'col_default');
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('name', 'col_default_sel');
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('name', 'col_default');
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.default_value').attr('name', 'col_default_val');
    }
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(12));
/******/ }
]);
//# sourceMappingURL=central_columns.js.map