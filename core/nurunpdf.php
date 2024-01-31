<?php

require_once('nusession.php');
require_once('nucommon.php');
require_once('nudata.php');
require_once('libs/tcpdf/tcpdf.php');
define('FPDF_FONTPATH','libs/tcpdf/font/');

$GLOBALS['nu_report']		= [];
$GLOBALS['nu_columns']		= [];
$GLOBALS['nu_files']		= [];

$get						= isset($_GET['i']);
	if($get){
	$jsonID					= $_GET['i'];
	$tag					= '';
}else{
	$jsonID					= isset($_POST['ID']) ? $_POST['ID'] : null	;
	$tag					= isset($_POST['tag']) ? $_POST['tag'] : null;
}

if ($jsonID !== null) {
	nuRunReportId($jsonID, $tag, $get);
}

function nuRunReportId($jsonID, $tag, $get) {

	$J							= nuGetJSONData($jsonID);

	$TABLE_ID					= nuTT();
	$JSON						= json_decode($J);
	$LAYOUT						= json_decode($JSON->sre_layout);
	$hashData					= nuAddToHashList($JSON, 'report');
	$hashData['TABLE_ID']		= $TABLE_ID;
	$GLOBALS['TABLE_ID']		= $TABLE_ID;
	$_POST['nuHash']			= array_merge($hashData, nuSetHashList(null));

	$PDF						= new TCPDF($LAYOUT->orientation, 'mm', $LAYOUT->paper, true, 'UTF-8', false);

	$PDF->SetAutoPageBreak(true);
	// The report writer makes the header and footer so dont need a print header or footer.
	$PDF->setPrintHeader(false);
	$PDF->setPrintFooter(false);
	$REPORT						= nuSetPixelsToMM($LAYOUT);

	$PDF->SetMargins(1,1,1);

	// Font subsetting to reduce the size of the generated pdf file
	/*
	$fl							= json_decode(nuFontList());

	for($i = 0 ; $i < count($fl) ; $i++){

		$fnt					= $fl[$i][0];
		$PDF->AddFont($fnt, '', '', true);

	}
	*/

	$justID						= strstr($JSON->parentID, ':');

	nuBuildTempTable($JSON->parentID, $TABLE_ID);

	$GLOBALS['nu_columns']		= nuAddCriteriaValues($hashData, $TABLE_ID);

	nuRunQuery("ALTER TABLE $TABLE_ID ADD `nu__id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST");

	nuBuildReport($PDF, $REPORT, $TABLE_ID);
	$hashData['nu_pages']		= nuGetTotalPages();
	nuReplaceLabelHashVariables($REPORT, $hashData);

	if (isset($LAYOUT->ishtml)) {
		$isHTML = $LAYOUT->ishtml == 'Y' ? true : false;
	} else {
		$isHTML = false;
	}

	nuPrintReport($PDF, $REPORT, $GLOBALS['nu_report'], $JSON, $isHTML);

	nuRunQuery("DROP TABLE IF EXISTS $TABLE_ID");
	nuRunQuery("DROP TABLE IF EXISTS $TABLE_ID".'_nu_summary');


	if($get){
		ob_end_clean();
		$PDF->Output('nureport.pdf', 'I');
		nuRemoveFiles();
		return false;
	}else{

		$result = nuSavePDF($PDF, $JSON->code, $tag);
		nuRemoveFiles();

		return [
			'id' =>  $result['id'],
			'filename' => $result['filename'],
		];

	}

}

