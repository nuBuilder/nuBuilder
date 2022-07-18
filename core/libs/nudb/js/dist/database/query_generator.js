"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[12],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 17:
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

function getFormatsText() {
  return {
    '=': ' = \'%s\'',
    '>': ' > \'%s\'',
    '>=': ' >= \'%s\'',
    '<': ' < \'%s\'',
    '<=': ' <= \'%s\'',
    '!=': ' != \'%s\'',
    'LIKE': ' LIKE \'%s\'',
    'LIKE %...%': ' LIKE \'%%%s%%\'',
    'NOT LIKE': ' NOT LIKE \'%s\'',
    'NOT LIKE %...%': ' NOT LIKE \'%%%s%%\'',
    'BETWEEN': ' BETWEEN \'%s\'',
    'NOT BETWEEN': ' NOT BETWEEN \'%s\'',
    'IS NULL': ' \'%s\' IS NULL',
    'IS NOT NULL': ' \'%s\' IS NOT NULL',
    'REGEXP': ' REGEXP \'%s\'',
    'REGEXP ^...$': ' REGEXP \'^%s$\'',
    'NOT REGEXP': ' NOT REGEXP \'%s\''
  };
}

function generateCondition(criteriaDiv, table) {
  var query = '`' + Functions.escapeBacktick(table.val()) + '`.';
  query += '`' + Functions.escapeBacktick(table.siblings('.columnNameSelect').first().val()) + '`';

  if (criteriaDiv.find('.criteria_rhs').first().val() === 'text') {
    var formatsText = getFormatsText();
    query += window.sprintf(formatsText[criteriaDiv.find('.criteria_op').first().val()], Functions.escapeSingleQuote(criteriaDiv.find('.rhs_text_val').first().val()));
  } else {
    query += ' ' + criteriaDiv.find('.criteria_op').first().val();
    query += ' `' + Functions.escapeBacktick(criteriaDiv.find('.tableNameSelect').first().val()) + '`.';
    query += '`' + Functions.escapeBacktick(criteriaDiv.find('.columnNameSelect').first().val()) + '`';
  }

  return query;
}

window.generateWhereBlock = function () {
  var count = 0;
  var query = '';
  jquery__WEBPACK_IMPORTED_MODULE_0__('.tableNameSelect').each(function () {
    var criteriaDiv = jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.jsCriteriaOptions').first();
    var useCriteria = jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('.criteria_col').first();

    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() !== '' && useCriteria.prop('checked')) {
      if (count > 0) {
        criteriaDiv.find('input.logical_op').each(function () {
          if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).prop('checked')) {
            query += ' ' + jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() + ' ';
          }
        });
      }

      query += generateCondition(criteriaDiv, jquery__WEBPACK_IMPORTED_MODULE_0__(this));
      count++;
    }
  });
  return query;
};

function generateJoin(newTable, tableAliases, fk) {
  var query = '';
  query += ' \n\tLEFT JOIN ' + '`' + Functions.escapeBacktick(newTable) + '`';

  if (tableAliases[fk.TABLE_NAME][0] !== '') {
    query += ' AS `' + Functions.escapeBacktick(tableAliases[newTable][0]) + '`';
    query += ' ON `' + Functions.escapeBacktick(tableAliases[fk.TABLE_NAME][0]) + '`';
  } else {
    query += ' ON `' + Functions.escapeBacktick(fk.TABLE_NAME) + '`';
  }

  query += '.`' + fk.COLUMN_NAME + '`';

  if (tableAliases[fk.REFERENCED_TABLE_NAME][0] !== '') {
    query += ' = `' + Functions.escapeBacktick(tableAliases[fk.REFERENCED_TABLE_NAME][0]) + '`';
  } else {
    query += ' = `' + Functions.escapeBacktick(fk.REFERENCED_TABLE_NAME) + '`';
  }

  query += '.`' + fk.REFERENCED_COLUMN_NAME + '`';
  return query;
}

function existReference(table, fk, usedTables) {
  var isReferredBy = fk.TABLE_NAME === table && usedTables.includes(fk.REFERENCED_TABLE_NAME);
  var isReferencedBy = fk.REFERENCED_TABLE_NAME === table && usedTables.includes(fk.TABLE_NAME);
  return isReferredBy || isReferencedBy;
}

function tryJoinTable(table, tableAliases, usedTables, foreignKeys) {
  for (var i = 0; i < foreignKeys.length; i++) {
    var fk = foreignKeys[i];

    if (existReference(table, fk, usedTables)) {
      return generateJoin(table, tableAliases, fk);
    }
  }

  return '';
}

function appendTable(table, tableAliases, usedTables, foreignKeys) {
  var query = tryJoinTable(table, tableAliases, usedTables, foreignKeys);

  if (query === '') {
    if (usedTables.length > 0) {
      query += '\n\t, ';
    }

    query += '`' + Functions.escapeBacktick(table) + '`';

    if (tableAliases[table][0] !== '') {
      query += ' AS `' + Functions.escapeBacktick(tableAliases[table][0]) + '`';
    }
  }

  usedTables.push(table);
  return query;
}

window.generateFromBlock = (tableAliases, foreignKeys) => {
  var usedTables = [];
  var query = '';

  for (var table in tableAliases) {
    if (tableAliases.hasOwnProperty(table)) {
      query += appendTable(table, tableAliases, usedTables, foreignKeys);
    }
  }

  return query;
};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(17));
/******/ }
]);
//# sourceMappingURL=query_generator.js.map