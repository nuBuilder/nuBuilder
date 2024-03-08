<?php
require_once ('nusessiondata.php');
require_once ('nucommon.php');
require_once ('nudata.php');
	
print "<meta charset='utf-8'>";

$debugId = $_GET['i'] ?? null; 
$jsonData = nuGetDebugMessageData($debugId);

if ($jsonData) {
	$columns = $jsonData->columns;
	$sqlQuery = $jsonData->sql;

	$_POST['nuHash'] = (array)$jsonData->hash;
	$hash = nuHash();
	$_POST['nuHash']['TABLE_ID'] = $hash['browse_table_id'];
	nuEval($hash['form_id'] . '_BB');
	
	if (nuHasErrors()) {
		echo implode("<br>",$_POST['nuErrors']);
	}
	
	$data = nuExecuteQueryAndFetchData($sqlQuery);
	$tableHtml = nuRunHTMLGenerateHTMLTable($columns, $data, $hash);

	print $tableHtml;
	
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

function nuRunHTMLGenerateTableHeader($columns, $includeHiddenColumns = false) {

	$tableHtml = "<TR>";

	$columnCount = count($columns);
	for ($col = 0;$col < $columnCount;$col++) {
		$column = $columns[$col];

		if (!($column->width == 0 && $includeHiddenColumns != true)) {
			$style = "style='font-size:12px;width:{$column->width}px;text-align:{$column->align}'";
			$tableHtml .= "<TH $style>" . nuTranslate($column->title) . "</TH>\n";
		}
	}

	$tableHtml .= "</TR>";
	return $tableHtml;

}

function nuRunHTMLGenerateTableData($columns, $data, $includeHiddenColumns = false) {

	$tableHtml = "";

	foreach ($data as $row) {

		$tableHtml .= "\n<TR>\n";

		$columnCount = count($columns);
		for ($col = 0;$col < $columnCount;$col++) {

			$column = $columns[$col];
			if (!($column->width === 0 && $includeHiddenColumns != true)) {
				$display = $column->display;
				$alias = nuGetColumnAlias($display);
				$display = $alias ? $alias : $display;

				$value = $row[$display] ?? "";
				$value = $display == 'null' || $display == '""' ? '' : $value;
				$style = "style='font-size:12px;width:{$column->width}px;text-align:{$column->align}'";

				$tableHtml .= "<TD $style>" . $value . "</TD>\n";
			}
		}
		$tableHtml .= "</TR>";
	}

	return $tableHtml;

}

function nuRunHTMLGenerateHTMLTable($columns, $data, $hash) {

	$includeHiddenColumns = nuObjKey($hash, 'nuPrintincludeHiddenColumns', null) == '1' ? true : false;

	$tableHtml = "<TABLE border=1; style='border-collapse: collapse'>\n";
	$tableHtml .= nuRunHTMLGenerateTableHeader($columns, $includeHiddenColumns);
	$tableHtml .= nuRunHTMLGenerateTableData($columns, $data, $includeHiddenColumns);
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
	}
	else {
		return false;
	}

}

function nuAddJavaScript($js, $bc = false, $first = false){
	// dummy
}


?>
