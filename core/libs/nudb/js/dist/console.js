"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[5],[
/* 0 */,
/* 1 */
/***/ (function(module) {

module.exports = jQuery;

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Console": function() { return /* reexport safe */ _modules_console_js__WEBPACK_IMPORTED_MODULE_1__.Console; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _modules_console_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);


jquery__WEBPACK_IMPORTED_MODULE_0__(function () {
  _modules_console_js__WEBPACK_IMPORTED_MODULE_1__.Console.initialize();
});


/***/ }),
/* 7 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Console": function() { return /* binding */ Console; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var codemirror__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _console_config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);



/* global Functions, Navigation */

/**
 * Console object
 */

var Console = {
  /**
   * @var {JQuery}, jQuery object, selector is '#pma_console>.content'
   * @access private
   */
  $consoleContent: null,

  /**
   * @var {Jquery}, jQuery object, selector is '#pma_console .content',
   *  used for resizer
   * @access private
   */
  $consoleAllContents: null,

  /**
   * @var {JQuery}, jQuery object, selector is '#pma_console .toolbar'
   * @access private
   */
  $consoleToolbar: null,

  /**
   * @var {JQuery}, jQuery object, selector is '#pma_console .template'
   * @access private
   */
  $consoleTemplates: null,

  /**
   * @var {JQuery}, jQuery object, form for submit
   * @access private
   */
  $requestForm: null,

  /**
   * @var {boolean}, if console element exist, it'll be true
   * @access public
   */
  isEnabled: false,

  /**
   * @var {boolean}, make sure console events bind only once
   * @access private
   */
  isInitialized: false,

  /**
   * @type {Object|string|null}
   */
  debugSqlInfo: null,

  /**
   * Used for console initialize, reinit is ok, just some variable assignment
   *
   * @return {void}
   */
  initialize: function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').length === 0) {
      return;
    }

    Functions.configGet('Console', false, data => {
      _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.init(data);
      Console.setupAfterInit();
    }, () => {
      _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.init({}); // Avoid null pointers in setupAfterInit()
      // Fetching data failed, still perform the console init

      Console.setupAfterInit();
    });
  },

  /**
   * Setup the console after the config has been set at initialize stage
   */
  setupAfterInit: function () {
    Console.isEnabled = true; // Vars init

    Console.$consoleToolbar = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('>.toolbar');
    Console.$consoleContent = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('>.content');
    Console.$consoleAllContents = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.content');
    Console.$consoleTemplates = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('>.templates'); // Generate a form for post

    Console.$requestForm = jquery__WEBPACK_IMPORTED_MODULE_0__('<form method="post" action="index.php?route=/import">' + '<input name="is_js_confirmed" value="0">' + '<textarea name="sql_query"></textarea>' + '<input name="console_message_id" value="0">' + '<input name="server" value="">' + '<input name="db" value="">' + '<input name="table" value="">' + '<input name="token" value="">' + '</form>');
    Console.$requestForm.children('[name=token]').val(window.CommonParams.get('token'));
    Console.$requestForm.on('submit', window.AJAX.requestHandler); // Event binds shouldn't run again

    if (Console.isInitialized === false) {
      // Load config first
      if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.AlwaysExpand) {
        document.getElementById('consoleOptionsAlwaysExpandCheckbox').checked = true;
      }

      if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.StartHistory) {
        document.getElementById('consoleOptionsStartHistoryCheckbox').checked = true;
      }

      if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.CurrentQuery) {
        document.getElementById('consoleOptionsCurrentQueryCheckbox').checked = true;
      }

      if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.EnterExecutes) {
        document.getElementById('consoleOptionsEnterExecutesCheckbox').checked = true;
      }

      if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.DarkTheme) {
        document.getElementById('consoleOptionsDarkThemeCheckbox').checked = true;
        jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('>.content').addClass('console_dark_theme');
      }

      ConsoleResizer.initialize();
      ConsoleInput.initialize();
      ConsoleMessages.initialize();
      ConsoleBookmarks.initialize();
      ConsoleDebug.initialize();
      Console.$consoleToolbar.children('.console_switch').on('click', Console.toggle);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.toolbar').children().on('mousedown', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.button.clear').on('click', function () {
        ConsoleMessages.clear();
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.button.history').on('click', function () {
        ConsoleMessages.showHistory();
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.button.options').on('click', function () {
        Console.showCard('#pma_console_options');
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.button.debug').on('click', function () {
        Console.showCard('#debug_console');
      });
      Console.$consoleContent.on('click', function (event) {
        if (event.target === this) {
          ConsoleInput.focus();
        }
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.mid_layer').on('click', function () {
        Console.hideCard(jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().children('.card'));
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.switch_button').on('click', function () {
        Console.hideCard(jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.card'));
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.switch_button').on('click', function () {
        Console.hideCard(jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.card'));
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console_options').find('.switch_button').on('click', function () {
        Console.hideCard(jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.card'));
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console_options').find('input[type=checkbox]').on('change', function () {
        _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.update();
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console_options').find('.button.default').on('click', function () {
        document.getElementById('consoleOptionsAlwaysExpandCheckbox').checked = false;
        document.getElementById('consoleOptionsStartHistoryCheckbox').checked = false;
        document.getElementById('consoleOptionsCurrentQueryCheckbox').checked = true;
        document.getElementById('consoleOptionsEnterExecutesCheckbox').checked = false;
        document.getElementById('consoleOptionsDarkThemeCheckbox').checked = false;
        _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.update();
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('#consoleOptionsEnterExecutesCheckbox').on('change', function () {
        ConsoleMessages.showInstructions(_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.EnterExecutes);
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('ajaxComplete', function (event, xhr, ajaxOptions) {
        if (ajaxOptions.dataType && ajaxOptions.dataType.indexOf('json') !== -1) {
          return;
        }

        if (xhr.status !== 200) {
          return;
        }

        try {
          var data = JSON.parse(xhr.responseText);
          Console.ajaxCallback(data);
        } catch (e) {
          // eslint-disable-next-line no-console, compat/compat
          console.trace(); // eslint-disable-next-line no-console

          console.log('Failed to parse JSON: ' + e.message);
        }
      });
      Console.isInitialized = true;
    } // Change console mode from cookie


    switch (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.Mode) {
      case 'collapse':
        Console.collapse();
        break;

      case 'info':
        Console.info();
        break;

      case 'show':
        Console.show(true);
        Console.scrollBottom();
        break;

      default:
        _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.set('Mode', 'info');
        Console.info();
    }
  },

  /**
   * Execute query and show results in console
   *
   * @param {string} queryString
   * @param {object} options
   *
   * @return {void}
   */
  execute: function (queryString, options) {
    if (typeof queryString !== 'string' || !/[a-z]|[A-Z]/.test(queryString)) {
      return;
    }

    Console.$requestForm.children('textarea').val(queryString);
    Console.$requestForm.children('[name=server]').attr('value', window.CommonParams.get('server'));

    if (options && options.db) {
      Console.$requestForm.children('[name=db]').val(options.db);

      if (options.table) {
        Console.$requestForm.children('[name=table]').val(options.table);
      } else {
        Console.$requestForm.children('[name=table]').val('');
      }
    } else {
      Console.$requestForm.children('[name=db]').val(window.CommonParams.get('db').length > 0 ? window.CommonParams.get('db') : '');
    }

    Console.$requestForm.find('[name=profiling]').remove();

    if (options && options.profiling === true) {
      Console.$requestForm.append('<input name="profiling" value="on">');
    }

    if (!Functions.confirmQuery(Console.$requestForm[0], Console.$requestForm.children('textarea')[0].value)) {
      return;
    }

    Console.$requestForm.children('[name=console_message_id]').val(ConsoleMessages.appendQuery({
      'sql_query': queryString
    }).message_id);
    Console.$requestForm.trigger('submit');
    ConsoleInput.clear();
    Navigation.reload();
  },
  ajaxCallback: function (data) {
    if (data && data.console_message_id) {
      ConsoleMessages.updateQuery(data.console_message_id, data.success, data.reloadQuerywindow ? data.reloadQuerywindow : false);
    } else if (data && data.reloadQuerywindow) {
      if (data.reloadQuerywindow.sql_query.length > 0) {
        ConsoleMessages.appendQuery(data.reloadQuerywindow, 'successed').$message.addClass(_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.CurrentQuery ? '' : 'hide');
      }
    }
  },

  /**
   * Change console to collapse mode
   *
   * @return {void}
   */
  collapse: function () {
    _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.set('Mode', 'collapse');
    var pmaConsoleHeight = Math.max(92, _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.Height);
    Console.$consoleToolbar.addClass('collapsed');
    Console.$consoleAllContents.height(pmaConsoleHeight);
    Console.$consoleContent.stop();
    Console.$consoleContent.animate({
      'margin-bottom': -1 * Console.$consoleContent.outerHeight() + 'px'
    }, 'fast', 'easeOutQuart', function () {
      Console.$consoleContent.css({
        display: 'none'
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__(window).trigger('resize');
    });
    Console.hideCard();
  },

  /**
   * Show console
   *
   * @param {boolean} inputFocus If true, focus the input line after show()
   * @return {void}
   */
  show: function (inputFocus) {
    _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.set('Mode', 'show');
    var pmaConsoleHeight = Math.max(92, _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.Height); // eslint-disable-next-line compat/compat

    pmaConsoleHeight = Math.min(_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.Height, (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 25);
    Console.$consoleContent.css({
      display: 'block'
    });

    if (Console.$consoleToolbar.hasClass('collapsed')) {
      Console.$consoleToolbar.removeClass('collapsed');
    }

    Console.$consoleAllContents.height(pmaConsoleHeight);
    Console.$consoleContent.stop();
    Console.$consoleContent.animate({
      'margin-bottom': 0
    }, 'fast', 'easeOutQuart', function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(window).trigger('resize');

      if (inputFocus) {
        ConsoleInput.focus();
      }
    });
  },

  /**
   * Change console to SQL information mode
   * this mode shows current SQL query
   * This mode is the default mode
   *
   * @return {void}
   */
  info: function () {
    // Under construction
    Console.collapse();
  },

  /**
   * Toggle console mode between collapse/show
   * Used for toggle buttons and shortcuts
   *
   * @return {void}
   */
  toggle: function () {
    if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.Mode === 'show') {
      Console.collapse();
    } else {
      Console.show(true);
    }
  },

  /**
   * Scroll console to bottom
   *
   * @return {void}
   */
  scrollBottom: function () {
    Console.$consoleContent.scrollTop(Console.$consoleContent.prop('scrollHeight'));
  },

  /**
   * Show card
   *
   * @param {string | JQuery<Element>} cardSelector Selector, select string will be "#pma_console " + cardSelector
   * this param also can be JQuery object, if you need.
   *
   * @return {void}
   */
  showCard: function (cardSelector) {
    var $card = null;

    if (typeof cardSelector !== 'string') {
      if (cardSelector.length > 0) {
        $card = cardSelector;
      } else {
        return;
      }
    } else {
      $card = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console ' + cardSelector);
    }

    if ($card.length === 0) {
      return;
    }

    $card.parent().children('.mid_layer').show().fadeTo(0, 0.15);
    $card.addClass('show');
    ConsoleInput.blur();

    if ($card.parents('.card').length > 0) {
      Console.showCard($card.parents('.card'));
    }
  },

  /**
   * Scroll console to bottom
   *
   * @param {object} $targetCard Target card JQuery object, if it's empty, function will hide all cards
   * @return {void}
   */
  hideCard: function ($targetCard) {
    if (!$targetCard) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.mid_layer').fadeOut(140);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.card').removeClass('show');
    } else if ($targetCard.length > 0) {
      $targetCard.parent().find('.mid_layer').fadeOut(140);
      $targetCard.find('.card').removeClass('show');
      $targetCard.removeClass('show');
    }
  },
  isSelect: function (queryString) {
    var regExp = /^SELECT\s+/i;
    return regExp.test(queryString);
  }
};
/**
 * Resizer object
 * Careful: this object UI logics highly related with functions under Console
 * Resizing min-height is 32, if small than it, console will collapse
 */

var ConsoleResizer = {
  posY: 0,
  height: 0,
  resultHeight: 0,

  /**
   * Mousedown event handler for bind to resizer
   *
   * @param {MouseEvent} event
   *
   * @return {void}
   */
  mouseDown: function (event) {
    if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.Mode !== 'show') {
      return;
    }

    ConsoleResizer.posY = event.pageY;
    ConsoleResizer.height = Console.$consoleContent.height();
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mousemove', ConsoleResizer.mouseMove);
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mouseup', ConsoleResizer.mouseUp); // Disable text selection while resizing

    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('selectstart', function () {
      return false;
    });
  },

  /**
   * Mousemove event handler for bind to resizer
   *
   * @param {MouseEvent} event
   *
   * @return {void}
   */
  mouseMove: function (event) {
    if (event.pageY < 35) {
      event.pageY = 35;
    }

    ConsoleResizer.resultHeight = ConsoleResizer.height + (ConsoleResizer.posY - event.pageY); // Content min-height is 32, if adjusting height small than it we'll move it out of the page

    if (ConsoleResizer.resultHeight <= 32) {
      Console.$consoleAllContents.height(32);
      Console.$consoleContent.css('margin-bottom', ConsoleResizer.resultHeight - 32);
    } else {
      // Logic below makes viewable area always at bottom when adjusting height and content already at bottom
      if (Console.$consoleContent.scrollTop() + Console.$consoleContent.innerHeight() + 16 >= Console.$consoleContent.prop('scrollHeight')) {
        Console.$consoleAllContents.height(ConsoleResizer.resultHeight);
        Console.scrollBottom();
      } else {
        Console.$consoleAllContents.height(ConsoleResizer.resultHeight);
      }
    }
  },

  /**
   * Mouseup event handler for bind to resizer
   *
   * @return {void}
   */
  mouseUp: function () {
    _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.set('Height', ConsoleResizer.resultHeight);
    Console.show();
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('mousemove');
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('mouseup');
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('selectstart');
  },

  /**
   * Used for console resizer initialize
   *
   * @return {void}
   */
  initialize: function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.toolbar').off('mousedown');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.toolbar').on('mousedown', ConsoleResizer.mouseDown);
  }
};
/**
 * Console input object
 */