function nuPrintReport($PDF, $LAY, $DATA, $JSON, $isHTML){

	$lastSectionTop			= 10000;
	$pageNumber				= 0;

	$countData = count($DATA);
	for($s = 0 ; $s < $countData ; $s++){

		if($lastSectionTop > $DATA[$s]->sectionTop){
			$pageNumber++;
		}

		$lastSectionTop=$DATA[$s]->sectionTop;

		$countObjects = count($DATA[$s]->objects);
		for($o = 0 ; $o < $countObjects ; $o++){

			$O				= nuGetObjectProperties($LAY, $DATA[$s]->objects[$o]->id);

			if($O->objectType == 'label'){
				$DATA[$s]->objects[$o]->lines[0] = str_replace('#page#' , $pageNumber, $DATA[$s]->objects[$o]->lines[0]);
			}
		}

	}

	$countDATA = count($DATA);
	for($s = 0 ; $s < $countDATA ; $s++){

		$countObjects = count($DATA[$s]->objects);
		for($o = 0 ; $o < $countObjects ; $o++){

			$O				= nuGetObjectProperties($LAY, $DATA[$s]->objects[$o]->id);

			if($O->objectType == 'label'){

				$description = isset($JSON->sre_description) ? $JSON->sre_description : '';
				$sre_code = isset($JSON->sre_code) ? $JSON->sre_code : '';

				$label		= $DATA[$s]->objects[$o]->lines[0];

				$label		= str_replace('#pages#',		$pageNumber, $label);
				$label		= str_replace('#description#',	$description, $label);
				$label		= str_replace('#code#',			$sre_code, $label);
				$label		= str_replace('#year#',			date('y'), $label);
				$label		= str_replace('#month#',		date('m'), $label);
				$label		= str_replace('#day#',			date('d'), $label);
				$label		= str_replace('#hour#',			date('h'), $label);
				$label		= str_replace('#hour24#',		date('H'), $label);
				$label		= str_replace('#minute#',		date('i'), $label);
				$label		= str_replace('#second#',		date('s'), $label);

				$DATA[$s]->objects[$o]->lines[0] = $label;
			}
		}

	}

	$lastSectionTop = 10000;

	$countDATA = count($DATA);
	for($s = 0 ; $s < $countDATA ; $s++){

		if($lastSectionTop > $DATA[$s]->sectionTop){

			$PDF->AddPage();

		}

		$lastSectionTop		= $DATA[$s]->sectionTop;
		$grp				= $DATA[$s]->group;
		$sec				= $DATA[$s]->section;
		$color				= $LAY->groups[$grp]->sections[$sec]->color;

		nuPrintBackground($PDF, $DATA[$s]->sectionTop, $DATA[$s]->sectionHeight, $color);

		$countObjects = count($DATA[$s]->objects);
		for($o = 0 ; $o < $countObjects ; $o++){

			$O				= nuGetObjectProperties($LAY, $DATA[$s]->objects[$o]->id);
			if($O->objectType == 'field' or $O->objectType == 'label'){
				nuPrintField($PDF, $DATA[$s], $DATA[$s]->objects[$o], $O, $LAY, $isHTML);
			}
			if($O->objectType == 'image'){
				nuPrintImage($PDF, $DATA[$s], $DATA[$s]->objects[$o], $O);														//-- print graphic
			}
		}

	}
}

function nuBuildReport($PDF, $REPORT, $TABLE_ID){

	$groupBy							= [];
	$groups								= [];
	$sectionValue						= [];
	$print_group						= 1;
	$order_by							= '';
	$group_by							= '';
	$order['a']							= 'asc ';
	$order['d']							= 'desc ';
	$lastROW							= 1;

	for($i = 3 ; $i < 8 ; $i++){
		if($REPORT->groups[$i]->sortField != ''){			//-- loop through groups

			$order_by					= ' ORDER BY ';
			$groupBy[]					= $REPORT->groups[$i]->sortField . ' ' . $order[$REPORT->groups[$i]->sortBy];
			$groups[]					= $REPORT->groups[$i]->sortField;
			nuRunQuery("ALTER TABLE $TABLE_ID  ADD INDEX `".$REPORT->groups[$i]->sortField."` (`".$REPORT->groups[$i]->sortField."`)");

		}

	}
	$group_by							= implode(',', $groupBy);

	$DATA								= nuRunQuery("CREATE TABLE a$TABLE_ID SELECT * FROM $TABLE_ID $order_by $group_by");
	$DATA								= nuRunQuery("DROP TABLE $TABLE_ID");
	$DATA								= nuRunQuery("CREATE TABLE $TABLE_ID SELECT * FROM a$TABLE_ID");
	$DATA								= nuRunQuery("DROP TABLE a$TABLE_ID");
	$DATA								= nuRunQuery("SELECT * FROM $TABLE_ID");

	nuMakeSummaryTable($REPORT, $TABLE_ID);
	$sectionTop							= 0;
	$ROW								= db_fetch_array($DATA);														//-- first row
//======================================================
//	REPORT HEADER
//======================================================
	$S									= new nuSECTION($PDF, $ROW, $REPORT, 1, 0, 0);									//-- report header
	$sectionTop							= $S->buildSection();
	$firstRecord						= true;

//======================================================
//	PAGE HEADER
//======================================================
	$S									= new nuSECTION($PDF, $ROW, $REPORT, 2, 0, $sectionTop);						//-- page header
	$sectionTop							= $S->buildSection();
	$firstRecord						= true;

//======================================================
//	FIRST SECTION HEADERS
//======================================================
	$countGroups = count($groups);
	for($g = 0 ; $g < $countGroups ; $g++){

		$S								= new nuSECTION($PDF, $ROW, $REPORT, 3 + $g, 0, $sectionTop);					//-- section headers
		$sectionTop						= $S->buildSection();
		$sectionValue[$groups[$g]]		= $ROW[$groups[$g]];

	}

//======================================================
//	LOOP THROUGH TABLE
//======================================================
	$DATA								= nuRunQuery("SELECT * FROM (SELECT * FROM $TABLE_ID $order_by $group_by) AS tmp ");
	while($ROW = db_fetch_array($DATA)){

		if(!$firstRecord){

			$backUpTo					= nuLowestGroupChange($sectionValue, $ROW, $groups);

//======================================================
//	FOOTERS AND HEADERS AS GROUPS CHANGE
//======================================================

			$countGroups = count($groups);
			for($g = $countGroups - 1 ; $g >= $backUpTo ; $g--){

				$S							= new nuSECTION($PDF, $lastROW, $REPORT, 3 + $g, 1, $sectionTop);				//-- section footers
				$sectionTop					= $S->buildSection();
				$sectionValue[$groups[$g]]	= $ROW[$groups[$g]];

			}

			for($g = $backUpTo ; $g < $countGroups ; $g++){

				$S							= new nuSECTION($PDF, $ROW, $REPORT, 3 + $g, 0, $sectionTop);					//-- section headers
				$sectionTop					= $S->buildSection();
				$sectionValue[$groups[$g]]	= $ROW[$groups[$g]];

			}

		}

//======================================================
//	DETAIL SECTION
//======================================================
		$S									= new nuSECTION($PDF, $ROW, $REPORT, 0, 0, $sectionTop);
		$sectionTop							= $S->buildSection();
		$lastROW							= $ROW;
		$firstRecord						= false;
	}

//======================================================
//	LAST GROUP FOOTERS
//======================================================

	$countGroups = count($groups);
	for($g = $countGroups - 1 ; $g > -1 ; $g--){

		$S								= new nuSECTION($PDF, $lastROW, $REPORT, 3 + $g, 1, $sectionTop);					//-- section footers
		// last group doesn't need a page break
		if($g == 0) {
			nuRemovePageBreak($S);
		}
		$sectionTop						= $S->buildSection();

	}

//======================================================
//	REPORT FOOTER
//======================================================
	$S									= new nuSECTION($PDF, $lastROW, $REPORT, 1, 1, $sectionTop);
	$sectionTop							= $S->buildSection();

}




