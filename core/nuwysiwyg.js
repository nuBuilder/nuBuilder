function nuInitTinyMCE(id, options, mobile, toolbar, toolbar_groups, menubar, contextmenu) {

	nuHide(id);

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

	$('.nuQuiljs').each((index, element) => {
		let html = element.children[0].innerHTML;
		$('#' + element.id.slice(0,-10)).val(html).change();
	});

	$('.nuTinyMCE').each((index, element) => {
		let myContent = tinymce.get(element.id).getContent();
		let id = element.id.slice(0,-10);
		nuSetValue(id, myContent);
	});

}


function nuGetFontName(font) {
	return font.toLowerCase().replace(/\s/g, "-");		// Replace whitespaces
}

function nuQuillFonts(fonts) {

	var fontNames = fonts.map(font => nuGetFontName(font));
	// add fonts to style
	var fontStyles = "";
	fonts.forEach(function(font) {
		var fontName = nuGetFontName(font);
		fontStyles += ".ql-snow .ql-picker.ql-font .ql-picker-label[data-value=" + fontName + "]::before, .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=" + fontName + "]::before {" +
			"content: '" + font + "';" +
			"font-family: '" + font + "', sans-serif;" +
			"}" +
			".ql-font-" + fontName + "{" +
			" font-family: '" + font + "', sans-serif;" +
			"}";
	});

	var node = document.createElement('style');
	node.innerHTML = fontStyles;
	document.body.appendChild(node);

	return fontNames;

}

function nuQuillToolbarOptions(fontNames) {

	var toolbarOptions = [

			['bold', 'italic', 'underline', 'strike'], // toggled buttons
			['blockquote', 'code-block'],

			[{ 'header': 1 }, { 'header': 2 }], // custom button values
			[{ 'list': 'ordered' }, { 'list': 'bullet' }],
			[{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
			[{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
			[{ 'direction': 'rtl' }], // text direction

			[{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
			[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

			[{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
			[{ 'font': fontNames }],
			[{ 'align': [] }],

			['divider'],
			['link'],

			['clean'] // remove formatting button

	];

	return toolbarOptions;

}

function nuQuill(i, options) {

	nuHide(i);

	if (!Quill) {
		nuMessage(["<h2>Quill is not included</h2>","Set $nuConfigIncludeQuill = true in nuconfig.php"]);
		return;
	}

	if (!options) {
		var options = {
			modules: {
				toolbar: null
			},
			fontNames: null,
			readOnly: false,
			theme: 'snow'
		};
	}

	if (options.fontNames === null) {
		options.fontNames = nuQuillFonts(['Arial', 'Courier', 'Garamond', 'Tahoma', 'Verdana']);
	}

	if (options.modules.toolbar === null) {
		options.modules.toolbar = nuQuillToolbarOptions(options.fontNames);
	}

	if (!options.modules || options.modules === null) {

		if (options.modules.toolbar === false)	{
			options.modules.toolbar = false;
		} else {

			options.modules = {
				toolbar: options.toolbar,
				divider: {
					cssText: 'border-top: 1px solid #bbb;'
				},
				 clipboard: {
					matchVisual: false
				}

			}
		}

	}

	var Block = Quill.import('blots/block');
	class DivBlock extends Block {}
	DivBlock.tagName = 'DIV';
	Quill.register('blots/block', DivBlock, true);

	var Font = Quill.import('formats/font');
	Font.whitelist = options.fontNames;
	Quill.register(Font, true);

	var quill = new Quill('#'+ i + '_container', options);

	var content = $('#' + i).val();
	if (content !== '') {
		quill.clipboard.dangerouslyPasteHTML(content);
	}

	window[i + '_object'] = quill;

	var startDate = new Date();
	quill.on('text-change', function(delta, oldDelta, source) {
		var endDate = new Date();
		if (endDate.getTime() - startDate.getTime() > 1000) {
			nuHasBeenEdited();
		}
	});

}

function nuQuillGetInstance(i) {

	var container = document.querySelector('#'+ i + '_container');
	var quill = new Quill(container);
	if (Quill.find(container) === quill) {
		return quill;
	}

	return null;

}

function nuQuillSetContents(i, contents) {

	var quill = nuQuillGetInstance(i);
	if (quill !== null) {
		if ($.isArray(contents)) {
			quill.setContents(contents);
		} else {
			quill.clipboard.dangerouslyPasteHTML(contents);
		}
	}

}

function nuQuillGetContents(i) {

	var container = document.querySelector('#'+ i + '_container');
	return container.children[0].innerHTML;

}