var ConsoleInput = {
  /**
   * @var array, contains Codemirror objects or input jQuery objects
   * @access private
   */
  inputs: null,

  /**
   * @var {boolean}, if codemirror enabled
   * @access private
   */
  codeMirror: false,

  /**
   * @var {number}, count for history navigation, 0 for current input
   * @access private
   */
  historyCount: 0,

  /**
   * @var {string}, current input when navigating through history
   * @access private
   */
  historyPreserveCurrent: null,

  /**
   * Used for console input initialize
   *
   * @return {void}
   */
  initialize: function () {
    // _cm object can't be reinitialize
    if (ConsoleInput.inputs !== null) {
      return;
    }

    if (typeof codemirror__WEBPACK_IMPORTED_MODULE_1__ !== 'undefined') {
      ConsoleInput.codeMirror = true;
    }

    ConsoleInput.inputs = [];

    if (ConsoleInput.codeMirror) {
      // eslint-disable-next-line new-cap
      ConsoleInput.inputs.console = codemirror__WEBPACK_IMPORTED_MODULE_1__(jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.console_query_input')[0], {
        theme: 'pma',
        mode: 'text/x-sql',
        lineWrapping: true,
        extraKeys: {
          'Ctrl-Space': 'autocomplete'
        },
        hintOptions: {
          'completeSingle': false,
          'completeOnSingleClick': true
        },
        gutters: ['CodeMirror-lint-markers'],
        lint: {
          'getAnnotations': codemirror__WEBPACK_IMPORTED_MODULE_1__.sqlLint,
          'async': true
        }
      });
      ConsoleInput.inputs.console.on('inputRead', Functions.codeMirrorAutoCompleteOnInputRead);
      ConsoleInput.inputs.console.on('keydown', function (instance, event) {
        ConsoleInput.historyNavigate(event);
      });

      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').length !== 0) {
        // eslint-disable-next-line new-cap
        ConsoleInput.inputs.bookmark = codemirror__WEBPACK_IMPORTED_MODULE_1__(jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.bookmark_add_input')[0], {
          theme: 'pma',
          mode: 'text/x-sql',
          lineWrapping: true,
          extraKeys: {
            'Ctrl-Space': 'autocomplete'
          },
          hintOptions: {
            'completeSingle': false,
            'completeOnSingleClick': true
          },
          gutters: ['CodeMirror-lint-markers'],
          lint: {
            'getAnnotations': codemirror__WEBPACK_IMPORTED_MODULE_1__.sqlLint,
            'async': true
          }
        });
        ConsoleInput.inputs.bookmark.on('inputRead', Functions.codeMirrorAutoCompleteOnInputRead);
      }
    } else {
      ConsoleInput.inputs.console = jquery__WEBPACK_IMPORTED_MODULE_0__('<textarea>').appendTo('#pma_console .console_query_input').on('keydown', ConsoleInput.historyNavigate);

      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').length !== 0) {
        ConsoleInput.inputs.bookmark = jquery__WEBPACK_IMPORTED_MODULE_0__('<textarea>').appendTo('#pma_console .bookmark_add_input');
      }
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.console_query_input').on('keydown', ConsoleInput.keyDown);
  },

  /**
   * @param {KeyboardEvent} event
   */
  historyNavigate: function (event) {
    if (event.keyCode === 38 || event.keyCode === 40) {
      var upPermitted = false;
      var downPermitted = false;
      var editor = ConsoleInput.inputs.console;
      var cursorLine;
      var totalLine;

      if (ConsoleInput.codeMirror) {
        cursorLine = editor.getCursor().line;
        totalLine = editor.lineCount();
      } else {
        // Get cursor position from textarea
        var text = ConsoleInput.getText();
        cursorLine = text.substring(0, editor.prop('selectionStart')).split('\n').length - 1;
        totalLine = text.split(/\r*\n/).length;
      }

      if (cursorLine === 0) {
        upPermitted = true;
      }

      if (cursorLine === totalLine - 1) {
        downPermitted = true;
      }

      var nextCount;
      var queryString = false;

      if (upPermitted && event.keyCode === 38) {
        // Navigate up in history
        if (ConsoleInput.historyCount === 0) {
          ConsoleInput.historyPreserveCurrent = ConsoleInput.getText();
        }

        nextCount = ConsoleInput.historyCount + 1;
        queryString = ConsoleMessages.getHistory(nextCount);
      } else if (downPermitted && event.keyCode === 40) {
        // Navigate down in history
        if (ConsoleInput.historyCount === 0) {
          return;
        }

        nextCount = ConsoleInput.historyCount - 1;

        if (nextCount === 0) {
          queryString = ConsoleInput.historyPreserveCurrent;
        } else {
          queryString = ConsoleMessages.getHistory(nextCount);
        }
      }

      if (queryString !== false) {
        ConsoleInput.historyCount = nextCount;
        ConsoleInput.setText(queryString, 'console');

        if (ConsoleInput.codeMirror) {
          editor.setCursor(editor.lineCount(), 0);
        }

        event.preventDefault();
      }
    }
  },

  /**
   * Mousedown event handler for bind to input
   * Shortcut is Ctrl+Enter key or just ENTER, depending on console's
   * configuration.
   *
   * @param {KeyboardEvent} event
   *
   * @return {void}
   */
  keyDown: function (event) {
    // Execute command
    if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.EnterExecutes) {
      // Enter, but not in combination with Shift (which writes a new line).
      if (!event.shiftKey && event.keyCode === 13) {
        ConsoleInput.execute();
      }
    } else {
      // Ctrl+Enter
      if (event.ctrlKey && event.keyCode === 13) {
        ConsoleInput.execute();
      }
    } // Clear line


    if (event.ctrlKey && event.keyCode === 76) {
      ConsoleInput.clear();
    } // Clear console


    if (event.ctrlKey && event.keyCode === 85) {
      ConsoleMessages.clear();
    }
  },

  /**
   * Used for send text to Console.execute()
   *
   * @return {void}
   */
  execute: function () {
    if (ConsoleInput.codeMirror) {
      Console.execute(ConsoleInput.inputs.console.getValue());
    } else {
      Console.execute(ConsoleInput.inputs.console.val());
    }
  },

  /**
   * Used for clear the input
   *
   * @param {string} target, default target is console input
   * @return {void}
   */
  clear: function (target) {
    ConsoleInput.setText('', target);
  },

  /**
   * Used for set focus to input
   *
   * @return {void}
   */
  focus: function () {
    ConsoleInput.inputs.console.focus();
  },

  /**
   * Used for blur input
   *
   * @return {void}
   */
  blur: function () {
    if (ConsoleInput.codeMirror) {
      ConsoleInput.inputs.console.getInputField().blur();
    } else {
      ConsoleInput.inputs.console.blur();
    }
  },

  /**
   * Used for set text in input
   *
   * @param {string} text
   * @param {string} target
   * @return {void}
   */
  setText: function (text, target) {
    if (ConsoleInput.codeMirror) {
      switch (target) {
        case 'bookmark':
          Console.execute(ConsoleInput.inputs.bookmark.setValue(text));
          break;

        default:
        case 'console':
          Console.execute(ConsoleInput.inputs.console.setValue(text));
      }
    } else {
      switch (target) {
        case 'bookmark':
          Console.execute(ConsoleInput.inputs.bookmark.val(text));
          break;

        default:
        case 'console':
          Console.execute(ConsoleInput.inputs.console.val(text));
      }
    }
  },

  /**
   * @param {'bookmark'|'console'} target
   * @return {string}
   */
  getText: function (target) {
    if (ConsoleInput.codeMirror) {
      switch (target) {
        case 'bookmark':
          return ConsoleInput.inputs.bookmark.getValue();

        default:
        case 'console':
          return ConsoleInput.inputs.console.getValue();
      }
    } else {
      switch (target) {
        case 'bookmark':
          return ConsoleInput.inputs.bookmark.val();

        default:
        case 'console':
          return ConsoleInput.inputs.console.val();
      }
    }
  }
};
/**
 * Console messages, and message items management object
 */

