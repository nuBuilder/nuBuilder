"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[27],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 31:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * Functions used in the export tab
 *
 */

var Export = {};
/**
 * Disables the "Dump some row(s)" sub-options
 */

Export.disableDumpSomeRowsSubOptions = function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('label[for=\'limit_to\']').fadeTo('fast', 0.4);
  jquery__WEBPACK_IMPORTED_MODULE_0__('label[for=\'limit_from\']').fadeTo('fast', 0.4);
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'text\'][name=\'limit_to\']').prop('disabled', 'disabled');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'text\'][name=\'limit_from\']').prop('disabled', 'disabled');
};
/**
 * Enables the "Dump some row(s)" sub-options
 */


Export.enableDumpSomeRowsSubOptions = function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('label[for=\'limit_to\']').fadeTo('fast', 1);
  jquery__WEBPACK_IMPORTED_MODULE_0__('label[for=\'limit_from\']').fadeTo('fast', 1);
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'text\'][name=\'limit_to\']').prop('disabled', '');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'text\'][name=\'limit_from\']').prop('disabled', '');
};
/**
 * Return template data as a json object
 *
 * @return {object} template data
 */


Export.getTemplateData = function () {
  var $form = jquery__WEBPACK_IMPORTED_MODULE_0__('form[name="dump"]');
  var excludeList = ['token', 'server', 'db', 'table', 'single_table', 'export_type', 'export_method', 'sql_query', 'template_id'];
  var obj = {};
  var arr = $form.serializeArray();
  jquery__WEBPACK_IMPORTED_MODULE_0__.each(arr, function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__.inArray(this.name, excludeList) < 0) {
      if (obj[this.name] !== undefined) {
        if (!obj[this.name].push) {
          obj[this.name] = [obj[this.name]];
        }

        obj[this.name].push(this.value || '');
      } else {
        obj[this.name] = this.value || '';
      }
    }
  }); // include unchecked checkboxes (which are ignored by serializeArray()) with null
  // to uncheck them when loading the template

  $form.find('input[type="checkbox"]:not(:checked)').each(function () {
    if (obj[this.name] === undefined) {
      obj[this.name] = null;
    }
  }); // include empty multiselects

  $form.find('select').each(function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('option:selected').length === 0) {
      obj[this.name] = [];
    }
  });
  return obj;
};
/**
 * Create a template with selected options
 *
 * @param name name of the template
 */


Export.createTemplate = function (name) {
  var templateData = Export.getTemplateData();
  var params = {
    'ajax_request': true,
    'server': window.CommonParams.get('server'),
    'db': window.CommonParams.get('db'),
    'table': window.CommonParams.get('table'),
    'exportType': jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="export_type"]').val(),
    'templateName': name,
    'templateData': JSON.stringify(templateData)
  };
  Functions.ajaxShowMessage();
  jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/export/template/create', params, function (response) {
    if (response.success === true) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#templateName').val('');
      jquery__WEBPACK_IMPORTED_MODULE_0__('#template').html(response.data);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#template').find('option').each(function () {
        if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).text() === name) {
          jquery__WEBPACK_IMPORTED_MODULE_0__(this).prop('selected', true);
        }
      });
      Functions.ajaxShowMessage(window.Messages.strTemplateCreated);
    } else {
      Functions.ajaxShowMessage(response.error, false);
    }
  });
};
/**
 * Loads a template
 *
 * @param id ID of the template to load
 */


Export.loadTemplate = function (id) {
  var params = {
    'ajax_request': true,
    'server': window.CommonParams.get('server'),
    'db': window.CommonParams.get('db'),
    'table': window.CommonParams.get('table'),
    'exportType': jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="export_type"]').val(),
    'templateId': id
  };
  Functions.ajaxShowMessage();
  jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/export/template/load', params, function (response) {
    if (response.success === true) {
      var $form = jquery__WEBPACK_IMPORTED_MODULE_0__('form[name="dump"]');
      var options = JSON.parse(response.data);
      jquery__WEBPACK_IMPORTED_MODULE_0__.each(options, function (key, value) {
        var localValue = value;
        var $element = $form.find('[name="' + key + '"]');

        if ($element.length) {
          if ($element.is('input') && $element.attr('type') === 'checkbox' && localValue === null) {
            $element.prop('checked', false);
          } else {
            if ($element.is('input') && $element.attr('type') === 'checkbox' || $element.is('input') && $element.attr('type') === 'radio' || $element.is('select') && $element.attr('multiple') === 'multiple') {
              if (!localValue.push) {
                localValue = [localValue];
              }
            }

            $element.val(localValue);
          }

          $element.trigger('change');
        }
      });
      jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="template_id"]').val(id);
      Functions.ajaxShowMessage(window.Messages.strTemplateLoaded);
    } else {
      Functions.ajaxShowMessage(response.error, false);
    }
  });
};
/**
 * Updates an existing template with current options
 *
 * @param id ID of the template to update
 */


