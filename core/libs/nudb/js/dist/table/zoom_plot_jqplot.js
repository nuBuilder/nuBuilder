"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[70],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 76:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
 // TODO: change the axis

/**
 * @fileoverview JavaScript functions used on /table/search
 *
 * @requires    jQuery
 * @requires    js/functions.js
 **/

/* global Sql */

/* global changeValueFieldType, verifyAfterSearchFieldChange */
// js/table/change.js

/**
 *  Display Help/Info
 * @return {false}
 **/

function displayHelp() {
  var modal = jquery__WEBPACK_IMPORTED_MODULE_0__('#helpModal');
  modal.modal('show');
  modal.find('.modal-body').first().html(window.Messages.strDisplayHelp);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#helpModalLabel').first().html(window.Messages.strHelpTitle);
  return false;
}
/**
 * Extend the array object for max function
 * @param {number[]} array
 * @return {int}
 **/


Array.max = function (array) {
  return Math.max.apply(Math, array);
};
/**
 * Extend the array object for min function
 * @param {number[]} array
 * @return {int}
 **/


Array.min = function (array) {
  return Math.min.apply(Math, array);
};
/**
 * Checks if a string contains only numeric value
 * @param {string} n (to be checked)
 * @return {bool}
 **/


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
/**
 ** Checks if an object is empty
 * @param {object} obj (to be checked)
 * @return {bool}
 **/


function isEmpty(obj) {
  var name;

  for (name in obj) {
    return false;
  }

  return true;
}
/**
 * Converts a date/time into timestamp
 * @param {string} val Date
 * @param {string} type Field type(datetime/timestamp/time/date)
 * @return {any} A value
 **/


function getTimeStamp(val, type) {
  if (type.toString().search(/datetime/i) !== -1 || type.toString().search(/timestamp/i) !== -1) {
    return jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.parseDateTime('yy-mm-dd', 'HH:mm:ss', val);
  } else if (type.toString().search(/time/i) !== -1) {
    return jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.parseDateTime('yy-mm-dd', 'HH:mm:ss', '1970-01-01 ' + val);
  } else if (type.toString().search(/date/i) !== -1) {
    return jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.parseDate('yy-mm-dd', val);
  }
}
/**
 * Classifies the field type into numeric,timeseries or text
 * @param {object} field field type (as in database structure)
 * @return {'text'|'numeric'|'time'}
 **/


function getType(field) {
  if (field.toString().search(/int/i) !== -1 || field.toString().search(/decimal/i) !== -1 || field.toString().search(/year/i) !== -1) {
    return 'numeric';
  } else if (field.toString().search(/time/i) !== -1 || field.toString().search(/date/i) !== -1) {
    return 'time';
  } else {
    return 'text';
  }
}
/**
 * Unbind all event handlers before tearing down a page
 */


