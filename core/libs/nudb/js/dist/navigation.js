"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[42],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 49:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * function used in or for navigation panel
 *
 * @package phpMyAdmin-Navigation
 */

var Navigation = {};
window.Navigation = Navigation;
/**
 * updates the tree state in sessionStorage
 *
 * @return {void}
 */

Navigation.treeStateUpdate = function () {
  // update if session storage is supported
  if (window.Config.isStorageSupported('sessionStorage')) {
    var storage = window.sessionStorage; // try catch necessary here to detect whether
    // content to be stored exceeds storage capacity

    try {
      storage.setItem('navTreePaths', JSON.stringify(Navigation.traverseForPaths()));
      storage.setItem('server', window.CommonParams.get('server'));
      storage.setItem('token', window.CommonParams.get('token'));
    } catch (error) {
      // storage capacity exceeded & old navigation tree
      // state is no more valid, so remove it
      storage.removeItem('navTreePaths');
      storage.removeItem('server');
      storage.removeItem('token');
    }
  }
};
/**
 * updates the filter state in sessionStorage
 *
 * @param {string} filterName
 * @param {string} filterValue
 *
 * @return {void}
 */


Navigation.filterStateUpdate = function (filterName, filterValue) {
  if (window.Config.isStorageSupported('sessionStorage')) {
    var storage = window.sessionStorage;

    try {
      var currentFilter = jquery__WEBPACK_IMPORTED_MODULE_0__.extend({}, JSON.parse(storage.getItem('navTreeSearchFilters')));
      var filter = {};
      filter[filterName] = filterValue;
      currentFilter = jquery__WEBPACK_IMPORTED_MODULE_0__.extend(currentFilter, filter);
      storage.setItem('navTreeSearchFilters', JSON.stringify(currentFilter));
    } catch (error) {
      storage.removeItem('navTreeSearchFilters');
    }
  }
};
/**
 * restores the filter state on navigation reload
 *
 * @return {void}
 */


Navigation.filterStateRestore = function () {
  if (window.Config.isStorageSupported('sessionStorage') && typeof window.sessionStorage.navTreeSearchFilters !== 'undefined') {
    var searchClauses = JSON.parse(window.sessionStorage.navTreeSearchFilters);

    if (Object.keys(searchClauses).length < 1) {
      return;
    } // restore database filter if present and not empty


    if (searchClauses.hasOwnProperty('dbFilter') && searchClauses.dbFilter.length) {
      var $obj = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree');

      if (!$obj.data('fastFilter')) {
        $obj.data('fastFilter', new Navigation.FastFilter.Filter($obj, ''));
      }

      $obj.find('li.fast_filter.db_fast_filter input.searchClause').val(searchClauses.dbFilter).trigger('keyup');
    } // find all table filters present in the tree


    var $tableFilters = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree li.database').children('div.list_container').find('li.fast_filter input.searchClause'); // restore table filters

    $tableFilters.each(function () {
      $obj = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('div.list_container'); // aPath associated with this filter

      var filterName = jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('input[name=aPath]').val(); // if this table's filter has a state stored in storage

      if (searchClauses.hasOwnProperty(filterName) && searchClauses[filterName].length) {
        // clear state if item is not visible,
        // happens when table filter becomes invisible
        // as db filter has already been applied
        if (!$obj.is(':visible')) {
          Navigation.filterStateUpdate(filterName, '');
          return true;
        }

        if (!$obj.data('fastFilter')) {
          $obj.data('fastFilter', new Navigation.FastFilter.Filter($obj, ''));
        }

        jquery__WEBPACK_IMPORTED_MODULE_0__(this).val(searchClauses[filterName]).trigger('keyup');
      }
    });
  }
};
/**
 * Loads child items of a node and executes a given callback
 *
 * @param isNode
 * @param $expandElem expander
 * @param callback    callback function
 *
 * @return {void}
 */


Navigation.loadChildNodes = function (isNode, $expandElem, callback) {
  var $destination = null;
  var params = null;

  if (isNode) {
    if (!$expandElem.hasClass('expander')) {
      return;
    }

    $destination = $expandElem.closest('li');
    var pos2Name = $expandElem.find('span.pos2_nav');
    var pathsNav = $expandElem.find('span.paths_nav');
    params = {
      'server': window.CommonParams.get('server'),
      'aPath': pathsNav.attr('data-apath'),
      'vPath': pathsNav.attr('data-vpath'),
      'pos': pathsNav.attr('data-pos'),
      'pos2_name': pos2Name.attr('data-name'),
      'pos2_value': pos2Name.attr('data-value'),
      'searchClause': '',
      'searchClause2': ''
    };

    if ($expandElem.closest('ul').hasClass('search_results')) {
      params.searchClause = Navigation.FastFilter.getSearchClause();
      params.searchClause2 = Navigation.FastFilter.getSearchClause2($expandElem);
    }
  } else {
    $destination = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree_content');
    params = {
      'server': window.CommonParams.get('server'),
      'aPath': $expandElem.attr('data-apath'),
      'vPath': $expandElem.attr('data-vpath'),
      'pos': $expandElem.attr('data-pos'),
      'pos2_name': '',
      'pos2_value': '',
      'searchClause': '',
      'searchClause2': ''
    };
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/navigation&ajax_request=1', params, function (data) {
    if (typeof data !== 'undefined' && data.success === true) {
      $destination.find('div.list_container').remove(); // FIXME: Hack, there shouldn't be a list container there

      if (isNode) {
        $destination.append(data.message);
        $expandElem.addClass('loaded');
      } else {
        $destination.html(data.message);
        $destination.children().first().css({
          border: '0px',
          margin: '0em',
          padding: '0em'
        }).slideDown('slow');
      }

      if (data.errors) {
        var $errors = jquery__WEBPACK_IMPORTED_MODULE_0__(data.errors);

        if ($errors.children().length > 0) {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_errors').replaceWith(data.errors);
        }
      }

      if (callback && typeof callback === 'function') {
        callback(data);
      }
    } else if (typeof data !== 'undefined' && data.redirect_flag === '1') {
      if (window.location.href.indexOf('?') === -1) {
        window.location.href += '?session_expired=1';
      } else {
        window.location.href += window.CommonParams.get('arg_separator') + 'session_expired=1';
      }

      window.location.reload();
    } else {
      var $throbber = $expandElem.find('img.throbber');
      $throbber.hide();
      var $icon = $expandElem.find('img.ic_b_plus');
      $icon.show();
      Functions.ajaxShowMessage(data.error, false);
    }
  });
};
/**
 * Collapses a node in navigation tree.
 *
 * @param $expandElem expander
 *
 * @return {void}
 */