Export.updateTemplate = function (id) {
  var templateData = Export.getTemplateData();
  var params = {
    'ajax_request': true,
    'server': window.CommonParams.get('server'),
    'db': window.CommonParams.get('db'),
    'table': window.CommonParams.get('table'),
    'exportType': jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="export_type"]').val(),
    'templateId': id,
    'templateData': JSON.stringify(templateData)
  };
  Functions.ajaxShowMessage();
  jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/export/template/update', params, function (response) {
    if (response.success === true) {
      Functions.ajaxShowMessage(window.Messages.strTemplateUpdated);
    } else {
      Functions.ajaxShowMessage(response.error, false);
    }
  });
};
/**
 * Delete a template
 *
 * @param id ID of the template to delete
 */


Export.deleteTemplate = function (id) {
  var params = {
    'ajax_request': true,
    'server': window.CommonParams.get('server'),
    'db': window.CommonParams.get('db'),
    'table': window.CommonParams.get('table'),
    'exportType': jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="export_type"]').val(),
    'templateId': id
  };
  Functions.ajaxShowMessage();
  jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/export/template/delete', params, function (response) {
    if (response.success === true) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#template').find('option[value="' + id + '"]').remove();
      Functions.ajaxShowMessage(window.Messages.strTemplateDeleted);
    } else {
      Functions.ajaxShowMessage(response.error, false);
    }
  });
};
/**
 * Unbind all event handlers before tearing down a page
 */


