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
		nuMessage(["<h2>TinyMCE is not included</h2>","Set $nuConfigIncludeTinyMCE = true in nuconfig.php"]);
		return;
	}

	let idContainer = id + '_container';

	let useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	let obj = document.getElementById(idContainer);

	var _plugins;
	if (!plugins) {
		_plugins = 'code print preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textpattern noneditable help charmap emoticons';
	} else {
		_plugins = plugins;
	}

	var _mobile;
	if (!mobile) {
		_mobile = {
			plugins: 'print preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textpattern noneditable help charmap emoticons'
		}
	} else {
		_mobile = mobile;
	}

	var _toolbar;
	if (!toolbar) {
		_toolbar = 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |	numlist bullist checklist | forecolor backcolor casechange	formatpainter removeformat | pagebreak | charmap emoticons | fullscreen	preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment';
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

	let defaultOptions =
	{
		selector: "#" + idContainer,
		plugins: _plugins,
		mobile: _mobile,
		menu: {
			tc: {
				title: 'Comments',
				items: 'addcomment showcomments deleteallconversations'
			}
		},
		menubar: _menubar,
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
		skin: useDarkMode ? 'oxide-dark' : 'oxide',
		content_css: useDarkMode ? 'dark' : 'default',
		setup: function (editor) {

			editor.on('init', function (e) {
				e.target.setContent(nuGetValue(id));
				if (window.nuTinyMCEOnInit) {
					nuTinyMCEOnInit(e, editor);
				}
			});

			editor.on("change", function () {
				nuTinyMCEOnChangeHandler(editor);
			});

		}
	};

	let mergedOptions = defaultOptions;

	if (options) {
		mergedOptions = $.extend(defaultOptions, options)
	}

	tinymce.init( mergedOptions );

	if (tinymce.editors.length > 0) {

		tinymce.execCommand('mceFocus', true, idContainer);
		tinymce.execCommand('mceRemoveEditor',true, idContainer);
		tinymce.execCommand('mceAddEditor',true, idContainer);

	}

}

function nuTinyMCEOnChangeHandler(editor) {
	nuHasBeenEdited();
}

function nuSaveEditor() {

	$('.nuTinyMCE').each((index, element) => {
		let myContent = tinymce.get(element.id).getContent();
		let id = element.id.slice(0,-10);
		nuSetValue(id, myContent);
	});

}