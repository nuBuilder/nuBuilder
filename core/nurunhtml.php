<?php
require_once('nusessiondata.php');
require_once('nucommon.php');
require_once('nudata.php');

print "<meta charset='utf-8'>";

$debugId = $_GET['i'] ?? '';

$sessionVariable = "nuPrint_$debugId";
$jsonData = isset($_SESSION[$sessionVariable]) ? json_decode($_SESSION[$sessionVariable]) : null;

if ($jsonData === null) {
	$jsonData = nuGetDebugMessageData($debugId);
	$_SESSION[$sessionVariable] = json_encode($jsonData);
}

if ($jsonData) {

	$columns = $jsonData->columns;
	$sqlQuery = $jsonData->sql;

	$_POST['nuHash'] = (array) $jsonData->hash;
	$hash = nuHash();
	$_POST['nuHash']['TABLE_ID'] = $hash['browse_table_id'];
	$formDescription = $_POST['nuHash']['form_description'];

	print "<title>" . 'Print: ' . htmlspecialchars($formDescription) . "</title>";

	nuEval($hash['form_id'] . '_BB');

	if (nuHasErrors()) {
		echo implode("<br>", $_POST['nuErrors']);
	}

	$data = nuExecuteQueryAndFetchData($sqlQuery);
	$tableHtml = nuRunHTMLGenerateHTMLTable($columns, $data, $hash);

	$tableWrapperStyles = "margin:20px 0 0 80px;";
	print "<div id='nuPrintTableWrapper' style='{$tableWrapperStyles}'>"
		. $tableHtml .
		"</div>";

	$sanitizedFilename = nuSanitizeFilename($formDescription) . '.csv';

	$csvOptions = nuDecode(nuObjKey($hash, 'nuPrintCSVExportOptions', []));
	if (!is_array($csvOptions)) {
		$csvOptions = [];
	}

	$fileName = isset($csvOptions['fileName']) ?
		nuSanitizeFilename($csvOptions['fileName']) :
		nuSanitizeFilename($formDescription . '.csv');

	$csvOptionsJson = json_encode($csvOptions);

	echo <<<HTML
<style>
	.nu-button {
		position: fixed; left: 24px;
		z-index: 9999; width: 48px; height: 48px;
		border-radius: 50%; background: #1e53c6; color: #fff;
		border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
		display: flex; align-items: center; justify-content: center;
		cursor: pointer; font-size: 24px; transition: background .2s;
	}
	.nu-button:hover { background: #17429a; }

	#nuPrintOptionsBtn {
		top: 136px;
	}

	#nuPrintDownloadBtn {
		top: 80px;
		font-size: 28px;
	}

	#nuPrintCopyBtn {
		top: 24px;
		font-size: 20px;
	}

	.modal {
		display: none; position: fixed; z-index: 10000;
		left: 0; top: 0; width: 100%; height: 100%;
		background: rgba(0,0,0,0.5);
	}
	.modal-content {
		background: #fff; margin: 10% auto; padding: 20px;
		border-radius: 4px; width: 300px;
	}
	.modal-header { font-size: 18px; margin-bottom: 10px; }
	.modal-body label { display: block; margin: 8px 0 4px; }
	.modal-body input[type="text"],
	.modal-body input[type="checkbox"] { margin-right: 6px; }
	.modal-footer {
		text-align: right; margin-top: 12px;
	}
	.modal-footer button {
		margin-left: 8px; padding: 6px 12px; font-size: 14px;
	}

	.copy-toast {
		position: fixed; top: 20px; left: 50%;
		transform: translateX(-50%);
		background: #28a745; color: white;
		padding: 12px 24px; border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.15);
		z-index: 10001; opacity: 0;
		transition: opacity 0.3s ease;
	}
	.copy-toast.show {
		opacity: 1;
	}

	.align-l { text-align: left; }
	.align-c { text-align: center; }
	.align-r { text-align: right; }
	table { font-size: 12px; }

</style>

<button id="nuPrintCopyBtn" class="nu-button" title="Copy Table (Ctrl+Shift+C)">
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
			 stroke="currentColor" stroke-width="2" stroke-linecap="round"
			 stroke-linejoin="round">
		<rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="#fff"/>
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="#fff"/>
	</svg>
