"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[9],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 14:
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
 * @requires    js/database/query_generator.js
 *
 */

/**
 * js file for handling AJAX and other events in /database/multi-table-query
 */

/**
 * Unbind all event handlers before tearing down a page
 */

window.AJAX.registerTeardown('database/multi_table_query.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('.tableNameSelect').each(function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).off('change');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#update_query_button').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#add_column_button').off('click');
});
window.AJAX.registerOnload('database/multi_table_query.js', function () {
  var editor = Functions.getSqlEditor(jquery__WEBPACK_IMPORTED_MODULE_0__('#MultiSqlquery'), {}, 'both');
  jquery__WEBPACK_IMPORTED_MODULE_0__('.CodeMirror-line').css('text-align', 'left');
  editor.setSize(-1, 50);
  var columnCount = 3;
  addNewColumnCallbacks();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#update_query_button').on('click', function () {
    var columns = [];
    var tableAliases = {};
    jquery__WEBPACK_IMPORTED_MODULE_0__('.tableNameSelect').each(function () {
      var $show = jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.show_col').first();

      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() !== '' && $show.prop('checked')) {
        var tableAlias = jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.table_alias').first().val();
        var columnAlias = jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.col_alias').first().val();

        if (tableAlias !== '') {
          columns.push([tableAlias, jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.columnNameSelect').first().val()]);
        } else {
          columns.push([jquery__WEBPACK_IMPORTED_MODULE_0__(this).val(), jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.columnNameSelect').first().val()]);
        }

        columns[columns.length - 1].push(columnAlias);

        if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() in tableAliases) {
          if (!tableAliases[jquery__WEBPACK_IMPORTED_MODULE_0__(this).val()].includes(tableAlias)) {
            tableAliases[jquery__WEBPACK_IMPORTED_MODULE_0__(this).val()].push(tableAlias);
          }
        } else {
          tableAliases[jquery__WEBPACK_IMPORTED_MODULE_0__(this).val()] = [tableAlias];
        }
      }
    });

    if (Object.keys(tableAliases).length === 0) {
      Functions.ajaxShowMessage('Nothing selected', false, 'error');
      return;
    }

    var foreignKeys;
    jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
      type: 'GET',
      async: false,
      url: 'index.php?route=/database/multi-table-query/tables',
      data: {
        'server': sessionStorage.server,
        'db': jquery__WEBPACK_IMPORTED_MODULE_0__('#db_name').val(),
        'tables': Object.keys(tableAliases),
        'ajax_request': '1',
        'token': window.CommonParams.get('token')
      },
      success: function (response) {
        foreignKeys = response.foreignKeyConstrains;
      }
    });
    var query = 'SELECT ' + '`' + Functions.escapeBacktick(columns[0][0]) + '`.';

    if (columns[0][1] === '*') {
      query += '*';
    } else {
      query += '`' + Functions.escapeBacktick(columns[0][1]) + '`';
    }

    if (columns[0][2] !== '') {
      query += ' AS `' + Functions.escapeBacktick(columns[0][2]) + '`';
    }

    for (var i = 1; i < columns.length; i++) {
      query += ', `' + Functions.escapeBacktick(columns[i][0]) + '`.';

      if (columns[i][1] === '*') {
        query += '*';
      } else {
        query += '`' + Functions.escapeBacktick(columns[i][1]) + '`';
      }

      if (columns[i][2] !== '') {
        query += ' AS `' + Functions.escapeBacktick(columns[i][2]) + '`';
      }
    }

    query += '\nFROM ';
    query += window.generateFromBlock(tableAliases, foreignKeys);
    var $criteriaColCount = jquery__WEBPACK_IMPORTED_MODULE_0__('.criteria_col:checked').length;

    if ($criteriaColCount > 0) {
      query += '\nWHERE ';
      query += window.generateWhereBlock();
    }

    query += ';';
    editor.getDoc().setValue(query);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#submit_query').on('click', function () {
    var query = editor.getDoc().getValue(); // Verifying that the query is not empty

    if (query === '') {
      Functions.ajaxShowMessage(window.Messages.strEmptyQuery, false, 'error');
      return;
    }

    var data = {
      'db': jquery__WEBPACK_IMPORTED_MODULE_0__('#db_name').val(),
      'sql_query': query,
      'ajax_request': '1',
      'server': window.CommonParams.get('server'),
      'token': window.CommonParams.get('token')
    };
    jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
      type: 'POST',
      url: 'index.php?route=/database/multi-table-query/query',
      data: data,
      success: function (data) {
        var $resultsDom = jquery__WEBPACK_IMPORTED_MODULE_0__(data.message);
        $resultsDom.find('.ajax:not(.pageselector)').each(function () {
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).on('click', function (event) {
            event.preventDefault();
          });
        });
        $resultsDom.find('.autosubmit, .pageselector, .showAllRows, .filter_rows').each(function () {
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).on('change click select focus', function (event) {
            event.preventDefault();
          });
        });
        jquery__WEBPACK_IMPORTED_MODULE_0__('#sql_results').html($resultsDom);
        jquery__WEBPACK_IMPORTED_MODULE_0__('#slide-handle').trigger('click'); // Collapse search criteria area
      }
    });
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#add_column_button').on('click', function () {
    columnCount++;
    var $newColumnDom = jquery__WEBPACK_IMPORTED_MODULE_0__(jquery__WEBPACK_IMPORTED_MODULE_0__('#new_column_layout').html()).clone();
    $newColumnDom.find('.jsCriteriaButton').first().attr('data-bs-target', '#criteriaOptionsExtra' + columnCount.toString());
    $newColumnDom.find('.jsCriteriaButton').first().attr('aria-controls', 'criteriaOptionsExtra' + columnCount.toString());
    $newColumnDom.find('.jsCriteriaOptions').first().attr('id', 'criteriaOptionsExtra' + columnCount.toString());
    jquery__WEBPACK_IMPORTED_MODULE_0__('#add_column_button').parent().before($newColumnDom);
    addNewColumnCallbacks();
  });

  function addNewColumnCallbacks() {
    jquery__WEBPACK_IMPORTED_MODULE_0__('.tableNameSelect').each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).on('change', function () {
        var $sibs = jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.columnNameSelect');

        if ($sibs.length === 0) {
          $sibs = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().parent().find('.columnNameSelect');
        }

        $sibs.first().html(jquery__WEBPACK_IMPORTED_MODULE_0__('#' + jquery__WEBPACK_IMPORTED_MODULE_0__(this).find(':selected').data('hash')).html());
      });
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('.jsRemoveColumn').each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).on('click', function () {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().remove();
      });
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('.jsCriteriaButton').each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).on('click', function (event, from) {
        if (from === null) {
          var $checkbox = jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.criteria_col').first();
          $checkbox.prop('checked', !$checkbox.prop('checked'));
        }

        var $criteriaColCount = jquery__WEBPACK_IMPORTED_MODULE_0__('.criteria_col:checked').length;

        if ($criteriaColCount > 1) {
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.jsCriteriaOptions').first().find('.logical_operator').first().css('display', 'table-row');
        }
      });
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('.criteria_col').each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).on('change', function () {
        var $anchor = jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.jsCriteriaButton').first();
        $anchor.trigger('click', ['Trigger']);
      });
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('.criteria_rhs').each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).on('change', function () {
        var $rhsCol = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().parent().siblings('.rhs_table').first();
        var $rhsText = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().parent().siblings('.rhs_text').first();

        if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() === 'text') {
          $rhsCol.css('display', 'none');
          $rhsText.css('display', 'table-row');
        } else if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() === 'anotherColumn') {
          $rhsText.css('display', 'none');
          $rhsCol.css('display', 'table-row');
        } else {
          $rhsText.css('display', 'none');
          $rhsCol.css('display', 'none');
        }
      });
    });
  }
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(14));
/******/ }
]);
//# sourceMappingURL=multi_table_query.js.map