function nuLowestGroupChange($lastROW, $thisROW, $groups){   //-- lowest = group 3

	$lastString			= '';
	$thisString			= '';

	$count = count($groups);
	for($g = 0 ; $g < $count ; $g ++){

		if($lastROW[$groups[$g]] != $thisROW[$groups[$g]]){

			return $g;

		}
	}

	return count($groups);

}



//================================================================================
//			Classes
//================================================================================



class nuSECTION{

	public $group			= 0;
	public $section			= 0;
	public $pageHeight		= 0;
	public $sectionHeight	= 0;
	public $sectionTop		= 0;
	public $O				= [];
	public $PDF				= [];
	public $ROW				= [];
	public $LAY				= [];
	public $SECTIONS		= [];											//-- this Section split over pages
	public $OBJECTS			= [];
	public $TABLE_ID		= '';

	public function __construct($PDF, $ROW, $LAY, $group, $section, $sectionTop){

		$this->PDF			= $PDF;
		$this->ROW			= $ROW;
		$this->LAY			= $LAY;
		$this->TABLE_ID		= $GLOBALS['TABLE_ID'];
		$this->group		= $group;
		$this->section		= $section;
		$this->O			= $this->LAY->groups[$group]->sections[$section]->objects;
		$this->pageHeight	= $this->LAY->height;
		$this->sectionTop	= $sectionTop;
		$this->sectionHeight= $this->LAY->groups[$group]->sections[$section]->height;

	}

	public function buildSection(){

		$this->O			= $this->setObjectLines($this->O);
		$nextTop			= $this->chopSectionOverPages();
		$GLOBALS['nu_report'] = array_merge($GLOBALS['nu_report'], $this->SECTIONS);

		return $nextTop;

	}


	private function nuGetFormatting($O){

		$f					 = [];
		$f['B']				= '';
		$f['F']				= '';
		$f['S']				= '';
		$v					 = $this->ROW[$O->fieldName];

		while(substr($v,0,1) == '#' and substr($v,2,1) == '#' and substr($v,9,1) == '|'){		//-- conditional formatting used
			$f[strtoupper(substr($v,1,1))] = substr($v,3,6);									//-- set background color, font color or font style
			$v				 = substr($v,10);													//-- chop format off
		}

		$f['V']				= $v;																//-- all formatting removed

		return $f;
	}

	private function setObjectLines($O, $stopGrow = false){

		$countO = count($O);
		for($i = 0 ; $i < $countO ; $i++){

			$O[$i]->path						= '';

			if($O[$i]->objectType == 'field' or $O[$i]->objectType == 'label'){

				$fieldName = isset($this->ROW[$O[$i]->fieldName]) ? $this->ROW[$O[$i]->fieldName] : '';

				if($O[$i]->objectType == 'field' and substr($fieldName,0,1) == '#' and substr($fieldName,2,1) == '#' and substr($fieldName,9,1) == '|'){		//-- conditional formatting used

					$format					 = $this->nuGetFormatting($O[$i]);

					if($format['B'] != ''){
						$O[$i]->B			= '#' . $format['B'];
					}
					if($format['F'] != ''){
						$O[$i]->F			= '#' . $format['F'];
					}

				}


				$O[$i]->LINES				= $this->getObjectRows($O[$i], $stopGrow);

			}else if($O[$i]->objectType == 'image'){									//-- image

				$O[$i]->LINES				= [''];
				$path						= '';
				$fld						= $O[$i]->fieldName;

				if(nuIsField($fld)){													//-- FIELD NAME

					$img					= $this->ROW[$fld];
					$path					= nuCreateFile($img);
					$GLOBALS['nu_files'][]	= $path;

				}else{

					$j						= nuIsImage($fld);							//--CODE in zzzzsys_file

					if($j != ''){

						$path				= nuCreateFile($j);
						$GLOBALS['nu_files'][] = $path;

					}else if(nuIsFile($fld)){											//-- FILE NAME on hard drive
						$path				= $fld;
					}

				}

				$O[$i]->path				= $path;

			}

		}
		return $O;
	}

