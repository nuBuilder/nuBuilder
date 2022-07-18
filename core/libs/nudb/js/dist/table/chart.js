"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[62],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 68:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/* global ColumnType, DataTable, JQPlotChartFactory */
// js/chart.js

var chartData = {};
var tempChartTitle;
var currentChart = null;
var currentSettings = null;
var dateTimeCols = [];
var numericCols = [];

function extractDate(dateString) {
  var matches;
  var match;
  var dateTimeRegExp = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/;
  var dateRegExp = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
  matches = dateTimeRegExp.exec(dateString);

  if (matches !== null && matches.length > 0) {
    match = matches[0];
    return new Date(match.substring(0, 4), parseInt(match.substring(5, 7), 10) - 1, match.substring(8, 10), match.substring(11, 13), match.substring(14, 16), match.substring(17, 19));
  } else {
    matches = dateRegExp.exec(dateString);

    if (matches !== null && matches.length > 0) {
      match = matches[0];
      return new Date(match.substring(0, 4), parseInt(match.substring(5, 7), 10) - 1, match.substring(8, 10));
    }
  }

  return null;
}

function queryChart(data, columnNames, settings) {
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#querychart').length === 0) {
    return;
  }

  var plotSettings = {
    title: {
      text: settings.title,
      escapeHtml: true
    },
    grid: {
      drawBorder: false,
      shadow: false,
      background: 'rgba(0,0,0,0)'
    },
    legend: {
      show: true,
      placement: 'outsideGrid',
      location: 'e',
      rendererOptions: {
        numberColumns: 2
      }
    },
    axes: {
      xaxis: {
        label: Functions.escapeHtml(settings.xaxisLabel)
      },
      yaxis: {
        label: settings.yaxisLabel
      }
    },
    stackSeries: settings.stackSeries
  }; // create the chart

  var factory = new JQPlotChartFactory();
  var chart = factory.createChart(settings.type, 'querychart'); // create the data table and add columns

  var dataTable = new DataTable();

  if (settings.type === 'timeline') {
    dataTable.addColumn(ColumnType.DATE, columnNames[settings.mainAxis]);
  } else if (settings.type === 'scatter') {
    dataTable.addColumn(ColumnType.NUMBER, columnNames[settings.mainAxis]);
  } else {
    dataTable.addColumn(ColumnType.STRING, columnNames[settings.mainAxis]);
  }

  var i;
  var values = [];

  if (settings.seriesColumn === null) {
    jquery__WEBPACK_IMPORTED_MODULE_0__.each(settings.selectedSeries, function (index, element) {
      dataTable.addColumn(ColumnType.NUMBER, columnNames[element]);
    }); // set data to the data table

    var columnsToExtract = [settings.mainAxis];
    jquery__WEBPACK_IMPORTED_MODULE_0__.each(settings.selectedSeries, function (index, element) {
      columnsToExtract.push(element);
    });
    var newRow;
    var row;
    var col;

    for (i = 0; i < data.length; i++) {
      row = data[i];
      newRow = [];

      for (var j = 0; j < columnsToExtract.length; j++) {
        col = columnNames[columnsToExtract[j]];

        if (j === 0) {
          if (settings.type === 'timeline') {
            // first column is date type
            newRow.push(extractDate(row[col]));
          } else if (settings.type === 'scatter') {
            newRow.push(parseFloat(row[col]));
          } else {
            // first column is string type
            newRow.push(row[col]);
          }
        } else {
          // subsequent columns are of type, number
          newRow.push(parseFloat(row[col]));
        }
      }

      values.push(newRow);
    }

    dataTable.setData(values);
  } else {
    var seriesNames = {};
    var seriesNumber = 1;
    var seriesColumnName = columnNames[settings.seriesColumn];

    for (i = 0; i < data.length; i++) {
      if (!seriesNames[data[i][seriesColumnName]]) {
        seriesNames[data[i][seriesColumnName]] = seriesNumber;
        seriesNumber++;
      }
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__.each(seriesNames, function (seriesName) {
      dataTable.addColumn(ColumnType.NUMBER, seriesName);
    });
    var valueMap = {};
    var xValue;
    var value;
    var mainAxisName = columnNames[settings.mainAxis];
    var valueColumnName = columnNames[settings.valueColumn];

    for (i = 0; i < data.length; i++) {
      xValue = data[i][mainAxisName];
      value = valueMap[xValue];

      if (!value) {
        value = [xValue];
        valueMap[xValue] = value;
      }

      seriesNumber = seriesNames[data[i][seriesColumnName]];
      value[seriesNumber] = parseFloat(data[i][valueColumnName]);
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__.each(valueMap, function (index, value) {
      values.push(value);
    });
    dataTable.setData(values);
  } // draw the chart and return the chart object


  chart.draw(dataTable, plotSettings);
  return chart;
}

function drawChart() {
  currentSettings.width = jquery__WEBPACK_IMPORTED_MODULE_0__('#resizer').width() - 20;
  currentSettings.height = jquery__WEBPACK_IMPORTED_MODULE_0__('#resizer').height() - 20; // TODO: a better way using .redraw() ?

  if (currentChart !== null) {
    currentChart.destroy();
  }

  var columnNames = [];
  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartXAxisSelect option').each(function () {
    columnNames.push(Functions.escapeHtml(jquery__WEBPACK_IMPORTED_MODULE_0__(this).text()));
  });

  try {
    currentChart = queryChart(chartData, columnNames, currentSettings);

    if (currentChart !== null) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#saveChart').attr('href', currentChart.toImageString());
    }
  } catch (err) {
    Functions.ajaxShowMessage(err.message, false);
  }
}

