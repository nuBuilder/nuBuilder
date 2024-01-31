<?php

error_reporting( error_reporting() & ~E_NOTICE );

require_once('nuchoosesetup.php');
require_once('nubuilders.php');
require_once('nuemailer.php');

nuSetTimeLimit(0);

mb_internal_encoding('UTF-8');

$GLOBALS['nuSetup']		= db_setup();
$setup					= $GLOBALS['nuSetup'];			//--setup php code just used for this database

nuClientTimeZone();

//==================FUNCTIONS============================================================

function nuClientTimeZone(){

	global $setup;

	// get time zone setting
	if ($setup->set_timezone){
		$zone	= $setup->set_timezone;
	} else {
		$zone	= "Australia/Adelaide";
	}

	// set time zone setting for PHP
	date_default_timezone_set($zone);

	// calculate offset
	$dateObj		= new DateTime();
	$mins			= $dateObj->getOffset() / 60;
	$sgn			= ($mins < 0 ? -1 : 1);
	$mins			= abs($mins);
	$hrs			= floor($mins / 60);
	$mins			-= $hrs * 60;
	$offset			= sprintf('%+d:%02d', $hrs*$sgn, $mins);

	// set timezone setting for MYSQL
	nuRunQuery("SET time_zone = '$offset'");

}

function nuSetTimeLimit($seconds){
	if (function_exists('set_time_limit')) {
		set_time_limit($seconds);
	}
}

function nuTT(){

	$fn	= '___nu'.uniqid('1').'___';

	return $fn;								//--create a unique name for a Temp Table

}

function nuErrorFound(){

	if(isset($GLOBALS['ERRORS'])){
		return count($GLOBALS['ERRORS']) > 0;
	}else{
		return false;
	}

}

class nuSqlString{

	public  $from			= '';
	public  $where			= '';
	public  $groupBy		= '';
	public  $having			= '';
	public  $orderBy		= '';
	public  $fields			= [];
	public  $Dselect		= '';
	public  $Dfrom			= '';
	public  $Dwhere			= '';
	public  $DgroupBy		= '';
	public  $Dhaving		= '';
	public  $DorderBy		= '';
	public  $Dfields		= [];
	public  $SQL			= '';

	public function __construct($sql){

		$sql				= preg_replace('%(/\*)(.*?)(\*/)%s',"",$sql); 	//-- remove  / * * / style comments
		$sql				= str_replace(chr(13), ' ', $sql);				//-- remove carrige returns
		$sql				= str_replace(chr(10), ' ', $sql);				//-- remove line feeds
		$sql				= rtrim($sql,';'); 								//-- strip trailing ;

		$from_string		= stristr($sql, ' from ');
		$where_string		= stristr($sql, ' where ');
		$groupBy_string		= stristr($sql, ' group by ');
		$having_string		= stristr($sql, ' having ');
		$orderBy_string		= stristr($sql, ' order by ');

		$from				= str_replace($where_string,   '', $from_string);
		$from				= str_replace($groupBy_string, '', $from);
		$from				= str_replace($having_string,  '', $from);
		$from				= str_replace($orderBy_string, '', $from);

		$where				= str_replace($groupBy_string, '', $where_string);
		$where				= str_replace($having_string,  '', $where);
		$where				= str_replace($orderBy_string, '', $where);

		$groupBy			= str_replace($having_string,  '', $groupBy_string);
		$groupBy			= str_replace($orderBy_string, '', $groupBy);

		$having				= str_replace($orderBy_string, '', $having_string);

		$orderBy			= $orderBy_string;
		$this->from			= $from;
		$this->where		= $where == '' ? 'WHERE 1' : $where;
		$this->groupBy		= $groupBy;
		$this->having		= $having;
		$this->orderBy		= $orderBy;

		if($from == ''){

			$this->from		= 'FROM zzzzsys_setup';
			$this->where	= 'WHERE 0';
			$this->addField('*');

		}

		$this->Dfrom		= $this->from;
		$this->Dwhere		= $this->where;
		$this->DgroupBy		= $this->groupBy;
		$this->Dhaving		= $this->having;
		$this->DorderBy		= $this->orderBy;

		$this->buildSQL();

	}

	public function restoreDefault($pString){

		if($pString == 'f'){$this->from		= $this->Dfrom;}
		if($pString == 'w'){$this->where	= $this->Dwhere;}
		if($pString == 'g'){$this->groupBy	= $this->DgroupBy;}
		if($pString == 'h'){$this->having	= $this->Dhaving;}
		if($pString == 'o'){$this->orderBy	= $this->DorderBy;}
		$this->buildSQL();

	}

	public function getTableName(){

		return nuTrim(substr($this->from, 5));

	}

	public function setFrom($pString){

		$this->from			= $pString;
		$this->buildSQL();

	}

	public function setWhere($pString){

		$this->where		= $pString;
		$this->buildSQL();

	}

	public function getWhere(){
		return $this->where;
	}

	public function setGroupBy($pString){

		$this->groupBy		= $pString;
		$this->buildSQL();

	}

	public function setHaving($pString){

		$this->having		= $pString;
		$this->buildSQL();

	}

	public function setOrderBy($pString){

		$this->orderBy		= $pString;
		$this->buildSQL();

	}

	public function addField($pString){

		$this->fields[]		= $pString;
		$this->buildSQL();

	}

	public function removeAllFields(){

		$this->fields		= [];

	}

	private function buildSQL(){

		$this->SQL		= 'SELECT ';
		$this->SQL		= $this->SQL . nuSQLTrim(implode(',', $this->fields), 1);
		$this->SQL		= $this->SQL . nuSQLTrim($this->from);
		$this->SQL		= $this->SQL . nuSQLTrim($this->where);
		$this->SQL		= $this->SQL . nuSQLTrim($this->groupBy);
		$this->SQL		= $this->SQL . nuSQLTrim($this->having);
		$this->SQL		= $this->SQL . nuSQLTrim($this->orderBy);

	}

}

function nuSQLTrim($s, $noCR = 0){

	if(nuTrim($s) == ''){
		return '';
	}else{
		if($noCR == 0){
			return "\n$s";
		}else{
			return $s;
		}
	}

}

function nuObjKey($o, $k, $d = null) {
	return isset($o[$k]) ? $o[$k] : $d;
}

function nuStrPos($haystack, $needle, $offset = 0) {
	return strpos($haystack ?? '', $needle ?? '', $offset);
}

function nuTrim($s) {
	return trim($s ?? '');
}

function nuJsonDecode($json, $associative = null) {
	return json_decode($json ?? '', $associative);
}

function nuSetHashList($p){

	$A 			= [];
	$r			= [];
	$h			= [];

	if (! is_null($p)) {

		$fid		= addslashes(nuObjKey($p,'form_id', ''));
		$rid		= addslashes(nuObjKey($p,'record_id', ''));

		$A			= nuGetUserAccess();

		if ($fid != '' && $rid != '' && $fid != 'doesntmatter') {

			$s			= "SELECT sfo_table, sfo_primary_key FROM zzzzsys_form WHERE zzzzsys_form_id = '$fid'";
			$t			= nuRunQuery($s);

			if (db_num_rows($t) > 0) {

				$R			= db_fetch_object($t);

				if($p['call_type'] == 'getform'){

					if(!empty(nuTrim($R->sfo_table))){

						$s		= "SELECT * FROM $R->sfo_table WHERE $R->sfo_primary_key = '$rid'";
						$t		= nuRunQuery($s);
						$f		= db_fetch_object($t);

						if(is_object($f) ){

							foreach ($f as $fld => $value ){								//-- This Edit Form's Object Values
								if ($value == null) {
									$value='';
								}
								$r[$fld] = addslashes($value ?? '');
							}

						}
					}

				}

			}
		}

		foreach ($p as $key => $value){														//-- The 'opener' Form's properties

			if(gettype($value) == 'string' or is_numeric ($value)){
				$h[$key]			= addslashes($value ?? '');
			}else{
				$h[$key]			= '';
			}

		}

		if(isset($p['hash']) && gettype($p['hash']) == 'array'){

			foreach ($p['hash'] as $key => $value){											//-- The 'opener' Form's hash variables

				if(gettype($value) == 'string' or is_numeric ($value)){
					$h[$key]			= addslashes($value ?? '');
				}else{
					$h[$key]			= '';
				}

			}

		}

		$h['PREVIOUS_RECORD_ID']	= addslashes($rid ?? '');
		$h['RECORD_ID']				= addslashes($rid ?? '');
		$h['NEW_RECORD']			= addslashes($rid == -1 ? '1' : '0');
		$h['FORM_ID']				= addslashes($fid ?? '');
		$h['SUBFORM_ID']			= addslashes(nuObjKey($_POST['nuSTATE'],'object_id', ''));
		$h['ID']					= addslashes(nuObjKey($_POST['nuSTATE'],'primary_key', ''));
		$h['CODE']					= addslashes(nuObjKey($_POST['nuSTATE'],'code', ''));

	}

	$cj = [];
	$cq = "SELECT sss_hashcookies FROM zzzzsys_session WHERE LENGTH(sss_hashcookies) > 0 AND zzzzsys_session_id = ? ";
	$ct = nuRunQuery($cq, [$_SESSION['nubuilder_session_data']['SESSION_ID']]);

	$cr = db_fetch_object($ct);

	if (is_null($p)) {
		$h = [];
		$r = [];
		$A = [];
	}

	if (db_num_rows($ct) > 0) {
		$cj = nuJsonDecode($cr->sss_hashcookies, true);
		return array_merge($cj, $h, $r, $A);
	} else {
		return array_merge($h, $r, $A);
	}

}