	private function chopSectionOverPages(){

		$sectionObjects						= [];
		$sectionTop							= $this->sectionTop;
		$objectParts						= [];
		$pages								= 0;
		$expandedSectionHeight				= $this->sectionHeight + $this->extendedHeight() - .25;
		$pageBreak							= 0;

		if( property_exists($this->LAY->groups[$this->group]->sections[$this->section], 'page_break') ) {
			$pageBreak						= $this->LAY->groups[$this->group]->sections[$this->section]->page_break;
		}

		$countO = count($this->O);
		for($i = 0 ; $i < $countO ; $i++){
			$sectionObjects[]				 = $this->O[$i]->id;
		}

		for($i = 0 ; $i < $countO ; $i++){

			$OID							= $this->O[$i]->id;
			$availableHeight				= $this->paperBottom() - $sectionTop - $this->O[$i]->top;

			while(count($this->O[$i]->LINES) > 0){

				if(($this->paperBottom() - $sectionTop < $this->sectionHeight) or $pageBreak == 1){		//-- if a section's original height won't fit, start a new page.

					if("$this->group$this->section" != '10'){											//-- the report header

						$this->pageHeaderFooter(1);
						$this->pageHeaderFooter(0);

					}
					$sectionTop			= $this->paperTop();
					$availableHeight	= $this->paperBottom() - $this->paperTop();
					$pageBreak			= 0;
				}

				if($this->O[$i]->height == 0){
					$fit				= $availableHeight;
				}else{
					$fit				= floor($availableHeight / $this->O[$i]->height);			//-- rows that will fit this page
				}

				$o						= pdfObject($this->O[$i]->id, $this->O[$i]->top);			//-- create Object

				if(isset($this->O[$i]->B)){$o->B = $this->O[$i]->B;$this->O[$i]->B = null;}
				if(isset($this->O[$i]->F)){$o->F = $this->O[$i]->F;$this->O[$i]->F = null;}

				$fittingLines			= array_splice($this->O[$i]->LINES, 0, $fit);				//-- get rows
				$o->lines				= $fittingLines;											//-- add rows
				$o->path				= $this->O[$i]->path;										//-- add path

				if($fit > 0){
					$objectParts[$OID][] = $o;														//-- add Object
				}else{
					$sectionTop			= $this->paperTop();
				}

				$availableHeight		= $this->paperBottom() - $this->paperTop();

			}

			$pages							= max($pages, count($objectParts[$OID]));

		}

		for($i = 0 ; $i < $pages ; $i++){

			$sectionTop						= $i == 0		   ? $sectionTop			: $this->paperTop();					//-- first page
			$sectionHeight					= $i + 1 == $pages  ? $expandedSectionHeight : $this->paperBottom() - $sectionTop;	//-- last page

			$expandedSectionHeight			= $expandedSectionHeight - $sectionHeight;

			$s								= pdfSection($this->group, $this->section, $sectionTop, $sectionHeight);
			$sectionTop						= $sectionTop + $sectionHeight;
			$os								= [];

			$countSectionObjects = count($sectionObjects);
			for($obj = 0 ; $obj < $countSectionObjects ; $obj++){

//				if(count($objectParts[$sectionObjects[$obj]]) <= $pages){
					if($i < count($objectParts[$sectionObjects[$obj]])){
						$os[]					 = $objectParts[$sectionObjects[$obj]][$i];
					}
//				}
			}

			$s->objects						= $os;																		//-- add objects to section
			$this->SECTIONS[]				= $s;

			if($expandedSectionHeight > 0){

				$s							= pdfSection($this->group, $this->section, $sectionTop, $expandedSectionHeight);
				$sectionTop					= $sectionTop + $expandedSectionHeight;
				$os							= [];
				$s->objects					= $os;																		//-- add objects to section
				$this->SECTIONS[]			= $s;

			}

			if($sectionTop >= $this->paperBottom()){

				if("$this->group$this->section" != '10'){																//-- the report header

					$this->pageHeaderFooter(1);

					if($i + 1 != $pages){

						$this->pageHeaderFooter(0);

					}
				}
			}
		}

		if("$this->group$this->section" == '11'){																		//-- the report footer
			$this->pageHeaderFooter(1);
		}

		return $sectionTop;

	}

