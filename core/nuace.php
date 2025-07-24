<?php
require_once('nusessiondata.php');
require_once('nusetuplibs.php');
require_once('../nuconfig.php');
$jquery = "../third_party/jquery/jquery-3.7.1.min.js";
?>

<!DOCTYPE html>
<html>

<head>
	<title>Ace Editor</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="<?php echo $jquery; ?>"></script>
	<script src="../third_party/ace/src-min-noconflict/ace.js" charset="utf-8"></script>
	<script src="../third_party/ace/src-min-noconflict/ext-language_tools.js" charset="utf-8"></script>
	<script src="../third_party/ace/src-min-noconflict/ext-beautify.js" charset="utf-8"></script>
	<?php
	$includeFormatters = [
		'../third_party/formatter/beautify.min.js',
		'../third_party/formatter/beautify-html.min.js',
		'../third_party/formatter/beautify-css.js',
		'../third_party/formatter/sql-formatter.min.js'];
	nuJSIndexInclude($includeFormatters);

	$includeCSS = [
		'../third_party/fontawesome/css/all.min.css',
		'css/nubuilder4.css'];
	nuCSSIndexInclude($includeCSS);
	?>

	<style>
		.toolbar {
			display: flex;
			align-items: center;
			padding: 8px;
			background: #f0f0f0;
			border-bottom: 1px solid #ccc;
			flex-wrap: wrap;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 1000;
		}

		.toolbar .nuActionButton {
			margin-right: 10px;
		}

		.toolbar>* {
			margin-bottom: 10px;
		}

		.toolbar button.btn {
			padding: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 48px;
			min-height: 32px;
		}

		.toolbar img {
			margin-left: auto;
		}

		#saveIndicator {
			display: none;
			height: 20px;
			font-size: 16px;
			font-weight: 400;
			line-height: 18px;
			text-align: center;
			vertical-align: middle;
			text-shadow: 0 1px 1px #E1E8EA;
			border-style: solid;
			border-width: 1px;
			border-color: #01A6F5;
			background-color: #EDEDED;
			color: #01A6F5;
			border-radius: 4px;
			box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
			opacity: 0.7;
			padding: 0 5px;
			display: inline-block;
			margin-left: 10px;
			margin-right: 5px;
		}

		#editor-container {
			position: absolute;
			top: 50px;
			left: 0;
			right: 0;
			bottom: 0;
			margin-top: 3px;
		}

		#nu_editor_pad,
		#nu_editor {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		.nuCopyBackButton.red {
			background-color: #dc3545 !important;
			box-shadow: inset 0 0 0 1px #dc3545;
		}

		button.btn.beautify::before {
			content: "\f0d0";
			font-family: "Font Awesome 7 Free";
			font-weight: 900;
			margin-left: 1px;
		}

		button.btn.commentout::before {
			content: "\f7a5";
			font-family: "Font Awesome 7 Free";
			font-weight: 900;
			margin-left: 1px;
		}

		button.btn.undo::before {
			content: "\f2ea";
			font-family: "Font Awesome 7 Free";
			font-weight: 900;
			margin-left: 1px;
		}

		button.btn.showinvisibles::before {
			content: "\f06e";
			font-family: "Font Awesome 7 Free";
			font-weight: 900;
			margin-left: 1px;
		}

		button.btn.find::before {
			content: "\f002";
			font-family: "Font Awesome 7 Free";
			font-weight: 900;
			margin-left: 1px;
		}

		button.btn.searchreplace::before {
			content: "\f362";
			font-family: "Font Awesome 7 Free";
			font-weight: 900;
			margin-left: 1px;
		}

		.toolbar #nu_language {
			color: black;
			flex-basis: 100%;
			text-align: left;
			margin-top: 5px;
			margin-left: 10px;
		}

		.btn-toggle {
			padding: 5px 12px;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			border: 1px solid #ccc;
			border-radius: 4px;
			background-color: #f7f7f7;
			color: #333;
			font-size: 14px;
			cursor: pointer;
			transition: background-color 0.15s, border-color 0.15s, color 0.15s;
		}

		.btn-toggle:hover {
			background-color: #e6e6e6;
		}

		.btn-toggle input[type="checkbox"] {
			position: absolute;
			opacity: 0;
			pointer-events: none;
		}

		.btn-toggle i {
			margin-right: 8px;
			font-size: 16px;
		}

		.btn-toggle .checked-icon {
			display: none;
		}

		.btn-toggle input[type="checkbox"]:checked~.checked-icon {
			display: inline-block;
		}

		.btn-toggle input[type="checkbox"]:checked~.unchecked-icon {
			display: none;
		}

		.btn-toggle input[type="checkbox"]:checked~span,
		.btn-toggle input[type="checkbox"]:checked~i {
			background-color: transparent;
		}
	</style>

	<script>

		let nuAce = (window.opener?.nuAce) ?? [];

		window.nuACELanguage = nuAce[0] ?? nuAceGetURLParam('lang', 'JS');
		window.nuACEObjectId = nuAce[1] ?? nuAceGetURLParam('object_id', '');
		window.nuACETheme = nuAce[2] ?? nuAceGetURLParam('theme', 'dawn');

		let doc = window.opener?.document ?? null;
		let $el = (doc && window.nuACEObjectId) ? $('#' + window.nuACEObjectId, doc) : null;

		const label = $el ? ($el.attr('data-nu-label') ?? nuAceGetURLParam('data-label', '')) : nuAceGetURLParam('data-label', '');
		const title = $el ? ($el.attr('title') ?? nuAceGetURLParam('title', '')) : nuAceGetURLParam('title', '');
		const id = $el ? ($el.attr('id') ?? nuAceGetURLParam('id', '')) : nuAceGetURLParam('id', '');

		window.nuACEObjectLabel = label || title || id;

		function nuAceGetURLParam(name, defaultValue = null) {
			try {
				const url = new URL(window.location.href);
				return url.searchParams.get(name) ?? defaultValue;
			} catch (e) {
				return defaultValue;
			}
		}

		function nuGetAceLanguageMode(language) {
			const languageModes = {
				'TEXT': { mode: 'text' },
				'HTML': { mode: 'html' },
				'JS': { mode: 'javascript' },
				'MYSQL': { mode: 'mysql' },
				'PHP': { mode: 'php' },
				'SQL': { mode: 'mysql' },
				'CSS': { mode: 'css' },
			};
			return languageModes[language];
		}

		function nuAceGetCallerDocument() {
			if (window.opener?.document) return window.opener.document;
			if (window.parent?.document) return window.parent.document;
		}

		function nuAceGetCallerWindow() {
			if (window.opener?.window) return window.opener.window;
			if (window.parent?.window) return window.parent.document;
		}

		function nuAceGetSourceElement() {

			const objectId = (window.opener && window.opener.document)
				? window.nuACEObjectId
				: nuAceGetURLParam('object_id', '');

			if (!objectId) {
				return null;
			}

			const doc = nuAceGetCallerDocument();
			if (doc) {
				const el = doc.getElementById(objectId);
				if (el) return el;
			}

			return null;

		}

		function nuAceSetStartValue() {

			const el = nuAceGetSourceElement();
			window.sourceElement = el ? el : null;
			window.sourceElementid = el && el.id ? el.id : null;
			window.startValue = el ? el.value : '';

		}

		function nuLoad() {

			ace.require("ace/ext/language_tools");
			window.beautify = ace.require("ace/ext/beautify");
			window.editor = ace.edit("nu_editor");
			editor.setShowPrintMargin(false);
			const theme = "ace/theme/" + (window.nuACETheme ? window.nuACETheme : 'monokai');
			editor.setTheme(theme);
			editor.setOptions({
				enableBasicAutocompletion: true,
				enableSnippets: true,
				enableLiveAutocompletion: true
			});

			nuAceSetStartValue();

			editor.setFontSize(14);

			var language = window.nuACELanguage.toUpperCase();
			const languageMode = nuGetAceLanguageMode(language);

			if (languageMode) {

				const { mode } = languageMode;
				editor.getSession().setMode({
					path: `ace/mode/${mode}`,
					inline: true
				});

				if (language === 'CSS') {
					const DISABLED_RULES = ['important', 'order-alphabetical'];

					function configureCSSLintWorker() {
						if (editor.session.$worker) {
							editor.session.$worker.call('setDisabledRules', [DISABLED_RULES.join('|')]);
						}
					}
					editor.session.on('changeMode', configureCSSLintWorker);
					configureCSSLintWorker();
				}

			}

			const objInfo = window.nuACELanguage === window.nuACEObjectLabel
				? window.nuACEObjectLabel
				: window.nuACEObjectLabel + " (" + window.nuACELanguage + ")";

			document.getElementById('nu_language').innerHTML = objInfo;
			document.title = objInfo + " - Ace Editor";

			if (language.includes('SQL') && typeof sqlFormatter === 'undefined') {
				document.getElementById('nuACEBeautifyButton').style.display = 'none';
			}

			if (window.sourceElementid == 'deb_message') {
				$('#btn_save_close').remove();
				$('#btn_save').remove();
				$('.btn-toggle').remove();
			} else {

				let btnSaveClose = document.getElementById('btn_save_close');
				btnSaveClose.value = 'Apply & Close';
				btnSaveClose.title = 'Copy changes back and Close (Ctrl+Shift+C)';
				let btnSave = document.getElementById('btn_save');
				btnSave.value = 'Apply';
				btnSave.title = 'Copy changes back (Ctrl+Shift+S)';
			}

			nuResize();
			editor.renderer.setScrollMargin(10, 20, 0, 10);
			editor.setValue(window.startValue);
			editor.focus();
			editor.navigateFileStart();
			editor.on('change', function () {
				nuSetEdited(true);
			});

			editor.commands.addCommand({
				name: 'showSettingsMenu',
				bindKey: {},
				exec: editor.commands.byName['showSettingsMenu'].exec
			});

			editor.commands.addCommand({
				name: "showKeyboardShortcuts",
				bindKey: { win: "Ctrl-Shift-k", mac: "Command-Shift-k" },
				exec: function (editor) {
					ace.config.loadModule("ace/ext/keybinding_menu", function (module) {
						module.init(editor);
						editor.showKeyboardShortcuts()
					})
				}
			})
			document.addEventListener('keydown', nuACEhandleCtrlComma);
			nuSetEdited(false);
			editor.getSession().getUndoManager().reset();

			var autoSave = localStorage.getItem('auto_save');
			if (autoSave === null) {
				autoSave = true;
			} else {
				autoSave = (autoSave === 'true');
			}

			document.getElementById('btn_save_on_apply_checkbox').checked = autoSave;
			document.getElementById('btn_save_on_apply_checkbox').addEventListener('change', function () {
				localStorage.setItem('auto_save', this.checked);
			});

			document.addEventListener('keydown', function (e) {
				if (e.ctrlKey && e.shiftKey) {
					const key = e.key.toLowerCase();
					if (key === 's') {
						e.preventDefault();
						document.getElementById('btn_save').click();
					} else if (key === 'c') {
						e.preventDefault();
						document.getElementById('btn_save_close').click();
					}
				}
			});
		}

		function nuACEhandleCtrlComma(event) {
			if ((event.metaKey || event.ctrlKey) && event.keyCode == 188) {
				editor.execCommand("showSettingsMenu");
				document.title = Date.now();
				setTimeout(function () {
					$('#ace_settingsmenu').parent().css('background-color', '');
				}, 50);
			}
		}

		function nuSetEdited(edited = true) {
			$('.nuCopyBackButton').toggleClass('nuSaveButtonEdited', edited);
			$('.undo').toggleClass('nuReadonly', !edited);
			$(".undo").prop("disabled", !edited);
		}

		function nuResize() {
			const toolbarHeight = document.querySelector('.toolbar').offsetHeight;
			const editorContainer = document.getElementById('editor-container');
			editorContainer.style.top = toolbarHeight + 'px';
			editorContainer.style.height = (window.innerHeight - toolbarHeight - 5) + 'px';
		}

		function nuAceBeautify() {

			var language = window.nuACELanguage.toUpperCase();

			const beautifyOptions = {
				indent_size: 4,						// number of spaces per indent
				indent_char: ' ',					// character for indentation (space or tab)
				indent_with_tabs: false,			// use tabs instead of spaces
				indent_level: 0,			 		// initial indent level
				eol: '\n',						 	// newline character(s)
				preserve_newlines: true,			// keep existing line breaks
				max_preserve_newlines: 10,		 	// max consecutive blank lines
				space_in_paren: false,		 		// spaces inside parentheses
				space_in_empty_paren: false,		// space in empty parens
				space_before_conditional: true,		// space before `if (`
				space_after_anon_function: false, 	// space before `function ()`
				jslint_happy: false,				// jslint-stricter mode
				brace_style: 'preserve-inline',		// brace position style
				break_chained_methods: false,		// break chained method calls onto new lines
				keep_array_indentation: true, 		// preserve array indent
				keep_function_indentation: false, 	// preserve function indent
				unescape_strings: false,			// decode \xNN escape sequences
				wrap_line_length: 0,				// wrap lines at N chars (0 = no wrap)
				wrap_attributes: 'auto',			// (HTML/CSS) wrap tag attributes
				wrap_attributes_indent_size: 4,		// indent size for wrapped attributes
				end_with_newline: false,			// end output with a newline
				e4x: false,							// (JSX/E4X) leave XML literals alone
				comma_first: false,					// commas at start of line, not end
				good_stuff: false					// enable Crockford’s styling preferences
			}

			const beautifiers = {
				'JS': js_beautify,
				'HTML': html_beautify,
				'CSS': css_beautify
			};

			if (beautifiers[language] && typeof beautifiers[language] === 'function') {
				const code = editor.getValue();
				const formatted = beautifiers[language](code, beautifyOptions);
				editor.setValue(formatted, -1);
				return;
			} else if (language === 'SQL' && typeof sqlFormatter !== 'undefined') {
				const code = editor.getValue();
				const formatted = sqlFormatter.format(code, {
					language: 'mysql', // SQL dialect: 'mysql', 'postgresql', 'sql', etc.
					tabWidth: 2, // Indent with 2 spaces
					keywordCase: 'upper', // Uppercase SQL keywords
					dataTypeCase: 'upper', // Uppercase data types
					functionCase: 'lower', // Lowercase function names
					identifierCase: 'preserve', // Keep identifiers as-is (experimental)
					logicalOperatorNewline: 'before', // Newline before AND/OR/XOR
					expressionWidth: 50, // Max chars in parenthesized expressions before wrapping
					linesBetweenQueries: 2, // Two newlines between queries
					denseOperators: false, // Add spaces around operators
					newlineBeforeSemicolon: false, // Semicolon stays on same line
					params: {}, // No placeholder replacement
					paramTypes: {}, // No special param types
				});
				editor.setValue(formatted, -1);
				return;
			}

			beautify.beautify(editor.session);

		}

		function nuAceShowInvisibles() {
			if (typeof window.showInvisibles === 'undefined') {
				window.showInvisibles = true;
				editor.setShowInvisibles(true);
			} else {
				window.showInvisibles = !window.showInvisibles;
				editor.setShowInvisibles(window.showInvisibles);
			}
		}

		function nuAceSave(close) {

			window.nuWarn = 0;

			const aceElem = nuAceGetSourceElement();

			if (!aceElem) {
				alert('The opening Form is no longer available.');
				return;
			}

			nuSetEdited(false);
			aceElem.value = editor.getValue();

			if ('createEvent' in document) {
				const evt = document.createEvent('HTMLEvents');
				evt.initEvent('change', false, true);
				aceElem.dispatchEvent(evt);
			} else {
				aceElem.fireEvent('onchange');
			}

			const checkbox = document.getElementById('btn_save_on_apply_checkbox');
			if (checkbox.checked) {
				const openerWindow = nuAceGetCallerWindow();
				openerWindow.nuSaveAction();
				if (!close) showSavedIndicator();
			}

			close ? window.close() : nuRemoveButtonBgColor();

		}

		function nuRemoveButtonBgColor() {
			$('#btn_save_close').css('background-color', '');
			$('#btn_save').css('background-color', '');
		}

		function showSavedIndicator() {
			$('#saveIndicator').fadeIn(200).delay(1000).fadeOut(200);
		}

		function nuWarning() {
			if (editor.getValue() != window.startValue && window.nuWarn == 1) {
				return "Close this window without Saving?";
			}
		}

		window.nuWarn = 1;
		window.onbeforeunload = nuWarning;
	</script>