function nuRunReport($report_id){

	$id									= nuID();
	$s									= "SELECT zzzzsys_report_id, sre_zzzzsys_php_id, sre_code, sre_description, sre_layout FROM zzzzsys_report WHERE sre_code = ?";
	$t									= nuRunQuery($s, [$report_id]);
	$ob									= db_fetch_object($t);

	$nuCode								= $ob->sre_code;
	$phpId								= $ob->zzzzsys_report_id;

	$accessList	= nuReportAccessList(nuAllowedActivities());
	if(!nuGlobalAccess() && !in_array($phpId, $accessList)) {
		nuDisplayError(nuTranslate("Access To Report Denied...")." ($nuCode)");
		return null;
	}

	$_POST['nuHash']['code']			= $nuCode;
	$_POST['nuHash']['description']		= $ob->sre_description;
	unset($_POST['nuHash']['pages']);
	$_POST['nuHash']['sre_layout']		= nuReplaceHashVariables($ob->sre_layout);
	$_POST['nuHash']['parentID']		= $ob->sre_zzzzsys_php_id;
	$_POST['nuHash']['nuInstall']		= '0';
	$j									= json_encode($_POST['nuHash']);

	nuSetJSONData($id, $j);

	return $id;

}

function nuAllowedActivities(){

	$t	= nuRunQuery("SELECT sss_access FROM zzzzsys_session WHERE zzzzsys_session_id = ? ", [$_SESSION['nubuilder_session_data']['SESSION_ID']]);
	$r	= db_fetch_object($t);
	$a	= nuJsonDecode($r->sss_access);

	return $a;

}

function nuRunPHPHidden($nuCode){ 
	return nuRunPHP($nuCode, true);
}

function nuRunPHP($nuCode, $hidden = false) {

	if ($nuCode !== 'nukeepalive') {

		$sql = "SELECT sph_code, sph_description, zzzzsys_php_id, sph_php, sph_global
					FROM zzzzsys_php
					WHERE sph_code = ?
			";

		$stmt = nuRunQuery($sql, [$nuCode]);
		$exists = db_num_rows($stmt) == 1;

		if (!$exists) {
			if (substr($nuCode, 0, 2) !== 'nu') {
				nuDisplayError(nuTranslate("The Procedure does not exist...") . " ($nuCode)");
			}
		}
		else {

			$row = db_fetch_object($stmt);
			$hasAccess = $row->sph_global == '1';

			if (!$hasAccess) {
				$procList = nuProcedureAccessList(nuAllowedActivities());
				$hasAccess = in_array($row->zzzzsys_php_id, $procList);
			}

			if ($hasAccess || $_SESSION['nubuilder_session_data']['isGlobeadmin']) {
				if ($hidden) nuEval($row->zzzzsys_php_id);
			}
			else {
				nuDisplayError(nuTranslate("Access To Procedure Denied...") . " ($nuCode)");
			}
		}
	
	}

	if ($hidden) {

		$f = new stdClass;
		$f->id = 1;
		return $f;

	}
	else {

		$_POST['nuHash']['code'] = $exists ? $row->sph_code : null;
		$_POST['nuHash']['description'] = $exists ? $row->sph_description : null;
		$_POST['nuHash']['parentID'] = $exists ? $row->zzzzsys_php_id : null;
		$_POST['nuHash']['sph_php'] = $exists ? $row->sph_php : null;

		$json = json_encode($_POST['nuHash']);
		$id = nuID();
		nuSetJSONData($id, $json);
		return $id;

	}

}

function nuJavaScriptCallback($js){
	$_POST['nuCallback']	= $js;
}

function nuSetJSONDataAll($i, $nj){

	$t						= nuRunQuery("SELECT zzzzsys_session_id, sss_access FROM zzzzsys_session");

	while($r = db_fetch_object($t)){

		$j					= nuJsonDecode($r->sss_access, true);

		$j[$i]				= $nj;
		$J					= json_encode($j);

		$s					= "UPDATE zzzzsys_session SET sss_access = ? WHERE zzzzsys_session_id = ? ";

		nuRunQuery($s, [$J, $r->zzzzsys_session_id]);

	}

}

function nuSetJSONData($name, $newJson){

	$sessionId			= $_SESSION['nubuilder_session_data']['SESSION_ID'];
	$stmt				= nuRunQuery("SELECT sss_access FROM zzzzsys_session WHERE zzzzsys_session_id = ? ", [$sessionId]);

	$row				= db_fetch_object($stmt);
	$access				= nuJsonDecode($row->sss_access, true);

	$access[$name]		= $newJson;
	$update				= json_encode($access);

	nuRunQuery("UPDATE zzzzsys_session SET sss_access = ? WHERE zzzzsys_session_id = ? ", [$update, $sessionId]);

}

function nuGetJSONData($name){

	$sessionId			= $_SESSION['nubuilder_session_data']['SESSION_ID'];
	$stmt				= nuRunQuery("SELECT sss_access FROM zzzzsys_session WHERE zzzzsys_session_id = ? ", [$sessionId]);

	if (db_num_rows($stmt) > 0) {
		$row			= db_fetch_object($stmt);
		$access			= nuJsonDecode($row->sss_access, true);
	} else {
		return '';
	}

	return nuObjKey($access, $name,'');

}

function nuSetUserJSONData($key, $value, $userId = "") {

	$globeAdminName = $_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'];

	if ($userId == "") {
		$userId = nuGlobalAccess() ? $globeAdminName : nuHash()['USER_ID'];
	}

	if (nuGlobalAccess()) {
		$sql = "INSERT IGNORE INTO zzzzsys_user (zzzzsys_user_id) VALUES (?)";
		nuRunQuery($sql, [$globeAdminName]);
	}

	$sql = "SELECT sus_json FROM zzzzsys_user WHERE zzzzsys_user_id = ?";
	$result = nuRunQuery($sql, [$userId]);
	$row = db_fetch_row($result);

	$jsonData = $row[0] != '' ? nuJsonDecode($row[0], true) : [];
	$jsonData[$key] = $value;
	$updatedJsonData = json_encode($jsonData);

	$sql = "UPDATE zzzzsys_user SET sus_json = ? WHERE zzzzsys_user_id = ?";
	nuRunQuery($sql, [$updatedJsonData, $userId]);

}

function nuGetUserJSONData($key, $userId = ""){

	$gu = $_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'];  //  or  $gu = '';

	if ($userId == "") {
		$userId 	= nuGlobalAccess() ? $gu  : nuHash()['USER_ID'];
	}

	$query		= "SELECT sus_json FROM zzzzsys_user WHERE zzzzsys_user_id = ? ";
	$stmt		= nuRunQuery($query, [$userId]);

	if (db_num_rows($stmt) == 1) {
		$row		= db_fetch_row($stmt);
		$json		= nuJsonDecode($row[0], true);
		return nuObjKey($json, $key, '');
	} else {
		return '';
	}

}

function nuGetSysJSONValue($tbl, $jk, $pk) {

	$fld = $GLOBALS['sys_table_prefix'][$tbl]."_json";
	$s = "SELECT $fld FROM zzzzsys_{$tbl} WHERE zzzzsys_{$tbl}_id = ? ";
	$t = nuRunQuery($s, [$pk]);

	if (db_num_rows($t) == 1) {
		$r = db_fetch_row($t);
		$j = nuJsonDecode($r[0], true);
		return nuObjKey($j, $jk, '');
	} else {
		return '';
	}
}

function nuSetSysJSONValue($tbl, $jk, $jv, $pk) {

	$fld = $GLOBALS['sys_table_prefix'][$tbl]."_json";
	$s = "SELECT $fld FROM zzzzsys_{$tbl} WHERE zzzzsys_{$tbl}_id = ? ";
	$t = nuRunQuery($s, [$pk]);
	$r = db_fetch_row($t);
	$j = nuJsonDecode($r[0], true);
	$j[$jk] = $jv;
	$J = json_encode($j);
	$s = "UPDATE zzzzsys_{$tbl} SET $fld = ? WHERE zzzzsys_{$tbl}_id = ? ";
	$t = nuRunQuery($s, [$J, $pk]);

}