	private function pageHeaderFooter($section){								//-- 0 = header 1 = footer

		$S				= $this->LAY->groups[2]->sections[$section];
		$O				= $this->setObjectLines($S->objects, true);
		$newOs			= [];

		$count			= count($O);
		for($i = 0 ; $i < $count ; $i ++){

			$newO			= pdfObject($O[$i]->id, $O[$i]->top);				//-- create Object
			$newO->lines	= $O[$i]->LINES;
			$newOs[]		= $newO;

		}

		$newsec				= pdfSection(2, $section, $section == 0 ? 0 : $this->pageHeight - $S->height, $S->height);
		$newsec->objects	= $newOs;										//-- add objects to section
		$this->SECTIONS[]	= $newsec;

	}

	private function extendedHeight(){

		if(count($this->O) == 0){return 0;}

		$bottomMostObject	= 0;
		$bottomID			= 0;

		$count = count($this->O);
		for($i = 0 ; $i < $count ; $i++){

			$thisBottom			= $this->O[$i]->top + (count($this->O[$i]->LINES) * $this->O[$i]->height);

			if($bottomMostObject < $thisBottom){															//-- if $i goes lower
				$bottomID			= $i;
				$bottomMostObject	= $thisBottom;
			}

		}

		$extend					= (count($this->O[$bottomID]->LINES) - 1) * $this->O[$bottomID]->height;

		return $extend;

	}

	private function paperTop(){

		if(($this->group == 1 or $this->group == 2) and $this->section == 0){								//-- report or page header
			return 0;
		}else{
			return $this->LAY->groups[2]->sections[0]->height+1;
		}

	}

	private function paperBottom(){

		if(($this->group == 1 and $this->section == 0) or ($this->group == 2 and $this->section == 1)){		//-- report header or page footer
			return $this->pageHeight;
		}else{
			return $this->pageHeight - $this->LAY->groups[2]->sections[1]->height;							//-- start of page footer
		}

	}

	private function getObjectRows($O, $stopGrow){

//-- break one Object's paragraph into lines

		$rows				= [];

		if($O->objectType == 'field'){

			$text			= $this->nuGetFieldValue($O);

			$lineNoNR		= str_replace ("\n\r", "\r", $text);
			$lineNoRN		= str_replace ("\r\n", "\r", $lineNoNR);
			$lineJustR		= str_replace ("\n", "\r", $lineNoRN);
			$lines			= explode("\r", $lineJustR);						//-- add empty array elements for carriage returns

		}else{

			$lines			= [$O->fieldName];

		}

		$countLines = count($lines);
		for($i = 0 ; $i < $countLines ; $i ++){								//-- loop through current lines

			$thisLine		= $lines[$i];
			$forceRow		= true;

			while(strlen($thisLine) > 0){

				$result		= $this->getOneRow($thisLine, $O);
				$rows[]		= trim($result[0]);									//-- return row as a string [0]
				$thisLine	= $result[1];										//-- and then remaining paragraph as a string [1]
				$forceRow	= false;

			}

			if($forceRow){
				$rows[]		= '';												//-- return row as a string [0]
				$thisLine	= '';												//-- and then remaining paragraph as a string [1]
			}

		}

		if($stopGrow){															//-- return just 1 row

			return [$rows[0]];

		}

		if($O->minRows > 0){													//-- must be a minimum size

			while (count($rows) < $O->minRows){
				$rows[] = ' ';
			}

		}

		if($O->maxRows > 0){													//-- must not have more rows than this
			$rows	= array_splice($rows, 0, $O->maxRows);
		}

		if($O->minRows == -1 and $rows[0] == '' ){								//-- reduce height to zero
			$rows = [];
		}

		return $rows;

	}

	private function getOneRow($text, $O){

//-- return an array
//-- 0 = a line that fits within the width of the Object
//-- 1 = remaining part of the paragraph

		$this->PDF->SetFont($O->fontFamily, $O->fontWeight, $O->fontSize);

		if($O->width - 2 > $this->PDF->GetStringWidth((utf8_encode($text)))){						//-- all paragraph fits in 1 line
			return [$text, ''];
		}

		$to			 = 1;
		while($O->width - 2 > $this->PDF->GetStringWidth(utf8_encode(substr(($text), 0, $to)))){	//-- keep getting wider until too wide
			$to++;
		}

		$widestLine			= substr($text, 0, $to);
		$foundSeperator		= false;
		$foundLongestWord	= false;
		$wordSplit			= $to;

		for($i = strlen($widestLine) - 1 ; $i > 1 ; $i--){
			if (!$foundLongestWord && $this->PDF->GetStringWidth(utf8_encode(substr($widestLine, 0, $i))) < $O->width - 2) {
				$wordSplit			= $i;
				$foundLongestWord	= true;
			}
			$break = strpos(", ;-", $widestLine[$i]);	//-- look for breakable points

			if($break !== false){
				$to			 = $i;
				$foundSeperator = true;
				break;
			}

		}

		if (!$foundSeperator)
			$to = $wordSplit;

		$remaining		= substr($text, $to);
		$line			= substr($text, 0, $to);	//-- add empty array elements for carriage returns

		return [$line, $remaining];

	}