function getSelectedSeries() {
  var val = jquery__WEBPACK_IMPORTED_MODULE_0__('#chartSeriesSelect').val() || [];
  var ret = [];
  jquery__WEBPACK_IMPORTED_MODULE_0__.each(val, function (i, v) {
    ret.push(parseInt(v, 10));
  });
  return ret;
}

function onXAxisChange() {
  var $xAxisSelect = jquery__WEBPACK_IMPORTED_MODULE_0__('#chartXAxisSelect');
  currentSettings.mainAxis = parseInt($xAxisSelect.val(), 10);

  if (dateTimeCols.indexOf(currentSettings.mainAxis) !== -1) {
    document.getElementById('timelineChartType').classList.remove('d-none');
  } else {
    document.getElementById('timelineChartType').classList.add('d-none');

    if (currentSettings.type === 'timeline') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#lineChartTypeRadio').prop('checked', true);
      currentSettings.type = 'line';
    }
  }

  if (numericCols.indexOf(currentSettings.mainAxis) !== -1) {
    document.getElementById('scatterChartType').classList.remove('d-none');
  } else {
    document.getElementById('scatterChartType').classList.add('d-none');

    if (currentSettings.type === 'scatter') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#lineChartTypeRadio').prop('checked', true);
      currentSettings.type = 'line';
    }
  }

  var xAxisTitle = $xAxisSelect.children('option:selected').text();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#xAxisLabelInput').val(xAxisTitle);
  currentSettings.xaxisLabel = xAxisTitle;
}

function onDataSeriesChange() {
  var $seriesSelect = jquery__WEBPACK_IMPORTED_MODULE_0__('#chartSeriesSelect');
  currentSettings.selectedSeries = getSelectedSeries();
  var yAxisTitle;

  if (currentSettings.selectedSeries.length === 1) {
    document.getElementById('pieChartType').classList.remove('d-none');
    yAxisTitle = $seriesSelect.children('option:selected').text();
  } else {
    document.getElementById('pieChartType').classList.add('d-none');

    if (currentSettings.type === 'pie') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#lineChartTypeRadio').prop('checked', true);
      currentSettings.type = 'line';
    }

    yAxisTitle = window.Messages.strYValues;
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__('#yAxisLabelInput').val(yAxisTitle);
  currentSettings.yaxisLabel = yAxisTitle;
}
/**
 * Unbind all event handlers before tearing down a page
 */


