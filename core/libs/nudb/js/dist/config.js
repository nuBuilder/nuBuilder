"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[4],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 5:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * Functions used in configuration forms and on user preferences pages
 */

window.Config = {};
window.configInlineParams;
window.configScriptLoaded;
/**
 * checks whether browser supports web storage
 *
 * @param {'localStorage' | 'sessionStorage'} type the type of storage i.e. localStorage or sessionStorage
 * @param {boolean} warn Wether to show a warning on error
 *
 * @return {boolean}
 */

window.Config.isStorageSupported = function (type) {
  let warn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  try {
    window[type].setItem('PMATest', 'test'); // Check whether key-value pair was set successfully

    if (window[type].getItem('PMATest') === 'test') {
      // Supported, remove test variable from storage
      window[type].removeItem('PMATest');
      return true;
    }
  } catch (error) {
    // Not supported
    if (warn) {
      Functions.ajaxShowMessage(window.Messages.strNoLocalStorage, false);
    }
  }

  return false;
}; // default values for fields


window.defaultValues = {};
/**
 * Returns field type
 *
 * @param {Element} field
 *
 * @return {string}
 */

function getFieldType(field) {
  var $field = jquery__WEBPACK_IMPORTED_MODULE_0__(field);
  var tagName = $field.prop('tagName');

  if (tagName === 'INPUT') {
    return $field.attr('type');
  } else if (tagName === 'SELECT') {
    return 'select';
  } else if (tagName === 'TEXTAREA') {
    return 'text';
  }

  return '';
}
/**
 * Enables or disables the "restore default value" button
 *
 * @param {Element} field
 * @param {boolean} display
 *
 * @return {void}
 */


function setRestoreDefaultBtn(field, display) {
  var $el = jquery__WEBPACK_IMPORTED_MODULE_0__(field).closest('td').find('.restore-default img');
  $el[display ? 'show' : 'hide']();
}
/**
 * Marks field depending on its value (system default or custom)
 *
 * @param {Element | JQuery<Element>} field
 *
 * @return {void}
 */


function markField(field) {
  var $field = jquery__WEBPACK_IMPORTED_MODULE_0__(field);
  var type = getFieldType($field);
  var isDefault = checkFieldDefault($field, type); // checkboxes uses parent <span> for marking

  var $fieldMarker = type === 'checkbox' ? $field.parent() : $field;
  setRestoreDefaultBtn($field, !isDefault);
  $fieldMarker[isDefault ? 'removeClass' : 'addClass']('custom');
}
/**
 * Sets field value
 *
 * value must be of type:
 * o undefined (omitted) - restore default value (form default, not PMA default)
 * o String - if field_type is 'text'
 * o boolean - if field_type is 'checkbox'
 * o Array of values - if field_type is 'select'
 *
 * @param {Element} field
 * @param {string}  fieldType see {@link #getFieldType}
 * @param {string | boolean}  value
 */


function setFieldValue(field, fieldType, value) {
  var $field = jquery__WEBPACK_IMPORTED_MODULE_0__(field);

  switch (fieldType) {
    case 'text':
    case 'number':
      $field.val(value);
      break;

    case 'checkbox':
      $field.prop('checked', value);
      break;

    case 'select':
      var options = $field.prop('options');
      var i;
      var imax = options.length;

      for (i = 0; i < imax; i++) {
        options[i].selected = value.indexOf(options[i].value) !== -1;
      }

      break;
  }

  markField($field);
}
/**
 * Gets field value
 *
 * Will return one of:
 * o String - if type is 'text'
 * o boolean - if type is 'checkbox'
 * o Array of values - if type is 'select'
 *
 * @param {Element} field
 * @param {string}  fieldType returned by {@link #getFieldType}
 *
 * @return {boolean | string | string[] | null}
 */


function getFieldValue(field, fieldType) {
  var $field = jquery__WEBPACK_IMPORTED_MODULE_0__(field);

  switch (fieldType) {
    case 'text':
    case 'number':
      return $field.prop('value');

    case 'checkbox':
      return $field.prop('checked');

    case 'select':
      var options = $field.prop('options');
      var i;
      var imax = options.length;
      var items = [];

      for (i = 0; i < imax; i++) {
        if (options[i].selected) {
          items.push(options[i].value);
        }
      }

      return items;
  }

  return null;
}
/**
 * Returns values for all fields in fieldsets
 *
 * @return {object}
 */