	private function nuGetFieldValue($O){

		$type			= '';
		$value			= '';
		$field			= '';
		$fields			= [];

		if(strtoupper(substr($O->fieldName,0,4)) == 'SUM('){
			$type		= 's';
			$field		= substr($O->fieldName,4, -1);
		}
		if(strtoupper(substr($O->fieldName,0,8)) == 'AVERAGE('){
			$type		= 'p';
			$fields		= explode(',', substr($O->fieldName, 8, -1));
		}
		if($type == ''){																//-- normal value

		//Add the 'is_array' check by SG 8th May 2015
		if ( is_array($this->ROW) ) {

			if(array_key_exists($O->fieldName, $this->ROW)) {

				$v = $this->nuGetFormatting($O);
				$value = $v['V'];
			}
		}

		}else{																			//-- summed value
			$groups		= [];
			$where		= '';

			if($type == 'p'){

				$count	= 'SUM(nu_sum_'.trim($fields[0]).') AS the_sum_a, SUM(nu_sum_'.trim($fields[1]).') AS the_sum_b';
			}else{
				$count	= 'SUM(nu_sum_'.trim($field).') AS the_sum_a';
			}
			for($i = 3 ; $i <= $this->group ; $i++){

				$groups[]	= $this->LAY->groups[$i]->sortField . " = '" . str_replace("'", "\\'", $this->ROW[$this->LAY->groups[$i]->sortField] ) . "'";
				$where		= ' WHERE ';

			}

			$sql			= "SELECT $count FROM $this->TABLE_ID"."_nu_summary $where " . implode(' AND ',$groups);
			$t				= nuRunQuery($sql);

			if (db_num_rows($t) > 0) {

				$r				= db_fetch_row($t);

				$r1  = db_num_columns($t) > 1 ? $r[1] : '';

				if($r1 == 0 and $type == 'p'){

					$value	= 0;

				}else{

					if($type == 'p'){
						$value	= ($r[0] / $r1);
					}else{
						$value	= $r[0];
					}

				}
			} else {
				$value	= 0;
			}

		}

		if($O->format != ''){															//-- format value
			$value			= nuAddFormatting($value, $O->format);
		}

		return $value;

	}
}

//================================================

function pdfSection($g, $s, $t, $h){		//-- section

	$c					= new stdClass;
	$c->objects			= [];
	$c->group			= $g;
	$c->section			= $s;
	$c->sectionTop		= $t;
	$c->sectionHeight	= $h;

	return $c;

}

function pdfObject($id, $t){

	$c					= new stdClass;
	$c->lines			= [];
	$c->id				= $id;
	$c->top				= $t;
	$c->path			= '';

	return $c;

}

function nuSetPixelsToMM($pxREPORT){

	$ratio = .25;

	$countGroups = count($pxREPORT->groups);
	for($g = 0 ; $g < $countGroups; $g++){

		$countSections = count($pxREPORT->groups[$g]->sections);
		for($s = 0 ; $s < $countSections ; $s++){

			$pxREPORT->groups[$g]->sections[$s]->height							= $pxREPORT->groups[$g]->sections[$s]->height				* $ratio;

			$countObjects = count($pxREPORT->groups[$g]->sections[$s]->objects);
			for($o = 0 ; $o < $countObjects ; $o++){

				$pxREPORT->groups[$g]->sections[$s]->objects[$o]->fontSize		= $pxREPORT->groups[$g]->sections[$s]->objects[$o]->fontSize;
				$pxREPORT->groups[$g]->sections[$s]->objects[$o]->height		= $pxREPORT->groups[$g]->sections[$s]->objects[$o]->height	* $ratio;
				$pxREPORT->groups[$g]->sections[$s]->objects[$o]->left			= $pxREPORT->groups[$g]->sections[$s]->objects[$o]->left	* $ratio;
				$pxREPORT->groups[$g]->sections[$s]->objects[$o]->top			= ($pxREPORT->groups[$g]->sections[$s]->objects[$o]->top)	* $ratio;
				$pxREPORT->groups[$g]->sections[$s]->objects[$o]->width			= $pxREPORT->groups[$g]->sections[$s]->objects[$o]->width	* $ratio;
			}
		}

	}

	return $pxREPORT;
}

function nuPrintBackground($PDF, $sectionTop, $sectionHeight, $color){

	$backcolor	= hex2rgb($color);

	$PDF->SetFillColor($backcolor[0], $backcolor[1], $backcolor[2]);
	//$PDF->Rect(0, $sectionTop, 1000, $sectionHeight, 'F');

}

