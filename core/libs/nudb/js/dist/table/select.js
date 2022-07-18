"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[67],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 73:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview JavaScript functions used on /table/search
 *
 * @requires    jQuery
 * @requires    js/functions.js
 */

/* global changeValueFieldType, verifyAfterSearchFieldChange */
// js/table/change.js

/* global openGISEditor, loadJSAndGISEditor, loadGISEditor */
// js/gis_data_editor.js

var TableSelect = {};
/**
 * Checks if given data-type is numeric or date.
 *
 * @param {string} dataType Column data-type
 *
 * @return {boolean | string}
 */

TableSelect.checkIfDataTypeNumericOrDate = function (dataType) {
  // To test for numeric data-types.
  var numericRegExp = new RegExp('TINYINT|SMALLINT|MEDIUMINT|INT|BIGINT|DECIMAL|FLOAT|DOUBLE|REAL', 'i'); // To test for date data-types.

  var dateRegExp = new RegExp('DATETIME|DATE|TIMESTAMP|TIME|YEAR', 'i'); // Return matched data-type

  if (numericRegExp.test(dataType)) {
    return numericRegExp.exec(dataType)[0];
  }

  if (dateRegExp.test(dataType)) {
    return dateRegExp.exec(dataType)[0];
  }

  return false;
};
/**
 * Unbind all event handlers before tearing down a page
 */