window.Config.getAllValues = () => {
  var $elements = jquery__WEBPACK_IMPORTED_MODULE_0__('fieldset input, fieldset select, fieldset textarea');
  var values = {};
  var type;
  var value;

  for (var i = 0; i < $elements.length; i++) {
    type = getFieldType($elements[i]);
    value = getFieldValue($elements[i], type);

    if (typeof value !== 'undefined') {
      // we only have single selects, fatten array
      if (type === 'select') {
        value = value[0];
      }

      values[$elements[i].name] = value;
    }
  }

  return values;
};
/**
 * Checks whether field has its default value
 *
 * @param {Element} field
 * @param {string}  type
 *
 * @return {boolean}
 */


function checkFieldDefault(field, type) {
  var $field = jquery__WEBPACK_IMPORTED_MODULE_0__(field);
  var fieldId = $field.attr('id');

  if (typeof window.defaultValues[fieldId] === 'undefined') {
    return true;
  }

  var isDefault = true;
  var currentValue = getFieldValue($field, type);

  if (type !== 'select') {
    isDefault = currentValue === window.defaultValues[fieldId];
  } else {
    // compare arrays, will work for our representation of select values
    if (currentValue.length !== window.defaultValues[fieldId].length) {
      isDefault = false;
    } else {
      for (var i = 0; i < currentValue.length; i++) {
        if (currentValue[i] !== window.defaultValues[fieldId][i]) {
          isDefault = false;
          break;
        }
      }
    }
  }

  return isDefault;
}
/**
 * Returns element's id prefix
 * @param {Element} element
 *
 * @return {string}
 */


window.Config.getIdPrefix = function (element) {
  return jquery__WEBPACK_IMPORTED_MODULE_0__(element).attr('id').replace(/[^-]+$/, '');
}; // ------------------------------------------------------------------
// Form validation and field operations
//
// form validator assignments


let validate = {}; // form validator list

window.validators = {
  // regexp: numeric value
  regExpNumeric: /^[0-9]+$/,
  // regexp: extract parts from PCRE expression
  regExpPcreExtract: /(.)(.*)\1(.*)?/,

  /**
   * Validates positive number
   *
   * @param {boolean} isKeyUp
   *
   * @return {boolean}
   */
  validatePositiveNumber: function (isKeyUp) {
    if (isKeyUp && this.value === '') {
      return true;
    }

    var result = this.value !== '0' && window.validators.regExpNumeric.test(this.value);
    return result ? true : window.Messages.error_nan_p;
  },

  /**
   * Validates non-negative number
   *
   * @param {boolean} isKeyUp
   *
   * @return {boolean}
   */
  validateNonNegativeNumber: function (isKeyUp) {
    if (isKeyUp && this.value === '') {
      return true;
    }

    var result = window.validators.regExpNumeric.test(this.value);
    return result ? true : window.Messages.error_nan_nneg;
  },

  /**
   * Validates port number
   *
   * @return {true|string}
   */
  validatePortNumber: function () {
    if (this.value === '') {
      return true;
    }

    var result = window.validators.regExpNumeric.test(this.value) && this.value !== '0';
    return result && this.value <= 65535 ? true : window.Messages.error_incorrect_port;
  },

  /**
   * Validates value according to given regular expression
   *
   * @param {boolean} isKeyUp
   * @param {string}  regexp
   *
   * @return {true|string}
   */
  validateByRegex: function (isKeyUp, regexp) {
    if (isKeyUp && this.value === '') {
      return true;
    } // convert PCRE regexp


    var parts = regexp.match(window.validators.regExpPcreExtract);
    var valid = this.value.match(new RegExp(parts[2], parts[3])) !== null;
    return valid ? true : window.Messages.error_invalid_value;
  },

  /**
   * Validates upper bound for numeric inputs
   *
   * @param {boolean} isKeyUp
   * @param {number} maxValue
   *
   * @return {true|string}
   */
  validateUpperBound: function (isKeyUp, maxValue) {
    var val = parseInt(this.value, 10);

    if (isNaN(val)) {
      return true;
    }

    return val <= maxValue ? true : Functions.sprintf(window.Messages.error_value_lte, maxValue);
  },
  // field validators
  field: {},
  // fieldset validators
  fieldset: {}
};
/**
 * Registers validator for given field
 *
 * @param {string}  id       field id
 * @param {string}  type     validator (key in validators object)
 * @param {boolean} onKeyUp  whether fire on key up
 * @param {Array}   params   validation function parameters
 */

