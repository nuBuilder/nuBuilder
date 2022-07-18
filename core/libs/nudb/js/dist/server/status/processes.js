"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[51],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 57:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * Server Status Processes
 *
 * @package PhpMyAdmin
 */
// object to store process list state information

var processList = {
  // denotes whether auto refresh is on or off
  autoRefresh: false,
  // stores the GET request which refresh process list
  refreshRequest: null,
  // stores the timeout id returned by setTimeout
  refreshTimeout: null,
  // the refresh interval in seconds
  refreshInterval: null,
  // the refresh URL (required to save last used option)
  // i.e. full or sorting url
  refreshUrl: null,

  /**
   * Handles killing of a process
   *
   * @return {void}
   */
  init: function () {
    processList.setRefreshLabel();

    if (processList.refreshUrl === null) {
      processList.refreshUrl = 'index.php?route=/server/status/processes/refresh';
    }

    if (processList.refreshInterval === null) {
      processList.refreshInterval = jquery__WEBPACK_IMPORTED_MODULE_0__('#id_refreshRate').val();
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#id_refreshRate').val(processList.refreshInterval);
    }
  },

  /**
   * Handles killing of a process
   *
   * @param {object} event the event object
   *
   * @return {void}
   */
  killProcessHandler: function (event) {
    event.preventDefault();
    var argSep = window.CommonParams.get('arg_separator');
    var params = jquery__WEBPACK_IMPORTED_MODULE_0__(this).getPostData();
    params += argSep + 'ajax_request=1' + argSep + 'server=' + window.CommonParams.get('server'); // Get row element of the process to be killed.

    var $tr = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('tr');
    jquery__WEBPACK_IMPORTED_MODULE_0__.post(jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href'), params, function (data) {
      // Check if process was killed or not.
      if (data.hasOwnProperty('success') && data.success) {
        // remove the row of killed process.
        $tr.remove(); // As we just removed a row, reapply odd-even classes
        // to keep table stripes consistent

        var $tableProcessListTr = jquery__WEBPACK_IMPORTED_MODULE_0__('#tableprocesslist').find('> tbody > tr');
        $tableProcessListTr.each(function (index) {
          if (index >= 0 && index % 2 === 0) {
            jquery__WEBPACK_IMPORTED_MODULE_0__(this).removeClass('odd').addClass('even');
          } else if (index >= 0 && index % 2 !== 0) {
            jquery__WEBPACK_IMPORTED_MODULE_0__(this).removeClass('even').addClass('odd');
          }
        }); // Show process killed message

        Functions.ajaxShowMessage(data.message, false);
      } else {
        // Show process error message
        Functions.ajaxShowMessage(data.error, false);
      }
    }, 'json');
  },

  /**
   * Handles Auto Refreshing
   * @return {void}
   */
  refresh: function () {
    // abort any previous pending requests
    // this is necessary, it may go into
    // multiple loops causing unnecessary
    // requests even after leaving the page.
    processList.abortRefresh(); // if auto refresh is enabled

    if (processList.autoRefresh) {
      // Only fetch the table contents
      processList.refreshUrl = 'index.php?route=/server/status/processes/refresh';
      var interval = parseInt(processList.refreshInterval, 10) * 1000;
      var urlParams = processList.getUrlParams();
      processList.refreshRequest = jquery__WEBPACK_IMPORTED_MODULE_0__.post(processList.refreshUrl, urlParams, function (data) {
        if (data.hasOwnProperty('success') && data.success) {
          var $newTable = jquery__WEBPACK_IMPORTED_MODULE_0__(data.message);
          jquery__WEBPACK_IMPORTED_MODULE_0__('#tableprocesslist').html($newTable.html());
          Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#tableprocesslist'));
        }

        processList.refreshTimeout = setTimeout(processList.refresh, interval);
      });
    }
  },

  /**
   * Stop current request and clears timeout
   *
   * @return {void}
   */
  abortRefresh: function () {
    if (processList.refreshRequest !== null) {
      processList.refreshRequest.abort();
      processList.refreshRequest = null;
    }

    clearTimeout(processList.refreshTimeout);
  },

  /**
   * Set label of refresh button
   * change between play & pause
   *
   * @return {void}
   */
  setRefreshLabel: function () {
    var img = 'play';
    var label = window.Messages.strStartRefresh;

    if (processList.autoRefresh) {
      img = 'pause';
      label = window.Messages.strStopRefresh;
      processList.refresh();
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('a#toggleRefresh').html(Functions.getImage(img) + Functions.escapeHtml(label));
  },

  /**
   * Return the Url Parameters
   * for autorefresh request,
   * includes showExecuting if the filter is checked
   *
   * @return {object} urlParams - url parameters with autoRefresh request
   */
  getUrlParams: function () {
    var urlParams = {
      'server': window.CommonParams.get('server'),
      'ajax_request': true,
      'refresh': true,
      'full': jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="full"]').val(),
      'order_by_field': jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="order_by_field"]').val(),
      'column_name': jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="column_name"]').val(),
      'sort_order': jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="sort_order"]').val()
    };

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#showExecuting').is(':checked')) {
      urlParams.showExecuting = true;
      return urlParams;
    }

    return urlParams;
  }
};
window.AJAX.registerOnload('server/status/processes.js', function () {
  processList.init(); // Bind event handler for kill_process

  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableprocesslist').on('click', 'a.kill_process', processList.killProcessHandler); // Bind event handler for toggling refresh of process list

  jquery__WEBPACK_IMPORTED_MODULE_0__('a#toggleRefresh').on('click', function (event) {
    event.preventDefault();
    processList.autoRefresh = !processList.autoRefresh;
    processList.setRefreshLabel();
  }); // Bind event handler for change in refresh rate

  jquery__WEBPACK_IMPORTED_MODULE_0__('#id_refreshRate').on('change', function () {
    processList.refreshInterval = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();
    processList.refresh();
  }); // Bind event handler for table header links

  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableprocesslist').on('click', 'thead a', function () {
    processList.refreshUrl = jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href');
  });
});
/**
 * Unbind all event handlers before tearing down a page
 */

window.AJAX.registerTeardown('server/status/processes.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableprocesslist').off('click', 'a.kill_process');
  jquery__WEBPACK_IMPORTED_MODULE_0__('a#toggleRefresh').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#id_refreshRate').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#tableprocesslist').off('click', 'thead a'); // stop refreshing further

  processList.abortRefresh();
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(57));
/******/ }
]);
//# sourceMappingURL=processes.js.map