window.AJAX.registerTeardown('table/select.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#togglesearchformlink').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', '#tbl_search_form.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__('select.geom_func').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'span.open_search_gis_editor');
  jquery__WEBPACK_IMPORTED_MODULE_0__('body').off('change', 'select[name*="criteriaColumnOperators"]'); // Fix for bug #13778, changed 'click' to 'change'
});
window.AJAX.registerOnload('table/select.js', function () {
  /**
   * Prepare a div containing a link, otherwise it's incorrectly displayed
   * after a couple of clicks
   */
  jquery__WEBPACK_IMPORTED_MODULE_0__('<div id="togglesearchformdiv"><a id="togglesearchformlink"></a></div>').insertAfter('#tbl_search_form') // don't show it until we have results on-screen
  .hide();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#togglesearchformlink').html(window.Messages.strShowSearchCriteria).on('click', function () {
    var $link = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#tbl_search_form').slideToggle();

    if ($link.text() === window.Messages.strHideSearchCriteria) {
      $link.text(window.Messages.strShowSearchCriteria);
    } else {
      $link.text(window.Messages.strHideSearchCriteria);
    } // avoid default click action


    return false;
  });
  var tableRows = jquery__WEBPACK_IMPORTED_MODULE_0__('#fieldset_table_qbe select.column-operator');
  jquery__WEBPACK_IMPORTED_MODULE_0__.each(tableRows, function (index, item) {
    jquery__WEBPACK_IMPORTED_MODULE_0__(item).on('change', function () {
      changeValueFieldType(this, index);
      verifyAfterSearchFieldChange(index, '#tbl_search_form');
    });
  });
  /**
   * Ajax event handler for Table search
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '#tbl_search_form.ajax', function (event) {
    var unaryFunctions = ['IS NULL', 'IS NOT NULL', '= \'\'', '!= \'\''];
    var geomUnaryFunctions = ['IsEmpty', 'IsSimple', 'IsRing', 'IsClosed']; // jQuery object to reuse

    var $searchForm = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    event.preventDefault(); // empty previous search results while we are waiting for new results

    jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlqueryresultsouter').empty();
    var $msgbox = Functions.ajaxShowMessage(window.Messages.strSearching, false);
    Functions.prepareForAjaxRequest($searchForm);
    var values = {};
    $searchForm.find(':input').each(function () {
      var $input = jquery__WEBPACK_IMPORTED_MODULE_0__(this);

      if ($input.attr('type') === 'checkbox' || $input.attr('type') === 'radio') {
        if ($input.is(':checked')) {
          values[this.name] = $input.val();
        }
      } else {
        values[this.name] = $input.val();
      }
    });
    var columnCount = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="columnsToDisplay[]"] option').length; // Submit values only for the columns that have unary column operator or a search criteria

    for (var a = 0; a < columnCount; a++) {
      if (jquery__WEBPACK_IMPORTED_MODULE_0__.inArray(values['criteriaColumnOperators[' + a + ']'], unaryFunctions) >= 0) {
        continue;
      }

      if (values['geom_func[' + a + ']'] && jquery__WEBPACK_IMPORTED_MODULE_0__.inArray(values['geom_func[' + a + ']'], geomUnaryFunctions) >= 0) {
        continue;
      }

      if (values['criteriaValues[' + a + ']'] === '' || values['criteriaValues[' + a + ']'] === null) {
        delete values['criteriaValues[' + a + ']'];
        delete values['criteriaColumnOperators[' + a + ']'];
        delete values['criteriaColumnNames[' + a + ']'];
        delete values['criteriaColumnTypes[' + a + ']'];
        delete values['criteriaColumnCollations[' + a + ']'];
      }
    } // If all columns are selected, use a single parameter to indicate that


    if (values['columnsToDisplay[]'] !== null) {
      if (values['columnsToDisplay[]'].length === columnCount) {
        delete values['columnsToDisplay[]'];
        values.displayAllColumns = true;
      }
    } else {
      values.displayAllColumns = true;
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__.post($searchForm.attr('action'), values, function (data) {
      Functions.ajaxRemoveMessage($msgbox);

      if (typeof data !== 'undefined' && data.success === true) {
        if (typeof data.sql_query !== 'undefined') {
          // zero rows
          jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlqueryresultsouter').html(data.sql_query);
        } else {
          // results found
          jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlqueryresultsouter').html(data.message);
          jquery__WEBPACK_IMPORTED_MODULE_0__('.sqlqueryresults').trigger('makegrid');
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__('#tbl_search_form') // workaround for bug #3168569 - Issue on toggling the "Hide search criteria" in chrome.
        .slideToggle().hide();
        jquery__WEBPACK_IMPORTED_MODULE_0__('#togglesearchformlink') // always start with the Show message
        .text(window.Messages.strShowSearchCriteria);
        jquery__WEBPACK_IMPORTED_MODULE_0__('#togglesearchformdiv') // now it's time to show the div containing the link
        .show();
        jquery__WEBPACK_IMPORTED_MODULE_0__('html, body').animate({
          scrollTop: 0
        }, 'fast');
      } else {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlqueryresultsouter').html(data.error);
      }

      Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlqueryresultsouter'));
    }); // end $.post()
  }); // Following section is related to the 'function based search' for geometry data types.
  // Initially hide all the open_gis_editor spans

  jquery__WEBPACK_IMPORTED_MODULE_0__('span.open_search_gis_editor').hide();
  jquery__WEBPACK_IMPORTED_MODULE_0__('select.geom_func').on('change', function () {
    var $geomFuncSelector = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var binaryFunctions = ['Contains', 'Crosses', 'Disjoint', 'Equals', 'Intersects', 'Overlaps', 'Touches', 'Within', 'MBRContains', 'MBRDisjoint', 'MBREquals', 'MBRIntersects', 'MBROverlaps', 'MBRTouches', 'MBRWithin', 'ST_Contains', 'ST_Crosses', 'ST_Disjoint', 'ST_Equals', 'ST_Intersects', 'ST_Overlaps', 'ST_Touches', 'ST_Within'];
    var tempArray = ['Envelope', 'EndPoint', 'StartPoint', 'ExteriorRing', 'Centroid', 'PointOnSurface'];
    var outputGeomFunctions = binaryFunctions.concat(tempArray); // If the chosen function takes two geometry objects as parameters

    var $operator = $geomFuncSelector.parents('tr').find('td').eq(4).find('select');

    if (jquery__WEBPACK_IMPORTED_MODULE_0__.inArray($geomFuncSelector.val(), binaryFunctions) >= 0) {
      $operator.prop('readonly', true);
    } else {
      $operator.prop('readonly', false);
    } // if the chosen function's output is a geometry, enable GIS editor


    var $editorSpan = $geomFuncSelector.parents('tr').find('span.open_search_gis_editor');

    if (jquery__WEBPACK_IMPORTED_MODULE_0__.inArray($geomFuncSelector.val(), outputGeomFunctions) >= 0) {
      $editorSpan.show();
    } else {
      $editorSpan.hide();
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'span.open_search_gis_editor', function (event) {
    event.preventDefault();
    var $span = jquery__WEBPACK_IMPORTED_MODULE_0__(this); // Current value

    var value = $span.parent('td').children('input[type=\'text\']').val(); // Field name

    var field = 'Parameter'; // Column type

    var geomFunc = $span.parents('tr').find('.geom_func').val();
    var type;

    if (geomFunc === 'Envelope') {
      type = 'polygon';
    } else if (geomFunc === 'ExteriorRing') {
      type = 'linestring';
    } else {
      type = 'point';
    } // Names of input field and null checkbox


    var inputName = $span.parent('td').children('input[type=\'text\']').attr('name'); // Token

    openGISEditor();

    if (!window.gisEditorLoaded) {
      loadJSAndGISEditor(value, field, type, inputName);
    } else {
      loadGISEditor(value, field, type, inputName);
    }
  });
  /**
   * Ajax event handler for Range-Search.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('body').on('change', 'select[name*="criteriaColumnOperators"]', function () {
    // Fix for bug #13778, changed 'click' to 'change'
    var $sourceSelect = jquery__WEBPACK_IMPORTED_MODULE_0__(this); // Get the column name.

    var columnName = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('tr').find('th').first().text(); // Get the data-type of column excluding size.

    var dataType = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('tr').find('td[data-type]').attr('data-type');
    dataType = TableSelect.checkIfDataTypeNumericOrDate(dataType); // Get the operator.

    var operator = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();

    if ((operator === 'BETWEEN' || operator === 'NOT BETWEEN') && dataType) {
      var $msgbox = Functions.ajaxShowMessage();
      jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
        url: 'index.php?route=/table/search',
        type: 'POST',
        data: {
          'server': window.CommonParams.get('server'),
          'ajax_request': 1,
          'db': jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="db"]').val(),
          'table': jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table"]').val(),
          'column': columnName,
          'range_search': 1
        },
        success: function (response) {
          Functions.ajaxRemoveMessage($msgbox);

          if (response.success) {
            // Get the column min value.
            var min = response.column_data.min ? '(' + window.Messages.strColumnMin + ' ' + response.column_data.min + ')' : ''; // Get the column max value.

            var max = response.column_data.max ? '(' + window.Messages.strColumnMax + ' ' + response.column_data.max + ')' : '';
            jquery__WEBPACK_IMPORTED_MODULE_0__('#rangeSearchModal').modal('show');
            jquery__WEBPACK_IMPORTED_MODULE_0__('#rangeSearchLegend').first().html(operator);
            jquery__WEBPACK_IMPORTED_MODULE_0__('#rangeSearchMin').first().text(min);
            jquery__WEBPACK_IMPORTED_MODULE_0__('#rangeSearchMax').first().text(max); // Reset input values on reuse

            jquery__WEBPACK_IMPORTED_MODULE_0__('#min_value').first().val('');
            jquery__WEBPACK_IMPORTED_MODULE_0__('#max_value').first().val(''); // Add datepicker wherever required.

            Functions.addDatepicker(jquery__WEBPACK_IMPORTED_MODULE_0__('#min_value'), dataType);
            Functions.addDatepicker(jquery__WEBPACK_IMPORTED_MODULE_0__('#max_value'), dataType);
            jquery__WEBPACK_IMPORTED_MODULE_0__('#rangeSearchModalGo').on('click', function () {
              var minValue = jquery__WEBPACK_IMPORTED_MODULE_0__('#min_value').val();
              var maxValue = jquery__WEBPACK_IMPORTED_MODULE_0__('#max_value').val();
              var finalValue = '';

              if (minValue.length && maxValue.length) {
                finalValue = minValue + ', ' + maxValue;
              }

              var $targetField = $sourceSelect.closest('tr').find('[name*="criteriaValues"]'); // If target field is a select list.

              if ($targetField.is('select')) {
                $targetField.val(finalValue);
                var $options = $targetField.find('option');
                var $closestMin = null;
                var $closestMax = null; // Find closest min and max value.

                $options.each(function () {
                  if ($closestMin === null || Math.abs(jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() - minValue) < Math.abs($closestMin.val() - minValue)) {
                    $closestMin = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
                  }

                  if ($closestMax === null || Math.abs(jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() - maxValue) < Math.abs($closestMax.val() - maxValue)) {
                    $closestMax = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
                  }
                });
                $closestMin.attr('selected', 'selected');
                $closestMax.attr('selected', 'selected');
              } else {
                $targetField.val(finalValue);
              }

              jquery__WEBPACK_IMPORTED_MODULE_0__('#rangeSearchModal').modal('hide');
            });
          } else {
            Functions.ajaxShowMessage(response.error);
          }
        },
        error: function () {
          Functions.ajaxShowMessage(window.Messages.strErrorProcessingRequest);
        }
      });
    }
  });
  var windowWidth = jquery__WEBPACK_IMPORTED_MODULE_0__(window).width();
  jquery__WEBPACK_IMPORTED_MODULE_0__('.jsresponsive').css('max-width', windowWidth - 69 + 'px');
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(73));
/******/ }
]);
//# sourceMappingURL=select.js.map