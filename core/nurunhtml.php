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

	nuEval($hash['form_id'] . '_BB');

	if (nuHasErrors()) {
		echo implode("<br>", $_POST['nuErrors']);
	}

	$data = nuExecuteQueryAndFetchData($sqlQuery);
	$tableHtml = nuRunHTMLGenerateHTMLTable($columns, $data, $hash);

	// wrap the table so it doesn't overlap the fixed buttons
	$tableWrapperStyles = "margin:20px 80px 0 0;";	// top/right/bottom/left
	print "<div id='nuPrintTableWrapper' style='{$tableWrapperStyles}'>"
		. $tableHtml .
		"</div>";

	$sanitizedFilename = nuSanitizeFilename($formDescription) . '.csv';

	$csvOptions = nuDecode(nuObjKey($hash, 'nuPrintCSVExportOptions', []));
	if (!is_array($csvOptions)) {
		$csvOptions = [];
	}

	// File-name fallback
	$fileName = isset($csvOptions['fileName']) ?
		nuSanitizeFilename($csvOptions['fileName']) :
		nuSanitizeFilename($formDescription . '.csv');

	$csvOptionsJson = json_encode($csvOptions);

	echo <<<HTML
<style>
	/* Settings (⚙) button */
	#nuPrintOptionsBtn {
		position: fixed; top: 24px; right: 24px;
		z-index: 9999; width: 48px; height: 48px;
		border-radius: 50%; background: #1e53c6; color: #fff;
		border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
		display: flex; align-items: center; justify-content: center;
		cursor: pointer; font-size: 24px; transition: background .2s;
	}
	#nuPrintOptionsBtn:hover { background: #17429a; }

	/* Download button */
	#nuPrintDownloadBtn {
		position: fixed; top: 80px; right: 24px;
		z-index: 9999; width: 48px; height: 48px;
		border-radius: 50%; background: #1e53c6; color: #fff;
		border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
		display: flex; align-items: center; justify-content: center;
		cursor: pointer; font-size: 28px; transition: background .2s;
	}
	#nuPrintDownloadBtn:hover { background: #17429a; }

	/* Modal */
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
</style>

<button id="nuPrintOptionsBtn" title="CSV Options (Ctrl+Shift+O)">⚙</button>
<button id="nuPrintDownloadBtn" title="Download CSV (Ctrl+Shift+D)">
	<svg width="28" height="28" viewBox="0 0 24 24" fill="none"
			 stroke="currentColor" stroke-width="2" stroke-linecap="round"
			 stroke-linejoin="round">
		<circle cx="12" cy="12" r="10" stroke="#fff" fill="#1e53c6"/>
		<path d="M12 8v6M12 14l-3-3m3 3l3-3" stroke="#fff"/>
		<rect x="8" y="16" width="8" height="2" rx="1" fill="#fff"/>
	</svg>
</button>

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

document.getElementById('nuPrintDownloadBtn').onclick = nuRunHTMLDownloadCSV;
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
	}
});

// Modal logic
const modal = document.getElementById('nuPrintOptionsModal');
const btnOpen = document.getElementById('nuPrintOptionsBtn');
const btnSave = document.getElementById('optSaveBtn');
const btnCancel = document.getElementById('optCancelBtn');

const fldDelimiter	 = document.getElementById('optDelimiter');
const fldLineTerm = document.getElementById('optLineTerminator');
const fldHeaders = document.getElementById('optIncludeHeaders');
const fldBOM = document.getElementById('optBOM');
const fldFileName= document.getElementById('optFileName');

function openOptions() {
	fldDelimiter.value		= csvExportOptions.delimiter		|| ',';
	fldLineTerm.value		 = csvExportOptions.lineTerminator|| '\\r\\n';
	fldHeaders.checked		= csvExportOptions.includeHeaders!==false;
	fldBOM.checked				= csvExportOptions.bom					===true;
	fldFileName.value		 = downloadFilename;
	modal.style.display	 = 'block';
}
function closeOptions() {
	modal.style.display = 'none';
}

btnOpen.onclick	 = openOptions;
btnCancel.onclick = closeOptions;
window.onclick		= evt => { if (evt.target === modal) closeOptions(); };

btnSave.onclick = () => {
	csvExportOptions.delimiter			= fldDelimiter.value;
	csvExportOptions.lineTerminator = fldLineTerm.value;
	csvExportOptions.includeHeaders= fldHeaders.checked;
	csvExportOptions.bom						= fldBOM.checked;
	downloadFilename								= fldFileName.value.trim() || downloadFilename;
	csvExportOptions.fileName			 = downloadFilename;
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
			$style = "style='font-size:12px;width:{$column->width}px;text-align:{$column->align}'";
			$tableHtml .= "<TH $style>" . nuTranslate($column->title) . "</TH>\n";
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

				$style = "style='font-size:12px;width:{$column->width}px;text-align:{$column->align}'";

				$tableHtml .= "<TD $style>$value</TD>\n";
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

	$tableHtml = "<TABLE border=1; style='border-collapse: collapse'>\n";
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
