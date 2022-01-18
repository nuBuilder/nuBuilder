function nuInitTinyMCE(id) {

	nuHide(id + '_parent_container');

	document.querySelector('#'+id).style.visibility = 'hidden';

	var useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	var obj = document.getElementById(id);
	
	tinymce.init({
		selector: "#" + id,
		plugins: 'print preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern noneditable help charmap emoticons',
		mobile: {
		plugins: 'print preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern noneditable help charmap emoticons'
		}, 
		menu: {
		tc: {
			title: 'Comments',
			items: 'addcomment showcomments deleteallconversations'
		}
		},
		menubar: 'file edit view insert format tools table tc help',
		toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |	numlist bullist checklist | forecolor backcolor casechange	formatpainter removeformat | pagebreak | charmap emoticons | fullscreen	preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
		autosave_ask_before_unload: true,
		autosave_interval: '30s',
		autosave_prefix: '{path}{query}-{id}-',
		autosave_restore_when_empty: false,
		autosave_retention: '2m',
		image_advtab: true,
		importcss_append: true,
		height: obj.clientHeight,
		width: obj.clientWidth,
		image_caption: true,
		quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
		noneditable_noneditable_class: 'mceNonEditable',
		toolbar_mode: 'sliding',
		content_style: "p { margin: 0; }",
		contextmenu: 'link image table configurepermanentpen',
		skin: useDarkMode ? 'oxide-dark' : 'oxide',
		content_css: useDarkMode ? 'dark' : 'default',

		setup: function (editor) {
		editor.on('init', function (e) {

			let container =	tinymce.get(id).getContainer();

			container.style.left = obj.style.left;
			container.style.top = obj.style.top;

			e.target.setContent(nuGetValue(id)); 
			
			document.querySelector('#'+id).style.visibility = 'visible';
			
		});
		}

	});

	nuHide(id);
	
	if (tinymce.editors.length > 0) {

		tinymce.execCommand('mceFocus', true, id );
		tinymce.execCommand('mceRemoveEditor',true, id);
		tinymce.execCommand('mceAddEditor',true, id);		

	}

}

function nuSaveEditor() {

	$('.nuQuiljs').each((index, element) => {
		let html = element.children[0].innerHTML;
		$('#' + element.id.slice(0,-10)).val(html).change();
	});

	$('.nuTinyMCE').each((index, element) => {
		let id = element.id.slice(0,-10);
		let myContent = tinymce.get(id).getContent();
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

	if (typeof options === 'undefined') {
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

	if (typeof options.modules === 'undefined' || options.modules === null) {
		
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

	nuHide(i);

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
	} else {
		return null;
	}

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
