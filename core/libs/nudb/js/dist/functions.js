"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[29],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 33:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _modules_doc_links_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(34);


/* global Navigation */

/* global ChartType, ColumnType, DataTable, JQPlotChartFactory */
// js/chart.js

/* global DatabaseStructure */
// js/database/structure.js

/* global Indexes */
// js/indexes.js

/* global firstDayOfCalendar, maxInputVars, mysqlDocTemplate, themeImagePath */
// templates/javascript/variables.twig

/**
 * General functions, usually for data manipulation pages.
 * @type {object}
 */

const Functions = {};
window.Functions = Functions;
/**
 * Number of AJAX messages shown since page load.
 * @type {number}
 */

let ajaxMessageCount = 0;
/**
 * Object containing CodeMirror editor of the query editor in SQL tab.
 * @type {(object|boolean|null)}
 */

window.codeMirrorEditor = false;
/**
 * Object containing CodeMirror editor of the inline query editor.
 * @type {(object|boolean|null)}
 */

let codeMirrorInlineEditor = false;
/**
 * Shows if Table/Column name autocomplete AJAX is in progress.
 * @type {boolean}
 */

let sqlAutoCompleteInProgress = false;
/**
 * Object containing list of columns in each table.
 * @type {(array|boolean)}
 */

let sqlAutoComplete = false;
/**
 * String containing default table to autocomplete columns.
 * @type {string}
 */

let sqlAutoCompleteDefaultTable = '';
/**
 * Array to hold the columns in central list per db.
 * @type {array}
 */

window.centralColumnList = [];
/**
 * Array to hold 'Primary' index columns.
 * @type {array}
 */

window.primaryIndexes = [];
/**
 * Array to hold 'Unique' index columns.
 * @type {array}
 */

window.uniqueIndexes = [];
/**
 * Array to hold 'Index' columns.
 * @type {array}
 */

window.indexes = [];
/**
 * Array to hold 'Fulltext' columns.
 * @type {array}
 */

window.fulltextIndexes = [];
/**
 * Array to hold 'Spatial' columns.
 * @type {array}
 */

window.spatialIndexes = [];
/**
 * Make sure that ajax requests will not be cached by appending a random variable to their parameters.
 * @return {function}
 */

Functions.addNoCacheToAjaxRequests = () => function (options, originalOptions) {
  var nocache = new Date().getTime() + '' + Math.floor(Math.random() * 1000000);

  if (typeof options.data === 'string') {
    options.data += '&_nocache=' + nocache + '&token=' + encodeURIComponent(window.CommonParams.get('token'));
  } else if (typeof options.data === 'object') {
    options.data = jquery__WEBPACK_IMPORTED_MODULE_0__.extend(originalOptions.data, {
      '_nocache': nocache,
      'token': window.CommonParams.get('token')
    });
  }
};
/**
 * @return {number}
 */


Functions.getAjaxMessageCount = function () {
  return ajaxMessageCount;
};
/**
 * Adds a date/time picker to an element
 *
 * @param {object} $thisElement a jQuery object pointing to the element
 * @param {string} type
 * @param {object} options
 */


Functions.addDatepicker = function ($thisElement, type, options) {
  if (type !== 'date' && type !== 'time' && type !== 'datetime' && type !== 'timestamp') {
    return;
  }

  var showTimepicker = true;

  if (type === 'date') {
    showTimepicker = false;
  } // Getting the current Date and time


  var currentDateTime = new Date();
  var defaultOptions = {
    timeInput: true,
    hour: currentDateTime.getHours(),
    minute: currentDateTime.getMinutes(),
    second: currentDateTime.getSeconds(),
    showOn: 'button',
    buttonImage: themeImagePath + 'b_calendar.png',
    buttonImageOnly: true,
    stepMinutes: 1,
    stepHours: 1,
    showSecond: true,
    showMillisec: true,
    showMicrosec: true,
    showTimepicker: showTimepicker,
    showButtonPanel: false,
    changeYear: true,
    dateFormat: 'yy-mm-dd',
    // yy means year with four digits
    timeFormat: 'HH:mm:ss.lc',
    constrainInput: false,
    altFieldTimeOnly: false,
    showAnim: '',
    beforeShow: function (input, inst) {
      // Remember that we came from the datepicker; this is used
      // in table/change.js by verificationsAfterFieldChange()
      $thisElement.data('comes_from', 'datepicker');

      if (jquery__WEBPACK_IMPORTED_MODULE_0__(input).closest('.cEdit').length > 0) {
        setTimeout(function () {
          inst.dpDiv.css({
            top: 0,
            left: 0,
            position: 'relative'
          });
        }, 0);
      }

      setTimeout(function () {
        // Fix wrong timepicker z-index, doesn't work without timeout
        jquery__WEBPACK_IMPORTED_MODULE_0__('#ui-timepicker-div').css('z-index', jquery__WEBPACK_IMPORTED_MODULE_0__('#ui-datepicker-div').css('z-index')); // Integrate tooltip text into dialog

        var tooltip = $thisElement.uiTooltip('instance');

        if (typeof tooltip !== 'undefined') {
          tooltip.disable();
          var $note = jquery__WEBPACK_IMPORTED_MODULE_0__('<p class="note"></div>');
          $note.text(tooltip.option('content'));
          jquery__WEBPACK_IMPORTED_MODULE_0__('div.ui-datepicker').append($note);
        }
      }, 0);
    },
    onSelect: function () {
      $thisElement.data('datepicker').inline = true;
    },
    onClose: function () {
      // The value is no more from the date picker
      $thisElement.data('comes_from', '');

      if (typeof $thisElement.data('datepicker') !== 'undefined') {
        $thisElement.data('datepicker').inline = false;
      }

      var tooltip = $thisElement.uiTooltip('instance');

      if (typeof tooltip !== 'undefined') {
        tooltip.enable();
      }
    }
  };

  if (type === 'time') {
    $thisElement.timepicker(jquery__WEBPACK_IMPORTED_MODULE_0__.extend(defaultOptions, options)); // Add a tip regarding entering MySQL allowed-values for TIME data-type

    Functions.tooltip($thisElement, 'input', window.Messages.strMysqlAllowedValuesTipTime);
  } else {
    $thisElement.datetimepicker(jquery__WEBPACK_IMPORTED_MODULE_0__.extend(defaultOptions, options));
  }
};
/**
 * Add a date/time picker to each element that needs it
 * (only when jquery-ui-timepicker-addon.js is loaded)
 */


Functions.addDateTimePicker = function () {
  if (jquery__WEBPACK_IMPORTED_MODULE_0__.timepicker !== undefined) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('input.timefield, input.datefield, input.datetimefield').each(function () {
      var decimals = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().attr('data-decimals');
      var type = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().attr('data-type');
      var showMillisec = false;
      var showMicrosec = false;
      var timeFormat = 'HH:mm:ss';
      var hourMax = 23; // check for decimal places of seconds

      if (decimals > 0 && type.indexOf('time') !== -1) {
        if (decimals > 3) {
          showMillisec = true;
          showMicrosec = true;
          timeFormat = 'HH:mm:ss.lc';
        } else {
          showMillisec = true;
          timeFormat = 'HH:mm:ss.l';
        }
      }

      if (type === 'time') {
        hourMax = 99;
      }

      Functions.addDatepicker(jquery__WEBPACK_IMPORTED_MODULE_0__(this), type, {
        showMillisec: showMillisec,
        showMicrosec: showMicrosec,
        timeFormat: timeFormat,
        hourMax: hourMax,
        firstDay: firstDayOfCalendar
      }); // Add a tip regarding entering MySQL allowed-values
      // for TIME and DATE data-type

      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).hasClass('timefield')) {
        Functions.tooltip(jquery__WEBPACK_IMPORTED_MODULE_0__(this), 'input', window.Messages.strMysqlAllowedValuesTipTime);
      } else if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).hasClass('datefield')) {
        Functions.tooltip(jquery__WEBPACK_IMPORTED_MODULE_0__(this), 'input', window.Messages.strMysqlAllowedValuesTipDate);
      }
    });
  }
};
/**
 * Handle redirect and reload flags sent as part of AJAX requests
 *
 * @param data ajax response data
 */


Functions.handleRedirectAndReload = function (data) {
  if (parseInt(data.redirect_flag) === 1) {
    // add one more GET param to display session expiry msg
    if (window.location.href.indexOf('?') === -1) {
      window.location.href += '?session_expired=1';
    } else {
      window.location.href += window.CommonParams.get('arg_separator') + 'session_expired=1';
    }

    window.location.reload();
  } else if (parseInt(data.reload_flag) === 1) {
    window.location.reload();
  }
};
/**
 * Creates an SQL editor which supports auto completing etc.
 *
 * @param $textarea   jQuery object wrapping the textarea to be made the editor
 * @param options     optional options for CodeMirror
 * @param {'vertical'|'horizontal'|'both'} resize optional resizing ('vertical', 'horizontal', 'both')
 * @param lintOptions additional options for lint
 *
 * @return {object|null}
 */


Functions.getSqlEditor = function ($textarea, options, resize, lintOptions) {
  var resizeType = resize;

  if ($textarea.length > 0 && typeof window.CodeMirror !== 'undefined') {
    // merge options for CodeMirror
    var defaults = {
      lineNumbers: true,
      matchBrackets: true,
      extraKeys: {
        'Ctrl-Space': 'autocomplete'
      },
      hintOptions: {
        'completeSingle': false,
        'completeOnSingleClick': true
      },
      indentUnit: 4,
      mode: 'text/x-mysql',
      lineWrapping: true
    };

    if (window.CodeMirror.sqlLint) {
      jquery__WEBPACK_IMPORTED_MODULE_0__.extend(defaults, {
        gutters: ['CodeMirror-lint-markers'],
        lint: {
          'getAnnotations': window.CodeMirror.sqlLint,
          'async': true,
          'lintOptions': lintOptions
        }
      });
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__.extend(true, defaults, options); // create CodeMirror editor

    var codemirrorEditor = window.CodeMirror.fromTextArea($textarea[0], defaults); // allow resizing

    if (!resizeType) {
      resizeType = 'vertical';
    }

    var handles = '';

    if (resizeType === 'vertical') {
      handles = 's';
    }

    if (resizeType === 'both') {
      handles = 'all';
    }

    if (resizeType === 'horizontal') {
      handles = 'e, w';
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__(codemirrorEditor.getWrapperElement()).css('resize', resizeType).resizable({
      handles: handles,
      resize: function () {
        codemirrorEditor.setSize(jquery__WEBPACK_IMPORTED_MODULE_0__(this).width(), jquery__WEBPACK_IMPORTED_MODULE_0__(this).height());
      }
    }); // enable autocomplete

    codemirrorEditor.on('inputRead', Functions.codeMirrorAutoCompleteOnInputRead); // page locking

    codemirrorEditor.on('change', function (e) {
      e.data = {
        value: 3,
        content: codemirrorEditor.isClean()
      };
      window.AJAX.lockPageHandler(e);
    });
    return codemirrorEditor;
  }

  return null;
};
/**
 * Clear text selection
 */


Functions.clearSelection = function () {
  if (document.selection && document.selection.empty) {
    document.selection.empty();
  } else if (window.getSelection) {
    var sel = window.getSelection();

    if (sel.empty) {
      sel.empty();
    }

    if (sel.removeAllRanges) {
      sel.removeAllRanges();
    }
  }
};
/**
 * Create a jQuery UI tooltip
 *
 * @param $elements     jQuery object representing the elements
 * @param item          the item
 *                      (see https://api.jqueryui.com/tooltip/#option-items)
 * @param myContent     content of the tooltip
 * @param additionalOptions to override the default options
 *
 */


Functions.tooltip = function ($elements, item, myContent, additionalOptions) {
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#no_hint').length > 0) {
    return;
  }

  var defaultOptions = {
    content: myContent,
    items: item,
    tooltipClass: 'tooltip',
    track: true,
    show: false,
    hide: false
  };
  $elements.uiTooltip(jquery__WEBPACK_IMPORTED_MODULE_0__.extend(true, defaultOptions, additionalOptions));
};
/**
 * HTML escaping
 *
 * @param {any} unsafe
 * @return {string | false}
 */


Functions.escapeHtml = function (unsafe) {
  if (typeof unsafe !== 'undefined') {
    return unsafe.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  } else {
    return false;
  }
};
/**
 * JavaScript escaping
 *
 * @param {any} unsafe
 * @return {string | false}
 */


Functions.escapeJsString = function (unsafe) {
  if (typeof unsafe !== 'undefined') {
    return unsafe.toString().replace('\x00', '').replace('\\', '\\\\').replace('\'', '\\\'').replace('&#039;', '\\&#039;').replace('"', '\\"').replace('&quot;', '\\&quot;').replace('\n', '\n').replace('\r', '\r').replace(/<\/script/gi, '</\' + \'script');
  } else {
    return false;
  }
};
/**
 * @param {string} s
 * @return {string}
 */


Functions.escapeBacktick = function (s) {
  return s.replace('`', '``');
};
/**
 * @param {string} s
 * @return {string}
 */


Functions.escapeSingleQuote = function (s) {
  return s.replace('\\', '\\\\').replace('\'', '\\\'');
};

Functions.sprintf = function () {
  return window.sprintf.apply(this, arguments);
};
/**
 * Hides/shows the default value input field, depending on the default type
 * Ticks the NULL checkbox if NULL is chosen as default value.
 *
 * @param {JQuery<HTMLElement>} $defaultType
 */


Functions.hideShowDefaultValue = function ($defaultType) {
  if ($defaultType.val() === 'USER_DEFINED') {
    $defaultType.siblings('.default_value').show().trigger('focus');
  } else {
    $defaultType.siblings('.default_value').hide();

    if ($defaultType.val() === 'NULL') {
      var $nullCheckbox = $defaultType.closest('tr').find('.allow_null');
      $nullCheckbox.prop('checked', true);
    }
  }
};
/**
 * Hides/shows the input field for column expression based on whether
 * VIRTUAL/PERSISTENT is selected
 *
 * @param $virtuality virtuality dropdown
 */


Functions.hideShowExpression = function ($virtuality) {
  if ($virtuality.val() === '') {
    $virtuality.siblings('.expression').hide();
  } else {
    $virtuality.siblings('.expression').show();
  }
};
/**
 * Show notices for ENUM columns; add/hide the default value
 *
 */


Functions.verifyColumnsProperties = function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('select.column_type').each(function () {
    Functions.showNoticeForEnum(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
    Functions.showWarningForIntTypes();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('select.default_type').each(function () {
    Functions.hideShowDefaultValue(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('select.virtuality').each(function () {
    Functions.hideShowExpression(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  });
};
/**
 * Add a hidden field to the form to indicate that this will be an
 * Ajax request (only if this hidden field does not exist)
 *
 * @param {object} $form the form
 */


Functions.prepareForAjaxRequest = function ($form) {
  if (!$form.find('input:hidden').is('#ajax_request_hidden')) {
    $form.append('<input type="hidden" id="ajax_request_hidden" name="ajax_request" value="true">');
  }
};

Functions.checkPasswordStrength = function (value, meterObject, meterObjectLabel, username) {
  // List of words we don't want to appear in the password
  var customDict = ['phpmyadmin', 'mariadb', 'mysql', 'php', 'my', 'admin'];

  if (username !== null) {
    customDict.push(username);
  }

  window.zxcvbnts.core.zxcvbnOptions.setOptions({
    dictionary: {
      userInputs: customDict
    }
  });
  var zxcvbnObject = window.zxcvbnts.core.zxcvbn(value);
  var strength = zxcvbnObject.score;
  strength = parseInt(strength);
  meterObject.val(strength);

  switch (strength) {
    case 0:
      meterObjectLabel.html(window.Messages.strExtrWeak);
      break;

    case 1:
      meterObjectLabel.html(window.Messages.strVeryWeak);
      break;

    case 2:
      meterObjectLabel.html(window.Messages.strWeak);
      break;

    case 3:
      meterObjectLabel.html(window.Messages.strGood);
      break;

    case 4:
      meterObjectLabel.html(window.Messages.strStrong);
  }
};
/**
 * Generate a new password and copy it to the password input areas
 *
 * @param {object} passwordForm the form that holds the password fields
 *
 * @return {boolean} always true
 */


Functions.suggestPassword = function (passwordForm) {
  // restrict the password to just letters and numbers to avoid problems:
  // "editors and viewers regard the password as multiple words and
  // things like double click no longer work"
  var pwchars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWYXZ@!_.*/()[]-';
  var passwordlength = 16; // do we want that to be dynamic?  no, keep it simple :)

  var passwd = passwordForm.generated_pw; // eslint-disable-next-line compat/compat

  var randomWords = new Int32Array(passwordlength);
  passwd.value = '';
  var i; // First we're going to try to use a built-in CSPRNG
  // eslint-disable-next-line compat/compat

  if (window.crypto && window.crypto.getRandomValues) {
    // eslint-disable-next-line compat/compat
    window.crypto.getRandomValues(randomWords);
  } else if (window.msCrypto && window.msCrypto.getRandomValues) {
    // Because of course IE calls it msCrypto instead of being standard
    window.msCrypto.getRandomValues(randomWords);
  } else {
    // Fallback to Math.random
    for (i = 0; i < passwordlength; i++) {
      randomWords[i] = Math.floor(Math.random() * pwchars.length);
    }
  }

  for (i = 0; i < passwordlength; i++) {
    passwd.value += pwchars.charAt(Math.abs(randomWords[i]) % pwchars.length);
  }

  var $jQueryPasswordForm = jquery__WEBPACK_IMPORTED_MODULE_0__(passwordForm);
  passwordForm.elements.pma_pw.value = passwd.value;
  passwordForm.elements.pma_pw2.value = passwd.value;
  var meterObj = $jQueryPasswordForm.find('meter[name="pw_meter"]').first();
  var meterObjLabel = $jQueryPasswordForm.find('span[name="pw_strength"]').first();
  Functions.checkPasswordStrength(passwd.value, meterObj, meterObjLabel);
  return true;
};
/**
 * for PhpMyAdmin\Display\ChangePassword and /user-password
 */


Functions.displayPasswordGenerateButton = function () {
  var generatePwdRow = jquery__WEBPACK_IMPORTED_MODULE_0__('<tr></tr>').addClass('align-middle');
  jquery__WEBPACK_IMPORTED_MODULE_0__('<td></td>').html(window.Messages.strGeneratePassword).appendTo(generatePwdRow);
  var pwdCell = jquery__WEBPACK_IMPORTED_MODULE_0__('<td colspan="2"></td>').addClass('row').appendTo(generatePwdRow);
  pwdCell.append('<div class="d-flex align-items-center col-4"></div>');
  var pwdButton = jquery__WEBPACK_IMPORTED_MODULE_0__('<input>').attr({
    type: 'button',
    id: 'button_generate_password',
    value: window.Messages.strGenerate
  }).addClass('btn btn-secondary button').on('click', function () {
    Functions.suggestPassword(this.form);
  });
  var pwdTextbox = jquery__WEBPACK_IMPORTED_MODULE_0__('<input>').attr({
    type: 'text',
    name: 'generated_pw',
    id: 'generated_pw'
  }).addClass('col-6');
  pwdCell.find('div').eq(0).append(pwdButton);
  pwdCell.append(pwdTextbox);

  if (document.getElementById('button_generate_password') === null) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#tr_element_before_generate_password').parent().append(generatePwdRow);
  }

  var generatePwdDiv = jquery__WEBPACK_IMPORTED_MODULE_0__('<div></div>').addClass('item');
  jquery__WEBPACK_IMPORTED_MODULE_0__('<label></label>').attr({
    for: 'button_generate_password'
  }).html(window.Messages.strGeneratePassword + ':').appendTo(generatePwdDiv);
  var optionsSpan = jquery__WEBPACK_IMPORTED_MODULE_0__('<span></span>').addClass('options').appendTo(generatePwdDiv);
  pwdButton.clone(true).appendTo(optionsSpan);
  pwdTextbox.clone(true).appendTo(generatePwdDiv);

  if (document.getElementById('button_generate_password') === null) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#div_element_before_generate_password').parent().append(generatePwdDiv);
  }
};
/**
 * Displays a confirmation box before submitting a "DROP/DELETE/ALTER" query.
 * This function is called while clicking links
 *
 * @param {object} theLink     the link
 * @param {object} theSqlQuery the sql query to submit
 *
 * @return {boolean} whether to run the query or not
 */


Functions.confirmLink = function (theLink, theSqlQuery) {
  // Confirmation is not required in the configuration file
  // or browser is Opera (crappy js implementation)
  if (window.Messages.strDoYouReally === '' || typeof window.opera !== 'undefined') {
    return true;
  }

  var isConfirmed = confirm(Functions.sprintf(window.Messages.strDoYouReally, theSqlQuery));

  if (isConfirmed) {
    if (typeof theLink.href !== 'undefined') {
      theLink.href += window.CommonParams.get('arg_separator') + 'is_js_confirmed=1';
    } else if (typeof theLink.form !== 'undefined') {
      theLink.form.action += '?is_js_confirmed=1';
    }
  }

  return isConfirmed;
};
/**
 * Confirms a "DROP/DELETE/ALTER" query before
 * submitting it if required.
 * This function is called by the 'Functions.checkSqlQuery()' js function.
 *
 * @param {object} theForm1  the form
 * @param {string} sqlQuery1 the sql query string
 *
 * @return {boolean} whether to run the query or not
 *
 * @see Functions.checkSqlQuery()
 */


Functions.confirmQuery = function (theForm1, sqlQuery1) {
  // Confirmation is not required in the configuration file
  if (window.Messages.strDoYouReally === '') {
    return true;
  } // Confirms a "DROP/DELETE/ALTER/TRUNCATE" statement
  //
  // TODO: find a way (if possible) to use the parser-analyser
  // for this kind of verification
  // For now, I just added a ^ to check for the statement at
  // beginning of expression


  var doConfirmRegExp0 = new RegExp('^\\s*DROP\\s+(IF EXISTS\\s+)?(TABLE|PROCEDURE)\\s', 'i');
  var doConfirmRegExp1 = new RegExp('^\\s*ALTER\\s+TABLE\\s+((`[^`]+`)|([A-Za-z0-9_$]+))\\s+DROP\\s', 'i');
  var doConfirmRegExp2 = new RegExp('^\\s*DELETE\\s+FROM\\s', 'i');
  var doConfirmRegExp3 = new RegExp('^\\s*TRUNCATE\\s', 'i');
  var doConfirmRegExp4 = new RegExp('^(?=.*UPDATE\\b)^((?!WHERE).)*$', 'i');

  if (doConfirmRegExp0.test(sqlQuery1) || doConfirmRegExp1.test(sqlQuery1) || doConfirmRegExp2.test(sqlQuery1) || doConfirmRegExp3.test(sqlQuery1) || doConfirmRegExp4.test(sqlQuery1)) {
    var message;

    if (sqlQuery1.length > 100) {
      message = sqlQuery1.substring(0, 100) + '\n    ...';
    } else {
      message = sqlQuery1;
    }

    var isConfirmed = confirm(Functions.sprintf(window.Messages.strDoYouReally, message)); // statement is confirmed -> update the
    // "is_js_confirmed" form field so the confirm test won't be
    // run on the server side and allows to submit the form

    if (isConfirmed) {
      theForm1.elements.is_js_confirmed.value = 1;
      return true;
    } else {
      // statement is rejected -> do not submit the form
      window.focus();
      return false;
    } // end if (handle confirm box result)

  } // end if (display confirm box)


  return true;
};
/**
 * Displays an error message if the user submitted the sql query form with no
 * sql query, else checks for "DROP/DELETE/ALTER" statements
 *
 * @param {object} theForm the form
 *
 * @return {boolean} always false
 *
 * @see Functions.confirmQuery()
 */


Functions.checkSqlQuery = function (theForm) {
  // get the textarea element containing the query
  var sqlQuery;

  if (window.codeMirrorEditor) {
    window.codeMirrorEditor.save();
    sqlQuery = window.codeMirrorEditor.getValue();
  } else {
    sqlQuery = theForm.elements.sql_query.value;
  }

  var spaceRegExp = new RegExp('\\s+');

  if (typeof theForm.elements.sql_file !== 'undefined' && theForm.elements.sql_file.value.replace(spaceRegExp, '') !== '') {
    return true;
  }

  if (typeof theForm.elements.id_bookmark !== 'undefined' && (theForm.elements.id_bookmark.value !== null || theForm.elements.id_bookmark.value !== '') && theForm.elements.id_bookmark.selectedIndex !== 0) {
    return true;
  }

  var result = false; // Checks for "DROP/DELETE/ALTER" statements

  if (sqlQuery.replace(spaceRegExp, '') !== '') {
    result = Functions.confirmQuery(theForm, sqlQuery);
  } else {
    alert(window.Messages.strFormEmpty);
  }

  if (window.codeMirrorEditor) {
    window.codeMirrorEditor.focus();
  } else if (codeMirrorInlineEditor) {
    codeMirrorInlineEditor.focus();
  }

  return result;
};
/**
 * Check if a form's element is empty.
 * An element containing only spaces is also considered empty
 *
 * @param {object} theForm      the form
 * @param {string} theFieldName the name of the form field to put the focus on
 *
 * @return {boolean} whether the form field is empty or not
 */


Functions.emptyCheckTheField = function (theForm, theFieldName) {
  var theField = theForm.elements[theFieldName];
  var spaceRegExp = new RegExp('\\s+');
  return theField.value.replace(spaceRegExp, '') === '';
};
/**
 * Ensures a value submitted in a form is numeric and is in a range
 *
 * @param {object} theForm the form
 * @param {string} theFieldName the name of the form field to check
 * @param {any} message
 * @param {number} minimum the minimum authorized value
 * @param {number} maximum the maximum authorized value
 *
 * @return {boolean}  whether a valid number has been submitted or not
 */


Functions.checkFormElementInRange = function (theForm, theFieldName, message, minimum, maximum) {
  var theField = theForm.elements[theFieldName];
  var val = parseInt(theField.value, 10);
  var min = 0;
  var max = Number.MAX_VALUE;

  if (typeof minimum !== 'undefined') {
    min = minimum;
  }

  if (typeof maximum !== 'undefined' && maximum !== null) {
    max = maximum;
  }

  if (isNaN(val)) {
    theField.select();
    alert(window.Messages.strEnterValidNumber);
    theField.focus();
    return false;
  } else if (val < min || val > max) {
    theField.select();
    alert(Functions.sprintf(message, val));
    theField.focus();
    return false;
  } else {
    theField.value = val;
  }

  return true;
};

Functions.checkTableEditForm = function (theForm, fieldsCnt) {
  // TODO: avoid sending a message if user just wants to add a line
  // on the form but has not completed at least one field name
  var atLeastOneField = 0;
  var i;
  var elm;
  var elm2;
  var elm3;
  var val;
  var id;

  for (i = 0; i < fieldsCnt; i++) {
    id = '#field_' + i + '_2';
    elm = jquery__WEBPACK_IMPORTED_MODULE_0__(id);
    val = elm.val();

    if (val === 'VARCHAR' || val === 'CHAR' || val === 'BIT' || val === 'VARBINARY' || val === 'BINARY') {
      elm2 = jquery__WEBPACK_IMPORTED_MODULE_0__('#field_' + i + '_3');
      val = parseInt(elm2.val(), 10);
      elm3 = jquery__WEBPACK_IMPORTED_MODULE_0__('#field_' + i + '_1');

      if (isNaN(val) && elm3.val() !== '') {
        elm2.select();
        alert(window.Messages.strEnterValidLength);
        elm2.focus();
        return false;
      }
    }

    if (atLeastOneField === 0) {
      id = 'field_' + i + '_1';

      if (!Functions.emptyCheckTheField(theForm, id)) {
        atLeastOneField = 1;
      }
    }
  }

  if (atLeastOneField === 0) {
    var theField = theForm.elements.field_0_1;
    alert(window.Messages.strFormEmpty);
    theField.focus();
    return false;
  } // at least this section is under jQuery


  var $input = jquery__WEBPACK_IMPORTED_MODULE_0__('input.textfield[name=\'table\']');

  if ($input.val() === '') {
    alert(window.Messages.strFormEmpty);
    $input.trigger('focus');
    return false;
  }

  return true;
};
/**
 * True if last click is to check a row.
 * @type {boolean}
 */


let lastClickChecked = false;
/**
 * Zero-based index of last clicked row. Used to handle the shift + click event in the code above.
 * @type {number}
 */

let lastClickedRow = -1;
/**
 * Zero-based index of last shift clicked row.
 * @type {number}
 */

let lastShiftClickedRow = -1;
/** @type {number} */

let idleSecondsCounter = 0;
/** @type {number} */

let incInterval;
/** @type {number} */

let updateTimeout;

Functions.teardownIdleEvent = function () {
  clearTimeout(updateTimeout);
  clearInterval(incInterval);
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('mousemove');
};

Functions.onloadIdleEvent = function () {
  document.onclick = function () {
    idleSecondsCounter = 0;
  };

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mousemove', function () {
    idleSecondsCounter = 0;
  });

  document.onkeypress = function () {
    idleSecondsCounter = 0;
  };

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  function SetIdleTime() {
    idleSecondsCounter++;
  }

  function UpdateIdleTime() {
    var href = 'index.php?route=/';
    var guid = 'default';

    if (window.Config.isStorageSupported('sessionStorage')) {
      guid = window.sessionStorage.guid;
    }

    var params = {
      'ajax_request': true,
      'server': window.CommonParams.get('server'),
      'db': window.CommonParams.get('db'),
      'guid': guid,
      'access_time': idleSecondsCounter,
      'check_timeout': 1
    };
    jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
      type: 'POST',
      url: href,
      data: params,
      success: function (data) {
        if (data.success) {
          if (window.CommonParams.get('LoginCookieValidity') - idleSecondsCounter < 0) {
            /* There is other active window, let's reset counter */
            idleSecondsCounter = 0;
          }

          var remaining = Math.min(
          /* Remaining login validity */
          window.CommonParams.get('LoginCookieValidity') - idleSecondsCounter,
          /* Remaining time till session GC */
          window.CommonParams.get('session_gc_maxlifetime'));
          var interval = 1000;

          if (remaining > 5) {
            // max value for setInterval() function
            interval = Math.min((remaining - 1) * 1000, Math.pow(2, 31) - 1);
          }

          updateTimeout = window.setTimeout(UpdateIdleTime, interval);
        } else {
          // timeout occurred
          clearInterval(incInterval);

          if (window.Config.isStorageSupported('sessionStorage')) {
            window.sessionStorage.clear();
          } // append the login form on the page, disable all the forms which were not disabled already, close all the open jqueryui modal boxes


          if (!jquery__WEBPACK_IMPORTED_MODULE_0__('#modalOverlay').length) {
            jquery__WEBPACK_IMPORTED_MODULE_0__('fieldset').not(':disabled').attr('disabled', 'disabled').addClass('disabled_for_expiration');
            jquery__WEBPACK_IMPORTED_MODULE_0__('body').append(data.error);
            jquery__WEBPACK_IMPORTED_MODULE_0__('.ui-dialog').each(function () {
              jquery__WEBPACK_IMPORTED_MODULE_0__('#' + jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('aria-describedby')).dialog('close');
            });
            jquery__WEBPACK_IMPORTED_MODULE_0__('#input_username').trigger('focus');
          } else {
            window.CommonParams.set('token', data.new_token);
            jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=token]').val(data.new_token);
          }

          idleSecondsCounter = 0;
          Functions.handleRedirectAndReload(data);
        }
      }
    });
  }

  if (window.CommonParams.get('logged_in')) {
    incInterval = window.setInterval(SetIdleTime, 1000);
    var sessionTimeout = Math.min(window.CommonParams.get('LoginCookieValidity'), window.CommonParams.get('session_gc_maxlifetime'));

    if (window.Config.isStorageSupported('sessionStorage')) {
      window.sessionStorage.setItem('guid', guid());
    }

    var interval = (sessionTimeout - 5) * 1000;

    if (interval > Math.pow(2, 31) - 1) {
      // max value for setInterval() function
      interval = Math.pow(2, 31) - 1;
    }

    updateTimeout = window.setTimeout(UpdateIdleTime, interval);
  }
};
/**
 * @return {function}
 */


