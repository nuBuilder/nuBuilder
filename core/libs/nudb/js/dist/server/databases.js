"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[47],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 53:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/* global Navigation */

/**
 * @implements EventListener
 */

const DropDatabases = {
  /**
   * @param {Event} event
   */
  handleEvent: function (event) {
    event.preventDefault();
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    /**
     * @var selected_dbs Array containing the names of the checked databases
     */

    var selectedDbs = []; // loop over all checked checkboxes, except the .checkall_box checkbox

    $form.find('input:checkbox:checked:not(.checkall_box)').each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('tr').addClass('removeMe');
      selectedDbs[selectedDbs.length] = 'DROP DATABASE `' + Functions.escapeHtml(jquery__WEBPACK_IMPORTED_MODULE_0__(this).val()) + '`;';
    });

    if (!selectedDbs.length) {
      Functions.ajaxShowMessage(jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="alert alert-warning" role="alert"></div>').text(window.Messages.strNoDatabasesSelected), 2000);
      return;
    }
    /**
     * @var question    String containing the question to be asked for confirmation
     */


    var question = window.Messages.strDropDatabaseStrongWarning + ' ' + Functions.sprintf(window.Messages.strDoYouReally, selectedDbs.join('<br>'));
    const modal = jquery__WEBPACK_IMPORTED_MODULE_0__('#dropDatabaseModal');
    modal.find('.modal-body').html(question);
    modal.modal('show');
    const url = 'index.php?route=/server/databases/destroy&' + jquery__WEBPACK_IMPORTED_MODULE_0__(this).serialize();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#dropDatabaseModalDropButton').on('click', function () {
      Functions.ajaxShowMessage(window.Messages.strProcessingRequest, false);
      var parts = url.split('?');
      var params = Functions.getJsConfirmCommonParam(this, parts[1]);
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(parts[0], params, function (data) {
        if (typeof data !== 'undefined' && data.success === true) {
          Functions.ajaxShowMessage(data.message);
          var $rowsToRemove = $form.find('tr.removeMe');
          var $databasesCount = jquery__WEBPACK_IMPORTED_MODULE_0__('#filter-rows-count');
          var newCount = parseInt($databasesCount.text(), 10) - $rowsToRemove.length;
          $databasesCount.text(newCount);
          $rowsToRemove.remove();
          $form.find('tbody').sortTable('.name');

          if ($form.find('tbody').find('tr').length === 0) {
            // user just dropped the last db on this page
            window.CommonActions.refreshMain();
          }

          Navigation.reload();
        } else {
          $form.find('tr.removeMe').removeClass('removeMe');
          Functions.ajaxShowMessage(data.error, false);
        }
      });
      modal.modal('hide');
      jquery__WEBPACK_IMPORTED_MODULE_0__('#dropDatabaseModalDropButton').off('click');
    });
  }
};
/**
 * @implements EventListener
 */

const CreateDatabase = {
  /**
   * @param {Event} event
   */
  handleEvent: function (event) {
    event.preventDefault();
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this); // TODO Remove this section when all browsers support HTML5 "required" property

    var newDbNameInput = $form.find('input[name=new_db]');

    if (newDbNameInput.val() === '') {
      newDbNameInput.trigger('focus');
      alert(window.Messages.strFormEmpty);
      return;
    } // end remove


    Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
    Functions.prepareForAjaxRequest($form);
    jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), $form.serialize(), function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        Functions.ajaxShowMessage(data.message);
        var $databasesCountObject = jquery__WEBPACK_IMPORTED_MODULE_0__('#filter-rows-count');
        var databasesCount = parseInt($databasesCountObject.text(), 10) + 1;
        $databasesCountObject.text(databasesCount);
        Navigation.reload(); // make ajax request to load db structure page - taken from ajax.js

        var dbStructUrl = data.url;
        dbStructUrl = dbStructUrl.replace(/amp;/ig, '');
        var params = 'ajax_request=true' + window.CommonParams.get('arg_separator') + 'ajax_page_request=true';
        jquery__WEBPACK_IMPORTED_MODULE_0__.get(dbStructUrl, params, window.AJAX.responseHandler);
      } else {
        Functions.ajaxShowMessage(data.error, false);
      }
    });
  }
};

function checkPrivilegesForDatabase() {
  var tableRows = jquery__WEBPACK_IMPORTED_MODULE_0__('.server_databases');
  jquery__WEBPACK_IMPORTED_MODULE_0__.each(tableRows, function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).on('click', function () {
      window.CommonActions.setDb(jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('data'));
    });
  });
}

window.AJAX.registerTeardown('server/databases.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', '#dbStatsForm');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', '#create_database_form.ajax');
});
window.AJAX.registerOnload('server/databases.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '#dbStatsForm', DropDatabases.handleEvent);
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '#create_database_form.ajax', CreateDatabase.handleEvent);
  checkPrivilegesForDatabase();
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(53));
/******/ }
]);
//# sourceMappingURL=databases.js.map