function nuGetProcedure($id) {

	$query = "SELECT sph_php FROM zzzzsys_php WHERE zzzzsys_php_id = ?";
	$result = nuRunQuery($query, [$id]);
	$row = db_fetch_row($result);
	return isset($row[0]) ? $row[0] : false;

}

function nuRunHTML(){

	$id								= nuID();
	$P								= $_POST['nuSTATE'];
	$o								= new stdClass;
	$o->sql							= $P['browse_sql'];
	$o->columns						= $P['browse_columns'];
	$o->hash						= nuHash();

	$j								= json_encode($o);

	$nuS							= "INSERT INTO zzzzsys_debug (zzzzsys_debug_id, deb_message) VALUES (?, ?)";
	nuRunQuery($nuS, [$id, $j]);

	return $id;

}

function nuReplaceHashVariables($s){

	$s	= isset($s) ? nuTrim($s) : '';

	if($s == ''){
		return '';
	}

	$a	= nuObjKey($_POST,'nuHash', null);

	if ($a != null) {

		$q	= "SELECT sss_hashcookies FROM zzzzsys_session WHERE zzzzsys_session_id = ? ";
		$t	= nuRunQuery($q, [$_SESSION['nubuilder_session_data']['SESSION_ID']]);
		$r	= db_fetch_object($t);

		if (isset($r->sss_hashcookies)) {

			$j	= nuJsonDecode($r->sss_hashcookies, true);

			if (is_array($j)) {
				$a = array_merge($j, $a);
			}
		}

	}

	if (!is_array($a)) {
		return $s;
	}

	foreach ($a as $k => $v) {

		 if(!is_object ($a[$k]) && !is_array ($a[$k]) ) {
			$v = $v == null ? '' : $v; 
			$s	= str_replace ('#' . $k . '#', $v, $s);
		}

	}

	return $s;

}

function hex2rgb($hexOrColor) {

	$hex = ColorToHex($hexOrColor);
	$hex = str_replace("#", "", $hex);

	if(strlen($hex) == 3) {
		$r = hexdec(substr($hex,0,1).substr($hex,0,1));
		$g = hexdec(substr($hex,1,1).substr($hex,1,1));
		$b = hexdec(substr($hex,2,1).substr($hex,2,1));
	} else {
		$r = hexdec(substr($hex,0,2));
		$g = hexdec(substr($hex,2,2));
		$b = hexdec(substr($hex,4,2));
	}
	$rgb = [$r, $g, $b];

	return $rgb;

}

function ColorToHex($pColor){

	$vColor	= strtoupper($pColor);
	$colors = [
	'ALICEBLUE' => 'F0F8FF',
	'ANTIQUEWHITE' => 'FAEBD7',
	'AQUA' => '00FFFF',
	'AQUAMARINE' => '7FFFD4',
	'AZURE' => 'F0FFFF',
	'BEIGE' => 'F5F5DC',
	'BISQUE' => 'FFE4C4',
	'BLACK' => '000000',
	'BLANCHEDALMOND' => 'FFEBCD',
	'BLUE' => '0000FF',
	'BLUEVIOLET' => '8A2BE2',
	'BROWN' => 'A52A2A',
	'BURLYWOOD' => 'DEB887',
	'CADETBLUE' => '5F9EA0',
	'CHARTREUSE' => '7FFF00',
	'CHOCOLATE' => 'D2691E',
	'CORAL' => 'FF7F50',
	'CORNFLOWERBLUE' => '6495ED',
	'CORNSILK' => 'FFF8DC',
	'CRIMSON' => 'DC143C',
	'CYAN' => '00FFFF',
	'DARKBLUE' => '00008B',
	'DARKCYAN' => '008B8B',
	'DARKGOLDENROD' => 'B8860B',
	'DARKGRAY' => 'A9A9A9',
	'DARKGREY' => 'A9A9A9',
	'DARKGREEN' => '006400',
	'DARKKHAKI' => 'BDB76B',
	'DARKMAGENTA' => '8B008B',
	'DARKOLIVEGREEN' => '556B2F',
	'DARKORANGE' => 'FF8C00',
	'DARKORCHID' => '9932CC',
	'DARKRED' => '8B0000',
	'DARKSALMON' => 'E9967A',
	'DARKSEAGREEN' => '8FBC8F',
	'DARKSLATEBLUE' => '483D8B',
	'DARKSLATEGRAY' => '2F4F4F',
	'DARKSLATEGREY' => '2F4F4F',
	'DARKTURQUOISE' => '00CED1',
	'DARKVIOLET' => '9400D3',
	'DEEPPINK' => 'FF1493',
	'DEEPSKYBLUE' => '00BFFF',
	'DIMGRAY' => '696969',
	'DIMGREY' => '696969',
	'DODGERBLUE' => '1E90FF',
	'FIREBRICK' => 'B22222',
	'FLORALWHITE' => 'FFFAF0',
	'FORESTGREEN' => '228B22',
	'FUCHSIA' => 'FF00FF',
	'GAINSBORO' => 'DCDCDC',
	'GHOSTWHITE' => 'F8F8FF',
	'GOLD' => 'FFD700',
	'GOLDENROD' => 'DAA520',
	'GRAY' => '808080',
	'GREY' => '808080',
	'GREEN' => '008000',
	'GREENYELLOW' => 'ADFF2F',
	'HONEYDEW' => 'F0FFF0',
	'HOTPINK' => 'FF69B4',
	'INDIANRED' => 'CD5C5C',
	'INDIGO' => '4B0082',
	'IVORY' => 'FFFFF0',
	'KHAKI' => 'F0E68C',
	'LAVENDER' => 'E6E6FA',
	'LAVENDERBLUSH' => 'FFF0F5',
	'LAWNGREEN' => '7CFC00',
	'LEMONCHIFFON' => 'FFFACD',
	'LIGHTBLUE' => 'ADD8E6',
	'LIGHTCORAL' => 'F08080',
	'LIGHTCYAN' => 'E0FFFF',
	'LIGHTGOLDENRODYELLOW' => 'FAFAD2',
	'LIGHTGRAY' => 'D3D3D3',
	'LIGHTGREY' => 'D3D3D3',
	'LIGHTGREEN' => '90EE90',
	'LIGHTPINK' => 'FFB6C1',
	'LIGHTSALMON' => 'FFA07A',
	'LIGHTSEAGREEN' => '20B2AA',
	'LIGHTSKYBLUE' => '87CEFA',
	'LIGHTSLATEGRAY' => '778899',
	'LIGHTSLATEGREY' => '778899',
	'LIGHTSTEELBLUE' => 'B0C4DE',
	'LIGHTYELLOW' => 'FFFFE0',
	'LIME' => '00FF00',
	'LIMEGREEN' => '32CD32',
	'LINEN' => 'FAF0E6',
	'MAGENTA' => 'FF00FF',
	'MAROON' => '800000',
	'MEDIUMAQUAMARINE' => '66CDAA',
	'MEDIUMBLUE' => '0000CD',
	'MEDIUMORCHID' => 'BA55D3',
	'MEDIUMPURPLE' => '9370D8',
	'MEDIUMSEAGREEN' => '3CB371',
	'MEDIUMSLATEBLUE' => '7B68EE',
	'MEDIUMSPRINGGREEN' => '00FA9A',
	'MEDIUMTURQUOISE' => '48D1CC',
	'MEDIUMVIOLETRED' => 'C71585',
	'MIDNIGHTBLUE' => '191970',
	'MINTCREAM' => 'F5FFFA',
	'MISTYROSE' => 'FFE4E1',
	'MOCCASIN' => 'FFE4B5',
	'NAVAJOWHITE' => 'FFDEAD',
	'NAVY' => '000080',
	'OLDLACE' => 'FDF5E6',
	'OLIVE' => '808000',
	'OLIVEDRAB' => '6B8E23',
	'ORANGE' => 'FFA500',
	'ORANGERED' => 'FF4500',
	'ORCHID' => 'DA70D6',
	'PALEGOLDENROD' => 'EEE8AA',
	'PALEGREEN' => '98FB98',
	'PALETURQUOISE' => 'AFEEEE',
	'PALEVIOLETRED' => 'D87093',
	'PAPAYAWHIP' => 'FFEFD5',
	'PEACHPUFF' => 'FFDAB9',
	'PERU' => 'CD853F',
	'PINK' => 'FFC0CB',
	'PLUM' => 'DDA0DD',
	'POWDERBLUE' => 'B0E0E6',
	'PURPLE' => '800080',
	'RED' => 'FF0000',
	'ROSYBROWN' => 'BC8F8F',
	'ROYALBLUE' => '4169E1',
	'SADDLEBROWN' => '8B4513',
	'SALMON' => 'FA8072',
	'SANDYBROWN' => 'F4A460',
	'SEAGREEN' => '2E8B57',
	'SEASHELL' => 'FFF5EE',
	'SIENNA' => 'A0522D',
	'SILVER' => 'C0C0C0',
	'SKYBLUE' => '87CEEB',
	'SLATEBLUE' => '6A5ACD',
	'SLATEGRAY' => '708090',
	'SLATEGREY' => '708090',
	'SNOW' => 'FFFAFA',
	'SPRINGGREEN' => '00FF7F',
	'STEELBLUE' => '4682B4',
	'TAN' => 'D2B48C',
	'TEAL' => '008080',
	'THISTLE' => 'D8BFD8',
	'TOMATO' => 'FF6347',
	'TURQUOISE' => '40E0D0',
	'VIOLET' => 'EE82EE',
	'WHEAT' => 'F5DEB3',
	'WHITE' => 'FFFFFF',
	'WHITESMOKE' => 'F5F5F5',
	'YELLOW' => 'FFFF00',
	'YELLOWGREEN' => '9ACD32'
	];

	return array_key_exists($vColor, $colors) ? $colors[$vColor] : $vColor;

}