Functions.getCheckAllCheckboxEventHandler = function () {
  return function (e) {
    var $this = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var $tr = $this.closest('tr');
    var $table = $this.closest('table');

    if (!e.shiftKey || lastClickedRow === -1) {
      // usual click
      var $checkbox = $tr.find(':checkbox.checkall');
      var checked = $this.prop('checked');
      $checkbox.prop('checked', checked).trigger('change');

      if (checked) {
        $tr.addClass('marked table-active');
      } else {
        $tr.removeClass('marked table-active');
      }

      lastClickChecked = checked; // remember the last clicked row

      lastClickedRow = lastClickChecked ? $table.find('tbody tr:not(.noclick)').index($tr) : -1;
      lastShiftClickedRow = -1;
    } else {
      // handle the shift click
      Functions.clearSelection();
      var start;
      var end; // clear last shift click result

      if (lastShiftClickedRow >= 0) {
        if (lastShiftClickedRow >= lastClickedRow) {
          start = lastClickedRow;
          end = lastShiftClickedRow;
        } else {
          start = lastShiftClickedRow;
          end = lastClickedRow;
        }

        $tr.parent().find('tr:not(.noclick)').slice(start, end + 1).removeClass('marked table-active').find(':checkbox').prop('checked', false).trigger('change');
      } // handle new shift click


      var currRow = $table.find('tbody tr:not(.noclick)').index($tr);

      if (currRow >= lastClickedRow) {
        start = lastClickedRow;
        end = currRow;
      } else {
        start = currRow;
        end = lastClickedRow;
      }

      $tr.parent().find('tr:not(.noclick)').slice(start, end + 1).addClass('marked table-active').find(':checkbox').prop('checked', true).trigger('change'); // remember the last shift clicked row

      lastShiftClickedRow = currRow;
    }
  };
};
/**
 * Checks/unchecks all options of a <select> element
 *
 * @param {string} theForm   the form name
 * @param {string} theSelect the element name
 * @param {boolean} doCheck  whether to check or to uncheck options
 *
 * @return {boolean} always true
 */


Functions.setSelectOptions = function (theForm, theSelect, doCheck) {
  jquery__WEBPACK_IMPORTED_MODULE_0__('form[name=\'' + theForm + '\'] select[name=\'' + theSelect + '\']').find('option').prop('selected', doCheck);
  return true;
};
/**
 * Updates the input fields for the parameters based on the query
 */


Functions.updateQueryParameters = function () {
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#parameterized').is(':checked')) {
    var query = window.codeMirrorEditor ? window.codeMirrorEditor.getValue() : jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlquery').val();
    var allParameters = query.match(/:[a-zA-Z0-9_]+/g);
    var parameters = []; // get unique parameters

    if (allParameters) {
      jquery__WEBPACK_IMPORTED_MODULE_0__.each(allParameters, function (i, parameter) {
        if (jquery__WEBPACK_IMPORTED_MODULE_0__.inArray(parameter, parameters) === -1) {
          parameters.push(parameter);
        }
      });
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#parametersDiv').text(window.Messages.strNoParam);
      return;
    }

    var $temp = jquery__WEBPACK_IMPORTED_MODULE_0__('<div></div>');
    $temp.append(jquery__WEBPACK_IMPORTED_MODULE_0__('#parametersDiv').children());
    jquery__WEBPACK_IMPORTED_MODULE_0__('#parametersDiv').empty();
    jquery__WEBPACK_IMPORTED_MODULE_0__.each(parameters, function (i, parameter) {
      var paramName = parameter.substring(1);
      var $param = $temp.find('#paramSpan_' + paramName);

      if (!$param.length) {
        $param = jquery__WEBPACK_IMPORTED_MODULE_0__('<span class="parameter" id="paramSpan_' + paramName + '"></span>');
        jquery__WEBPACK_IMPORTED_MODULE_0__('<label for="param_' + paramName + '"></label>').text(parameter).appendTo($param);
        jquery__WEBPACK_IMPORTED_MODULE_0__('<input type="text" name="parameters[' + parameter + ']" id="param_' + paramName + '">').appendTo($param);
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__('#parametersDiv').append($param);
    });
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#parametersDiv').empty();
  }
};
/**
 * Get checkbox for foreign key checks
 *
 * @return {string}
 */


Functions.getForeignKeyCheckboxLoader = function () {
  var html = '';
  html += '<div>';
  html += '<div class="load-default-fk-check-value">';
  html += Functions.getImage('ajax_clock_small');
  html += '</div>';
  html += '</div>';
  return html;
};

Functions.loadForeignKeyCheckbox = function () {
  // Load default foreign key check value
  var params = {
    'ajax_request': true,
    'server': window.CommonParams.get('server')
  };
  jquery__WEBPACK_IMPORTED_MODULE_0__.get('index.php?route=/sql/get-default-fk-check-value', params, function (data) {
    var html = '<input type="hidden" name="fk_checks" value="0">' + '<input type="checkbox" name="fk_checks" id="fk_checks"' + (data.default_fk_check_value ? ' checked="checked"' : '') + '>' + '<label for="fk_checks">' + window.Messages.strForeignKeyCheck + '</label>';
    jquery__WEBPACK_IMPORTED_MODULE_0__('.load-default-fk-check-value').replaceWith(html);
  });
};

Functions.getJsConfirmCommonParam = function (elem, parameters) {
  var $elem = jquery__WEBPACK_IMPORTED_MODULE_0__(elem);
  var params = parameters;
  var sep = window.CommonParams.get('arg_separator');

  if (params) {
    // Strip possible leading ?
    if (params.startsWith('?')) {
      params = params.substring(1);
    }

    params += sep;
  } else {
    params = '';
  }

  params += 'is_js_confirmed=1' + sep + 'ajax_request=true' + sep + 'fk_checks=' + ($elem.find('#fk_checks').is(':checked') ? 1 : 0);
  return params;
};

Functions.teardownSqlQueryEditEvents = () => {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'a.inline_edit_sql');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'input#sql_query_edit_save');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'input#sql_query_edit_discard');

  if (window.codeMirrorEditor) {
    window.codeMirrorEditor.off('blur');
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('blur', '#sqlquery');
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', '#parameterized');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlquery').off('keydown');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#sql_query_edit').off('keydown');

  if (codeMirrorInlineEditor) {
    // Copy the sql query to the text area to preserve it.
    jquery__WEBPACK_IMPORTED_MODULE_0__('#sql_query_edit').text(codeMirrorInlineEditor.getValue());
    jquery__WEBPACK_IMPORTED_MODULE_0__(codeMirrorInlineEditor.getWrapperElement()).off('keydown');
    codeMirrorInlineEditor.toTextArea();
    codeMirrorInlineEditor = false;
  }

  if (window.codeMirrorEditor) {
    jquery__WEBPACK_IMPORTED_MODULE_0__(window.codeMirrorEditor.getWrapperElement()).off('keydown');
  }
};