Navigation.collapseTreeNode = function ($expandElem) {
  var $children = $expandElem.closest('li').children('div.list_container');
  var $icon = $expandElem.find('img');

  if ($expandElem.hasClass('loaded')) {
    if ($icon.is('.ic_b_minus')) {
      $icon.removeClass('ic_b_minus').addClass('ic_b_plus');
      $children.slideUp('fast');
    }
  }

  $expandElem.trigger('blur');
  $children.promise().done(Navigation.treeStateUpdate);
};
/**
 * Traverse the navigation tree backwards to generate all the actual
 * and virtual paths, as well as the positions in the pagination at
 * various levels, if necessary.
 *
 * @return {object}
 */


Navigation.traverseForPaths = function () {
  var params = {
    pos: jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').find('div.dbselector select').val()
  };

  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#navi_db_select').length) {
    return params;
  }

  var count = 0;
  jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').find('a.expander:visible').each(function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('img').is('.ic_b_minus') && jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('li').find('div.list_container .ic_b_minus').length === 0) {
      var pathsNav = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('span.paths_nav');
      params['n' + count + '_aPath'] = pathsNav.attr('data-apath');
      params['n' + count + '_vPath'] = pathsNav.attr('data-vpath');
      var pos2Nav = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('span.pos2_nav');

      if (pos2Nav.length === 0) {
        pos2Nav = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().parent().find('span.pos2_nav').last();
      }

      params['n' + count + '_pos2_name'] = pos2Nav.attr('data-name');
      params['n' + count + '_pos2_value'] = pos2Nav.attr('data-value');
      var pos3Nav = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('span.pos3_nav');
      params['n' + count + '_pos3_name'] = pos3Nav.attr('data-name');
      params['n' + count + '_pos3_value'] = pos3Nav.attr('data-value');
      count++;
    }
  });
  return params;
};
/**
 * @return {function}
 */