function nuAddToHashList($J, $run){

	$hash				= [];
	$ignore				= [];
	$ignore[]			= 'sre_layout';
	$ignore[]			= 'slp_php';
	$ignore[]			= 'sre_php';

	foreach($J as $key => $v){										//-- add current hash variables

		if(!in_array($key, $ignore)){
			$hash['' . $key . ''] = $v;
		}

	}

	$d							= new DateTime();

	$hash['nu_date_time']		= $d->format('Y-m-d H:i:s');
	$hash['nu_date']			= $d->format('Y-m-d');
	$hash['nu_time']			= $d->format('H:i:s');
	$hash['nu_year']			= $d->format('Y');
	$hash['nu_month']			= $d->format('m');
	$hash['nu_day']				= $d->format('d');
	$hash['nu_hour']			= $d->format('H');
	$hash['nu_minute']			= $d->format('i');

	if($run == 'report'){

		$hash['sre_layout']		= $J->sre_layout;
		$hash['slp_php']		= isset($J->slp_php) ? $J->slp_php : '';

	}

	if($run == 'php'){

		$hash['sph_php']		= $J->sph_php;

	}

	return $hash;

}

function nuGetUserAccess(){

	$A							= [];

	$sessionData				= $_SESSION['nubuilder_session_data'];
	$sessionId 					= $sessionData['SESSION_ID'];
	$s							= "SELECT sss_access FROM zzzzsys_session WHERE zzzzsys_session_id = ? ";
	$t							= nuRunQuery($s, [$sessionId]);
	$r							= db_fetch_object($t);

	if (db_num_rows($t) == 0) return $A;

	$j							= nuJsonDecode($r->sss_access);

	$A['USER_ID']				= $j->session->zzzzsys_user_id;
	$A['USER_GROUP_ID']			= $j->session->zzzzsys_access_id;
	$A['HOME_ID']				= $j->session->zzzzsys_form_id;
	$A['GLOBAL_ACCESS']			= $j->session->global_access;
	$A['ACCESS_LEVEL_CODE']		= $j->access_level_code;
	$A['ACCESS_LEVEL_GROUP']	= $j->access_level_group;
	$A['LOGIN_NAME']			= $j->session->sus_login_name;
	$A['USER_NAME']				= $j->session->sus_name;
	$A['USER_DEPARTMENT']		= $j->session->sus_department;
	$A['USER_TEAM']				= $j->session->sus_team;
	$A['USER_CODE']				= $j->session->sus_code;
	$A['USER_POSITION']			= $j->session->sus_position;
	$A['USER_ADDITIONAL1']		= $j->session->sus_additional1;
	$A['USER_ADDITIONAL2']		= $j->session->sus_additional2;
	$A['USER_A11Y']				= $j->session->sus_accessibility_features == '1' ? true : false;
	$A['LANGUAGE']				= $j->session->language;

	//-- update session time
	if (!isset($sessionData['SESSION_SSS_TIME_EXISTS'])) {
		$sessionData['SESSION_SSS_TIME_EXISTS']	= in_array("sss_time", db_field_names('zzzzsys_session'));
	}

	if ($sessionData['SESSION_SSS_TIME_EXISTS']){
		$s = time();
		nuRunQuery("UPDATE zzzzsys_session SET sss_time = $s WHERE zzzzsys_session_id = ? ", [$sessionId]);
		nuRunQuery("DELETE FROM zzzzsys_session WHERE sss_time < $s - 36000");										//-- 10 hours
	}

	return $A;

}

function nuGetFormProperties($i){

	$s	= "SELECT * FROM zzzzsys_form WHERE zzzzsys_form_id = ?";
	$t	= nuRunQuery($s, [$i]);

	return db_fetch_object($t);

}

function nuFormatList(){

	$f	= [array('','')];
	$s	= "
		SELECT
			CONCAT(LEFT(srm_type, 1), '|', TRIM(srm_format)) AS a,
			srm_format AS b
		FROM zzzzsys_format
		ORDER BY srm_type
	";

	$t	= nuRunQuery($s);

	while($r = db_fetch_object($t)){
		$f[] = [$r->a, $r->b];
	}

	return json_encode($f);

}

function nuAddFormatting($v, $f){

	if($v == '' || $f == ''){return $v;}
	$m = $v < 0 ? '-' : '';

	if($f[0] == 'N'){												//-- number  '456.789','N|€ 1,000.00'
		$CF				= nuGetNumberFormat(substr($f,2));			//-- CF[0]=sign, CF[1]=separator, CF[2]=decimal, CF[3]=places
				
		$nf				= number_format ($v , gettype($CF[3])=='string'?0:$CF[3] , $CF[2] , $CF[1]);
		$nm				= str_replace('-', '', $nf);

		return $m . $CF[0] . ' ' . $nm;

	}

	if($f[0] == 'D'){	//-- date

		if($v == '0000-00-00' or $v == ''){return '';}

		$split	= explode(' ', $v);
		$d		= explode('-', $split[0]);
		$t		= count($split) > 1 ? explode(':', $split[1]) : '';

		if($t == '' || $t[0] == ''){
			$t	= [0, 0, 0];
		}

		$o		= new DateTime();

		$o->setDate($d[0], $d[1], $d[2]);
		$o->setTime($t[0], $t[1], $t[2]);

		$s		= '';

		$s		= str_replace('pp',		$o->format('a'), $f);
		$s		= str_replace('PP',		$o->format('A'), $s);
		$s		= str_replace('yyyy',	$o->format('Y'), $s);
		$s		= str_replace('yy',		$o->format('y'), $s);
		$s		= str_replace('mmmm',	$o->format('F'), $s);
		$s		= str_replace('mmm',	$o->format('M'), $s);
		$s		= str_replace('mm',		$o->format('m'), $s);
		$s		= str_replace('dddd',	$o->format('l'), $s);
		$s		= str_replace('ddd',	$o->format('D'), $s);
		$s		= str_replace('dd',		$o->format('d'), $s);
		$s		= str_replace('hh',		$o->format('h'), $s);
		$s		= str_replace('nn',		$o->format('i'), $s);
		$s		= str_replace('ss',		$o->format('s'), $s);

		return substr($s,2);

	}

	return $v;

}

function nuGetNumberFormat($f){

	$s = "SELECT srm_format, srm_currency FROM zzzzsys_format";
	$t = nuRunQuery($s);

	while($r = db_fetch_object($t)){
		if($r->srm_format === $f){
			return nuJsonDecode($r->srm_currency);
		}
	}

}

function nuAddThousandSpaces($s, $c){

	$r			= strrev($s);
	$a			= str_split($r, 3);
	$n			= [];

	$countA = count($a);
	for($i = 0 ; $i < $countA ; $i++){

		$n[]	= strrev($a[$i]);

		if($i < $countA - 1){

			$n[]	= $c;

		}

	}

	$r			= array_reverse($n);

	return implode('', $r);

}

function nuPunctuation($text) {

	$punctuation = ['1,' => ',', '1.' => '.', '0,' => ',', '0.' => '.'];

	$result = ['', ''];

	foreach ($punctuation as $key => $value) {
		if (strpos($text, $key) !== false) {
			$result[$key[0]] = $value;
		}
	}

	return $result;

}

function nuTTList($id, $l){

	$t										= nuRunQuery('SELECT sob_all_id FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = ?',[$l]);

	while($r = db_fetch_object($t)){						//-- add default empty hash variables
		$_POST['nuHash'][$r->sob_all_id]	= '';
	}

	$tt										= nuTT();
	$_POST['nuHash']['TABLE_ID']			= $tt;
	$_POST['nuHash']['RECORD_ID']			= '';

	nuBuildTempTable($id, $tt, 1);

	$f										= db_field_names($tt);
	$f[]									= 'KEEP EXACT HEIGHT';

	nuRunQuery("DROP TABLE IF EXISTS $tt");

	return json_encode($f);

}