function nuGetObjectProperties($REPORT, $id){

	$countGroups = count($REPORT->groups);
	for($g = 0 ; $g < $countGroups ; $g++){

		$countSections = count($REPORT->groups[$g]->sections);
		for($s = 0 ; $s <  $countSections; $s++){

			$countSectionObjects = count($REPORT->groups[$g]->sections[$s]->objects);
			for($o = 0 ; $o <  $countSectionObjects ; $o++){
				if($REPORT->groups[$g]->sections[$s]->objects[$o]->id == $id)
					return $REPORT->groups[$g]->sections[$s]->objects[$o];
			}
		}

	}

	return '';
}

function nuPrintField($PDF, $S, $contents, $O, $LAY, $isHTML){

	$PROP			= nuGetObjectProperties($LAY, $O->id);

	$fontFamily		= $PROP->fontFamily;
	$fontWeight		= $PROP->fontWeight;
	$fontSize		= $PROP->fontSize;
	$borderWidth	= $PROP->borderWidth;
	$hasBorder		= $borderWidth == 0 ? 0 : 1;
	$borderColor	= $PROP->borderColor;
	$backgroundColor= $PROP->backgroundColor;
	$fontColor		= $PROP->fontColor;
	$width			= $PROP->width;
	$height			= $PROP->height;
	$textAlign		= strtoupper($PROP->textAlign[0]);
	$left			= $PROP->left;
	$top			= $S->sectionTop + $contents->top;

	if(isset($contents->B)){$backgroundColor = $contents->B;}
	if(isset($contents->F)){$fontColor = $contents->F;}

	$drawcolor		 = hex2rgb($borderColor);
	$backcolor		 = hex2rgb($backgroundColor);
	$textcolor		 = hex2rgb($fontColor);

	$PDF->SetDrawColor($drawcolor[0], $drawcolor[1], $drawcolor[2]);
	$PDF->SetTextColor($textcolor[0], $textcolor[1], $textcolor[2]);
	$PDF->SetFillColor($backcolor[0], $backcolor[1], $backcolor[2]);
	$PDF->SetFont($fontFamily, $fontWeight, $fontSize, '', false);
	$PDF->SetLineWidth($borderWidth / 5);
	$PDF->SetXY($left, $top);

	$t = implode("\n", $contents->lines);

	if (str_replace(["\r\n", "\r", "\n", "\t"], ' ', $t) == 'KEEP EXACT HEIGHT'){
		$PDF->Rect($left, $top, $width, $height, 'DF');
	}else{
		$PDF->MultiCell($width, $height, $t, $hasBorder, $textAlign, 1, 0, '', '', true, 0, $isHTML, false);
	}

}

function nuPrintImage($PDF, $S, $contents, $O){

	$width			= $O->width;
	$height			= $O->height;
	$left			= $O->left;
	$path			= $contents->path;
	$top			= $S->sectionTop + $contents->top;

	if($O->path != ''){
		$PDF->Image($O->path, $left, $top, $width, $height);
	}

}

function nuGetTotalPages(){

	$pages					 = 0;

	$count = count($GLOBALS['nu_report']);
	for($i = 0 ; $i < $count ; $i++){
		if($GLOBALS['nu_report'][$i]->sectionTop == 0){
			$pages++;
		}
	}

	return $pages;
}

function nuReplaceLabelHashVariables($LAY, $hashData){

	$countNuReport = count($GLOBALS['nu_report']);
	for($i = 0 ; $i <  $countNuReport; $i++){

		$countObj = count($GLOBALS['nu_report'][$i]->objects);
		for($o = 0 ; $o <  $countObj ; $o++){

			$O = nuGetObjectProperties($LAY, $GLOBALS['nu_report'][$i]->objects[$o]->id);

			if($O->objectType == 'label'){

				$countLines = count($GLOBALS['nu_report'][$i]->objects[$o]->lines);
				for($l = 0 ; $l < $countLines ; $l++){
					$GLOBALS['nu_report'][$i]->objects[$o]->lines[$l] = nuReplaceHashVariables($GLOBALS['nu_report'][$i]->objects[$o]->lines[$l]);
				}
			}
		}
	}

}