window.AJAX.registerTeardown('export.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name=\'sql_structure_or_data\']').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name$=\'_structure_or_data\']').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name=\'output_format\']').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_include_comments').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name=\'quick_or_custom\']').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name=\'allrows\']').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#btn_alias_config').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('.alias_remove').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_alias_button').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#table_alias_button').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#column_alias_button').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_select[]"]').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_structure[]"]').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_data[]"]').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#table_structure_all').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('#table_data_all').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="createTemplate"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="template"]').off('change');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="updateTemplate"]').off('click');
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="deleteTemplate"]').off('click');
});
window.AJAX.registerOnload('export.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#showsqlquery').on('click', function () {
    // Creating a dialog box similar to preview sql container to show sql query
    var modal = jquery__WEBPACK_IMPORTED_MODULE_0__('#showSqlQueryModal');
    modal.modal('show');
    modal.on('shown.bs.modal', function () {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#showSqlQueryModalLabel').first().html(window.Messages.strQuery);
      Functions.highlightSql(modal);
    });
  });
  /**
   * Export template handling code
   */
  // create a new template

  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="createTemplate"]').on('click', function (e) {
    e.preventDefault();
    var name = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="templateName"]').val();

    if (name.length) {
      Export.createTemplate(name);
    }
  }); // load an existing template

  jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="template"]').on('change', function (e) {
    e.preventDefault();
    var id = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();

    if (id.length) {
      Export.loadTemplate(id);
    }
  }); // update an existing template with new criteria

  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="updateTemplate"]').on('click', function (e) {
    e.preventDefault();
    var id = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="template"]').val();

    if (id.length) {
      Export.updateTemplate(id);
    }
  }); // delete an existing template

  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="deleteTemplate"]').on('click', function (e) {
    e.preventDefault();
    var id = jquery__WEBPACK_IMPORTED_MODULE_0__('select[name="template"]').val();

    if (id.length) {
      Export.deleteTemplate(id);
    }
  });
  /**
   * Toggles the hiding and showing of each plugin's options
   * according to the currently selected plugin from the dropdown list
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins').on('change', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#format_specific_opts').find('div.format_specific_options').addClass('d-none');
    var selectedPluginName = jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins').find('option:selected').val();
    jquery__WEBPACK_IMPORTED_MODULE_0__('#' + selectedPluginName + '_options').removeClass('d-none');
  });
  /**
   * Toggles the enabling and disabling of the SQL plugin's comment options that apply only when exporting structure
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name=\'sql_structure_or_data\']').on('change', function () {
    var commentsArePresent = jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_include_comments').prop('checked');
    var show = jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name=\'sql_structure_or_data\']:checked').val();

    if (show === 'data') {
      // disable the SQL comment options
      if (commentsArePresent) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_dates').prop('disabled', true).parent().fadeTo('fast', 0.4);
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_relation').prop('disabled', true).parent().fadeTo('fast', 0.4);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_mime').prop('disabled', true).parent().fadeTo('fast', 0.4);
    } else {
      // enable the SQL comment options
      if (commentsArePresent) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_dates').prop('disabled', false).parent().fadeTo('fast', 1);
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_relation').prop('disabled', false).parent().fadeTo('fast', 1);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_mime').prop('disabled', false).parent().fadeTo('fast', 1);
    }

    if (show === 'structure') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_auto_increment').prop('disabled', true).parent().fadeTo('fast', 0.4);
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_auto_increment').prop('disabled', false).parent().fadeTo('fast', 1);
    }
  }); // When MS Excel is selected as the Format automatically Switch to Character Set as windows-1252

  jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins').on('change', function () {
    var selectedPluginName = jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins').find('option:selected').val();

    if (selectedPluginName === 'excel') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#select_charset').val('windows-1252');
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#select_charset').val('utf-8');
    }
  }); // For separate-file exports only ZIP compression is allowed

  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type="checkbox"][name="as_separate_files"]').on('change', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).is(':checked')) {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#compression').val('zip');
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#compression').on('change', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__('option:selected').val() !== 'zip') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('input[type="checkbox"][name="as_separate_files"]').prop('checked', false);
    }
  });
});

Export.setupTableStructureOrData = function () {
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=\'export_type\']').val() !== 'database') {
    return;
  }

  var pluginName = jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins').find('option:selected').val();
  var formElemName = pluginName + '_structure_or_data';
  var forceStructureOrData = !jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=\'' + formElemName + '_default\']').length;

  if (forceStructureOrData === true) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="structure_or_data_forced"]').val(1);
    jquery__WEBPACK_IMPORTED_MODULE_0__('.export_structure input[type="checkbox"], .export_data input[type="checkbox"]').prop('disabled', true);
    jquery__WEBPACK_IMPORTED_MODULE_0__('.export_structure, .export_data').fadeTo('fast', 0.4);
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="structure_or_data_forced"]').val(0);
    jquery__WEBPACK_IMPORTED_MODULE_0__('.export_structure input[type="checkbox"], .export_data input[type="checkbox"]').prop('disabled', false);
    jquery__WEBPACK_IMPORTED_MODULE_0__('.export_structure, .export_data').fadeTo('fast', 1);
    var structureOrData = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="' + formElemName + '_default"]').val();

    if (structureOrData === 'structure') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('.export_data input[type="checkbox"]').prop('checked', false);
    } else if (structureOrData === 'data') {
      jquery__WEBPACK_IMPORTED_MODULE_0__('.export_structure input[type="checkbox"]').prop('checked', false);
    }

    if (structureOrData === 'structure' || structureOrData === 'structure_and_data') {
      if (!jquery__WEBPACK_IMPORTED_MODULE_0__('.export_structure input[type="checkbox"]:checked').length) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_select[]"]:checked').closest('tr').find('.export_structure input[type="checkbox"]').prop('checked', true);
      }
    }

    if (structureOrData === 'data' || structureOrData === 'structure_and_data') {
      if (!jquery__WEBPACK_IMPORTED_MODULE_0__('.export_data input[type="checkbox"]:checked').length) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_select[]"]:checked').closest('tr').find('.export_data input[type="checkbox"]').prop('checked', true);
      }
    }

    Export.checkSelectedTables();
    Export.checkTableSelectAll();
    Export.checkTableSelectStructureOrData();
  }
};
/**
 * Toggles the hiding and showing of plugin structure-specific and data-specific
 * options
 */


Export.toggleStructureDataOpts = function () {
  var pluginName = jquery__WEBPACK_IMPORTED_MODULE_0__('select#plugins').val();
  var radioFormName = pluginName + '_structure_or_data';
  var dataDiv = '#' + pluginName + '_data';
  var structureDiv = '#' + pluginName + '_structure';
  var show = jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name=\'' + radioFormName + '\']:checked').val(); // Show the #rows if 'show' is not structure

  jquery__WEBPACK_IMPORTED_MODULE_0__('#rows').toggle(show !== 'structure');

  if (show === 'data') {
    jquery__WEBPACK_IMPORTED_MODULE_0__(dataDiv).slideDown('slow');
    jquery__WEBPACK_IMPORTED_MODULE_0__(structureDiv).slideUp('slow');
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__(structureDiv).slideDown('slow');

    if (show === 'structure') {
      jquery__WEBPACK_IMPORTED_MODULE_0__(dataDiv).slideUp('slow');
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__(dataDiv).slideDown('slow');
    }
  }
};
/**
 * Toggles the disabling of the "save to file" options
 */