</button>
<button id="nuPrintDownloadBtn" class="nu-button" title="Download CSV (Ctrl+Shift+D)">
	<svg width="28" height="28" viewBox="0 0 24 24" fill="none"
			 stroke="currentColor" stroke-width="2" stroke-linecap="round"
			 stroke-linejoin="round">
		<circle cx="12" cy="12" r="10" stroke="#fff" fill="#1e53c6"/>
		<path d="M12 8v6M12 14l-3-3m3 3l3-3" stroke="#fff"/>
		<rect x="8" y="16" width="8" height="2" rx="1" fill="#fff"/>
	</svg>
</button>
<button id="nuPrintOptionsBtn" class="nu-button" title="CSV Options (Ctrl+Shift+O)">⚙</button>

<div id="copyToast" class="copy-toast">Table copied to clipboard!</div>

<div id="nuPrintOptionsModal" class="modal">
	<div class="modal-content">
		<div class="modal-header">CSV Export Options</div>
		<div class="modal-body">
			<label>
				Delimiter:
				<input type="text"
							 id="optDelimiter"
							 list="optDelimiterList"
							 placeholder="Choose delimiter…"
							 title="Type or press ↓ to see options">
			</label>
			<datalist id="optDelimiterList">
				<option value=",">Comma ( , )</option>
				<option value=";">Semicolon ( ; )</option>
				<option value="\t">Tab ( \t )</option>
				<option value="|">Pipe ( | )</option>
				<option value=":">Colon ( : )</option>
				<option value=" ">Space ( )</option>
			</datalist>

			<label>
				Line Terminator:
				<input type="text"
							 id="optLineTerminator"
							 list="optLineTerminatorList"
							 placeholder="Choose terminator…"
							 title="Type or press ↓ to see options">
			</label>
			<datalist id="optLineTerminatorList">
				<option value="\\r\\n">CR+LF (\\r\\n)</option>
				<option value="\\n">LF (\\n)</option>
				<option value="\\r">CR (\\r)</option>
			</datalist>

			<label>
				<input type="checkbox" id="optIncludeHeaders">
				Include Headers
			</label>
			<label>
				<input type="checkbox" id="optBOM">
				Add BOM (UTF-8)
			</label>
			<label>
				File Name:
				<input type="text" id="optFileName" value="">
			</label>
		</div>
		<div class="modal-footer">
			<button id="optCancelBtn">Cancel</button>
			<button id="optSaveBtn">Save</button>
		</div>
	</div>
</div>

<script>
let downloadFilename = '{$fileName}';
let csvExportOptions = {$csvOptionsJson};

