"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[56],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 62:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * @fileoverview    Javascript functions used in server variables page
 * @name            Server Replication
 *
 * @requires    jQuery
 * @requires    jQueryUI
 * @requires    js/functions.js
 */

/**
 * Unbind all event handlers before tearing down a page
 */

window.AJAX.registerTeardown('server/variables.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('click', 'a.editLink');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#serverVariables').find('.var-name').find('a img').remove();
});
window.AJAX.registerOnload('server/variables.js', function () {
  var $saveLink = jquery__WEBPACK_IMPORTED_MODULE_0__('a.saveLink');
  var $cancelLink = jquery__WEBPACK_IMPORTED_MODULE_0__('a.cancelLink');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#serverVariables').find('.var-name').find('a').append(jquery__WEBPACK_IMPORTED_MODULE_0__('#docImage').clone().css('display', 'inline-block'));
  /* Launches the variable editor */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.editLink', function (event) {
    event.preventDefault();
    editVariable(this);
  });
  /* Allows the user to edit a server variable */

  function editVariable(link) {
    var $link = jquery__WEBPACK_IMPORTED_MODULE_0__(link);
    var $cell = $link.parent();
    var $valueCell = $link.parents('.var-row').find('.var-value');
    var varName = $link.data('variable');
    var $mySaveLink = $saveLink.clone().css('display', 'inline-block');
    var $myCancelLink = $cancelLink.clone().css('display', 'inline-block');
    var $msgbox = Functions.ajaxShowMessage();
    var $myEditLink = $cell.find('a.editLink');
    $cell.addClass('edit'); // variable is being edited

    $myEditLink.remove(); // remove edit link

    $mySaveLink.on('click', function () {
      var $msgbox = Functions.ajaxShowMessage(window.Messages.strProcessingRequest);
      jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/server/variables/set/' + encodeURIComponent(varName), {
        'ajax_request': true,
        'server': window.CommonParams.get('server'),
        'varValue': $valueCell.find('input').val()
      }, function (data) {
        if (data.success) {
          $valueCell.html(data.variable).data('content', data.variable);
          Functions.ajaxRemoveMessage($msgbox);
        } else {
          if (data.error === '') {
            Functions.ajaxShowMessage(window.Messages.strRequestFailed, false);
          } else {
            Functions.ajaxShowMessage(data.error, false);
          }

          $valueCell.html($valueCell.data('content'));
        }

        $cell.removeClass('edit').html($myEditLink);
      });
      return false;
    });
    $myCancelLink.on('click', function () {
      $valueCell.html($valueCell.data('content'));
      $cell.removeClass('edit').html($myEditLink);
      return false;
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__.get('index.php?route=/server/variables/get/' + encodeURIComponent(varName), {
      'ajax_request': true,
      'server': window.CommonParams.get('server')
    }, function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        var $links = jquery__WEBPACK_IMPORTED_MODULE_0__('<div></div>').append($myCancelLink).append('&nbsp;&nbsp;&nbsp;').append($mySaveLink);
        var $editor = jquery__WEBPACK_IMPORTED_MODULE_0__('<div></div>', {
          'class': 'serverVariableEditor'
        }).append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div></div>').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<input>', {
          type: 'text',
          'class': 'form-control form-control-sm'
        }).val(data.message))); // Save and replace content

        $cell.html($links).children().css('display', 'flex');
        $valueCell.data('content', $valueCell.html()).html($editor).find('input').trigger('focus').on('keydown', function (event) {
          // Keyboard shortcuts
          if (event.keyCode === 13) {
            // Enter key
            $mySaveLink.trigger('click');
          } else if (event.keyCode === 27) {
            // Escape key
            $myCancelLink.trigger('click');
          }
        });
        Functions.ajaxRemoveMessage($msgbox);
      } else {
        $cell.removeClass('edit').html($myEditLink);
        Functions.ajaxShowMessage(data.error);
      }
    });
  }
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(62));
/******/ }
]);
//# sourceMappingURL=variables.js.map