var ConsoleMessages = {
  /**
   * Used for clear the messages
   *
   * @return {void}
   */
  clear: function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.content .console_message_container .message:not(.welcome)').addClass('hide');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.content .console_message_container .message.failed').remove();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.content .console_message_container .message.expanded').find('.action.collapse').trigger('click');
  },

  /**
   * Used for show history messages
   *
   * @return {void}
   */
  showHistory: function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.content .console_message_container .message.hide').removeClass('hide');
  },

  /**
   * Used for getting a perticular history query
   *
   * @param {number} nthLast get nth query message from latest, i.e 1st is last
   * @return {string | false} message
   */
  getHistory: function (nthLast) {
    var $queries = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.content .console_message_container .query');
    var length = $queries.length;
    var $query = $queries.eq(length - nthLast);

    if (!$query || length - nthLast < 0) {
      return false;
    } else {
      return $query.text();
    }
  },

  /**
   * Used to show the correct message depending on which key
   * combination executes the query (Ctrl+Enter or Enter).
   *
   * @param {boolean} enterExecutes Only Enter has to be pressed to execute query.
   * @return {void}
   */
  showInstructions: function (enterExecutes) {
    var enter = +enterExecutes || 0; // conversion to int

    var $welcomeMsg = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.content .console_message_container .message.welcome span');
    $welcomeMsg.children('[id^=instructions]').hide();
    $welcomeMsg.children('#instructions-' + enter).show();
  },

  /**
   * Used for log new message
   *
   * @param {string} msgString Message to show
   * @param {string} msgType Message type
   * @return {object | false}, {message_id, $message}
   */
  append: function (msgString, msgType) {
    if (typeof msgString !== 'string') {
      return false;
    } // Generate an ID for each message, we can find them later


    var msgId = Math.round(Math.random() * 899999999999 + 100000000000);
    var now = new Date();
    var $newMessage = jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="message ' + (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.AlwaysExpand ? 'expanded' : 'collapsed') + '" msgid="' + msgId + '"><div class="action_content"></div></div>');

    switch (msgType) {
      case 'query':
        $newMessage.append('<div class="query highlighted"></div>');

        if (ConsoleInput.codeMirror) {
          codemirror__WEBPACK_IMPORTED_MODULE_1__.runMode(msgString, 'text/x-sql', $newMessage.children('.query')[0]);
        } else {
          $newMessage.children('.query').text(msgString);
        }

        $newMessage.children('.action_content').append(Console.$consoleTemplates.children('.query_actions').html());
        break;

      default:
      case 'normal':
        $newMessage.append('<div>' + msgString + '</div>');
    }

    ConsoleMessages.messageEventBinds($newMessage);
    $newMessage.find('span.text.query_time span').text(now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()).parent().attr('title', now);
    return {
      'message_id': msgId,
      $message: $newMessage.appendTo('#pma_console .content .console_message_container')
    };
  },

  /**
   * Used for log new query
   *
   * @param {string} queryData Struct should be
   * {sql_query: "Query string", db: "Target DB", table: "Target Table"}
   * @param {string} state Message state
   * @return {object}, {message_id: string message id, $message: JQuery object}
   */
  appendQuery: function (queryData, state) {
    var targetMessage = ConsoleMessages.append(queryData.sql_query, 'query');

    if (!targetMessage) {
      return false;
    }

    if (queryData.db && queryData.table) {
      targetMessage.$message.attr('targetdb', queryData.db);
      targetMessage.$message.attr('targettable', queryData.table);
      targetMessage.$message.find('.text.targetdb span').text(queryData.db);
    }

    if (Console.isSelect(queryData.sql_query)) {
      targetMessage.$message.addClass('select');
    }

    switch (state) {
      case 'failed':
        targetMessage.$message.addClass('failed');
        break;

      case 'successed':
        targetMessage.$message.addClass('successed');
        break;

      default:
      case 'pending':
        targetMessage.$message.addClass('pending');
    }

    return targetMessage;
  },
  messageEventBinds: function ($target) {
    // Leave unbinded elements, remove binded.
    var $targetMessage = $target.filter(':not(.binded)');

    if ($targetMessage.length === 0) {
      return;
    }

    $targetMessage.addClass('binded');
    $targetMessage.find('.action.expand').on('click', function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message').removeClass('collapsed');
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message').addClass('expanded');
    });
    $targetMessage.find('.action.collapse').on('click', function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message').addClass('collapsed');
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message').removeClass('expanded');
    });
    $targetMessage.find('.action.edit').on('click', function () {
      ConsoleInput.setText(jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().siblings('.query').text());
      ConsoleInput.focus();
    });
    $targetMessage.find('.action.requery').on('click', function () {
      var query = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().siblings('.query').text();
      var $message = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message');

      if (confirm(window.Messages.strConsoleRequeryConfirm + '\n' + (query.length < 100 ? query : query.slice(0, 100) + '...'))) {
        Console.execute(query, {
          db: $message.attr('targetdb'),
          table: $message.attr('targettable')
        });
      }
    });
    $targetMessage.find('.action.bookmark').on('click', function () {
      var query = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().siblings('.query').text();
      var $message = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message');
      ConsoleBookmarks.addBookmark(query, $message.attr('targetdb'));
      Console.showCard('#pma_bookmarks .card.add');
    });
    $targetMessage.find('.action.edit_bookmark').on('click', function () {
      var query = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().siblings('.query').text();
      var $message = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message');
      var isShared = $message.find('span.bookmark_label').hasClass('shared');
      var label = $message.find('span.bookmark_label').text();
      ConsoleBookmarks.addBookmark(query, $message.attr('targetdb'), label, isShared);
      Console.showCard('#pma_bookmarks .card.add');
    });
    $targetMessage.find('.action.delete_bookmark').on('click', function () {
      var $message = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message');

      if (confirm(window.Messages.strConsoleDeleteBookmarkConfirm + '\n' + $message.find('.bookmark_label').text())) {
        jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/import', {
          'server': window.CommonParams.get('server'),
          'action_bookmark': 2,
          'ajax_request': true,
          'id_bookmark': $message.attr('bookmarkid')
        }, function () {
          ConsoleBookmarks.refresh();
        });
      }
    });
    $targetMessage.find('.action.profiling').on('click', function () {
      var $message = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message');
      Console.execute(jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().siblings('.query').text(), {
        db: $message.attr('targetdb'),
        table: $message.attr('targettable'),
        profiling: true
      });
    });
    $targetMessage.find('.action.explain').on('click', function () {
      var $message = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message');
      Console.execute('EXPLAIN ' + jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().siblings('.query').text(), {
        db: $message.attr('targetdb'),
        table: $message.attr('targettable')
      });
    });
    $targetMessage.find('.action.dbg_show_trace').on('click', function () {
      var $message = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message');

      if (!$message.find('.trace').length) {
        ConsoleDebug.getQueryDetails($message.data('queryInfo'), $message.data('totalTime'), $message);
        ConsoleMessages.messageEventBinds($message.find('.message:not(.binded)'));
      }

      $message.addClass('show_trace');
      $message.removeClass('hide_trace');
    });
    $targetMessage.find('.action.dbg_hide_trace').on('click', function () {
      var $message = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message');
      $message.addClass('hide_trace');
      $message.removeClass('show_trace');
    });
    $targetMessage.find('.action.dbg_show_args').on('click', function () {
      var $message = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message');
      $message.addClass('show_args expanded');
      $message.removeClass('hide_args collapsed');
    });
    $targetMessage.find('.action.dbg_hide_args').on('click', function () {
      var $message = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('.message');
      $message.addClass('hide_args collapsed');
      $message.removeClass('show_args expanded');
    });

    if (ConsoleInput.codeMirror) {
      $targetMessage.find('.query:not(.highlighted)').each(function (index, elem) {
        codemirror__WEBPACK_IMPORTED_MODULE_1__.runMode(jquery__WEBPACK_IMPORTED_MODULE_0__(elem).text(), 'text/x-sql', elem);
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).addClass('highlighted');
      });
    }
  },
  msgAppend: function (msgId, msgString) {
    var $targetMessage = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.content .console_message_container .message[msgid=' + msgId + ']');

    if ($targetMessage.length === 0 || isNaN(parseInt(msgId)) || typeof msgString !== 'string') {
      return false;
    }

    $targetMessage.append('<div>' + msgString + '</div>');
  },
  updateQuery: function (msgId, isSuccessed, queryData) {
    var $targetMessage = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.console_message_container .message[msgid=' + parseInt(msgId) + ']');

    if ($targetMessage.length === 0 || isNaN(parseInt(msgId))) {
      return false;
    }

    $targetMessage.removeClass('pending failed successed');

    if (isSuccessed) {
      $targetMessage.addClass('successed');

      if (queryData) {
        $targetMessage.children('.query').text('');
        $targetMessage.removeClass('select');

        if (Console.isSelect(queryData.sql_query)) {
          $targetMessage.addClass('select');
        }

        if (ConsoleInput.codeMirror) {
          codemirror__WEBPACK_IMPORTED_MODULE_1__.runMode(queryData.sql_query, 'text/x-sql', $targetMessage.children('.query')[0]);
        } else {
          $targetMessage.children('.query').text(queryData.sql_query);
        }

        $targetMessage.attr('targetdb', queryData.db);
        $targetMessage.attr('targettable', queryData.table);
        $targetMessage.find('.text.targetdb span').text(queryData.db);
      }
    } else {
      $targetMessage.addClass('failed');
    }
  },

  /**
   * Used for console messages initialize
   *
   * @return {void}
   */
  initialize: function () {
    ConsoleMessages.messageEventBinds(jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.message:not(.binded)'));

    if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.StartHistory) {
      ConsoleMessages.showHistory();
    }

    ConsoleMessages.showInstructions(_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.EnterExecutes);
  }
};
/**
 * Console bookmarks card, and bookmarks items management object
 */