</head>

<body onload="nuLoad()" onresize="nuResize()">
	<div class="toolbar">
		<input type="button" id="btn_save_close" class="nuActionButton nuCopyBackButton" onclick="nuAceSave(true)">
		<input type="button" id="btn_save" class="nuActionButton nuCopyBackButton" onclick="nuAceSave(false)">
		<span id="saveIndicator"
			style="display:none; margin-left: 10px; margin-right: 5px; font-weight:bold; color:green;">
			Saved!
		</span>
		<label class="btn btn-toggle" style="margin-left: 5px;">
			<input type="checkbox" id="btn_save_on_apply_checkbox">
			<i class="fa-regular fa-square unchecked-icon"></i>
			<i class="fa-regular fa-square-check checked-icon"></i>
			<span>Save on Apply</span>
		</label>
		<button class="btn undo nuActionButton nuReadonly" title="Undo" onclick="editor.undo()" disabled></button>
		<button class="btn find nuActionButton" title="Search" onclick="editor.execCommand('find');"></button>
		<button class="btn searchreplace nuActionButton" title="Search and Replace"
			onclick="editor.execCommand('replace');"></button>
		<button class="btn commentout nuActionButton" title="Toggle Comment Lines"
			onclick="editor.toggleCommentLines();"></button>
		<button id="nuACEBeautifyButton" class="btn beautify nuActionButton" title="Beautify"
			onclick="nuAceBeautify();"></button>
		<button class="btn showinvisibles nuActionButton" title="Show invisible characters"
			onclick="nuAceShowInvisibles();"></button>
		<span id="nu_language" class="nuNotBreadcrumb"></span>
	</div>
	<div id="editor-container">
		<div id="nu_editor_pad"></div>
		<div id="nu_editor"></div>
	</div>
</body>

</html>