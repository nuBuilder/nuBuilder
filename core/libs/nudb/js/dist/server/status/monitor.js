"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[50],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 56:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview    Javascript functions used in server status monitor page
 * @name            Server Status Monitor
 *
 * @requires    jQuery
 * @requires    jQueryUI
 * @requires    js/functions.js
 */

/* global firstDayOfCalendar, themeImagePath */
// templates/javascript/variables.twig

/* global variableNames */
// templates/server/status/monitor/index.twig

var runtime = {};
var serverTimeDiff;
var serverOs;
var isSuperUser;
var serverDbIsLocal;
var chartSize;
var monitorSettings;

function serverResponseError() {
  var btns = {};

  btns[window.Messages.strReloadPage] = function () {
    window.location.reload();
  };

  jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog({
    title: window.Messages.strRefreshFailed
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').html(Functions.getImage('s_attention') + window.Messages.strInvalidResponseExplanation);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog({
    buttons: btns
  });
}
/**
 * Destroys all monitor related resources
 */


function destroyGrid() {
  if (runtime.charts) {
    jquery__WEBPACK_IMPORTED_MODULE_0__.each(runtime.charts, function (key, value) {
      try {
        value.chart.destroy();
      } catch (err) {// continue regardless of error
      }
    });
  }

  try {
    runtime.refreshRequest.abort();
  } catch (err) {// continue regardless of error
  }

  try {
    clearTimeout(runtime.refreshTimeout);
  } catch (err) {// continue regardless of error
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').html('');
  runtime.charts = null;
  runtime.chartAI = 0;
  monitorSettings = null;
}

window.AJAX.registerOnload('server/status/monitor.js', function () {
  var $jsDataForm = jquery__WEBPACK_IMPORTED_MODULE_0__('#js_data');
  serverTimeDiff = new Date().getTime() - $jsDataForm.find('input[name=server_time]').val();
  serverOs = $jsDataForm.find('input[name=server_os]').val();
  isSuperUser = $jsDataForm.find('input[name=is_superuser]').val();
  serverDbIsLocal = $jsDataForm.find('input[name=server_db_isLocal]').val();
});
/**
 * Unbind all event handlers before tearing down a page
 */

window.AJAX.registerTeardown('server/status/monitor.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').remove();
  jquery__WEBPACK_IMPORTED_MODULE_0__('a.popupLink').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('body').off('click');
});
/**
 * Popup behaviour
 */