window.Config.registerFieldValidator = (id, type, onKeyUp, params) => {
  if (typeof window.validators[type] === 'undefined') {
    return;
  }

  if (typeof validate[id] === 'undefined') {
    validate[id] = [];
  }

  if (validate[id].length === 0) {
    validate[id].push([type, params, onKeyUp]);
  }
};
/**
 * Returns validation functions associated with form field
 *
 * @param {String}  fieldId     form field id
 * @param {boolean} onKeyUpOnly see registerFieldValidator
 *
 * @return {any[]} of [function, parameters to be passed to function]
 */


function getFieldValidators(fieldId, onKeyUpOnly) {
  // look for field bound validator
  var name = fieldId && fieldId.match(/[^-]+$/)[0];

  if (typeof window.validators.field[name] !== 'undefined') {
    return [[window.validators.field[name], null]];
  } // look for registered validators


  var functions = [];

  if (typeof validate[fieldId] !== 'undefined') {
    // validate[field_id]: array of [type, params, onKeyUp]
    for (var i = 0, imax = validate[fieldId].length; i < imax; i++) {
      if (onKeyUpOnly && !validate[fieldId][i][2]) {
        continue;
      }

      functions.push([window.validators[validate[fieldId][i][0]], validate[fieldId][i][1]]);
    }
  }

  return functions;
}
/**
 * Displays errors for given form fields
 *
 * WARNING: created DOM elements must be identical with the ones made by
 * PhpMyAdmin\Config\FormDisplayTemplate::displayInput()!
 *
 * @param {object} errorList list of errors in the form {field id: error array}
 */


window.Config.displayErrors = function (errorList) {
  var tempIsEmpty = function (item) {
    return item !== '';
  };

  for (var fieldId in errorList) {
    var errors = errorList[fieldId];
    var $field = jquery__WEBPACK_IMPORTED_MODULE_0__('#' + fieldId);
    var isFieldset = $field.attr('tagName') === 'FIELDSET';
    var $errorCnt;

    if (isFieldset) {
      $errorCnt = $field.find('dl.errors');
    } else {
      $errorCnt = $field.siblings('.inline_errors');
    } // remove empty errors (used to clear error list)


    errors = jquery__WEBPACK_IMPORTED_MODULE_0__.grep(errors, tempIsEmpty); // CSS error class

    if (!isFieldset) {
      // checkboxes uses parent <span> for marking
      var $fieldMarker = $field.attr('type') === 'checkbox' ? $field.parent() : $field;
      $fieldMarker[errors.length ? 'addClass' : 'removeClass']('field-error');
    }

    if (errors.length) {
      // if error container doesn't exist, create it
      if ($errorCnt.length === 0) {
        if (isFieldset) {
          $errorCnt = jquery__WEBPACK_IMPORTED_MODULE_0__('<dl class="errors"></dl>');
          $field.find('table').before($errorCnt);
        } else {
          $errorCnt = jquery__WEBPACK_IMPORTED_MODULE_0__('<dl class="inline_errors"></dl>');
          $field.closest('td').append($errorCnt);
        }
      }

      var html = '';

      for (var i = 0, imax = errors.length; i < imax; i++) {
        html += '<dd>' + errors[i] + '</dd>';
      }

      $errorCnt.html(html);
    } else if ($errorCnt !== null) {
      // remove useless error container
      $errorCnt.remove();
    }
  }
};
/**
 * Validates fields and fieldsets and call displayError function as required
 */


function setDisplayError() {
  var elements = jquery__WEBPACK_IMPORTED_MODULE_0__('.optbox input[id], .optbox select[id], .optbox textarea[id]'); // run all field validators

  var errors = {};

  for (var i = 0; i < elements.length; i++) {
    validateField(elements[i], false, errors);
  } // run all fieldset validators


  jquery__WEBPACK_IMPORTED_MODULE_0__('fieldset.optbox').each(function () {
    validateFieldset(this, false, errors);
  });
  window.Config.displayErrors(errors);
}
/**
 * Validates fieldset and puts errors in 'errors' object
 *
 * @param {Element} fieldset
 * @param {boolean} isKeyUp
 * @param {object}  errors
 */


