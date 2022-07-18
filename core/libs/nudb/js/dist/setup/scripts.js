"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[58],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 64:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * Functions used in Setup configuration forms
 */
// show this window in top frame

if (top !== self) {
  window.top.location.href = location;
} // ------------------------------------------------------------------
// Messages
//


jquery__WEBPACK_IMPORTED_MODULE_0__(function () {
  if (window.location.protocol === 'https:') {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#no_https').remove();
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#no_https a').on('click', function () {
      var oldLocation = window.location;
      window.location.href = 'https:' + oldLocation.href.substring(oldLocation.protocol.length);
      return false;
    });
  }

  var hiddenMessages = jquery__WEBPACK_IMPORTED_MODULE_0__('.hiddenmessage');

  if (hiddenMessages.length > 0) {
    hiddenMessages.hide();
    var link = jquery__WEBPACK_IMPORTED_MODULE_0__('#show_hidden_messages');
    link.on('click', function (e) {
      e.preventDefault();
      hiddenMessages.show();
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).remove();
    });
    link.html(link.html().replace('#MSG_COUNT', hiddenMessages.length));
    link.show();
  }
}); // set document width

jquery__WEBPACK_IMPORTED_MODULE_0__(function () {
  var width = 0;
  jquery__WEBPACK_IMPORTED_MODULE_0__('ul.tabs li').each(function () {
    width += jquery__WEBPACK_IMPORTED_MODULE_0__(this).width() + 10;
  });
  var contentWidth = width;
  width += 250;
  jquery__WEBPACK_IMPORTED_MODULE_0__('body').css('min-width', width);
  jquery__WEBPACK_IMPORTED_MODULE_0__('.tabs_contents').css('min-width', contentWidth);
}); //
// END: Messages
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// Form validation and field operations
//

/**
 * Calls server-side validation procedures
 *
 * @param {Element} parent  input field in <fieldset> or <fieldset>
 * @param {String}  id      validator id
 * @param {object}  values  values hash {element1_id: value, ...}
 *
 * @return {bool|void}
 */

function ajaxValidate(parent, id, values) {
  var $parent = jquery__WEBPACK_IMPORTED_MODULE_0__(parent); // ensure that parent is a fieldset

  if ($parent.attr('tagName') !== 'FIELDSET') {
    $parent = $parent.closest('fieldset');

    if ($parent.length === 0) {
      return false;
    }
  }

  if ($parent.data('ajax') !== null) {
    $parent.data('ajax').abort();
  }

  $parent.data('ajax', jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
    url: 'validate.php',
    cache: false,
    type: 'POST',
    data: {
      token: $parent.closest('form').find('input[name=token]').val(),
      id: id,
      values: JSON.stringify(values)
    },
    success: function (response) {
      if (response === null) {
        return;
      }

      var error = {};

      if (typeof response !== 'object') {
        error[$parent.id] = [response];
      } else if (typeof response.error !== 'undefined') {
        error[$parent.id] = [response.error];
      } else {
        for (var key in response) {
          var value = response[key];
          error[key] = Array.isArray(value) ? value : [value];
        }
      }

      window.Config.displayErrors(error);
    },
    complete: function () {
      $parent.removeData('ajax');
    }
  }));
  return true;
}
/**
 * Automatic form submission on change.
 */


jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '.autosubmit', function (e) {
  e.target.form.submit();
});
jquery__WEBPACK_IMPORTED_MODULE_0__.extend(true, window.validators, {
  // field validators
  field: {
    /**
     * hide_db field
     *
     * @param {boolean} isKeyUp
     *
     * @return {true}
     */
    hide_db: function (isKeyUp) {
      // eslint-disable-line camelcase
      if (!isKeyUp && this.value !== '') {
        var data = {};
        data[this.id] = this.value;
        ajaxValidate(this, 'Servers/1/hide_db', data);
      }

      return true;
    },

    /**
     * TrustedProxies field
     *
     * @param {boolean} isKeyUp
     *
     * @return {true}
     */
    TrustedProxies: function (isKeyUp) {
      if (!isKeyUp && this.value !== '') {
        var data = {};
        data[this.id] = this.value;
        ajaxValidate(this, 'TrustedProxies', data);
      }

      return true;
    }
  },
  // fieldset validators
  fieldset: {
    /**
     * Validates Server fieldset
     *
     * @param {boolean} isKeyUp
     *
     * @return {true}
     */
    Server: function (isKeyUp) {
      if (!isKeyUp) {
        ajaxValidate(this, 'Server', window.Config.getAllValues());
      }

      return true;
    },

    /**
     * Validates Server_login_options fieldset
     *
     * @param {boolean} isKeyUp
     *
     * @return {true}
     */
    Server_login_options: function (isKeyUp) {
      // eslint-disable-line camelcase
      return window.validators.fieldset.Server.apply(this, [isKeyUp]);
    },

    /**
     * Validates Server_pmadb fieldset
     *
     * @param {boolean} isKeyUp
     *
     * @return {true}
     */
    Server_pmadb: function (isKeyUp) {
      // eslint-disable-line camelcase
      if (isKeyUp) {
        return true;
      }

      var prefix = window.Config.getIdPrefix(jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('input'));

      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#' + prefix + 'pmadb').val() !== '') {
        ajaxValidate(this, 'Server_pmadb', window.Config.getAllValues());
      }

      return true;
    }
  }
}); //
// END: Form validation and field operations
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// User preferences allow/disallow UI
//

jquery__WEBPACK_IMPORTED_MODULE_0__(function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('.userprefs-allow').on('click', function (e) {
    if (this !== e.target) {
      return;
    }

    var el = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('input');

    if (el.prop('disabled')) {
      return;
    }

    el.prop('checked', !el.prop('checked'));
  });
}); //
// END: User preferences allow/disallow UI
// ------------------------------------------------------------------

jquery__WEBPACK_IMPORTED_MODULE_0__(function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('.delete-server').on('click', function (e) {
    e.preventDefault();
    var $this = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    jquery__WEBPACK_IMPORTED_MODULE_0__.post($this.attr('href'), $this.attr('data-post'), function () {
      window.location.replace('index.php');
    });
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(64));
/******/ }
]);
//# sourceMappingURL=scripts.js.map