Navigation.onload = () => function () {
  if (!jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation').length) {
    // Don't bother running any code if the navigation is not even on the page
    return;
  } // Do not let the page reload on submitting the fast filter


  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', '.fast_filter', function (event) {
    event.preventDefault();
  }); // Fire up the resize handlers

  new Navigation.ResizeHandler();
  /**
   * opens/closes (hides/shows) tree elements
   * loads data via ajax
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#pma_navigation_tree a.expander', function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    var $icon = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('img');

    if ($icon.is('.ic_b_plus')) {
      Navigation.expandTreeNode(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
    } else {
      Navigation.collapseTreeNode(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
    }
  });
  /**
   * Register event handler for click on the reload
   * navigation icon at the top of the panel
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#pma_navigation_reload', function (event) {
    event.preventDefault(); // Find the loading symbol and show it

    var $iconThrobberSrc = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation').find('.throbber');
    $iconThrobberSrc.show(); // TODO Why is a loading symbol both hidden, and invisible?

    $iconThrobberSrc.css('visibility', ''); // Callback to be used to hide the loading symbol when done reloading

    function hideNav() {
      $iconThrobberSrc.hide();
    } // Reload the navigation


    Navigation.reload(hideNav);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('change', '#navi_db_select', function () {
    if (!jquery__WEBPACK_IMPORTED_MODULE_0__(this).val()) {
      window.CommonParams.set('db', '');
      Navigation.reload();
    }

    jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('form').trigger('submit');
  });
  /**
   * Register event handler for click on the collapse all
   * navigation icon at the top of the navigation tree
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#pma_navigation_collapse', function (event) {
    event.preventDefault();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').find('a.expander').each(function () {
      var $icon = jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('img');

      if ($icon.is('.ic_b_minus')) {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).trigger('click');
      }
    });
  });
  /**
   * Register event handler to toggle
   * the 'link with main panel' icon on mouseenter.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mouseenter', '#pma_navigation_sync', function (event) {
    event.preventDefault();
    var synced = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').hasClass('synced');
    var $img = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_sync').children('img');

    if (synced) {
      $img.removeClass('ic_s_link').addClass('ic_s_unlink');
    } else {
      $img.removeClass('ic_s_unlink').addClass('ic_s_link');
    }
  });
  /**
   * Register event handler to toggle
   * the 'link with main panel' icon on mouseout.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mouseout', '#pma_navigation_sync', function (event) {
    event.preventDefault();
    var synced = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').hasClass('synced');
    var $img = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_sync').children('img');

    if (synced) {
      $img.removeClass('ic_s_unlink').addClass('ic_s_link');
    } else {
      $img.removeClass('ic_s_link').addClass('ic_s_unlink');
    }
  });
  /**
   * Register event handler to toggle
   * the linking with main panel behavior
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#pma_navigation_sync', function (event) {
    event.preventDefault();
    var synced = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').hasClass('synced');
    var $img = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_sync').children('img');

    if (synced) {
      $img.removeClass('ic_s_unlink').addClass('ic_s_link').attr('alt', window.Messages.linkWithMain).attr('title', window.Messages.linkWithMain);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').removeClass('synced').find('li.selected').removeClass('selected');
    } else {
      $img.removeClass('ic_s_link').addClass('ic_s_unlink').attr('alt', window.Messages.unlinkWithMain).attr('title', window.Messages.unlinkWithMain);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').addClass('synced');
      Navigation.showCurrent();
    }
  });
  /**
   * Bind all "fast filter" events
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#pma_navigation_tree li.fast_filter button.searchClauseClear', Navigation.FastFilter.events.clear);
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('focus', '#pma_navigation_tree li.fast_filter input.searchClause', Navigation.FastFilter.events.focus);
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('blur', '#pma_navigation_tree li.fast_filter input.searchClause', Navigation.FastFilter.events.blur);
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('keyup', '#pma_navigation_tree li.fast_filter input.searchClause', Navigation.FastFilter.events.keyup);
  /**
   * Ajax handler for pagination
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#pma_navigation_tree div.pageselector a.ajax', function (event) {
    event.preventDefault();
    Navigation.treePagination(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  });
  /**
   * Node highlighting
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mouseover', '#pma_navigation_tree.highlight li:not(.fast_filter)', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__('li:visible', this).length === 0) {
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).addClass('activePointer');
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mouseout', '#pma_navigation_tree.highlight li:not(.fast_filter)', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).removeClass('activePointer');
  });
  /** New view */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'li.new_view a.ajax', function (event) {
    event.preventDefault();
    Functions.createViewModal(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  });
  /** Hide navigation tree item */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.hideNavItem.ajax', function (event) {
    event.preventDefault();
    var argSep = window.CommonParams.get('arg_separator');
    var params = jquery__WEBPACK_IMPORTED_MODULE_0__(this).getPostData();
    params += argSep + 'ajax_request=true' + argSep + 'server=' + window.CommonParams.get('server');
    jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
      type: 'POST',
      data: params,
      url: jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href'),
      success: function (data) {
        if (typeof data !== 'undefined' && data.success === true) {
          Navigation.reload();
        } else {
          Functions.ajaxShowMessage(data.error);
        }
      }
    });
  });
  /** Display a dialog to choose hidden navigation items to show */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.showUnhide.ajax', function (event) {
    event.preventDefault();
    var $msg = Functions.ajaxShowMessage();
    var argSep = window.CommonParams.get('arg_separator');
    var params = jquery__WEBPACK_IMPORTED_MODULE_0__(this).getPostData();
    params += argSep + 'ajax_request=true';
    jquery__WEBPACK_IMPORTED_MODULE_0__.post(jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href'), params, function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        Functions.ajaxRemoveMessage($msg);
        jquery__WEBPACK_IMPORTED_MODULE_0__('#unhideNavItemModal').modal('show');
        jquery__WEBPACK_IMPORTED_MODULE_0__('#unhideNavItemModal').find('.modal-body').first().html(data.message);
      } else {
        Functions.ajaxShowMessage(data.error);
      }
    });
  });
  /** Show a hidden navigation tree item */

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', 'a.unhideNavItem.ajax', function (event) {
    event.preventDefault();
    var $tr = jquery__WEBPACK_IMPORTED_MODULE_0__(this).parents('tr');
    var $hiddenTableCount = $tr.parents('tbody').children().length;
    var $hideDialogBox = $tr.closest('div.ui-dialog');
    var $msg = Functions.ajaxShowMessage();
    var argSep = window.CommonParams.get('arg_separator');
    var params = jquery__WEBPACK_IMPORTED_MODULE_0__(this).getPostData();
    params += argSep + 'ajax_request=true' + argSep + 'server=' + window.CommonParams.get('server');
    jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
      type: 'POST',
      data: params,
      url: jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href'),
      success: function (data) {
        Functions.ajaxRemoveMessage($msg);

        if (typeof data !== 'undefined' && data.success === true) {
          $tr.remove();

          if ($hiddenTableCount === 1) {
            $hideDialogBox.remove();
          }

          Navigation.reload();
        } else {
          Functions.ajaxShowMessage(data.error);
        }
      }
    });
  }); // Add/Remove favorite table using Ajax.

  jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '.favorite_table_anchor', function (event) {
    event.preventDefault();
    var $self = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var anchorId = $self.attr('id');

    if ($self.data('favtargetn') !== null) {
      var $dataFavTargets = jquery__WEBPACK_IMPORTED_MODULE_0__('a[data-favtargets="' + $self.data('favtargetn') + '"]');

      if ($dataFavTargets.length > 0) {
        $dataFavTargets.trigger('click');
        return;
      }
    }

    var hasLocalStorage = window.Config.isStorageSupported('localStorage') && typeof window.localStorage.favoriteTables !== 'undefined';
    jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
      url: $self.attr('href'),
      cache: false,
      type: 'POST',
      data: {
        'favoriteTables': hasLocalStorage ? window.localStorage.favoriteTables : '',
        'server': window.CommonParams.get('server')
      },
      success: function (data) {
        if (data.changes) {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_favorite_list').html(data.list);
          jquery__WEBPACK_IMPORTED_MODULE_0__('#' + anchorId).parent().html(data.anchor);
          Functions.tooltip(jquery__WEBPACK_IMPORTED_MODULE_0__('#' + anchorId), 'a', jquery__WEBPACK_IMPORTED_MODULE_0__('#' + anchorId).attr('title')); // Update localStorage.

          if (window.Config.isStorageSupported('localStorage')) {
            window.localStorage.favoriteTables = data.favoriteTables;
          }
        } else {
          Functions.ajaxShowMessage(data.message);
        }
      }
    });
  }); // Check if session storage is supported

  if (window.Config.isStorageSupported('sessionStorage')) {
    var storage = window.sessionStorage; // remove tree from storage if Navi_panel config form is submitted

    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('submit', 'form.config-form', function () {
      storage.removeItem('navTreePaths');
    }); // Initialize if no previous state is defined

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree_content').length && typeof storage.navTreePaths === 'undefined') {
      Navigation.reload();
    } else if (window.CommonParams.get('server') === storage.server && window.CommonParams.get('token') === storage.token) {
      // Reload the tree to the state before page refresh
      Navigation.reload(Navigation.filterStateRestore, JSON.parse(storage.navTreePaths));
    } else {
      // If the user is different
      Navigation.treeStateUpdate();
      Navigation.reload();
    }
  }
};
/**
 * Expands a node in navigation tree.
 *
 * @param $expandElem expander
 * @param callback    callback function
 *
 * @return {void}
 */


Navigation.expandTreeNode = function ($expandElem, callback) {
  var $children = $expandElem.closest('li').children('div.list_container');
  var $icon = $expandElem.find('img');

  if ($expandElem.hasClass('loaded')) {
    if ($icon.is('.ic_b_plus')) {
      $icon.removeClass('ic_b_plus').addClass('ic_b_minus');
      $children.slideDown('fast');
    }

    if (callback && typeof callback === 'function') {
      callback.call();
    }

    $children.promise().done(Navigation.treeStateUpdate);
  } else {
    var $throbber = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation').find('.throbber').first().clone().css({
      visibility: 'visible',
      display: 'block'
    }).on('click', false);
    $icon.hide();
    $throbber.insertBefore($icon);
    Navigation.loadChildNodes(true, $expandElem, function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        var $destination = $expandElem.closest('li');
        $icon.removeClass('ic_b_plus').addClass('ic_b_minus');
        $children = $destination.children('div.list_container');
        $children.slideDown('fast');

        if ($destination.find('ul > li').length === 1) {
          $destination.find('ul > li').find('a.expander.container').trigger('click');
        }

        if (callback && typeof callback === 'function') {
          callback.call();
        }

        Navigation.showFullName($destination);
      } else {
        Functions.ajaxShowMessage(data.error, false);
      }

      $icon.show();
      $throbber.remove();
      $children.promise().done(Navigation.treeStateUpdate);
    });
  }

  $expandElem.trigger('blur');
};
/**
 * Auto-scrolls the newly chosen database
 *
 * @param {object} $element    The element to set to view
 * @param {bool}   $forceToTop Whether to force scroll to top
 *
 */


