"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[54],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 60:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 *
 *
 * @package PhpMyAdmin
 */

/**
 * Unbind all event handlers before tearing down a page
 */

window.AJAX.registerTeardown('server/status/variables.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#filterAlert').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#filterText').off('keyup');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#filterCategory').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#dontFormat').off('change');
});
window.AJAX.registerOnload('server/status/variables.js', function () {
  // Filters for status variables
  var textFilter = null;
  var alertFilter = jquery__WEBPACK_IMPORTED_MODULE_0__('#filterAlert').prop('checked');
  var categoryFilter = jquery__WEBPACK_IMPORTED_MODULE_0__('#filterCategory').find(':selected').val();
  var text = ''; // Holds filter text

  /* 3 Filtering functions */

  jquery__WEBPACK_IMPORTED_MODULE_0__('#filterAlert').on('change', function () {
    alertFilter = this.checked;
    filterVariables();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#filterCategory').on('change', function () {
    categoryFilter = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();
    filterVariables();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#dontFormat').on('change', function () {
    // Hiding the table while changing values speeds up the process a lot
    const serverStatusVariables = jquery__WEBPACK_IMPORTED_MODULE_0__('#serverStatusVariables');
    serverStatusVariables.hide();
    serverStatusVariables.find('td.value span.original').toggle(this.checked);
    serverStatusVariables.find('td.value span.formatted').toggle(!this.checked);
    serverStatusVariables.show();
  }).trigger('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#filterText').on('keyup', function () {
    var word = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val().replace(/_/g, ' ');

    if (word.length === 0) {
      textFilter = null;
    } else {
      try {
        textFilter = new RegExp('(^| )' + word, 'i');
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).removeClass('error');
      } catch (e) {
        if (e instanceof SyntaxError) {
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).addClass('error');
          textFilter = null;
        }
      }
    }

    text = word;
    filterVariables();
  }).trigger('keyup');
  /* Filters the status variables by name/category/alert in the variables tab */

  function filterVariables() {
    var usefulLinks = 0;
    var section = text;

    if (categoryFilter.length > 0) {
      section = categoryFilter;
    }

    if (section.length > 1) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#linkSuggestions').find('span').each(function () {
        if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('class').indexOf('status_' + section) !== -1) {
          usefulLinks++;
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).css('display', '');
        } else {
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).css('display', 'none');
        }
      });
    }

    if (usefulLinks > 0) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#linkSuggestions').css('display', '');
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#linkSuggestions').css('display', 'none');
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('#serverStatusVariables').find('th.name').each(function () {
      if ((textFilter === null || textFilter.exec(jquery__WEBPACK_IMPORTED_MODULE_0__(this).text())) && (!alertFilter || jquery__WEBPACK_IMPORTED_MODULE_0__(this).next().find('span.text-danger').length > 0) && (categoryFilter.length === 0 || jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().hasClass('s_' + categoryFilter))) {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().css('display', '');
      } else {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().css('display', 'none');
      }
    });
  }
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(60));
/******/ }
]);
//# sourceMappingURL=variables.js.map