function nuBuildTempTable($name_id, $tt, $rd = 0){

	$x				= explode (':', $name_id);
	$id				= substr(strstr($name_id, ':'),1);

	if($x[0] == 'PROCEDURE'){
		nuEval($id);
	}

	if($x[0] == 'TABLE'){

		$P			= "	nuRunQuery('CREATE TABLE $tt SELECT * FROM $id');;";

		eval($P);

	}

	if($x[0] == 'SQL'){

		$s			= "SELECT sse_sql FROM zzzzsys_select WHERE zzzzsys_select_id = ?";
		$t			= nuRunQuery($s, [$id]);
		$r			= db_fetch_row($t);
		$c			= $r[0];

		if($rd == 1){									//-- report designer

			$nocr	= str_replace("\n",' ', $c);
			$where	= strpos($nocr, ' WHERE ');

			if($where){
				$c	= substr ($nocr, 0, $where);
			}

		}

		$p			= nuReplaceHashVariables($c);
		$tt			= addslashes($tt ?? '');

		$P			 = '$sql = "CREATE TABLE '.$tt.' '.$p.'";';
		$P			.= 'nuRunQuery($sql);';

		eval($P);

	}

}

function nuJSInclude($filePath) {

	$timestamp = filemtime($filePath);
	$url = "{$filePath}?ts={$timestamp}";

	echo '<script src="' . htmlspecialchars($url, ENT_QUOTES) . '" type="text/javascript"></script>' . PHP_EOL;

}

function nuCSSInclude($file) {

	$timestamp = filemtime($file);
	$url = "{$file}?ts={$timestamp}";

	echo '<link rel="stylesheet" href="' . htmlspecialchars($url, ENT_QUOTES) . '">' . PHP_EOL;

}

function nuImageList($f){

	$a			= [];
	$s			= "SELECT sfi_code FROM zzzzsys_file ORDER BY sfi_code";
	$t			= nuRunQuery($s);

	while($r = db_fetch_object($t)){
		$a[]	= 'Image:' . $r->sfi_code;
	}

	$c			= json_encode(array_merge($a, $f, ['KEEP EXACT HEIGHT']));

	return $c . ";\n";

}

function nuCreateTempFile($type) {

	$id = nuID();
	return sys_get_temp_dir() . "/$id." . '.' . $type;

}

function nuCreateFile($data) {

	if ($data == '') return '';

	if (nuStringStartsWith('data:image', $data)) {
		$type = explode('/', mime_content_type($data)) [1];
		$file = nuCreateTempFile($type);
		list($type, $data) = explode(';', $data);
		list(, $data) = explode(',', $data);
		file_put_contents($file, base64_decode($data));
	} elseif (nuStringStartsWith('http://', $data) || nuStringStartsWith('https://', $data)) {
		$name = pathinfo(parse_url($data)['path'], PATHINFO_FILENAME);
		$type = pathinfo(parse_url($data)['path'], PATHINFO_EXTENSION);
		$file = nuCreateTempFile($type);
		$content = file_get_contents($data);
		file_put_contents($file, $content);
	}
	else {
		$f = nuJsonDecode($data);
		$type = explode('/', $f->type);
		$type = $type[1];
		$file = nuCreateTempFile($type);
		$h = fopen($file, 'w');
		$d = base64_decode($f->file);
		$p = explode(';base64,', $d);
		$p = $p[1];

		fwrite($h, base64_decode($p));
		fclose($h);
	}

	return $file;
}


function nuHash(){
	return nuObjKey($_POST,'nuHash');
}

function nuBuildFormSchema(){

	$T				= nuRunQuery("SELECT zzzzsys_form_id FROM zzzzsys_form ORDER BY sfo_code");
	$fs				= [];

	while($r = db_fetch_object($T)){

		$f			= $r->zzzzsys_form_id;
		$a			= [];
		$t			= nuRunQuery("SELECT zzzzsys_object_id, sob_all_id, sob_all_type, sob_all_label, sob_input_type FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = '$f' ORDER BY sob_all_id");

		while($r = db_fetch_object($t)){

			if(in_array($r->sob_all_type, ['input', 'lookup', 'select', 'textarea'])){
				$a[] = [$r->zzzzsys_object_id, $r->sob_all_id, $r->sob_all_label, $r->sob_all_type, $r->sob_input_type];
			}

		}

		$fs[$f]		= $a;

	}

	return $fs;

}

function nuBuildTableSchema(){

	$a				= [];
	$t				= nuRunQuery("SELECT table_name as TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = DATABASE()");

	while($r = db_fetch_object($t)){

		$tn			= $r->TABLE_NAME;

		$info = db_field_info($tn);
		$a[$tn]		= ['names' => $info[0], 'types' => $info[1], 'primary_key' => $info[2], 'valid' => 1];

	}

	return $a;

}

function nuBuildViewSchema(){

	$a				= [];
	$t				= nuRunQuery("SELECT table_name as TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'VIEW' AND table_schema = DATABASE()");

	while($r = db_fetch_object($t)){
		$a[]		= $r->TABLE_NAME;
	}

	return nuGlobalAccess() ? $a : [];

}

function nuUpdateFormSchema($force_update = false){

	$json		= nuGetJSONData('clientFormSchema');
	if($json == '' || $force_update){

		$json	= nuBuildFormSchema();
		nuSetJSONData('clientFormSchema', $json);

	}

	return nuGlobalAccess() ? $json : [];

}

function nuUpdateTableSchema($call_type, $force_update = false){

	$j	= nuGetJSONData('clientTableSchema');
	$formCode = nuObjKey(nuHash(),'form_code');

	if($formCode == 'nufflaunch' || ($call_type == 'runhiddenphp' && $formCode == 'nuadddbcolumn') || is_null($j) || $j == '' || $force_update == true ){

		$j	= nuBuildTableSchema();
		nuSetJSONData('clientTableSchema', $j);			//-- force updating Table Schema

	}

	return $j;

}

function nuListSystemTables(){

	$a				= [];
	$t				= nuRunQuery("SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = DATABASE()");

	while($r = db_fetch_row($t)){
 
		if(nuStringStartsWith('zzzzsys_', $r[0])){
			$a[]	= $r[0];
		}

	}

	return $a;

}

function nuFontList(){

		$result			= [];
		$fonts			= [['Helvetica','Helvetica'],['Courier','Courier'],['Times','Times'],['Symbol','Symbol']];
		$exclude		= ['..', '.',DIRECTORY_SEPARATOR];
		$folder			= __DIR__ . DIRECTORY_SEPARATOR . 'libs/tcpdf' . DIRECTORY_SEPARATOR . 'fonts';

		$list			= scandir($folder);

		$countList = count($list);
		for ( $x=0; $x < $countList; $x++) {

				if ( !in_array($list[$x], $exclude) )  {

						$item				= nuTrim($folder . DIRECTORY_SEPARATOR . $list[$x]);

			if ( is_file($item) ){
							$path_parts		= pathinfo($item);
							$font_name		= $path_parts['filename'];
							$f				= explode('.', $path_parts['filename']);
							$font_name		= $f[0];
							if ( !in_array($font_name, $result) ) {
									array_push($result, $font_name);
							}
			}
				}
		}

		$countResult = count($result);
		for ( $x=0; $x < $countResult; $x++) {

				$element	= [];
				$element[0]	= $result[$x];
				$element[1]	= $result[$x];
				array_push($fonts, $element);
		}

	return json_encode($fonts);
}

function nuEventName($eventName) {

	$events = [
		'BB' => 'Before Browse',
		'AB' => 'After Browse',
		'BE' => 'Before Edit',
		'BS' => 'Before Save',
		'AS' => 'After Save',
		'BD' => 'Before Delete',
		'AD' => 'After Delete',
		'OS' => 'On Submit'
	];

	return $events[$eventName];

}

function nuGetPHP($phpid) {

	$s						= "SELECT sph_php, sph_code FROM zzzzsys_php WHERE zzzzsys_php_id = ? ";
	$t						= nuRunQuery($s, [$phpid]);

	$php = '';
	if (db_num_rows($t) == 1) {
		$php = db_fetch_object($t);	
	}

	return $php;

}