window.AJAX.registerOnload('server/status/monitor.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('<div></div>').attr('id', 'emptyDialog').appendTo('#page_content');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a.popupLink').on('click', function () {
    var $link = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    jquery__WEBPACK_IMPORTED_MODULE_0__('div.' + $link.attr('href').substring(1)).show().offset({
      top: $link.offset().top + $link.height() + 5,
      left: $link.offset().left
    }).addClass('openedPopup');
    return false;
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('body').on('click', function (event) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('div.openedPopup').each(function () {
      var $cnt = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
      var pos = $cnt.offset(); // Hide if the mouseclick is outside the popupcontent

      if (event.pageX > pos.left + $cnt.outerWidth() || event.pageY > pos.top + $cnt.outerHeight()) {
        $cnt.hide().removeClass('openedPopup');
      }
    });
  });
});
window.AJAX.registerTeardown('server/status/monitor.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#rearrangeCharts"], a[href="#endChartEditMode"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('div.popupContent select[name="chartColumns"]').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('div.popupContent select[name="gridChartRefresh"]').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#addNewChart"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#exportMonitorConfig"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#importMonitorConfig"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#clearMonitorConfig"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#pauseCharts"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#monitorInstructionsDialog"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartType"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="useDivisor"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="useUnit"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="varChartList"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#kibDivisor"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#mibDivisor"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#submitClearSeries"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#submitAddSeries"]').off('click'); // $("input#variableInput").destroy();

  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartPreset').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#chartStatusVar').off('click');
  destroyGrid();
});
window.AJAX.registerOnload('server/status/monitor.js', function () {
  // Show tab links
  jquery__WEBPACK_IMPORTED_MODULE_0__('div.tabLinks').show();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#loadingMonitorIcon').remove(); // Codemirror is loaded on demand so we might need to initialize it

  if (!window.codeMirrorEditor) {
    var $elm = jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlquery');

    if ($elm.length > 0 && typeof window.CodeMirror !== 'undefined') {
      window.codeMirrorEditor = window.CodeMirror.fromTextArea($elm[0], {
        lineNumbers: true,
        matchBrackets: true,
        indentUnit: 4,
        mode: 'text/x-mysql',
        lineWrapping: true
      });
    }
  } // Timepicker is loaded on demand so we need to initialize
  // datetime fields from the 'load log' dialog


  jquery__WEBPACK_IMPORTED_MODULE_0__('#logAnalyseDialog').find('.datetimefield').each(function () {
    Functions.addDatepicker(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  });
  /** ** Monitor charting implementation ****/

  /* Saves the previous ajax response for differential values */

  var oldChartData = null; // Holds about to be created chart

  var newChart = null;
  var chartSpacing; // Whenever the monitor object (runtime.charts) or the settings object
  // (monitorSettings) changes in a way incompatible to the previous version,
  // increase this number. It will reset the users monitor and settings object
  // in their localStorage to the default configuration

  var monitorProtocolVersion = '1.0'; // Runtime parameter of the monitor, is being fully set in initGrid()

  runtime = {
    // Holds all visible charts in the grid
    charts: null,
    // Stores the timeout handler so it can be cleared
    refreshTimeout: null,
    // Stores the GET request to refresh the charts
    refreshRequest: null,
    // Chart auto increment
    chartAI: 0,
    // To play/pause the monitor
    redrawCharts: false,
    // Object that contains a list of nodes that need to be retrieved
    // from the server for chart updates
    dataList: [],
    // Current max points per chart (needed for auto calculation)
    gridMaxPoints: 20,
    // displayed time frame
    xmin: -1,
    xmax: -1
  };
  monitorSettings = null;
  var defaultMonitorSettings = {
    columns: 3,
    chartSize: {
      width: 295,
      height: 250
    },
    // Max points in each chart. Settings it to 'auto' sets
    // gridMaxPoints to (chartwidth - 40) / 12
    gridMaxPoints: 'auto',

    /* Refresh rate of all grid charts in ms */
    gridRefresh: 5000
  }; // Allows drag and drop rearrange and print/edit icons on charts

  var editMode = false;
  /* List of preconfigured charts that the user may select */

  var presetCharts = {
    // Query cache efficiency
    'qce': {
      title: window.Messages.strQueryCacheEfficiency,
      series: [{
        label: window.Messages.strQueryCacheEfficiency
      }],
      nodes: [{
        dataPoints: [{
          type: 'statusvar',
          name: 'Qcache_hits'
        }, {
          type: 'statusvar',
          name: 'Com_select'
        }],
        transformFn: 'qce'
      }],
      maxYLabel: 0
    },
    // Query cache usage
    'qcu': {
      title: window.Messages.strQueryCacheUsage,
      series: [{
        label: window.Messages.strQueryCacheUsed
      }],
      nodes: [{
        dataPoints: [{
          type: 'statusvar',
          name: 'Qcache_free_memory'
        }, {
          type: 'servervar',
          name: 'query_cache_size'
        }],
        transformFn: 'qcu'
      }],
      maxYLabel: 0
    }
  }; // time span selection

  var selectionTimeDiff = [];
  var selectionStartX;
  var selectionStartY;
  var drawTimeSpan = false;
  /* Add OS specific system info charts to the preset chart list */

  switch (serverOs) {
    case 'WINNT':
      jquery__WEBPACK_IMPORTED_MODULE_0__.extend(presetCharts, {
        'cpu': {
          title: window.Messages.strSystemCPUUsage,
          series: [{
            label: window.Messages.strAverageLoad
          }],
          nodes: [{
            dataPoints: [{
              type: 'cpu',
              name: 'loadavg'
            }]
          }],
          maxYLabel: 100
        },
        'memory': {
          title: window.Messages.strSystemMemory,
          series: [{
            dataType: 'memory',
            label: window.Messages.strUsedMemory,
            fill: true
          }, {
            label: window.Messages.strFreeMemory,
            fill: true
          }],
          nodes: [{
            dataPoints: [{
              type: 'memory',
              name: 'MemUsed'
            }],
            valueDivisor: 1024
          }, {
            dataPoints: [{
              type: 'memory',
              name: 'MemFree'
            }],
            valueDivisor: 1024
          }],
          maxYLabel: 0
        },
        'swap': {
          title: window.Messages.strSystemSwap,
          series: [{
            label: window.Messages.strUsedSwap,
            fill: true
          }, {
            label: window.Messages.strFreeSwap,
            fill: true
          }],
          nodes: [{
            dataPoints: [{
              type: 'memory',
              name: 'SwapUsed'
            }],
            valueDivisor: 1024
          }, {
            dataPoints: [{
              type: 'memory',
              name: 'SwapFree'
            }],
            valueDivisor: 1024
          }],
          maxYLabel: 0
        }
      });
      break;

    case 'Linux':
      jquery__WEBPACK_IMPORTED_MODULE_0__.extend(presetCharts, {
        'cpu': {
          title: window.Messages.strSystemCPUUsage,
          series: [{
            label: window.Messages.strAverageLoad
          }],
          nodes: [{
            dataPoints: [{
              type: 'cpu',
              name: 'irrelevant'
            }],
            transformFn: 'cpu-linux'
          }],
          maxYLabel: 0
        },
        'memory': {
          title: window.Messages.strSystemMemory,
          series: [{
            label: window.Messages.strBufferedMemory,
            fill: true
          }, {
            label: window.Messages.strUsedMemory,
            fill: true
          }, {
            label: window.Messages.strCachedMemory,
            fill: true
          }, {
            label: window.Messages.strFreeMemory,
            fill: true
          }],
          nodes: [{
            dataPoints: [{
              type: 'memory',
              name: 'Buffers'
            }],
            valueDivisor: 1024
          }, {
            dataPoints: [{
              type: 'memory',
              name: 'MemUsed'
            }],
            valueDivisor: 1024
          }, {
            dataPoints: [{
              type: 'memory',
              name: 'Cached'
            }],
            valueDivisor: 1024
          }, {
            dataPoints: [{
              type: 'memory',
              name: 'MemFree'
            }],
            valueDivisor: 1024
          }],
          maxYLabel: 0
        },
        'swap': {
          title: window.Messages.strSystemSwap,
          series: [{
            label: window.Messages.strCachedSwap,
            fill: true
          }, {
            label: window.Messages.strUsedSwap,
            fill: true
          }, {
            label: window.Messages.strFreeSwap,
            fill: true
          }],
          nodes: [{
            dataPoints: [{
              type: 'memory',
              name: 'SwapCached'
            }],
            valueDivisor: 1024
          }, {
            dataPoints: [{
              type: 'memory',
              name: 'SwapUsed'
            }],
            valueDivisor: 1024
          }, {
            dataPoints: [{
              type: 'memory',
              name: 'SwapFree'
            }],
            valueDivisor: 1024
          }],
          maxYLabel: 0
        }
      });
      break;

    case 'SunOS':
      jquery__WEBPACK_IMPORTED_MODULE_0__.extend(presetCharts, {
        'cpu': {
          title: window.Messages.strSystemCPUUsage,
          series: [{
            label: window.Messages.strAverageLoad
          }],
          nodes: [{
            dataPoints: [{
              type: 'cpu',
              name: 'loadavg'
            }]
          }],
          maxYLabel: 0
        },
        'memory': {
          title: window.Messages.strSystemMemory,
          series: [{
            label: window.Messages.strUsedMemory,
            fill: true
          }, {
            label: window.Messages.strFreeMemory,
            fill: true
          }],
          nodes: [{
            dataPoints: [{
              type: 'memory',
              name: 'MemUsed'
            }],
            valueDivisor: 1024
          }, {
            dataPoints: [{
              type: 'memory',
              name: 'MemFree'
            }],
            valueDivisor: 1024
          }],
          maxYLabel: 0
        },
        'swap': {
          title: window.Messages.strSystemSwap,
          series: [{
            label: window.Messages.strUsedSwap,
            fill: true
          }, {
            label: window.Messages.strFreeSwap,
            fill: true
          }],
          nodes: [{
            dataPoints: [{
              type: 'memory',
              name: 'SwapUsed'
            }],
            valueDivisor: 1024
          }, {
            dataPoints: [{
              type: 'memory',
              name: 'SwapFree'
            }],
            valueDivisor: 1024
          }],
          maxYLabel: 0
        }
      });
      break;
  } // Default setting for the chart grid


  var defaultChartGrid = {
    'c0': {
      title: window.Messages.strQuestions,
      series: [{
        label: window.Messages.strQuestions
      }],
      nodes: [{
        dataPoints: [{
          type: 'statusvar',
          name: 'Questions'
        }],
        display: 'differential'
      }],
      maxYLabel: 0
    },
    'c1': {
      title: window.Messages.strChartConnectionsTitle,
      series: [{
        label: window.Messages.strConnections
      }, {
        label: window.Messages.strProcesses
      }],
      nodes: [{
        dataPoints: [{
          type: 'statusvar',
          name: 'Connections'
        }],
        display: 'differential'
      }, {
        dataPoints: [{
          type: 'proc',
          name: 'processes'
        }]
      }],
      maxYLabel: 0
    },
    'c2': {
      title: window.Messages.strTraffic,
      series: [{
        label: window.Messages.strBytesSent
      }, {
        label: window.Messages.strBytesReceived
      }],
      nodes: [{
        dataPoints: [{
          type: 'statusvar',
          name: 'Bytes_sent'
        }],
        display: 'differential',
        valueDivisor: 1024
      }, {
        dataPoints: [{
          type: 'statusvar',
          name: 'Bytes_received'
        }],
        display: 'differential',
        valueDivisor: 1024
      }],
      maxYLabel: 0
    }
  }; // Server is localhost => We can add cpu/memory/swap to the default chart

  if (serverDbIsLocal && typeof presetCharts.cpu !== 'undefined') {
    defaultChartGrid.c3 = presetCharts.cpu;
    defaultChartGrid.c4 = presetCharts.memory;
    defaultChartGrid.c5 = presetCharts.swap;
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#rearrangeCharts"], a[href="#endChartEditMode"]').on('click', function (event) {
    event.preventDefault();
    editMode = !editMode;

    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href') === '#endChartEditMode') {
      editMode = false;
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#endChartEditMode"]').toggle(editMode);

    if (editMode) {
      // Close the settings popup
      jquery__WEBPACK_IMPORTED_MODULE_0__('div.popupContent').hide().removeClass('openedPopup');
      jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').sortableTable({
        ignoreRect: {
          top: 8,
          left: chartSize.width - 63,
          width: 54,
          height: 24
        }
      });
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').sortableTable('destroy');
    }

    saveMonitor(); // Save settings

    return false;
  }); // global settings

  jquery__WEBPACK_IMPORTED_MODULE_0__('div.popupContent select[name="chartColumns"]').on('change', function () {
    monitorSettings.columns = parseInt(this.value, 10);
    calculateChartSize(); // Empty cells should keep their size so you can drop onto them

    jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('tr td').css('width', chartSize.width + 'px');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('.monitorChart').css({
      width: chartSize.width + 'px',
      height: chartSize.height + 'px'
    });
    /* Reorder all charts that it fills all column cells */

    var numColumns;
    var $tr = jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('tr').first();

    var tempManageCols = function () {
      if (numColumns > monitorSettings.columns) {
        if ($tr.next().length === 0) {
          $tr.after('<tr></tr>');
        }

        $tr.next().prepend(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
      }

      numColumns++;
    };

    var tempAddCol = function () {
      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).next().length !== 0) {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).append(jquery__WEBPACK_IMPORTED_MODULE_0__(this).next().find('td').first());
      }
    };

    while ($tr.length !== 0) {
      numColumns = 1; // To many cells in one row => put into next row

      $tr.find('td').each(tempManageCols); // To little cells in one row => for each cell to little,
      // move all cells backwards by 1

      if ($tr.next().length > 0) {
        var cnt = monitorSettings.columns - $tr.find('td').length;

        for (var i = 0; i < cnt; i++) {
          $tr.append($tr.next().find('td').first());
          $tr.nextAll().each(tempAddCol);
        }
      }

      $tr = $tr.next();
    }

    if (monitorSettings.gridMaxPoints === 'auto') {
      runtime.gridMaxPoints = Math.round((chartSize.width - 40) / 12);
    }

    runtime.xmin = new Date().getTime() - serverTimeDiff - runtime.gridMaxPoints * monitorSettings.gridRefresh;
    runtime.xmax = new Date().getTime() - serverTimeDiff + monitorSettings.gridRefresh;

    if (editMode) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').sortableTable('refresh');
    }

    refreshChartGrid();
    saveMonitor(); // Save settings
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('div.popupContent select[name="gridChartRefresh"]').on('change', function () {
    monitorSettings.gridRefresh = parseInt(this.value, 10) * 1000;
    clearTimeout(runtime.refreshTimeout);

    if (runtime.refreshRequest) {
      runtime.refreshRequest.abort();
    }

    runtime.xmin = new Date().getTime() - serverTimeDiff - runtime.gridMaxPoints * monitorSettings.gridRefresh; // fixing chart shift towards left on refresh rate change
    // runtime.xmax = new Date().getTime() - serverTimeDiff + monitorSettings.gridRefresh;

    runtime.refreshTimeout = setTimeout(refreshChartGrid, monitorSettings.gridRefresh);
    saveMonitor(); // Save settings
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#addNewChart"]').on('click', function (event) {
    event.preventDefault();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#addChartButton').on('click', function () {
      var type = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartType"]:checked').val();

      if (type === 'preset') {
        newChart = presetCharts[jquery__WEBPACK_IMPORTED_MODULE_0__('#addChartModal').find('select[name="presetCharts"]').prop('value')];
      } else {
        // If user builds their own chart, it's being set/updated
        // each time they add a series
        // So here we only warn if they didn't add a series yet
        if (!newChart || !newChart.nodes || newChart.nodes.length === 0) {
          alert(window.Messages.strAddOneSeriesWarning);
          return;
        }
      }

      newChart.title = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartTitle"]').val(); // Add a cloned object to the chart grid

      addChart(jquery__WEBPACK_IMPORTED_MODULE_0__.extend(true, {}, newChart));
      newChart = null;
      saveMonitor(); // Save settings

      jquery__WEBPACK_IMPORTED_MODULE_0__('#closeModalButton').off('click');
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#closeModalButton').on('click', function () {
      newChart = null;
      jquery__WEBPACK_IMPORTED_MODULE_0__('span#clearSeriesLink').hide();
      jquery__WEBPACK_IMPORTED_MODULE_0__('#seriesPreview').html('');
      jquery__WEBPACK_IMPORTED_MODULE_0__('#closeModalButton').off('click');
    });
    var $presetList = jquery__WEBPACK_IMPORTED_MODULE_0__('#addChartModal').find('select[name="presetCharts"]');

    if ($presetList.html().length === 0) {
      jquery__WEBPACK_IMPORTED_MODULE_0__.each(presetCharts, function (key, value) {
        $presetList.append('<option value="' + key + '">' + value.title + '</option>');
      });
      $presetList.on('change', function () {
        jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartTitle"]').val($presetList.find(':selected').text());
        jquery__WEBPACK_IMPORTED_MODULE_0__('#chartPreset').prop('checked', true);
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#chartPreset').on('click', function () {
        jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartTitle"]').val($presetList.find(':selected').text());
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#chartStatusVar').on('click', function () {
        jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartTitle"]').val(jquery__WEBPACK_IMPORTED_MODULE_0__('#chartSeries').find(':selected').text().replace(/_/g, ' '));
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#chartSeries').on('change', function () {
        jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartTitle"]').val(jquery__WEBPACK_IMPORTED_MODULE_0__('#chartSeries').find(':selected').text().replace(/_/g, ' '));
      });
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('#addChartModal').modal('show');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#seriesPreview').html('<i>' + window.Messages.strNone + '</i>');
    return false;
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#exportMonitorConfig"]').on('click', function (event) {
    event.preventDefault();
    var gridCopy = {};
    jquery__WEBPACK_IMPORTED_MODULE_0__.each(runtime.charts, function (key, elem) {
      gridCopy[key] = {};
      gridCopy[key].nodes = elem.nodes;
      gridCopy[key].series = elem.series;
      gridCopy[key].settings = elem.settings;
      gridCopy[key].title = elem.title;
      gridCopy[key].maxYLabel = elem.maxYLabel;
    });
    var exportData = {
      monitorCharts: gridCopy,
      monitorSettings: monitorSettings
    };
    var blob = new Blob([JSON.stringify(exportData)], {
      type: 'application/octet-stream'
    });
    var url = null;
    var fileName = 'monitor-config.json';

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      url = URL.createObjectURL(blob);
      window.location.href = url;
    }

    setTimeout(function () {
      // For some browsers it is necessary to delay revoking the ObjectURL
      if (url !== null) {
        window.URL.revokeObjectURL(url);
      }

      url = undefined;
      blob = undefined;
    }, 100);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#importMonitorConfig"]').on('click', function (event) {
    event.preventDefault();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog({
      title: window.Messages.strImportDialogTitle
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').html(window.Messages.strImportDialogMessage + ':<br><form>' + '<input type="file" name="file" id="import_file"> </form>');
    var dlgBtns = {};

    dlgBtns[window.Messages.strImport] = function () {
      var input = jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').find('#import_file')[0];
      var reader = new FileReader();

      reader.onerror = function (event) {
        alert(window.Messages.strFailedParsingConfig + '\n' + event.target.error.code);
      };

      reader.onload = function (e) {
        var data = e.target.result;
        var json = null; // Try loading config

        try {
          json = JSON.parse(data);
        } catch (err) {
          alert(window.Messages.strFailedParsingConfig);
          jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog('close');
          return;
        } // Basic check, is this a monitor config json?


        if (!json || !json.monitorCharts || !json.monitorCharts) {
          alert(window.Messages.strFailedParsingConfig);
          jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog('close');
          return;
        } // If json ok, try applying config


        try {
          if (window.Config.isStorageSupported('localStorage')) {
            window.localStorage.monitorCharts = JSON.stringify(json.monitorCharts);
            window.localStorage.monitorSettings = JSON.stringify(json.monitorSettings);
          }

          rebuildGrid();
        } catch (err) {
          alert(window.Messages.strFailedBuildingGrid); // If an exception is thrown, load default again

          if (window.Config.isStorageSupported('localStorage')) {
            window.localStorage.removeItem('monitorCharts');
            window.localStorage.removeItem('monitorSettings');
          }

          rebuildGrid();
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog('close');
      };

      reader.readAsText(input.files[0]);
    };

    dlgBtns[window.Messages.strCancel] = function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).dialog('close');
    };

    jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog({
      width: 'auto',
      height: 'auto',
      buttons: dlgBtns
    });
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#clearMonitorConfig"]').on('click', function (event) {
    event.preventDefault();

    if (window.Config.isStorageSupported('localStorage')) {
      window.localStorage.removeItem('monitorCharts');
      window.localStorage.removeItem('monitorSettings');
      window.localStorage.removeItem('monitorVersion');
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__(this).hide();
    rebuildGrid();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#pauseCharts"]').on('click', function (event) {
    event.preventDefault();
    runtime.redrawCharts = !runtime.redrawCharts;

    if (!runtime.redrawCharts) {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).html(Functions.getImage('play') + window.Messages.strResumeMonitor);
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).html(Functions.getImage('pause') + window.Messages.strPauseMonitor);

      if (!runtime.charts) {
        initGrid();
        jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#settingsPopup"]').show();
      }
    }

    return false;
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#monitorInstructionsDialog"]').on('click', function (event) {
    event.preventDefault();
    var $dialog = jquery__WEBPACK_IMPORTED_MODULE_0__('#monitorInstructionsDialog');
    var dlgBtns = {};

    dlgBtns[window.Messages.strClose] = function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).dialog('close');
    };

    $dialog.dialog({
      width: '60%',
      height: 'auto',
      buttons: dlgBtns
    }).find('img.ajaxIcon').show();

    var loadLogVars = function (getvars) {
      var vars = {
        'ajax_request': true,
        'server': window.CommonParams.get('server')
      };

      if (getvars) {
        jquery__WEBPACK_IMPORTED_MODULE_0__.extend(vars, getvars);
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/server/status/monitor/log-vars', vars, function (data) {
        var logVars;

        if (typeof data !== 'undefined' && data.success === true) {
          logVars = data.message;
        } else {
          return serverResponseError();
        }

        var icon = Functions.getImage('s_success');
        var msg = '';
        var str = '';

        if (logVars.general_log === 'ON') {
          if (logVars.slow_query_log === 'ON') {
            msg = window.Messages.strBothLogOn;
          } else {
            msg = window.Messages.strGenLogOn;
          }
        }

        if (msg.length === 0 && logVars.slow_query_log === 'ON') {
          msg = window.Messages.strSlowLogOn;
        }

        if (msg.length === 0) {
          icon = Functions.getImage('s_error');
          msg = window.Messages.strBothLogOff;
        }

        str = '<b>' + window.Messages.strCurrentSettings + '</b><br><div class="smallIndent">';
        str += icon + msg + '<br>';

        if (logVars.log_output !== 'TABLE') {
          str += Functions.getImage('s_error') + ' ' + window.Messages.strLogOutNotTable + '<br>';
        } else {
          str += Functions.getImage('s_success') + ' ' + window.Messages.strLogOutIsTable + '<br>';
        }

        if (logVars.slow_query_log === 'ON') {
          if (logVars.long_query_time > 2) {
            str += Functions.getImage('s_attention') + ' ';
            str += Functions.sprintf(window.Messages.strSmallerLongQueryTimeAdvice, logVars.long_query_time);
            str += '<br>';
          }

          if (logVars.long_query_time < 2) {
            str += Functions.getImage('s_success') + ' ';
            str += Functions.sprintf(window.Messages.strLongQueryTimeSet, logVars.long_query_time);
            str += '<br>';
          }
        }

        str += '</div>';

        if (isSuperUser) {
          str += '<p></p><b>' + window.Messages.strChangeSettings + '</b>';
          str += '<div class="smallIndent">';
          str += window.Messages.strSettingsAppliedGlobal + '<br>';
          var varValue = 'TABLE';

          if (logVars.log_output === 'TABLE') {
            varValue = 'FILE';
          }

          str += '- <a class="set" href="#log_output-' + varValue + '">';
          str += Functions.sprintf(window.Messages.strSetLogOutput, varValue);
          str += ' </a><br>';

          if (logVars.general_log !== 'ON') {
            str += '- <a class="set" href="#general_log-ON">';
            str += Functions.sprintf(window.Messages.strEnableVar, 'general_log');
            str += ' </a><br>';
          } else {
            str += '- <a class="set" href="#general_log-OFF">';
            str += Functions.sprintf(window.Messages.strDisableVar, 'general_log');
            str += ' </a><br>';
          }

          if (logVars.slow_query_log !== 'ON') {
            str += '- <a class="set" href="#slow_query_log-ON">';
            str += Functions.sprintf(window.Messages.strEnableVar, 'slow_query_log');
            str += ' </a><br>';
          } else {
            str += '- <a class="set" href="#slow_query_log-OFF">';
            str += Functions.sprintf(window.Messages.strDisableVar, 'slow_query_log');
            str += ' </a><br>';
          }

          varValue = 5;

          if (logVars.long_query_time > 2) {
            varValue = 1;
          }

          str += '- <a class="set" href="#long_query_time-' + varValue + '">';
          str += Functions.sprintf(window.Messages.setSetLongQueryTime, varValue);
          str += ' </a><br>';
        } else {
          str += window.Messages.strNoSuperUser + '<br>';
        }

        str += '</div>';
        $dialog.find('div.monitorUse').toggle(logVars.log_output === 'TABLE' && (logVars.slow_query_log === 'ON' || logVars.general_log === 'ON'));
        $dialog.find('div.ajaxContent').html(str);
        $dialog.find('img.ajaxIcon').hide();
        $dialog.find('a.set').on('click', function () {
          var nameValue = jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href').split('-');
          loadLogVars({
            varName: nameValue[0].substring(1),
            varValue: nameValue[1]
          });
          $dialog.find('img.ajaxIcon').show();
        });
      });
    };

    loadLogVars();
    return false;
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartType"]').on('change', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#chartVariableSettings').toggle(this.checked && this.value === 'variable');
    var title = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartTitle"]').val();

    if (title === window.Messages.strChartTitle || title === jquery__WEBPACK_IMPORTED_MODULE_0__('label[for="' + jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartTitle"]').data('lastRadio') + '"]').text()) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartTitle"]').data('lastRadio', jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('id')).val(jquery__WEBPACK_IMPORTED_MODULE_0__('label[for="' + jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('id') + '"]').text());
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="useDivisor"]').on('change', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('span.divisorInput').toggle(this.checked);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="useUnit"]').on('change', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('span.unitInput').toggle(this.checked);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="varChartList"]').on('change', function () {
    if (this.selectedIndex !== 0) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#variableInput').val(this.value);
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#kibDivisor"]').on('click', function (event) {
    event.preventDefault();
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="valueDivisor"]').val(1024);
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="valueUnit"]').val(window.Messages.strKiB);
    jquery__WEBPACK_IMPORTED_MODULE_0__('span.unitInput').toggle(true);
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="useUnit"]').prop('checked', true);
    return false;
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#mibDivisor"]').on('click', function (event) {
    event.preventDefault();
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="valueDivisor"]').val(1024 * 1024);
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="valueUnit"]').val(window.Messages.strMiB);
    jquery__WEBPACK_IMPORTED_MODULE_0__('span.unitInput').toggle(true);
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="useUnit"]').prop('checked', true);
    return false;
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#submitClearSeries"]').on('click', function (event) {
    event.preventDefault();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#seriesPreview').html('<i>' + window.Messages.strNone + '</i>');
    newChart = null;
    jquery__WEBPACK_IMPORTED_MODULE_0__('#clearSeriesLink').hide();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#submitAddSeries"]').on('click', function (event) {
    event.preventDefault();

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#variableInput').val() === '') {
      return false;
    }

    if (newChart === null) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#seriesPreview').html('');
      newChart = {
        title: jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="chartTitle"]').val(),
        nodes: [],
        series: [],
        maxYLabel: 0
      };
    }

    var serie = {
      dataPoints: [{
        type: 'statusvar',
        name: jquery__WEBPACK_IMPORTED_MODULE_0__('#variableInput').val()
      }],
      display: jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="differentialValue"]').prop('checked') ? 'differential' : ''
    };

    if (serie.dataPoints[0].name === 'Processes') {
      serie.dataPoints[0].type = 'proc';
    }

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="useDivisor"]').prop('checked')) {
      serie.valueDivisor = parseInt(jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="valueDivisor"]').val(), 10);
    }

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="useUnit"]').prop('checked')) {
      serie.unit = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="valueUnit"]').val();
    }

    var str = serie.display === 'differential' ? ', ' + window.Messages.strDifferential : '';
    str += serie.valueDivisor ? ', ' + Functions.sprintf(window.Messages.strDividedBy, serie.valueDivisor) : '';
    str += serie.unit ? ', ' + window.Messages.strUnit + ': ' + serie.unit : '';
    var newSeries = {
      label: jquery__WEBPACK_IMPORTED_MODULE_0__('#variableInput').val().replace(/_/g, ' ')
    };
    newChart.series.push(newSeries);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#seriesPreview').append('- ' + Functions.escapeHtml(newSeries.label + str) + '<br>');
    newChart.nodes.push(serie);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#variableInput').val('');
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="differentialValue"]').prop('checked', true);
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="useDivisor"]').prop('checked', false);
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="useUnit"]').prop('checked', false);
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="useDivisor"]').trigger('change');
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="useUnit"]').trigger('change');
    jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="varChartList"]').get(0).selectedIndex = 0;
    jquery__WEBPACK_IMPORTED_MODULE_0__('#clearSeriesLink').show();
    return false;
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#variableInput').autocomplete({
    source: variableNames
  });
  /* Initializes the monitor, called only once */

  function initGrid() {
    var i;
    /* Apply default values & config */

    if (window.Config.isStorageSupported('localStorage')) {
      if (typeof window.localStorage.monitorCharts !== 'undefined') {
        runtime.charts = JSON.parse(window.localStorage.monitorCharts);
      }

      if (typeof window.localStorage.monitorSettings !== 'undefined') {
        monitorSettings = JSON.parse(window.localStorage.monitorSettings);
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#clearMonitorConfig"]').toggle(runtime.charts !== null);

      if (runtime.charts !== null && typeof window.localStorage.monitorVersion !== 'undefined' && monitorProtocolVersion !== window.localStorage.monitorVersion) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog({
          title: window.Messages.strIncompatibleMonitorConfig
        });
        jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').html(window.Messages.strIncompatibleMonitorConfigDescription);
        var dlgBtns = {};

        dlgBtns[window.Messages.strClose] = function () {
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).dialog('close');
        };

        jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog({
          width: 400,
          buttons: dlgBtns
        });
      }
    }

    if (runtime.charts === null) {
      runtime.charts = defaultChartGrid;
    }

    if (monitorSettings === null) {
      monitorSettings = defaultMonitorSettings;
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="gridChartRefresh"]').val(monitorSettings.gridRefresh / 1000);
    jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="chartColumns"]').val(monitorSettings.columns);

    if (monitorSettings.gridMaxPoints === 'auto') {
      runtime.gridMaxPoints = Math.round((monitorSettings.chartSize.width - 40) / 12);
    } else {
      runtime.gridMaxPoints = monitorSettings.gridMaxPoints;
    }

    runtime.xmin = new Date().getTime() - serverTimeDiff - runtime.gridMaxPoints * monitorSettings.gridRefresh;
    runtime.xmax = new Date().getTime() - serverTimeDiff + monitorSettings.gridRefresh;
    /* Calculate how much spacing there is between each chart */

    jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').html('<tr><td></td><td></td></tr><tr><td></td><td></td></tr>');
    chartSpacing = {
      width: jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('td').eq(1).offset().left - jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('td').eq(0).offset().left,
      height: jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('tr').eq(1).find('td').eq(1).offset().top - jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('tr').eq(0).find('td').eq(0).offset().top
    };
    jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').html('');
    /* Add all charts - in correct order */

    var keys = [];
    jquery__WEBPACK_IMPORTED_MODULE_0__.each(runtime.charts, function (key) {
      keys.push(key);
    });
    keys.sort();

    for (i = 0; i < keys.length; i++) {
      addChart(runtime.charts[keys[i]], true);
    }
    /* Fill in missing cells */


    var numCharts = jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('.monitorChart').length;
    var numMissingCells = (monitorSettings.columns - numCharts % monitorSettings.columns) % monitorSettings.columns;

    for (i = 0; i < numMissingCells; i++) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('tr').last().append('<td></td>');
    } // Empty cells should keep their size so you can drop onto them


    calculateChartSize();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('tr td').css('width', chartSize.width + 'px');
    buildRequiredDataList();
    refreshChartGrid();
  }
  /* Calls destroyGrid() and initGrid(), but before doing so it saves the chart
   * data from each chart and restores it after the monitor is initialized again */


  function rebuildGrid() {
    var oldData = null;

    if (runtime.charts) {
      oldData = {};
      jquery__WEBPACK_IMPORTED_MODULE_0__.each(runtime.charts, function (key, chartObj) {
        for (var i = 0, l = chartObj.nodes.length; i < l; i++) {
          oldData[chartObj.nodes[i].dataPoint] = [];

          for (var j = 0, ll = chartObj.chart.series[i].data.length; j < ll; j++) {
            oldData[chartObj.nodes[i].dataPoint].push([chartObj.chart.series[i].data[j].x, chartObj.chart.series[i].data[j].y]);
          }
        }
      });
    }

    destroyGrid();
    initGrid();
  }
  /* Calculates the dynamic chart size that depends on the column width */


  function calculateChartSize() {
    var panelWidth;

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('body').height() > jquery__WEBPACK_IMPORTED_MODULE_0__(window).height()) {
      // has vertical scroll bar
      panelWidth = jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').innerWidth();
    } else {
      panelWidth = jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').innerWidth() - 10; // leave some space for vertical scroll bar
    }

    var wdt = panelWidth;
    var windowWidth = jquery__WEBPACK_IMPORTED_MODULE_0__(window).width();

    if (windowWidth > 768) {
      wdt = (panelWidth - monitorSettings.columns * Math.abs(chartSpacing.width)) / monitorSettings.columns;
    }

    chartSize = {
      width: Math.floor(wdt),
      height: Math.floor(0.75 * wdt)
    };
  }
  /* Adds a chart to the chart grid */


  function addChart(chartObj, initialize) {
    var i;
    var settings = {
      title: Functions.escapeHtml(chartObj.title),
      grid: {
        drawBorder: false,
        shadow: false,
        background: 'rgba(0,0,0,0)'
      },
      axes: {
        xaxis: {
          renderer: jquery__WEBPACK_IMPORTED_MODULE_0__.jqplot.DateAxisRenderer,
          tickOptions: {
            formatString: '%H:%M:%S',
            showGridline: false
          },
          min: runtime.xmin,
          max: runtime.xmax
        },
        yaxis: {
          min: 0,
          max: 100,
          tickInterval: 20
        }
      },
      seriesDefaults: {
        rendererOptions: {
          smooth: true
        },
        showLine: true,
        lineWidth: 2,
        markerOptions: {
          size: 6
        }
      },
      highlighter: {
        show: true
      }
    };

    if (settings.title === window.Messages.strSystemCPUUsage || settings.title === window.Messages.strQueryCacheEfficiency) {
      settings.axes.yaxis.tickOptions = {
        formatString: '%d %%'
      };
    } else if (settings.title === window.Messages.strSystemMemory || settings.title === window.Messages.strSystemSwap) {
      settings.stackSeries = true;
      settings.axes.yaxis.tickOptions = {
        formatter: jquery__WEBPACK_IMPORTED_MODULE_0__.jqplot.byteFormatter(2) // MiB

      };
    } else if (settings.title === window.Messages.strTraffic) {
      settings.axes.yaxis.tickOptions = {
        formatter: jquery__WEBPACK_IMPORTED_MODULE_0__.jqplot.byteFormatter(1) // KiB

      };
    } else if (settings.title === window.Messages.strQuestions || settings.title === window.Messages.strConnections) {
      settings.axes.yaxis.tickOptions = {
        formatter: function (format, val) {
          if (Math.abs(val) >= 1000000) {
            return jquery__WEBPACK_IMPORTED_MODULE_0__.jqplot.sprintf('%.3g M', val / 1000000);
          } else if (Math.abs(val) >= 1000) {
            return jquery__WEBPACK_IMPORTED_MODULE_0__.jqplot.sprintf('%.3g k', val / 1000);
          } else {
            return jquery__WEBPACK_IMPORTED_MODULE_0__.jqplot.sprintf('%d', val);
          }
        }
      };
    }

    settings.series = chartObj.series;

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#' + 'gridchart' + runtime.chartAI).length === 0) {
      var numCharts = jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('.monitorChart').length;

      if (numCharts === 0 || numCharts % monitorSettings.columns === 0) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').append('<tr></tr>');
      }

      if (!chartSize) {
        calculateChartSize();
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('tr').last().append('<td><div id="gridChartContainer' + runtime.chartAI + '" class="">' + '<div class="ui-state-default monitorChart"' + ' id="gridchart' + runtime.chartAI + '"' + ' style="width:' + chartSize.width + 'px; height:' + chartSize.height + 'px;"></div>' + '</div></td>');
    } // Set series' data as [0,0], smooth lines won't plot with data array having null values.
    // also chart won't plot initially with no data and data comes on refreshChartGrid()


    var series = [];

    for (i in chartObj.series) {
      series.push([[0, 0]]);
    }

    var tempTooltipContentEditor = function (str, seriesIndex, pointIndex, plot) {
      var j; // TODO: move style to theme CSS

      var tooltipHtml = '<div id="tooltip_editor">'; // x value i.e. time

      var timeValue = str.split(',')[0];
      var seriesValue;
      tooltipHtml += 'Time: ' + timeValue;
      tooltipHtml += '<span id="tooltip_font">'; // Add y values to the tooltip per series

      for (j in plot.series) {
        // get y value if present
        if (plot.series[j].data.length > pointIndex) {
          seriesValue = plot.series[j].data[pointIndex][1];
        } else {
          return;
        }

        var seriesLabel = plot.series[j].label;
        var seriesColor = plot.series[j].color; // format y value

        if (plot.series[0]._yaxis.tickOptions.formatter) {
          // eslint-disable-line no-underscore-dangle
          // using formatter function
          // eslint-disable-next-line no-underscore-dangle
          seriesValue = plot.series[0]._yaxis.tickOptions.formatter('%s', seriesValue);
        } else if (plot.series[0]._yaxis.tickOptions.formatString) {
          // eslint-disable-line no-underscore-dangle
          // using format string
          // eslint-disable-next-line no-underscore-dangle
          seriesValue = Functions.sprintf(plot.series[0]._yaxis.tickOptions.formatString, seriesValue);
        }

        tooltipHtml += '<br><span style="color:' + seriesColor + '">' + seriesLabel + ': ' + seriesValue + '</span>';
      }

      tooltipHtml += '</span></div>';
      return tooltipHtml;
    }; // set Tooltip for each series


    for (i in settings.series) {
      settings.series[i].highlighter = {
        show: true,
        tooltipContentEditor: tempTooltipContentEditor
      };
    }

    chartObj.chart = jquery__WEBPACK_IMPORTED_MODULE_0__.jqplot('gridchart' + runtime.chartAI, series, settings); // remove [0,0] after plotting

    for (i in chartObj.chart.series) {
      chartObj.chart.series[i].data.shift();
    }

    var $legend = jquery__WEBPACK_IMPORTED_MODULE_0__('<div></div>').css('padding', '0.5em');

    for (i in chartObj.chart.series) {
      $legend.append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div></div>').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div>').css({
        width: '1em',
        height: '1em',
        background: chartObj.chart.seriesColors[i]
      }).addClass('float-start')).append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div>').text(chartObj.chart.series[i].label).addClass('float-start')).append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="clearfloat">')).addClass('float-start'));
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('#gridchart' + runtime.chartAI).parent().append($legend);

    if (initialize !== true) {
      runtime.charts['c' + runtime.chartAI] = chartObj;
      buildRequiredDataList();
    } // time span selection


    jquery__WEBPACK_IMPORTED_MODULE_0__('#gridchart' + runtime.chartAI).on('jqplotMouseDown', function (ev, gridpos, datapos) {
      drawTimeSpan = true;
      selectionTimeDiff.push(datapos.xaxis);

      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#selection_box').length) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#selection_box').remove();
      }

      var selectionBox = jquery__WEBPACK_IMPORTED_MODULE_0__('<div id="selection_box" >'); // eslint-disable-next-line compat/compat

      jquery__WEBPACK_IMPORTED_MODULE_0__(document.body).append(selectionBox);
      selectionStartX = ev.pageX;
      selectionStartY = ev.pageY;
      selectionBox.attr({
        id: 'selection_box'
      }).css({
        top: selectionStartY - gridpos.y,
        left: selectionStartX
      }).fadeIn();
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#gridchart' + runtime.chartAI).on('jqplotMouseUp', function (ev, gridpos, datapos) {
      if (!drawTimeSpan || editMode) {
        return;
      }

      selectionTimeDiff.push(datapos.xaxis);

      if (selectionTimeDiff[1] <= selectionTimeDiff[0]) {
        selectionTimeDiff = [];
        return;
      } // get date from timestamp


      var min = new Date(Math.ceil(selectionTimeDiff[0]));
      var max = new Date(Math.ceil(selectionTimeDiff[1]));
      getLogAnalyseDialog(min, max);
      selectionTimeDiff = [];
      drawTimeSpan = false;
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#gridchart' + runtime.chartAI).on('jqplotMouseMove', function (ev) {
      if (!drawTimeSpan || editMode) {
        return;
      }

      if (selectionStartX !== undefined) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#selection_box').css({
          width: Math.ceil(ev.pageX - selectionStartX)
        }).fadeIn();
      }
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#gridchart' + runtime.chartAI).on('jqplotMouseLeave', function () {
      drawTimeSpan = false;
    }); // eslint-disable-next-line compat/compat

    jquery__WEBPACK_IMPORTED_MODULE_0__(document.body).on('mouseup', function () {
      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#selection_box').length) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#selection_box').remove();
      }
    }); // Edit, Print icon only in edit mode

    jquery__WEBPACK_IMPORTED_MODULE_0__('#chartGrid').find('div svg').find('*[zIndex=20], *[zIndex=21], *[zIndex=19]').toggle(editMode);
    runtime.chartAI++;
  }

  function getLogAnalyseDialog(min, max) {
    var $logAnalyseDialog = jquery__WEBPACK_IMPORTED_MODULE_0__('#logAnalyseDialog');
    var $dateStart = $logAnalyseDialog.find('input[name="dateStart"]');
    var $dateEnd = $logAnalyseDialog.find('input[name="dateEnd"]');
    $dateStart.prop('readonly', true);
    $dateEnd.prop('readonly', true);
    var dlgBtns = {};

    dlgBtns[window.Messages.strFromSlowLog] = function () {
      loadLog('slow', min, max);
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).dialog('close');
    };

    dlgBtns[window.Messages.strFromGeneralLog] = function () {
      loadLog('general', min, max);
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).dialog('close');
    };

    $logAnalyseDialog.dialog({
      width: 'auto',
      height: 'auto',
      buttons: dlgBtns
    });
    Functions.addDatepicker($dateStart, 'datetime', {
      showMillisec: false,
      showMicrosec: false,
      timeFormat: 'HH:mm:ss',
      firstDay: firstDayOfCalendar
    });
    Functions.addDatepicker($dateEnd, 'datetime', {
      showMillisec: false,
      showMicrosec: false,
      timeFormat: 'HH:mm:ss',
      firstDay: firstDayOfCalendar
    });
    $dateStart.datepicker('setDate', min);
    $dateEnd.datepicker('setDate', max);
  }

  function loadLog(type, min, max) {
    var dateStart = Date.parse(jquery__WEBPACK_IMPORTED_MODULE_0__('#logAnalyseDialog').find('input[name="dateStart"]').datepicker('getDate')) || min;
    var dateEnd = Date.parse(jquery__WEBPACK_IMPORTED_MODULE_0__('#logAnalyseDialog').find('input[name="dateEnd"]').datepicker('getDate')) || max;
    loadLogStatistics({
      src: type,
      start: dateStart,
      end: dateEnd,
      removeVariables: jquery__WEBPACK_IMPORTED_MODULE_0__('#removeVariables').prop('checked'),
      limitTypes: jquery__WEBPACK_IMPORTED_MODULE_0__('#limitTypes').prop('checked')
    });
  }
  /* Called in regular intervals, this function updates the values of each chart in the grid */


  function refreshChartGrid() {
    /* Send to server */
    runtime.refreshRequest = jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/server/status/monitor/chart', {
      'ajax_request': true,
      'requiredData': JSON.stringify(runtime.dataList),
      'server': window.CommonParams.get('server')
    }, function (data) {
      var chartData;

      if (typeof data !== 'undefined' && data.success === true) {
        chartData = data.message;
      } else {
        return serverResponseError();
      }

      var value;
      var i = 0;
      var diff;
      var total;
      /* Update values in each graph */

      jquery__WEBPACK_IMPORTED_MODULE_0__.each(runtime.charts, function (orderKey, elem) {
        var key = elem.chartID; // If newly added chart, we have no data for it yet

        if (!chartData[key]) {
          return;
        } // Draw all series


        total = 0;

        for (var j = 0; j < elem.nodes.length; j++) {
          // Update x-axis
          if (i === 0 && j === 0) {
            if (oldChartData === null) {
              diff = chartData.x - runtime.xmax;
            } else {
              diff = parseInt(chartData.x - oldChartData.x, 10);
            }

            runtime.xmin += diff;
            runtime.xmax += diff;
          } // elem.chart.xAxis[0].setExtremes(runtime.xmin, runtime.xmax, false);

          /* Calculate y value */
          // If transform function given, use it


          if (elem.nodes[j].transformFn) {
            value = chartValueTransform(elem.nodes[j].transformFn, chartData[key][j], // Check if first iteration (oldChartData==null), or if newly added chart oldChartData[key]==null
            oldChartData === null || oldChartData[key] === null || oldChartData[key] === undefined ? null : oldChartData[key][j]); // Otherwise use original value and apply differential and divisor if given,
            // in this case we have only one data point per series - located at chartData[key][j][0]
          } else {
            value = parseFloat(chartData[key][j][0].value);

            if (elem.nodes[j].display === 'differential') {
              if (oldChartData === null || oldChartData[key] === null || oldChartData[key] === undefined) {
                continue;
              }

              value -= oldChartData[key][j][0].value;
            }

            if (elem.nodes[j].valueDivisor) {
              value = value / elem.nodes[j].valueDivisor;
            }
          } // Set y value, if defined


          if (value !== undefined) {
            elem.chart.series[j].data.push([chartData.x, value]);

            if (value > elem.maxYLabel) {
              elem.maxYLabel = value;
            } else if (elem.maxYLabel === 0) {
              elem.maxYLabel = 0.5;
            } // free old data point values and update maxYLabel


            if (elem.chart.series[j].data.length > runtime.gridMaxPoints && elem.chart.series[j].data[0][0] < runtime.xmin) {
              // check if the next freeable point is highest
              if (elem.maxYLabel <= elem.chart.series[j].data[0][1]) {
                elem.chart.series[j].data.splice(0, elem.chart.series[j].data.length - runtime.gridMaxPoints);
                elem.maxYLabel = getMaxYLabel(elem.chart.series[j].data);
              } else {
                elem.chart.series[j].data.splice(0, elem.chart.series[j].data.length - runtime.gridMaxPoints);
              }
            }

            if (elem.title === window.Messages.strSystemMemory || elem.title === window.Messages.strSystemSwap) {
              total += value;
            }
          }
        } // update chart options
        // keep ticks number/positioning consistent while refreshrate changes


        var tickInterval = (runtime.xmax - runtime.xmin) / 5;
        elem.chart.axes.xaxis.ticks = [runtime.xmax - tickInterval * 4, runtime.xmax - tickInterval * 3, runtime.xmax - tickInterval * 2, runtime.xmax - tickInterval, runtime.xmax];

        if (elem.title !== window.Messages.strSystemCPUUsage && elem.title !== window.Messages.strQueryCacheEfficiency && elem.title !== window.Messages.strSystemMemory && elem.title !== window.Messages.strSystemSwap) {
          elem.chart.axes.yaxis.max = Math.ceil(elem.maxYLabel * 1.1);
          elem.chart.axes.yaxis.tickInterval = Math.ceil(elem.maxYLabel * 1.1 / 5);
        } else if (elem.title === window.Messages.strSystemMemory || elem.title === window.Messages.strSystemSwap) {
          elem.chart.axes.yaxis.max = Math.ceil(total * 1.1 / 100) * 100;
          elem.chart.axes.yaxis.tickInterval = Math.ceil(total * 1.1 / 5);
        }

        i++;

        if (runtime.redrawCharts) {
          elem.chart.replot();
        }
      });
      oldChartData = chartData;
      runtime.refreshTimeout = setTimeout(refreshChartGrid, monitorSettings.gridRefresh);
    });
  }
  /* Function to get highest plotted point's y label, to scale the chart,
   * TODO: make jqplot's autoscale:true work here
   */


  function getMaxYLabel(dataValues) {
    var maxY = dataValues[0][1];
    jquery__WEBPACK_IMPORTED_MODULE_0__.each(dataValues, function (k, v) {
      maxY = v[1] > maxY ? v[1] : maxY;
    });
    return maxY;
  }
  /* Function that supplies special value transform functions for chart values */


  function chartValueTransform(name, cur, prev) {
    switch (name) {
      case 'cpu-linux':
        if (prev === null) {
          return undefined;
        } // cur and prev are datapoint arrays, but containing
        // only 1 element for cpu-linux


        var newCur = cur[0];
        var newPrev = prev[0];
        var diffTotal = newCur.busy + newCur.idle - (newPrev.busy + newPrev.idle);
        var diffIdle = newCur.idle - newPrev.idle;
        return 100 * (diffTotal - diffIdle) / diffTotal;
      // Query cache efficiency (%)

      case 'qce':
        if (prev === null) {
          return undefined;
        } // cur[0].value is Qcache_hits, cur[1].value is Com_select


        var diffQHits = cur[0].value - prev[0].value; // No NaN please :-)

        if (cur[1].value - prev[1].value === 0) {
          return 0;
        }

        return diffQHits / (cur[1].value - prev[1].value + diffQHits) * 100;
      // Query cache usage (%)

      case 'qcu':
        if (cur[1].value === 0) {
          return 0;
        } // cur[0].value is Qcache_free_memory, cur[1].value is query_cache_size


        return 100 - cur[0].value / cur[1].value * 100;
    }

    return undefined;
  }
  /* Build list of nodes that need to be retrieved from server.
   * It creates something like a stripped down version of the runtime.charts object.
   */


  function buildRequiredDataList() {
    runtime.dataList = {}; // Store an own id, because the property name is subject of reordering,
    // thus destroying our mapping with runtime.charts <=> runtime.dataList

    var chartID = 0;
    jquery__WEBPACK_IMPORTED_MODULE_0__.each(runtime.charts, function (key, chart) {
      runtime.dataList[chartID] = [];

      for (var i = 0, l = chart.nodes.length; i < l; i++) {
        runtime.dataList[chartID][i] = chart.nodes[i].dataPoints;
      }

      runtime.charts[key].chartID = chartID;
      chartID++;
    });
  }
  /* Loads the log table data, generates the table and handles the filters */


  function loadLogStatistics(opts) {
    var logRequest = null;

    if (!opts.removeVariables) {
      opts.removeVariables = false;
    }

    if (!opts.limitTypes) {
      opts.limitTypes = false;
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog({
      title: window.Messages.strAnalysingLogsTitle
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').html(window.Messages.strAnalysingLogs + ' <img class="ajaxIcon" src="' + themeImagePath + 'ajax_clock_small.gif" alt="">');
    var dlgBtns = {};

    dlgBtns[window.Messages.strCancelRequest] = function () {
      if (logRequest !== null) {
        logRequest.abort();
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__(this).dialog('close');
    };

    jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog({
      width: 'auto',
      height: 'auto',
      buttons: dlgBtns
    });
    var url = 'index.php?route=/server/status/monitor/slow-log';

    if (opts.src === 'general') {
      url = 'index.php?route=/server/status/monitor/general-log';
    }

    logRequest = jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, {
      'ajax_request': true,
      'time_start': Math.round(opts.start / 1000),
      'time_end': Math.round(opts.end / 1000),
      'removeVariables': opts.removeVariables,
      'limitTypes': opts.limitTypes,
      'server': window.CommonParams.get('server')
    }, function (data) {
      var logData;
      var dlgBtns = {};

      if (typeof data !== 'undefined' && data.success === true) {
        logData = data.message;
      } else {
        return serverResponseError();
      }

      if (logData.rows.length === 0) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog({
          title: window.Messages.strNoDataFoundTitle
        });
        jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').html('<p>' + window.Messages.strNoDataFound + '</p>');

        dlgBtns[window.Messages.strClose] = function () {
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).dialog('close');
        };

        jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog('option', 'buttons', dlgBtns);
        return;
      }

      runtime.logDataCols = buildLogTable(logData, opts.removeVariables);
      /* Show some stats in the dialog */

      jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog({
        title: window.Messages.strLoadingLogs
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').html('<p>' + window.Messages.strLogDataLoaded + '</p>');
      jquery__WEBPACK_IMPORTED_MODULE_0__.each(logData.sum, function (key, value) {
        var newKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();

        if (newKey === 'Total') {
          newKey = '<b>' + newKey + '</b>';
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').append(newKey + ': ' + value + '<br>');
      });
      /* Add filter options if more than a bunch of rows there to filter */

      if (logData.numRows > 12) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').prepend('<fieldset class="pma-fieldset" id="logDataFilter">' + '    <legend>' + window.Messages.strFiltersForLogTable + '</legend>' + '    <div class="formelement">' + '        <label for="filterQueryText">' + window.Messages.strFilterByWordRegexp + '</label>' + '        <input name="filterQueryText" type="text" id="filterQueryText">' + '    </div>' + (logData.numRows > 250 ? ' <div class="formelement"><button class="btn btn-secondary" name="startFilterQueryText" id="startFilterQueryText">' + window.Messages.strFilter + '</button></div>' : '') + '    <div class="formelement">' + '       <input type="checkbox" id="noWHEREData" name="noWHEREData" value="1"> ' + '       <label for="noWHEREData"> ' + window.Messages.strIgnoreWhereAndGroup + '</label>' + '   </div' + '</fieldset>');
        jquery__WEBPACK_IMPORTED_MODULE_0__('#noWHEREData').on('change', function () {
          filterQueries(true);
        });

        if (logData.numRows > 250) {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#startFilterQueryText').on('click', filterQueries);
        } else {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#filterQueryText').on('keyup', filterQueries);
        }
      }

      dlgBtns[window.Messages.strJumpToTable] = function () {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).dialog('close');
        jquery__WEBPACK_IMPORTED_MODULE_0__(document).scrollTop(jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').offset().top);
      };

      jquery__WEBPACK_IMPORTED_MODULE_0__('#emptyDialog').dialog('option', 'buttons', dlgBtns);
    });
    /**
     * Handles the actions performed when the user uses any of the
     * log table filters which are the filter by name and grouping
     * with ignoring data in WHERE clauses
     *
     * @param {boolean} varFilterChange Should be true when the users enabled or disabled
     *                to group queries ignoring data in WHERE clauses
     */

    function filterQueries(varFilterChange) {
      var textFilter;
      var val = jquery__WEBPACK_IMPORTED_MODULE_0__('#filterQueryText').val();

      if (val.length === 0) {
        textFilter = null;
      } else {
        try {
          textFilter = new RegExp(val, 'i');
          jquery__WEBPACK_IMPORTED_MODULE_0__('#filterQueryText').removeClass('error');
        } catch (e) {
          if (e instanceof SyntaxError) {
            jquery__WEBPACK_IMPORTED_MODULE_0__('#filterQueryText').addClass('error');
            textFilter = null;
          }
        }
      }

      var rowSum = 0;
      var totalSum = 0;
      var i = 0;
      var q;
      var noVars = jquery__WEBPACK_IMPORTED_MODULE_0__('#noWHEREData').prop('checked');
      var equalsFilter = /([^=]+)=(\d+|(('|"|).*?[^\\])\4((\s+)|$))/gi;
      var functionFilter = /([a-z0-9_]+)\(.+?\)/gi;
      var filteredQueries = {};
      var filteredQueriesLines = {};
      var hide = false;
      var rowData;
      var queryColumnName = runtime.logDataCols[runtime.logDataCols.length - 2];
      var sumColumnName = runtime.logDataCols[runtime.logDataCols.length - 1];
      var isSlowLog = opts.src === 'slow';
      var columnSums = {}; // For the slow log we have to count many columns (query_time, lock_time, rows_examined, rows_sent, etc.)

      var countRow = function (query, row) {
        var cells = row.match(/<td>(.*?)<\/td>/gi);

        if (!columnSums[query]) {
          columnSums[query] = [0, 0, 0, 0];
        } // lock_time and query_time and displayed in timespan format


        columnSums[query][0] += timeToSec(cells[2].replace(/(<td>|<\/td>)/gi, ''));
        columnSums[query][1] += timeToSec(cells[3].replace(/(<td>|<\/td>)/gi, '')); // rows_examind and rows_sent are just numbers

        columnSums[query][2] += parseInt(cells[4].replace(/(<td>|<\/td>)/gi, ''), 10);
        columnSums[query][3] += parseInt(cells[5].replace(/(<td>|<\/td>)/gi, ''), 10);
      }; // We just assume the sql text is always in the second last column, and that the total count is right of it


      jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').find('table tbody tr').children('td').eq(runtime.logDataCols.length - 2).each(function () {
        var $t = jquery__WEBPACK_IMPORTED_MODULE_0__(this); // If query is a SELECT and user enabled or disabled to group
        // queries ignoring data in where statements, we
        // need to re-calculate the sums of each row

        if (varFilterChange && $t.html().match(/^SELECT/i)) {
          if (noVars) {
            // Group on => Sum up identical columns, and hide all but 1
            q = $t.text().replace(equalsFilter, '$1=...$6').trim();
            q = q.replace(functionFilter, ' $1(...)'); // Js does not specify a limit on property name length,
            // so we can abuse it as index :-)

            if (filteredQueries[q]) {
              filteredQueries[q] += parseInt($t.next().text(), 10);
              totalSum += parseInt($t.next().text(), 10);
              hide = true;
            } else {
              filteredQueries[q] = parseInt($t.next().text(), 10);
              filteredQueriesLines[q] = i;
              $t.text(q);
            }

            if (isSlowLog) {
              countRow(q, $t.parent().html());
            }
          } else {
            // Group off: Restore original columns
            rowData = $t.parent().data('query'); // Restore SQL text

            $t.text(rowData[queryColumnName]); // Restore total count

            $t.next().text(rowData[sumColumnName]); // Restore slow log columns

            if (isSlowLog) {
              $t.parent().children('td').eq(2).text(rowData.query_time);
              $t.parent().children('td').eq(3).text(rowData.lock_time);
              $t.parent().children('td').eq(4).text(rowData.rows_sent);
              $t.parent().children('td').eq(5).text(rowData.rows_examined);
            }
          }
        } // If not required to be hidden, do we need
        // to hide because of a not matching text filter?


        if (!hide && textFilter !== null && !textFilter.exec($t.text())) {
          hide = true;
        } // Now display or hide this column


        if (hide) {
          $t.parent().css('display', 'none');
        } else {
          totalSum += parseInt($t.next().text(), 10);
          rowSum++;
          $t.parent().css('display', '');
        }

        hide = false;
        i++;
      }); // We finished summarizing counts => Update count values of all grouped entries

      if (varFilterChange) {
        if (noVars) {
          var numCol;
          var row;
          var $table = jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').find('table tbody');
          jquery__WEBPACK_IMPORTED_MODULE_0__.each(filteredQueriesLines, function (key, value) {
            if (filteredQueries[key] <= 1) {
              return;
            }

            row = $table.children('tr').eq(value);
            numCol = row.children().eq(runtime.logDataCols.length - 1);
            numCol.text(filteredQueries[key]);

            if (isSlowLog) {
              row.children('td').eq(2).text(secToTime(columnSums[key][0]));
              row.children('td').eq(3).text(secToTime(columnSums[key][1]));
              row.children('td').eq(4).text(columnSums[key][2]);
              row.children('td').eq(5).text(columnSums[key][3]);
            }
          });
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').find('table').trigger('update');
        setTimeout(function () {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').find('table').trigger('sorton', [[[runtime.logDataCols.length - 1, 1]]]);
        }, 0);
      } // Display some stats at the bottom of the table


      jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').find('table tfoot tr').html('<th colspan="' + (runtime.logDataCols.length - 1) + '">' + window.Messages.strSumRows + ' ' + rowSum + '<span class="float-end">' + window.Messages.strTotal + '</span></th><th class="text-end">' + totalSum + '</th>');
    }
  }
  /* Turns a timespan (12:12:12) into a number */


  function timeToSec(timeStr) {
    var time = timeStr.split(':');
    return parseInt(time[0], 10) * 3600 + parseInt(time[1], 10) * 60 + parseInt(time[2], 10);
  }
  /* Turns a number into a timespan (100 into 00:01:40) */


  function secToTime(timeInt) {
    var time = timeInt;
    var hours = Math.floor(time / 3600);
    time -= hours * 3600;
    var minutes = Math.floor(time / 60);
    time -= minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (time < 10) {
      time = '0' + time;
    }

    return hours + ':' + minutes + ':' + time;
  }
  /* Constructs the log table out of the retrieved server data */


  function buildLogTable(data, groupInserts) {
    var rows = data.rows;
    var cols = [];
    var $table = jquery__WEBPACK_IMPORTED_MODULE_0__('<table class="table table-striped table-hover align-middle sortable"></table>');
    var $tBody;
    var $tRow;
    var $tCell;
    jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').html($table);

    var tempPushKey = function (key) {
      cols.push(key);
    };

    var formatValue = function (name, value) {
      if (name === 'user_host') {
        return value.replace(/(\[.*?\])+/g, '');
      }

      return Functions.escapeHtml(value);
    };

    for (var i = 0, l = rows.length; i < l; i++) {
      if (i === 0) {
        jquery__WEBPACK_IMPORTED_MODULE_0__.each(rows[0], tempPushKey);
        $table.append('<thead>' + '<tr><th class="text-nowrap">' + cols.join('</th><th class="text-nowrap">') + '</th></tr>' + '</thead>');
        $table.append($tBody = jquery__WEBPACK_IMPORTED_MODULE_0__('<tbody></tbody>'));
      }

      $tBody.append($tRow = jquery__WEBPACK_IMPORTED_MODULE_0__('<tr class="noclick"></tr>'));

      for (var j = 0, ll = cols.length; j < ll; j++) {
        // Assuming the query column is the second last
        if (j === cols.length - 2 && rows[i][cols[j]].match(/^SELECT/i)) {
          $tRow.append($tCell = jquery__WEBPACK_IMPORTED_MODULE_0__('<td class="linkElem">' + formatValue(cols[j], rows[i][cols[j]]) + '</td>'));
          $tCell.on('click', openQueryAnalyzer);
        } else {
          $tRow.append('<td>' + formatValue(cols[j], rows[i][cols[j]]) + '</td>');
        }

        $tRow.data('query', rows[i]);
      }
    }

    $table.append('<tfoot>' + '<tr><th colspan="' + (cols.length - 1) + '">' + window.Messages.strSumRows + ' ' + data.numRows + '<span class="float-end">' + window.Messages.strTotal + '</span></th><th class="text-end">' + data.sum.TOTAL + '</th></tr></tfoot>'); // Append a tooltip to the count column, if there exist one

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').find('tr').first().find('th').last().text().indexOf('#') > -1) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').find('tr').first().find('th').last().append('&nbsp;' + Functions.getImage('b_help', '', {
        'class': 'qroupedQueryInfoIcon'
      }));
      var tooltipContent = window.Messages.strCountColumnExplanation;

      if (groupInserts) {
        tooltipContent += '<p>' + window.Messages.strMoreCountColumnExplanation + '</p>';
      }

      Functions.tooltip(jquery__WEBPACK_IMPORTED_MODULE_0__('img.qroupedQueryInfoIcon'), 'img', tooltipContent);
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').find('table').tablesorter({
      sortList: [[cols.length - 1, 1]],
      widgets: ['fast-zebra']
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#logTable').find('table thead th').append('<div class="sorticon"></div>');
    return cols;
  }
  /* Opens the query analyzer dialog */


  function openQueryAnalyzer() {
    var rowData = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().data('query');
    var query = rowData.argument || rowData.sql_text;

    if (window.codeMirrorEditor) {
      // TODO: somehow Functions.sqlPrettyPrint messes up the query, needs be fixed
      // query = Functions.sqlPrettyPrint(query);
      window.codeMirrorEditor.setValue(query); // Codemirror is bugged, it doesn't refresh properly sometimes.
      // Following lines seem to fix that

      setTimeout(function () {
        window.codeMirrorEditor.refresh();
      }, 50);
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlquery').val(query);
    }

    var profilingChart = null;
    var dlgBtns = {};

    dlgBtns[window.Messages.strAnalyzeQuery] = function () {
      profilingChart = loadQueryAnalysis(rowData);
    };

    dlgBtns[window.Messages.strClose] = function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).dialog('close');
    };

    jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').dialog({
      width: 'auto',
      height: 'auto',
      resizable: false,
      buttons: dlgBtns,
      close: function () {
        if (profilingChart !== null) {
          profilingChart.destroy();
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('div.placeHolder').html('');

        if (window.codeMirrorEditor) {
          window.codeMirrorEditor.setValue('');
        } else {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlquery').val('');
        }
      }
    });
  }
  /* Loads and displays the analyzed query data */


  function loadQueryAnalysis(rowData) {
    var db = rowData.db || '';
    var profilingChart = null;
    jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('div.placeHolder').html(window.Messages.strAnalyzing + ' <img class="ajaxIcon" src="' + themeImagePath + 'ajax_clock_small.gif" alt="">');
    jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/server/status/monitor/query', {
      'ajax_request': true,
      'query': window.codeMirrorEditor ? window.codeMirrorEditor.getValue() : jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlquery').val(),
      'database': db,
      'server': window.CommonParams.get('server')
    }, function (responseData) {
      var data = responseData;
      var i;
      var l;

      if (typeof data !== 'undefined' && data.success === true) {
        data = data.message;
      }

      if (data.error) {
        if (data.error.indexOf('1146') !== -1 || data.error.indexOf('1046') !== -1) {
          data.error = window.Messages.strServerLogError;
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('div.placeHolder').html('<div class="alert alert-danger" role="alert">' + data.error + '</div>');
        return;
      }

      var totalTime = 0; // Float sux, I'll use table :(

      jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('div.placeHolder').html('<table class="table table-borderless"><tr><td class="explain"></td><td class="chart"></td></tr></table>');
      var explain = '<b>' + window.Messages.strExplainOutput + '</b> ' + jquery__WEBPACK_IMPORTED_MODULE_0__('#explain_docu').html();

      if (data.explain.length > 1) {
        explain += ' (';

        for (i = 0; i < data.explain.length; i++) {
          if (i > 0) {
            explain += ', ';
          }

          explain += '<a href="#showExplain-' + i + '">' + i + '</a>';
        }

        explain += ')';
      }

      explain += '<p></p>';

      var tempExplain = function (key, value) {
        var newValue = value === null ? 'null' : Functions.escapeHtml(value);

        if (key === 'type' && newValue.toLowerCase() === 'all') {
          newValue = '<span class="text-danger">' + newValue + '</span>';
        }

        if (key === 'Extra') {
          newValue = newValue.replace(/(using (temporary|filesort))/gi, '<span class="text-danger">$1</span>');
        }

        explain += key + ': ' + newValue + '<br>';
      };

      for (i = 0, l = data.explain.length; i < l; i++) {
        explain += '<div class="explain-' + i + '"' + (i > 0 ? 'style="display:none;"' : '') + '>';
        jquery__WEBPACK_IMPORTED_MODULE_0__.each(data.explain[i], tempExplain);
        explain += '</div>';
      }

      explain += '<p><b>' + window.Messages.strAffectedRows + '</b> ' + data.affectedRows;
      jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('div.placeHolder td.explain').append(explain);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('div.placeHolder a[href*="#showExplain"]').on('click', function () {
        var id = jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href').split('-')[1];
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().find('div[class*="explain"]').hide();
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().find('div[class*="explain-' + id + '"]').show();
      });

      if (data.profiling) {
        var chartData = [];
        var numberTable = '<table class="table table-sm table-striped table-hover w-auto queryNums"><thead><tr><th>' + window.Messages.strStatus + '</th><th>' + window.Messages.strTime + '</th></tr></thead><tbody>';
        var duration;
        var otherTime = 0;

        for (i = 0, l = data.profiling.length; i < l; i++) {
          duration = parseFloat(data.profiling[i].duration);
          totalTime += duration;
          numberTable += '<tr><td>' + data.profiling[i].state + ' </td><td> ' + Functions.prettyProfilingNum(duration, 2) + '</td></tr>';
        } // Only put those values in the pie which are > 2%


        for (i = 0, l = data.profiling.length; i < l; i++) {
          duration = parseFloat(data.profiling[i].duration);

          if (duration / totalTime > 0.02) {
            chartData.push([Functions.prettyProfilingNum(duration, 2) + ' ' + data.profiling[i].state, duration]);
          } else {
            otherTime += duration;
          }
        }

        if (otherTime > 0) {
          chartData.push([Functions.prettyProfilingNum(otherTime, 2) + ' ' + window.Messages.strOther, otherTime]);
        }

        numberTable += '<tr><td><b>' + window.Messages.strTotalTime + '</b></td><td>' + Functions.prettyProfilingNum(totalTime, 2) + '</td></tr>';
        numberTable += '</tbody></table>';
        jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('div.placeHolder td.chart').append('<b>' + window.Messages.strProfilingResults + ' ' + jquery__WEBPACK_IMPORTED_MODULE_0__('#profiling_docu').html() + '</b> ' + '(<a href="#showNums">' + window.Messages.strTable + '</a>, <a href="#showChart">' + window.Messages.strChart + '</a>)<br>' + numberTable + ' <div id="queryProfiling"></div>');
        jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('div.placeHolder a[href="#showNums"]').on('click', function () {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('#queryProfiling').hide();
          jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('table.queryNums').show();
          return false;
        });
        jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('div.placeHolder a[href="#showChart"]').on('click', function () {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('#queryProfiling').show();
          jquery__WEBPACK_IMPORTED_MODULE_0__('#queryAnalyzerDialog').find('table.queryNums').hide();
          return false;
        });
        profilingChart = Functions.createProfilingChart('queryProfiling', chartData);
      }
    });
    return profilingChart;
  }
  /* Saves the monitor to localstorage */


  function saveMonitor() {
    var gridCopy = {};
    jquery__WEBPACK_IMPORTED_MODULE_0__.each(runtime.charts, function (key, elem) {
      gridCopy[key] = {};
      gridCopy[key].nodes = elem.nodes;
      gridCopy[key].settings = elem.settings;
      gridCopy[key].title = elem.title;
      gridCopy[key].series = elem.series;
      gridCopy[key].maxYLabel = elem.maxYLabel;
    });

    if (window.Config.isStorageSupported('localStorage')) {
      window.localStorage.monitorCharts = JSON.stringify(gridCopy);
      window.localStorage.monitorSettings = JSON.stringify(monitorSettings);
      window.localStorage.monitorVersion = monitorProtocolVersion;
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#clearMonitorConfig"]').show();
  }
}); // Run the monitor once loaded

window.AJAX.registerOnload('server/status/monitor.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('a[href="#pauseCharts"]').trigger('click');
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(56));
/******/ }
]);
//# sourceMappingURL=monitor.js.map