Export.toggleSaveToFile = function () {
  var $ulSaveAsfile = jquery__WEBPACK_IMPORTED_MODULE_0__('#ul_save_asfile');

  if (!jquery__WEBPACK_IMPORTED_MODULE_0__('#radio_dump_asfile').prop('checked')) {
    $ulSaveAsfile.find('> li').fadeTo('fast', 0.4);
    $ulSaveAsfile.find('> li > input').prop('disabled', true);
    $ulSaveAsfile.find('> li > select').prop('disabled', true);
  } else {
    $ulSaveAsfile.find('> li').fadeTo('fast', 1);
    $ulSaveAsfile.find('> li > input').prop('disabled', false);
    $ulSaveAsfile.find('> li > select').prop('disabled', false);
  }
};

window.AJAX.registerOnload('export.js', function () {
  Export.toggleSaveToFile();
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name=\'output_format\']').on('change', Export.toggleSaveToFile);
});
/**
 * For SQL plugin, toggles the disabling of the "display comments" options
 */

Export.toggleSqlIncludeComments = function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_include_comments').on('change', function () {
    var $ulIncludeComments = jquery__WEBPACK_IMPORTED_MODULE_0__('#ul_include_comments');

    if (!jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_include_comments').prop('checked')) {
      $ulIncludeComments.find('> li').fadeTo('fast', 0.4);
      $ulIncludeComments.find('> li > input').prop('disabled', true);
    } else {
      // If structure is not being exported, the comment options for structure should not be enabled
      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#radio_sql_structure_or_data_data').prop('checked')) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#text_sql_header_comment').prop('disabled', false).parent('li').fadeTo('fast', 1);
      } else {
        $ulIncludeComments.find('> li').fadeTo('fast', 1);
        $ulIncludeComments.find('> li > input').prop('disabled', false);
      }
    }
  });
};

Export.checkTableSelectAll = function () {
  var total = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_select[]"]').length;
  var strChecked = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_structure[]"]:checked').length;
  var dataChecked = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_data[]"]:checked').length;
  var strAll = jquery__WEBPACK_IMPORTED_MODULE_0__('#table_structure_all');
  var dataAll = jquery__WEBPACK_IMPORTED_MODULE_0__('#table_data_all');

  if (strChecked === total) {
    strAll.prop('indeterminate', false).prop('checked', true);
  } else if (strChecked === 0) {
    strAll.prop('indeterminate', false).prop('checked', false);
  } else {
    strAll.prop('indeterminate', true).prop('checked', false);
  }

  if (dataChecked === total) {
    dataAll.prop('indeterminate', false).prop('checked', true);
  } else if (dataChecked === 0) {
    dataAll.prop('indeterminate', false).prop('checked', false);
  } else {
    dataAll.prop('indeterminate', true).prop('checked', false);
  }
};

Export.checkTableSelectStructureOrData = function () {
  var dataChecked = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_data[]"]:checked').length;
  var autoIncrement = jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_auto_increment');
  var pluginName = jquery__WEBPACK_IMPORTED_MODULE_0__('select#plugins').val();
  var dataDiv = '#' + pluginName + '_data';

  if (dataChecked === 0) {
    jquery__WEBPACK_IMPORTED_MODULE_0__(dataDiv).slideUp('slow');
    autoIncrement.prop('disabled', true).parent().fadeTo('fast', 0.4);
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__(dataDiv).slideDown('slow');
    autoIncrement.prop('disabled', false).parent().fadeTo('fast', 1);
  }
};

Export.toggleTableSelectAllStr = function () {
  var strAll = jquery__WEBPACK_IMPORTED_MODULE_0__('#table_structure_all').is(':checked');

  if (strAll) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_structure[]"]').prop('checked', true);
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_structure[]"]').prop('checked', false);
  }
};

Export.toggleTableSelectAllData = function () {
  var dataAll = jquery__WEBPACK_IMPORTED_MODULE_0__('#table_data_all').is(':checked');

  if (dataAll) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_data[]"]').prop('checked', true);
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_data[]"]').prop('checked', false);
  }
};

Export.checkSelectedTables = function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('.export_table_select tbody tr').each(function () {
    Export.checkTableSelected(this);
  });
};