window.AJAX.registerTeardown('table/zoom_plot_jqplot.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_0').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_1').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_2').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_3').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#inputFormSubmitId').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#togglesearchformlink').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('keydown', '#dataDisplay :input');
  jquery__WEBPACK_IMPORTED_MODULE_0__('button.button-reset').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('div#resizer').off('resizestop');
  jquery__WEBPACK_IMPORTED_MODULE_0__('div#querychart').off('jqplotDataClick');
});
window.AJAX.registerOnload('table/zoom_plot_jqplot.js', function () {
  var currentChart = null;
  var searchedDataKey = null;
  var xLabel = jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_0').val();
  var yLabel = jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_1').val(); // will be updated via Ajax

  var xType = jquery__WEBPACK_IMPORTED_MODULE_0__('#types_0').val();
  var yType = jquery__WEBPACK_IMPORTED_MODULE_0__('#types_1').val();
  var dataLabel = jquery__WEBPACK_IMPORTED_MODULE_0__('#dataLabel').val(); // Get query result

  var searchedData;

  try {
    searchedData = JSON.parse(jquery__WEBPACK_IMPORTED_MODULE_0__('#querydata').html());
  } catch (err) {
    searchedData = null;
  } // adding event listener on select after AJAX request


  var comparisonOperatorOnChange = function () {
    var tableRows = jquery__WEBPACK_IMPORTED_MODULE_0__('#inputSection select.column-operator');
    jquery__WEBPACK_IMPORTED_MODULE_0__.each(tableRows, function (index, item) {
      jquery__WEBPACK_IMPORTED_MODULE_0__(item).on('change', function () {
        changeValueFieldType(this, index);
        verifyAfterSearchFieldChange(index, '#zoom_search_form');
      });
    });
  };
  /**
   ** Input form submit on field change
   **/
  // first column choice corresponds to the X axis


  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_0').on('change', function () {
    // AJAX request for field type, collation, operators, and value field
    jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/table/zoom-search', {
      'ajax_request': true,
      'change_tbl_info': true,
      'server': window.CommonParams.get('server'),
      'db': window.CommonParams.get('db'),
      'table': window.CommonParams.get('table'),
      'field': jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_0').val(),
      'it': 0
    }, function (data) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(1).find('td').eq(0).html(data.field_type);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(1).find('td').eq(1).html(data.field_collation);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(1).find('td').eq(2).html(data.field_operators);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(1).find('td').eq(3).html(data.field_value);
      xLabel = jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_0').val();
      jquery__WEBPACK_IMPORTED_MODULE_0__('#types_0').val(data.field_type);
      xType = data.field_type;
      jquery__WEBPACK_IMPORTED_MODULE_0__('#collations_0').val(data.field_collations);
      comparisonOperatorOnChange();
      Functions.addDateTimePicker();
    });
  }); // second column choice corresponds to the Y axis

  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_1').on('change', function () {
    // AJAX request for field type, collation, operators, and value field
    jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/table/zoom-search', {
      'ajax_request': true,
      'change_tbl_info': true,
      'server': window.CommonParams.get('server'),
      'db': window.CommonParams.get('db'),
      'table': window.CommonParams.get('table'),
      'field': jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_1').val(),
      'it': 1
    }, function (data) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(2).find('td').eq(0).html(data.field_type);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(2).find('td').eq(1).html(data.field_collation);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(2).find('td').eq(2).html(data.field_operators);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(2).find('td').eq(3).html(data.field_value);
      yLabel = jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_1').val();
      jquery__WEBPACK_IMPORTED_MODULE_0__('#types_1').val(data.field_type);
      yType = data.field_type;
      jquery__WEBPACK_IMPORTED_MODULE_0__('#collations_1').val(data.field_collations);
      comparisonOperatorOnChange();
      Functions.addDateTimePicker();
    });
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_2').on('change', function () {
    // AJAX request for field type, collation, operators, and value field
    jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/table/zoom-search', {
      'ajax_request': true,
      'change_tbl_info': true,
      'server': window.CommonParams.get('server'),
      'db': window.CommonParams.get('db'),
      'table': window.CommonParams.get('table'),
      'field': jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_2').val(),
      'it': 2
    }, function (data) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(4).find('td').eq(0).html(data.field_type);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(4).find('td').eq(1).html(data.field_collation);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(4).find('td').eq(2).html(data.field_operators);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(4).find('td').eq(3).html(data.field_value);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#types_2').val(data.field_type);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#collations_2').val(data.field_collations);
      comparisonOperatorOnChange();
      Functions.addDateTimePicker();
    });
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_3').on('change', function () {
    // AJAX request for field type, collation, operators, and value field
    jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/table/zoom-search', {
      'ajax_request': true,
      'change_tbl_info': true,
      'server': window.CommonParams.get('server'),
      'db': window.CommonParams.get('db'),
      'table': window.CommonParams.get('table'),
      'field': jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_3').val(),
      'it': 3
    }, function (data) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(5).find('td').eq(0).html(data.field_type);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(5).find('td').eq(1).html(data.field_collation);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(5).find('td').eq(2).html(data.field_operators);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#tableFieldsId').find('tr').eq(5).find('td').eq(3).html(data.field_value);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#types_3').val(data.field_type);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#collations_3').val(data.field_collations);
      comparisonOperatorOnChange();
      Functions.addDateTimePicker();
    });
  });
  /**
   * Input form validation
   **/

  jquery__WEBPACK_IMPORTED_MODULE_0__('#inputFormSubmitId').on('click', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_0').get(0).selectedIndex === 0 || jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_1').get(0).selectedIndex === 0) {
      Functions.ajaxShowMessage(window.Messages.strInputNull);
    } else if (xLabel === yLabel) {
      Functions.ajaxShowMessage(window.Messages.strSameInputs);
    }
  });
  /**
    ** Prepare a div containing a link, otherwise it's incorrectly displayed
    ** after a couple of clicks
    **/

  jquery__WEBPACK_IMPORTED_MODULE_0__('<div id="togglesearchformdiv"><a id="togglesearchformlink"></a></div>').insertAfter('#zoom_search_form') // don't show it until we have results on-screen
  .hide();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#togglesearchformlink').html(window.Messages.strShowSearchCriteria).on('click', function () {
    var $link = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#zoom_search_form').slideToggle();

    if ($link.text() === window.Messages.strHideSearchCriteria) {
      $link.text(window.Messages.strShowSearchCriteria);
    } else {
      $link.text(window.Messages.strHideSearchCriteria);
    } // avoid default click action


    return false;
  });
  /**
   * Handle saving of a row in the editor
   */

  var dataPointSave = function () {
    // Find changed values by comparing form values with selectedRow Object
    var newValues = {}; // Stores the values changed from original

    var sqlTypes = {};
    var it = 0;
    var xChange = false;
    var yChange = false;
    var key;

    var tempGetVal = function () {
      return jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();
    };

    for (key in selectedRow) {
      var oldVal = selectedRow[key];
      var newVal = jquery__WEBPACK_IMPORTED_MODULE_0__('#edit_fields_null_id_' + it).prop('checked') ? null : jquery__WEBPACK_IMPORTED_MODULE_0__('#edit_fieldID_' + it).val();

      if (newVal instanceof Array) {
        // when the column is of type SET
        newVal = jquery__WEBPACK_IMPORTED_MODULE_0__('#edit_fieldID_' + it).map(tempGetVal).get().join(',');
      }

      if (oldVal !== newVal) {
        selectedRow[key] = newVal;
        newValues[key] = newVal;

        if (key === xLabel) {
          xChange = true;
          searchedData[searchedDataKey][xLabel] = newVal;
        } else if (key === yLabel) {
          yChange = true;
          searchedData[searchedDataKey][yLabel] = newVal;
        }
      }

      var $input = jquery__WEBPACK_IMPORTED_MODULE_0__('#edit_fieldID_' + it);

      if ($input.hasClass('bit')) {
        sqlTypes[key] = 'bit';
      } else {
        sqlTypes[key] = null;
      }

      it++;
    } // End data update
    // Update the chart series and replot


    if (xChange || yChange) {
      // Logic similar to plot generation, replot only if xAxis changes or yAxis changes.
      // Code includes a lot of checks so as to replot only when necessary
      if (xChange) {
        xCord[searchedDataKey] = selectedRow[xLabel]; // [searchedDataKey][0] contains the x value

        if (xType === 'numeric') {
          series[0][searchedDataKey][0] = selectedRow[xLabel];
        } else if (xType === 'time') {
          series[0][searchedDataKey][0] = getTimeStamp(selectedRow[xLabel], jquery__WEBPACK_IMPORTED_MODULE_0__('#types_0').val());
        } else {
          series[0][searchedDataKey][0] = ''; // TODO: text values
        }

        currentChart.series[0].data = series[0]; // TODO: axis changing

        currentChart.replot();
      }

      if (yChange) {
        yCord[searchedDataKey] = selectedRow[yLabel]; // [searchedDataKey][1] contains the y value

        if (yType === 'numeric') {
          series[0][searchedDataKey][1] = selectedRow[yLabel];
        } else if (yType === 'time') {
          series[0][searchedDataKey][1] = getTimeStamp(selectedRow[yLabel], jquery__WEBPACK_IMPORTED_MODULE_0__('#types_1').val());
        } else {
          series[0][searchedDataKey][1] = ''; // TODO: text values
        }

        currentChart.series[0].data = series[0]; // TODO: axis changing

        currentChart.replot();
      }
    } // End plot update
    // Generate SQL query for update


    if (!isEmpty(newValues)) {
      var sqlQuery = 'UPDATE `' + window.CommonParams.get('table') + '` SET ';

      for (key in newValues) {
        sqlQuery += '`' + key + '`=';
        var value = newValues[key]; // null

        if (value === null) {
          sqlQuery += 'NULL, '; // empty
        } else if (value.trim() === '') {
          sqlQuery += '\'\', '; // other
        } else {
          // type explicitly identified
          if (sqlTypes[key] !== null) {
            if (sqlTypes[key] === 'bit') {
              sqlQuery += 'b\'' + value + '\', ';
            } // type not explicitly identified

          } else {
            if (!isNumeric(value)) {
              sqlQuery += '\'' + value + '\', ';
            } else {
              sqlQuery += value + ', ';
            }
          }
        }
      } // remove two extraneous characters ', '


      sqlQuery = sqlQuery.substring(0, sqlQuery.length - 2);
      sqlQuery += ' WHERE ' + Sql.urlDecode(searchedData[searchedDataKey].where_clause);
      jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/sql', {
        'server': window.CommonParams.get('server'),
        'db': window.CommonParams.get('db'),
        'ajax_request': true,
        'sql_query': sqlQuery,
        'inline_edit': false
      }, function (data) {
        if (typeof data !== 'undefined' && data.success === true) {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlqueryresultsouter').html(data.sql_query);
          Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlqueryresultsouter'));
        } else {
          Functions.ajaxShowMessage(data.error, false);
        }
      }); // End $.post
    } // End database update

  };

  jquery__WEBPACK_IMPORTED_MODULE_0__('#dataPointSaveButton').on('click', function () {
    dataPointSave();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#dataPointModalLabel').first().html(window.Messages.strDataPointContent);
  /**
   * Attach Ajax event handlers for input fields
   * in the dialog. Used to submit the Ajax
   * request when the ENTER key is pressed.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('keydown', '#dataDisplay :input', function (e) {
    if (e.which === 13) {
      // 13 is the ENTER key
      e.preventDefault();

      if (typeof dataPointSave === 'function') {
        dataPointSave();
      }
    }
  });
  /*
   * Generate plot using jqplot
   */

  if (searchedData !== null) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#zoom_search_form').slideToggle().hide();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#togglesearchformlink').text(window.Messages.strShowSearchCriteria);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#togglesearchformdiv').show();
    var selectedRow;
    var series = [];
    var xCord = [];
    var yCord = [];
    var xVal;
    var yVal;
    var format;
    var options = {
      series: [// for a scatter plot
      {
        showLine: false
      }],
      grid: {
        drawBorder: false,
        shadow: false,
        background: 'rgba(0,0,0,0)'
      },
      axes: {
        xaxis: {
          label: jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_0').val(),
          labelRenderer: jquery__WEBPACK_IMPORTED_MODULE_0__.jqplot.CanvasAxisLabelRenderer
        },
        yaxis: {
          label: jquery__WEBPACK_IMPORTED_MODULE_0__('#tableid_1').val(),
          labelRenderer: jquery__WEBPACK_IMPORTED_MODULE_0__.jqplot.CanvasAxisLabelRenderer
        }
      },
      highlighter: {
        show: true,
        tooltipAxes: 'y',
        yvalues: 2,
        // hide the first y value
        formatString: '<span class="hide">%s</span>%s'
      },
      cursor: {
        show: true,
        zoom: true,
        showTooltip: false
      }
    }; // If data label is not set, do not show tooltips

    if (dataLabel === '') {
      options.highlighter.show = false;
    } // Classify types as either numeric,time,text


    xType = getType(xType);
    yType = getType(yType); // could have multiple series but we'll have just one

    series[0] = [];

    if (xType === 'time') {
      var originalXType = jquery__WEBPACK_IMPORTED_MODULE_0__('#types_0').val();

      if (originalXType === 'date') {
        format = '%Y-%m-%d';
      } // TODO: does not seem to work
      // else if (originalXType === 'time') {
      //  format = '%H:%M';
      // } else {
      //    format = '%Y-%m-%d %H:%M';
      // }


      jquery__WEBPACK_IMPORTED_MODULE_0__.extend(options.axes.xaxis, {
        renderer: jquery__WEBPACK_IMPORTED_MODULE_0__.jqplot.DateAxisRenderer,
        tickOptions: {
          formatString: format
        }
      });
    }

    if (yType === 'time') {
      var originalYType = jquery__WEBPACK_IMPORTED_MODULE_0__('#types_1').val();

      if (originalYType === 'date') {
        format = '%Y-%m-%d';
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__.extend(options.axes.yaxis, {
        renderer: jquery__WEBPACK_IMPORTED_MODULE_0__.jqplot.DateAxisRenderer,
        tickOptions: {
          formatString: format
        }
      });
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__.each(searchedData, function (key, value) {
      if (xType === 'numeric') {
        xVal = parseFloat(value[xLabel]);
      }

      if (xType === 'time') {
        xVal = getTimeStamp(value[xLabel], originalXType);
      }

      if (yType === 'numeric') {
        yVal = parseFloat(value[yLabel]);
      }

      if (yType === 'time') {
        yVal = getTimeStamp(value[yLabel], originalYType);
      }

      series[0].push([xVal, yVal, // extra Y values
      value[dataLabel], // for highlighter
      // (may set an undefined value)
      value.where_clause, // for click on point
      key, // key from searchedData
      value.where_clause_sign]);
    }); // under IE 8, the initial display is mangled; after a manual
    // resizing, it's ok
    // under IE 9, everything is fine

    currentChart = jquery__WEBPACK_IMPORTED_MODULE_0__.jqplot('querychart', series, options);
    currentChart.resetZoom();
    jquery__WEBPACK_IMPORTED_MODULE_0__('button.button-reset').on('click', function (event) {
      event.preventDefault();
      currentChart.resetZoom();
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('div#resizer').resizable();
    jquery__WEBPACK_IMPORTED_MODULE_0__('div#resizer').on('resizestop', function () {
      // make room so that the handle will still appear
      jquery__WEBPACK_IMPORTED_MODULE_0__('div#querychart').height(jquery__WEBPACK_IMPORTED_MODULE_0__('div#resizer').height() * 0.96);
      jquery__WEBPACK_IMPORTED_MODULE_0__('div#querychart').width(jquery__WEBPACK_IMPORTED_MODULE_0__('div#resizer').width() * 0.96);
      currentChart.replot({
        resetAxes: true
      });
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('div#querychart').on('jqplotDataClick', function (event, seriesIndex, pointIndex, data) {
      searchedDataKey = data[4]; // key from searchedData (global)

      var fieldId = 0;
      var postParams = {
        'ajax_request': true,
        'get_data_row': true,
        'server': window.CommonParams.get('server'),
        'db': window.CommonParams.get('db'),
        'table': window.CommonParams.get('table'),
        'where_clause': data[3],
        'where_clause_sign': data[5]
      };
      jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/table/zoom-search', postParams, function (data) {
        // Row is contained in data.row_info,
        // now fill the displayResultForm with row values
        var key;

        for (key in data.row_info) {
          var $field = jquery__WEBPACK_IMPORTED_MODULE_0__('#edit_fieldID_' + fieldId);
          var $fieldNull = jquery__WEBPACK_IMPORTED_MODULE_0__('#edit_fields_null_id_' + fieldId);

          if (data.row_info[key] === null) {
            $fieldNull.prop('checked', true);
            $field.val('');
          } else {
            $fieldNull.prop('checked', false);

            if ($field.attr('multiple')) {
              // when the column is of type SET
              $field.val(data.row_info[key].split(','));
            } else {
              $field.val(data.row_info[key]);
            }
          }

          fieldId++;
        }

        selectedRow = data.row_info;
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#dataPointModal').modal('show');
    });
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__('#help_dialog').on('click', function () {
    displayHelp();
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(76));
/******/ }
]);
//# sourceMappingURL=zoom_plot_jqplot.js.map