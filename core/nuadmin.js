function nuEditPHP(type) {
	nuForm('nuphp', nuFormId() + '_' + type, 'justphp', '', 2);
}

function nuOpenCurrentFormProperties() {
	nuForm('nuform', nuFormId(), '', '', 2);
}

function nuOpenCurrentObjectList() {
	nuForm('nuobject', '', nuFormId(), '', 2);
}

function nuFormInfoCopyBrowseSQL() {
	nuCopyToClipboard(nuFormInfoBrowseSQL.innerText);
}

function nuFormInfoCopyPermalink() {

	const {
		form_id,
		record_id
	} = nuCurrentProperties();

	const href = `${window.location.href.split('?')[0]}?f=${form_id}&r=${record_id}&h=home_id`;

	nuCopyToClipboard(href);
}

function nuFormInfoCurrentProperties() {
	nuPrettyPrintMessage(undefined, nuCurrentProperties());
}

function nuShowVersionInfo() {
	nuRunPHPHidden('NUVERSIONINFO');
}

function nuShowFormInfo() {

	const currProps = nuCurrentProperties();
	const { form_code: formCode, form_id: formId, form_description: formDescription, form_type: formType, browse_sql: browseSQLRaw, record_id: recordId } = currProps;
	const isDevMode = nuDevMode();
	const formTypeValue = nuFormType();
	const isEditMode = formTypeValue === "edit";
	const isBrowseMode = formTypeValue === "browse";
	const showSQL = !formCode.startsWith("nu") || isDevMode;
	const formattedBrowseSQL = String(browseSQLRaw).replace(/\s{2,}/g, '\n');

	const escapeForHTMLAttribute = str => str.replace(/\n/g, '\\n').replace(/'/g, "\\'");
	const copyButtonHTML = (value, label) => `<button type="button" class="nuActionButton nuAdminButton" onclick="navigator.clipboard.writeText(nuTranslate('${escapeForHTMLAttribute(value)}'))">${nuTranslate(label)}</button>`;

	const formIdCopyButton = copyButtonHTML(formId, 'Copy');
	const formCodeCopyButton = copyButtonHTML(formCode, 'Copy');
	const browseCopyButton = copyButtonHTML(formattedBrowseSQL, 'Copy SQL');
	const permalinkButton = nuUXOptions.nuShowURLPermaLink ? copyButtonHTML(window.location.href, 'Copy Permalink') : '';
	const currPropsButton = `<button type="button" class="nuActionButton nuAdminButton" onclick="nuFormInfoCurrentProperties()">${nuTranslate('Current Properties')}</button>`;

	const recordIdCopyButton = isEditMode && recordId ? copyButtonHTML(recordId, 'Copy') : '';  // Adding Record ID copy button

	const tableInfo = nuSERVERRESPONSE.table !== "" && showSQL ? `<b>${nuTranslate('Table')}:</b> ${nuSERVERRESPONSE.table} ${copyButtonHTML(nuSERVERRESPONSE.table, 'Copy')}` : "";
	const recordIdInfo = isEditMode && formType !== "launch" ? `<b>${nuTranslate('Record ID')}:</b> ${recordId} ${recordIdCopyButton}<br>` : "";
	const browseSQLInfo = isBrowseMode && showSQL ? `<br><b>${nuTranslate('Browse SQL')}:</b><br><br>${browseCopyButton}<pre class="nuFormInfoBrowseSQL"><code id="nuFormInfoBrowseSQL">${formattedBrowseSQL}</pre></code><br>` : "<br>";

	const formInfo = [
		`<b>${nuTranslate('Form ID')}:</b> ${formId} ${formIdCopyButton}` + '<br>' +
		`<b>${nuTranslate('Form Code')}:</b> ${formCode} ${formCodeCopyButton}` + '<br>' +
		tableInfo + '<br>' +
		recordIdInfo + '<br>' +
		currPropsButton + '<br>' +
		permalinkButton + '<br>' +
		browseSQLInfo
	];

	const msg = nuMessage(`<h3>${nuTranslate(formDescription)}</h3>`, formInfo);

	if (!isBrowseMode) {
		msg.css('max-width', '400px');
	}
}

function nuDevMode() {
	return nuSERVERRESPONSE.dev_mode === '1';
}

function nuAddAdminButton(id, obj) {

	const title = nuDefine(obj.title);
	const inputId = `nu${id}Button`;

	const button = `
	<input id="${inputId}" type="button" title="${nuTranslate(title)}" class="nuActionButton nuAdminButton" value="${nuTranslate(obj.value)}" onclick="${obj.func}">
  `;

	$('#nuActionHolder').prepend(button);

	const events = nuSERVERRESPONSE.events;
	if (events) {
		const eventName = id.slice(-2);
		if (events[eventName]) {
			$('#' + inputId).addClass('nuAdminButtonUsed')
		}
	}

	return 1;

}

function nuAddAdminButtons() {

	const adminButtons = {
		nuProperties: {
			title: nuTranslate("Form Properties"),
			value: "Prop",
			func: "nuOpenCurrentFormProperties();"
		},
		nuObjects: {
			title: nuTranslate("Object List"),
			value: "Obj",
			func: "nuOpenCurrentObjectList();"
		},
		AdminBE: {
			title: "Before Edit",
			value: "BE",
			func: "nuEditPHP('BE');"
		},
		AdminBB: {
			title: "Before Browse",
			value: "BB",
			func: "nuEditPHP('BB');"
		},
		AdminBS: {
			title: "Before Save",
			value: "BS",
			func: "nuEditPHP('BS');"
		},
		AdminAS: {
			title: "After Save",
			value: "AS",
			func: "nuEditPHP('AS');"
		},
	};

	const { form_type, form_code } = nuCurrentProperties();
	const formCode = form_code;


	if (!form_type)
		return;

	const devMode = nuDevMode();
	const isBrowse = form_type.includes("browse");
	const isEdit = form_type.includes("edit");
	const isLaunch = form_type.includes("launch");

	if ((window.nuUXOptions.nuDebugIcon || devMode) && nuMainForm()) {
		nuAddIconToBreadcrumbHolder('nuDebugButton', 'nuDebug Results', 'nuOpenNuDebug(2)', 'fa fa-bug', '3px');
	}

	if (window.nuUXOptions.nuRefreshIcon) {
		nuAddIconToBreadcrumbHolder('nuRefreshButton', 'Refresh', 'nuGetBreadcrumb()', 'fas fa-sync-alt', '3px');
	}

	let buttonCount = 0;

	if (!formCode.startsWith('nu') || devMode) {

		if (window.nuUXOptions.nuPropertiesIcon) {
			buttonCount += nuAddAdminButton('Properties', adminButtons.nuProperties);
		}

		if (window.nuUXOptions.nuObjectsIcon) {
			buttonCount += nuAddAdminButton('Objects', adminButtons.nuObjects);
		}

		if (window.nuUXOptions.nuPHPIcon) {
			if (isEdit || isLaunch) {
				buttonCount += nuAddAdminButton('AdminBE', adminButtons.AdminBE);
			}

			if (isBrowse) {
				buttonCount += nuAddAdminButton('AdminBB', adminButtons.AdminBB);
			}

			if (isEdit) {
				buttonCount += nuAddAdminButton('AdminBS', adminButtons.AdminBS);
				buttonCount += nuAddAdminButton('AdminAS', adminButtons.AdminAS);
			}
		}

	}

	let heightToAdd = 50;
	if (buttonCount > 0) {

		const frame = parent.$('#nuDragDialog iframe');
		const dragDialog = parent.$('#nuDragDialog');
		if (frame.length !== 0) {
			frame.outerHeight((i, h) => h + heightToAdd);
		}
		if (dragDialog.length !== 0) {
			dragDialog.outerHeight((i, h) => h + heightToAdd);
		}

		if (isLaunch) heightToAdd = 20;
		$('#nuActionHolder').css('height', `+=${heightToAdd}px`);

		const lastAdminButton = $('.nuAdminButton').last();
		$('<br style="user-select:none">').insertAfter(lastAdminButton);

	}

}

// Set Browse Column Widths in a Browse Screen

function nuRoundNearest(n, v) {

	n = n / v;
	n = Math.round(n) * v;
	return n;

}

function nuSetBrowseColumnWidths() {

	if (confirm(nuTranslate("Copy Column Widths from the Browse Table (Overwrite existing values)?"))) {

		const sf = nuSubformObject('zzzzsys_browse_sf');
		for (let i = 0; i < sf.rows.length; i++) {

			if (sf.deleted[i] == 0) {
				const c = $("div[id='nuBrowseTitle" + i + "']", window.parent.document);
				const w = Math.ceil(nuRoundNearest(parseFloat(c[0].style.width), 5)).toString();
				$('#' + 'zzzzsys_browse_sf' + nuPad3(i) + 'sbr_width').val(w.replace('px', '')).change();
			}

		}
	}

}

function nuInitSetBrowseWidthHelper() {

	if (parent.window.nuDocumentID === undefined)
		return;

	if (!nuMainForm() && nuFormId() == 'nuform' && window.parent.nuFormType() == 'browse') {
		if (window.location != window.parent.location) {

			var w = $('#title_zzzzsys_browse_sfsbr_width');

			if (w.length == 1) {
				w.css({
					"text-decoration": "underline",
					"text-decoration-style": "dashed",
					"color": "blue"
				});

				w.prop('onclick', null).off('click');
				w.click(function (e) {
					nuSetBrowseColumnWidths();
				});
			}
		}
	}

}

function nuOpenPropertiesOnMiddleClick(e) {

	if (nuGlobalAccess()) {

		if (e.button === 1) {

			const id = e.target.id;

			if (id == "nubody" || id == "nuRECORD" || id == "nuhtml") {
				// Form Properties
				nuForm('nuform', nuFormId(), '', '', 2);
			} else {
				const objId = nuObjectIdFromId(e.target.id);
				if (objId !== null) {
					// Object Properties
					nuForm('nuobject', objId, '', '', '2');
				}
			}
		}
	}

}

function nuSetSnippetFormFilter(custom, setup, sql, php) {

	nuSetProperty('IS_CUSTOM_CODE', custom);
	nuSetProperty('IS_SETUP_HEADER', setup);
	nuSetProperty('IS_SQL', sql);
	nuSetProperty('IS_PHP', php);

}

function nuOpenNuDebug(w) {
	nuForm('nudebug', '', '', '', w);
}

function nuAddIconToBreadcrumbHolder(i, title, oClick, iClass, paddingLeft) {

	const h = `
	<div id="${i}" title="${title}" style="font-size: 17px; display: inline-block; cursor: pointer; padding-left: ${paddingLeft}" onclick="${oClick}">
		<i class="${iClass} fa-fw"></i>
	</div>
  `;
	const fragment = nuCreateAppendHTML(h);
	const options = $('#nuBreadcrumbHolder').find("[id$=nuOptions]");
	$(fragment).insertAfter(options);

}

function nuShowObjectTooltip() {

	if (nuGlobalAccess()) {

		$("*").each(function () {
			let id = $(this).attr('id');
			if (id !== undefined) {
				$(this).attr('title', 'ID: ' + id);
			}
		});

	}
}

var contextMenuCurrentTarget = null;

var menuAlign = {
	text: "Align",
	tag: "Align",
	subMenu: [{
		text: nuContextMenuItemText("Left", "fa fa-align-left"),
		tag: "Left",
		faicon: "fa fa-align-left",
		action: () => nuContextMenuUpdateAlign("left")
	}, {
		text: nuContextMenuItemText("Right", "fa fa-align-right"),
		tag: "Right",
		faicon: "fa fa-align-right",
		action: () => nuContextMenuUpdateAlign("right")
	}, {
		text: nuContextMenuItemText("Center", "fa fa-align-center"),
		tag: "Center",
		faicon: "fa fa-align-center",
		action: () => nuContextMenuUpdateAlign("center")
	},
	],
};

var menuObject = {
	text: "",
	tag: "Object",
	action: function (e) {
		nuContextMenuCopyIdToClipboard();
	}
};

var menuClone = {
	text: "",
	tag: "Clone",
	action: function (e) {
		nuContextMenuClone();
	}
};

var menuProperties = {
	text: "Properties...",
	tag: "Properties",
	action: function (e) {
		nuContextMenuObjectPopup(e);
	}
};

var menuRename = {
	text: "Rename...",
	action: () => nuContextMenuLabelPrompt(),
};

var subMenuHidden = {
	text: nuContextMenuItemText("Hidden", "fa fa-eye-slash"),
	tag: "Hidden",
	faicon: "fa fa-eye-slash",
	action: () => nuContextMenuUpdateAccess(2)
};

var subMenuHiddenUser = {
	text: nuContextMenuItemText("Hidden (User)", "fa fa-eye-slash"),
	tag: "Hidden (User)",
	faicon: "fa fa-eye-slash",
	action: () => nuContextMenuUpdateAccess(3)
}

var subMenuHiddenUserReadonly = {
	text: nuContextMenuItemText("Hidden (User) + Readonly", "fa fa-eye-slash"),
	tag: "Hidden (User) + Readonly",
	faicon: "fa fa-eye-slash",
	action: () => nuContextMenuUpdateAccess(4)
}

var menuAccess = {
	text: "Access",
	tag: "Access",
	subMenu: [{
		text: nuContextMenuItemText("Editable", "fa fa-pencil-square-o"),
		tag: "Editable",
		faicon: "far fa-edit",
		action: () => nuContextMenuUpdateAccess(0),
	}, {
		text: nuContextMenuItemText("Readonly", "fa fa-lock"),
		tag: "Readonly",
		faicon: "fa fa-lock",
		action: () => nuContextMenuUpdateAccess(1)
	},
		subMenuHidden,
		subMenuHiddenUser,
		subMenuHiddenUserReadonly
	]
};

var menuValidation = {
	text: "Validation",
	tag: "Validation",
	disabled: false,
	subMenu: [{
		text: nuContextMenuItemText("None", "fa fa-globe"),
		tag: "None",
		faicon: "fa fa-globe",
		action: () => nuContextMenuUpdateValidation(0)
	}, {
		text: nuContextMenuItemText("No Blanks", "fa fa-battery-full"),
		tag: "No Blanks",
		faicon: "fa fa-battery-full",
		action: () => nuContextMenuUpdateValidation(1)
	}, {
		text: nuContextMenuItemText("No Duplicates", "far fa-gem"),
		tag: "No Duplicates",
		faicon: "fa fa-diamond",
		action: () => nuContextMenuUpdateValidation(2)
	}, {
		text: nuContextMenuItemText("No Duplicates/Blanks", "fa fa-star"),
		tag: "No Duplicates/Blanks",
		faicon: "fa fa-star",
		action: () => nuContextMenuUpdateValidation(3)
	},
	],
};

var nuContextMenuDefinitionEdit = [

	menuObject, {
		isDivider: true
	},
	menuProperties,
	menuRename, {
		isDivider: true
	},
	menuAccess,
	menuAlign,
	menuValidation, {
		isDivider: true
	}, {
		html: "",
		tag: "Top",
		action: function (e) {
			e.stopImmediatePropagation();
		}
	}, {
		html: "",
		tag: "Left",
		action: function (e) {
			e.stopImmediatePropagation();
		}
	}, {
		html: "",
		tag: "Width",
		action: function (e) {
			e.stopImmediatePropagation();
		}
	}, {
		html: "",
		tag: "Height",
		action: function (e) {
			e.stopImmediatePropagation();
		}
	}
];

var nuContextMenuDefinitionBrowse = [

	menuObject, {
		isDivider: true
	},
	menuRename, {
		isDivider: true
	},
	menuAlign, {
		isDivider: true
	}, {
		html: "",
		tag: "Width",
		action: function (e) {
			e.stopImmediatePropagation();
		}
	}

];

var nuContextMenuDefinitionTab = [

	menuObject, {
		isDivider: true
	},
	menuRename, {
		text: "Access",
		tag: "Access",
		subMenu: [
			subMenuHidden,
			subMenuHiddenUser
		]

	}

];

var nuContextMenuDefinitionSubform = [

	menuObject, {
		isDivider: true
	},
	menuRename

	/*
	menuAlign{ isDivider: true },{
	html: "",
	tag: "Width"
	}
	 */

];

function nuContextMenuBold(text) {
	return '<b>' + text + '</b>';
}

function nuContextLabelHasClass(id, className) {
	return $('#label_' + id).hasClass(className);
}

function nuContextMenuIdHasAlgin(id, align) {

	if (nuFormType() == 'browse')
		id = nuContextMenuCurrentTargetBrowseId();
	id = $('#' + id).hasClass('nuContentBoxContainer') ? 'label_' + id : id;

	return $('#' + id).css('text-align').toLowerCase() == align.toLowerCase();

}

function nuContextMenuAlignText(id, sub, align) {
	return nuContextMenuIdHasAlgin(id, align) ? nuContextMenuItemText(nuContextMenuBold(sub.tag), sub.faicon) : nuContextMenuItemText(sub.tag, sub.faicon);
}

function nuContextMenuAccessText(id, sub, access) {
	return $('#' + id).attr('data-nu-access') == access ? nuContextMenuItemText(nuContextMenuBold(sub.tag), sub.faicon) : nuContextMenuItemText(sub.tag, sub.faicon);
}

function nuContextMenuPositionText(id, position) {

	if (nuFormType() == 'browse')
		id = nuContextMenuCurrentTargetBrowseId();

	if ($('#' + id).hasClass('nuContentBoxContainer') && (position == 'Height' || position == 'Width')) {
		id = 'content_' + id;
	}

	return nuContextMenuItemPosition(position, $('#' + id).nuCSSNumber(position));

}

function nuContextMenuValidationText(id, sub, validation) {
	return nuContextLabelHasClass(id, validation) ? nuContextMenuItemText(nuContextMenuBold(sub.tag), sub.faicon) : nuContextMenuItemText(sub.tag, sub.faicon);
}

function nuContextMenuBeforeRender(menu, event) {

	contextMenuCurrentTarget = event.currentTarget;
	const id = nuContextMenuCurrentTargetId();
	const $currentTarget = $('#' + contextMenuCurrentTarget.id);
	const isButton = $currentTarget.is(":button");
	const isSelect = $('#' + nuContextMenuCurrentTargetUpdateId()).is("select");

	menu.forEach((item) => {
		if (Object.prototype.hasOwnProperty.call(item, "tag")) {
			switch (item.tag) {
				case 'Top': case 'Left': case 'Width': case 'Height':
					item.html = nuContextMenuPositionText(id, item.tag);
					break;
				case 'Object':
					item.text = `Object: ${(nuFormType() === 'edit' ? nuContextMenuCurrentTargetUpdateId() : nuContextMenuCurrentTargetBrowseId())}`;
					break;
				case 'Access':
					item.subMenu.forEach((sub) => {
						sub.text = nuContextMenuAccessText(id, sub, sub.tag === 'Editable' ? '0' : sub.tag === 'Readonly' ? '1' : sub.tag === 'Hidden' ? '2' : sub.tag === 'Hidden (User)' ? '3' : '4');
					});
					break;
				case 'Align':
					if (isSelect) {
						menu.splice(menu.indexOf(item), 1);
					} else {
						item.subMenu.forEach((sub) => {
							sub.text = nuContextMenuAlignText(id, sub, sub.tag);
						});
					}
					break;
				case 'Validation':
					if (isButton) {
						menu.splice(menu.indexOf(item), 1);
					} else {
						item.subMenu.forEach((sub) => {
							sub.text = nuContextMenuValidationText(id, sub, sub.tag === 'No Blanks' ? 'nuBlank' : sub.tag === 'No Duplicates' ? 'nuDuplicate' : sub.tag === 'No Duplicates/Blanks' ? 'nuDuplicateOrBlank' : 'nuNone');
						});
					}
					break;
			}
		}
	});

	$('#' + id).trigger("focus");

	return menu;
}

function nuContextMenuItemText(label, iconClass) {
	return '<i class="' + iconClass + ' fa-fw" aria-hidden="true"></i> <span style="padding-left:8px; white-space:nowrap; display: inline;">' + nuTranslate(label) + '</span>';
}

function nuContextMenuGetWordWidth(w) {

	const ww = $('.interactive').css('font-size');
	const h = "<div id='nuTestWidth' style='font-size:" + ww + ";position:absolute;visible:hidden;width:auto'>" + w + "</div>";
	$('body').append(h);
	const l = parseInt($('#nuTestWidth').css('width'), 10);
	$('#nuTestWidth').remove();

	return l + 5;

}

function nuContextMenuItemPositionChanged(t, update) {

	if (t.value.trim() == '' || Number(t.value) < 0)
		return;

	let id = nuContextMenuCurrentTargetId();
	let prop = $(t).attr("data-property").toLowerCase();
	let typeEdit = nuFormType() == 'edit';

	if (update) {
		nuContextMenuUpdateObject(t.value, typeEdit ? 'sob_all_' + prop : 'sbr_' + prop);
	} else {

		if (typeEdit) {

			let obj = $('#' + id);
			if ((prop == 'width' || prop == 'height') && obj.hasClass('nuContentBoxContainer')) {
				$('#content_' + id).css(prop, t.value + 'px');
			} else {

				if (obj.hasClass('nuHiddenLookup')) {

					$('#' + id + 'code').css(prop, t.value + 'px');

					if (prop == 'left') {
						$('#' + id + 'button').css(prop, Number(t.value) + obj.nuCSSNumber('width') + 6 + 'px');
						$('#' + id + 'description').css(prop, Number(t.value) + obj.nuCSSNumber('width') + 25 + 'px');
					} else if (prop == 'top') {
						$('#' + id + 'button').css(prop, t.value + 'px');
						$('#' + id + 'description').css(prop, t.value + 'px');
					} else if (prop == 'height') {
						$('#' + id + 'description').css(prop, t.value + 'px');
					} else if (prop == 'width') {
						$('#' + id + 'button').css('left', Number(t.value) + obj.nuCSSNumber('left') + 6 + 'px');
						$('#' + id + 'description').css('left', Number(t.value) + obj.nuCSSNumber('left') + 25 + 'px');
					}

				}

				obj.css(prop, t.value + 'px');

			}

			nuContextMenuUpdateLabel(id);

		} else {
			nuSetBrowseColumnSize(Number(nuContextMenuCurrentTargetUpdateId().nuJustNumbers()), Number(t.value));
		}
	}

}

function nuContextMenuItemPosition(label, v) {

	const lwidth = nuContextMenuGetWordWidth(label);
	let left = 70 - lwidth + 17;
	if (label == 'Top')
		left += 2;
	if (label == 'Left')
		left += 1;
	if (label == 'Height')
		left -= 1;

	return '<span style="width: 100px; padding-left:20px; font-family: font-family: Verdana, sans-serif;white-space:nowrap; display: inline;">' + label + '</span>' +
		' <input data-property="' + label + '" onChange="nuContextMenuItemPositionChanged(this, false)" onBlur="nuContextMenuItemPositionChanged(this, true)" style="text-align: right; margin: 3px 10px 3px ' + left + 'px; width: 50px; height: 22px" type="number" min="0" class="input_number" value="' + v + '"> </input>';

}

function nuContextMenuUpdateAccess(v) {

	const id = nuContextMenuCurrentTargetId();
	if (v == 0) { //-- editable
		nuEnable(id);
		nuShow(id);
	} else if (v == 1) { //-- readonly
		nuDisable(id);
	} else if (v == 2) { //-- hidden
		nuHide(id);
	} else if (v == 4) { //-- hidden (user) / readonly
		nuDisable(id);
	}

	$('#' + id).attr('data-nu-access', v);

	let column = $('#' + id).hasClass('nuTab') ? 'syt_access' : 'sob_all_access';
	nuContextMenuUpdateObject(v, column);
}

function nuContextMenuUpdateAlign(v) {

	const ftEdit = nuFormType() == 'edit';
	const id = ftEdit ? nuContextMenuCurrentTargetUpdateId() : nuContextMenuCurrentTargetBrowseId();

	$('#' + id).css('text-align', v);

	if (ftEdit) {
		nuContextMenuUpdateObject(v, 'sob_all_align');
	} else {

		const colNumber = id.replace('nuBrowseTitle', '');
		$('[data-nu-column="' + colNumber + '"]').each(function (index) {
			$(this).css('text-align', v)
		});

		nuContextMenuUpdateObject(v.toLowerCase().charAt(0), 'sbr_align');
	}

}

function nuContextMenuUpdateValidation(v) {

	let id = nuContextMenuCurrentTargetId();
	let objLabel = $('#label_' + id);

	if (v == 0) { //-- none
		objLabel.removeClass('nuBlank nuDuplicate nuDuplicateOrBlank');
		objLabel.addClass('nuNone');
	} else if (v == 1) { //-- no blanks
		objLabel.removeClass('nuNone nuDuplicate nuDuplicateOrBlank');
		objLabel.addClass('nuBlank');
	} else if (v == 2) { //-- no duplicates
		objLabel.addClass('nuDuplicate');
		objLabel.removeClass('nuNone nuBlank nuDuplicateOrBlank');
	} else if (v == 3) { //-- no duplicates/blanks
		objLabel.addClass('nuDuplicateOrBlank');
		objLabel.removeClass('nuNone nuBlank nuDuplicate');
	}

	nuContextMenuUpdateLabel(id);
	nuContextMenuUpdateObject(v, 'sob_all_validate');

}

function nuContextMenuUpdateLabel(id) {

	const objLabel = $('#label_' + id);

	if (objLabel.hasClass('nuContentBoxTitle'))
		return;

	nuSetLabelText(id, objLabel.html(), true);

}

function nuContextMenuGetFormId(id) {

	const subform = $('#' + id).attr('data-nu-subform');
	if (subform !== undefined && subform !== 'true') {
		return $('#' + subform + '000nuRECORD').attr('data-nu-form-id');
	} else if (nuFormType() == 'edit') {

		const field = $('[data-nu-field="' + id + '"]');
		const obj = $('#' + id);
		const hasClass = nuObjectClassList(id).containsAny(['nuWord', 'nuImage', 'nuContentBoxContainer', 'nuHtml', 'nuSubform']);

		return id == field || hasClass || obj.is(":button") ? obj.parent().attr('data-nu-form-id') : field.parent().attr('data-nu-form-id');

	}

	return nuFormId();

}

function nuContextMenuLabelPromptCallback(value, ok) {

	if (ok) {

		let objLabel = $('#' + contextMenuCurrentTarget.id);

		if (contextMenuCurrentTarget.id.startsWith('label_')) {
			nuSetLabelText(contextMenuCurrentTarget.id.substring(6), value, true);
		} else {
			objLabel.html(nuTranslate(value));
			objLabel.attr('data-nu-org-label', value);
			const icon = objLabel.attr('nu-data-icon');
			if (icon) {
				nuAddInputIcon(contextMenuCurrentTarget.id, icon);
			}
		}

		let column = nuFormType() == 'edit' ? 'sob_all_label' : 'sbr_title';
		column = objLabel.hasClass('nuTab') ? 'syt_title' : column;

		nuContextMenuUpdateObject(value, column);

	}

}

function nuContextMenuLabelPrompt() {

	const label = contextMenuCurrentTarget.id;
	const id = nuContextMenuCurrentTargetId();
	const obj = $('#' + contextMenuCurrentTarget.id);

	let value = obj.attr('data-nu-org-label');

	if (typeof value === 'undefined') {
		value = obj.is(":button") ? value : $('#' + label).html();
	}

	value = obj.is(":button") && obj.attr('data-nu-label') ? obj.html() : value;

	value = nuFormType() == 'edit' ? value : value.trim();

	nuPrompt(nuTranslate("Label") + ':', nuTranslate("Object") + ': ' + id, value, '', 'nuContextMenuLabelPromptCallback');

}

function nuContextMenuCurrentTargetUpdateId() {

	let t = $('#' + contextMenuCurrentTarget.id);
	let hasClass = nuObjectClassList(contextMenuCurrentTarget.id).containsAny(['nuWord', 'nuImage', 'nuSort', 'nuTab']) && !t.hasClass('nuTabHolder');

	if (t.is(":button") || hasClass) {
		return contextMenuCurrentTarget.id;
	} else {

		let strIdNoLabel = contextMenuCurrentTarget.id.substring(6);
		let idNoLabel = $('#' + strIdNoLabel);
		if (nuObjectClassList(strIdNoLabel).containsAny(['nuHtml', 'nuImage', 'nuContentBoxContainer', 'nuSubform'])) {
			return idNoLabel.attr('id');
		} else if (idNoLabel.hasClass('select2-hidden-accessible')) {
			return strIdNoLabel + '_select2';
		} else {
			let id = t.hasClass('nuSubformTitle') ? t.attr('data-nu-field') : idNoLabel.attr('data-nu-field');
			id = id === undefined ? contextMenuCurrentTarget.id : id;
			return id;
		}
	}

}

function nuContextMenuCurrentTargetId() {

	let t = $('#' + contextMenuCurrentTarget.id);
	let hasClass = nuObjectClassList(contextMenuCurrentTarget.id).containsAny(['nuWord', 'nu_run', 'nuImage', 'nuTab', 'nuSubformTitle', 'nuSort']) && !t.hasClass('nuTabHolder')

	return t.is(":button") || hasClass ? contextMenuCurrentTarget.id : contextMenuCurrentTarget.id.substring(6);

}

function nuContextMenuCurrentTargetBrowseId() {

	let id = contextMenuCurrentTarget.id;
	return $('#' + id).parent().attr('id')

}

function nuContextMenuCopyIdToClipboard() {

	let t = $('#' + contextMenuCurrentTarget.id);
	let id = t.hasClass('nuSubformTitle') ? nuContextMenuCurrentTargetUpdateId() : nuContextMenuCurrentTargetId();
	nuCopyToClipboard(id);

}

function nuContextMenuClone() { }

function nuContextMenuObjectPopup(e) {

	let objId = nuObjectIdFromId(nuContextMenuCurrentTargetUpdateId());

	if ((nuIsMacintosh() ? e.metaKey : e.ctrlKey) === true) {
		nuForm('nuobject', objId, '', '', '2');
	} else {
		nuPopup("nuobject", objId, '');
	}

}

function nuContextMenuUpdateObject(value, column) {

	let isSfTitle = $('#title_' + nuContextMenuCurrentTargetId()).hasClass('nuSubformTitle');
	let isTab = $('#' + nuContextMenuCurrentTargetId()).hasClass('nuTab');

	var id;
	if (nuFormType() == 'edit' && !isTab) {
		id = nuContextMenuCurrentTargetUpdateId();
	} else {
		id = (Number(nuContextMenuCurrentTargetUpdateId().nuJustNumbers()) + 1) * 10;
	}

	let formId = isSfTitle ? nuContextMenuGetFormId('title_' + nuContextMenuCurrentTargetId()) : nuContextMenuGetFormId(id);
	let p = 'NUUPDATEOBJECT';

	nuSetProperty(p + '_id', isTab ? $('#' + nuContextMenuCurrentTargetId()).attr('data-nu-tab-id') : id);
	nuSetProperty(p + '_value', value);
	nuSetProperty(p + '_form_id', formId);
	nuSetProperty(p + '_type', isTab ? 'tab' : nuFormType());
	nuSetProperty(p + '_column', column);
	nuRunPHPHidden(p);

}

function nuContextMenuUpdate() {

	let typeEdit = nuFormType() == 'edit';
	let selector = typeEdit ? 'label, button, .nu_run, .nuWord, .nuImage, .nuContentBoxTitle, .nuTab, .nuSubformTitle' : '.nuSort';
	//not('.nuDragLabel')
	$(selector).each((index, element) => {

		let el = "#" + element.id;
		if (el !== '#' && $(el).length > 0) {

			if ($(el).hasClass('nuTab')) {
				ctxmenu.update(el, nuContextMenuDefinitionTab, nuContextMenuBeforeRender);
			} else if ($(el).hasClass('nuSubformTitle')) {
				ctxmenu.update(el, nuContextMenuDefinitionSubform, nuContextMenuBeforeRender);
			} else {
				ctxmenu.update(el, typeEdit ? nuContextMenuDefinitionEdit : nuContextMenuDefinitionBrowse, nuContextMenuBeforeRender);
			}
		}

	});

}

function nuContextMenuClose() {

	if (ctxmenu) {
		ctxmenu.hide();
	}

}

/*
Copyright (c) 2009 James Padolsey.  All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

1. Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY James Padolsey ``AS IS'' AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL James Padolsey OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
SUCH DAMAGE.

The views and conclusions contained in the software and documentation are
those of the authors and should not be interpreted as representing official
policies, either expressed or implied, of James Padolsey.

AUTHOR James Padolsey (http://james.padolsey.com)
VERSION 1.03.0
UPDATED 29-10-2011
CONTRIBUTORS
David Waller
Benjamin Drucker

 */

var nuPrettyPrint = (function () {

	/* These "util" functions are not part of the core
	functionality but are all necessary - mostly DOM helpers */

	var util = {

		el: function (type, attrs) {

			/* Create new element */
			var el = document.createElement(type),
				attr;

			/*Copy to single object */
			attrs = util.merge({}, attrs);

			/* Add attributes to el */
			if (attrs?.style) {
				util.applyCSS(el, attrs.style);
				delete attrs.style;
			}
			for (attr in attrs) {
				if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
					el[attr] = attrs[attr];
				}
			}

			return el;

		},

		applyCSS: function (el, styles) {
			/* Applies CSS to a single element */
			for (var prop in styles) {
				if (Object.prototype.hasOwnProperty.call(styles, prop)) {
					el.style[prop] = styles[prop];
				}
			}
		},

		txt: function (t) {
			/* Create text node */
			return document.createTextNode(t);
		},

		row: function (cells, type, cellType) {

			/* Creates new <tr> */
			cellType = cellType || 'td';

			/* colSpan is calculated by length of null items in array */
			var colSpan = util.count(cells, null) + 1,
				tr = util.el('tr'),
				td,
				attrs = {
					style: util.getStyles(cellType, type),
					colSpan: colSpan,
					onmouseover: function () {
						var tds = this.parentNode.childNodes;
						util.forEach(tds, function (cell) {
							if (cell.nodeName.toLowerCase() !== 'td') {
								return;
							}
							util.applyCSS(cell, util.getStyles('td_hover', type));
						});
					},
					onmouseout: function () {
						var tds = this.parentNode.childNodes;
						util.forEach(tds, function (cell) {
							if (cell.nodeName.toLowerCase() !== 'td') {
								return;
							}
							util.applyCSS(cell, util.getStyles('td', type));
						});
					}
				};

			util.forEach(cells, function (cell) {

				if (cell === null) {
					return;
				}
				/* Default cell type is <td> */
				td = util.el(cellType, attrs);

				if (cell.nodeType) {
					/* IsDomElement */
					td.appendChild(cell);
				} else {
					/* IsString */
					td.innerHTML = util.shorten(cell.toString());
				}

				tr.appendChild(td);
			});

			return tr;
		},

		hRow: function (cells, type) {
			/* Return new <th> */
			return util.row(cells, type, 'th');
		},

		table: function (headings, type) {

			headings = headings || [];

			/* Creates new table: */
			var attrs = {
				thead: {
					style: util.getStyles('thead', type)
				},
				tbody: {
					style: util.getStyles('tbody', type)
				},
				table: {
					style: util.getStyles('table', type)
				}
			},
				tbl = util.el('table', attrs.table),
				thead = util.el('thead', attrs.thead),
				tbody = util.el('tbody', attrs.tbody);

			if (headings.length) {
				tbl.appendChild(thead);
				thead.appendChild(util.hRow(headings, type));
			}
			tbl.appendChild(tbody);

			return {
				/* Facade for dealing with table/tbody
				Actual table node is this.node: */
				node: tbl,
				tbody: tbody,
				thead: thead,
				appendChild: function (node) {
					this.tbody.appendChild(node);
				},
				addRow: function (cells, _type, cellType) {
					this.appendChild(util.row.call(util, cells, (_type || type), cellType));
					return this;
				}
			};
		},

		shorten: function (str) {
			var max = prettyPrintThis.maxStringLength;
			str = str.replace(/^\s\s*|\s\s*$|\n/g, '');
			return str.length > max ? (str.substring(0, max - 1) + '...') : str;
		},

		htmlentities: function (str) {
			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		},

		merge: function (target, source) {

			/* Merges two (or more) objects,
			giving the last one precedence */

			if (typeof target !== 'object') {
				target = {};
			}

			for (var property in source) {

				if (Object.prototype.hasOwnProperty.call(source, property)) {

					var sourceProperty = source[property];

					if (typeof sourceProperty === 'object') {
						target[property] = util.merge(target[property], sourceProperty);
						continue;
					}

					target[property] = sourceProperty;

				}

			}

			for (var a = 2; a < arguments.length; a++) {
				util.merge(target, arguments[a]);
			}

			return target;
		},

		count: function (arr, item) {
			var count = 0;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === item) {
					count++;
				}
			}
			return count;
		},

		thead: function (tbl) {
			return tbl.getElementsByTagName('thead')[0];
		},

		forEach: function (arr, max, fn) {

			if (!fn) {
				fn = max;
			}

			/* Helper: iteration */
			var len = arr.length,
				index = -1;
			while (++index < len) {
				if (fn(arr[index], index, arr) === false) {
					break;
				}
			}

			return true;
		},

		type: function (v) {
			try {
				/* Returns type, e.g. "string", "number", "array" etc.
				Note, this is only used for precise typing. */
				if (v === null) {
					return 'null';
				}
				if (v === undefined) {
					return 'undefined';
				}
				var oType = Object.prototype.toString.call(v).match(/\s(.+?)\]/)[1].toLowerCase();
				if (v.nodeType) {
					if (v.nodeType === 1) {
						return 'domelement';
					}
					return 'domnode';
				}
				if (/^(string|number|array|regexp|function|date|boolean)$/.test(oType)) {
					return oType;
				}
				if (/^(u?int(8(clamped)?|16|32)|float(32|64))array$/.test(oType)) {
					return 'array';
				}
				if (typeof v === 'object') {
					return typeof v.jquery === 'string' ? 'jquery' : 'object';
				}
				if (v === window || v === document) {
					return 'object';
				}
				return 'default';
			} catch (e) {
				return 'default';
			}
		},

		within: function (ref) {
			/* Check existence of a val within an object
			RETURNS KEY */
			return {
				is: function (o) {
					for (var i in ref) {
						if (ref[i] === o) {
							return i;
						}
					}
					return '';
				}
			};
		},

		common: {
			circRef: function (obj, key, settings) {
				return util.expander(
					'[POINTS BACK TO <strong>' + (key) + '</strong>]',
					'Click to show this item anyway',
					function () {
						this.parentNode.appendChild(prettyPrintThis(obj, {
							maxDepth: 1
						}));
					});
			},
			depthReached: function (obj, settings) {
				return util.expander(
					'[EXPAND]',
					'Click to show this item anyway',
					function () {
						try {
							this.parentNode.appendChild(prettyPrintThis(obj, {
								maxDepth: 1
							}));
						} catch (e) {
							this.parentNode.appendChild(
								util.table(['ERROR OCCURED DURING OBJECT RETRIEVAL'], 'error').addRow([e.message]).node);
						}
					});
			}
		},

		getStyles: function (el, type) {
			type = prettyPrintThis.settings.styles[type] || {};
			return util.merge({}, prettyPrintThis.settings.styles.default.el, type.el);
		},

		expander: function (text, title, clickFn) {
			return util.el('a', {
				innerHTML: util.shorten(text) + ' <b style="visibility:hidden;">[+]</b>',
				title: title,
				onmouseover: function () {
					this.getElementsByTagName('b')[0].style.visibility = 'visible';
				},
				onmouseout: function () {
					this.getElementsByTagName('b')[0].style.visibility = 'hidden';
				},
				onclick: function () {
					this.style.display = 'none';
					clickFn.call(this);
					return false;
				},
				style: {
					cursor: 'pointer'
				}
			});
		},

		stringify: function (obj) {

			/* Bit of an ugly duckling!
			- This fn returns an ATTEMPT at converting an object/array/anyType
			into a string, kinda like a JSON-deParser
			- This is used for when |settings.expanded === false| */

			var type = util.type(obj),
				str,
				first = true;
			if (type === 'array') {
				str = '[';
				util.forEach(obj, function (item, i) {
					str += (i === 0 ? '' : ', ') + util.stringify(item);
				});
				return str + ']';
			}
			if (typeof obj === 'object') {
				str = '{';
				for (var i in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, i)) {
						str += (first ? '' : ', ') + i + ':' + util.stringify(obj[i]);
						first = false;
					}
				}
				return str + '}';
			}
			if (type === 'regexp') {
				return '/' + obj.source + '/';
			}
			if (type === 'string') {
				return '"' + obj.replace(/"/g, '\\"') + '"';
			}
			return obj.toString();
		},

		headerGradient: (function () {

			var canvas = document.createElement('canvas');
			if (!canvas.getContext) {
				return '';
			}
			var cx = canvas.getContext('2d');
			canvas.height = 30;
			canvas.width = 1;

			var linearGrad = cx.createLinearGradient(0, 0, 0, 30);
			linearGrad.addColorStop(0, 'rgba(0,0,0,0)');
			linearGrad.addColorStop(1, 'rgba(0,0,0,0.25)');

			cx.fillStyle = linearGrad;
			cx.fillRect(0, 0, 1, 30);

			var dataURL = canvas.toDataURL && canvas.toDataURL();
			return 'url(' + (dataURL || '') + ')';

		})()

	};

	// Main..
	var prettyPrintThis = function (obj, options) {

		/*
		 *	  obj :: Object to be printed
		 *  options :: Options (merged with config)
		 */

		options = options || {};

		var settings = util.merge({}, prettyPrintThis.config, options),
			container = util.el('div'),
			config = prettyPrintThis.config,
			currentDepth = 0,
			stack = {},
			hasRunOnce = false;

		/* Expose per-call settings.
		Note: "config" is overwritten (where necessary) by options/"settings"
		So, if you need to access/change *DEFAULT* settings then go via ".config" */
		prettyPrintThis.settings = settings;

		var typeDealer = {
			string: function (item) {
				return util.txt('"' + util.shorten(item.replace(/"/g, '\\"')) + '"');
			},
			number: function (item) {
				return util.txt(item);
			},
			regexp: function (item) {

				var miniTable = util.table(['RegExp', null], 'regexp');
				var flags = util.table();
				var span = util.expander(
					'/' + item.source + '/',
					'Click to show more',
					function () {
						this.parentNode.appendChild(miniTable.node);
					});

				flags
					.addRow(['g', item.global])
					.addRow(['i', item.ignoreCase])
					.addRow(['m', item.multiline]);

				miniTable
					.addRow(['source', '/' + item.source + '/'])
					.addRow(['flags', flags.node])
					.addRow(['lastIndex', item.lastIndex]);

				return settings.expanded ? miniTable.node : span;
			},
			domelement: function (element, depth) {

				var miniTable = util.table(['DOMElement', null], 'domelement'),
					props = ['id', 'className', 'innerHTML', 'src', 'href'],
					elname = element.nodeName || '';

				miniTable.addRow(['tag', '&lt;' + elname.toLowerCase() + '&gt;']);

				util.forEach(props, function (prop) {
					if (element[prop]) {
						miniTable.addRow([prop, util.htmlentities(element[prop])]);
					}
				});

				return settings.expanded ? miniTable.node : util.expander(
					'DOMElement (' + elname.toLowerCase() + ')',
					'Click to show more',
					function () {
						this.parentNode.appendChild(miniTable.node);
					});
			},
			domnode: function (node) {

				/* Deals with all DOMNodes that aren't elements (nodeType !== 1) */
				var miniTable = util.table(['DOMNode', null], 'domelement'),
					data = util.htmlentities((node.data || 'UNDEFINED').replace(/\n/g, '\\n'));
				miniTable
					.addRow(['nodeType', node.nodeType + ' (' + node.nodeName + ')'])
					.addRow(['data', data]);

				return settings.expanded ? miniTable.node : util.expander(
					'DOMNode',
					'Click to show more',
					function () {
						this.parentNode.appendChild(miniTable.node);
					});
			},
			jquery: function (obj, depth, key) {
				return typeDealer.array(obj, depth, key, true);
			},
			object: function (obj, depth, key) {

				/* Checking depth + circular refs */
				/* Note, check for circular refs before depth; just makes more sense */
				var stackKey = util.within(stack).is(obj);
				if (stackKey) {
					return util.common.circRef(obj, stackKey, settings);
				}
				stack[key || 'TOP'] = obj;
				if (depth === settings.maxDepth) {
					return util.common.depthReached(obj, settings);
				}

				var table = util.table([(obj.constructor?.name) || 'Object', null], 'object'),
					isEmpty = true;

				var keys = [];
				for (var i in obj) {
					if (!settings.filter || settings.filter.call(obj, i)) {
						keys.push(i);
					}
				}

				if (settings.sortKeys) {
					keys.sort();
				}

				var len = keys.length;

				for (var j = 0; j < len; j++) {
					var i = keys[j],
						item = obj[i],
						type = util.type(item);

					isEmpty = false;
					try {
						table.addRow([i, typeDealer[type](item, depth + 1, i)], type);
					} catch (e) {
						/* Security errors are thrown on certain Window/DOM properties */
						if (window.console?.log) {
							console.log(e.message);

						}
					}
				}

				if (obj instanceof Error) {
					table.thead.appendChild(
						util.hRow(['key', 'value'], 'colHeader'));
					table.addRow(['name', obj.name]);
					table.addRow(['message', obj.message]);
				} else
					if (isEmpty) {
						table.addRow(['<small>[empty]</small>']);
					} else {
						table.thead.appendChild(
							util.hRow(['key', 'value'], 'colHeader'));
					}

				var ret = (settings.expanded || !hasRunOnce) ? table.node : util.expander(
					util.stringify(obj),
					'Click to show more',
					function () {
						this.parentNode.appendChild(table.node);
					});

				hasRunOnce = true;

				return ret;

			},
			array: function (arr, depth, key, jquery) {

				/* Checking depth + circular refs */
				/* Note, check for circular refs before depth; just makes more sense */
				var stackKey = util.within(stack).is(arr);
				if (stackKey) {
					return util.common.circRef(arr, stackKey);
				}
				stack[key || 'TOP'] = arr;
				if (depth === settings.maxDepth) {
					return util.common.depthReached(arr);
				}

				/* Accepts a table and modifies it */
				var me = jquery ? 'jQuery' : 'Array',
					table = util.table([((arr.constructor?.name) || me) + '(' + arr.length + ')', null], jquery ? 'jquery' : me.toLowerCase()),
					isEmpty = true;

				if (jquery) {
					table.addRow(['selector', arr.selector]);
				}

				if (arr.length > settings.maxArray) {
					for (var i = 0, length = arr.length; i < length; i += settings.maxArray)
						(function (i) {
							var until = Math.min(i + settings.maxArray, length);
							table.addRow([
								i + '..' + (until - 1),
								util.expander(
									'[EXPAND]',
									'Click to show items from this slice',
									function () {
										let obj = {};
										for (var j = i; j < until; j++) {
											obj[j] = arr[j];
										}
										try {
											const child = prettyPrintThis(obj, {
												maxDepth: 1
											});
											child.getElementsByTagName('th')[0].style.display = 'none';
											this.parentNode.appendChild(child);
										} catch (e) {
											this.parentNode.appendChild(
												util.table(['ERROR OCCURED DURING OBJECT RETRIEVAL'], 'error').addRow([e.message]).node);
										}
									})
							]);
							isEmpty = false;
						})(i);
				} else {
					util.forEach(arr, function (item, index) {
						isEmpty = false;
						table.addRow([index, typeDealer[util.type(item)](item, depth + 1, index)]);
					});
				}

				if (!jquery) {
					if (isEmpty) {
						table.addRow(['<small>[empty]</small>']);
					} else {
						table.thead.appendChild(util.hRow(['index', 'value'], 'colHeader'));
					}
				}

				return settings.expanded ? table.node : util.expander(
					util.stringify(arr),
					'Click to show more',
					function () {
						this.parentNode.appendChild(table.node);
					});

			},
			'function': function (fn, depth, key) {

				/* Checking JUST circular refs */
				var stackKey = util.within(stack).is(fn);
				if (stackKey) {
					return util.common.circRef(fn, stackKey);
				}
				stack[key || 'TOP'] = fn;
				var miniTable = util.table(['Function', null], 'function'),
					args = fn.toString().match(/\((.+?)\)/),
					body = fn.toString().match(/\(.*?\)\s+?\{?([\S\s]+)/)[1].replace(/\}?$/, '');

				miniTable
					.addRow(['arguments', args ? args[1].replace(/[^\w_,\s]/g, '') : '<small>[none/native]</small>'])
					.addRow(['body', body]);

				return settings.expanded ? miniTable.node : util.expander(
					'function(){...}',
					'Click to see more about this function.',
					function () {
						this.parentNode.appendChild(miniTable.node);
					});
			},
			'date': function (date) {

				var miniTable = util.table(['Date', null], 'date'),
					sDate = date.toString().split(/\s/);

				/* TODO: Make this work well in IE! */
				miniTable
					.addRow(['Time', sDate[4]])
					.addRow(['Date', sDate.slice(0, 4).join('-')]);

				return settings.expanded ? miniTable.node : util.expander(
					'Date (timestamp): ' + Number(date),
					'Click to see a little more info about this date',
					function () {
						this.parentNode.appendChild(miniTable.node);
					});

			},
			'boolean': function (bool) {
				return util.txt(bool.toString().toUpperCase());
			},
			'undefined': function () {
				return util.txt('UNDEFINED');
			},
			'null': function () {
				return util.txt('NULL');
			},
			'default': function () {
				/* When a type cannot be found */
				return util.txt('prettyPrint: TypeNotFound Error');
			}
		};

		container.appendChild(typeDealer[(settings.forceObject) ? 'object' : util.type(obj)](obj, currentDepth));

		return container;

	};

	/* Configuration */

	/* All items can be overridden by passing an
	"options" object when calling prettyPrint */
	prettyPrintThis.config = {

		/* Try setting this to false to save space */
		expanded: true,
		sortKeys: false, // if true, will sort object keys
		forceObject: false,
		maxDepth: 3,
		maxStringLength: 40,
		maxArray: Infinity, // default is unlimited
		filter: Object.prototype.hasOwnProperty,
		maxTextLen: 40,
		styles: {
			array: {
				th: {
					backgroundColor: '#6DBD2A',
					color: 'white'
				}
			},
			'function': {
				th: {
					backgroundColor: '#D82525'
				}
			},
			regexp: {
				th: {
					backgroundColor: '#E2F3FB',
					color: '#000'
				}
			},
			object: {
				th: {
					backgroundColor: '#1F96CF'
				}
			},
			jquery: {
				th: {
					backgroundColor: '#FBF315'
				}
			},
			error: {
				th: {
					backgroundColor: 'red',
					color: 'yellow'
				}
			},
			domelement: {
				th: {
					backgroundColor: '#F3801E'
				}
			},
			date: {
				th: {
					backgroundColor: '#A725D8'
				}
			},
			colHeader: {
				th: {
					backgroundColor: '#EEE',
					color: '#000',
					textTransform: 'uppercase'
				}
			},
			'default': {
				table: {
					borderCollapse: 'collapse',
					width: '100%'
				},
				td: {
					padding: '5px',
					fontSize: '12px',
					backgroundColor: '#FFF',
					color: '#222',
					border: '1px solid #000',
					verticalAlign: 'top',
					fontFamily: '"Consolas","Lucida Console",Courier,mono',
					whiteSpace: 'nowrap'
				},
				td_hover: {
					/* Styles defined here will apply to all tr:hover > td,
					- Be aware that "inheritable" properties (e.g. fontWeight) WILL BE INHERITED */
				},
				th: {
					padding: '5px',
					fontSize: '12px',
					backgroundColor: '#222',
					color: '#EEE',
					textAlign: 'left',
					border: '1px solid #000',
					verticalAlign: 'top',
					fontFamily: '"Consolas","Lucida Console",Courier,mono',
					backgroundImage: util.headerGradient,
					backgroundRepeat: 'repeat-x',
					display: 'none'
				}
			}
		}
	};

	return prettyPrintThis;

})();

function nuClosePropertiesMsgDiv() {
	$("#nuPropertiesMsgDiv").remove();
}

function nuPrettyPrintMessage(event, properties) {

	const sortedProperties = Object.fromEntries(Object.entries(properties).sort());

	const prettyPrintedTable = nuPrettyPrint(sortedProperties, {
		maxArray: 20,
		expanded: false,
		maxDepth: 1,
	});

	const title = nuTranslate('Current Properties') + ' : ' + nuGetProperty('form_code');

	if (event !== undefined && (nuIsMacintosh() ? event.metaKey : event.ctrlKey)) {
		const newWindow = window.open();
		newWindow.document.title = title;
		$(newWindow.document.body).html(prettyPrintedTable);
	} else {
		const message = nuMessage(title, prettyPrintedTable);
		message.css({
			'max-width': '700px',
			'text-align': 'left',
			'background-color': 'white'
		}).attr('id', 'nuPropertiesMsgDiv');

		nuDragElement(document.getElementById('nuPropertiesMsgDiv'), 40);
	}

}