Export.checkTableSelected = function (row) {
  var $row = jquery__WEBPACK_IMPORTED_MODULE_0__(row);
  var tableSelect = $row.find('input[name="table_select[]"]');
  var strCheck = $row.find('input[name="table_structure[]"]');
  var dataCheck = $row.find('input[name="table_data[]"]');
  var data = dataCheck.is(':checked:not(:disabled)');
  var structure = strCheck.is(':checked:not(:disabled)');

  if (data && structure) {
    tableSelect.prop({
      checked: true,
      indeterminate: false
    });
    $row.addClass('marked');
  } else if (data || structure) {
    tableSelect.prop({
      checked: true,
      indeterminate: true
    });
    $row.removeClass('marked');
  } else {
    tableSelect.prop({
      checked: false,
      indeterminate: false
    });
    $row.removeClass('marked');
  }
};

Export.toggleTableSelect = function (row) {
  var $row = jquery__WEBPACK_IMPORTED_MODULE_0__(row);
  var tableSelected = $row.find('input[name="table_select[]"]').is(':checked');

  if (tableSelected) {
    $row.find('input[type="checkbox"]:not(:disabled)').prop('checked', true);
    $row.addClass('marked');
  } else {
    $row.find('input[type="checkbox"]:not(:disabled)').prop('checked', false);
    $row.removeClass('marked');
  }
};

Export.handleAddProcCheckbox = function () {
  if (jquery__WEBPACK_IMPORTED_MODULE_0__('#table_structure_all').is(':checked') === true && jquery__WEBPACK_IMPORTED_MODULE_0__('#table_data_all').is(':checked') === true) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_procedure_function').prop('checked', true);
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_procedure_function').prop('checked', false);
  }
};

window.AJAX.registerOnload('export.js', function () {
  /**
   * For SQL plugin, if "CREATE TABLE options" is checked/unchecked, check/uncheck each of its sub-options
   */
  var $create = jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_create_table_statements');
  var $createOptions = jquery__WEBPACK_IMPORTED_MODULE_0__('#ul_create_table_statements').find('input');
  $create.on('change', function () {
    $createOptions.prop('checked', jquery__WEBPACK_IMPORTED_MODULE_0__(this).prop('checked'));
  });
  $createOptions.on('change', function () {
    if ($createOptions.is(':checked')) {
      $create.prop('checked', true);
    }
  });
  /**
   * Disables the view output as text option if the output must be saved as a file
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins').on('change', function () {
    var activePlugin = jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins').find('option:selected').val();
    var forceFile = jquery__WEBPACK_IMPORTED_MODULE_0__('#force_file_' + activePlugin).val();

    if (forceFile === 'true') {
      if (jquery__WEBPACK_IMPORTED_MODULE_0__('#radio_dump_asfile').prop('checked') !== true) {
        jquery__WEBPACK_IMPORTED_MODULE_0__('#radio_dump_asfile').prop('checked', true);
        Export.toggleSaveToFile();
      }

      jquery__WEBPACK_IMPORTED_MODULE_0__('#radio_view_as_text').prop('disabled', true).parent().fadeTo('fast', 0.4);
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0__('#radio_view_as_text').prop('disabled', false).parent().fadeTo('fast', 1);
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name$=\'_structure_or_data\']').on('change', function () {
    Export.toggleStructureDataOpts();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_select[]"]').on('change', function () {
    Export.toggleTableSelect(jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('tr'));
    Export.checkTableSelectAll();
    Export.handleAddProcCheckbox();
    Export.checkTableSelectStructureOrData();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_structure[]"]').on('change', function () {
    Export.checkTableSelected(jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('tr'));
    Export.checkTableSelectAll();
    Export.handleAddProcCheckbox();
    Export.checkTableSelectStructureOrData();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="table_data[]"]').on('change', function () {
    Export.checkTableSelected(jquery__WEBPACK_IMPORTED_MODULE_0__(this).closest('tr'));
    Export.checkTableSelectAll();
    Export.handleAddProcCheckbox();
    Export.checkTableSelectStructureOrData();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#table_structure_all').on('change', function () {
    Export.toggleTableSelectAllStr();
    Export.checkSelectedTables();
    Export.handleAddProcCheckbox();
    Export.checkTableSelectStructureOrData();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#table_data_all').on('change', function () {
    Export.toggleTableSelectAllData();
    Export.checkSelectedTables();
    Export.handleAddProcCheckbox();
    Export.checkTableSelectStructureOrData();
  });

  if (jquery__WEBPACK_IMPORTED_MODULE_0__('input[name=\'export_type\']').val() === 'database') {
    // Hide structure or data radio buttons
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name$=\'_structure_or_data\']').each(function () {
      var $this = jquery__WEBPACK_IMPORTED_MODULE_0__(this);
      var name = $this.prop('name');
      var val = jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="' + name + '"]:checked').val();
      var nameDefault = name + '_default';

      if (!jquery__WEBPACK_IMPORTED_MODULE_0__('input[name="' + nameDefault + '"]').length) {
        $this.after(jquery__WEBPACK_IMPORTED_MODULE_0__('<input type="hidden" name="' + nameDefault + '" value="' + val + '" disabled>')).after(jquery__WEBPACK_IMPORTED_MODULE_0__('<input type="hidden" name="' + name + '" value="structure_and_data">'));
        $this.parent().find('label').remove();
      } else {
        $this.parent().remove();
      }
    });
    jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name$=\'_structure_or_data\']').remove(); // Disable CREATE table checkbox for sql

    var createTableCheckbox = jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_create_table');
    createTableCheckbox.prop('checked', true);
    var dummyCreateTable = jquery__WEBPACK_IMPORTED_MODULE_0__('#checkbox_sql_create_table').clone().removeAttr('id').attr('type', 'hidden');
    createTableCheckbox.prop('disabled', true).after(dummyCreateTable).parent().fadeTo('fast', 0.4);
    Export.setupTableStructureOrData();
  }
  /**
   * Handle force structure_or_data
   */


  jquery__WEBPACK_IMPORTED_MODULE_0__('#plugins').on('change', Export.setupTableStructureOrData);
});
/**
 * Toggles display of options when quick and custom export are selected
 */

