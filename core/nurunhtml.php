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
	$sanitizedFilename = nuSanitizeFilename($formDescription) . '.csv';

	/*
		Call in JS:
		var exportOptions  = {
			delimiter: ';',
			lineTerminator: '\r\n',
			includeHeaders: true,
			bom: true,
			fileName: 'custom_export.csv'
		};

		nuSetProperty('nuPrintCSVExportOptions', nuEncode(JSON.stringify(exportOptions)));

	*/

	$csvOptions = nuDecode(nuObjKey($hash, 'nuPrintCSVExportOptions', []));
	if (!is_array($csvOptions)) {
		$csvOptions = [];
	}

	// Get fileName from csvOptions, with fallback to formDescription + '.csv'
	$fileName = isset($csvOptions['fileName']) ?
		nuSanitizeFilename($csvOptions['fileName']) :
		nuSanitizeFilename($formDescription . '.csv');

	$csvOptionsJson = json_encode($csvOptions);

	print $tableHtml;

	echo <<<HTML
<style>
#nuPrintDownloadBtn {
	position: fixed;
	top: 24px;
	right: 24px;
	z-index: 9999;
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: #1e53c6;
	color: #fff;
	border: none;
	box-shadow: 0 2px 8px rgba(0,0,0,0.15);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	font-size: 28px;
	transition: background 0.2s;
}
#nuPrintDownloadBtn:hover {
	background: #17429a;
}
</style>

<button id="nuPrintDownloadBtn" title="Download CSV (Ctrl+Shift+D)">
	<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
	stroke-linecap="round" stroke-linejoin="round">
	<circle cx="12" cy="12" r="10" stroke="#fff" fill="#1e53c6"/>
	<path d="M12 8v6M12 14l-3-3m3 3l3-3" stroke="#fff"/>
	<rect x="8" y="16" width="8" height="2" rx="1" fill="#fff"/>
	</svg>
</button>

<script>

const downloadFilename = '{$fileName}';
const csvExportOptions = {$csvOptionsJson};

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
			if (escapeRE.test(text)) {
				text = '"' + text + '"';
			}
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

	const shouldAddBOM = csvExportOptions.bom !== undefined ? csvExportOptions.bom : false;
	const csvContent = shouldAddBOM ? csv : csv.replace(/^\uFEFF/, '');
	const blob = new Blob([csvContent], { type: 'text/csv' });
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
document.addEventListener('keydown', function(e) {
	if (
		(e.ctrlKey || e.metaKey) &&
		e.shiftKey &&
		(e.key === 'd' || e.key === 'D')
	) {
		e.preventDefault();
		nuRunHTMLDownloadCSV();
	}
});

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

				$tableHtml .= "<TD $style>" . $value . "</TD>\n";
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