Navigation.scrollToView = function ($element, $forceToTop) {
  Navigation.filterStateRestore();
  var $container = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree_content');
  var elemTop = $element.offset().top - $container.offset().top;
  var textHeight = 20;
  var scrollPadding = 20; // extra padding from top of bottom when scrolling to view

  if (elemTop < 0 || $forceToTop) {
    $container.stop().animate({
      scrollTop: elemTop + $container.scrollTop() - scrollPadding
    });
  } else if (elemTop + textHeight > $container.height()) {
    $container.stop().animate({
      scrollTop: elemTop + textHeight - $container.height() + $container.scrollTop() + scrollPadding
    });
  }
};
/**
 * Expand the navigation and highlight the current database or table/view
 *
 * @return {void}
 */


Navigation.showCurrent = function () {
  var db = window.CommonParams.get('db');
  var table = window.CommonParams.get('table');
  var autoexpand = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').hasClass('autoexpand');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').find('li.selected').removeClass('selected');
  var $dbItem;

  if (db) {
    $dbItem = findLoadedItem(jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').find('> div'), db, 'database', !table);

    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#navi_db_select').length && jquery__WEBPACK_IMPORTED_MODULE_0__('option:selected', jquery__WEBPACK_IMPORTED_MODULE_0__('#navi_db_select')).length) {
      if (!Navigation.selectCurrentDatabase()) {
        return;
      } // If loaded database in navigation is not same as current one


      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree_content').find('span.loaded_db').first().text() !== jquery__WEBPACK_IMPORTED_MODULE_0__('#navi_db_select').val()) {
        Navigation.loadChildNodes(false, jquery__WEBPACK_IMPORTED_MODULE_0__('option:selected', jquery__WEBPACK_IMPORTED_MODULE_0__('#navi_db_select')), function () {
          handleTableOrDb(table, jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree_content'));
          var $children = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree_content').children('div.list_container');
          $children.promise().done(Navigation.treeStateUpdate);
        });
      } else {
        handleTableOrDb(table, jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree_content'));
      }
    } else if ($dbItem) {
      fullExpand(table, $dbItem);
    }
  } else if (jquery__WEBPACK_IMPORTED_MODULE_0__('#navi_db_select').length && jquery__WEBPACK_IMPORTED_MODULE_0__('#navi_db_select').val()) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#navi_db_select').val('').hide().trigger('change');
  } else if (autoexpand && jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree_content > ul > li.database').length === 1) {
    // automatically expand the list if there is only single database
    // find the name of the database
    var dbItemName = '';
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree_content > ul > li.database').children('a').each(function () {
      var name = jquery__WEBPACK_IMPORTED_MODULE_0__(this).text();

      if (!dbItemName && name.trim()) {
        // if the name is not empty, it is the desired element
        dbItemName = name;
      }
    });
    $dbItem = findLoadedItem(jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').find('> div'), dbItemName, 'database', !table);
    fullExpand(table, $dbItem);
  }

  Navigation.showFullName(jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree'));

  function fullExpand(table, $dbItem) {
    var $expander = $dbItem.children('div').first().children('a.expander'); // if not loaded or loaded but collapsed

    if (!$expander.hasClass('loaded') || $expander.find('img').is('.ic_b_plus')) {
      Navigation.expandTreeNode($expander, function () {
        handleTableOrDb(table, $dbItem);
      });
    } else {
      handleTableOrDb(table, $dbItem);
    }
  }

  function handleTableOrDb(table, $dbItem) {
    if (table) {
      loadAndHighlightTableOrView($dbItem, table);
    } else {
      var $container = $dbItem.children('div.list_container');
      var $tableContainer = $container.children('ul').children('li.tableContainer');

      if ($tableContainer.length > 0) {
        var $expander = $tableContainer.children('div').first().children('a.expander');
        $tableContainer.addClass('selected');
        Navigation.expandTreeNode($expander, function () {
          Navigation.scrollToView($dbItem, true);
        });
      } else {
        Navigation.scrollToView($dbItem, true);
      }
    }
  }

  function findLoadedItem($container, name, clazz, doSelect) {
    var ret = false;
    $container.children('ul').children('li').each(function () {
      var $li = jquery__WEBPACK_IMPORTED_MODULE_0__(this); // this is a navigation group, recurse

      if ($li.is('.navGroup')) {
        var $container = $li.children('div.list_container');
        var $childRet = findLoadedItem($container, name, clazz, doSelect);

        if ($childRet) {
          ret = $childRet;
          return false;
        }
      } else {
        // this is a real navigation item
        // name and class matches
        if ((clazz && $li.is('.' + clazz) || !clazz) && $li.children('a').text() === name) {
          if (doSelect) {
            $li.addClass('selected');
          } // traverse up and expand and parent navigation groups


          $li.parents('.navGroup').each(function () {
            var $cont = jquery__WEBPACK_IMPORTED_MODULE_0__(this).children('div.list_container');

            if (!$cont.is(':visible')) {
              jquery__WEBPACK_IMPORTED_MODULE_0__(this).children('div').first().children('a.expander').trigger('click');
            }
          });
          ret = $li;
          return false;
        }
      }
    });
    return ret;
  }

  function loadAndHighlightTableOrView($dbItem, itemName) {
    var $container = $dbItem.children('div.list_container');
    var $expander;
    var $whichItem = isItemInContainer($container, itemName, 'li.nav_node_table, li.view'); // If item already there in some container

    if ($whichItem) {
      // get the relevant container while may also be a subcontainer
      var $relatedContainer = $whichItem.closest('li.subContainer').length ? $whichItem.closest('li.subContainer') : $dbItem;
      $whichItem = findLoadedItem($relatedContainer.children('div.list_container'), itemName, null, true); // Show directly

      showTableOrView($whichItem, $relatedContainer.children('div').first().children('a.expander')); // else if item not there, try loading once
    } else {
      var $subContainers = $dbItem.find('.subContainer'); // If there are subContainers i.e. tableContainer or viewContainer

      if ($subContainers.length > 0) {
        var $containers = [];
        $subContainers.each(function (index) {
          $containers[index] = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
          $expander = $containers[index].children('div').first().children('a.expander');

          if (!$expander.hasClass('loaded')) {
            loadAndShowTableOrView($expander, $containers[index], itemName);
          }
        }); // else if no subContainers
      } else {
        $expander = $dbItem.children('div').first().children('a.expander');

        if (!$expander.hasClass('loaded')) {
          loadAndShowTableOrView($expander, $dbItem, itemName);
        }
      }
    }
  }

  function loadAndShowTableOrView($expander, $relatedContainer, itemName) {
    Navigation.loadChildNodes(true, $expander, function () {
      var $whichItem = findLoadedItem($relatedContainer.children('div.list_container'), itemName, null, true);

      if ($whichItem) {
        showTableOrView($whichItem, $expander);
      }
    });
  }

  function showTableOrView($whichItem, $expander) {
    Navigation.expandTreeNode($expander, function () {
      if ($whichItem) {
        Navigation.scrollToView($whichItem, false);
      }
    });
  }

  function isItemInContainer($container, name, clazz) {
    var $whichItem = null;
    var $items = $container.find(clazz);
    $items.each(function () {
      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).children('a').text() === name) {
        $whichItem = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
        return false;
      }
    });
    return $whichItem;
  }
};
/**
 * Disable navigation panel settings
 *
 * @return {void}
 */