function toggleQuickOrCustom() {
  const isCustomNoFormOption = !document.getElementById('quick_or_custom');
  const radioCustomExportElement = document.getElementById('radio_custom_export');
  const isCustomExport = isCustomNoFormOption || radioCustomExportElement instanceof HTMLInputElement && radioCustomExportElement.checked;
  const databasesAndTablesElement = document.getElementById('databases_and_tables');

  if (databasesAndTablesElement) {
    databasesAndTablesElement.classList.toggle('d-none', !isCustomExport);
  }

  const rowsElement = document.getElementById('rows');

  if (rowsElement) {
    rowsElement.classList.toggle('d-none', !isCustomExport);
  }

  const outputElement = document.getElementById('output');

  if (outputElement) {
    outputElement.classList.toggle('d-none', !isCustomExport);
  }

  const formatSpecificOptionsElement = document.getElementById('format_specific_opts');

  if (formatSpecificOptionsElement) {
    formatSpecificOptionsElement.classList.toggle('d-none', !isCustomExport);
  }

  const outputQuickExportElement = document.getElementById('output_quick_export');

  if (outputQuickExportElement) {
    outputQuickExportElement.classList.toggle('d-none', isCustomExport);
  }

  if (!isCustomExport) {
    return;
  }

  const selectedPluginElement = document.querySelector('#plugins > option[selected]');
  const selectedPluginName = selectedPluginElement instanceof HTMLOptionElement ? selectedPluginElement.value : null;

  if (selectedPluginName === null) {
    return;
  }

  const pluginOptionsElement = document.getElementById(selectedPluginName + '_options');

  if (!pluginOptionsElement) {
    return;
  }

  pluginOptionsElement.classList.remove('d-none');
}

var timeOut;

Export.checkTimeOut = function (timeLimit) {
  var limit = timeLimit;

  if (typeof limit === 'undefined' || limit === 0) {
    return true;
  } // margin of one second to avoid race condition to set/access session variable


  limit = limit + 1;
  clearTimeout(timeOut);
  timeOut = setTimeout(function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__.get('index.php?route=/export/check-time-out', {
      'ajax_request': true
    }, function (data) {
      if (data.message === 'timeout') {
        Functions.ajaxShowMessage('<div class="alert alert-danger" role="alert">' + window.Messages.strTimeOutError + '</div>', false);
      }
    });
  }, limit * 1000);
};
/**
 * Handler for Alias dialog box
 *
 * @param event object the event object
 *
 * @return {void}
 */


