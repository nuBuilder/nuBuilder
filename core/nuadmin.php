<?php

function nuDumpStatementToFile($f, $row, $counter, $total) {

	$values = join(', ', array_map(function ($value) {
		return $value === null ? 'NULL' : nuDBQuote($value);
	}
	, $row));

	if ($counter == 0) {
		fwrite($f, "REPLACE INTO zzzzsys_translate (" . implode(', ', array_keys($row)) . ") VALUES " . "\n");
	}

	$comma = $counter < $total - 1 ? ',' : ';';
	fwrite($f, "(" . $values . ")" . $comma . "\n");

}

function nuGenerateLanguageFile($l) {

	$s = "SELECT * FROM `zzzzsys_translate` WHERE trl_language = ? ORDER BY `trl_language`, trl_english";
	$t = nuRunQuery($s, array($l));

	$total = db_num_rows($t);
	if ($total > 0) {

		$first = true;
		$counter = 0;

		$f = fopen(__DIR__ . "./languages/" . $l . '.sql', "w+") or die("Unable to open the file " . $l);
		while ($row = db_fetch_array($t)) {

			$id = $row['zzzzsys_translate_id'];
			if (substr($id, 0, 2) != "nu") {
				$row['zzzzsys_translate_id'] = 'nu' . $id;
			}

			nuDumpStatementToFile($f, $row, $counter, $total);

			$counter++;

		}

		fclose($f);
	}

}

function nuGenerateAllLanguageFiles() {

	$s = "SELECT DISTINCT trl_language FROM `zzzzsys_translate` ORDER BY `trl_language`";
	$t = nuRunQuery($s);
	while ($row = db_fetch_object($t)) {
		nuGenerateLanguageFile($row->trl_language);
	}

}	

?>