Navigation.disableSettings = function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_settings_icon').addClass('hide');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_settings').remove();
};
/**
 * Ensure that navigation panel settings is properly setup.
 * If not, set it up
 *
 * @param {string} selflink
 *
 * @return {void}
 */


Navigation.ensureSettings = function (selflink) {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_settings_icon').removeClass('hide');

  if (!jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_settings').length) {
    var params = {
      getNaviSettings: true,
      server: window.CommonParams.get('server')
    };
    jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/navigation&ajax_request=1', params, function (data) {
      if (typeof data !== 'undefined' && data.success) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navi_settings_container').html(data.message);
        window.Config.setupRestoreField();
        window.Config.setupValidation();
        jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_settings').find('form').attr('action', selflink);
      } else {
        Functions.ajaxShowMessage(data.error);
      }
    });
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_settings').find('form').attr('action', selflink);
  }
};
/**
 * Reloads the whole navigation tree while preserving its state
 *
 * @param {Function} callback the callback function
 * @param {object} paths stored navigation paths
 *
 * @return {void}
 */


Navigation.reload = function (callback, paths) {
  var params = {
    'reload': true,
    'no_debug': true,
    'server': window.CommonParams.get('server')
  };
  var pathsLocal = paths || Navigation.traverseForPaths();
  jquery__WEBPACK_IMPORTED_MODULE_0__.extend(params, pathsLocal);

  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#navi_db_select').length) {
    params.db = window.CommonParams.get('db');
    requestNaviReload(params);
    return;
  }

  requestNaviReload(params);

  function requestNaviReload(params) {
    jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/navigation&ajax_request=1', params, function (data) {
      if (typeof data !== 'undefined' && data.success) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').html(data.message).children('div').show();

        if (jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').hasClass('synced')) {
          Navigation.selectCurrentDatabase();
          Navigation.showCurrent();
        } // Fire the callback, if any


        if (typeof callback === 'function') {
          callback.call();
        }

        Navigation.treeStateUpdate();
      } else {
        Functions.ajaxShowMessage(data.error);
      }
    });
  }
};

Navigation.selectCurrentDatabase = function () {
  var $naviDbSelect = jquery__WEBPACK_IMPORTED_MODULE_0__('#navi_db_select');

  if (!$naviDbSelect.length) {
    return false;
  }

  if (window.CommonParams.get('db')) {
    // db selected
    $naviDbSelect.show();
  }

  $naviDbSelect.val(window.CommonParams.get('db'));
  return $naviDbSelect.val() === window.CommonParams.get('db');
};
/**
 * Handles any requests to change the page in a branch of a tree
 *
 * This can be called from link click or select change event handlers
 *
 * @param {object} $this A jQuery object that points to the element that
 * initiated the action of changing the page
 *
 * @return {void}
 */


Navigation.treePagination = function ($this) {
  var $msgbox = Functions.ajaxShowMessage();
  var isDbSelector = $this.closest('div.pageselector').is('.dbselector');
  var url = 'index.php?route=/navigation';
  var params = 'ajax_request=true';

  if ($this[0].tagName === 'A') {
    params += window.CommonParams.get('arg_separator') + $this.getPostData();
  } else {
    // tagName === 'SELECT'
    params += window.CommonParams.get('arg_separator') + $this.closest('form').serialize();
  }

  var searchClause = Navigation.FastFilter.getSearchClause();

  if (searchClause) {
    params += window.CommonParams.get('arg_separator') + 'searchClause=' + encodeURIComponent(searchClause);
  }

  if (isDbSelector) {
    params += window.CommonParams.get('arg_separator') + 'full=true';
  } else {
    var searchClause2 = Navigation.FastFilter.getSearchClause2($this);

    if (searchClause2) {
      params += window.CommonParams.get('arg_separator') + 'searchClause2=' + encodeURIComponent(searchClause2);
    }
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, function (data) {
    if (typeof data !== 'undefined' && data.success) {
      Functions.ajaxRemoveMessage($msgbox);
      var val;

      if (isDbSelector) {
        val = Navigation.FastFilter.getSearchClause();
        jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').html(data.message).children('div').show();

        if (val) {
          jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').find('li.fast_filter input.searchClause').val(val);
        }
      } else {
        var $parent = $this.closest('div.list_container').parent();
        val = Navigation.FastFilter.getSearchClause2($this);
        $this.closest('div.list_container').html(jquery__WEBPACK_IMPORTED_MODULE_0__(data.message).children().show());

        if (val) {
          $parent.find('li.fast_filter input.searchClause').val(val);
        }

        $parent.find('span.pos2_value').first().text($parent.find('span.pos2_value').last().text());
        $parent.find('span.pos3_value').first().text($parent.find('span.pos3_value').last().text());
      }
    } else {
      Functions.ajaxShowMessage(data.error);
      Functions.handleRedirectAndReload(data);
    }

    Navigation.treeStateUpdate();
  });
};
/**
 * ResizeHandler Custom object that manages the resizing of the navigation
 *
 * XXX: Must only be ever instanciated once
 * XXX: Inside event handlers the 'this' object is accessed as 'event.data.resize_handler'
 */