Functions.onloadSqlQueryEditEvents = function () {
  // If we are coming back to the page by clicking forward button
  // of the browser, bind the code mirror to inline query editor.
  Functions.bindCodeMirrorToInlineEditor();
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.inline_edit_sql', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#sql_query_edit').length) {
      // An inline query editor is already open,
      // we don't want another copy of it
      return false;
    }

    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this).prev('form');
    var sqlQuery = $form.find('input[name=\'sql_query\']').val().trim();
    var $innerSql = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().prev().find('code.sql');
    var newContent = '<textarea name="sql_query_edit" id="sql_query_edit">' + Functions.escapeHtml(sqlQuery) + '</textarea>\n';
    newContent += Functions.getForeignKeyCheckboxLoader();
    newContent += '<input type="submit" id="sql_query_edit_save" class="btn btn-secondary button btnSave" value="' + window.Messages.strGo + '">\n';
    newContent += '<input type="button" id="sql_query_edit_discard" class="btn btn-secondary button btnDiscard" value="' + window.Messages.strCancel + '">\n';
    var $editorArea = jquery__WEBPACK_IMPORTED_MODULE_0__('div#inline_editor');

    if ($editorArea.length === 0) {
      $editorArea = jquery__WEBPACK_IMPORTED_MODULE_0__('<div id="inline_editor_outer"></div>');
      $editorArea.insertBefore($innerSql);
    }

    $editorArea.html(newContent);
    Functions.loadForeignKeyCheckbox();
    $innerSql.hide();
    Functions.bindCodeMirrorToInlineEditor();
    return false;
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'input#sql_query_edit_save', function () {
    // hide already existing success message
    var sqlQuery;

    if (codeMirrorInlineEditor) {
      codeMirrorInlineEditor.save();
      sqlQuery = codeMirrorInlineEditor.getValue();
    } else {
      sqlQuery = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().find('#sql_query_edit').val();
    }

    var fkCheck = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().find('#fk_checks').is(':checked');
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__('a.inline_edit_sql').prev('form');
    var $fakeForm = jquery__WEBPACK_IMPORTED_MODULE_0__('<form>', {
      action: 'index.php?route=/import',
      method: 'post'
    }).append($form.find('input[name=server], input[name=db], input[name=table], input[name=token]').clone()).append(jquery__WEBPACK_IMPORTED_MODULE_0__('<input>', {
      type: 'hidden',
      name: 'show_query',
      value: 1
    })).append(jquery__WEBPACK_IMPORTED_MODULE_0__('<input>', {
      type: 'hidden',
      name: 'is_js_confirmed',
      value: 0
    })).append(jquery__WEBPACK_IMPORTED_MODULE_0__('<input>', {
      type: 'hidden',
      name: 'sql_query',
      value: sqlQuery
    })).append(jquery__WEBPACK_IMPORTED_MODULE_0__('<input>', {
      type: 'hidden',
      name: 'fk_checks',
      value: fkCheck ? 1 : 0
    }));

    if (!Functions.checkSqlQuery($fakeForm[0])) {
      return false;
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('.alert-success').hide();
    $fakeForm.appendTo(jquery__WEBPACK_IMPORTED_MODULE_0__('body')).trigger('submit');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'input#sql_query_edit_discard', function () {
    var $divEditor = jquery__WEBPACK_IMPORTED_MODULE_0__('div#inline_editor_outer');
    $divEditor.siblings('code.sql').show();
    $divEditor.remove();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '#parameterized', Functions.updateQueryParameters);
  var $inputUsername = jquery__WEBPACK_IMPORTED_MODULE_0__('#input_username');

  if ($inputUsername) {
    if ($inputUsername.val() === '') {
      $inputUsername.trigger('focus');
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#input_password').trigger('focus');
    }
  }
};
/**
 * "inputRead" event handler for CodeMirror SQL query editors for autocompletion
 * @param instance
 */


Functions.codeMirrorAutoCompleteOnInputRead = function (instance) {
  if (!sqlAutoCompleteInProgress && (!instance.options.hintOptions.tables || !sqlAutoComplete)) {
    if (!sqlAutoComplete) {
      // Reset after teardown
      instance.options.hintOptions.tables = false;
      instance.options.hintOptions.defaultTable = '';
      sqlAutoCompleteInProgress = true;
      var params = {
        'ajax_request': true,
        'server': window.CommonParams.get('server'),
        'db': window.CommonParams.get('db'),
        'no_debug': true
      };

      var columnHintRender = function (elem, self, data) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="autocomplete-column-name">').text(data.columnName).appendTo(elem);
        jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="autocomplete-column-hint">').text(data.columnHint).appendTo(elem);
      };

      jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
        type: 'POST',
        url: 'index.php?route=/database/sql/autocomplete',
        data: params,
        success: function (data) {
          if (data.success) {
            var tables = JSON.parse(data.tables);
            sqlAutoCompleteDefaultTable = window.CommonParams.get('table');
            sqlAutoComplete = [];

            for (var table in tables) {
              if (tables.hasOwnProperty(table)) {
                var columns = tables[table];
                table = {
                  text: table,
                  columns: []
                };

                for (var column in columns) {
                  if (columns.hasOwnProperty(column)) {
                    var displayText = columns[column].Type;

                    if (columns[column].Key === 'PRI') {
                      displayText += ' | Primary';
                    } else if (columns[column].Key === 'UNI') {
                      displayText += ' | Unique';
                    }

                    table.columns.push({
                      text: column,
                      displayText: column + ' | ' + displayText,
                      columnName: column,
                      columnHint: displayText,
                      render: columnHintRender
                    });
                  }
                }
              }

              sqlAutoComplete.push(table);
            }

            instance.options.hintOptions.tables = sqlAutoComplete;
            instance.options.hintOptions.defaultTable = sqlAutoCompleteDefaultTable;
          }
        },
        complete: function () {
          sqlAutoCompleteInProgress = false;
        }
      });
    } else {
      instance.options.hintOptions.tables = sqlAutoComplete;
      instance.options.hintOptions.defaultTable = sqlAutoCompleteDefaultTable;
    }
  }

  if (instance.state.completionActive) {
    return;
  }

  var cur = instance.getCursor();
  var token = instance.getTokenAt(cur);
  var string = '';

  if (token.string.match(/^[.`\w@]\w*$/)) {
    string = token.string;
  }

  if (string.length > 0) {
    window.CodeMirror.commands.autocomplete(instance);
  }
};

Functions.removeAutocompleteInfo = () => {
  sqlAutoComplete = false;
  sqlAutoCompleteDefaultTable = '';
};
/**
 * Binds the CodeMirror to the text area used to inline edit a query.
 */


Functions.bindCodeMirrorToInlineEditor = function () {
  var $inlineEditor = jquery__WEBPACK_IMPORTED_MODULE_0__('#sql_query_edit');

  if ($inlineEditor.length > 0) {
    if (typeof window.CodeMirror !== 'undefined') {
      var height = $inlineEditor.css('height');
      codeMirrorInlineEditor = Functions.getSqlEditor($inlineEditor);
      codeMirrorInlineEditor.getWrapperElement().style.height = height;
      codeMirrorInlineEditor.refresh();
      codeMirrorInlineEditor.focus();
      jquery__WEBPACK_IMPORTED_MODULE_0__(codeMirrorInlineEditor.getWrapperElement()).on('keydown', Functions.catchKeypressesFromSqlInlineEdit);
    } else {
      $inlineEditor.trigger('focus').on('keydown', Functions.catchKeypressesFromSqlInlineEdit);
    }
  }
};

Functions.catchKeypressesFromSqlInlineEdit = function (event) {
  // ctrl-enter is 10 in chrome and ie, but 13 in ff
  if ((event.ctrlKey || event.metaKey) && (event.keyCode === 13 || event.keyCode === 10)) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#sql_query_edit_save').trigger('click');
  }
};
/**
 * Adds doc link to single highlighted SQL element
 *
 * @param $elm
 * @param params
 */


Functions.documentationAdd = function ($elm, params) {
  if (typeof mysqlDocTemplate === 'undefined') {
    return;
  }

  var url = Functions.sprintf(decodeURIComponent(mysqlDocTemplate), params[0]);

  if (params.length > 1) {
    // The # needs to be escaped to be part of the destination URL
    url += encodeURIComponent('#') + params[1];
  }

  var content = $elm.text();
  $elm.text('');
  $elm.append('<a target="mysql_doc" class="cm-sql-doc" href="' + url + '">' + content + '</a>');
};
/**
 * Generates doc links for keywords inside highlighted SQL
 *
 * @param idx
 * @param elm
 */


Functions.documentationKeyword = function (idx, elm) {
  var $elm = jquery__WEBPACK_IMPORTED_MODULE_0__(elm);
  /* Skip already processed ones */

  if ($elm.find('a').length > 0) {
    return;
  }

  var keyword = $elm.text().toUpperCase();
  var $next = $elm.next('.cm-keyword');

  if ($next) {
    var nextKeyword = $next.text().toUpperCase();
    var full = keyword + ' ' + nextKeyword;
    var $next2 = $next.next('.cm-keyword');

    if ($next2) {
      var next2Keyword = $next2.text().toUpperCase();
      var full2 = full + ' ' + next2Keyword;

      if (full2 in _modules_doc_links_js__WEBPACK_IMPORTED_MODULE_1__.mysqlDocKeyword) {
        Functions.documentationAdd($elm, _modules_doc_links_js__WEBPACK_IMPORTED_MODULE_1__.mysqlDocKeyword[full2]);
        Functions.documentationAdd($next, _modules_doc_links_js__WEBPACK_IMPORTED_MODULE_1__.mysqlDocKeyword[full2]);
        Functions.documentationAdd($next2, _modules_doc_links_js__WEBPACK_IMPORTED_MODULE_1__.mysqlDocKeyword[full2]);
        return;
      }
    }

    if (full in _modules_doc_links_js__WEBPACK_IMPORTED_MODULE_1__.mysqlDocKeyword) {
      Functions.documentationAdd($elm, _modules_doc_links_js__WEBPACK_IMPORTED_MODULE_1__.mysqlDocKeyword[full]);
      Functions.documentationAdd($next, _modules_doc_links_js__WEBPACK_IMPORTED_MODULE_1__.mysqlDocKeyword[full]);
      return;
    }
  }

  if (keyword in _modules_doc_links_js__WEBPACK_IMPORTED_MODULE_1__.mysqlDocKeyword) {
    Functions.documentationAdd($elm, _modules_doc_links_js__WEBPACK_IMPORTED_MODULE_1__.mysqlDocKeyword[keyword]);
  }
};
/**
 * Generates doc links for builtins inside highlighted SQL
 *
 * @param idx
 * @param elm
 */


Functions.documentationBuiltin = function (idx, elm) {
  var $elm = jquery__WEBPACK_IMPORTED_MODULE_0__(elm);
  var builtin = $elm.text().toUpperCase();

  if (builtin in _modules_doc_links_js__WEBPACK_IMPORTED_MODULE_1__.mysqlDocBuiltin) {
    Functions.documentationAdd($elm, _modules_doc_links_js__WEBPACK_IMPORTED_MODULE_1__.mysqlDocBuiltin[builtin]);
  }
};
/**
 * Higlights SQL using CodeMirror.
 *
 * @param $base
 */


Functions.highlightSql = function ($base) {
  var $elm = $base.find('code.sql');
  $elm.each(function () {
    var $sql = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var $pre = $sql.find('pre');
    /* We only care about visible elements to avoid double processing */

    if ($pre.is(':visible')) {
      var $highlight = jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="sql-highlight cm-s-default"></div>');
      $sql.append($highlight);

      if (typeof window.CodeMirror !== 'undefined') {
        window.CodeMirror.runMode($sql.text(), 'text/x-mysql', $highlight[0]);
        $pre.hide();
        $highlight.find('.cm-keyword').each(Functions.documentationKeyword);
        $highlight.find('.cm-builtin').each(Functions.documentationBuiltin);
      }
    }
  });
};
/**
 * Updates an element containing code.
 *
 * @param {JQuery} $base     base element which contains the raw and the
 *                           highlighted code.
 *
 * @param {string} htmlValue code in HTML format, displayed if code cannot be
 *                           highlighted
 *
 * @param {string} rawValue  raw code, used as a parameter for highlighter
 *
 * @return {boolean}        whether content was updated or not
 */


Functions.updateCode = function ($base, htmlValue, rawValue) {
  var $code = $base.find('code');

  if ($code.length === 0) {
    return false;
  } // Determines the type of the content and appropriate CodeMirror mode.


  var type = '';
  var mode = '';

  if ($code.hasClass('json')) {
    type = 'json';
    mode = 'application/json';
  } else if ($code.hasClass('sql')) {
    type = 'sql';
    mode = 'text/x-mysql';
  } else if ($code.hasClass('xml')) {
    type = 'xml';
    mode = 'application/xml';
  } else {
    return false;
  } // Element used to display unhighlighted code.


  var $notHighlighted = jquery__WEBPACK_IMPORTED_MODULE_0__('<pre>' + htmlValue + '</pre>'); // Tries to highlight code using CodeMirror.

  if (typeof window.CodeMirror !== 'undefined') {
    var $highlighted = jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="' + type + '-highlight cm-s-default"></div>');
    window.CodeMirror.runMode(rawValue, mode, $highlighted[0]);
    $notHighlighted.hide();
    $code.html('').append($notHighlighted, $highlighted[0]);
  } else {
    $code.html('').append($notHighlighted);
  }

  return true;
};
/**
 * Show a message on the top of the page for an Ajax request
 *
 * Sample usage:
 *
 * 1) var $msg = Functions.ajaxShowMessage();
 * This will show a message that reads "Loading...". Such a message will not
 * disappear automatically and cannot be dismissed by the user. To remove this
 * message either the Functions.ajaxRemoveMessage($msg) function must be called or
 * another message must be show with Functions.ajaxShowMessage() function.
 *
 * 2) var $msg = Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
 * This is a special case. The behaviour is same as above,
 * just with a different message
 *
 * 3) var $msg = Functions.ajaxShowMessage('The operation was successful');
 * This will show a message that will disappear automatically and it can also
 * be dismissed by the user.
 *
 * 4) var $msg = Functions.ajaxShowMessage('Some error', false);
 * This will show a message that will not disappear automatically, but it
 * can be dismissed by the user after they have finished reading it.
 *
 * @param {string|null} message string containing the message to be shown.
 *                              optional, defaults to 'Loading...'
 * @param {any} timeout         number of milliseconds for the message to be visible
 *                              optional, defaults to 5000. If set to 'false', the
 *                              notification will never disappear
 * @param {string|null} type    string to dictate the type of message shown.
 *                              optional, defaults to normal notification.
 *                              If set to 'error', the notification will show message
 *                              with red background.
 *                              If set to 'success', the notification will show with
 *                              a green background.
 * @return {JQuery<Element>}   jQuery Element that holds the message div
 *                              this object can be passed to Functions.ajaxRemoveMessage()
 *                              to remove the notification
 */


Functions.ajaxShowMessage = function () {
  let message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  let timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var msg = message;
  var newTimeOut = timeout;
  /**
   * @var self_closing Whether the notification will automatically disappear
   */

  var selfClosing = true;
  /**
   * @var dismissable Whether the user will be able to remove
   *                  the notification by clicking on it
   */

  var dismissable = true; // Handle the case when a empty data.message is passed.
  // We don't want the empty message

  if (msg === '') {
    return true;
  } else if (!msg) {
    // If the message is undefined, show the default
    msg = window.Messages.strLoading;
    dismissable = false;
    selfClosing = false;
  } else if (msg === window.Messages.strProcessingRequest) {
    // This is another case where the message should not disappear
    dismissable = false;
    selfClosing = false;
  } // Figure out whether (or after how long) to remove the notification


  if (newTimeOut === undefined || newTimeOut === null) {
    newTimeOut = 5000;
  } else if (newTimeOut === false) {
    selfClosing = false;
  } // Determine type of message, add styling as required


  if (type === 'error') {
    msg = '<div class="alert alert-danger" role="alert">' + msg + '</div>';
  } else if (type === 'success') {
    msg = '<div class="alert alert-success" role="alert">' + msg + '</div>';
  } // Create a parent element for the AJAX messages, if necessary


  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#loading_parent').length === 0) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('<div id="loading_parent"></div>').prependTo('#page_content');
  } // Update message count to create distinct message elements every time


  ajaxMessageCount++; // Remove all old messages, if any

  jquery__WEBPACK_IMPORTED_MODULE_0__('span.ajax_notification[id^=ajax_message_num]').remove();
  /**
   * @var $retval    a jQuery object containing the reference
   *                 to the created AJAX message
   */

  var $retval = jquery__WEBPACK_IMPORTED_MODULE_0__('<span class="ajax_notification" id="ajax_message_num_' + ajaxMessageCount + '"></span>').hide().appendTo('#loading_parent').html(msg).show(); // If the notification is self-closing we should create a callback to remove it

  if (selfClosing) {
    $retval.delay(newTimeOut).fadeOut('medium', function () {
      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).is(':data(tooltip)')) {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).uiTooltip('destroy');
      } // Remove the notification


      jquery__WEBPACK_IMPORTED_MODULE_0__(this).remove();
    });
  } // If the notification is dismissable we need to add the relevant class to it
  // and add a tooltip so that the users know that it can be removed


  if (dismissable) {
    $retval.addClass('dismissable').css('cursor', 'pointer');
    /**
     * Add a tooltip to the notification to let the user know that they
     * can dismiss the ajax notification by clicking on it.
     */

    Functions.tooltip($retval, 'span', window.Messages.strDismiss);
  } // Hide spinner if this is not a loading message


  if (msg !== window.Messages.strLoading) {
    $retval.css('background-image', 'none');
  }

  Functions.highlightSql($retval);
  return $retval;
};
/**
 * Removes the message shown for an Ajax operation when it's completed
 *
 * @param {JQuery} $thisMessageBox Element that holds the notification
 *
 * @return {void}
 */


Functions.ajaxRemoveMessage = function ($thisMessageBox) {
  if ($thisMessageBox !== undefined && $thisMessageBox instanceof jquery__WEBPACK_IMPORTED_MODULE_0__) {
    $thisMessageBox.stop(true, true).fadeOut('medium');

    if ($thisMessageBox.is(':data(tooltip)')) {
      $thisMessageBox.uiTooltip('destroy');
    } else {
      $thisMessageBox.remove();
    }
  }
};
/**
 * Requests SQL for previewing before executing.
 *
 * @param {JQuery<HTMLElement>} $form Form containing query data
 *
 * @return {void}
 */


Functions.previewSql = function ($form) {
  var formUrl = $form.attr('action');
  var sep = window.CommonParams.get('arg_separator');
  var formData = $form.serialize() + sep + 'do_save_data=1' + sep + 'preview_sql=1' + sep + 'ajax_request=1';
  var $messageBox = Functions.ajaxShowMessage();
  jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
    type: 'POST',
    url: formUrl,
    data: formData,
    success: function (response) {
      Functions.ajaxRemoveMessage($messageBox);

      if (response.success) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSqlModal').modal('show');
        jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSqlModal').find('.modal-body').first().html(response.sql_data);
        jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSqlModalLabel').first().html(window.Messages.strPreviewSQL);
        jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSqlModal').on('shown.bs.modal', function () {
          Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSqlModal'));
        });
      } else {
        Functions.ajaxShowMessage(response.message);
      }
    },
    error: function () {
      Functions.ajaxShowMessage(window.Messages.strErrorProcessingRequest);
    }
  });
};
/**
 * Callback called when submit/"OK" is clicked on sql preview/confirm modal
 *
 * @callback onSubmitCallback
 * @param {string} url The url
 */

/**
 *
 * @param {string}           sqlData  Sql query to preview
 * @param {string}           url      Url to be sent to callback
 * @param {onSubmitCallback} callback On submit callback function
 *
 * @return {void}
 */


Functions.confirmPreviewSql = function (sqlData, url, callback) {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSqlConfirmModal').modal('show');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSqlConfirmModalLabel').first().html(window.Messages.strPreviewSQL);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSqlConfirmCode').first().text(sqlData);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSqlConfirmModal').on('shown.bs.modal', function () {
    Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSqlConfirmModal'));
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSQLConfirmOkButton').on('click', function () {
    callback(url);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#previewSqlConfirmModal').modal('hide');
  });
};
/**
 * check for reserved keyword column name
 *
 * @param {JQuery} $form Form
 *
 * @return {boolean}
 */


Functions.checkReservedWordColumns = function ($form) {
  var isConfirmed = true;
  jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
    type: 'POST',
    url: 'index.php?route=/table/structure/reserved-word-check',
    data: $form.serialize(),
    success: function (data) {
      if (typeof data.success !== 'undefined' && data.success === true) {
        isConfirmed = confirm(data.message);
      }
    },
    async: false
  });
  return isConfirmed;
};
/**
 * @return {function}
 */


Functions.dismissNotifications = () => function () {
  /**
   * Allows the user to dismiss a notification
   * created with Functions.ajaxShowMessage()
   */
  var holdStarter = null;
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mousedown', 'span.ajax_notification.dismissable', function () {
    holdStarter = setTimeout(function () {
      holdStarter = null;
    }, 250);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mouseup', 'span.ajax_notification.dismissable', function (event) {
    if (holdStarter && event.which === 1) {
      clearTimeout(holdStarter);
      Functions.ajaxRemoveMessage(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
    }
  });
  /**
   * The below two functions hide the "Dismiss notification" tooltip when a user
   * is hovering a link or button that is inside an ajax message
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mouseover', 'span.ajax_notification a, span.ajax_notification button, span.ajax_notification input', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).parents('span.ajax_notification').is(':data(tooltip)')) {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).parents('span.ajax_notification').uiTooltip('disable');
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mouseout', 'span.ajax_notification a, span.ajax_notification button, span.ajax_notification input', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).parents('span.ajax_notification').is(':data(tooltip)')) {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).parents('span.ajax_notification').uiTooltip('enable');
    }
  });
  /**
   * Copy text to clipboard
   *
   * @param {string | number | string[]} text to copy to clipboard
   *
   * @return {boolean}
   */

  Functions.copyToClipboard = function (text) {
    var $temp = jquery__WEBPACK_IMPORTED_MODULE_0__('<input>');
    $temp.css({
      'position': 'fixed',
      'width': '2em',
      'border': 0,
      'top': 0,
      'left': 0,
      'padding': 0,
      'background': 'transparent'
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('body').append($temp);
    $temp.val(text).trigger('select');

    try {
      var res = document.execCommand('copy');
      $temp.remove();
      return res;
    } catch (e) {
      $temp.remove();
      return false;
    }
  };

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.copyQueryBtn', function (event) {
    event.preventDefault();
    var res = Functions.copyToClipboard(jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('data-text'));

    if (res) {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).after('<span id=\'copyStatus\'> (' + window.Messages.strCopyQueryButtonSuccess + ')</span>');
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).after('<span id=\'copyStatus\'> (' + window.Messages.strCopyQueryButtonFailure + ')</span>');
    }

    setTimeout(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#copyStatus').remove();
    }, 2000);
  });
};
/**
 * Hides/shows the "Open in ENUM/SET editor" message, depending on the data type of the column currently selected
 *
 * @param selectElement
 */


Functions.showNoticeForEnum = function (selectElement) {
  var enumNoticeId = selectElement.attr('id').split('_')[1];
  enumNoticeId += '_' + (parseInt(selectElement.attr('id').split('_')[2], 10) + 1);
  var selectedType = selectElement.val();

  if (selectedType === 'ENUM' || selectedType === 'SET') {
    jquery__WEBPACK_IMPORTED_MODULE_0__('p#enum_notice_' + enumNoticeId).show();
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('p#enum_notice_' + enumNoticeId).hide();
  }
};
/**
 * Hides/shows a warning message when LENGTH is used with inappropriate integer type
 */


Functions.showWarningForIntTypes = function () {
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('div#length_not_allowed').length) {
    var lengthRestrictions = jquery__WEBPACK_IMPORTED_MODULE_0__('select.column_type option').map(function () {
      return jquery__WEBPACK_IMPORTED_MODULE_0__(this).filter(':selected').attr('data-length-restricted');
    }).get();
    var restricationFound = lengthRestrictions.some(restriction => Number(restriction) === 1);

    if (restricationFound) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('div#length_not_allowed').show();
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('div#length_not_allowed').hide();
    }
  }
};
/**
 * Creates a Profiling Chart. Used in sql.js
 * and in server/status/monitor.js
 *
 * @param target
 * @param data
 *
 * @return {object}
 */


Functions.createProfilingChart = function (target, data) {
  // create the chart
  var factory = new JQPlotChartFactory();
  var chart = factory.createChart(ChartType.PIE, target); // create the data table and add columns

  var dataTable = new DataTable();
  dataTable.addColumn(ColumnType.STRING, '');
  dataTable.addColumn(ColumnType.NUMBER, '');
  dataTable.setData(data);
  var windowWidth = jquery__WEBPACK_IMPORTED_MODULE_0__(window).width();
  var location = 's';

  if (windowWidth > 768) {
    location = 'se';
  } // draw the chart and return the chart object


  chart.draw(dataTable, {
    seriesDefaults: {
      rendererOptions: {
        showDataLabels: true
      }
    },
    highlighter: {
      tooltipLocation: 'se',
      sizeAdjust: 0,
      tooltipAxes: 'pieref',
      formatString: '%s, %.9Ps'
    },
    legend: {
      show: true,
      location: location,
      rendererOptions: {
        numberColumns: 2
      }
    },
    // from https://web.archive.org/web/20190321233412/http://tango.freedesktop.org/Tango_Icon_Theme_Guidelines
    seriesColors: ['#fce94f', '#fcaf3e', '#e9b96e', '#8ae234', '#729fcf', '#ad7fa8', '#ef2929', '#888a85', '#c4a000', '#ce5c00', '#8f5902', '#4e9a06', '#204a87', '#5c3566', '#a40000', '#babdb6', '#2e3436']
  });
  return chart;
};
/**
 * Formats a profiling duration nicely (in us and ms time).
 * Used in server/status/monitor.js
 *
 * @param {number} number   Number to be formatted, should be in the range of microsecond to second
 * @param {number} accuracy Accuracy, how many numbers right to the comma should be
 * @return {string}        The formatted number
 */


Functions.prettyProfilingNum = function (number, accuracy) {
  var num = number;
  var acc = accuracy;

  if (!acc) {
    acc = 2;
  }

  acc = Math.pow(10, acc);

  if (num * 1000 < 0.1) {
    num = Math.round(acc * (num * 1000 * 1000)) / acc + 'µ';
  } else if (num < 0.1) {
    num = Math.round(acc * (num * 1000)) / acc + 'm';
  } else {
    num = Math.round(acc * num) / acc;
  }

  return num + 's';
};
/**
 * Formats a SQL Query nicely with newlines and indentation. Depends on Codemirror and MySQL Mode!
 *
 * @param {string} string Query to be formatted
 * @return {string}      The formatted query
 */


Functions.sqlPrettyPrint = function (string) {
  if (typeof window.CodeMirror === 'undefined') {
    return string;
  }

  var mode = window.CodeMirror.getMode({}, 'text/x-mysql');
  var stream = new window.CodeMirror.StringStream(string);
  var state = mode.startState();
  var token;
  var tokens = [];
  var output = '';

  var tabs = function (cnt) {
    var ret = '';

    for (var i = 0; i < 4 * cnt; i++) {
      ret += ' ';
    }

    return ret;
  }; // "root-level" statements


  var statements = {
    'select': ['select', 'from', 'on', 'where', 'having', 'limit', 'order by', 'group by'],
    'update': ['update', 'set', 'where'],
    'insert into': ['insert into', 'values']
  }; // don't put spaces before these tokens

  var spaceExceptionsBefore = {
    ';': true,
    ',': true,
    '.': true,
    '(': true
  }; // don't put spaces after these tokens

  var spaceExceptionsAfter = {
    '.': true
  }; // Populate tokens array

  while (!stream.eol()) {
    stream.start = stream.pos;
    token = mode.token(stream, state);

    if (token !== null) {
      tokens.push([token, stream.current().toLowerCase()]);
    }
  }

  var currentStatement = tokens[0][1];

  if (!statements[currentStatement]) {
    return string;
  } // Holds all currently opened code blocks (statement, function or generic)


  var blockStack = []; // If a new code block is found, newBlock contains its type for one iteration and vice versa for endBlock

  var newBlock;
  var endBlock; // How much to indent in the current line

  var indentLevel = 0; // Holds the "root-level" statements

  var statementPart;
  var lastStatementPart = statements[currentStatement][0];
  blockStack.unshift('statement'); // Iterate through every token and format accordingly

  for (var i = 0; i < tokens.length; i++) {
    // New block => push to stack
    if (tokens[i][1] === '(') {
      if (i < tokens.length - 1 && tokens[i + 1][0] === 'statement-verb') {
        blockStack.unshift(newBlock = 'statement');
      } else if (i > 0 && tokens[i - 1][0] === 'builtin') {
        blockStack.unshift(newBlock = 'function');
      } else {
        blockStack.unshift(newBlock = 'generic');
      }
    } else {
      newBlock = null;
    } // Block end => pop from stack


    if (tokens[i][1] === ')') {
      endBlock = blockStack[0];
      blockStack.shift();
    } else {
      endBlock = null;
    } // A subquery is starting


    if (i > 0 && newBlock === 'statement') {
      indentLevel++;
      output += '\n' + tabs(indentLevel) + tokens[i][1] + ' ' + tokens[i + 1][1].toUpperCase() + '\n' + tabs(indentLevel + 1);
      currentStatement = tokens[i + 1][1];
      i++;
      continue;
    } // A subquery is ending


    if (endBlock === 'statement' && indentLevel > 0) {
      output += '\n' + tabs(indentLevel);
      indentLevel--;
    } // One less indentation for statement parts (from, where, order by, etc.) and a newline


    statementPart = statements[currentStatement].indexOf(tokens[i][1]);

    if (statementPart !== -1) {
      if (i > 0) {
        output += '\n';
      }

      output += tabs(indentLevel) + tokens[i][1].toUpperCase();
      output += '\n' + tabs(indentLevel + 1);
      lastStatementPart = tokens[i][1]; // Normal indentation and spaces for everything else
    } else {
      if (!spaceExceptionsBefore[tokens[i][1]] && !(i > 0 && spaceExceptionsAfter[tokens[i - 1][1]]) && output.charAt(output.length - 1) !== ' ') {
        output += ' ';
      }

      if (tokens[i][0] === 'keyword') {
        output += tokens[i][1].toUpperCase();
      } else {
        output += tokens[i][1];
      }
    } // split columns in select and 'update set' clauses, but only inside statements blocks


    if ((lastStatementPart === 'select' || lastStatementPart === 'where' || lastStatementPart === 'set') && tokens[i][1] === ',' && blockStack[0] === 'statement') {
      output += '\n' + tabs(indentLevel + 1);
    } // split conditions in where clauses, but only inside statements blocks


    if (lastStatementPart === 'where' && (tokens[i][1] === 'and' || tokens[i][1] === 'or' || tokens[i][1] === 'xor')) {
      if (blockStack[0] === 'statement') {
        output += '\n' + tabs(indentLevel + 1);
      } // Todo: Also split and or blocks in newlines & indentation++
      // if (blockStack[0] === 'generic')
      //   output += ...

    }
  }

  return output;
};
/**
 * jQuery function that uses jQueryUI's dialogs to confirm with user. Does not
 * return a jQuery object yet and hence cannot be chained
 *
 * @param {string}   question
 * @param {string}   url          URL to be passed to the callbackFn to make
 *                                an Ajax call to
 * @param {Function} callbackFn   callback to execute after user clicks on OK
 * @param {Function} openCallback optional callback to run when dialog is shown
 *
 * @return {bool}
 */


Functions.confirm = function (question, url, callbackFn, openCallback) {
  var confirmState = window.CommonParams.get('confirm');

  if (!confirmState) {
    // user does not want to confirm
    if (typeof callbackFn === 'function') {
      callbackFn.call(this, url);
      return true;
    }
  }

  if (window.Messages.strDoYouReally === '') {
    return true;
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__('#functionConfirmModal').modal('show');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#functionConfirmModal').find('.modal-body').first().html(question);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#functionConfirmOkButton').on('click', function () {
    if (typeof callbackFn === 'function') {
      callbackFn.call(this, url);
    }
  });

  if (typeof openCallback === 'function') {
    openCallback();
  }
};

jquery__WEBPACK_IMPORTED_MODULE_0__.fn.confirm = Functions.confirm;
/**
 * jQuery function to sort a table's body after a new row has been appended to it.
 *
 * @param {string} textSelector string to select the sortKey's text
 *
 * @return {JQuery<HTMLElement>} for chaining purposes
 */

Functions.sortTable = function (textSelector) {
  return this.each(function () {
    /**
     * @var table_body  Object referring to the table's <tbody> element
     */
    var tableBody = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    /**
     * @var rows    Object referring to the collection of rows in {@link tableBody}
     */

    var rows = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('tr').get(); // get the text of the field that we will sort by

    jquery__WEBPACK_IMPORTED_MODULE_0__.each(rows, function (index, row) {
      row.sortKey = jquery__WEBPACK_IMPORTED_MODULE_0__(row).find(textSelector).text().toLowerCase().trim();
    }); // get the sorted order

    rows.sort(function (a, b) {
      if (a.sortKey < b.sortKey) {
        return -1;
      }

      if (a.sortKey > b.sortKey) {
        return 1;
      }

      return 0;
    }); // pull out each row from the table and then append it according to it's order

    jquery__WEBPACK_IMPORTED_MODULE_0__.each(rows, function (index, row) {
      jquery__WEBPACK_IMPORTED_MODULE_0__(tableBody).append(row);
      row.sortKey = null;
    });
  });
};

jquery__WEBPACK_IMPORTED_MODULE_0__.fn.sortTable = Functions.sortTable;
/**
 * @return {void}
 */

Functions.teardownCreateTableEvents = () => {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('submit', 'form.create_table_form.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'form.create_table_form.ajax input[name=submit_num_fields]');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('keyup', 'form.create_table_form.ajax input');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', 'input[name=partition_count],input[name=subpartition_count],select[name=partition_by]');
};
/**
 * Used on /database/operations, /database/structure and /database/tracking
 * @return {void}
 */


Functions.onloadCreateTableEvents = function () {
  /**
   * Attach event handler for submission of create table form (save)
   */
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', 'form.create_table_form.ajax', function (event) {
    event.preventDefault();
    /**
     * @var    the_form    object referring to the create table form
     */

    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    /*
     * First validate the form; if there is a problem, avoid submitting it
     *
     * Functions.checkTableEditForm() needs a pure element and not a jQuery object,
     * this is why we pass $form[0] as a parameter (the jQuery object
     * is actually an array of DOM elements)
     */

    if (Functions.checkTableEditForm($form[0], $form.find('input[name=orig_num_fields]').val())) {
      Functions.prepareForAjaxRequest($form);

      if (Functions.checkReservedWordColumns($form)) {
        Functions.ajaxShowMessage(window.Messages.strProcessingRequest); // User wants to submit the form

        jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), $form.serialize() + window.CommonParams.get('arg_separator') + 'do_save_data=1', function (data) {
          if (typeof data !== 'undefined' && data.success === true) {
            jquery__WEBPACK_IMPORTED_MODULE_0__('#properties_message').removeClass('alert-danger').html('');
            Functions.ajaxShowMessage(data.message); // Only if the create table dialog (distinct panel) exists

            var $createTableDialog = jquery__WEBPACK_IMPORTED_MODULE_0__('#create_table_dialog');

            if ($createTableDialog.length > 0) {
              $createTableDialog.dialog('close').remove();
            }

            jquery__WEBPACK_IMPORTED_MODULE_0__('#tableslistcontainer').before(data.formatted_sql);
            /**
             * @var tables_table    Object referring to the <tbody> element that holds the list of tables
             */

            var tablesTable = jquery__WEBPACK_IMPORTED_MODULE_0__('#tablesForm').find('tbody').not('#tbl_summary_row'); // this is the first table created in this db

            if (tablesTable.length === 0) {
              window.CommonActions.refreshMain(window.CommonParams.get('opendb_url'));
            } else {
              /**
               * @var curr_last_row   Object referring to the last <tr> element in {@link tablesTable}
               */
              var currLastRow = jquery__WEBPACK_IMPORTED_MODULE_0__(tablesTable).find('tr').last();
              /**
               * @var curr_last_row_index_string   String containing the index of {@link currLastRow}
               */

              var currLastRowIndexString = jquery__WEBPACK_IMPORTED_MODULE_0__(currLastRow).find('input:checkbox').attr('id').match(/\d+/)[0];
              /**
               * @var curr_last_row_index Index of {@link currLastRow}
               */

              var currLastRowIndex = parseFloat(currLastRowIndexString);
              /**
               * @var new_last_row_index   Index of the new row to be appended to {@link tablesTable}
               */

              var newLastRowIndex = currLastRowIndex + 1;
              /**
               * @var new_last_row_id String containing the id of the row to be appended to {@link tablesTable}
               */

              var newLastRowId = 'checkbox_tbl_' + newLastRowIndex;
              data.newTableString = data.newTableString.replace(/checkbox_tbl_/, newLastRowId); // append to table

              jquery__WEBPACK_IMPORTED_MODULE_0__(data.newTableString).appendTo(tablesTable); // Sort the table

              jquery__WEBPACK_IMPORTED_MODULE_0__(tablesTable).sortTable('th'); // Adjust summary row

              DatabaseStructure.adjustTotals();
            } // Refresh navigation as a new table has been added


            Navigation.reload(); // Redirect to table structure page on creation of new table

            var argsep = window.CommonParams.get('arg_separator');
            var params12 = 'ajax_request=true' + argsep + 'ajax_page_request=true';
            var tableStructureUrl = 'index.php?route=/table/structure' + argsep + 'server=' + data.params.server + argsep + 'db=' + data.params.db + argsep + 'token=' + data.params.token + argsep + 'goto=' + encodeURIComponent('index.php?route=/database/structure') + argsep + 'table=' + data.params.table + '';
            jquery__WEBPACK_IMPORTED_MODULE_0__.get(tableStructureUrl, params12, window.AJAX.responseHandler);
          } else {
            Functions.ajaxShowMessage('<div class="alert alert-danger" role="alert">' + data.error + '</div>', false);
          }
        }); // end $.post()
      }
    }
  }); // end create table form (save)

  /**
   * Submits the intermediate changes in the table creation form
   * to refresh the UI accordingly
   *
   * @param actionParam
   */

  function submitChangesInCreateTableForm(actionParam) {
    /**
     * @var    the_form    object referring to the create table form
     */
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__('form.create_table_form.ajax');
    var $msgbox = Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
    Functions.prepareForAjaxRequest($form); // User wants to add more fields to the table

    jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), $form.serialize() + '&' + actionParam, function (data) {
      if (typeof data !== 'undefined' && data.success) {
        var $pageContent = jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content');
        $pageContent.html(data.message);
        Functions.highlightSql($pageContent);
        Functions.verifyColumnsProperties();
        Functions.hideShowConnection(jquery__WEBPACK_IMPORTED_MODULE_0__('.create_table_form select[name=tbl_storage_engine]'));
        Functions.ajaxRemoveMessage($msgbox);
      } else {
        Functions.ajaxShowMessage(data.error);
      }
    }); // end $.post()
  }
  /**
   * Attach event handler for create table form (add fields)
   */


  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'form.create_table_form.ajax input[name=submit_num_fields]', function (event) {
    event.preventDefault();
    submitChangesInCreateTableForm('submit_num_fields=1');
  }); // end create table form (add fields)

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('keydown', 'form.create_table_form.ajax input[name=added_fields]', function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.stopImmediatePropagation();
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('form').find('input[name=submit_num_fields]').trigger('click');
    }
  });
  /**
   * Attach event handler to manage changes in number of partitions and subpartitions
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', 'input[name=partition_count],input[name=subpartition_count],select[name=partition_by]', function () {
    var $this = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var $form = $this.parents('form');

    if ($form.is('.create_table_form.ajax')) {
      submitChangesInCreateTableForm('submit_partition_change=1');
    } else {
      $form.trigger('submit');
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', 'input[value=AUTO_INCREMENT]', function () {
    if (this.checked) {
      var col = /\d/.exec(jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('name'));
      col = col[0];
      var $selectFieldKey = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="field_key[' + col + ']"]');

      if ($selectFieldKey.val() === 'none_' + col) {
        $selectFieldKey.val('primary_' + col).trigger('change', [false]);
      }
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('body').off('click', 'input.preview_sql').on('click', 'input.preview_sql', function () {
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('form');
    Functions.previewSql($form);
  });
};
/**
 * Validates the password field in a form
 *
 * @see    window.Messages.strPasswordEmpty
 * @see    window.Messages.strPasswordNotSame
 * @param {object} $theForm The form to be validated
 * @return {boolean}
 */


Functions.checkPassword = function ($theForm) {
  // Did the user select 'no password'?
  if ($theForm.find('#nopass_1').is(':checked')) {
    return true;
  } else {
    var $pred = $theForm.find('#select_pred_password');

    if ($pred.length && ($pred.val() === 'none' || $pred.val() === 'keep')) {
      return true;
    }
  }

  var $password = $theForm.find('input[name=pma_pw]');
  var $passwordRepeat = $theForm.find('input[name=pma_pw2]');
  var alertMessage = false;

  if ($password.val() === '') {
    alertMessage = window.Messages.strPasswordEmpty;
  } else if ($password.val() !== $passwordRepeat.val()) {
    alertMessage = window.Messages.strPasswordNotSame;
  }

  if (alertMessage) {
    alert(alertMessage);
    $password.val('');
    $passwordRepeat.val('');
    $password.trigger('focus');
    return false;
  }

  return true;
};
/**
 * @return {void}
 */


Functions.onloadChangePasswordEvents = function () {
  /* Handler for hostname type */
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '#select_pred_hostname', function () {
    var hostname = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_hostname');

    if (this.value === 'any') {
      hostname.val('%');
    } else if (this.value === 'localhost') {
      hostname.val('localhost');
    } else if (this.value === 'thishost' && jquery__WEBPACK_IMPORTED_MODULE_0__(this).data('thishost')) {
      hostname.val(jquery__WEBPACK_IMPORTED_MODULE_0__(this).data('thishost'));
    } else if (this.value === 'hosttable') {
      hostname.val('').prop('required', false);
    } else if (this.value === 'userdefined') {
      hostname.trigger('focus').select().prop('required', true);
    }
  });
  /* Handler for editing hostname */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '#pma_hostname', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#select_pred_hostname').val('userdefined');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_hostname').prop('required', true);
  });
  /* Handler for username type */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '#select_pred_username', function () {
    if (this.value === 'any') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_username').val('').prop('required', false);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#user_exists_warning').css('display', 'none');
    } else if (this.value === 'userdefined') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_username').trigger('focus').trigger('select').prop('required', true);
    }
  });
  /* Handler for editing username */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '#pma_username', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#select_pred_username').val('userdefined');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_username').prop('required', true);
  });
  /* Handler for password type */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '#select_pred_password', function () {
    if (this.value === 'none') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#text_pma_pw2').prop('required', false).val('');
      jquery__WEBPACK_IMPORTED_MODULE_0__('#text_pma_pw').prop('required', false).val('');
    } else if (this.value === 'userdefined') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#text_pma_pw2').prop('required', true);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#text_pma_pw').prop('required', true).trigger('focus').trigger('select');
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#text_pma_pw2').prop('required', false);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#text_pma_pw').prop('required', false);
    }
  });
  /* Handler for editing password */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '#text_pma_pw,#text_pma_pw2', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#select_pred_password').val('userdefined');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#text_pma_pw2').prop('required', true);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#text_pma_pw').prop('required', true);
  });
  /**
   * Unbind all event handlers before tearing down a page
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#change_password_anchor.ajax');
  /**
   * Attach Ajax event handler on the change password anchor
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#change_password_anchor.ajax', function (event) {
    event.preventDefault();
    var $msgbox = Functions.ajaxShowMessage();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#changePasswordGoButton').on('click', function () {
      event.preventDefault();
      /**
       * @var $the_form    Object referring to the change password form
       */

      var $theForm = jquery__WEBPACK_IMPORTED_MODULE_0__('#change_password_form');

      if (!Functions.checkPassword($theForm)) {
        return false;
      }
      /**
       * @var {string} thisValue String containing the value of the submit button.
       * Need to append this for the change password form on Server Privileges
       * page to work
       */


      var thisValue = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();
      var $msgbox = Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
      $theForm.append('<input type="hidden" name="ajax_request" value="true">');
      jquery__WEBPACK_IMPORTED_MODULE_0__.post($theForm.attr('action'), $theForm.serialize() + window.CommonParams.get('arg_separator') + 'change_pw=' + thisValue, function (data) {
        if (typeof data === 'undefined' || data.success !== true) {
          Functions.ajaxShowMessage(data.error, false);
          return;
        }

        var $pageContent = jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content');
        $pageContent.prepend(data.message);
        Functions.highlightSql($pageContent);
        jquery__WEBPACK_IMPORTED_MODULE_0__('#change_password_dialog').hide().remove();
        jquery__WEBPACK_IMPORTED_MODULE_0__('#edit_user_dialog').dialog('close').remove();
        Functions.ajaxRemoveMessage($msgbox);
      }); // end $.post()

      jquery__WEBPACK_IMPORTED_MODULE_0__('#changePasswordModal').modal('hide');
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__.get(jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href'), {
      'ajax_request': true
    }, function (data) {
      if (typeof data === 'undefined' || !data.success) {
        Functions.ajaxShowMessage(data.error, false);
        return;
      }

      if (data.scripts) {
        window.AJAX.scriptHandler.load(data.scripts);
      } // for this dialog, we remove the fieldset wrapping due to double headings


      jquery__WEBPACK_IMPORTED_MODULE_0__('#changePasswordModal').modal('show');
      jquery__WEBPACK_IMPORTED_MODULE_0__('#changePasswordModal').find('.modal-body').first().html(data.message);
      jquery__WEBPACK_IMPORTED_MODULE_0__('fieldset#fieldset_change_password').find('legend').remove().end().find('table.table').unwrap().addClass('m-3').find('input#text_pma_pw').trigger('focus');
      jquery__WEBPACK_IMPORTED_MODULE_0__('#fieldset_change_password_footer').hide();
      Functions.ajaxRemoveMessage($msgbox);
      Functions.displayPasswordGenerateButton();
      jquery__WEBPACK_IMPORTED_MODULE_0__('#change_password_form').on('submit', function (e) {
        e.preventDefault();
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.ui-dialog').find('.ui-dialog-buttonpane .ui-button').first().trigger('click');
      });
    }); // end $.get()
  });
};
/**
 * @return {void}
 */


Functions.teardownEnumSetEditorMessage = () => {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', 'select.column_type');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', 'select.default_type');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', 'select.virtuality');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', 'input.allow_null');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', '.create_table_form select[name=tbl_storage_engine]');
};
/**
 * Toggle the hiding/showing of the "Open in ENUM/SET editor" message when
 * the page loads and when the selected data type changes
 * @return {void}
 */


Functions.onloadEnumSetEditorMessage = function () {
  // is called here for normal page loads and also when opening
  // the Create table dialog
  Functions.verifyColumnsProperties(); //
  // needs on() to work also in the Create Table dialog

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', 'select.column_type', function () {
    Functions.showNoticeForEnum(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
    Functions.showWarningForIntTypes();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', 'select.default_type', function () {
    Functions.hideShowDefaultValue(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', 'select.virtuality', function () {
    Functions.hideShowExpression(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', 'input.allow_null', function () {
    Functions.validateDefaultValue(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '.create_table_form select[name=tbl_storage_engine]', function () {
    Functions.hideShowConnection(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  });
};
/**
 * If the chosen storage engine is FEDERATED show connection field. Hide otherwise
 *
 * @param $engineSelector storage engine selector
 */


Functions.hideShowConnection = function ($engineSelector) {
  var $connection = jquery__WEBPACK_IMPORTED_MODULE_0__('.create_table_form input[name=connection]');
  var $labelTh = jquery__WEBPACK_IMPORTED_MODULE_0__('.create_table_form #storage-engine-connection');

  if ($engineSelector.val() !== 'FEDERATED') {
    $connection.prop('disabled', true).parent('td').hide();
    $labelTh.hide();
  } else {
    $connection.prop('disabled', false).parent('td').show();
    $labelTh.show();
  }
};
/**
 * If the column does not allow NULL values, makes sure that default is not NULL
 *
 * @param $nullCheckbox
 */


Functions.validateDefaultValue = function ($nullCheckbox) {
  if (!$nullCheckbox.prop('checked')) {
    var $default = $nullCheckbox.closest('tr').find('.default_type');

    if ($default.val() === 'NULL') {
      $default.val('NONE');
    }
  }
};
/**
 * function to populate the input fields on picking a column from central list
 *
 * @param {string} inputId input id of the name field for the column to be populated
 * @param {number} offset of the selected column in central list of columns
 */


Functions.autoPopulate = function (inputId, offset) {
  var db = window.CommonParams.get('db');
  var table = window.CommonParams.get('table');
  var newInputId = inputId.substring(0, inputId.length - 1);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#' + newInputId + '1').val(window.centralColumnList[db + '_' + table][offset].col_name);
  var colType = window.centralColumnList[db + '_' + table][offset].col_type.toUpperCase();
  jquery__WEBPACK_IMPORTED_MODULE_0__('#' + newInputId + '2').val(colType);
  var $input3 = jquery__WEBPACK_IMPORTED_MODULE_0__('#' + newInputId + '3');
  $input3.val(window.centralColumnList[db + '_' + table][offset].col_length);

  if (colType === 'ENUM' || colType === 'SET') {
    $input3.next().show();
  } else {
    $input3.next().hide();
  }

  var colDefault = window.centralColumnList[db + '_' + table][offset].col_default.toUpperCase();
  var $input4 = jquery__WEBPACK_IMPORTED_MODULE_0__('#' + newInputId + '4');

  if (colDefault !== '' && colDefault !== 'NULL' && colDefault !== 'CURRENT_TIMESTAMP' && colDefault !== 'CURRENT_TIMESTAMP()') {
    $input4.val('USER_DEFINED');
    $input4.next().next().show();
    $input4.next().next().val(window.centralColumnList[db + '_' + table][offset].col_default);
  } else {
    $input4.val(window.centralColumnList[db + '_' + table][offset].col_default);
    $input4.next().next().hide();
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__('#' + newInputId + '5').val(window.centralColumnList[db + '_' + table][offset].col_collation);
  var $input6 = jquery__WEBPACK_IMPORTED_MODULE_0__('#' + newInputId + '6');
  $input6.val(window.centralColumnList[db + '_' + table][offset].col_attribute);

  if (window.centralColumnList[db + '_' + table][offset].col_extra === 'on update CURRENT_TIMESTAMP') {
    $input6.val(window.centralColumnList[db + '_' + table][offset].col_extra);
  }

  if (window.centralColumnList[db + '_' + table][offset].col_extra.toUpperCase() === 'AUTO_INCREMENT') {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#' + newInputId + '9').prop('checked', true).trigger('change');
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#' + newInputId + '9').prop('checked', false);
  }

  if (window.centralColumnList[db + '_' + table][offset].col_isNull !== '0') {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#' + newInputId + '7').prop('checked', true);
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#' + newInputId + '7').prop('checked', false);
  }
};
/**
 * @return {void}
 */


Functions.teardownEnumSetEditor = () => {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'a.open_enum_editor');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'input.add_value');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#enum_editor td.drop');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'a.central_columns_dialog');
};
/**
 * Opens the ENUM/SET editor and controls its functions
 * @return {void}
 */


Functions.onloadEnumSetEditor = function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.open_enum_editor', function () {
    // Get the name of the column that is being edited
    var colname = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('tr').find('input').first().val();
    var title;
    var i; // And use it to make up a title for the page

    if (colname.length < 1) {
      title = window.Messages.enum_newColumnVals;
    } else {
      title = window.Messages.enum_columnVals.replace(/%s/, '"' + Functions.escapeHtml(decodeURIComponent(colname)) + '"');
    } // Get the values as a string


    var inputstring = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('td').find('input').val(); // Escape html entities

    inputstring = jquery__WEBPACK_IMPORTED_MODULE_0__('<div></div>').text(inputstring).html(); // Parse the values, escaping quotes and
    // slashes on the fly, into an array

    var values = [];
    var inString = false;
    var curr;
    var next;
    var buffer = '';

    for (i = 0; i < inputstring.length; i++) {
      curr = inputstring.charAt(i);
      next = i === inputstring.length ? '' : inputstring.charAt(i + 1);

      if (!inString && curr === '\'') {
        inString = true;
      } else if (inString && curr === '\\' && next === '\\') {
        buffer += '&#92;';
        i++;
      } else if (inString && next === '\'' && (curr === '\'' || curr === '\\')) {
        buffer += '&#39;';
        i++;
      } else if (inString && curr === '\'') {
        inString = false;
        values.push(buffer);
        buffer = '';
      } else if (inString) {
        buffer += curr;
      }
    }

    if (buffer.length > 0) {
      // The leftovers in the buffer are the last value (if any)
      values.push(buffer);
    }

    var fields = ''; // If there are no values, maybe the user is about to make a
    // new list so we add a few for them to get started with.

    if (values.length === 0) {
      values.push('', '', '', '');
    } // Add the parsed values to the editor


    var dropIcon = Functions.getImage('b_drop');

    for (i = 0; i < values.length; i++) {
      fields += '<tr><td>' + '<input type=\'text\' value=\'' + values[i] + '\'>' + '</td><td class=\'drop\'>' + dropIcon + '</td></tr>';
    }
    /**
     * @var dialog HTML code for the ENUM/SET dialog
     */


    var dialog = '<div id=\'enum_editor\'>' + '<fieldset class="pma-fieldset">' + '<legend>' + title + '</legend>' + '<p>' + Functions.getImage('s_notice') + window.Messages.enum_hint + '</p>' + '<table class="table table-borderless values">' + fields + '</table>' + '</fieldset><fieldset class="pma-fieldset tblFooters">' + '<table class="table table-borderless add"><tr><td>' + '<div class=\'slider\'></div>' + '</td><td>' + '<form><div><input type=\'submit\' class=\'add_value btn btn-primary\' value=\'' + Functions.sprintf(window.Messages.enum_addValue, 1) + '\'></div></form>' + '</td></tr></table>' + '<input type=\'hidden\' value=\'' + // So we know which column's data is being edited
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('td').find('input').attr('id') + '\'>' + '</fieldset>' + '</div>';
    jquery__WEBPACK_IMPORTED_MODULE_0__('#enumEditorGoButton').on('click', function () {
      // When the submit button is clicked,
      // put the data back into the original form
      var valueArray = [];
      jquery__WEBPACK_IMPORTED_MODULE_0__('#enumEditorModal').find('.values input').each(function (index, elm) {
        var val = elm.value.replace(/\\/g, '\\\\').replace(/'/g, '\'\'');
        valueArray.push('\'' + val + '\'');
      }); // get the Length/Values text field where this value belongs

      var valuesId = jquery__WEBPACK_IMPORTED_MODULE_0__('#enumEditorModal').find('input[type=\'hidden\']').val();
      jquery__WEBPACK_IMPORTED_MODULE_0__('input#' + valuesId).val(valueArray.join(','));
    }); // Show the dialog

    var width = parseInt(parseInt(jquery__WEBPACK_IMPORTED_MODULE_0__('html').css('font-size'), 10) / 13 * 340, 10);

    if (!width) {
      width = 340;
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('#enumEditorModal').modal('show');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#enumEditorModal').find('.modal-body').first().html(dialog); // slider for choosing how many fields to add

    jquery__WEBPACK_IMPORTED_MODULE_0__('#enumEditorModal').find('.slider').slider({
      animate: true,
      range: 'min',
      value: 1,
      min: 1,
      max: 9,
      slide: function (event, ui) {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('table').find('input[type=submit]').val(Functions.sprintf(window.Messages.enum_addValue, ui.value));
      }
    }); // Focus the slider, otherwise it looks nearly transparent

    jquery__WEBPACK_IMPORTED_MODULE_0__('a.ui-slider-handle').addClass('ui-state-focus');
    return false;
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.central_columns_dialog', function () {
    var href = 'index.php?route=/database/central-columns';
    var db = window.CommonParams.get('db');
    var table = window.CommonParams.get('table');
    var maxRows = jquery__WEBPACK_IMPORTED_MODULE_0__(this).data('maxrows');
    var pick = jquery__WEBPACK_IMPORTED_MODULE_0__(this).data('pick');

    if (pick !== false) {
      pick = true;
    }

    var params = {
      'ajax_request': true,
      'server': window.CommonParams.get('server'),
      'db': window.CommonParams.get('db'),
      'cur_table': window.CommonParams.get('table'),
      'getColumnList': true
    };
    var colid = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('td').find('input').attr('id');
    var fields = '';

    if (!(db + '_' + table in window.centralColumnList)) {
      window.centralColumnList.push(db + '_' + table);
      jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
        type: 'POST',
        url: href,
        data: params,
        success: function (data) {
          window.centralColumnList[db + '_' + table] = data.message;
        },
        async: false
      });
    }

    var i = 0;
    var listSize = window.centralColumnList[db + '_' + table].length;
    var min = listSize <= maxRows ? listSize : maxRows;

    for (i = 0; i < min; i++) {
      fields += '<tr><td><div><span class="fw-bold">' + Functions.escapeHtml(window.centralColumnList[db + '_' + table][i].col_name) + '</span><br><span class="color_gray">' + window.centralColumnList[db + '_' + table][i].col_type;

      if (window.centralColumnList[db + '_' + table][i].col_attribute !== '') {
        fields += '(' + Functions.escapeHtml(window.centralColumnList[db + '_' + table][i].col_attribute) + ') ';
      }

      if (window.centralColumnList[db + '_' + table][i].col_length !== '') {
        fields += '(' + Functions.escapeHtml(window.centralColumnList[db + '_' + table][i].col_length) + ') ';
      }

      fields += Functions.escapeHtml(window.centralColumnList[db + '_' + table][i].col_extra) + '</span>' + '</div></td>';

      if (pick) {
        fields += '<td><input class="btn btn-secondary pick w-100" type="submit" value="' + window.Messages.pickColumn + '" onclick="Functions.autoPopulate(\'' + colid + '\',' + i + ')"></td>';
      }

      fields += '</tr>';
    }

    var resultPointer = i;
    var searchIn = '<input type="text" class="filter_rows" placeholder="' + window.Messages.searchList + '">';

    if (fields === '') {
      fields = Functions.sprintf(window.Messages.strEmptyCentralList, '\'' + Functions.escapeHtml(db) + '\'');
      searchIn = '';
    }

    var seeMore = '';

    if (listSize > maxRows) {
      seeMore = '<fieldset class="pma-fieldset tblFooters text-center fw-bold">' + '<a href=\'#\' id=\'seeMore\'>' + window.Messages.seeMore + '</a></fieldset>';
    }

    var centralColumnsDialog = '<div class=\'max_height_400\'>' + '<fieldset class="pma-fieldset">' + searchIn + '<table id="col_list" class="table table-borderless values">' + fields + '</table>' + '</fieldset>' + seeMore + '</div>';
    var width = parseInt(parseInt(jquery__WEBPACK_IMPORTED_MODULE_0__('html').css('font-size'), 10) / 13 * 500, 10);

    if (!width) {
      width = 500;
    }

    var buttonOptions = {};
    var $centralColumnsDialog = jquery__WEBPACK_IMPORTED_MODULE_0__(centralColumnsDialog).dialog({
      minWidth: width,
      maxHeight: 450,
      modal: true,
      title: window.Messages.pickColumnTitle,
      buttons: buttonOptions,
      open: function () {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#col_list').on('click', '.pick', function () {
          $centralColumnsDialog.remove();
        });
        jquery__WEBPACK_IMPORTED_MODULE_0__('.filter_rows').on('keyup', function () {
          jquery__WEBPACK_IMPORTED_MODULE_0__.uiTableFilter(jquery__WEBPACK_IMPORTED_MODULE_0__('#col_list'), jquery__WEBPACK_IMPORTED_MODULE_0__(this).val());
        });
        jquery__WEBPACK_IMPORTED_MODULE_0__('#seeMore').on('click', function () {
          fields = '';
          min = listSize <= maxRows + resultPointer ? listSize : maxRows + resultPointer;

          for (i = resultPointer; i < min; i++) {
            fields += '<tr><td><div><span class="fw-bold">' + window.centralColumnList[db + '_' + table][i].col_name + '</span><br><span class="color_gray">' + window.centralColumnList[db + '_' + table][i].col_type;

            if (window.centralColumnList[db + '_' + table][i].col_attribute !== '') {
              fields += '(' + window.centralColumnList[db + '_' + table][i].col_attribute + ') ';
            }

            if (window.centralColumnList[db + '_' + table][i].col_length !== '') {
              fields += '(' + window.centralColumnList[db + '_' + table][i].col_length + ') ';
            }

            fields += window.centralColumnList[db + '_' + table][i].col_extra + '</span>' + '</div></td>';

            if (pick) {
              fields += '<td><input class="btn btn-secondary pick w-100" type="submit" value="' + window.Messages.pickColumn + '" onclick="Functions.autoPopulate(\'' + colid + '\',' + i + ')"></td>';
            }

            fields += '</tr>';
          }

          jquery__WEBPACK_IMPORTED_MODULE_0__('#col_list').append(fields);
          resultPointer = i;

          if (resultPointer === listSize) {
            jquery__WEBPACK_IMPORTED_MODULE_0__('#seeMore').hide();
          }

          return false;
        });
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.ui-dialog').find('.ui-dialog-buttonpane button').first().trigger('focus');
      },
      close: function () {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#col_list').off('click', '.pick');
        jquery__WEBPACK_IMPORTED_MODULE_0__('.filter_rows').off('keyup');
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).remove();
      }
    });
    return false;
  }); // When "add a new value" is clicked, append an empty text field

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'input.add_value', function (e) {
    e.preventDefault();
    var numNewRows = jquery__WEBPACK_IMPORTED_MODULE_0__('#enumEditorModal').find('div.slider').slider('value');

    while (numNewRows--) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#enumEditorModal').find('.values').append('<tr class=\'hide\'><td>' + '<input type=\'text\'>' + '</td><td class=\'drop\'>' + Functions.getImage('b_drop') + '</td></tr>').find('tr').last().show('fast');
    }
  }); // Removes the specified row from the enum editor

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#enum_editor td.drop', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('tr').hide('fast', function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).remove();
    });
  });
};
/**
 * Ensures indexes names are valid according to their type and, for a primary
 * key, lock index name to 'PRIMARY'
 * @param {string} formId Variable which parses the form name as
 *                        the input
 * @return {boolean} false if there is no index form, true else
 */


Functions.checkIndexName = function (formId) {
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#' + formId).length === 0) {
    return false;
  } // Gets the elements pointers


  var $theIdxName = jquery__WEBPACK_IMPORTED_MODULE_0__('#input_index_name');
  var $theIdxChoice = jquery__WEBPACK_IMPORTED_MODULE_0__('#select_index_choice'); // Index is a primary key

  if ($theIdxChoice.find('option:selected').val() === 'PRIMARY') {
    $theIdxName.val('PRIMARY');
    $theIdxName.prop('disabled', true);
  } else {
    if ($theIdxName.val() === 'PRIMARY') {
      $theIdxName.val('');
    }

    $theIdxName.prop('disabled', false);
  }

  return true;
};
/**
 * Handler for adding more columns to an index in the editor
 * @return {function}
 */


Functions.getAddIndexEventHandler = function () {
  return function (event) {
    event.preventDefault();
    var hadAddButtonHidden = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('fieldset').find('.add_fields').hasClass('hide');

    if (hadAddButtonHidden === false) {
      var rowsToAdd = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('fieldset').find('.slider').slider('value');

      var tempEmptyVal = function () {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).val('');
      };

      var tempSetFocus = function () {
        if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('option:selected').val() === '') {
          return true;
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('tr').find('input').trigger('focus');
      };

      while (rowsToAdd--) {
        var $indexColumns = jquery__WEBPACK_IMPORTED_MODULE_0__('#index_columns');
        var $newrow = $indexColumns.find('tbody > tr').first().clone().appendTo($indexColumns.find('tbody'));
        $newrow.find(':input').each(tempEmptyVal); // focus index size input on column picked

        $newrow.find('select').on('change', tempSetFocus);
      }
    }
  };
};

Functions.indexDialogModal = function (routeUrl, url, title, callbackSuccess, callbackFailure) {
  /* Remove the hidden dialogs if there are*/
  var modal = jquery__WEBPACK_IMPORTED_MODULE_0__('#indexDialogModal');
  const indexDialogPreviewModal = document.getElementById('indexDialogPreviewModal');
  indexDialogPreviewModal.addEventListener('shown.bs.modal', () => {
    const modalBody = indexDialogPreviewModal.querySelector('.modal-body');
    const $form = jquery__WEBPACK_IMPORTED_MODULE_0__('#index_frm');
    const formUrl = $form.attr('action');
    const sep = window.CommonParams.get('arg_separator');
    const formData = $form.serialize() + sep + 'do_save_data=1' + sep + 'preview_sql=1' + sep + 'ajax_request=1';
    jquery__WEBPACK_IMPORTED_MODULE_0__.post({
      url: formUrl,
      data: formData,
      success: response => {
        if (!response.success) {
          modalBody.innerHTML = '<div class="alert alert-danger" role="alert">' + window.Messages.strErrorProcessingRequest + '</div>';
          return;
        }

        modalBody.innerHTML = response.sql_data;
        Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('#indexDialogPreviewModal'));
      },
      error: () => {
        modalBody.innerHTML = '<div class="alert alert-danger" role="alert">' + window.Messages.strErrorProcessingRequest + '</div>';
      }
    });
  });
  indexDialogPreviewModal.addEventListener('hidden.bs.modal', () => {
    indexDialogPreviewModal.querySelector('.modal-body').innerHTML = '<div class="spinner-border" role="status">' + '<span class="visually-hidden">' + window.Messages.strLoading + '</span></div>';
  });
  /**
   * @var button_options Object that stores the options
   *                     passed to jQueryUI dialog
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('#indexDialogModalGoButton').on('click', function () {
    /**
     * @var the_form object referring to the export form
     */
    var $form = jquery__WEBPACK_IMPORTED_MODULE_0__('#index_frm');
    Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
    Functions.prepareForAjaxRequest($form); // User wants to submit the form

    jquery__WEBPACK_IMPORTED_MODULE_0__.post($form.attr('action'), $form.serialize() + window.CommonParams.get('arg_separator') + 'do_save_data=1', function (data) {
      var $sqlqueryresults = jquery__WEBPACK_IMPORTED_MODULE_0__('.sqlqueryresults');

      if ($sqlqueryresults.length !== 0) {
        $sqlqueryresults.remove();
      }

      if (typeof data !== 'undefined' && data.success === true) {
        Functions.ajaxShowMessage(data.message);
        Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('.result_query'));
        jquery__WEBPACK_IMPORTED_MODULE_0__('.result_query .alert').remove();
        /* Reload the field form*/

        jquery__WEBPACK_IMPORTED_MODULE_0__('#table_index').remove();
        jquery__WEBPACK_IMPORTED_MODULE_0__('<div id=\'temp_div\'><div>').append(data.index_table).find('#table_index').insertAfter('#index_header');
        var $editIndexDialog = jquery__WEBPACK_IMPORTED_MODULE_0__('#indexDialogModal');

        if ($editIndexDialog.length > 0) {
          $editIndexDialog.modal('hide');
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__('div.no_indexes_defined').hide();

        if (callbackSuccess) {
          callbackSuccess(data);
        }

        Navigation.reload();
      } else {
        var $tempDiv = jquery__WEBPACK_IMPORTED_MODULE_0__('<div id=\'temp_div\'><div>').append(data.error);
        var $error;

        if ($tempDiv.find('.error code').length !== 0) {
          $error = $tempDiv.find('.error code').addClass('error');
        } else {
          $error = $tempDiv;
        }

        if (callbackFailure) {
          callbackFailure();
        }

        Functions.ajaxShowMessage($error, false);
      }
    }); // end $.post()
  });
  var $msgbox = Functions.ajaxShowMessage();
  jquery__WEBPACK_IMPORTED_MODULE_0__.post(routeUrl, url, function (data) {
    if (typeof data !== 'undefined' && data.success === false) {
      // in the case of an error, show the error message returned.
      Functions.ajaxShowMessage(data.error, false);
    } else {
      Functions.ajaxRemoveMessage($msgbox); // Show dialog if the request was successful

      modal.modal('show');
      modal.find('.modal-body').first().html(data.message);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#indexDialogModalLabel').first().text(title);
      Functions.verifyColumnsProperties();
      modal.find('.tblFooters').remove();
      Functions.showIndexEditDialog(modal);
    }
  }); // end $.get()
};

Functions.indexEditorDialog = function (url, title, callbackSuccess, callbackFailure) {
  Functions.indexDialogModal('index.php?route=/table/indexes', url, title, callbackSuccess, callbackFailure);
};

Functions.indexRenameDialog = function (url, title, callbackSuccess, callbackFailure) {
  Functions.indexDialogModal('index.php?route=/table/indexes/rename', url, title, callbackSuccess, callbackFailure);
};

Functions.showIndexEditDialog = function ($outer) {
  Indexes.checkIndexType();
  Functions.checkIndexName('index_frm');
  var $indexColumns = jquery__WEBPACK_IMPORTED_MODULE_0__('#index_columns');
  $indexColumns.find('td').each(function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).css('width', jquery__WEBPACK_IMPORTED_MODULE_0__(this).width() + 'px');
  });
  $indexColumns.find('tbody').sortable({
    axis: 'y',
    containment: $indexColumns.find('tbody'),
    tolerance: 'pointer'
  });
  Functions.showHints($outer); // Add a slider for selecting how many columns to add to the index

  $outer.find('.slider').slider({
    animate: true,
    value: 1,
    min: 1,
    max: 16,
    slide: function (event, ui) {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('fieldset').find('input[type=submit]').val(Functions.sprintf(window.Messages.strAddToIndex, ui.value));
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('div.add_fields').removeClass('hide'); // focus index size input on column picked

  $outer.find('table#index_columns select').on('change', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('option:selected').val() === '') {
      return true;
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('tr').find('input').trigger('focus');
  }); // Focus the slider, otherwise it looks nearly transparent

  jquery__WEBPACK_IMPORTED_MODULE_0__('a.ui-slider-handle').addClass('ui-state-focus'); // set focus on index name input, if empty

  var input = $outer.find('input#input_index_name');

  if (!input.val()) {
    input.trigger('focus');
  }
};
/**
 * Function to display tooltips that were
 * generated on the PHP side by PhpMyAdmin\Util::showHint()
 *
 * @param {object} $div a div jquery object which specifies the
 *                    domain for searching for tooltips. If we
 *                    omit this parameter the function searches
 *                    in the whole body
 **/


Functions.showHints = function ($div) {
  var $newDiv = $div;

  if ($newDiv === undefined || !($newDiv instanceof jquery__WEBPACK_IMPORTED_MODULE_0__) || $newDiv.length === 0) {
    $newDiv = jquery__WEBPACK_IMPORTED_MODULE_0__('body');
  }

  $newDiv.find('.pma_hint').each(function () {
    Functions.tooltip(jquery__WEBPACK_IMPORTED_MODULE_0__(this).children('img'), 'img', jquery__WEBPACK_IMPORTED_MODULE_0__(this).children('span').html());
  });
};

Functions.mainMenuResizerCallback = function () {
  // 5 px margin for jumping menu in Chrome
  // eslint-disable-next-line compat/compat
  return jquery__WEBPACK_IMPORTED_MODULE_0__(document.body).width() - 5;
};
/**
 * @return {function}
 */


Functions.initializeMenuResizer = () => function () {
  // Initialise the menu resize plugin
  jquery__WEBPACK_IMPORTED_MODULE_0__('#topmenu').menuResizer(Functions.mainMenuResizerCallback); // register resize event

  jquery__WEBPACK_IMPORTED_MODULE_0__(window).on('resize', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#topmenu').menuResizer('resize');
  });
};
/**
 * var  toggleButton  This is a function that creates a toggle
 *                    sliding button given a jQuery reference
 *                    to the correct DOM element
 *
 * @param $obj
 */


Functions.toggleButton = function ($obj) {
  // In rtl mode the toggle switch is flipped horizontally
  // so we need to take that into account
  var right;

  if (jquery__WEBPACK_IMPORTED_MODULE_0__('span.text_direction', $obj).text() === 'ltr') {
    right = 'right';
  } else {
    right = 'left';
  }
  /**
   * @var  h  Height of the button, used to scale the
   *          background image and position the layers
   */


  var h = $obj.height();
  jquery__WEBPACK_IMPORTED_MODULE_0__('img', $obj).height(h);
  jquery__WEBPACK_IMPORTED_MODULE_0__('table', $obj).css('bottom', h - 1);
  /**
   * @var  on   Width of the "ON" part of the toggle switch
   * @var  off  Width of the "OFF" part of the toggle switch
   */

  var on = jquery__WEBPACK_IMPORTED_MODULE_0__('td.toggleOn', $obj).width();
  var off = jquery__WEBPACK_IMPORTED_MODULE_0__('td.toggleOff', $obj).width(); // Make the "ON" and "OFF" parts of the switch the same size
  // + 2 pixels to avoid overflowed

  jquery__WEBPACK_IMPORTED_MODULE_0__('td.toggleOn > div', $obj).width(Math.max(on, off) + 2);
  jquery__WEBPACK_IMPORTED_MODULE_0__('td.toggleOff > div', $obj).width(Math.max(on, off) + 2);
  /**
   *  @var  w  Width of the central part of the switch
   */

  var w = parseInt(jquery__WEBPACK_IMPORTED_MODULE_0__('img', $obj).height() / 16 * 22, 10); // Resize the central part of the switch on the top
  // layer to match the background

  jquery__WEBPACK_IMPORTED_MODULE_0__($obj).find('table td').eq(1).children('div').width(w);
  /**
   * @var  imgw    Width of the background image
   * @var  tblw    Width of the foreground layer
   * @var  offset  By how many pixels to move the background
   *               image, so that it matches the top layer
   */

  var imgw = jquery__WEBPACK_IMPORTED_MODULE_0__('img', $obj).width();
  var tblw = jquery__WEBPACK_IMPORTED_MODULE_0__('table', $obj).width();
  var offset = parseInt((imgw - tblw) / 2, 10); // Move the background to match the layout of the top layer

  $obj.find('img').css(right, offset);
  /**
   * @var  offw    Outer width of the "ON" part of the toggle switch
   * @var  btnw    Outer width of the central part of the switch
   */

  var offw = jquery__WEBPACK_IMPORTED_MODULE_0__('td.toggleOff', $obj).outerWidth();
  var btnw = jquery__WEBPACK_IMPORTED_MODULE_0__($obj).find('table td').eq(1).outerWidth(); // Resize the main div so that exactly one side of
  // the switch plus the central part fit into it.

  $obj.width(offw + btnw + 2);
  /**
   * @var  move  How many pixels to move the
   *             switch by when toggling
   */

  var move = jquery__WEBPACK_IMPORTED_MODULE_0__('td.toggleOff', $obj).outerWidth(); // If the switch is initialized to the
  // OFF state we need to move it now.

  if (jquery__WEBPACK_IMPORTED_MODULE_0__('div.toggle-container', $obj).hasClass('off')) {
    if (right === 'right') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('div.toggle-container', $obj).animate({
        'left': '-=' + move + 'px'
      }, 0);
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('div.toggle-container', $obj).animate({
        'left': '+=' + move + 'px'
      }, 0);
    }
  } // Attach an 'onclick' event to the switch


  jquery__WEBPACK_IMPORTED_MODULE_0__('div.toggle-container', $obj).on('click', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).hasClass('isActive')) {
      return false;
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).addClass('isActive');
    }

    var $msg = Functions.ajaxShowMessage();
    var $container = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var callback = jquery__WEBPACK_IMPORTED_MODULE_0__('span.callback', this).text();
    var operator;
    var url;
    var removeClass;
    var addClass; // Perform the actual toggle

    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).hasClass('on')) {
      if (right === 'right') {
        operator = '-=';
      } else {
        operator = '+=';
      }

      url = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('td.toggleOff > span').text();
      removeClass = 'on';
      addClass = 'off';
    } else {
      if (right === 'right') {
        operator = '+=';
      } else {
        operator = '-=';
      }

      url = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('td.toggleOn > span').text();
      removeClass = 'off';
      addClass = 'on';
    }

    var parts = url.split('?');
    jquery__WEBPACK_IMPORTED_MODULE_0__.post(parts[0], parts[1] + '&ajax_request=true', function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        Functions.ajaxRemoveMessage($msg);
        $container.removeClass(removeClass).addClass(addClass).animate({
          'left': operator + move + 'px'
        }, function () {
          $container.removeClass('isActive');
        }); // eslint-disable-next-line no-eval

        eval(callback);
      } else {
        Functions.ajaxShowMessage(data.error, false);
        $container.removeClass('isActive');
      }
    });
  });
};
/**
 * @return {void}
 */


Functions.initializeToggleButtons = function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('div.toggleAjax').each(function () {
    var $button = jquery__WEBPACK_IMPORTED_MODULE_0__(this).show();
    $button.find('img').each(function () {
      if (this.complete) {
        Functions.toggleButton($button);
      } else {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).on('load', function () {
          Functions.toggleButton($button);
        });
      }
    });
  });
};
/**
 * Auto submit page selector
 * @return {function}
 */


Functions.getPageSelectorEventHandler = function () {
  return function (event) {
    event.stopPropagation(); // Check where to load the new content

    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('#pma_navigation').length === 0) {
      // For the main page we don't need to do anything,
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('form').trigger('submit');
    } else {
      // but for the navigation we need to manually replace the content
      Navigation.treePagination(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
    }
  };
};
/**
 * @return {void}
 */


Functions.teardownRecentFavoriteTables = () => {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#update_recent_tables').off('ready');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#sync_favorite_tables').off('ready');
};
/**
 * @return {void}
 */


Functions.onloadRecentFavoriteTables = () => {
  var $updateRecentTables = jquery__WEBPACK_IMPORTED_MODULE_0__('#update_recent_tables');

  if ($updateRecentTables.length) {
    jquery__WEBPACK_IMPORTED_MODULE_0__.get($updateRecentTables.attr('href'), {
      'no_debug': true
    }, function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_recent_list').html(data.list);
      }
    });
  } // Sync favorite tables from localStorage to pmadb.


  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#sync_favorite_tables').length) {
    jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
      url: jquery__WEBPACK_IMPORTED_MODULE_0__('#sync_favorite_tables').attr('href'),
      cache: false,
      type: 'POST',
      data: {
        'favoriteTables': window.Config.isStorageSupported('localStorage') && typeof window.localStorage.favoriteTables !== 'undefined' ? window.localStorage.favoriteTables : '',
        'server': window.CommonParams.get('server'),
        'no_debug': true
      },
      success: function (data) {
        // Update localStorage.
        if (window.Config.isStorageSupported('localStorage')) {
          window.localStorage.favoriteTables = data.favoriteTables;
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_favorite_list').html(data.list);
      }
    });
  }
};
/**
 * Creates a message inside an object with a sliding effect
 *
 * @param {string} msg    A string containing the text to display
 * @param {JQuery} $object   a jQuery object containing the reference
 *                 to the element where to put the message
 *                 This is optional, if no element is
 *                 provided, one will be created below the
 *                 navigation links at the top of the page
 *
 * @return {boolean} True on success, false on failure
 */


Functions.slidingMessage = function (msg, $object) {
  var $obj = $object;

  if (msg === undefined || msg.length === 0) {
    // Don't show an empty message
    return false;
  }

  if ($obj === undefined || !($obj instanceof jquery__WEBPACK_IMPORTED_MODULE_0__) || $obj.length === 0) {
    // If the second argument was not supplied,
    // we might have to create a new DOM node.
    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#PMA_slidingMessage').length === 0) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content').prepend('<span id="PMA_slidingMessage" ' + 'class="d-inline-block"></span>');
    }

    $obj = jquery__WEBPACK_IMPORTED_MODULE_0__('#PMA_slidingMessage');
  }

  if ($obj.has('div').length > 0) {
    // If there already is a message inside the
    // target object, we must get rid of it
    $obj.find('div').first().fadeOut(function () {
      $obj.children().remove();
      $obj.append('<div>' + msg + '</div>'); // highlight any sql before taking height;

      Functions.highlightSql($obj);
      $obj.find('div').first().hide();
      $obj.animate({
        height: $obj.find('div').first().height()
      }).find('div').first().fadeIn();
    });
  } else {
    // Object does not already have a message
    // inside it, so we simply slide it down
    $obj.width('100%').html('<div>' + msg + '</div>'); // highlight any sql before taking height;

    Functions.highlightSql($obj);
    var h = $obj.find('div').first().hide().height();
    $obj.find('div').first().css('height', 0).show().animate({
      height: h
    }, function () {
      // Set the height of the parent
      // to the height of the child
      $obj.height($obj.find('div').first().height());
    });
  }

  return true;
};
/**
 * Attach CodeMirror editor to SQL edit area.
 * @return {void}
 */


Functions.onloadCodeMirrorEditor = () => {
  var $elm = jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlquery');

  if ($elm.siblings().filter('.CodeMirror').length > 0) {
    return;
  }

  if ($elm.length > 0) {
    if (typeof window.CodeMirror !== 'undefined') {
      window.codeMirrorEditor = Functions.getSqlEditor($elm);
      window.codeMirrorEditor.focus();
      window.codeMirrorEditor.on('blur', Functions.updateQueryParameters);
    } else {
      // without codemirror
      $elm.trigger('focus').on('blur', Functions.updateQueryParameters);
    }
  }

  Functions.highlightSql(jquery__WEBPACK_IMPORTED_MODULE_0__('body'));
};
/**
 * @return {void}
 */


Functions.teardownCodeMirrorEditor = () => {
  if (window.codeMirrorEditor) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#sqlquery').text(window.codeMirrorEditor.getValue());
    window.codeMirrorEditor.toTextArea();
    window.codeMirrorEditor = false;
  }
};
/**
 * @return {void}
 */


Functions.onloadLockPage = function () {
  // initializes all lock-page elements lock-id and
  // val-hash data property
  jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content form.lock-page textarea, ' + '#page_content form.lock-page input[type="text"], ' + '#page_content form.lock-page input[type="number"], ' + '#page_content form.lock-page select').each(function (i) {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).data('lock-id', i); // val-hash is the hash of default value of the field
    // so that it can be compared with new value hash
    // to check whether field was modified or not.

    jquery__WEBPACK_IMPORTED_MODULE_0__(this).data('val-hash', window.AJAX.hash(jquery__WEBPACK_IMPORTED_MODULE_0__(this).val()));
  }); // initializes lock-page elements (input types checkbox and radio buttons)
  // lock-id and val-hash data property

  jquery__WEBPACK_IMPORTED_MODULE_0__('#page_content form.lock-page input[type="checkbox"], ' + '#page_content form.lock-page input[type="radio"]').each(function (i) {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).data('lock-id', i);
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).data('val-hash', window.AJAX.hash(jquery__WEBPACK_IMPORTED_MODULE_0__(this).is(':checked')));
  });
};
/**
 * jQuery plugin to correctly filter input fields by value, needed
 * because some nasty values may break selector syntax
 */


(function ($) {
  $.fn.filterByValue = function (value) {
    return this.filter(function () {
      return $(this).val() === value;
    });
  };
})(jquery__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Return value of a cell in a table.
 *
 * @param {string} td
 * @return {string}
 */


Functions.getCellValue = function (td) {
  var $td = jquery__WEBPACK_IMPORTED_MODULE_0__(td);

  if ($td.is('.null')) {
    return '';
  } else if ((!$td.is('.to_be_saved') || $td.is('.set')) && $td.data('original_data')) {
    return $td.data('original_data');
  } else {
    return $td.text();
  }
};
/**
 * Automatic form submission on change.
 * @return {function}
 */


Functions.getAutoSubmitEventHandler = function () {
  return function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('form').trigger('submit');
  };
};
/**
 * @implements EventListener
 */


const PrintPage = {
  handleEvent: () => {
    window.print();
  }
};

Functions.teardownCreateView = () => {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'a.create_view.ajax');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('keydown', '#createViewModal input, #createViewModal select');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', '#fkc_checkbox');
};

Functions.onloadCreateView = function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('.logout').on('click', function () {
    var form = jquery__WEBPACK_IMPORTED_MODULE_0__('<form method="POST" action="' + jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href') + '" class="disableAjax">' + '<input type="hidden" name="token" value="' + Functions.escapeHtml(window.CommonParams.get('token')) + '">' + '</form>');
    jquery__WEBPACK_IMPORTED_MODULE_0__('body').append(form);
    form.submit();
    sessionStorage.clear();
    return false;
  });
  /**
   * Ajaxification for the "Create View" action
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.create_view.ajax', function (e) {
    e.preventDefault();
    Functions.createViewModal(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  });
  /**
   * Attach Ajax event handlers for input fields in the editor
   * and used to submit the Ajax request when the ENTER key is pressed.
   */

  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#createViewModal').length !== 0) {
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('keydown', '#createViewModal input, #createViewModal select', function (e) {
      if (e.which === 13) {
        // 13 is the ENTER key
        e.preventDefault(); // with preventing default, selection by <select> tag
        // was also prevented in IE

        jquery__WEBPACK_IMPORTED_MODULE_0__(this).trigger('blur');
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.ui-dialog').find('.ui-button').first().trigger('click');
      }
    }); // end $(document).on()
  }

  if (jquery__WEBPACK_IMPORTED_MODULE_0__('textarea[name="view[as]"]').length !== 0) {
    window.codeMirrorEditor = Functions.getSqlEditor(jquery__WEBPACK_IMPORTED_MODULE_0__('textarea[name="view[as]"]'));
  }
};

Functions.createViewModal = function ($this) {
  var $msg = Functions.ajaxShowMessage();
  var sep = window.CommonParams.get('arg_separator');
  var params = Functions.getJsConfirmCommonParam(this, $this.getPostData());
  params += sep + 'ajax_dialog=1';
  jquery__WEBPACK_IMPORTED_MODULE_0__.post($this.attr('href'), params, function (data) {
    if (typeof data !== 'undefined' && data.success === true) {
      Functions.ajaxRemoveMessage($msg);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#createViewModalGoButton').on('click', function () {
        if (typeof window.CodeMirror !== 'undefined') {
          window.codeMirrorEditor.save();
        }

        $msg = Functions.ajaxShowMessage();
        jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/view/create', jquery__WEBPACK_IMPORTED_MODULE_0__('#createViewModal').find('form').serialize(), function (data) {
          Functions.ajaxRemoveMessage($msg);

          if (typeof data !== 'undefined' && data.success === true) {
            jquery__WEBPACK_IMPORTED_MODULE_0__('#createViewModal').modal('hide');
            jquery__WEBPACK_IMPORTED_MODULE_0__('.result_query').html(data.message);
            Navigation.reload();
          } else {
            Functions.ajaxShowMessage(data.error);
          }
        });
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#createViewModal').find('.modal-body').first().html(data.message); // Attach syntax highlighted editor

      jquery__WEBPACK_IMPORTED_MODULE_0__('#createViewModal').on('shown.bs.modal', function () {
        window.codeMirrorEditor = Functions.getSqlEditor(jquery__WEBPACK_IMPORTED_MODULE_0__('#createViewModal').find('textarea'));
        jquery__WEBPACK_IMPORTED_MODULE_0__('input:visible[type=text]', jquery__WEBPACK_IMPORTED_MODULE_0__('#createViewModal')).first().trigger('focus');
        jquery__WEBPACK_IMPORTED_MODULE_0__('#createViewModal').off('shown.bs.modal');
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#createViewModal').modal('show');
    } else {
      Functions.ajaxShowMessage(data.error);
    }
  });
};
/**
 * Makes the breadcrumbs and the menu bar float at the top of the viewport.
 * @return {function}
 */


Functions.floatingMenuBar = () => function () {
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#floating_menubar').length && jquery__WEBPACK_IMPORTED_MODULE_0__('#PMA_disable_floating_menubar').length === 0) {
    var left = jquery__WEBPACK_IMPORTED_MODULE_0__('html').attr('dir') === 'ltr' ? 'left' : 'right';
    jquery__WEBPACK_IMPORTED_MODULE_0__('#floating_menubar').css('margin-' + left, jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation').width() + jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_resizer').width()).css(left, 0).css({
      'position': 'fixed',
      'top': 0,
      'width': '100%',
      'z-index': 99
    }).append(jquery__WEBPACK_IMPORTED_MODULE_0__('#server-breadcrumb')).append(jquery__WEBPACK_IMPORTED_MODULE_0__('#topmenucontainer')); // Allow the DOM to render, then adjust the padding on the body

    setTimeout(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__('body').css('padding-top', jquery__WEBPACK_IMPORTED_MODULE_0__('#floating_menubar').outerHeight(true));
      jquery__WEBPACK_IMPORTED_MODULE_0__('#topmenu').menuResizer('resize');
    }, 4);
  }
};
/**
 * Scrolls the page to the top if clicking the server-breadcrumb bar
 * @return {function}
 */


Functions.breadcrumbScrollToTop = () => function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#server-breadcrumb, #goto_pagetop', function (event) {
    event.preventDefault();
    jquery__WEBPACK_IMPORTED_MODULE_0__('html, body').animate({
      scrollTop: 0
    }, 'fast');
  });
};

const checkboxesSel = 'input.checkall:checkbox:enabled';
Functions.checkboxesSel = checkboxesSel;
/**
 * Watches checkboxes in a form to set the checkall box accordingly
 */

Functions.checkboxesChanged = function () {
  var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this.form); // total number of checkboxes in current form

  var totalBoxes = $form.find(checkboxesSel).length; // number of checkboxes checked in current form

  var checkedBoxes = $form.find(checkboxesSel + ':checked').length;
  var $checkall = $form.find('input.checkall_box');

  if (totalBoxes === checkedBoxes) {
    $checkall.prop({
      checked: true,
      indeterminate: false
    });
  } else if (checkedBoxes > 0) {
    $checkall.prop({
      checked: true,
      indeterminate: true
    });
  } else {
    $checkall.prop({
      checked: false,
      indeterminate: false
    });
  }
};
/**
 * @return {function}
 */


Functions.getCheckAllBoxEventHandler = () => function () {
  var isChecked = jquery__WEBPACK_IMPORTED_MODULE_0__(this).is(':checked');
  jquery__WEBPACK_IMPORTED_MODULE_0__(this.form).find(checkboxesSel).not('.row-hidden').prop('checked', isChecked).parents('tr').toggleClass('marked table-active', isChecked);
};
/**
 * @return {function}
 */


Functions.getCheckAllFilterEventHandler = () => function () {
  var $this = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
  var selector = $this.data('checkall-selector');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input.checkall_box').prop('checked', false);
  $this.parents('form').find(checkboxesSel).filter(selector).prop('checked', true).trigger('change').parents('tr').toggleClass('marked', true);
  return false;
};
/**
 * Watches checkboxes in a sub form to set the sub checkall box accordingly
 */


Functions.subCheckboxesChanged = function () {
  var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().parent(); // total number of checkboxes in current sub form

  var totalBoxes = $form.find(checkboxesSel).length; // number of checkboxes checked in current sub form

  var checkedBoxes = $form.find(checkboxesSel + ':checked').length;
  var $checkall = $form.find('input.sub_checkall_box');

  if (totalBoxes === checkedBoxes) {
    $checkall.prop({
      checked: true,
      indeterminate: false
    });
  } else if (checkedBoxes > 0) {
    $checkall.prop({
      checked: true,
      indeterminate: true
    });
  } else {
    $checkall.prop({
      checked: false,
      indeterminate: false
    });
  }
};
/**
 * @return {function}
 */


Functions.getSubCheckAllBoxEventHandler = () => function () {
  var isChecked = jquery__WEBPACK_IMPORTED_MODULE_0__(this).is(':checked');
  var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().parent();
  $form.find(checkboxesSel).prop('checked', isChecked).parents('tr').toggleClass('marked', isChecked);
};
/**
 * Rows filtering
 *
 * - rows to filter are identified by data-filter-row attribute
 *   which contains uppercase string to filter
 * - it is simple substring case insensitive search
 * - optionally number of matching rows is written to element with
 *   id filter-rows-count
 * @return {function}
 */


Functions.getFilterTextEventHandler = () => function () {
  var filterInput = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val().toUpperCase().replace(/ /g, '_');
  var count = 0;
  jquery__WEBPACK_IMPORTED_MODULE_0__('[data-filter-row]').each(function () {
    var $row = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    /* Can not use data() here as it does magic conversion to int for numeric values */

    if ($row.attr('data-filter-row').indexOf(filterInput) > -1) {
      count += 1;
      $row.show();
      $row.find('input.checkall').removeClass('row-hidden');
    } else {
      $row.hide();
      $row.find('input.checkall').addClass('row-hidden').prop('checked', false);
      $row.removeClass('marked');
    }
  });
  setTimeout(function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(checkboxesSel).trigger('change');
  }, 300);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#filter-rows-count').html(count);
};

Functions.onloadFilterText = () => {
  /* Trigger filtering of the list based on incoming database name */
  var $filter = jquery__WEBPACK_IMPORTED_MODULE_0__('#filterText');

  if ($filter.val()) {
    $filter.trigger('keyup').trigger('select');
  }
};
/**
 * Formats a byte number to human-readable form
 *
 * @param bytesToFormat the bytes to format
 * @param subDecimals optional subdecimals the number of digits after the point
 * @param pointChar optional pointchar the char to use as decimal point
 *
 * @return {string}
 */


Functions.formatBytes = function (bytesToFormat, subDecimals, pointChar) {
  var bytes = bytesToFormat;
  var decimals = subDecimals;
  var point = pointChar;

  if (!decimals) {
    decimals = 0;
  }

  if (!point) {
    point = '.';
  }

  var units = ['B', 'KiB', 'MiB', 'GiB'];

  for (var i = 0; bytes > 1024 && i < units.length; i++) {
    bytes /= 1024;
  }

  var factor = Math.pow(10, decimals);
  bytes = Math.round(bytes * factor) / factor;
  bytes = bytes.toString().split('.').join(point);
  return bytes + ' ' + units[i];
};

Functions.onloadLoginForm = () => {
  /**
   * Reveal the login form to users with JS enabled
   * and focus the appropriate input field
   */
  var $loginform = jquery__WEBPACK_IMPORTED_MODULE_0__('#loginform');

  if ($loginform.length) {
    $loginform.find('.js-show').show();

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#input_username').val()) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#input_password').trigger('focus');
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#input_username').trigger('focus');
    }
  }

  var $httpsWarning = jquery__WEBPACK_IMPORTED_MODULE_0__('#js-https-mismatch');

  if ($httpsWarning.length) {
    if (window.location.protocol === 'https:' !== window.CommonParams.get('is_https')) {
      $httpsWarning.show();
    }
  }
};
/**
 * Formats timestamp for display
 *
 * @param {string} date
 * @param {bool} seconds
 * @return {string}
 */


Functions.formatDateTime = function (date, seconds) {
  var result = jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.formatDate('yy-mm-dd', date);
  var timefmt = 'HH:mm';

  if (seconds) {
    timefmt = 'HH:mm:ss';
  }

  return result + ' ' + jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.formatTime(timefmt, {
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds()
  });
};
/**
 * Check than forms have less fields than max allowed by PHP.
 * @return {boolean}
 */


Functions.checkNumberOfFields = function () {
  if (typeof maxInputVars === 'undefined') {
    return false;
  }

  if (false === maxInputVars) {
    return false;
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__('form').each(function () {
    var nbInputs = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find(':input').length;

    if (nbInputs > maxInputVars) {
      var warning = Functions.sprintf(window.Messages.strTooManyInputs, maxInputVars);
      Functions.ajaxShowMessage(warning);
      return false;
    }

    return true;
  });
  return true;
};
/**
 * Ignore the displayed php errors.
 * Simply removes the displayed errors.
 *
 * @param clearPrevErrors whether to clear errors stored
 *             in $_SESSION['prev_errors'] at server
 *
 */


Functions.ignorePhpErrors = function (clearPrevErrors) {
  var clearPrevious = clearPrevErrors;

  if (typeof clearPrevious === 'undefined' || clearPrevious === null) {
    clearPrevious = false;
  } // send AJAX request to /error-report with send_error_report=0, exception_type=php & token.
  // It clears the prev_errors stored in session.


  if (clearPrevious) {
    var $pmaReportErrorsForm = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_report_errors_form');
    $pmaReportErrorsForm.find('input[name="send_error_report"]').val(0); // change send_error_report to '0'

    $pmaReportErrorsForm.trigger('submit');
  } // remove displayed errors


  var $pmaErrors = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_errors');
  $pmaErrors.fadeOut('slow');
  $pmaErrors.remove();
};
/**
 * Toggle the Datetimepicker UI if the date value entered
 * by the user in the 'text box' is not going to be accepted
 * by the Datetimepicker plugin (but is accepted by MySQL)
 *
 * @param $td
 * @param $inputField
 */


Functions.toggleDatepickerIfInvalid = function ($td, $inputField) {
  // Regex allowed by the Datetimepicker UI
  var dtexpDate = new RegExp(['^([0-9]{4})', '-(((01|03|05|07|08|10|12)-((0[1-9])|([1-2][0-9])|(3[0-1])))|((02|04|06|09|11)', '-((0[1-9])|([1-2][0-9])|30)))$'].join(''));
  var dtexpTime = new RegExp(['^(([0-1][0-9])|(2[0-3]))', ':((0[0-9])|([1-5][0-9]))', ':((0[0-9])|([1-5][0-9]))(.[0-9]{1,6}){0,1}$'].join('')); // If key-ed in Time or Date values are unsupported by the UI, close it

  if ($td.attr('data-type') === 'date' && !dtexpDate.test($inputField.val())) {
    $inputField.datepicker('hide');
  } else if ($td.attr('data-type') === 'time' && !dtexpTime.test($inputField.val())) {
    $inputField.datepicker('hide');
  } else {
    $inputField.datepicker('show');
  }
};
/**
 * Function to submit the login form after validation is done.
 * NOTE: do NOT use a module or it will break the callback, issue #15435
 */


window.recaptchaCallback = function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#login_form').trigger('submit');
};
/**
 * Handle 'Ctrl/Alt + Enter' form submits
 * @return {function}
 */


Functions.getKeyboardFormSubmitEventHandler = function () {
  return function (e) {
    if (e.ctrlKey && e.which === 13 || e.altKey && e.which === 13) {
      var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('form'); // There could be multiple submit buttons on the same form,
      // we assume all of them behave identical and just click one.

      if (!$form.find('input[type="submit"]').first() || !$form.find('input[type="submit"]').first().trigger('click')) {
        $form.trigger('submit');
      }
    }
  };
};
/**
 * Display warning regarding SSL when sha256_password method is selected
 * Used in /user-password (Change Password link on index.php)
 * @return {function}
 */


Functions.getSslPasswordEventHandler = function () {
  return function () {
    if (this.value === 'sha256_password') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#ssl_reqd_warning_cp').show();
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#ssl_reqd_warning_cp').hide();
    }
  };
};

Functions.teardownSortLinkMouseEvent = () => {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('mouseover', '.sortlink');
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('mouseout', '.sortlink');
};

Functions.onloadSortLinkMouseEvent = function () {
  // Bind event handlers for toggling sort icons
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mouseover', '.sortlink', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('.soimg').toggle();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mouseout', '.sortlink', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('.soimg').toggle();
  });
};
/**
 * Returns an HTML IMG tag for a particular image from a theme,
 * which may be an actual file or an icon from a sprite
 *
 * @param {string} image      The name of the file to get
 * @param {string} alternate  Used to set 'alt' and 'title' attributes of the image
 * @param {object} attributes An associative array of other attributes
 *
 * @return {object} The requested image, this object has two methods:
 *                  .toString()        - Returns the IMG tag for the requested image
 *                  .attr(name)        - Returns a particular attribute of the IMG
 *                                       tag given it's name
 *                  .attr(name, value) - Sets a particular attribute of the IMG
 *                                       tag to the given value
 */


Functions.getImage = function (image, alternate, attributes) {
  var alt = alternate;
  var attr = attributes; // custom image object, it will eventually be returned by this functions

  var retval = {
    data: {
      // this is private
      alt: '',
      title: '',
      src: 'themes/dot.gif'
    },
    attr: function (name, value) {
      if (value === undefined) {
        if (this.data[name] === undefined) {
          return '';
        } else {
          return this.data[name];
        }
      } else {
        this.data[name] = value;
      }
    },
    toString: function () {
      var retval = '<' + 'img';

      for (var i in this.data) {
        retval += ' ' + i + '="' + this.data[i] + '"';
      }

      retval += ' /' + '>';
      return retval;
    }
  }; // initialise missing parameters

  if (attr === undefined) {
    attr = {};
  }

  if (alt === undefined) {
    alt = '';
  } // set alt


  if (attr.alt !== undefined) {
    retval.attr('alt', Functions.escapeHtml(attr.alt));
  } else {
    retval.attr('alt', Functions.escapeHtml(alt));
  } // set title


  if (attr.title !== undefined) {
    retval.attr('title', Functions.escapeHtml(attr.title));
  } else {
    retval.attr('title', Functions.escapeHtml(alt));
  } // set css classes


  retval.attr('class', 'icon ic_' + image); // set all other attributes

  for (var i in attr) {
    if (i === 'src') {
      // do not allow to override the 'src' attribute
      continue;
    }

    retval.attr(i, attr[i]);
  }

  return retval;
};
/**
 * Sets a configuration value.
 *
 * A configuration value may be set in both browser's local storage and
 * remotely in server's configuration table.
 *
 * NOTE: Depending on server's configuration, the configuration table may be or
 * not persistent.
 *
 * @param {string}     key         Configuration key.
 * @param {object}     value       Configuration value.
 */


Functions.configSet = function (key, value) {
  var serialized = JSON.stringify(value);
  localStorage.setItem(key, serialized);
  jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
    url: 'index.php?route=/config/set',
    type: 'POST',
    dataType: 'json',
    data: {
      'ajax_request': true,
      key: key,
      server: window.CommonParams.get('server'),
      value: serialized
    },
    success: function (data) {
      // Updating value in local storage.
      if (!data.success) {
        if (data.error) {
          Functions.ajaxShowMessage(data.error);
        } else {
          Functions.ajaxShowMessage(data.message);
        }
      } // Eventually, call callback.

    }
  });
};
/**
 * Gets a configuration value. A configuration value will be searched in
 * browser's local storage first and if not found, a call to the server will be
 * made.
 *
 * If value should not be cached and the up-to-date configuration value from
 * right from the server is required, the third parameter should be `false`.
 *
 * @param {string}     key             Configuration key.
 * @param {boolean}    cached          Configuration type.
 * @param {Function}   successCallback The callback to call after the value is received
 *
 * @return {void}
 */


Functions.configGet = function (key, cached, successCallback) {
  var isCached = typeof cached !== 'undefined' ? cached : true;
  var value = localStorage.getItem(key);

  if (isCached && value !== undefined && value !== null) {
    return JSON.parse(value);
  } // Result not found in local storage or ignored.
  // Hitting the server.


  jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
    url: 'index.php?route=/config/get',
    type: 'POST',
    dataType: 'json',
    data: {
      'ajax_request': true,
      server: window.CommonParams.get('server'),
      key: key
    },
    success: function (data) {
      // Updating value in local storage.
      if (data.success) {
        localStorage.setItem(key, JSON.stringify(data.value));
      } else {
        Functions.ajaxShowMessage(data.message);
      } // Call the callback if it is defined


      if (typeof successCallback === 'function') {
        // Feed it the value previously saved like on async mode
        successCallback(JSON.parse(localStorage.getItem(key)));
      }
    }
  });
};
/**
 * Return POST data as stored by Generator::linkOrButton
 *
 * @return {string}
 */


Functions.getPostData = function () {
  var dataPost = this.attr('data-post'); // Strip possible leading ?

  if (dataPost !== undefined && dataPost.startsWith('?')) {
    dataPost = dataPost.substring(1);
  }

  return dataPost;
};

jquery__WEBPACK_IMPORTED_MODULE_0__.fn.getPostData = Functions.getPostData;
/**
 * @return {function}
 */

Functions.off = function () {
  return function () {
    Functions.teardownIdleEvent();
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'input:checkbox.checkall');
    Functions.teardownSqlQueryEditEvents();
    Functions.removeAutocompleteInfo();
    Functions.teardownCreateTableEvents();
    Functions.teardownEnumSetEditorMessage();
    Functions.teardownEnumSetEditor();
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', '#index_frm input[type=submit]');
    jquery__WEBPACK_IMPORTED_MODULE_0__('div.toggle-container').off('click');
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', 'select.pageselector');
    Functions.teardownRecentFavoriteTables();
    Functions.teardownCodeMirrorEditor();
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', '.autosubmit');
    document.querySelectorAll('.jsPrintButton').forEach(item => {
      item.removeEventListener('click', PrintPage);
    });
    Functions.teardownCreateView();
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('keydown', 'form input, form textarea, form select');
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('change', 'input[type=radio][name="pw_hash"]');
    Functions.teardownSortLinkMouseEvent();
  };
};
/**
 * @return {function}
 */


Functions.on = function () {
  return function () {
    Functions.onloadIdleEvent();
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'input:checkbox.checkall', Functions.getCheckAllCheckboxEventHandler());
    Functions.addDateTimePicker();
    /**
     * Add attribute to text boxes for iOS devices (based on bugID: 3508912)
     */

    if (navigator.userAgent.match(/(iphone|ipod|ipad)/i)) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=text]').attr('autocapitalize', 'off').attr('autocorrect', 'off');
    }

    Functions.onloadSqlQueryEditEvents();
    Functions.onloadCreateTableEvents();
    Functions.onloadChangePasswordEvents();
    Functions.onloadEnumSetEditorMessage();
    Functions.onloadEnumSetEditor();
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#index_frm input[type=submit]', Functions.getAddIndexEventHandler());
    Functions.showHints();
    Functions.initializeToggleButtons();
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', 'select.pageselector', Functions.getPageSelectorEventHandler());
    Functions.onloadRecentFavoriteTables();
    Functions.onloadCodeMirrorEditor();
    Functions.onloadLockPage();
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '.autosubmit', Functions.getAutoSubmitEventHandler());
    document.querySelectorAll('.jsPrintButton').forEach(item => {
      item.addEventListener('click', PrintPage);
    });
    Functions.onloadCreateView();
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', checkboxesSel, Functions.checkboxesChanged);
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', 'input.checkall_box', Functions.getCheckAllBoxEventHandler());
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '.checkall-filter', Functions.getCheckAllFilterEventHandler());
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', checkboxesSel + ', input.checkall_box:checkbox:enabled', Functions.subCheckboxesChanged);
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', 'input.sub_checkall_box', Functions.getSubCheckAllBoxEventHandler());
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('keyup', '#filterText', Functions.getFilterTextEventHandler());
    Functions.onloadFilterText();
    Functions.onloadLoginForm();
    jquery__WEBPACK_IMPORTED_MODULE_0__('form input, form textarea, form select').on('keydown', Functions.getKeyboardFormSubmitEventHandler());
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', 'select#select_authentication_plugin_cp', Functions.getSslPasswordEventHandler());
    Functions.onloadSortLinkMouseEvent();
  };
};

/***/ }),

/***/ 34:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mysqlDocBuiltin": function() { return /* binding */ mysqlDocBuiltin; },
/* harmony export */   "mysqlDocKeyword": function() { return /* binding */ mysqlDocKeyword; }
/* harmony export */ });
/**
 * Definition of links to MySQL documentation.
 */
const mysqlDocKeyword = {
  /* Multi word */
  'CHARACTER SET': ['charset'],
  'SHOW AUTHORS': ['show-authors'],
  'SHOW BINARY LOGS': ['show-binary-logs'],
  'SHOW BINLOG EVENTS': ['show-binlog-events'],
  'SHOW CHARACTER SET': ['show-character-set'],
  'SHOW COLLATION': ['show-collation'],
  'SHOW COLUMNS': ['show-columns'],
  'SHOW CONTRIBUTORS': ['show-contributors'],
  'SHOW CREATE DATABASE': ['show-create-database'],
  'SHOW CREATE EVENT': ['show-create-event'],
  'SHOW CREATE FUNCTION': ['show-create-function'],
  'SHOW CREATE PROCEDURE': ['show-create-procedure'],
  'SHOW CREATE TABLE': ['show-create-table'],
  'SHOW CREATE TRIGGER': ['show-create-trigger'],
  'SHOW CREATE VIEW': ['show-create-view'],
  'SHOW DATABASES': ['show-databases'],
  'SHOW ENGINE': ['show-engine'],
  'SHOW ENGINES': ['show-engines'],
  'SHOW ERRORS': ['show-errors'],
  'SHOW EVENTS': ['show-events'],
  'SHOW FUNCTION CODE': ['show-function-code'],
  'SHOW FUNCTION STATUS': ['show-function-status'],
  'SHOW GRANTS': ['show-grants'],
  'SHOW INDEX': ['show-index'],
  'SHOW MASTER STATUS': ['show-master-status'],
  'SHOW OPEN TABLES': ['show-open-tables'],
  'SHOW PLUGINS': ['show-plugins'],
  'SHOW PRIVILEGES': ['show-privileges'],
  'SHOW PROCEDURE CODE': ['show-procedure-code'],
  'SHOW PROCEDURE STATUS': ['show-procedure-status'],
  'SHOW PROCESSLIST': ['show-processlist'],
  'SHOW PROFILE': ['show-profile'],
  'SHOW PROFILES': ['show-profiles'],
  'SHOW RELAYLOG EVENTS': ['show-relaylog-events'],
  'SHOW SLAVE HOSTS': ['show-slave-hosts'],
  'SHOW SLAVE STATUS': ['show-slave-status'],
  'SHOW STATUS': ['show-status'],
  'SHOW TABLE STATUS': ['show-table-status'],
  'SHOW TABLES': ['show-tables'],
  'SHOW TRIGGERS': ['show-triggers'],
  'SHOW VARIABLES': ['show-variables'],
  'SHOW WARNINGS': ['show-warnings'],
  'LOAD DATA INFILE': ['load-data'],
  'LOAD XML': ['load-xml'],
  'LOCK TABLES': ['lock-tables'],
  'UNLOCK TABLES': ['lock-tables'],
  'ALTER DATABASE': ['alter-database'],
  'ALTER EVENT': ['alter-event'],
  'ALTER LOGFILE GROUP': ['alter-logfile-group'],
  'ALTER FUNCTION': ['alter-function'],
  'ALTER PROCEDURE': ['alter-procedure'],
  'ALTER SERVER': ['alter-server'],
  'ALTER TABLE': ['alter-table'],
  'ALTER TABLESPACE': ['alter-tablespace'],
  'ALTER VIEW': ['alter-view'],
  'CREATE DATABASE': ['create-database'],
  'CREATE EVENT': ['create-event'],
  'CREATE FUNCTION': ['create-function'],
  'CREATE INDEX': ['create-index'],
  'CREATE LOGFILE GROUP': ['create-logfile-group'],
  'CREATE PROCEDURE': ['create-procedure'],
  'CREATE SERVER': ['create-server'],
  'CREATE TABLE': ['create-table'],
  'CREATE TABLESPACE': ['create-tablespace'],
  'CREATE TRIGGER': ['create-trigger'],
  'CREATE VIEW': ['create-view'],
  'DROP DATABASE': ['drop-database'],
  'DROP EVENT': ['drop-event'],
  'DROP FUNCTION': ['drop-function'],
  'DROP INDEX': ['drop-index'],
  'DROP LOGFILE GROUP': ['drop-logfile-group'],
  'DROP PROCEDURE': ['drop-procedure'],
  'DROP SERVER': ['drop-server'],
  'DROP TABLE': ['drop-table'],
  'DROP TABLESPACE': ['drop-tablespace'],
  'DROP TRIGGER': ['drop-trigger'],
  'DROP VIEW': ['drop-view'],
  'RENAME TABLE': ['rename-table'],
  'TRUNCATE TABLE': ['truncate-table'],

  /* Statements */
  'SELECT': ['select'],
  'SET': ['set'],
  'EXPLAIN': ['explain'],
  'DESCRIBE': ['describe'],
  'DELETE': ['delete'],
  'SHOW': ['show'],
  'UPDATE': ['update'],
  'INSERT': ['insert'],
  'REPLACE': ['replace'],
  'CALL': ['call'],
  'DO': ['do'],
  'HANDLER': ['handler'],
  'COLLATE': ['charset-collations'],

  /* Functions */
  'ABS': ['mathematical-functions', 'function_abs'],
  'ACOS': ['mathematical-functions', 'function_acos'],
  'ADDDATE': ['date-and-time-functions', 'function_adddate'],
  'ADDTIME': ['date-and-time-functions', 'function_addtime'],
  'AES_DECRYPT': ['encryption-functions', 'function_aes_decrypt'],
  'AES_ENCRYPT': ['encryption-functions', 'function_aes_encrypt'],
  'AND': ['logical-operators', 'operator_and'],
  'ASCII': ['string-functions', 'function_ascii'],
  'ASIN': ['mathematical-functions', 'function_asin'],
  'ATAN2': ['mathematical-functions', 'function_atan2'],
  'ATAN': ['mathematical-functions', 'function_atan'],
  'AVG': ['aggregate-functions', 'function_avg'],
  'BENCHMARK': ['information-functions', 'function_benchmark'],
  'BIN': ['string-functions', 'function_bin'],
  'BINARY': ['cast-functions', 'operator_binary'],
  'BIT_AND': ['aggregate-functions', 'function_bit_and'],
  'BIT_COUNT': ['bit-functions', 'function_bit_count'],
  'BIT_LENGTH': ['string-functions', 'function_bit_length'],
  'BIT_OR': ['aggregate-functions', 'function_bit_or'],
  'BIT_XOR': ['aggregate-functions', 'function_bit_xor'],
  'CASE': ['control-flow-functions', 'operator_case'],
  'CAST': ['cast-functions', 'function_cast'],
  'CEIL': ['mathematical-functions', 'function_ceil'],
  'CEILING': ['mathematical-functions', 'function_ceiling'],
  'CHAR_LENGTH': ['string-functions', 'function_char_length'],
  'CHAR': ['string-functions', 'function_char'],
  'CHARACTER_LENGTH': ['string-functions', 'function_character_length'],
  'CHARSET': ['information-functions', 'function_charset'],
  'COALESCE': ['comparison-operators', 'function_coalesce'],
  'COERCIBILITY': ['information-functions', 'function_coercibility'],
  'COLLATION': ['information-functions', 'function_collation'],
  'COMPRESS': ['encryption-functions', 'function_compress'],
  'CONCAT_WS': ['string-functions', 'function_concat_ws'],
  'CONCAT': ['string-functions', 'function_concat'],
  'CONNECTION_ID': ['information-functions', 'function_connection_id'],
  'CONV': ['mathematical-functions', 'function_conv'],
  'CONVERT_TZ': ['date-and-time-functions', 'function_convert_tz'],
  'Convert': ['cast-functions', 'function_convert'],
  'COS': ['mathematical-functions', 'function_cos'],
  'COT': ['mathematical-functions', 'function_cot'],
  'COUNT': ['aggregate-functions', 'function_count'],
  'CRC32': ['mathematical-functions', 'function_crc32'],
  'CURDATE': ['date-and-time-functions', 'function_curdate'],
  'CURRENT_DATE': ['date-and-time-functions', 'function_current_date'],
  'CURRENT_TIME': ['date-and-time-functions', 'function_current_time'],
  'CURRENT_TIMESTAMP': ['date-and-time-functions', 'function_current_timestamp'],
  'CURRENT_USER': ['information-functions', 'function_current_user'],
  'CURTIME': ['date-and-time-functions', 'function_curtime'],
  'DATABASE': ['information-functions', 'function_database'],
  'DATE_ADD': ['date-and-time-functions', 'function_date_add'],
  'DATE_FORMAT': ['date-and-time-functions', 'function_date_format'],
  'DATE_SUB': ['date-and-time-functions', 'function_date_sub'],
  'DATE': ['date-and-time-functions', 'function_date'],
  'DATEDIFF': ['date-and-time-functions', 'function_datediff'],
  'DAY': ['date-and-time-functions', 'function_day'],
  'DAYNAME': ['date-and-time-functions', 'function_dayname'],
  'DAYOFMONTH': ['date-and-time-functions', 'function_dayofmonth'],
  'DAYOFWEEK': ['date-and-time-functions', 'function_dayofweek'],
  'DAYOFYEAR': ['date-and-time-functions', 'function_dayofyear'],
  'DECLARE': ['declare', 'declare'],
  'DECODE': ['encryption-functions', 'function_decode'],
  'DEFAULT': ['miscellaneous-functions', 'function_default'],
  'DEGREES': ['mathematical-functions', 'function_degrees'],
  'DES_DECRYPT': ['encryption-functions', 'function_des_decrypt'],
  'DES_ENCRYPT': ['encryption-functions', 'function_des_encrypt'],
  'DIV': ['arithmetic-functions', 'operator_div'],
  'ELT': ['string-functions', 'function_elt'],
  'ENCODE': ['encryption-functions', 'function_encode'],
  'ENCRYPT': ['encryption-functions', 'function_encrypt'],
  'EXP': ['mathematical-functions', 'function_exp'],
  'EXPORT_SET': ['string-functions', 'function_export_set'],
  'EXTRACT': ['date-and-time-functions', 'function_extract'],
  'ExtractValue': ['xml-functions', 'function_extractvalue'],
  'FIELD': ['string-functions', 'function_field'],
  'FIND_IN_SET': ['string-functions', 'function_find_in_set'],
  'FLOOR': ['mathematical-functions', 'function_floor'],
  'FORMAT': ['string-functions', 'function_format'],
  'FOUND_ROWS': ['information-functions', 'function_found_rows'],
  'FROM_DAYS': ['date-and-time-functions', 'function_from_days'],
  'FROM_UNIXTIME': ['date-and-time-functions', 'function_from_unixtime'],
  'GET_FORMAT': ['date-and-time-functions', 'function_get_format'],
  'GET_LOCK': ['miscellaneous-functions', 'function_get_lock'],
  'GREATEST': ['comparison-operators', 'function_greatest'],
  'GROUP_CONCAT': ['aggregate-functions', 'function_group_concat'],
  'HEX': ['string-functions', 'function_hex'],
  'HOUR': ['date-and-time-functions', 'function_hour'],
  'IF': ['control-flow-functions', 'function_if'],
  'IFNULL': ['control-flow-functions', 'function_ifnull'],
  'IN': ['comparison-operators', 'function_in'],
  'INET_ATON': ['miscellaneous-functions', 'function_inet_aton'],
  'INET_NTOA': ['miscellaneous-functions', 'function_inet_ntoa'],
  'INSTR': ['string-functions', 'function_instr'],
  'INTERVAL': ['comparison-operators', 'function_interval'],
  'IS_FREE_LOCK': ['miscellaneous-functions', 'function_is_free_lock'],
  'IS_USED_LOCK': ['miscellaneous-functions', 'function_is_used_lock'],
  'IS': ['comparison-operators', 'operator_is'],
  'ISNULL': ['comparison-operators', 'function_isnull'],
  'LAST_DAY': ['date-and-time-functions', 'function_last_day'],
  'LAST_INSERT_ID': ['information-functions', 'function_last_insert_id'],
  'LCASE': ['string-functions', 'function_lcase'],
  'LEAST': ['comparison-operators', 'function_least'],
  'LEFT': ['string-functions', 'function_left'],
  'LENGTH': ['string-functions', 'function_length'],
  'LIKE': ['string-comparison-functions', 'operator_like'],
  'LN': ['mathematical-functions', 'function_ln'],
  'LOAD_FILE': ['string-functions', 'function_load_file'],
  'LOCALTIME': ['date-and-time-functions', 'function_localtime'],
  'LOCALTIMESTAMP': ['date-and-time-functions', 'function_localtimestamp'],
  'LOCATE': ['string-functions', 'function_locate'],
  'LOG10': ['mathematical-functions', 'function_log10'],
  'LOG2': ['mathematical-functions', 'function_log2'],
  'LOG': ['mathematical-functions', 'function_log'],
  'LOWER': ['string-functions', 'function_lower'],
  'LPAD': ['string-functions', 'function_lpad'],
  'LTRIM': ['string-functions', 'function_ltrim'],
  'MAKE_SET': ['string-functions', 'function_make_set'],
  'MAKEDATE': ['date-and-time-functions', 'function_makedate'],
  'MAKETIME': ['date-and-time-functions', 'function_maketime'],
  'MASTER_POS_WAIT': ['miscellaneous-functions', 'function_master_pos_wait'],
  'MATCH': ['fulltext-search', 'function_match'],
  'MAX': ['aggregate-functions', 'function_max'],
  'MD5': ['encryption-functions', 'function_md5'],
  'MICROSECOND': ['date-and-time-functions', 'function_microsecond'],
  'MID': ['string-functions', 'function_mid'],
  'MIN': ['aggregate-functions', 'function_min'],
  'MINUTE': ['date-and-time-functions', 'function_minute'],
  'MOD': ['mathematical-functions', 'function_mod'],
  'MONTH': ['date-and-time-functions', 'function_month'],
  'MONTHNAME': ['date-and-time-functions', 'function_monthname'],
  'NAME_CONST': ['miscellaneous-functions', 'function_name_const'],
  'NOT': ['logical-operators', 'operator_not'],
  'NOW': ['date-and-time-functions', 'function_now'],
  'NULLIF': ['control-flow-functions', 'function_nullif'],
  'OCT': ['mathematical-functions', 'function_oct'],
  'OCTET_LENGTH': ['string-functions', 'function_octet_length'],
  'OLD_PASSWORD': ['encryption-functions', 'function_old_password'],
  'OR': ['logical-operators', 'operator_or'],
  'ORD': ['string-functions', 'function_ord'],
  'PASSWORD': ['encryption-functions', 'function_password'],
  'PERIOD_ADD': ['date-and-time-functions', 'function_period_add'],
  'PERIOD_DIFF': ['date-and-time-functions', 'function_period_diff'],
  'PI': ['mathematical-functions', 'function_pi'],
  'POSITION': ['string-functions', 'function_position'],
  'POW': ['mathematical-functions', 'function_pow'],
  'POWER': ['mathematical-functions', 'function_power'],
  'QUARTER': ['date-and-time-functions', 'function_quarter'],
  'QUOTE': ['string-functions', 'function_quote'],
  'RADIANS': ['mathematical-functions', 'function_radians'],
  'RAND': ['mathematical-functions', 'function_rand'],
  'REGEXP': ['regexp', 'operator_regexp'],
  'RELEASE_LOCK': ['miscellaneous-functions', 'function_release_lock'],
  'REPEAT': ['string-functions', 'function_repeat'],
  'REVERSE': ['string-functions', 'function_reverse'],
  'RIGHT': ['string-functions', 'function_right'],
  'RLIKE': ['regexp', 'operator_rlike'],
  'ROUND': ['mathematical-functions', 'function_round'],
  'ROW_COUNT': ['information-functions', 'function_row_count'],
  'RPAD': ['string-functions', 'function_rpad'],
  'RTRIM': ['string-functions', 'function_rtrim'],
  'SCHEMA': ['information-functions', 'function_schema'],
  'SEC_TO_TIME': ['date-and-time-functions', 'function_sec_to_time'],
  'SECOND': ['date-and-time-functions', 'function_second'],
  'SESSION_USER': ['information-functions', 'function_session_user'],
  'SHA': ['encryption-functions', 'function_sha1'],
  'SHA1': ['encryption-functions', 'function_sha1'],
  'SIGN': ['mathematical-functions', 'function_sign'],
  'SIN': ['mathematical-functions', 'function_sin'],
  'SLEEP': ['miscellaneous-functions', 'function_sleep'],
  'SOUNDEX': ['string-functions', 'function_soundex'],
  'SPACE': ['string-functions', 'function_space'],
  'SQRT': ['mathematical-functions', 'function_sqrt'],
  'STD': ['aggregate-functions', 'function_std'],
  'STDDEV_POP': ['aggregate-functions', 'function_stddev_pop'],
  'STDDEV_SAMP': ['aggregate-functions', 'function_stddev_samp'],
  'STDDEV': ['aggregate-functions', 'function_stddev'],
  'STR_TO_DATE': ['date-and-time-functions', 'function_str_to_date'],
  'STRCMP': ['string-comparison-functions', 'function_strcmp'],
  'SUBDATE': ['date-and-time-functions', 'function_subdate'],
  'SUBSTR': ['string-functions', 'function_substr'],
  'SUBSTRING_INDEX': ['string-functions', 'function_substring_index'],
  'SUBSTRING': ['string-functions', 'function_substring'],
  'SUBTIME': ['date-and-time-functions', 'function_subtime'],
  'SUM': ['aggregate-functions', 'function_sum'],
  'SYSDATE': ['date-and-time-functions', 'function_sysdate'],
  'SYSTEM_USER': ['information-functions', 'function_system_user'],
  'TAN': ['mathematical-functions', 'function_tan'],
  'TIME_FORMAT': ['date-and-time-functions', 'function_time_format'],
  'TIME_TO_SEC': ['date-and-time-functions', 'function_time_to_sec'],
  'TIME': ['date-and-time-functions', 'function_time'],
  'TIMEDIFF': ['date-and-time-functions', 'function_timediff'],
  'TIMESTAMP': ['date-and-time-functions', 'function_timestamp'],
  'TIMESTAMPADD': ['date-and-time-functions', 'function_timestampadd'],
  'TIMESTAMPDIFF': ['date-and-time-functions', 'function_timestampdiff'],
  'TO_DAYS': ['date-and-time-functions', 'function_to_days'],
  'TRIM': ['string-functions', 'function_trim'],
  'TRUNCATE': ['mathematical-functions', 'function_truncate'],
  'UCASE': ['string-functions', 'function_ucase'],
  'UNCOMPRESS': ['encryption-functions', 'function_uncompress'],
  'UNCOMPRESSED_LENGTH': ['encryption-functions', 'function_uncompressed_length'],
  'UNHEX': ['string-functions', 'function_unhex'],
  'UNIX_TIMESTAMP': ['date-and-time-functions', 'function_unix_timestamp'],
  'UpdateXML': ['xml-functions', 'function_updatexml'],
  'UPPER': ['string-functions', 'function_upper'],
  'USER': ['information-functions', 'function_user'],
  'UTC_DATE': ['date-and-time-functions', 'function_utc_date'],
  'UTC_TIME': ['date-and-time-functions', 'function_utc_time'],
  'UTC_TIMESTAMP': ['date-and-time-functions', 'function_utc_timestamp'],
  'UUID_SHORT': ['miscellaneous-functions', 'function_uuid_short'],
  'UUID': ['miscellaneous-functions', 'function_uuid'],
  'VALUES': ['miscellaneous-functions', 'function_values'],
  'VAR_POP': ['aggregate-functions', 'function_var_pop'],
  'VAR_SAMP': ['aggregate-functions', 'function_var_samp'],
  'VARIANCE': ['aggregate-functions', 'function_variance'],
  'VERSION': ['information-functions', 'function_version'],
  'WEEK': ['date-and-time-functions', 'function_week'],
  'WEEKDAY': ['date-and-time-functions', 'function_weekday'],
  'WEEKOFYEAR': ['date-and-time-functions', 'function_weekofyear'],
  'XOR': ['logical-operators', 'operator_xor'],
  'YEAR': ['date-and-time-functions', 'function_year'],
  'YEARWEEK': ['date-and-time-functions', 'function_yearweek'],
  'SOUNDS_LIKE': ['string-functions', 'operator_sounds-like'],
  'IS_NOT_NULL': ['comparison-operators', 'operator_is-not-null'],
  'IS_NOT': ['comparison-operators', 'operator_is-not'],
  'IS_NULL': ['comparison-operators', 'operator_is-null'],
  'NOT_LIKE': ['string-comparison-functions', 'operator_not-like'],
  'NOT_REGEXP': ['regexp', 'operator_not-regexp'],
  'COUNT_DISTINCT': ['aggregate-functions', 'function_count-distinct'],
  'NOT_IN': ['comparison-operators', 'function_not-in']
};
const mysqlDocBuiltin = {
  'TINYINT': ['numeric-types'],
  'SMALLINT': ['numeric-types'],
  'MEDIUMINT': ['numeric-types'],
  'INT': ['numeric-types'],
  'BIGINT': ['numeric-types'],
  'DECIMAL': ['numeric-types'],
  'FLOAT': ['numeric-types'],
  'DOUBLE': ['numeric-types'],
  'REAL': ['numeric-types'],
  'BIT': ['numeric-types'],
  'BOOLEAN': ['numeric-types'],
  'SERIAL': ['numeric-types'],
  'DATE': ['date-and-time-types'],
  'DATETIME': ['date-and-time-types'],
  'TIMESTAMP': ['date-and-time-types'],
  'TIME': ['date-and-time-types'],
  'YEAR': ['date-and-time-types'],
  'CHAR': ['string-types'],
  'VARCHAR': ['string-types'],
  'TINYTEXT': ['string-types'],
  'TEXT': ['string-types'],
  'MEDIUMTEXT': ['string-types'],
  'LONGTEXT': ['string-types'],
  'BINARY': ['string-types'],
  'VARBINARY': ['string-types'],
  'TINYBLOB': ['string-types'],
  'MEDIUMBLOB': ['string-types'],
  'BLOB': ['string-types'],
  'LONGBLOB': ['string-types'],
  'ENUM': ['string-types'],
  'SET': ['string-types']
};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(33));
/******/ }
]);
//# sourceMappingURL=functions.js.map