function validateFieldset(fieldset, isKeyUp, errors) {
  var $fieldset = jquery__WEBPACK_IMPORTED_MODULE_0__(fieldset);

  if ($fieldset.length && typeof window.validators.fieldset[$fieldset.attr('id')] !== 'undefined') {
    var fieldsetErrors = window.validators.fieldset[$fieldset.attr('id')].apply($fieldset[0], [isKeyUp]);

    for (var fieldId in fieldsetErrors) {
      if (typeof errors[fieldId] === 'undefined') {
        errors[fieldId] = [];
      }

      if (typeof fieldsetErrors[fieldId] === 'string') {
        fieldsetErrors[fieldId] = [fieldsetErrors[fieldId]];
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__.merge(errors[fieldId], fieldsetErrors[fieldId]);
    }
  }
}
/**
 * Validates form field and puts errors in 'errors' object
 *
 * @param {Element} field
 * @param {boolean} isKeyUp
 * @param {object}  errors
 */


function validateField(field, isKeyUp, errors) {
  var args;
  var result;
  var $field = jquery__WEBPACK_IMPORTED_MODULE_0__(field);
  var fieldId = $field.attr('id');
  errors[fieldId] = [];
  var functions = getFieldValidators(fieldId, isKeyUp);

  for (var i = 0; i < functions.length; i++) {
    if (typeof functions[i][1] !== 'undefined' && functions[i][1] !== null) {
      args = functions[i][1].slice(0);
    } else {
      args = [];
    }

    args.unshift(isKeyUp);
    result = functions[i][0].apply($field[0], args);

    if (result !== true) {
      if (typeof result === 'string') {
        result = [result];
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__.merge(errors[fieldId], result);
    }
  }
}
/**
 * Validates form field and parent fieldset
 *
 * @param {Element} field
 * @param {boolean} isKeyUp
 */


function validateFieldAndFieldset(field, isKeyUp) {
  var $field = jquery__WEBPACK_IMPORTED_MODULE_0__(field);
  var errors = {};
  validateField($field, isKeyUp, errors);
  validateFieldset($field.closest('fieldset.optbox'), isKeyUp, errors);
  window.Config.displayErrors(errors);
}

window.Config.loadInlineConfig = () => {
  if (!Array.isArray(window.configInlineParams)) {
    return;
  }

  for (var i = 0; i < window.configInlineParams.length; ++i) {
    if (typeof window.configInlineParams[i] === 'function') {
      window.configInlineParams[i]();
    }
  }
};

window.Config.setupValidation = function () {
  validate = {};
  window.configScriptLoaded = true;

  if (window.configScriptLoaded && typeof window.configInlineParams !== 'undefined') {
    window.Config.loadInlineConfig();
  } // register validators and mark custom values


  var $elements = jquery__WEBPACK_IMPORTED_MODULE_0__('.optbox input[id], .optbox select[id], .optbox textarea[id]');
  $elements.each(function () {
    markField(this);
    var $el = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    $el.on('change', function () {
      validateFieldAndFieldset(this, false);
      markField(this);
    });
    var tagName = $el.attr('tagName'); // text fields can be validated after each change

    if (tagName === 'INPUT' && $el.attr('type') === 'text') {
      $el.on('keyup', function () {
        validateFieldAndFieldset($el, true);
        markField($el);
      });
    } // disable textarea spellcheck


    if (tagName === 'TEXTAREA') {
      $el.attr('spellcheck', false);
    }
  }); // check whether we've refreshed a page and browser remembered modified
  // form values

  var $checkPageRefresh = jquery__WEBPACK_IMPORTED_MODULE_0__('#check_page_refresh');

  if ($checkPageRefresh.length === 0 || $checkPageRefresh.val() === '1') {
    // run all field validators
    var errors = {};

    for (var i = 0; i < $elements.length; i++) {
      validateField($elements[i], false, errors);
    } // run all fieldset validators


    jquery__WEBPACK_IMPORTED_MODULE_0__('fieldset.optbox').each(function () {
      validateFieldset(this, false, errors);
    });
    window.Config.displayErrors(errors);
  } else if ($checkPageRefresh) {
    $checkPageRefresh.val('1');
  }
}; //
// END: Form validation and field operations
// ------------------------------------------------------------------


function adjustPrefsNotification() {
  var $prefsAutoLoad = jquery__WEBPACK_IMPORTED_MODULE_0__('#prefs_autoload');
  var $tableNameControl = jquery__WEBPACK_IMPORTED_MODULE_0__('#table_name_col_no');
  var $prefsAutoShowing = $prefsAutoLoad.css('display') !== 'none';

  if ($prefsAutoShowing && $tableNameControl.length) {
    $tableNameControl.css('top', '55px');
  }
} // ------------------------------------------------------------------
// "Restore default" and "set value" buttons
//

/**
 * Restores field's default value
 *
 * @param {string} fieldId
 *
 * @return {void}
 */


function restoreField(fieldId) {
  var $field = jquery__WEBPACK_IMPORTED_MODULE_0__('#' + fieldId);

  if ($field.length === 0 || window.defaultValues[fieldId] === undefined) {
    return;
  }

  setFieldValue($field, getFieldType($field), window.defaultValues[fieldId]);
}

window.Config.setupRestoreField = function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('div.tab-content').on('mouseenter', '.restore-default, .set-value', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).css('opacity', 1);
  }).on('mouseleave', '.restore-default, .set-value', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).css('opacity', 0.25);
  }).on('click', '.restore-default, .set-value', function (e) {
    e.preventDefault();
    var href = jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href');
    var fieldSel;

    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).hasClass('restore-default')) {
      fieldSel = href;
      restoreField(fieldSel.substring(1));
    } else {
      fieldSel = href.match(/^[^=]+/)[0];
      var value = href.match(/=(.+)$/)[1];
      setFieldValue(jquery__WEBPACK_IMPORTED_MODULE_0__(fieldSel), 'text', value);
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__(fieldSel).trigger('change');
  }).find('.restore-default, .set-value') // inline-block for IE so opacity inheritance works
  .css({
    display: 'inline-block',
    opacity: 0.25
  });
}; //
// END: "Restore default" and "set value" buttons
// ------------------------------------------------------------------

