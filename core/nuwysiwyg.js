function nuInitTinyMCE(id, options, mobile, toolbar, toolbar_groups, menubar, contextmenu, quickbars) {

	nuHide(id);

	let plugins;

	if (options) {
		if ($.type(options) !== 'object') {
			plugins = options;
			options = undefined;
		}
	}

	if (!tinymce) {
		nuMessage("TinyMCE is not included", "Set $nuConfigIncludeTinyMCE = true in nuconfig.php");
		return;
	}

	let idContainer = id + '_container';
	let obj = document.getElementById(idContainer);

	var _plugins;
	if (!plugins) {
		_plugins = 'code preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists help charmap emoticons';
	} else {
		_plugins = plugins;
	}

	var _mobile;
	if (!mobile) {
		_mobile = {
			plugins: 'preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists help charmap emoticons'
		}
	} else {
		_mobile = mobile;
	}

	var _toolbar;
	if (!toolbar) {
		_toolbar = 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |	numlist bullist checklist | forecolor backcolor casechange	formatpainter removeformat | pagebreak | charmap emoticons | fullscreen	preview save print | insertfile image media pageembed link anchor codesample | a11ycheck ltr rtl | showcomments addcomment';
	} else {

		if (toolbar == 'minimal') {
			_toolbar = 'undo redo | bold italic underline strikethrough | image link | bullist | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | forecolor backcolor | fullscreen';
		} else {
			_toolbar = toolbar;
		}
	}

	var _toolbar_groups;
	if (!toolbar_groups) {
		_toolbar_groups = {};
	} else {
		_toolbar_groups = toolbar_groups;
	}

	var _menubar;
	if (!menubar) {
		_menubar = 'file edit view insert format tools table tc help';
	} else {
		_menubar = menubar;
	}

	var _contextmenu;
	if (!contextmenu) {
		_contextmenu = 'image table configurepermanentpen';
	} else {
		_contextmenu = contextmenu;
	}

	var _quickbars;
	if (!quickbars) {
		_quickbars = 'bold italic | quicklink h2 h3 blockquote quickimage quicktable';
	} else {
		_quickbars = quickbars;
	}

	let defaultOptions = {
		selector: "#" + idContainer,
		plugins: _plugins,
		mobile: _mobile,
		menu: {
			tc: {
				title: 'Comments',
				items: 'addcomment showcomments deleteallconversations'
			}
		},
		external_plugins: {},
		menubar: _menubar,
		resize: true,
		toolbar: _toolbar,
		toolbar_groups: _toolbar_groups,
		autosave_ask_before_unload: true,
		autosave_interval: '30s',
		autosave_prefix: '{path}{query}-{id}-',
		autosave_restore_when_empty: false,
		autosave_retention: '2m',
		elementpath: false,
		image_advtab: true,
		importcss_append: true,
		height: obj.clientHeight,
		width: obj.clientWidth,
		image_caption: true,
		quickbars_selection_toolbar: _quickbars,
		noneditable_noneditable_class: 'mceNonEditable',
		toolbar_mode: 'sliding',
		content_style: "p { margin: 0; }",
		contextmenu: _contextmenu,
		skin: 'oxide',
		content_css: 'default',
		cache_suffix: '?v=8.0.0',
		license_key: 'gpl',
		setup: function (editor) {

			editor.addShortcut('ctrl+shift+S', 'Save', function () {
				window.isShortcutSave = true;

				nuSaveAction();
				setTimeout(() => { window.isShortcutSave = false; }, 1000);

				return false;
			});

			editor.on('init', function (e) {

				e.target.setContent($('#' + id).val());
				if (window.nuTinyMCEOnInit) {
					nuTinyMCEOnInit(e, editor, id);
				}
			});

			editor.on("change", function () {
				if (window.isShortcutSave) {
					return;
				}
				nuTinyMCEOnChangeHandler(editor);
			});

		}
	};

	let mergedOptions = defaultOptions;

	if (options) {
		mergedOptions = $.extend(defaultOptions, options)
	}

	if (tinymce.get(idContainer)) {
		tinymce.remove("#" + idContainer);
	}

	tinymce.init(mergedOptions);

}

function nuTinyMCEOnChangeHandler(editor) {
	nuHasBeenEdited();
}

function nuSaveEditor() {

	$('.nuTinyMCE').each((index, element) => {
		let myContent = tinymce.get(element.id).getContent();
		let id = element.id.slice(0, -10);
		$('#' + id).val(myContent).trigger("change");
	});

}

function nuGetTinyMCEEditor(elementId) {

	const tinyMCEId = $(`#${elementId}_parent_container`).find('.nuTinyMCE').attr('id');
	return tinymce.get(tinyMCEId);

}

function nuTinyMCESetContent(elementId, html) {

	const editor = nuGetTinyMCEEditor(elementId);
	if (editor) {
		editor.setContent(html);
	}

}

function nuTinyMCEGetContent(elementId) {

	const editor = nuGetTinyMCEEditor(elementId);
	return editor ? editor.getContent() : '';

}

function nuTinyMCESetBounds(id, left, top, width, height) {

	const idParentContainer = `${id}_parent_container`;
	const element = document.getElementById(idParentContainer);

	if (element) {
		if (left) element.style.left = `${left}px`;
		if (top) element.style.top = `${top}px`;
		if (width) element.style.width = `${width}px`;
		if (height) element.style.height = `${height}px`;
	} else {
		return;
	}

	id += '_container';
	const editor = tinymce.get(id);
	if (editor) {
		const container = editor.getContainer();
		if (width) container.style.width = `${width}px`;
		if (height) container.style.height = `${height}px`;
		if (left) container.style.left = `${left}px`;
		if (top) container.style.top = `${top}px`;
	}

}