Export.createAliasModal = function (event) {
  event.preventDefault();
  var modal = jquery__WEBPACK_IMPORTED_MODULE_0__('#renameExportModal');
  modal.modal('show');
  modal.on('shown.bs.modal', function () {
    modal.closest('.ui-dialog').find('.ui-button').addClass('btn btn-secondary');
    var db = window.CommonParams.get('db');

    if (db) {
      var option = jquery__WEBPACK_IMPORTED_MODULE_0__('<option></option>');
      option.text(db);
      option.attr('value', db);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#db_alias_select').append(option).val(db).trigger('change');
    } else {
      var params = {
        'ajax_request': true,
        'server': window.CommonParams.get('server')
      };
      jquery__WEBPACK_IMPORTED_MODULE_0__.post('index.php?route=/databases', params, function (response) {
        if (response.success === true) {
          jquery__WEBPACK_IMPORTED_MODULE_0__.each(response.databases, function (idx, value) {
            var option = jquery__WEBPACK_IMPORTED_MODULE_0__('<option></option>');
            option.text(value);
            option.attr('value', value);
            jquery__WEBPACK_IMPORTED_MODULE_0__('#db_alias_select').append(option);
          });
        } else {
          Functions.ajaxShowMessage(response.error, false);
        }
      });
    }
  });
  modal.on('hidden.bs.modal', function () {
    var isEmpty = true;
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).find('input[type="text"]').each(function () {
      // trim empty input fields on close
      if (jquery__WEBPACK_IMPORTED_MODULE_0__(this).val()) {
        isEmpty = false;
      } else {
        jquery__WEBPACK_IMPORTED_MODULE_0__(this).parents('tr').remove();
      }
    }); // Toggle checkbox based on aliases

    jquery__WEBPACK_IMPORTED_MODULE_0__('input#btn_alias_config').prop('checked', !isEmpty);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#saveAndCloseBtn').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__('#alias_modal').parent().appendTo(jquery__WEBPACK_IMPORTED_MODULE_0__('form[name="dump"]'));
  });
};

Export.aliasToggleRow = function (elm) {
  var inputs = elm.parents('tr').find('input,button');

  if (elm.val()) {
    inputs.attr('disabled', false);
  } else {
    inputs.attr('disabled', true);
  }
};

Export.aliasRow = null;

Export.addAlias = function (type, name, field, value) {
  if (value === '') {
    return;
  }

  if (Export.aliasRow === null) {
    Export.aliasRow = jquery__WEBPACK_IMPORTED_MODULE_0__('#alias_data tfoot tr');
  }

  var row = Export.aliasRow.clone();
  row.find('th').text(type);
  row.find('td').first().text(name);
  row.find('input').attr('name', field);
  row.find('input').val(value);
  row.find('.alias_remove').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).parents('tr').remove();
  });
  var matching = jquery__WEBPACK_IMPORTED_MODULE_0__('#alias_data [name="' + jquery__WEBPACK_IMPORTED_MODULE_0__.escapeSelector(field) + '"]');

  if (matching.length > 0) {
    matching.parents('tr').remove();
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__('#alias_data tbody').append(row);
};