/**
 * Saves user preferences to localStorage
 *
 * @param {Element} form
 */


function savePrefsToLocalStorage(form) {
  var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(form);
  var submit = $form.find('input[type=submit]');
  submit.prop('disabled', true);
  jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
    url: 'index.php?route=/preferences/manage',
    cache: false,
    type: 'POST',
    data: {
      'ajax_request': true,
      'server': window.CommonParams.get('server'),
      'submit_get_json': true
    },
    success: function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        window.localStorage.config = data.prefs;
        window.localStorage.configMtime = data.mtime;
        window.localStorage.configMtimeLocal = new Date().toUTCString();
        updatePrefsDate();
        jquery__WEBPACK_IMPORTED_MODULE_0__('div.localStorage-empty').hide();
        jquery__WEBPACK_IMPORTED_MODULE_0__('div.localStorage-exists').show();
        var group = $form.parent('.card-body');
        group.css('height', group.height() + 'px');
        $form.hide('fast');
        $form.prev('.click-hide-message').show('fast');
      } else {
        Functions.ajaxShowMessage(data.error);
      }
    },
    complete: function () {
      submit.prop('disabled', false);
    }
  });
}
/**
 * Updates preferences timestamp in Import form
 */


function updatePrefsDate() {
  var d = new Date(window.localStorage.configMtimeLocal);
  var msg = window.Messages.strSavedOn.replace('@DATE@', Functions.formatDateTime(d));
  jquery__WEBPACK_IMPORTED_MODULE_0__('#opts_import_local_storage').find('div.localStorage-exists').html(msg);
}
/**
 * Prepares message which informs that localStorage preferences are available and can be imported or deleted
 */


function offerPrefsAutoimport() {
  var hasConfig = window.Config.isStorageSupported('localStorage') && (window.localStorage.config || false);
  var $cnt = jquery__WEBPACK_IMPORTED_MODULE_0__('#prefs_autoload');

  if (!$cnt.length || !hasConfig) {
    return;
  }

  $cnt.find('a').on('click', function (e) {
    e.preventDefault();
    var $a = jquery__WEBPACK_IMPORTED_MODULE_0__(this);

    if ($a.attr('href') === '#no') {
      $cnt.remove();
      jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php', {
        'server': window.CommonParams.get('server'),
        'prefs_autoload': 'hide'
      }, null, 'html');
      return;
    } else if ($a.attr('href') === '#delete') {
      $cnt.remove();
      localStorage.clear();
      jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php', {
        'server': window.CommonParams.get('server'),
        'prefs_autoload': 'hide'
      }, null, 'html');
      return;
    }

    $cnt.find('input[name=json]').val(window.localStorage.config);
    $cnt.find('form').trigger('submit');
  });
  $cnt.show();
}
/**
 * @return {function}
 */


