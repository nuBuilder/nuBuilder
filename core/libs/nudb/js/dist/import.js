"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[32],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 39:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * Functions used in the import tab
 *
 */

/**
 * Toggles the hiding and showing of each plugin's options
 * according to the currently selected plugin from the dropdown list
 */

function changePluginOpts() {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#format_specific_opts').find('div.format_specific_options').each(function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).hide();
  });
  var selectedPluginName = jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins').find('option:selected').val();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#' + selectedPluginName + '_options').fadeIn('slow');
  const importNotification = document.getElementById('import_notification');
  importNotification.innerText = '';

  if (selectedPluginName === 'csv') {
    importNotification.innerHTML = '<div class="alert alert-info mb-0 mt-3" role="alert">' + window.Messages.strImportCSV + '</div>';
  }
}
/**
 * Toggles the hiding and showing of each plugin's options and sets the selected value
 * in the plugin dropdown list according to the format of the selected file
 *
 * @param {string} fname
 */


function matchFile(fname) {
  var fnameArray = fname.toLowerCase().split('.');
  var len = fnameArray.length;

  if (len !== 0) {
    var extension = fnameArray[len - 1];

    if (extension === 'gz' || extension === 'bz2' || extension === 'zip') {
      len--;
    } // Only toggle if the format of the file can be imported


    if (jquery__WEBPACK_IMPORTED_MODULE_0__('select[name=\'format\'] option').filterByValue(fnameArray[len - 1]).length === 1) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('select[name=\'format\'] option').filterByValue(fnameArray[len - 1]).prop('selected', true);
      changePluginOpts();
    }
  }
}
/**
 * Unbind all event handlers before tearing down a page
 */


window.AJAX.registerTeardown('import.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#input_import_file').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#select_local_import_file').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#input_import_file').off('change').off('focus');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#select_local_import_file').off('focus');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#text_csv_enclosed').add('#text_csv_escaped').off('keyup');
});
window.AJAX.registerOnload('import.js', function () {
  // import_file_form validation.
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '#import_file_form', function () {
    var radioLocalImport = jquery__WEBPACK_IMPORTED_MODULE_0__('#localFileTab');
    var radioImport = jquery__WEBPACK_IMPORTED_MODULE_0__('#uploadFileTab');
    var fileMsg = '<div class="alert alert-danger" role="alert"><img src="themes/dot.gif" title="" alt="" class="icon ic_s_error"> ' + window.Messages.strImportDialogMessage + '</div>';
    var wrongTblNameMsg = '<div class="alert alert-danger" role="alert"><img src="themes/dot.gif" title="" alt="" class="icon ic_s_error">' + window.Messages.strTableNameDialogMessage + '</div>';
    var wrongDBNameMsg = '<div class="alert alert-danger" role="alert"><img src="themes/dot.gif" title="" alt="" class="icon ic_s_error">' + window.Messages.strDBNameDialogMessage + '</div>';

    if (radioLocalImport.length !== 0) {
      // remote upload.
      if (radioImport.hasClass('active') && jquery__WEBPACK_IMPORTED_MODULE_0__('#input_import_file').val() === '') {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#input_import_file').trigger('focus');
        Functions.ajaxShowMessage(fileMsg, false);
        return false;
      }

      if (radioLocalImport.hasClass('active')) {
        if (jquery__WEBPACK_IMPORTED_MODULE_0__('#select_local_import_file').length === 0) {
          Functions.ajaxShowMessage('<div class="alert alert-danger" role="alert"><img src="themes/dot.gif" title="" alt="" class="icon ic_s_error"> ' + window.Messages.strNoImportFile + ' </div>', false);
          return false;
        }

        if (jquery__WEBPACK_IMPORTED_MODULE_0__('#select_local_import_file').val() === '') {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#select_local_import_file').trigger('focus');
          Functions.ajaxShowMessage(fileMsg, false);
          return false;
        }
      }
    } else {
      // local upload.
      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#input_import_file').val() === '') {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#input_import_file').trigger('focus');
        Functions.ajaxShowMessage(fileMsg, false);
        return false;
      }

      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#text_csv_new_tbl_name').length > 0) {
        var newTblName = jquery__WEBPACK_IMPORTED_MODULE_0__('#text_csv_new_tbl_name').val();

        if (newTblName.length > 0 && newTblName.trim().length === 0) {
          Functions.ajaxShowMessage(wrongTblNameMsg, false);
          return false;
        }
      }

      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#text_csv_new_db_name').length > 0) {
        var newDBName = jquery__WEBPACK_IMPORTED_MODULE_0__('#text_csv_new_db_name').val();

        if (newDBName.length > 0 && newDBName.trim().length === 0) {
          Functions.ajaxShowMessage(wrongDBNameMsg, false);
          return false;
        }
      }
    } // show progress bar.


    jquery__WEBPACK_IMPORTED_MODULE_0__('#upload_form_status').css('display', 'inline');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#upload_form_status_info').css('display', 'inline');
  }); // Initially display the options for the selected plugin

  changePluginOpts(); // Whenever the selected plugin changes, change the options displayed

  jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins').on('change', function () {
    changePluginOpts();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#input_import_file').on('change', function () {
    matchFile(jquery__WEBPACK_IMPORTED_MODULE_0__(this).val());
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#select_local_import_file').on('change', function () {
    matchFile(jquery__WEBPACK_IMPORTED_MODULE_0__(this).val());
  });
  /**
   * Set up the interface for Javascript-enabled browsers since the default is for
   *  Javascript-disabled browsers
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('#format_specific_opts').find('div.format_specific_options').find('h3').remove(); // $("form[name=import] *").unwrap();

  /**
   * for input element text_csv_enclosed and text_csv_escaped allow just one character to enter.
   * as mysql allows just one character for these fields,
   * if first character is escape then allow two including escape character.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('#text_csv_enclosed').add('#text_csv_escaped').on('keyup', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val().length === 2 && jquery__WEBPACK_IMPORTED_MODULE_0__(this).val().charAt(0) !== '\\') {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).val(jquery__WEBPACK_IMPORTED_MODULE_0__(this).val().substring(0, 1));
      return false;
    }

    return true;
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(39));
/******/ }
]);
//# sourceMappingURL=import.js.map