window.AJAX.registerOnload('export.js', function () {
  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name=\'quick_or_custom\']').on('change', toggleQuickOrCustom);
  jquery__WEBPACK_IMPORTED_MODULE_0__('#format_specific_opts').find('div.format_specific_options').addClass('d-none').find('h3').remove();
  toggleQuickOrCustom();
  Export.toggleStructureDataOpts();
  Export.toggleSqlIncludeComments();
  Export.checkTableSelectAll();
  Export.handleAddProcCheckbox();
  /**
   * Initially disables the "Dump some row(s)" sub-options
   */

  Export.disableDumpSomeRowsSubOptions();
  /**
   * Disables the "Dump some row(s)" sub-options when it is not selected
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('input[type=\'radio\'][name=\'allrows\']').on('change', function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_0__('#radio_allrows_0').prop('checked')) {
      Export.enableDumpSomeRowsSubOptions();
    } else {
      Export.disableDumpSomeRowsSubOptions();
    }
  }); // Open Alias Modal Dialog on click

  jquery__WEBPACK_IMPORTED_MODULE_0__('#btn_alias_config').on('click', Export.createAliasModal);
  jquery__WEBPACK_IMPORTED_MODULE_0__('.alias_remove').on('click', function () {
    jquery__WEBPACK_IMPORTED_MODULE_0__(this).parents('tr').remove();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_alias_select').on('change', function () {
    Export.aliasToggleRow(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
    var table = window.CommonParams.get('table');

    if (table) {
      var option = jquery__WEBPACK_IMPORTED_MODULE_0__('<option></option>');
      option.text(table);
      option.attr('value', table);
      jquery__WEBPACK_IMPORTED_MODULE_0__('#table_alias_select').append(option).val(table).trigger('change');
    } else {
      var database = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();
      var params = {
        'ajax_request': true,
        'server': window.CommonParams.get('server'),
        'db': database
      };
      var url = 'index.php?route=/tables';
      jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, function (response) {
        if (response.success === true) {
          jquery__WEBPACK_IMPORTED_MODULE_0__.each(response.tables, function (idx, value) {
            var option = jquery__WEBPACK_IMPORTED_MODULE_0__('<option></option>');
            option.text(value);
            option.attr('value', value);
            jquery__WEBPACK_IMPORTED_MODULE_0__('#table_alias_select').append(option);
          });
        } else {
          Functions.ajaxShowMessage(response.error, false);
        }
      });
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#table_alias_select').on('change', function () {
    Export.aliasToggleRow(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
    var database = jquery__WEBPACK_IMPORTED_MODULE_0__('#db_alias_select').val();
    var table = jquery__WEBPACK_IMPORTED_MODULE_0__(this).val();
    var params = {
      'ajax_request': true,
      'server': window.CommonParams.get('server'),
      'db': database,
      'table': table
    };
    var url = 'index.php?route=/columns';
    jquery__WEBPACK_IMPORTED_MODULE_0__.post(url, params, function (response) {
      if (response.success === true) {
        jquery__WEBPACK_IMPORTED_MODULE_0__.each(response.columns, function (idx, value) {
          var option = jquery__WEBPACK_IMPORTED_MODULE_0__('<option></option>');
          option.text(value);
          option.attr('value', value);
          jquery__WEBPACK_IMPORTED_MODULE_0__('#column_alias_select').append(option);
        });
      } else {
        Functions.ajaxShowMessage(response.error, false);
      }
    });
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#column_alias_select').on('change', function () {
    Export.aliasToggleRow(jquery__WEBPACK_IMPORTED_MODULE_0__(this));
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_alias_button').on('click', function (e) {
    e.preventDefault();
    var db = jquery__WEBPACK_IMPORTED_MODULE_0__('#db_alias_select').val();
    Export.addAlias(window.Messages.strAliasDatabase, db, 'aliases[' + db + '][alias]', jquery__WEBPACK_IMPORTED_MODULE_0__('#db_alias_name').val());
    jquery__WEBPACK_IMPORTED_MODULE_0__('#db_alias_name').val('');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#table_alias_button').on('click', function (e) {
    e.preventDefault();
    var db = jquery__WEBPACK_IMPORTED_MODULE_0__('#db_alias_select').val();
    var table = jquery__WEBPACK_IMPORTED_MODULE_0__('#table_alias_select').val();
    Export.addAlias(window.Messages.strAliasTable, db + '.' + table, 'aliases[' + db + '][tables][' + table + '][alias]', jquery__WEBPACK_IMPORTED_MODULE_0__('#table_alias_name').val());
    jquery__WEBPACK_IMPORTED_MODULE_0__('#table_alias_name').val('');
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#column_alias_button').on('click', function (e) {
    e.preventDefault();
    var db = jquery__WEBPACK_IMPORTED_MODULE_0__('#db_alias_select').val();
    var table = jquery__WEBPACK_IMPORTED_MODULE_0__('#table_alias_select').val();
    var column = jquery__WEBPACK_IMPORTED_MODULE_0__('#column_alias_select').val();
    Export.addAlias(window.Messages.strAliasColumn, db + '.' + table + '.' + column, 'aliases[' + db + '][tables][' + table + '][colums][' + column + ']', jquery__WEBPACK_IMPORTED_MODULE_0__('#column_alias_name').val());
    jquery__WEBPACK_IMPORTED_MODULE_0__('#column_alias_name').val('');
  });

  var setSelectOptions = function (doCheck) {
    Functions.setSelectOptions('dump', 'db_select[]', doCheck);
  };

  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_select_all').on('click', function (e) {
    e.preventDefault();
    setSelectOptions(true);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#db_unselect_all').on('click', function (e) {
    e.preventDefault();
    setSelectOptions(false);
  });
  jquery__WEBPACK_IMPORTED_MODULE_0__('#buttonGo').on('click', function () {
    var timeLimit = parseInt(jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('data-exec-time-limit')); // If the time limit set is zero,
    // then time out won't occur so no need to check for time out.

    if (timeLimit > 0) {
      Export.checkTimeOut(timeLimit);
    }
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(31));
/******/ }
]);
//# sourceMappingURL=export.js.map