var ConsoleBookmarks = {
  bookmarks: [],
  addBookmark: function (queryString, targetDb, label, isShared) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.add [name=shared]').prop('checked', false);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.add [name=label]').val('');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.add [name=targetdb]').val('');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.add [name=id_bookmark]').val('');
    ConsoleInput.setText('', 'bookmark');

    if (typeof queryString !== 'undefined') {
      ConsoleInput.setText(queryString, 'bookmark');
    }

    if (typeof targetDb !== 'undefined') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.add [name=targetdb]').val(targetDb);
    }

    if (typeof label !== 'undefined') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.add [name=label]').val(label);
    }

    if (typeof isShared !== 'undefined') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.add [name=shared]').prop('checked', isShared);
    }
  },
  refresh: function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__.get('index.php?route=/console/bookmark/refresh', {
      'ajax_request': true,
      'server': window.CommonParams.get('server')
    }, function (data) {
      if (data.console_message_bookmark) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.content.bookmark').html(data.console_message_bookmark);
        ConsoleMessages.messageEventBinds(jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.message:not(.binded)'));
      }
    });
  },

  /**
   * Used for console bookmarks initialize
   * message events are already binded by ConsoleMsg.messageEventBinds
   *
   * @return {void}
   */
  initialize: function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').length === 0) {
      return;
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.button.bookmarks').on('click', function () {
      Console.showCard('#pma_bookmarks');
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.button.add').on('click', function () {
      Console.showCard('#pma_bookmarks .card.add');
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.card.add [name=submit]').on('click', function () {
      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.card.add [name=label]').val().length === 0 || ConsoleInput.getText('bookmark').length === 0) {
        alert(window.Messages.strFormEmpty);
        return;
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__(this).prop('disabled', true);
      jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/console/bookmark/add', {
        'ajax_request': true,
        'label': jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.card.add [name=label]').val(),
        'server': window.CommonParams.get('server'),
        'db': jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.card.add [name=targetdb]').val(),
        'bookmark_query': ConsoleInput.getText('bookmark'),
        'shared': jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.card.add [name=shared]').prop('checked')
      }, function () {
        ConsoleBookmarks.refresh();
        jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.card.add [name=submit]').prop('disabled', false);
        Console.hideCard(jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_bookmarks').find('.card.add'));
      });
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.button.refresh').on('click', function () {
      ConsoleBookmarks.refresh();
    });
  }
};
var ConsoleDebug = {
  lastDebugInfo: {
    debugInfo: null,
    url: null
  },
  initialize: function () {
    // Try to get debug info after every AJAX request
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('ajaxSuccess', function (event, xhr, settings, data) {
      if (data.debug) {
        ConsoleDebug.showLog(data.debug, settings.url);
      }
    });

    if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.GroupQueries) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').addClass('grouped');
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').addClass('ungrouped');

      if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.OrderBy === 'count') {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.button.order_by.sort_exec').addClass('active');
      }
    }

    var orderBy = _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.OrderBy;
    var order = _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.Order;
    jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.button.order_by.sort_' + orderBy).addClass('active');
    jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.button.order.order_' + order).addClass('active'); // Initialize actions in toolbar

    jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.button.group_queries').on('click', function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').addClass('grouped');
      jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').removeClass('ungrouped');
      _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.set('GroupQueries', true);
      ConsoleDebug.refresh();

      if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.OrderBy === 'count') {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.button.order_by.sort_exec').removeClass('active');
      }
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.button.ungroup_queries').on('click', function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').addClass('ungrouped');
      jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').removeClass('grouped');
      _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.set('GroupQueries', false);
      ConsoleDebug.refresh();

      if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.OrderBy === 'count') {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.button.order_by.sort_exec').addClass('active');
      }
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.button.order_by').on('click', function () {
      var $this = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.button.order_by').removeClass('active');
      $this.addClass('active');

      if ($this.hasClass('sort_time')) {
        _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.set('OrderBy', 'time');
      } else if ($this.hasClass('sort_exec')) {
        _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.set('OrderBy', 'exec');
      } else if ($this.hasClass('sort_count')) {
        _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.set('OrderBy', 'count');
      }

      ConsoleDebug.refresh();
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.button.order').on('click', function () {
      var $this = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.button.order').removeClass('active');
      $this.addClass('active');

      if ($this.hasClass('order_asc')) {
        _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.set('Order', 'asc');
      } else if ($this.hasClass('order_desc')) {
        _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.set('Order', 'desc');
      }

      ConsoleDebug.refresh();
    }); // Show SQL debug info for first page load

    if (Console.debugSqlInfo === null) {
      return;
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').find('.button.debug').removeClass('hide');
    ConsoleDebug.showLog(Console.debugSqlInfo);
  },
  formatFunctionCall: function (dbgStep) {
    var functionName = '';

    if ('class' in dbgStep) {
      functionName += dbgStep.class;
      functionName += dbgStep.type;
    }

    functionName += dbgStep.function;

    if (dbgStep.args && dbgStep.args.length) {
      functionName += '(...)';
    } else {
      functionName += '()';
    }

    return functionName;
  },
  formatFunctionArgs: function (dbgStep) {
    var $args = jquery__WEBPACK_IMPORTED_MODULE_0__('<div>');

    if (dbgStep.args.length) {
      $args.append('<div class="message welcome">').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="message welcome">').text(Functions.sprintf(window.Messages.strConsoleDebugArgsSummary, dbgStep.args.length)));

      for (var i = 0; i < dbgStep.args.length; i++) {
        $args.append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="message">').html('<pre>' + Functions.escapeHtml(JSON.stringify(dbgStep.args[i], null, '  ')) + '</pre>'));
      }
    }

    return $args;
  },
  formatFileName: function (dbgStep) {
    var fileName = '';

    if ('file' in dbgStep) {
      fileName += dbgStep.file;
      fileName += '#' + dbgStep.line;
    }

    return fileName;
  },
  formatBackTrace: function (dbgTrace) {
    var $traceElem = jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="trace">');
    $traceElem.append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="message welcome">'));
    var step;
    var $stepElem;

    for (var stepId in dbgTrace) {
      if (dbgTrace.hasOwnProperty(stepId)) {
        step = dbgTrace[stepId];

        if (!Array.isArray(step) && typeof step !== 'object') {
          $stepElem = jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="message traceStep collapsed hide_args">').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<span>').text(step));
        } else {
          if (typeof step.args === 'string' && step.args) {
            step.args = [step.args];
          }

          $stepElem = jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="message traceStep collapsed hide_args">').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<span class="function">').text(this.formatFunctionCall(step))).append(jquery__WEBPACK_IMPORTED_MODULE_0__('<span class="file">').text(this.formatFileName(step)));

          if (step.args && step.args.length) {
            $stepElem.append(jquery__WEBPACK_IMPORTED_MODULE_0__('<span class="args">').html(this.formatFunctionArgs(step))).prepend(jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="action_content">').append('<span class="action dbg_show_args">' + window.Messages.strConsoleDebugShowArgs + '</span> ').append('<span class="action dbg_hide_args">' + window.Messages.strConsoleDebugHideArgs + '</span> '));
          }
        }

        $traceElem.append($stepElem);
      }
    }

    return $traceElem;
  },
  formatQueryOrGroup: function (queryInfo, totalTime) {
    var grouped;
    var queryText;
    var queryTime;
    var count;
    var i;

    if (Array.isArray(queryInfo)) {
      // It is grouped
      grouped = true;
      queryText = queryInfo[0].query;
      queryTime = 0;

      for (i in queryInfo) {
        queryTime += queryInfo[i].time;
      }

      count = queryInfo.length;
    } else {
      queryText = queryInfo.query;
      queryTime = queryInfo.time;
    }

    var $query = jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="message collapsed hide_trace">').append(jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.templates .debug_query').clone()).append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="query">').text(queryText)).data('queryInfo', queryInfo).data('totalTime', totalTime);

    if (grouped) {
      $query.find('span.text.count').removeClass('hide');
      $query.find('span.text.count span').text(count);
    }

    $query.find('span.text.time span').text(ConsoleDebug.getQueryTimeTaken(queryTime, totalTime));
    return $query;
  },
  appendQueryExtraInfo: function (query, $elem) {
    if ('error' in query) {
      $elem.append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div>').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<span class="text-danger">').text(query.error)));
    }

    $elem.append(this.formatBackTrace(query.trace));
  },
  getQueryTimeTaken: function (queryTime, totalTime) {
    return queryTime + 's (' + (queryTime * 100 / totalTime).toFixed(3) + '%)';
  },
  getQueryDetails: function (queryInfo, totalTime, $query) {
    if (Array.isArray(queryInfo)) {
      var $singleQuery;

      for (var i in queryInfo) {
        $singleQuery = jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="message welcome trace">').text(parseInt(i) + 1 + '.').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<span class="time">').text(window.Messages.strConsoleDebugTimeTaken + ' ' + ConsoleDebug.getQueryTimeTaken(queryInfo[i].time, totalTime)));
        this.appendQueryExtraInfo(queryInfo[i], $singleQuery);
        $query.append('<div class="message welcome trace">').append($singleQuery);
      }
    } else {
      this.appendQueryExtraInfo(queryInfo, $query);
    }
  },
  showLog: function (debugInfo, url) {
    this.lastDebugInfo.debugInfo = debugInfo;
    this.lastDebugInfo.url = url;
    jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.debugLog').empty();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.debug>.welcome').empty();
    var debugJson = false;
    var i;

    if (typeof debugInfo === 'object' && 'queries' in debugInfo) {
      // Copy it to debugJson, so that it doesn't get changed
      if (!('queries' in debugInfo)) {
        debugJson = false;
      } else {
        debugJson = {
          queries: []
        };

        for (i in debugInfo.queries) {
          debugJson.queries[i] = debugInfo.queries[i];
        }
      }
    } else if (typeof debugInfo === 'string') {
      try {
        debugJson = JSON.parse(debugInfo);
      } catch (e) {
        debugJson = false;
      }

      if (debugJson && !('queries' in debugJson)) {
        debugJson = false;
      }
    }

    if (debugJson === false) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.debug>.welcome').text(window.Messages.strConsoleDebugError);
      return;
    }

    var allQueries = debugJson.queries;
    var uniqueQueries = {};
    var totalExec = allQueries.length; // Calculate total time and make unique query array

    var totalTime = 0;

    for (i = 0; i < totalExec; ++i) {
      totalTime += allQueries[i].time;

      if (!(allQueries[i].hash in uniqueQueries)) {
        uniqueQueries[allQueries[i].hash] = [];
      }

      uniqueQueries[allQueries[i].hash].push(allQueries[i]);
    } // Count total unique queries, convert uniqueQueries to Array


    var totalUnique = 0;
    var uniqueArray = [];

    for (var hash in uniqueQueries) {
      if (uniqueQueries.hasOwnProperty(hash)) {
        ++totalUnique;
        uniqueArray.push(uniqueQueries[hash]);
      }
    }

    uniqueQueries = uniqueArray; // Show summary

    jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.debug>.welcome').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<span class="debug_summary">').text(Functions.sprintf(window.Messages.strConsoleDebugSummary, totalUnique, totalExec, totalTime)));

    if (url) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.debug>.welcome').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<span class="script_name">').text(url.split('?')[0]));
    } // For sorting queries


    function sortByTime(a, b) {
      var order = _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.Order === 'asc' ? 1 : -1;

      if (Array.isArray(a) && Array.isArray(b)) {
        // It is grouped
        var timeA = 0;
        var timeB = 0;
        var i;

        for (i in a) {
          timeA += a[i].time;
        }

        for (i in b) {
          timeB += b[i].time;
        }

        return (timeA - timeB) * order;
      } else {
        return (a.time - b.time) * order;
      }
    }

    function sortByCount(a, b) {
      var order = _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.Order === 'asc' ? 1 : -1;
      return (a.length - b.length) * order;
    }

    var orderBy = _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.OrderBy;
    var order = _console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.Order;

    if (_console_config_js__WEBPACK_IMPORTED_MODULE_2__.Config.GroupQueries) {
      // Sort queries
      if (orderBy === 'time') {
        uniqueQueries.sort(sortByTime);
      } else if (orderBy === 'count') {
        uniqueQueries.sort(sortByCount);
      } else if (orderBy === 'exec' && order === 'desc') {
        uniqueQueries.reverse();
      }

      for (i in uniqueQueries) {
        if (orderBy === 'time') {
          uniqueQueries[i].sort(sortByTime);
        } else if (orderBy === 'exec' && order === 'desc') {
          uniqueQueries[i].reverse();
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.debugLog').append(this.formatQueryOrGroup(uniqueQueries[i], totalTime));
      }
    } else {
      if (orderBy === 'time') {
        allQueries.sort(sortByTime);
      } else if (order === 'desc') {
        allQueries.reverse();
      }

      for (i = 0; i < totalExec; ++i) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.debugLog').append(this.formatQueryOrGroup(allQueries[i], totalTime));
      }
    }

    ConsoleMessages.messageEventBinds(jquery__WEBPACK_IMPORTED_MODULE_0__('#debug_console').find('.message:not(.binded)'));
  },
  refresh: function () {
    var last = this.lastDebugInfo;
    ConsoleDebug.showLog(last.debugInfo, last.url);
  }
};