window.Config.off = function () {
  return function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('.optbox input[id], .optbox select[id], .optbox textarea[id]').off('change').off('keyup');
    jquery__WEBPACK_IMPORTED_MODULE_0__('.optbox input[type=button][name=submit_reset]').off('click');
    jquery__WEBPACK_IMPORTED_MODULE_0__('div.tab-content').off();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#import_local_storage, #export_local_storage').off('click');
    jquery__WEBPACK_IMPORTED_MODULE_0__('form.prefs-form').off('change').off('submit');
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'div.click-hide-message');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#prefs_autoload').find('a').off('click');
  };
};
/**
 * @return {function}
 */


window.Config.on = function () {
  return function () {
    var $topmenuUpt = jquery__WEBPACK_IMPORTED_MODULE_0__('#user_prefs_tabs');
    $topmenuUpt.find('a.active').attr('rel', 'samepage');
    $topmenuUpt.find('a:not(.active)').attr('rel', 'newpage');
    window.Config.setupValidation();
    adjustPrefsNotification();
    jquery__WEBPACK_IMPORTED_MODULE_0__('.optbox input[type=button][name=submit_reset]').on('click', function () {
      var fields = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('fieldset').find('input, select, textarea');

      for (var i = 0, imax = fields.length; i < imax; i++) {
        setFieldValue(fields[i], getFieldType(fields[i]), window.defaultValues[fields[i].id]);
      }

      setDisplayError();
    });
    window.Config.setupRestoreField();
    offerPrefsAutoimport();
    var $radios = jquery__WEBPACK_IMPORTED_MODULE_0__('#import_local_storage, #export_local_storage');

    if (!$radios.length) {
      return;
    } // enable JavaScript dependent fields


    $radios.prop('disabled', false).add('#export_text_file, #import_text_file').on('click', function () {
      var enableId = jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('id');
      var disableId;

      if (enableId.match(/local_storage$/)) {
        disableId = enableId.replace(/local_storage$/, 'text_file');
      } else {
        disableId = enableId.replace(/text_file$/, 'local_storage');
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__('#opts_' + disableId).addClass('disabled').find('input').prop('disabled', true);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#opts_' + enableId).removeClass('disabled').find('input').prop('disabled', false);
    }); // detect localStorage state

    var lsSupported = window.Config.isStorageSupported('localStorage', true);
    var lsExists = lsSupported ? window.localStorage.config || false : false;
    jquery__WEBPACK_IMPORTED_MODULE_0__('div.localStorage-' + (lsSupported ? 'un' : '') + 'supported').hide();
    jquery__WEBPACK_IMPORTED_MODULE_0__('div.localStorage-' + (lsExists ? 'empty' : 'exists')).hide();

    if (lsExists) {
      updatePrefsDate();
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('form.prefs-form').on('change', function () {
      var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
      var disabled = false;

      if (!lsSupported) {
        disabled = $form.find('input[type=radio][value$=local_storage]').prop('checked');
      } else if (!lsExists && $form.attr('name') === 'prefs_import' && jquery__WEBPACK_IMPORTED_MODULE_0__('#import_local_storage')[0].checked) {
        disabled = true;
      }

      $form.find('input[type=submit]').prop('disabled', disabled);
    }).on('submit', function (e) {
      var $form = jquery__WEBPACK_IMPORTED_MODULE_0__(this);

      if ($form.attr('name') === 'prefs_export' && jquery__WEBPACK_IMPORTED_MODULE_0__('#export_local_storage')[0].checked) {
        e.preventDefault(); // use AJAX to read JSON settings and save them

        savePrefsToLocalStorage($form);
      } else if ($form.attr('name') === 'prefs_import' && jquery__WEBPACK_IMPORTED_MODULE_0__('#import_local_storage')[0].checked) {
        // set 'json' input and submit form
        $form.find('input[name=json]').val(window.localStorage.config);
      }
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'div.click-hide-message', function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).hide().parent('.card-body').css('height', '').next('form').show();
    });
  };
};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(5));
/******/ }
]);
//# sourceMappingURL=config.js.map