Navigation.ResizeHandler = function () {
  /**
   * @var {number} panelWidth Used by the collapser to know where to go
   *                      back to when uncollapsing the panel
   */
  this.panelWidth = 0;
  /**
   * @var {string} left Used to provide support for RTL languages
   */

  this.left = jquery__WEBPACK_IMPORTED_MODULE_0__('html').attr('dir') === 'ltr' ? 'left' : 'right';
  /**
   * Adjusts the width of the navigation panel to the specified value
   *
   * @param {number} position Navigation width in pixels
   *
   * @return {void}
   */

  this.setWidth = function (position) {
    var pos = position;

    if (typeof pos !== 'number') {
      pos = 240;
    }

    var $resizer = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_resizer');
    var resizerWidth = $resizer.width();
    var $collapser = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_collapser');
    var windowWidth = jquery__WEBPACK_IMPORTED_MODULE_0__(window).width();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation').width(pos);
    jquery__WEBPACK_IMPORTED_MODULE_0__('body').css('margin-' + this.left, pos + 'px'); // Issue #15127 : Adding fixed positioning to menubar
    // Issue #15570 : Panels on homescreen go underneath of floating menubar

    jquery__WEBPACK_IMPORTED_MODULE_0__('#floating_menubar').css('margin-' + this.left, jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation').width() + jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_resizer').width()).css(this.left, 0).css({
      'position': 'fixed',
      'top': 0,
      'width': '100%',
      'z-index': 99
    }).append(jquery__WEBPACK_IMPORTED_MODULE_0__('#server-breadcrumb')).append(jquery__WEBPACK_IMPORTED_MODULE_0__('#topmenucontainer')); // Allow the DOM to render, then adjust the padding on the body

    setTimeout(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__('body').css('padding-top', jquery__WEBPACK_IMPORTED_MODULE_0__('#floating_menubar').outerHeight(true));
    }, 2);
    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').css('margin-' + this.left, pos + resizerWidth + 'px');
    $resizer.css(this.left, pos + 'px');

    if (pos === 0) {
      $collapser.css(this.left, pos + resizerWidth).html(this.getSymbol(pos)).prop('title', window.Messages.strShowPanel);
    } else if (windowWidth > 768) {
      $collapser.css(this.left, pos).html(this.getSymbol(pos)).prop('title', window.Messages.strHidePanel);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_resizer').css({
        'width': '3px'
      });
    } else {
      $collapser.css(this.left, windowWidth - 22).html(this.getSymbol(100)).prop('title', window.Messages.strHidePanel);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation').width(windowWidth);
      jquery__WEBPACK_IMPORTED_MODULE_0__('body').css('margin-' + this.left, '0px');
      jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_resizer').css({
        'width': '0px'
      });
    }

    setTimeout(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__(window).trigger('resize');
    }, 4);
  };
  /**
   * Returns the horizontal position of the mouse,
   * relative to the outer side of the navigation panel
   *
   * @param {MouseEvent} event
   *
   * @return {number} Navigation width in pixels
   */


  this.getPos = function (event) {
    var pos = event.pageX;
    var windowWidth = jquery__WEBPACK_IMPORTED_MODULE_0__(window).width();
    var windowScroll = jquery__WEBPACK_IMPORTED_MODULE_0__(window).scrollLeft();
    pos = pos - windowScroll;

    if (this.left !== 'left') {
      pos = windowWidth - event.pageX;
    }

    if (pos < 0) {
      pos = 0;
    } else if (pos + 100 >= windowWidth) {
      pos = windowWidth - 100;
    } else {
      this.panelWidth = 0;
    }

    return pos;
  };
  /**
   * Returns the HTML code for the arrow symbol used in the collapser
   *
   * @param {number} width The width of the panel
   *
   * @return {string}
   */


  this.getSymbol = function (width) {
    if (this.left === 'left') {
      if (width === 0) {
        return '&rarr;';
      } else {
        return '&larr;';
      }
    } else {
      if (width === 0) {
        return '&larr;';
      } else {
        return '&rarr;';
      }
    }
  };
  /**
   * Event handler for initiating a resize of the panel
   *
   * @param {object} event Event data (contains a reference to Navigation.ResizeHandler)
   *
   * @return {void}
   */


  this.mousedown = function (event) {
    event.preventDefault();
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mousemove', {
      'resize_handler': event.data.resize_handler
    }, event.data.resize_handler.mousemove).on('mouseup', {
      'resize_handler': event.data.resize_handler
    }, event.data.resize_handler.mouseup);
    jquery__WEBPACK_IMPORTED_MODULE_0__('body').css('cursor', 'col-resize');
  };
  /**
   * Event handler for terminating a resize of the panel
   *
   * @param {object} event Event data (contains a reference to Navigation.ResizeHandler)
   *
   * @return {void}
   */


  this.mouseup = function (event) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('body').css('cursor', '');
    Functions.configSet('NavigationWidth', event.data.resize_handler.getPos(event));
    jquery__WEBPACK_IMPORTED_MODULE_0__('#topmenu').menuResizer('resize');
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).off('mousemove').off('mouseup');
  };
  /**
   * Event handler for updating the panel during a resize operation
   *
   * @param {object} event Event data (contains a reference to Navigation.ResizeHandler)
   *
   * @return {void}
   */


  this.mousemove = function (event) {
    event.preventDefault();

    if (event.data && event.data.resize_handler) {
      var pos = event.data.resize_handler.getPos(event);
      event.data.resize_handler.setWidth(pos);
    }
  };
  /**
   * Event handler for collapsing the panel
   *
   * @param {object} event Event data (contains a reference to Navigation.ResizeHandler)
   *
   * @return {void}
   */


  this.collapse = function (event) {
    event.preventDefault();
    var panelWidth = event.data.resize_handler.panelWidth;
    var width = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation').width();

    if (width === 0 && panelWidth === 0) {
      panelWidth = 240;
    }

    Functions.configSet('NavigationWidth', panelWidth);
    event.data.resize_handler.setWidth(panelWidth);
    event.data.resize_handler.panelWidth = width;
  };
  /**
   * Event handler for resizing the navigation tree height on window resize
   *
   * @return {void}
   */


  this.treeResize = function () {
    var $nav = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation');
    var $navTree = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree');
    var $navHeader = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_header');
    var $navTreeContent = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree_content');
    var height = $nav.height() - $navHeader.height();
    height = height > 50 ? height : 800; // keep min. height

    $navTree.height(height);

    if ($navTreeContent.length > 0) {
      $navTreeContent.height(height - $navTreeContent.position().top);
    } else {
      // TODO: in fast filter search response there is no #pma_navigation_tree_content, needs to be added in php
      $navTree.css({
        'overflow-y': 'auto'
      });
    } // Set content bottom space because of console


    jquery__WEBPACK_IMPORTED_MODULE_0__('body').css('margin-bottom', jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_console').height() + 'px');
  };
  /**
   * Init handlers for the tree resizers
   *
   * @return {void}
   */


  this.treeInit = function () {
    const isLoadedOnMobile = jquery__WEBPACK_IMPORTED_MODULE_0__(window).width() < 768; // Hide the pma_navigation initially when loaded on mobile

    if (isLoadedOnMobile) {
      this.setWidth(0);
    } // Register the events for the resizer and the collapser


    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('mousedown', '#pma_navigation_resizer', {
      'resize_handler': this
    }, this.mousedown);
    jquery__WEBPACK_IMPORTED_MODULE_0__(document).on('click', '#pma_navigation_collapser', {
      'resize_handler': this
    }, this.collapse); // Add the correct arrow symbol to the collapser

    jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_collapser').html(this.getSymbol(jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation').width())); // Fix navigation tree height

    jquery__WEBPACK_IMPORTED_MODULE_0__(window).on('resize', this.treeResize); // need to call this now and then, browser might decide
    // to show/hide horizontal scrollbars depending on page content width

    setInterval(this.treeResize, 2000);
    this.treeResize();

    const callbackSuccessGetConfigValue = data => {
      this.setWidth(data);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#topmenu').menuResizer('resize');
    }; // Skip mobile


    if (isLoadedOnMobile === false) {
      // Make an init using the default found value
      const initialResizeValue = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation').data('config-navigation-width');
      callbackSuccessGetConfigValue(initialResizeValue);
    }

    Functions.configGet('NavigationWidth', false, callbackSuccessGetConfigValue);
  };

  this.treeInit();
};
/**
 * @var {object} FastFilter Handles the functionality that allows filtering
 *                          of the items in a branch of the navigation tree
 */


