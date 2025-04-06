<?php
require_once('nusessiondata.php');
$jquery = "libs/jquery/jquery-3.7.1.min.js";
?>
<!DOCTYPE html>
<html>

<head>
	<title>Ace Editor</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="<?php echo $jquery; ?>"></script>
	<script src="libs/ace/src-min-noconflict/ace.js" charset="utf-8"></script>
	<script src="libs/ace/src-min-noconflict/ext-language_tools.js" charset="utf-8"></script>
	<script src="libs/ace/src-min-noconflict/ext-beautify.js" charset="utf-8"></script>
	<link rel="stylesheet" href="css/nubuilder4.css">
	<link rel="stylesheet" href="libs/fontawesome/css/all.min.css">

	<style>
		.toolbar {
			display: flex;
			align-items: center;
			gap: 10px;
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

		.toolbar button.btn {
			width: 30px;
			height: 20px;
			padding: 0;
			display: flex;
			align-items: center;
			justify-content: center;
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
			background-color: red !important;
		}

		button.btn.beautify::before {
			content: "\f0d0";
			font-family: "Font Awesome 5 Free";
			font-weight: 900;
			margin-left: 1px;
		}

		button.btn.commentout::before {
			content: "\f7a5";
			font-family: "Font Awesome 5 Free";
			font-weight: 900;
			margin-left: 1px;
		}

		button.btn.undo::before {
			content: "\f2ea";
			font-family: "Font Awesome 5 Free";
			font-weight: 900;
			margin-left: 1px;
		}

		button.btn.showinvisibles::before {
			content: "\f06e";
			font-family: "Font Awesome 5 Free";
			font-weight: 900;
			margin-left: 1px;
		}

		button.btn.find::before {
			content: "\f002";
			font-family: "Font Awesome 5 Free";
			font-weight: 900;
			margin-left: 1px;
		}

		button.btn.searchreplace::before {
			content: "\f362";
			font-family: "Font Awesome 5 Free";
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
	</style>

	<script>
		window.nuACELanguage = opener.window.nuAce[0];
		window.nuACEObjectId = opener.window.nuAce[1];
		window.nuACETheme = opener.window.nuAce[2];
		const $el = $('#' + window.nuACEObjectId, window.opener.document);
		window.nuACEObjectLabel = $el.attr('data-nu-label') || $el.attr('title') || $el.attr('id');
		document.title = window.nuACEObjectId + " - Ace Editor";

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

			window.startValue = opener.window.document.getElementById(nuACEObjectId).value;
			editor.setFontSize(14);

			var language = window.nuACELanguage.toUpperCase();
			const languageModes = {
				'HTML': { mode: 'html' },
				'JS': { mode: 'javascript' },
				'MYSQL': { mode: 'mysql' },
				'PHP': { mode: 'php' },
				'SQL': { mode: 'sql' },
				'CSS': { mode: 'css' },
			};

			if (languageModes[language]) {
				const { mode } = languageModes[language];
				editor.getSession().setMode({ path: `ace/mode/${mode}`, inline: true });
			}

			document.getElementById('nu_language').innerHTML =
				window.nuACELanguage === window.nuACEObjectLabel
					? window.nuACEObjectLabel
					: window.nuACEObjectLabel + " (" + window.nuACELanguage + ")";

			if (language.includes('SQL')) {
				document.getElementById('nuACEBeautifyButton').style.display = 'none';
			}

			if ($('#' + window.nuACEObjectId, window.opener.document)[0].id == 'deb_message') {
				$('#btn_save_close').remove();
				$('#btn_save').remove();
			} else {
				let btnSaveClose = document.getElementById('btn_save_close');
				btnSaveClose.value = 'Apply & Close';
				btnSaveClose.title = 'Copy changes back and Close (Ctrl+Shift+C)';

				let btnSave = document.getElementById('btn_save');
				btnSave.value = 'Apply';
				btnSave.title = 'Copy changes back (Ctrl+Shift+S)';
			}

			nuResize();

			editor.renderer.setScrollMargin(10, 0, 0, 10);
			editor.setValue(window.startValue);
			editor.focus();
			editor.navigateFileStart();

			editor.on('change', function () {
				nuSetEdited(true);
			});

			// Disable Ace Ctrl+, shortcut
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

			// Retrieve auto-save state from localStorage, default is checked (true)
			var autoSave = localStorage.getItem('auto_save');
			if (autoSave === null) {
				autoSave = true;
			} else {
				autoSave = (autoSave === 'true');
			}
			document.getElementById('btn_save_on_apply_checkbox').checked = autoSave;

			// Save auto-save state when checkbox changes
			document.getElementById('btn_save_on_apply_checkbox').addEventListener('change', function () {
				localStorage.setItem('auto_save', this.checked);
			});

			document.addEventListener('keydown', function (e) {
				if (e.ctrlKey && e.shiftKey) {
					const key = e.key.toLowerCase();
					if (key === 's') {
						e.preventDefault();
						document.getElementById('btn_save').click(); // Apply
					} else if (key === 'c') {
						e.preventDefault();
						document.getElementById('btn_save_close').click(); // Apply & Close
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
			$('.nuCopyBackButton').toggleClass('red', edited);
			$('.undo').toggleClass('nuReadonly', !edited);
			$(".undo").prop("disabled", !edited);
		}

		function nuResize() {
			const toolbarHeight = document.querySelector('.toolbar').offsetHeight;
			const editorContainer = document.getElementById('editor-container');
			editorContainer.style.top = toolbarHeight + 'px';
			editorContainer.style.height = (window.innerHeight - toolbarHeight) + 'px';
		}

		function nuAceBeautify() {
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
			if (!opener.window.document.getElementById(window.nuACEObjectId)) {
				alert('The opening Form is no longer available.');
				return;
			}
			nuSetEdited(false);
			opener.window.document.getElementById(window.nuACEObjectId).value = editor.getValue();
			if ("createEvent" in document) {
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent("change", false, true);
				opener.window.document.getElementById(window.nuACEObjectId).dispatchEvent(evt);
			} else {
				opener.window.document.getElementById(window.nuACEObjectId).fireEvent("onchange");
			}
			// Call nuSaveAction only if Auto Save is checked
			if (document.getElementById('btn_save_on_apply_checkbox').checked) {
				window.opener.nuSaveAction();
				if (!close) showSavedIndicator();
			}
			if (close) {
				window.close();
			} else {
				nuRemoveButtonBgColor();
			}
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
		<input type="checkbox" id="btn_save_on_apply_checkbox">
		<label for="btn_save_on_apply_checkbox" style="margin-left: 5px;">Save on Apply</label>
		<button class="btn undo nuActionButton nuReadonly" title="Undo" onclick="editor.undo()" disabled></button>
		<button class="btn find nuActionButton" title="Find" onclick="editor.execCommand('find');"></button>
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