/***/ }),
/* 8 */
/***/ (function(module) {

module.exports = CodeMirror;

/***/ }),
/* 9 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Config": function() { return /* binding */ Config; }
/* harmony export */ });
/* global Functions */

/**
 * @link https://docs.phpmyadmin.net/en/latest/config.html#console-settings
 */
const Config = {
  /**
   * @type {boolean}
   */
  StartHistory: false,

  /**
   * @type {boolean}
   */
  AlwaysExpand: false,

  /**
   * @type {boolean}
   */
  CurrentQuery: true,

  /**
   * @type {boolean}
   */
  EnterExecutes: false,

  /**
   * @type {boolean}
   */
  DarkTheme: false,

  /**
   * @type {'info'|'show'|'collapse'}
   */
  Mode: 'info',

  /**
   * @type {number}
   */
  Height: 92,

  /**
   * @type {boolean}
   */
  GroupQueries: false,

  /**
   * @type {'exec'|'time'|'count'}
   */
  OrderBy: 'exec',

  /**
   * @type {'asc'|'desc'}
   */
  Order: 'asc',

  /**
   * @param {Object} data
   * @return {void}
   */
  init: function (data) {
    this.StartHistory = !!data.StartHistory;
    this.AlwaysExpand = !!data.AlwaysExpand;
    this.CurrentQuery = data.CurrentQuery !== undefined ? !!data.CurrentQuery : true;
    this.EnterExecutes = !!data.EnterExecutes;
    this.DarkTheme = !!data.DarkTheme;
    this.Mode = data.Mode === 'show' || data.Mode === 'collapse' ? data.Mode : 'info';
    this.Height = data.Height > 0 ? Number(data.Height) : 92;
    this.GroupQueries = !!data.GroupQueries;
    this.OrderBy = data.OrderBy === 'time' || data.OrderBy === 'count' ? data.OrderBy : 'exec';
    this.Order = data.Order === 'desc' ? 'desc' : 'asc';
  },

  /**
   * @param {'StartHistory'|'AlwaysExpand'|'CurrentQuery'|'EnterExecutes'|'DarkTheme'|'Mode'|'Height'|'GroupQueries'|'OrderBy'|'Order'} key
   * @param {boolean|string|number} value
   * @return {void}
   */
  set: function (key, value) {
    this[key] = value;
    Functions.configSet('Console/' + key, value);
  },

  /**
   * Used for update console config
   *
   * @return {void}
   */
  update: function () {
    this.set('AlwaysExpand', !!document.getElementById('consoleOptionsAlwaysExpandCheckbox').checked);
    this.set('StartHistory', !!document.getElementById('consoleOptionsStartHistoryCheckbox').checked);
    this.set('CurrentQuery', !!document.getElementById('consoleOptionsCurrentQueryCheckbox').checked);
    this.set('EnterExecutes', !!document.getElementById('consoleOptionsEnterExecutesCheckbox').checked);
    this.set('DarkTheme', !!document.getElementById('consoleOptionsDarkThemeCheckbox').checked);
    /* Setting the dark theme of the console*/

    const consoleContent = document.getElementById('pma_console').querySelector('.content');

    if (this.DarkTheme) {
      consoleContent.classList.add('console_dark_theme');
    } else {
      consoleContent.classList.remove('console_dark_theme');
    }
  }
};

/***/ })
],
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(6));
/******/ window.Console = __webpack_exports__.Console;
/******/ }
]);
//# sourceMappingURL=console.js.map