Navigation.FastFilter = {
  /**
   * Construct for the asynchronous fast filter functionality
   *
   * @param {object} $this        A jQuery object pointing to the list container
   *                              which is the nearest parent of the fast filter
   * @param {string} searchClause The query string for the filter
   *
   * @return {void}
   */
  Filter: function ($this, searchClause) {
    /**
     * @var {object} $this A jQuery object pointing to the list container
     *                     which is the nearest parent of the fast filter
     */
    this.$this = $this;
    /**
     * @var {boolean} searchClause The query string for the filter
     */

    this.searchClause = searchClause;
    /**
     * @var {object} $clone A clone of the original contents
     *                      of the navigation branch before
     *                      the fast filter was applied
     */

    this.$clone = $this.clone();
    /**
     * @var {object} xhr A reference to the ajax request that is currently running
     * @type {JQuery.jqXHR<any> | null}
     */

    this.xhr = null;
    /**
     * @var {number} timeout Used to delay the request for asynchronous search
     */

    this.timeout = null;
    var $filterInput = $this.find('li.fast_filter input.searchClause');

    if ($filterInput.length !== 0 && $filterInput.val() !== '' && $filterInput.val() !== $filterInput[0].defaultValue) {
      this.request();
    }
  },

  /**
   * Gets the query string from the database fast filter form
   *
   * @return {string}
   */
  getSearchClause: function () {
    var retval = '';
    var $input = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').find('li.fast_filter.db_fast_filter input.searchClause');

    if ($input.length && $input.val() !== $input[0].defaultValue) {
      retval = $input.val();
    }

    return retval;
  },

  /**
   * Gets the query string from a second level item's fast filter form
   * The retrieval is done by traversing the navigation tree backwards
   *
   * @param $this
   *
   * @return {string}
   */
  getSearchClause2: function ($this) {
    var $filterContainer = $this.closest('div.list_container');
    var $filterInput = jquery__WEBPACK_IMPORTED_MODULE_0__([]);

    if ($filterContainer.find('li.fast_filter:not(.db_fast_filter) input.searchClause').length !== 0) {
      $filterInput = $filterContainer.find('li.fast_filter:not(.db_fast_filter) input.searchClause');
    }

    var searchClause2 = '';

    if ($filterInput.length !== 0 && $filterInput.first().val() !== $filterInput[0].defaultValue) {
      searchClause2 = $filterInput.val();
    }

    return searchClause2;
  },

  /**
   * @var hash events A list of functions that are bound to DOM events
   *                  at the top of this file
   */
  events: {
    focus: function () {
      var $obj = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('div.list_container');

      if (!$obj.data('fastFilter')) {
        $obj.data('fastFilter', new Navigation.FastFilter.Filter($obj, jquery__WEBPACK_IMPORTED_MODULE_0__(this).val()));
      }

      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() === this.defaultValue) {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).val('');
      } else {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).trigger('select');
      }
    },
    blur: function () {
      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() === '') {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).val(this.defaultValue);
      }

      var $obj = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('div.list_container');

      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() === this.defaultValue && $obj.data('fastFilter')) {
        $obj.data('fastFilter').restore();
      }
    },
    keyup: function (event) {
      var $obj = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('div.list_container');
      var str = '';

      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() !== this.defaultValue && jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() !== '') {
        $obj.find('div.pageselector').hide();
        str = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();
      }
      /**
       * FIXME at the server level a value match is done while on
       * the client side it is a regex match. These two should be aligned
       */
      // regex used for filtering.


      var regex;

      try {
        regex = new RegExp(str, 'i');
      } catch (err) {
        return;
      } // this is the div that houses the items to be filtered by this filter.


      var outerContainer;

      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('li.fast_filter').is('.db_fast_filter')) {
        outerContainer = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree_content');
      } else {
        outerContainer = $obj;
      } // filters items that are directly under the div as well as grouped in
      // groups. Does not filter child items (i.e. a database search does
      // not filter tables)


      var itemFilter = function ($curr) {
        $curr.children('ul').children('li.navGroup').each(function () {
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).children('div.list_container').each(function () {
            itemFilter(jquery__WEBPACK_IMPORTED_MODULE_0__(this)); // recursive
          });
        });
        $curr.children('ul').children('li').children('a').not('.container').each(function () {
          if (regex.test(jquery__WEBPACK_IMPORTED_MODULE_0__(this).text())) {
            jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().show().removeClass('hidden');
          } else {
            jquery__WEBPACK_IMPORTED_MODULE_0__(this).parent().hide().addClass('hidden');
          }
        });
      };

      itemFilter(outerContainer); // hides containers that does not have any visible children

      var containerFilter = function ($curr) {
        $curr.children('ul').children('li.navGroup').each(function () {
          var $group = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
          $group.children('div.list_container').each(function () {
            containerFilter(jquery__WEBPACK_IMPORTED_MODULE_0__(this)); // recursive
          });
          $group.show().removeClass('hidden');

          if ($group.children('div.list_container').children('ul').children('li').not('.hidden').length === 0) {
            $group.hide().addClass('hidden');
          }
        });
      };

      containerFilter(outerContainer);

      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() !== this.defaultValue && jquery__WEBPACK_IMPORTED_MODULE_0__(this).val() !== '') {
        if (!$obj.data('fastFilter')) {
          $obj.data('fastFilter', new Navigation.FastFilter.Filter($obj, jquery__WEBPACK_IMPORTED_MODULE_0__(this).val()));
        } else {
          if (event.keyCode === 13) {
            $obj.data('fastFilter').update(jquery__WEBPACK_IMPORTED_MODULE_0__(this).val());
          }
        }
      } else if ($obj.data('fastFilter')) {
        $obj.data('fastFilter').restore(true);
      } // update filter state


      var filterName;

      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('name') === 'searchClause2') {
        filterName = jquery__WEBPACK_IMPORTED_MODULE_0__(this).siblings('input[name=aPath]').val();
      } else {
        filterName = 'dbFilter';
      }

      Navigation.filterStateUpdate(filterName, jquery__WEBPACK_IMPORTED_MODULE_0__(this).val());
    },
    clear: function (event) {
      event.stopPropagation(); // Clear the input and apply the fast filter with empty input

      var filter = jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('div.list_container').data('fastFilter');

      if (filter) {
        filter.restore();
      }

      var value = jquery__WEBPACK_IMPORTED_MODULE_0__(this).prev()[0].defaultValue;
      jquery__WEBPACK_IMPORTED_MODULE_0__(this).prev().val(value).trigger('keyup');
    }
  }
};
/**
 * Handles a change in the search clause
 *
 * @param {string} searchClause The query string for the filter
 *
 * @return {void}
 */