function nuMakeSummaryTable($REPORT, $TABLE_ID){

	$sum		= [];
	$field		= [];
	$groups		= [];

	for($i = 3 ; $i < 8 ; $i++){

		if($REPORT->groups[$i]->sortField != ''){			//-- loop through groups

			$groups[] = $REPORT->groups[$i]->sortField;

		}

	}

	$countGroups = count($REPORT->groups);
	for($g = 0 ; $g < $countGroups; $g++){

		$countGroupSections = count($REPORT->groups[$g]->sections);
		for($s = 0 ; $s < $countGroupSections; $s++){

			$countGroupSectionObjects = count($REPORT->groups[$g]->sections[$s]->objects);
			for($o = 0 ; $o < $countGroupSectionObjects; $o++){

				$obj = $REPORT->groups[$g]->sections[$s]->objects[$o];
				if($obj->objectType == 'field'){
					if(strtoupper(substr($obj->fieldName,0,4)) == 'SUM('){
						$sum[substr($obj->fieldName,4, -1)] = substr($obj->fieldName,4, -1);
					}
					if(strtoupper(substr($obj->fieldName,0,8)) == 'AVERAGE('){
						$ex								 = explode(',',substr($obj->fieldName, 8, -1));
						$sum[trim($ex[0])] = trim($ex[0]);
						$sum[trim($ex[1])] = trim($ex[1]);
					}
				}

			}
		}

	}

	foreach ($sum as $k => $v) {

		$field[] = "SUM(`$v`) AS `nu_sum_$v` ";

	}

	if(count($field) > 0 and count($groups) > 0){			//-- a reason to have a summary table

		nuRunQuery("CREATE TABLE $TABLE_ID"."_nu_summary SELECT count(*) as nu_count, " . implode(',',$field) . ", " . implode(',',$groups) . " FROM $TABLE_ID group by " . implode(',',$groups));

		$countGroups = count($groups);
		for($i = 0 ; $i < $countGroups ; $i++){

			nuRunQuery("ALTER TABLE $TABLE_ID"."_nu_summary ADD INDEX `".$groups[$i]."` (`".$groups[$i]."`)");

		}

	}

}

function nuAddCriteriaValues($hashData, $T){

	$c = db_field_names($T);

	$a = [];

	foreach($hashData AS $key => $value){

		if( !in_array(strtolower($key), $c) and !is_array($value) and !is_object($value)){

				$v = $value == null ? '' : addslashes($value);
				$v = substr($v, 0, 199);

				if(substr($v,(strlen($v)-1),1) == '\\')

					$v = substr($v,0,strlen($v)-1);
					$l = min(strlen($v), 200);

				if($l > 0){

					$a[] = " ADD `$key` VARCHAR($l) DEFAULT '$v' ";

				}

				$c[] = strtolower($key);

			}

		}

		if(count($a) > 0){

			nuRunQuery("ALTER TABLE $T " . implode(',', $a));

		}

		return $c;

}

function nuIsField($i){

	return in_array($i, $GLOBALS['nu_columns']);

}

function nuIsImage($i){

	if((nuStringStartsWith('Image:', $i, true))){

		$c = substr($i, 6);
		$t = nuRunQuery("SELECT * FROM zzzzsys_file WHERE sfi_code = ? ", [$c]);
		$r = db_fetch_object($t);

		return $r->sfi_json;

	}else{
		return '';
	}

}


function nuIsFile($i){

	$file_headers = @get_headers($i);

	if($file_headers[0] == 'HTTP/1.0 404 Not Found'){
		return false;
	} else if ($file_headers[0] == 'HTTP/1.0 302 Found'){
		return false;
	} else {
		return true;
	}
}

function nuRemoveFiles(){

	$count = count($GLOBALS['nu_files']);
	for($i = 0 ; $i < $count ; $i++){
		unlink($GLOBALS['nu_files'][$i]);
	}

}

function nuRemovePageBreak($S){
	if( property_exists($S->LAY->groups[$S->group]->sections[$S->section], 'page_break')) {
		if(count($S->LAY->groups[1]->sections[1]->objects) == 0)
			$S->LAY->groups[$S->group]->sections[$S->section]->page_break = 0;
	}
}

function nuSavePDF($PDF, $code = '', $tag = '') {

	if (nuDemo()) return;

	// save PDF file on the server in the ./temp directory
	$filename1 = 'nupdf_' . nuID() . '.pdf';
	$dir = dirname(getcwd()) . DIRECTORY_SEPARATOR. 'temp' . DIRECTORY_SEPARATOR;
	$filename = $dir . $filename1;
	$path = realpath($dir);

	$rid = null;

	if (is_writable($path)) {
		$PDF->Output($filename, 'F');
		$s = nuHash();
		$usr = isset($s["USER_ID"]) ? $s["USER_ID"] : null;
		$rid = nuID();

		// creation of temporary table to store the names of generated files
		$q1 = "CREATE TABLE IF NOT EXISTS pdf_temp (
			pdf_temp_id VARCHAR(25) PRIMARY KEY,
			pdf_added_by VARCHAR(25),
			pdf_code VARCHAR(100),
			pdf_tag VARCHAR(100),
			pdf_file_name VARCHAR(255),
			pdf_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			); ";
		nuRunQuery($q1);

		$q1 = "INSERT INTO pdf_temp (pdf_temp_id,pdf_added_by,pdf_code,pdf_tag,pdf_file_name)
					VALUES ('$rid','$usr','$code','$tag','$filename');";
		nuRunQuery($q1);

		echo json_encode(['filename' => $filename, 'id' => $rid]);


	}
	else {
		nuDebug('There was an error saving the report','The directory to save PDF files: '. $dir .' does not exist or you do not have permission to write to this folder!');
		echo json_encode(['filename' => null, 'id' => null]);
	}

	return [
		'id' => $rid,
		'filename' => $filename
	];

}

?>