function nuEval($phpid){

	$r						= nuGetPHP($phpid);
	if($r == ''){return;}

	$code					= $r->sph_code;
	$php					= nuReplaceHashVariables($r->sph_php);
	if($php == ''){return;}

	$_POST['nuSystemEval']	= nuEvalMessage($phpid, $code);

	$nuDataSet = isset($_POST['nudata']);
	$nudata = $nuDataSet ? $_POST['nudata'] : '';

	try{
		$result = eval($php);
		if ($result === false) {
			nuExceptionHandler($e, $code);
		}
	}catch(Throwable $e){
		nuExceptionHandler($e, $code);
	}catch(Exception $e){
		nuExceptionHandler($e, $code);
	} catch (ParseError $e) {
		nuExceptionHandler($e, $code);
	}

	$_POST['nuProcedureEval']			= '';
	$_POST['nuSystemEval']				= '';
	if ($nuDataSet) $_POST['nudata']	= $nudata;

}

function nuRunProcedure($procedure) {

	$procResult = nuProcedure($procedure);
	$error	= '';

	if($procResult){
		eval($procResult);
		return $error === '' ? true : $error;
	}

	return false;

}

function nuProcedure($c){

	$s						= "SELECT sph_php, sph_code FROM zzzzsys_php WHERE sph_code = ? ";
	$t						= nuRunQuery($s, [$c]);

	if (db_num_rows($t) > 0) {	// procedure exists

		$r					= db_fetch_object($t);

		$php				= nuReplaceHashVariables($r->sph_php);
		$php				= "$php \n\n//--Added by nuProcedure()\n\n$"."_POST['nuProcedureEval'] = '';";
		$_POST['nuProcedureEval'] = "Procedure <b>$r->sph_code</b> - run inside ";
		return $php;
	} else {
		return '';
	}

}

function nuSQL($c) {

	$s						= "SELECT sse_sql FROM zzzzsys_select WHERE sse_code = ?";
	$t						= nuRunQuery($s, [$c]);

	if (db_num_rows($t) > 0) {	// SQL description exists

		$r					= db_fetch_object($t);
		return	nuReplaceHashVariables($r->sse_sql);

	}

	return "";

}

function nuExceptionHandler($e, $code){

	$ce		= nuObjKey($_POST,'nuProcedureEval');
	$se		= nuObjKey($_POST,'nuSystemEval');

	nuDisplayError("$ce $se<br>");
	nuDisplayError($e->getFile());
	nuDisplayError('<i>' . $e->getMessage() . '</i>');
	nuDisplayError('<br><b><i>Traced from...</i></b><br>');

	$a		= $e->getTrace();
	$t		= array_reverse($a);

	$count = count($t);
	for($i = 0 ; $i < $count ; $i++){

		$m	= '(line:<i>' . $t[$i]['line'] . '</i>) ' . $t[$i]['file'] . ' <b> - ' . $t[$i]['function'] . '<b>';

		nuDisplayError($m . '<br>');

	}

}

function nuEvalMessage($phpid, $code){

	$i			= explode('_', $phpid);

	if(count($i) == 1){
		return "Procedure <b>$code</b>";
	}

	if($i[1] != 'AB'){

		$event	= nuEventName($i[1]);
		$s		= "SELECT sfo_code FROM zzzzsys_form WHERE zzzzsys_form_id = ?	";
		$t		= nuRunQuery($s, [$i[0]]);
		$O		= db_fetch_object($t);

		return "<i>$event</i> of Form <b>$O->sfo_code</b>";

	}

	$s			= "SELECT sob_all_id, sfo_code FROM zzzzsys_object JOIN zzzzsys_form ON zzzzsys_form_id = sob_all_zzzzsys_form_id	WHERE zzzzsys_object_id = ?	";
	$t			= nuRunQuery($s, [$i[0]]);
	$O			= db_fetch_object($t);

	return "<i>Before Browse</i> of Object <b>$O->sob_all_id</b> on Form <b>$O->sfo_code</b>";

}

function nuRunSystemUpdate(){

	if (nuDemo()) return;

	$i	= nuID();
	nuSetJSONData($i, 'valid');

	return $i;

}

function nuGetFonts(){

//	$dir	= "fonts/";
	$dir	= "tfpdf/font/unifont/";
	$a		= [];

	if (is_dir($dir)){	// Open a directory, and read its contents

		if ($dh = opendir($dir)){

			while (($file = readdir($dh)) !== false){

				$b = explode('.', $file);
				if($b[1] == 'ttf'){
					$f		= explode('.', $file);
					$a[]	= $f[0];
				}

			}

			closedir($dh);

		}

	}

	return $a;

}