Navigation.FastFilter.Filter.prototype.update = function (searchClause) {
  if (this.searchClause !== searchClause) {
    this.searchClause = searchClause;
    this.request();
  }
};
/**
 * After a delay of 250mS, initiates a request to retrieve search results
 * Multiple calls to this function will always abort the previous request
 *
 * @return {void}
 */


Navigation.FastFilter.Filter.prototype.request = function () {
  var self = this;

  if (self.$this.find('li.fast_filter').find('img.throbber').length === 0) {
    self.$this.find('li.fast_filter').append(jquery__WEBPACK_IMPORTED_MODULE_0__('<div class="throbber"></div>').append(jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_content').find('img.throbber').clone().css({
      visibility: 'visible',
      display: 'block'
    })));
  }

  if (self.xhr) {
    self.xhr.abort();
  }

  var params = self.$this.find('> ul > li > form.fast_filter').first().serialize();

  if (self.$this.find('> ul > li > form.fast_filter').first().find('input[name=searchClause]').length === 0) {
    var $input = jquery__WEBPACK_IMPORTED_MODULE_0__('#pma_navigation_tree').find('li.fast_filter.db_fast_filter input.searchClause');

    if ($input.length && $input.val() !== $input[0].defaultValue) {
      params += window.CommonParams.get('arg_separator') + 'searchClause=' + encodeURIComponent($input.val());
    }
  }

  self.xhr = jquery__WEBPACK_IMPORTED_MODULE_0__.ajax({
    url: 'index.php?route=/navigation&ajax_request=1&server=' + window.CommonParams.get('server'),
    type: 'post',
    dataType: 'json',
    data: params,
    complete: function (jqXHR, status) {
      if (status !== 'abort') {
        var data = JSON.parse(jqXHR.responseText);
        self.$this.find('li.fast_filter').find('div.throbber').remove();

        if (data && data.results) {
          self.swap.apply(self, [data.message]);
        }
      }
    }
  });
};
/**
 * Replaces the contents of the navigation branch with the search results
 *
 * @param {string} list The search results
 *
 * @return {void}
 */


Navigation.FastFilter.Filter.prototype.swap = function (list) {
  this.$this.html(jquery__WEBPACK_IMPORTED_MODULE_0__(list).html()).children().show().end().find('li.fast_filter input.searchClause').val(this.searchClause);
  this.$this.data('fastFilter', this);
};
/**
 * Restores the navigation to the original state after the fast filter is cleared
 *
 * @param {boolean} focus Whether to also focus the input box of the fast filter
 *
 * @return {void}
 */


Navigation.FastFilter.Filter.prototype.restore = function (focus) {
  if (this.$this.children('ul').first().hasClass('search_results')) {
    this.$this.html(this.$clone.html()).children().show();
    this.$this.data('fastFilter', this);

    if (focus) {
      this.$this.find('li.fast_filter input.searchClause').trigger('focus');
    }
  }

  this.searchClause = '';
  this.$this.find('div.pageselector').show();
  this.$this.find('div.throbber').remove();
};
/**
 * Show full name when cursor hover and name not shown completely
 *
 * @param {object} $containerELem Container element
 *
 * @return {void}
 */


Navigation.showFullName = function ($containerELem) {
  $containerELem.find('.hover_show_full').on('mouseenter', function () {
    /** mouseenter */
    var $this = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
    var thisOffset = $this.offset();

    if ($this.text() === '') {
      return;
    }

    var $parent = $this.parent();

    if ($parent.offset().left + $parent.outerWidth() < thisOffset.left + $this.outerWidth()) {
      var $fullNameLayer = jquery__WEBPACK_IMPORTED_MODULE_0__('#full_name_layer');

      if ($fullNameLayer.length === 0) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('body').append('<div id="full_name_layer" class="hide"></div>');
        jquery__WEBPACK_IMPORTED_MODULE_0__('#full_name_layer').on('mouseleave', function () {
          /** mouseleave */
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).addClass('hide').removeClass('hovering');
        }).on('mouseenter', function () {
          /** mouseenter */
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).addClass('hovering');
        });
        $fullNameLayer = jquery__WEBPACK_IMPORTED_MODULE_0__('#full_name_layer');
      }

      $fullNameLayer.removeClass('hide');
      $fullNameLayer.css({
        left: thisOffset.left,
        top: thisOffset.top
      });
      $fullNameLayer.html($this.clone());
      setTimeout(function () {
        if (!$fullNameLayer.hasClass('hovering')) {
          $fullNameLayer.trigger('mouseleave');
        }
      }, 200);
    }
  });
};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(49));
/******/ }
]);
//# sourceMappingURL=navigation.js.map