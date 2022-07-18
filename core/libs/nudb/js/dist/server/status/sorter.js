"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[53],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 59:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
 // TODO: tablesorter shouldn't sort already sorted columns
// eslint-disable-next-line no-unused-vars

function initTableSorter(tabid) {
  var $table;
  var opts;

  switch (tabid) {
    case 'statustabs_queries':
      $table = jquery__WEBPACK_IMPORTED_MODULE_0__('#serverStatusQueriesDetails');
      opts = {
        sortList: [[3, 1]],
        headers: {
          1: {
            sorter: 'fancyNumber'
          },
          2: {
            sorter: 'fancyNumber'
          }
        }
      };
      break;
  }

  $table.tablesorter(opts);
  $table.find('tr').first().find('th').append('<div class="sorticon"></div>');
}

window.initTableSorter = initTableSorter;
jquery__WEBPACK_IMPORTED_MODULE_0__(function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__.tablesorter.addParser({
    id: 'fancyNumber',
    is: function (s) {
      return /^[0-9]?[0-9,\\.]*\s?(k|M|G|T|%)?$/.test(s);
    },
    format: function (s) {
      var num = jquery__WEBPACK_IMPORTED_MODULE_0__.tablesorter.formatFloat(s.replace(window.Messages.strThousandsSeparator, '').replace(window.Messages.strDecimalSeparator, '.'));
      var factor = 1;

      switch (s.charAt(s.length - 1)) {
        case '%':
          factor = -2;
          break;
        // Todo: Complete this list (as well as in the regexp a few lines up)

        case 'k':
          factor = 3;
          break;

        case 'M':
          factor = 6;
          break;

        case 'G':
          factor = 9;
          break;

        case 'T':
          factor = 12;
          break;
      }

      return num * Math.pow(10, factor);
    },
    type: 'numeric'
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__.tablesorter.addParser({
    id: 'withinSpanNumber',
    is: function (s) {
      return /<span class="original"/.test(s);
    },
    format: function (s, table, html) {
      var res = html.innerHTML.match(/<span(\s*style="display:none;"\s*)?\s*class="original">(.*)?<\/span>/);
      return res && res.length >= 3 ? res[2] : 0;
    },
    type: 'numeric'
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(59));
/******/ }
]);
//# sourceMappingURL=sorter.js.map