function nuIsValidEmail($email){
	return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function nuSendEmail($args_to, $from_email = '', $from_name = '', $body = '', $subject = '', $attachments = [], $html = false, $cc = '', $bcc = '', $reply_to = [] , $priority = '', $smtp_options = []) {

	if (is_array($args_to) && strnatcmp(phpversion(),'7.1.0') >= 0) {				// Prior to PHP 7.1, this function only worked on numerical arrays.

		$defaults = [
			'to' => '',
			'from_email' => '',
			'from_name' => '',
			'cc' => '',
			'bcc' => '',
			'body' => '',
			'subject' => 'test',
			'reply_to' => [] ,
			'attachments' => [] ,
			'html' => true,
			'priority' => '',
			'smtp_options' => []
		];

		$args = array_merge($defaults, array_intersect_key($args_to, $defaults));
		list($to, $from_email, $from_name, $cc, $bcc, $body, $subject, $reply_to, $attachments, $html, $priority, $smtp_options) = array_values($args);

	}
	else {
		$to = $args_to;
	}

	$to_list = explode(',', $to);
	$cc_list = explode(',', $cc);
	$bcc_list = explode(',', $bcc);

	return nuEmail($to_list, $from_email, $from_name, $body, $subject, $attachments, $html, $cc_list, $bcc_list, $reply_to, "0", "SMTP", $priority, $smtp_options);

}

function nuUser($id = null){

	$s	= "
		SELECT *
		FROM zzzzsys_user
		WHERE zzzzsys_user_id = ?
	";

	$t	= nuHash();
	$t	= nuRunQuery($s, [$id == null ? $t['USER_ID'] : $id]);

	return db_fetch_object($t);

}

function db_setup(){

	static $setup;

	if (empty($setup)) {													//check if setup has already been called

		$s					= "
								SELECT
									zzzzsys_setup.*,
									zzzzsys_timezone.stz_timezone AS set_timezone
								FROM zzzzsys_setup
								LEFT JOIN zzzzsys_timezone ON zzzzsys_timezone_id = set_zzzzsys_timezone_id
							";

		$rs					= nuRunQuery($s);								//get setup info from db
		$setup				= db_fetch_object($rs);
	}

	return $setup;

}


function nuUserLanguage($e = ''){

	$user_id	= nuObjKey(nuHash(),'USER_ID','');
	$admin		= nuObjKey(nuHash(),'GLOBAL_ACCESS','');

	if ($admin == '1') {
		$s = 'SELECT set_language as language FROM zzzzsys_setup WHERE zzzzsys_setup_id = 1';
		$t		= nuRunQuery($s);
	} else {
		$s = 'SELECT sus_language as language FROM zzzzsys_user WHERE zzzzsys_user_id = ?';
		$t		= nuRunQuery($s, [$user_id]);
	}

	$r			= db_fetch_object($t);

	$l			= isset($r->language) ? $r->language : '';

	return $l;

}

function nuTranslate($str /*optional arguments*/) {

	$language = nuUserLanguage();

	if (!empty($language)) {

		$query = "
					SELECT trl_translation
					FROM zzzzsys_translate
					WHERE trl_language = ?
					AND trl_english = ?
					ORDER BY trl_english, IF(zzzzsys_translate_id like 'nu%', 1, 0)

		";

		$stmt = nuRunQuery($query, [$language, $str]);
		$str = db_num_rows($stmt) == 0 ? $str : db_fetch_object($stmt)->trl_translation;

	}

	if (func_num_args() > 1 && nuStringContains('%', $str)) {
		$args = func_get_args();
		array_shift($args);
		$str = nuFormatVarArgs($str, $args);
	}

	return $str;

}

function nuFormatVarArgs($format, $values) {

	// Check if there are custom placeholders in the format string
	if (!preg_match('/%s(\d+)/', $format)) {
		return vsprintf($format, $values);
	}

	// Extract placeholder names from the format string
	preg_match_all('/%s(\d+)/', $format, $matches);

	// Create an array for the ordered values
	$ordered_values = [];

	// Loop through the placeholder names and fill the ordered values array
	foreach ($matches[1] as $placeholder_number) {
		$index = (int)$placeholder_number - 1; // Convert to zero-based index
		if (isset($values[$index])) {
			$ordered_values[] = $values[$index];
		}
	}

	// Replace the custom placeholders with standard %s placeholders
	$new_format = preg_replace('/%s(\d+)/', '%s', $format);

	// Use vsprintf with the new format string and ordered values array
	return vsprintf($new_format, $ordered_values);

}


function nuToCSV($table, $file, $d){

	$T = nuRunQuery("SELECT * FROM `$table`");
	$a = [];
	$c = db_field_names($table);

	while($r = db_fetch_row($T)){
		$a[] = $r;
	}

	header('Content-Type: application/excel');
	header('Content-Encoding: UTF-8');
	header('Content-Disposition: attachment; filename="' . $file . '"');

	$fp = fopen('php://output', 'w');

	fputcsv($fp, $c, chr($d));

	$count = count($a);
	for($i = 0 ; $i < $count ; $i++) {
		fputcsv($fp, $a[$i], chr($d));
	}

	fclose($fp);

}

function nuFromCSV($file, $table, $d, $delete){

	if(in_array($table,nuListTables())){
		print '<br>&nbsp;&nbsp;<br>' . nuTranslate("This tablename has already been used") . " (<b>$table</b>)";
		return;
	}

	ini_set('auto_detect_line_endings', true);

	$a = [];
	$w = [];
	$c = [];
	$h = fopen('../temp/' . $file, "r");
	$id = $table . '_id';

	if(empty($h) === false) {

		while(($data = fgetcsv($h, 0, chr($d))) !== false){

			if(count($a) == 0){
				array_unshift($data, $id);
			}else{
				array_unshift($data, nuID());
			}

			$a[] = $data;
		}

		$count = count($a);
		for($I = 1 ; $I < $count ; $I++){

			$countI = count($a[$I]);
			for($i = 0 ; $i < $countI ; $i++){

				if(isset($w[$i])){
					$w[$i] = max($w[$i], strlen($a[$I][$i]));
				}else{
					$w[] = 0;
				}

			}

		}

		fclose($h);

	}

	$columns = [];
	$rows = [];

	$count = count($w);
	for($i = 0 ; $i < $count ; $i++){

		$name = $a[0][$i];
		$size = $w[$i];
		$columns[] = '`' . $name . '`';

		if($size > 3000){
			$c[] = "`$name` TEXT DEFAULT NULL";
		}else{
			$c[] = "`$name` VARCHAR($size) DEFAULT NULL";
		}

	}

	nuRunQuery("CREATE TABLE `$table` (" . implode(',',$c) . ") CHARSET=utf8;");

	if(!in_array($table, nuListTables())){

		print "<br>" . "&nbsp;&nbsp;" . nuTranslate("Could not create table") . "&nbsp;<b>$table</b>";
		return;

	}

	$s1 = "INSERT INTO `$table` (" . implode(',',$columns) . ") VALUES " ;

	$count = count($a);
	for($I = 1 ; $I < $count ; $I++){

		$values = [];

		$countI = count($a[$I]);
		for($i = 0 ; $i < $countI ; $i++){
			$values[] = '"' . $a[$I][$i] . '"';
		}

		$rows[] = '(' . implode(',',$values) . ")\n";

	}

	nuRunQuery($s1 . implode(',',$rows));

	nuRunQuery("ALTER TABLE `$table` ADD PRIMARY KEY(`$id`);");

	if ($delete == '1') unlink('../temp/' . $file);

	print "<br>" . "&nbsp;&nbsp;" . nuTranslate("A table called") . "&nbsp;<b>$table</b>&nbsp;" . nuTranslate("has been created in the database");

}

function nuGetCSVDelimiterFromValue($value) {
	if ($value == 44) {
		return ",";
	} elseif ($value == 9) {
		return "\t"; // Tab character
	} elseif ($value == 59) {
		return ";";
	} else {
		return ","; // default
	}
}

function nuImportUsersFromCSV($csvfile, $fieldseparator, $lineseparator) {

	global $DBCharset, $DBPort;

	$fieldseparator = nuGetCSVDelimiterFromValue($fieldseparator);

	if(!file_exists($csvfile)) {
		 echo nuTranslate("File not found") . "($csvfile). ". nuTranslate("Make sure the file exists").".";
		 return;
	}

	$db = nuRunQuery('');
	$pdo = new PDO("mysql:host=$db[0];dbname=$db[1];charset=$DBCharset;port=$DBPort", $db[2], $db[3], [
		PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES $DBCharset", PDO::MYSQL_ATTR_LOCAL_INFILE => true
	]);

	// Open and read the CSV file
	if (($handle = fopen($csvfile, 'r')) !== false) {
		$pdo->beginTransaction();

		try {

			 // Skip the first row (header)
			fgetcsv($handle);
				
			// Prepare the SQL statement
			$insert = "INSERT INTO zzzzsys_user (zzzzsys_user_id, sus_zzzzsys_access_id, sus_language, sus_name, sus_code, sus_position, sus_department, sus_team, sus_email, sus_additional1, sus_additional2, sus_login_name, sus_login_password, sus_expires_on, sus_accessibility_features, sus_json) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

			$stmt = $pdo->prepare("$insert");

			// Process each CSV row
			$affectedRows = 0;
			while (($data = fgetcsv($handle, 0, $fieldseparator)) !== false) {

				$data[0]	= nuID();						// Replace zzzzsys_user_id with unique id.
				$data[12]	= nuPasswordHash($data[12]);	// Encrypt password

				$data = array_map(function ($value) {
					return ($value === "NULL") ? null : $value;
				}, $data);

				// Bind CSV data to the prepared statement
				$stmt->execute($data);
				$affectedRows++;
			}

			$pdo->commit();
			echo nuTranslate("Loaded a total of $affectedRows records from this csv file.\n");
		} catch (PDOException $e) {
			$pdo->rollBack();
			echo "Error: " . $e->getMessage();
		}

		fclose($handle);
		
	} else {
		echo nuTranslate('Failed to open the CSV-file');
	}

}

function nuListTables(){

	$a	= [];
	$t	= nuRunQuery("SHOW TABLES");

	while($r = db_fetch_row($t)){
		$a[] = $r[0];
	}

	return $a;

}

function nuBuildCurrencyFormats(){

	$t = nuRunQuery("SHOW COLUMNS FROM zzzzsys_format LIKE 'srm_currency'");

	if(db_num_rows($t) == 0){
		nuRunQuery("ALTER TABLE zzzzsys_format ADD srm_currency VARCHAR(25) NULL DEFAULT NULL AFTER srm_format");
	}

	$s = "SELECT zzzzsys_format_id, srm_format FROM zzzzsys_format WHERE srm_type = 'Number' AND ISNULL(srm_currency)";
	$t = nuRunQuery($s);

	while($r = db_fetch_object($t)){

		$e			= explode(' ', $r->srm_format);
		$si			= $e[0];										//-- sign
		$se			= $e[1][1] == '0' ? '' : $e[1][1];				//-- separator
		$de			= $e[1][1] == '0' ? $e[1][4] : $e[1][5];		//-- decimal point

		if($de == ''){
			$ex		= $e[1];
		}else{
			$ex		= explode($de, $e[1]);
		}
		$dp			= strlen($ex[1]);								//-- decimal places
		$js			= json_encode([$si, $se, $de, $dp], JSON_UNESCAPED_UNICODE);

		$s			= "
						UPDATE zzzzsys_format
						SET srm_currency = ?
						WHERE zzzzsys_format_id = ?
						";

		nuRunQuery($s, [$js, $r->zzzzsys_format_id]);

		$a[]		= ['N|'. $r->srm_format, $js];

	}

	$t = nuRunQuery("SELECT srm_format, srm_currency FROM zzzzsys_format WHERE srm_type = 'Number'");
	$a = [];
	while($r = db_fetch_object($t)){
		$a[]		= ['N|'. nuTrim($r->srm_format), $r->srm_currency];
	}

	return $a;

}

function nuGetURLParams() {
	return $_SESSION['nubuilder_session_data']['URL_PARAMS'];
}

function nuGetHttpOrigin() {
	if (array_key_exists('HTTP_ORIGIN', $_SERVER)) {
		$origin = $_SERVER['HTTP_ORIGIN'];
	}
	else if (array_key_exists('HTTP_REFERER', $_SERVER)) {
		$origin = $_SERVER['HTTP_REFERER'];
	}
	else {
		$origin = $_SERVER['REMOTE_ADDR'];
	}
	return $origin;
}

function nuGetRecordURL($origin = null, $subFolder = null, $homepageId = null, $formId = null) {

	$homepageId = $homepageId ? '&h='. $homepageId : '';
	$origin = $origin ? $origin : nuGetHttpOrigin();

	if (!$formId) {
		$hash = nuHash();
		$formId = $hash['form_id'] == '' ? $hash['FORM_ID'] : $hash['form_id'];
	}

	$recordIdL = nuReplaceHashVariables('#record_id#');
	$recordIdC = nuReplaceHashVariables('#RECORD_ID#');
	$recordId = $recordIdL && $recordIdL != '-1'  ? $recordIdL : $recordIdC;

	return $origin. $subFolder . '/index.php?f=' . $formId . '&r=' . $recordId . $homepageId;

}

function hashCookieNotSetOrEmpty($h) {
	return (preg_match('/\#(.*)\#/', $h) || nuTrim($h) == "");
}

function nuTranslateWriteSQL($f, $row, $counter, $total) {

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

function nuTranslateGenerateFile($l, $table = 'zzzzsys_translate') {

	$s = "SELECT * FROM `$table` WHERE trl_language = ? ORDER BY `trl_language`, trl_english";
	$t = nuRunQuery($s, [$l]);

	$total = db_num_rows($t);
	if ($total > 0) {

		$counter = 0;

		$f = fopen(__DIR__ . "/languages/" . $l . '.sql', "w+") or die("Unable to open the file " . $l);
		while ($row = db_fetch_array($t)) {

			$id = $row['zzzzsys_translate_id'];
			if (substr($id, 0, 2) != "nu") {
				$row['zzzzsys_translate_id'] = 'nu' . $id;
			}

			nuTranslateWriteSQL($f, $row, $counter, $total);

			$counter++;

		}

		fclose($f);
	}

}

function nuTranslateExport($l = '', $table = 'zzzzsys_translate') {

	if ($l == '') {

		$s = "SELECT DISTINCT trl_language FROM `$table` ORDER BY `trl_language`";
		$t = nuRunQuery($s);
		while ($row = db_fetch_object($t)) {
			nuTranslateGenerateFile($row->trl_language, $table);
		}

	} else {
		nuTranslateGenerateFile($l, $table);
	}
}

function nuStringContains($needle, $haystack, $ignoreCase = false) {

	if ($haystack == null) return false;

	if ($ignoreCase == true) {
		return stripos($haystack, $needle) !== false;
	} else {
		return strpos($haystack, $needle) !== false;
	}
}

function nuStringStartsWith($needle, $haystack, $ignoreCase = false) {

	if ($haystack == null) return false;

	if ($ignoreCase == true) {
		return stripos($haystack, $needle) === 0;
	} else {
		return strpos($haystack, $needle) === 0;
	}

}

function nuStringEndsWith($needle, $haystack, $ignoreCase = false) {

	if ($haystack == null) return false;

	if ($ignoreCase == true) {
		return stripos($haystack, $needle) === strlen($haystack) - strlen($needle);
	} else {
		return strpos($haystack, $needle) === strlen($haystack) - strlen($needle);
	}

}

function nuStringLeft($str, $length) {
	 return substr($str, 0, $length);
}

function nuStringRight($str, $length) {
	 return substr($str, -$length);
}

function nuStringAddTrailingCharacter($str, $char = "/") {

	if(substr($str, -1) != $char) {
		$str .= $char;
	}

	return $str;

}

function nuGlobalAccess($post = false) {

	if ($post) return $_POST['nuHash']['GLOBAL_ACCESS'] == '1';
	return nuObjKey(nuHash(),'GLOBAL_ACCESS','') == '1';

}

function nuFormatDate($d, $format){

	if (nuTrim($d) == "") return "";

	$date = DateTime::createFromFormat('Y-m-d', $d);
	return $date->format($format);

}

function nuFormatDateTime($d, $format){

	if (nuTrim($d) == "") return "";

	$date = DateTime::createFromFormat('Y-m-d H:i:s', $d);
	return $date->format($format);

}

function nuGetProperties() {

	$a = nuObjKey($_POST, 'nuHash', null);
	if ($a != null) {

		$q = "SELECT sss_hashcookies FROM zzzzsys_session WHERE zzzzsys_session_id = ? ";
		$t = nuRunQuery($q, [$_SESSION['nubuilder_session_data']['SESSION_ID']]);
		$r = db_fetch_object($t);

		if (isset($r->sss_hashcookies)) {
			$j = nuJsonDecode($r->sss_hashcookies, true);
			if (is_array($j)) {
				$a = array_merge($j, $a);
			}
		}
	}

	return $a;

}

function nuGetProperty($p, $a = null) {

	if ($a == null) {
		$a = nuGetProperties();
	}

	return array_key_exists($p, $a) ? $a[$p] : null;

}

function nuSetProperty($i, $nj, $global = false) {

	if ($global) {
		$s = "SELECT IFNULL(sss_hashcookies,'') AS sss_hashcookies FROM zzzzsys_session WHERE zzzzsys_session_id = ? ";
		$t = nuRunQuery($s, [$_SESSION['nubuilder_session_data']['SESSION_ID']]);

		if (db_num_rows($t) == 1) {
			$r = db_fetch_object($t);
			$j = nuJsonDecode($r->sss_hashcookies, true);

			$j[$i] = $nj;

			$J = json_encode($j);
			$s = "UPDATE zzzzsys_session SET sss_hashcookies = ? WHERE zzzzsys_session_id = ? ";
			$t = nuRunQuery($s, [$J, $_SESSION['nubuilder_session_data']['SESSION_ID']]);
		}
	} else {
		$_POST['nuHash'][$i] = $nj;
	}

}

function nuGetGlobalProperties() {

	$a = [];
	$q = "SELECT sss_hashcookies FROM zzzzsys_session WHERE zzzzsys_session_id = ? ";
	$t = nuRunQuery($q, [$_SESSION['nubuilder_session_data']['SESSION_ID']]);
	$r = db_fetch_object($t);

	if (isset($r->sss_hashcookies)) {
		$j = nuJsonDecode($r->sss_hashcookies, true);
		if (is_array($j)) {
			$a = array_merge($j, $a);
		}
	}

	return $a;

}

function nuSetGlobalPropertiesJS() {

	$gp = nuGetGlobalProperties();
	$js = '';

	foreach ($gp as $property => $value) {
		$js .= "nuSetProperty('$property', '" . addslashes($value ?? '') . "');\n";
	}
	if ($js !== '') {
		nuAddJavaScript($js, false, true);
	}

}
// nuAddToHashCookies: replaced by nuSetProperty. May be removed in the future
function nuAddToHashCookies($i, $nj, $global = false){
	nuSetProperty($i, $nj, $global);
}

function nuDeleteFiles($file_list = []) {
	if ( !is_array($file_list) || empty($file_list())) {
			return;
	}
	if ( nuIsArrayAssociative($file_list) ) {
		foreach($file_list as $filename=>$filesource) {
			@unlink($filesource);
		}
	} else {
		foreach ($file_list as $file) {
			@unlink($file);
		}
	}
}

function nuIsArrayAssociative($arr) {
	return array_key_exists('0',$arr) ? false : true;
}

function nuDemo($showError = true) {

	if($_SESSION['nubuilder_session_data']['IS_DEMO']){
		if ($showError) nuDisplayError(nuTranslate('Not available in the Demo')."..");
		return true;
	}

	return false;

}

function nuIsMobile() {
	return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
}

function nuSanitizeFilename($file) {

	$file = mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $file);
	return mb_ereg_replace("([\.]{2,})", '', $file);

}

function nuGetEmailTemplateData($code, $language = '', $group = '') {

	$sql = "
			SELECT
				`zzzzsys_email_template_id`,
				`emt_form_id`,
				`emt_group`,
				`emt_language`,
				`emt_description`,
				`emt_code`,
				`emt_body`,
				`emt_subject`,
				`emt_to`,
				`emt_cc`,
				`emt_bcc`
			FROM
				`zzzzsys_email_template`
			WHERE 
				`emt_code` = ? 
				AND IFNULL(`emt_language`,'') = ?
				AND IFNULL(`emt_group`,'') = ?
			LIMIT 1	
		";

	$qry = nuRunQuery($sql, [$code, $language, $group]);

	if (db_num_rows($qry) == 0) {
		return false;
	}

	$row = db_fetch_object($qry);

	return [
		"description" => $row->emt_description,
		"body" => $row->emt_body,
		"subject" => $row->emt_subject,
		"to" => $row->emt_to,
		"group" => $row->emt_group,
		"code" => $row->emt_code,
		"form_id" => $row->emt_form_id,
		"cc" => $row->emt_cc,
		"bcc" => $row->emt_bcc,
		"language" => $row->emt_language,
		"id" => $row->zzzzsys_email_template_id
	];

}

function nuSendEmailFromTemplate($template) {

	$params = [
		'to' => $template['to'],
		'cc' => $template['cc'],
		'bcc' => $template['bcc'],
		'body' => nl2br($template['body']),
		'subject' => $template['subject']
	];

	foreach ($params as $key => $value) {
		$params[$key] = nuReplaceHashVariables($value);
	}

	return nuSendEmail($params);

}

function nuIncludeConfigPHPFiles() {
	
	global $nuConfigIncludePHP;

	if (isset($nuConfigIncludePHP) && $nuConfigIncludePHP != '') {
		if (!is_array($nuConfigIncludePHP)) {
			require_once($nuConfigIncludePHP);
		} else {
			foreach ($nuConfigIncludePHP as $file) {
				require_once($file);
			}
		}
	}

}

?>