window.AJAX.registerTeardown('table/chart.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartType"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#barStackedCheckbox').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#seriesColumnCheckbox').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartTitleInput').off('focus').off('keyup').off('blur');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartXAxisSelect').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartSeriesSelect').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartSeriesColumnSelect').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartValueColumnSelect').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#xAxisLabelInput').off('keyup');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#yAxisLabelInput').off('keyup');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#resizer').off('resizestop');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tblchartform').off('submit');
});
window.AJAX.registerOnload('table/chart.js', function () {
  // handle manual resize
  jquery__WEBPACK_IMPORTED_MODULE_0__('#resizer').on('resizestop', function () {
    // make room so that the handle will still appear
    jquery__WEBPACK_IMPORTED_MODULE_0__('#querychart').height(jquery__WEBPACK_IMPORTED_MODULE_0__('#resizer').height() * 0.96);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#querychart').width(jquery__WEBPACK_IMPORTED_MODULE_0__('#resizer').width() * 0.96);

    if (currentChart !== null) {
      currentChart.redraw({
        resetAxes: true
      });
    }
  }); // handle chart type changes

  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartType"]').on('click', function () {
    var type = currentSettings.type = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();

    if (type === 'bar' || type === 'column' || type === 'area') {
      document.getElementById('barStacked').classList.remove('d-none');
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#barStackedCheckbox').prop('checked', false);
      jquery__WEBPACK_IMPORTED_MODULE_0__.extend(true, currentSettings, {
        stackSeries: false
      });
      document.getElementById('barStacked').classList.add('d-none');
    }

    drawChart();
  }); // handle chosing alternative data format

  jquery__WEBPACK_IMPORTED_MODULE_0__('#seriesColumnCheckbox').on('click', function () {
    var $seriesColumn = jquery__WEBPACK_IMPORTED_MODULE_0__('#chartSeriesColumnSelect');
    var $valueColumn = jquery__WEBPACK_IMPORTED_MODULE_0__('#chartValueColumnSelect');
    var $chartSeries = jquery__WEBPACK_IMPORTED_MODULE_0__('#chartSeriesSelect');

    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).is(':checked')) {
      $seriesColumn.prop('disabled', false);
      $valueColumn.prop('disabled', false);
      $chartSeries.prop('disabled', true);
      currentSettings.seriesColumn = parseInt($seriesColumn.val(), 10);
      currentSettings.valueColumn = parseInt($valueColumn.val(), 10);
    } else {
      $seriesColumn.prop('disabled', true);
      $valueColumn.prop('disabled', true);
      $chartSeries.prop('disabled', false);
      currentSettings.seriesColumn = null;
      currentSettings.valueColumn = null;
    }

    drawChart();
  }); // handle stacking for bar, column and area charts

  jquery__WEBPACK_IMPORTED_MODULE_0__('#barStackedCheckbox').on('click', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).is(':checked')) {
      jquery__WEBPACK_IMPORTED_MODULE_0__.extend(true, currentSettings, {
        stackSeries: true
      });
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__.extend(true, currentSettings, {
        stackSeries: false
      });
    }

    drawChart();
  }); // handle changes in chart title

  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartTitleInput').on('focus', function () {
    tempChartTitle = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();
  }).on('keyup', function () {
    currentSettings.title = jquery__WEBPACK_IMPORTED_MODULE_0__('#chartTitleInput').val();
    drawChart();
  }).on('blur', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() !== tempChartTitle) {
      drawChart();
    }
  }); // handle changing the x-axis

  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartXAxisSelect').on('change', function () {
    onXAxisChange();
    drawChart();
  }); // handle changing the selected data series

  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartSeriesSelect').on('change', function () {
    onDataSeriesChange();
    drawChart();
  }); // handle changing the series column

  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartSeriesColumnSelect').on('change', function () {
    currentSettings.seriesColumn = parseInt(jquery__WEBPACK_IMPORTED_MODULE_0__(this).val(), 10);
    drawChart();
  }); // handle changing the value column

  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartValueColumnSelect').on('change', function () {
    currentSettings.valueColumn = parseInt(jquery__WEBPACK_IMPORTED_MODULE_0__(this).val(), 10);
    drawChart();
  }); // handle manual changes to the chart x-axis labels

  jquery__WEBPACK_IMPORTED_MODULE_0__('#xAxisLabelInput').on('keyup', function () {
    currentSettings.xaxisLabel = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();
    drawChart();
  }); // handle manual changes to the chart y-axis labels

  jquery__WEBPACK_IMPORTED_MODULE_0__('#yAxisLabelInput').on('keyup', function () {
    currentSettings.yaxisLabel = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();
    drawChart();
  }); // handler for ajax form submission

  jquery__WEBPACK_IMPORTED_MODULE_0__('#tblchartform').on('submit', function () {
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);

    if (window.codeMirrorEditor) {
      $form[0].elements.sql_query.value = window.codeMirrorEditor.getValue();
    }

    if (!Functions.checkSqlQuery($form[0])) {
      return false;
    }

    var $msgbox = Functions.ajaxShowMessage();
    Functions.prepareForAjaxRequest($form);
    jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), $form.serialize(), function (data) {
      if (typeof data !== 'undefined' && data.success === true && typeof data.chartData !== 'undefined') {
        chartData = JSON.parse(data.chartData);
        drawChart();
        Functions.ajaxRemoveMessage($msgbox);
      } else {
        Functions.ajaxShowMessage(data.error, false);
      }
    }, 'json'); // end $.post()

    return false;
  }); // from jQuery UI

  jquery__WEBPACK_IMPORTED_MODULE_0__('#resizer').resizable({
    minHeight: 240,
    minWidth: 300
  }).width(jquery__WEBPACK_IMPORTED_MODULE_0__('#div_view_options').width() - 50).trigger('resizestop');
  currentSettings = {
    type: 'line',
    width: jquery__WEBPACK_IMPORTED_MODULE_0__('#resizer').width() - 20,
    height: jquery__WEBPACK_IMPORTED_MODULE_0__('#resizer').height() - 20,
    xaxisLabel: jquery__WEBPACK_IMPORTED_MODULE_0__('#xAxisLabelInput').val(),
    yaxisLabel: jquery__WEBPACK_IMPORTED_MODULE_0__('#yAxisLabelInput').val(),
    title: jquery__WEBPACK_IMPORTED_MODULE_0__('#chartTitleInput').val(),
    stackSeries: false,
    mainAxis: parseInt(jquery__WEBPACK_IMPORTED_MODULE_0__('#chartXAxisSelect').val(), 10),
    selectedSeries: getSelectedSeries(),
    seriesColumn: null
  };
  var vals = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="dateTimeCols"]').val().split(' ');
  jquery__WEBPACK_IMPORTED_MODULE_0__.each(vals, function (i, v) {
    dateTimeCols.push(parseInt(v, 10));
  });
  vals = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="numericCols"]').val().split(' ');
  jquery__WEBPACK_IMPORTED_MODULE_0__.each(vals, function (i, v) {
    numericCols.push(parseInt(v, 10));
  });
  onXAxisChange();
  onDataSeriesChange();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tblchartform').trigger('submit');
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(68));
/******/ }
]);
//# sourceMappingURL=chart.js.map