function nuTableToCSV(table, options = {}) {
	const {
		delimiter = ';',
		lineTerminator = '\\r\\n',
		includeHeaders = true,
		bom = false
	} = options;
	const rows = Array.from(table.rows);
	const dataRows = includeHeaders ? rows : rows.slice(1);
	const escapeRE = new RegExp('["' + delimiter + '\\r\\n]');

	const csvLines = dataRows.map(row =>
		Array.from(row.cells).map(cell => {
			let text = cell.textContent.replace(/"/g, '""');
			if (escapeRE.test(text)) text = '"' + text + '"';
			return text;
		}).join(delimiter)
	);
	const csv = csvLines.join(lineTerminator);
	return bom ? '\uFEFF' + csv : csv;
}

function nuRunHTMLDownloadCSV() {
	const table = document.querySelector('table');
	if (!table) return;
	const csv = nuTableToCSV(table, csvExportOptions);
	const blob = new Blob([csv], { type: 'text/csv' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = downloadFilename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function showToast(message) {
	const toast = document.getElementById('copyToast');
	toast.textContent = message;
	toast.classList.add('show');
	setTimeout(() => {
		toast.classList.remove('show');
	}, 2000);
}

async function nuRunHTMLCopyTable() {
  const table = document.querySelector('table');
  if (!table) {
    showToast('No table found to copy');
    return;
  }

  const rows = Array.from(table.rows);
  const tsv = rows
    .map(row => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      return cells.map(cell => cell.innerText.trim()).join('\t');
    })
    .join('\\r\\n');

  try {
    const htmlBlob = new Blob([table.outerHTML], { type: 'text/html' });
    const textBlob = new Blob([tsv], { type: 'text/plain' });
    const clipboardItem = new ClipboardItem({
      'text/html': htmlBlob,
      'text/plain': textBlob
    });

    await navigator.clipboard.write([clipboardItem]);
    showToast('Table copied to clipboard!');
  } catch (err) {
    console.error('Clipboard API failed, falling back to execCommand:', err);

    const range = document.createRange();
    range.selectNode(table);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    if (document.execCommand('copy')) {
      showToast('Table copied to clipboard!');
    } else {
      showToast('Copy failed – please press Ctrl+C manually');
    }
    sel.removeAllRanges();
  }
}

// Event listeners
document.getElementById('nuPrintDownloadBtn').onclick = nuRunHTMLDownloadCSV;
document.getElementById('nuPrintCopyBtn').onclick = nuRunHTMLCopyTable;

document.addEventListener('keydown', e => {
	if ((e.ctrlKey||e.metaKey) && e.shiftKey) {
		if (e.key.toLowerCase() === 'd') {
			e.preventDefault();
			nuRunHTMLDownloadCSV();
		}
		if (e.key.toLowerCase() === 'o') {
			e.preventDefault();
			openOptions();
		}
		if (e.key.toLowerCase() === 'c') {
			e.preventDefault();
			nuRunHTMLCopyTable();
		}
	}
});

// Modal logic
const modal = document.getElementById('nuPrintOptionsModal');
const btnOptions = document.getElementById('nuPrintOptionsBtn');
const btnSave = document.getElementById('optSaveBtn');
const btnCancel = document.getElementById('optCancelBtn');

const fldDelimiter	 = document.getElementById('optDelimiter');
const fldLineTerm = document.getElementById('optLineTerminator');
const fldHeaders = document.getElementById('optIncludeHeaders');
const fldBOM = document.getElementById('optBOM');
const fldFileName= document.getElementById('optFileName');

function openOptions() {
	fldDelimiter.value	= csvExportOptions.delimiter || ',';
	fldLineTerm.value = csvExportOptions.lineTerminator || JSON.stringify("\\r\\n").slice(1, -1);
	fldHeaders.checked	= csvExportOptions.includeHeaders !== false;
	fldBOM.checked		= csvExportOptions.bom === true;
	fldFileName.value	= downloadFilename;
	modal.style.display	= 'block';
}
function closeOptions() {
	modal.style.display = 'none';
}

btnOptions.onclick	 = openOptions;
btnCancel.onclick = closeOptions;
window.onclick		= evt => { if (evt.target === modal) closeOptions(); };

btnSave.onclick = () => {
	csvExportOptions.delimiter = fldDelimiter.value;
	csvExportOptions.lineTerminator = fldLineTerm.value;
	csvExportOptions.includeHeaders = fldHeaders.checked;
	csvExportOptions.bom = fldBOM.checked;
	downloadFilename = fldFileName.value.trim() || downloadFilename;
	csvExportOptions.fileName = downloadFilename;
	closeOptions();
};

</script>

HTML;

	nuRunHTMLCleanup($debugId, $hash);

} else {
	print nuTranslate("Use the Print button to refresh the table.");
}

function nuGetDebugMessageData($debugId) {
	$select = "SELECT deb_message AS json FROM zzzzsys_debug WHERE zzzzsys_debug_id = ? ";
	$stmt = nuRunQuery($select, [$debugId]);
	if (db_num_rows($stmt) == 0) {
		return false;
	}
	$obj = db_fetch_object($stmt);
	return json_decode($obj->json);
}

function nuRunHTMLGenerateTableHeader($columns, $includeHiddenColumns = false, $includedColumns = [], $excludedColumns = []) {
	$tableHtml = "<TR>";

	$columnCount = count($columns);
	for ($col = 0; $col < $columnCount; $col++) {
		$column = $columns[$col];
		$printColumn = nuRunHTMLPrintColumn($col, $column, $includeHiddenColumns, $includedColumns, $excludedColumns);
		if ($printColumn) {
			// Use class for alignment
			$alignClass = 'align-' . strtolower(substr($column->align, 0, 1)); // l/c/r
			$tableHtml .= "<TH class='$alignClass'>" . nuTranslate($column->title) . "</TH>\n";
		}
	}
	$tableHtml .= "</TR>";
	return $tableHtml;
}

function nuRunHTMLPrintColumn($col, $column, $includeHiddenColumns, $includedColumns, $excludedColumns = []) {

	if (count($includedColumns) > 0) {
		return array_search($col, $includedColumns) !== false;
	}

	if (count($excludedColumns) > 0 && array_search($col, $excludedColumns) !== false) {
		return false;
	}

	return $column->width > 0 || $includeHiddenColumns === true;

}

function nuRunHTMLGenerateTableData($columns, $data, $useBrowseFormats = false, $includeHiddenColumns = false, $includedColumns = [], $excludedColumns = []) {
	$tableHtml = "";
	foreach ($data as $row) {
		$tableHtml .= "\n<TR>\n";
		$columnCount = count($columns);
		for ($col = 0; $col < $columnCount; $col++) {
			$column = $columns[$col];
			$printColumn = nuRunHTMLPrintColumn($col, $column, $includeHiddenColumns, $includedColumns, $excludedColumns);
			if ($printColumn) {
				$display = $column->display;
				$alias = nuGetColumnAlias($display);
				$display = $alias ? $alias : $display;
				$value = $row[$display] ?? "";
				$value = $display == 'null' || $display == '""' ? '' : $value;
				if ($useBrowseFormats) {
					$format = $column->format ?? "";
					if (!empty($format) && !empty($value)) {
						$value = nuAddFormatting($value, $format);
					}
				}
				$alignClass = 'align-' . strtolower(substr($column->align, 0, 1)); // l/c/r
				$tableHtml .= "<TD class='$alignClass'>$value</TD>\n";
			}
		}
		$tableHtml .= "</TR>";
	}
	return $tableHtml;
}
function nuRunHTMLGenerateHTMLTable($columns, $data, $hash) {
	$includeHiddenColumns = nuObjKey($hash, 'nuPrintIncludeHiddenColumns', null) == '1' ? true : false;
	$includedColumns = nuObjKey($hash, 'nuPrintIncludedColumns', []);
	$excludedColumns = nuObjKey($hash, 'nuPrintExcludedColumns', []);
	$useBrowseFormats = nuObjKey($hash, 'nuPrintUseBrowseFormats', false);

	if (!is_array($includedColumns)) {
		$includedColumns = $includedColumns === '' ? [] : explode(',', nuDecode($includedColumns));
	}
	if (!is_array($excludedColumns)) {
		$excludedColumns = $excludedColumns === '' ? [] : explode(',', nuDecode($excludedColumns));
	}

	// Output <colgroup> for column widths
	$colgroup = "<colgroup>\n";
	foreach ($columns as $col => $column) {
		if (nuRunHTMLPrintColumn($col, $column, $includeHiddenColumns, $includedColumns, $excludedColumns)) {
			$width = intval($column->width);
			$colgroup .= "<col style='width:{$width}px;'>\n";
		}
	}
	$colgroup .= "</colgroup>\n";

	$tableHtml = "<TABLE border=1 style='border-collapse: collapse; font-size:12px;'>\n";
	$tableHtml .= $colgroup;
	$tableHtml .= nuRunHTMLGenerateTableHeader($columns, $includeHiddenColumns, $includedColumns, $excludedColumns);
	$tableHtml .= nuRunHTMLGenerateTableData($columns, $data, $useBrowseFormats, $includeHiddenColumns, $includedColumns, $excludedColumns);
	$tableHtml .= "</TABLE>";

	return $tableHtml;
}

function nuExecuteQueryAndFetchData($sql, $params = []) {

	$stmt = nuRunQuery($sql, $params);
	if (db_num_rows($stmt) == 0) {
		return [];
	}
	return db_fetch_all_array($stmt);

}

function nuRunHTMLCleanup($debugId, $hash) {

	nuRunQuery("DELETE FROM zzzzsys_debug WHERE zzzzsys_debug_id = ? ", [$debugId]);
	nuRunQuery("DROP TABLE IF EXISTS " . $hash['browse_table_id']);
	unset($hash);

}

function nuGetColumnAlias($column) {

	if (preg_match('/\bAS\s+(\w+)\b/i', $column, $matches)) {
		return $matches[1];
	} else {
		return false;
	}

}

function nuAddJavaScript($js, $bc = false, $first = false) {
	// dummy
}
