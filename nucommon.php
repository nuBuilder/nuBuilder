<?php

error_reporting( error_reporting() & ~E_NOTICE );

require_once('nuchoosesetup.php');
require_once('nubuilders.php'); 
require_once('nuemailer.php');
require_once dirname(__FILE__) . '/nusqlclass.php';
require_once dirname(__FILE__) . '/nusearchclass.php';

set_time_limit(0);
mb_internal_encoding('UTF-8');

$GLOBALS['nuSetup']			= db_setup();
$setup					= $GLOBALS['nuSetup'];                                   //--  setup php code just used for this database

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


function nuTT(){

	$fn	= '___nu'.uniqid('1').'___';
	
	return $fn;                                                         //--create a unique name for a Temp Table
    
}


function nuErrorFound(){
    
    if(isset($GLOBALS['ERRORS'])){
        return count($GLOBALS['ERRORS']) > 0;
    }else{
        return false;
    }
    
}



class nuSqlString{

    public  $from         = '';
    public  $where        = '';
    public  $groupBy      = '';
    public  $having       = '';
    public  $orderBy      = '';
    public  $fields       = array();
    public  $Dselect      = '';
    public  $Dfrom        = '';
    public  $Dwhere       = '';
    public  $DgroupBy     = '';
    public  $Dhaving      = '';
    public  $DorderBy     = '';
    public  $Dfields      = array();
    public  $SQL          = '';

    function __construct($sql){

        $sql              = str_replace(chr(13), ' ', $sql);//----remove carrige returns
        $sql              = str_replace(chr(10), ' ', $sql);//----remove line feeds

        $select_string    = $sql;
        $from_string      = stristr($sql, ' from ');
        $where_string     = stristr($sql, ' where ');
        $groupBy_string   = stristr($sql, ' group by ');
        $having_string    = stristr($sql, ' having ');
        $orderBy_string   = stristr($sql, ' order by ');

        $from             = str_replace($where_string,   '', $from_string);
        $from             = str_replace($groupBy_string, '', $from);
        $from             = str_replace($having_string,  '', $from);
        $from             = str_replace($orderBy_string, '', $from);
        
        $where            = str_replace($groupBy_string, '', $where_string);
        $where            = str_replace($having_string,  '', $where);
        $where            = str_replace($orderBy_string, '', $where);
        
        $groupBy          = str_replace($having_string,  '', $groupBy_string);
        $groupBy          = str_replace($orderBy_string, '', $groupBy);
        
        $having           = str_replace($orderBy_string, '', $having_string);
        
        $orderBy          = $orderBy_string;
        $this->from       = $from;
        $this->where      = $where == '' ? 'WHERE 1' : $where;
        $this->groupBy    = $groupBy;
        $this->having     = $having;
        $this->orderBy    = $orderBy;

        $this->Dfrom      = $this->from;
        $this->Dwhere     = $this->where;
        $this->DgroupBy   = $this->groupBy;
        $this->Dhaving    = $this->having;
        $this->DorderBy   = $this->orderBy;

    	$this->buildSQL();
    }

    public function restoreDefault($pString){

    	if($pString == 'f'){$this->from      = $this->Dfrom;}
    	if($pString == 'w'){$this->where     = $this->Dwhere;}
    	if($pString == 'g'){$this->groupBy   = $this->DgroupBy;}
    	if($pString == 'h'){$this->having    = $this->Dhaving;}
    	if($pString == 'o'){$this->orderBy   = $this->DorderBy;}
    	$this->buildSQL();

    }

    public function getTableName(){

    	return trim(substr($this->from, 5));

    }

    public function setFrom($pString){

    	$this->from          = $pString; 
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

		$this->fields		= array();

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
	
	if(trim($s) == ''){
		return '';
	}else{
		if($noCR == 0){
			return "\n$s";
		}else{
			return $s;
		}
	}

}


function nuSetHashList($p){

	$fid		= addslashes($p['form_id']);
	$rid		= addslashes($p['record_id']);
	$r			= array();
	$A			= nuGetUserAccess();
	$s			= "SELECT * FROM zzzzsys_form WHERE zzzzsys_form_id = '$fid'";
	$t			= nuRunQuery($s);
	$R			= db_fetch_object($t);
	$h			= array();
	
	if($p['call_type'] == 'getform'){

		if(trim($R->sfo_table) != ''){
			
			$s		= "SELECt * FROM $R->sfo_table WHERE $R->sfo_primary_key = '$rid'";
			$t		= nuRunQuery($s);
			$f		= db_fetch_object($t);

			if(is_object($f) ){
				
				foreach ($f as $fld => $value ){								//-- This Edit Form's Object Values
					$r[$fld] = addslashes($value);
				}
				
			}
		}
		
	}

	foreach ($p as $key => $value){											//-- The 'opener' Form's properties

		if(gettype($value) == 'string'){
			$h[$key]			= addslashes($value);
		}else{
			$h[$key]			= '';
		}
		
	}

	if(isset($p['hash']) && gettype($p['hash']) == 'array'){
		
		foreach ($p['hash'] as $key => $value){								//-- The 'opener' Form's hash variables

			if(gettype($value) == 'string'){
				$h[$key]			= addslashes($value);
			}else{
				$h[$key]			= '';
			}
			
		}
		
	}
	
	$h['PREVIOUS_RECORD_ID']	= addslashes($rid);
	$h['RECORD_ID']				= addslashes($rid);
	$h['FORM_ID']				= addslashes($fid);
	$h['SUBFORM_ID']			= addslashes($_POST['nuSTATE']['object_id']);
	$h['ID']					= addslashes($_POST['nuSTATE']['primary_key']);
	$h['CODE']					= addslashes($_POST['nuSTATE']['code']);
	
	return array_merge($h, $r, $A);

}


function nuRunReport($report_id){
	
	$id									= nuID();
	$s									= "SELECT * FROM zzzzsys_report WHERE sre_code = '$report_id'";
	$t									= nuRunQuery($s);
	$ob									= db_fetch_object($t);
	$_POST['nuHash']['code']			= $ob->sre_code;
	$_POST['nuHash']['description']		= $ob->sre_description;
	unset($_POST['nuHash']['pages']);
	$_POST['nuHash']['sre_layout']		= nuReplaceHashVariables($ob->sre_layout);
	$_POST['nuHash']['parentID']		= $ob->sre_zzzzsys_php_id;
	$_POST['nuHash']['nuInstall']		= '0';
	$j									= json_encode($_POST['nuHash']);

	nuSetJSONData($id, $j);
	
	return $id;
	
}


function nuInstall(){

	$id									= nuID();
	$s									= "SELECT * FROM zzzzsys_php WHERE sph_code = '$procedure_code'";
	$t									= nuRunQuery($s);
	$ob									= db_fetch_object($t);
	$_POST['nuHash']['code']			= $ob->sph_code;
	$_POST['nuHash']['description']		= $ob->sph_description;
	$_POST['nuHash']['parentID']		= $ob->zzzzsys_php_id;
	$_POST['nuHash']['nuInstall']		= '1';
	$j									= json_encode($_POST['nuHash']);
	


	nuSetJSONData($id, $j);
	
	return $id;
	
}

function nuAllowedActivities(){

	$t 	= nuRunQuery("SELECT sss_access FROM zzzzsys_session WHERE zzzzsys_session_id = ? ", array($_SESSION['nubuilder_session_data']['SESSION_ID']));
	$r 	= db_fetch_object($t);
	$a	= json_decode($r->sss_access);
	
	return $a;

}



function nuRunPHP($procedure_code){

	$aa									= nuAllowedActivities();
	$p 									= nuProcedureAccessList($aa);
	$id									= nuID();
	$s									= "SELECT * FROM zzzzsys_php WHERE sph_code = '$procedure_code'";
	$t									= nuRunQuery($s);
	$ob									= db_fetch_object($t);
	$_POST['nuHash']['code']			= $ob->sph_code;
	$_POST['nuHash']['description']		= $ob->sph_description;
	$_POST['nuHash']['parentID']		= $ob->zzzzsys_php_id;
	$j									= json_encode($_POST['nuHash']);

	if(!$_SESSION['nubuilder_session_data']['isGlobeadmin'] and !in_array($ob->zzzzsys_php_id, $p)){
		nuDisplayError("Access To Procedure Denied... ($procedure_code)");
	}

	nuSetJSONData($id, $j);
	
	return $id;
	
}


function nuRunPHPHidden($nuCode){

	$aa						= nuAllowedActivities();
	$p 						= nuProcedureAccessList($aa);

	$s						= "SELECT * FROM zzzzsys_php WHERE sph_code = ? ";
	$t						= nuRunQuery($s, [$nuCode]);
	$r						= db_fetch_object($t);

	if($_SESSION['nubuilder_session_data']['isGlobeadmin'] or in_array($r->zzzzsys_php_id, $p)){
		nuEval($r->zzzzsys_php_id);
	}else{
		nuDisplayError("Access To Procedure Denied... ($nuCode)");
	}

	$f						= new stdClass;
	$f->id					= 1;
	
	return $f;
}


function nuJavascriptCallback($js){
	$_POST['nuCallback']	= $js;
}



function nuSetJSONData($i, $nj){
	
	$s					= "SELECT * FROM zzzzsys_session WHERE zzzzsys_session_id = ? ";
	$t					= nuRunQuery($s, array($_SESSION['nubuilder_session_data']['SESSION_ID']));			 
	$r					= db_fetch_object($t);
	$j					= json_decode($r->sss_access, true);

	$j[$i]				= $nj;
	$J					= json_encode($j);
	
	$s					= "UPDATE zzzzsys_session SET sss_access = ? WHERE zzzzsys_session_id = ? ";
	$t					= nuRunQuery($s, array($J, $_SESSION['nubuilder_session_data']['SESSION_ID']));
	
}




function nuGetJSONData($i){
	
	$s					= "SELECT * FROM zzzzsys_session WHERE zzzzsys_session_id = ? ";
	$t					= nuRunQuery($s, array($_SESSION['nubuilder_session_data']['SESSION_ID']));			 
	$r					= db_fetch_object($t);

	$j					= json_decode($r->sss_access, true);

	return $j[$i];
	
}




function nuGetProcedure($i){
	
	$a		= array();
	$a[]	= $i;
	$s		= "

	SELECT sph_php 
	FROM zzzzsys_php
	WHERE zzzzsys_php_id = ?

	";
	$t		= nuRunQuery($s, $a);
	$r		= db_fetch_row($t);
	
	return $r[0];
	
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
	nuRunQuery($nuS, array($id, $j));

	return $id;
	
}


function nuReplaceHashVariables($s){

	$s		= trim($s);
	
	if($s == ''){
		return '';
	}
	$a 		= $_POST['nuHash'];

	if (!is_array($a)) {
		return $s;
	}

	foreach ($a as $k => $v) {
		if(!is_object ($a[$k])) {
			$s	= str_replace ('#' . $k . '#', $v, $s);
		}
	}

	return $s;

}


function hex2rgb($hexOrColor) {

    $hex   = ColorToHex($hexOrColor);
    $hex   = str_replace("#", "", $hex);

    if(strlen($hex) == 3) {
        $r = hexdec(substr($hex,0,1).substr($hex,0,1));
        $g = hexdec(substr($hex,1,1).substr($hex,1,1));
        $b = hexdec(substr($hex,2,1).substr($hex,2,1));
    } else {
        $r = hexdec(substr($hex,0,2));
        $g = hexdec(substr($hex,2,2));
        $b = hexdec(substr($hex,4,2));
    }
    $rgb   = array($r, $g, $b);

    return $rgb;

}


function ColorToHex($pColor){

    $vColor    = strtoupper($pColor);
   
    if($vColor =='ALICEBLUE'){return 'F0F8FF';}
    if($vColor == 'ANTIQUEWHITE'){return 'FAEBD7';}
    if($vColor == 'AQUA'){return '00FFFF';}
    if($vColor == 'AQUAMARINE'){return '7FFFD4';}
    if($vColor == 'AZURE'){return 'F0FFFF';}
    if($vColor == 'BEIGE'){return 'F5F5DC';}
    if($vColor == 'BISQUE'){return 'FFE4C4';}
    if($vColor == 'BLACK'){return '000000';}
    if($vColor == 'BLANCHEDALMOND'){return 'FFEBCD';}
    if($vColor == 'BLUE'){return '0000FF';}
    if($vColor == 'BLUEVIOLET'){return '8A2BE2';}
    if($vColor == 'BROWN'){return 'A52A2A';}
    if($vColor == 'BURLYWOOD'){return 'DEB887';}
    if($vColor == 'CADETBLUE'){return '5F9EA0';}
    if($vColor == 'CHARTREUSE'){return '7FFF00';}
    if($vColor == 'CHOCOLATE'){return 'D2691E';}
    if($vColor == 'CORAL'){return 'FF7F50';}
    if($vColor == 'CORNFLOWERBLUE'){return '6495ED';}
    if($vColor == 'CORNSILK'){return 'FFF8DC';}
    if($vColor == 'CRIMSON'){return 'DC143C';}
    if($vColor == 'CYAN'){return '00FFFF';}
    if($vColor == 'DARKBLUE'){return '00008B';}
    if($vColor == 'DARKCYAN'){return '008B8B';}
    if($vColor == 'DARKGOLDENROD'){return 'B8860B';}
    if($vColor == 'DARKGRAY'){return 'A9A9A9';}
    if($vColor == 'DARKGREY'){return 'A9A9A9';}
    if($vColor == 'DARKGREEN'){return '006400';}
    if($vColor == 'DARKKHAKI'){return 'BDB76B';}
    if($vColor == 'DARKMAGENTA'){return '8B008B';}
    if($vColor == 'DARKOLIVEGREEN'){return '556B2F';}
    if($vColor == 'DARKORANGE'){return 'FF8C00';}
    if($vColor == 'DARKORCHID'){return '9932CC';}
    if($vColor == 'DARKRED'){return '8B0000';}
    if($vColor == 'DARKSALMON'){return 'E9967A';}
    if($vColor == 'DARKSEAGREEN'){return '8FBC8F';}
    if($vColor == 'DARKSLATEBLUE'){return '483D8B';}
    if($vColor == 'DARKSLATEGRAY'){return '2F4F4F';}
    if($vColor == 'DARKSLATEGREY'){return '2F4F4F';}
    if($vColor == 'DARKTURQUOISE'){return '00CED1';}
    if($vColor == 'DARKVIOLET'){return '9400D3';}
    if($vColor == 'DEEPPINK'){return 'FF1493';}
    if($vColor == 'DEEPSKYBLUE'){return '00BFFF';}
    if($vColor == 'DIMGRAY'){return '696969';}
    if($vColor == 'DIMGREY'){return '696969';}
    if($vColor == 'DODGERBLUE'){return '1E90FF';}
    if($vColor == 'FIREBRICK'){return 'B22222';}
    if($vColor == 'FLORALWHITE'){return 'FFFAF0';}
    if($vColor == 'FORESTGREEN'){return '228B22';}
    if($vColor == 'FUCHSIA'){return 'FF00FF';}
    if($vColor == 'GAINSBORO'){return 'DCDCDC';}
    if($vColor == 'GHOSTWHITE'){return 'F8F8FF';}
    if($vColor == 'GOLD'){return 'FFD700';}
    if($vColor == 'GOLDENROD'){return 'DAA520';}
    if($vColor == 'GRAY'){return '808080';}
    if($vColor == 'GREY'){return '808080';}
    if($vColor == 'GREEN'){return '008000';}
    if($vColor == 'GREENYELLOW'){return 'ADFF2F';}
    if($vColor == 'HONEYDEW'){return 'F0FFF0';}
    if($vColor == 'HOTPINK'){return 'FF69B4';}
    if($vColor == 'INDIANRED'){return 'CD5C5C';}
    if($vColor == 'INDIGO'){return '4B0082';}
    if($vColor == 'IVORY'){return 'FFFFF0';}
    if($vColor == 'KHAKI'){return 'F0E68C';}
    if($vColor == 'LAVENDER'){return 'E6E6FA';}
    if($vColor == 'LAVENDERBLUSH'){return 'FFF0F5';}
    if($vColor == 'LAWNGREEN'){return '7CFC00';}
    if($vColor == 'LEMONCHIFFON'){return 'FFFACD';}
    if($vColor == 'LIGHTBLUE'){return 'ADD8E6';}
    if($vColor == 'LIGHTCORAL'){return 'F08080';}
    if($vColor == 'LIGHTCYAN'){return 'E0FFFF';}
    if($vColor == 'LIGHTGOLDENRODYELLOW'){return 'FAFAD2';}
    if($vColor == 'LIGHTGRAY'){return 'D3D3D3';}
    if($vColor == 'LIGHTGREY'){return 'D3D3D3';}
    if($vColor == 'LIGHTGREEN'){return '90EE90';}
    if($vColor == 'LIGHTPINK'){return 'FFB6C1';}
    if($vColor == 'LIGHTSALMON'){return 'FFA07A';}
    if($vColor == 'LIGHTSEAGREEN'){return '20B2AA';}
    if($vColor == 'LIGHTSKYBLUE'){return '87CEFA';}
    if($vColor == 'LIGHTSLATEGRAY'){return '778899';}
    if($vColor == 'LIGHTSLATEGREY'){return '778899';}
    if($vColor == 'LIGHTSTEELBLUE'){return 'B0C4DE';}
    if($vColor == 'LIGHTYELLOW'){return 'FFFFE0';}
    if($vColor == 'LIME'){return '00FF00';}
    if($vColor == 'LIMEGREEN'){return '32CD32';}
    if($vColor == 'LINEN'){return 'FAF0E6';}
    if($vColor == 'MAGENTA'){return 'FF00FF';}
    if($vColor == 'MAROON'){return '800000';}
    if($vColor == 'MEDIUMAQUAMARINE'){return '66CDAA';}
    if($vColor == 'MEDIUMBLUE'){return '0000CD';}
    if($vColor == 'MEDIUMORCHID'){return 'BA55D3';}
    if($vColor == 'MEDIUMPURPLE'){return '9370D8';}
    if($vColor == 'MEDIUMSEAGREEN'){return '3CB371';}
    if($vColor == 'MEDIUMSLATEBLUE'){return '7B68EE';}
    if($vColor == 'MEDIUMSPRINGGREEN'){return '00FA9A';}
    if($vColor == 'MEDIUMTURQUOISE'){return '48D1CC';}
    if($vColor == 'MEDIUMVIOLETRED'){return 'C71585';}
    if($vColor == 'MIDNIGHTBLUE'){return '191970';}
    if($vColor == 'MINTCREAM'){return 'F5FFFA';}
    if($vColor == 'MISTYROSE'){return 'FFE4E1';}
    if($vColor == 'MOCCASIN'){return 'FFE4B5';}
    if($vColor == 'NAVAJOWHITE'){return 'FFDEAD';}
    if($vColor == 'NAVY'){return '000080';}
    if($vColor == 'OLDLACE'){return 'FDF5E6';}
    if($vColor == 'OLIVE'){return '808000';}
    if($vColor == 'OLIVEDRAB'){return '6B8E23';}
    if($vColor == 'ORANGE'){return 'FFA500';}
    if($vColor == 'ORANGERED'){return 'FF4500';}
    if($vColor == 'ORCHID'){return 'DA70D6';}
    if($vColor == 'PALEGOLDENROD'){return 'EEE8AA';}
    if($vColor == 'PALEGREEN'){return '98FB98';}
    if($vColor == 'PALETURQUOISE'){return 'AFEEEE';}
    if($vColor == 'PALEVIOLETRED'){return 'D87093';}
    if($vColor == 'PAPAYAWHIP'){return 'FFEFD5';}
    if($vColor == 'PEACHPUFF'){return 'FFDAB9';}
    if($vColor == 'PERU'){return 'CD853F';}
    if($vColor == 'PINK'){return 'FFC0CB';}
    if($vColor == 'PLUM'){return 'DDA0DD';}
    if($vColor == 'POWDERBLUE'){return 'B0E0E6';}
    if($vColor == 'PURPLE'){return '800080';}
    if($vColor == 'RED'){return 'FF0000';}
    if($vColor == 'ROSYBROWN'){return 'BC8F8F';}
    if($vColor == 'ROYALBLUE'){return '4169E1';}
    if($vColor == 'SADDLEBROWN'){return '8B4513';}
    if($vColor == 'SALMON'){return 'FA8072';}
    if($vColor == 'SANDYBROWN'){return 'F4A460';}
    if($vColor == 'SEAGREEN'){return '2E8B57';}
    if($vColor == 'SEASHELL'){return 'FFF5EE';}
    if($vColor == 'SIENNA'){return 'A0522D';}
    if($vColor == 'SILVER'){return 'C0C0C0';}
    if($vColor == 'SKYBLUE'){return '87CEEB';}
    if($vColor == 'SLATEBLUE'){return '6A5ACD';}
    if($vColor == 'SLATEGRAY'){return '708090';}
    if($vColor == 'SLATEGREY'){return '708090';}
    if($vColor == 'SNOW'){return 'FFFAFA';}
    if($vColor == 'SPRINGGREEN'){return '00FF7F';}
    if($vColor == 'STEELBLUE'){return '4682B4';}
    if($vColor == 'TAN'){return 'D2B48C';}
    if($vColor == 'TEAL'){return '008080';}
    if($vColor == 'THISTLE'){return 'D8BFD8';}
    if($vColor == 'TOMATO'){return 'FF6347';}
    if($vColor == 'TURQUOISE'){return '40E0D0';}
    if($vColor == 'VIOLET'){return 'EE82EE';}
    if($vColor == 'WHEAT'){return 'F5DEB3';}
    if($vColor == 'WHITE'){return 'FFFFFF';}
    if($vColor == 'WHITESMOKE'){return 'F5F5F5';}
    if($vColor == 'YELLOW'){return 'FFFF00';}
    if($vColor == 'YELLOWGREEN'){return '9ACD32';}
    return $vColor;
}


function nuAddToHashList($J, $run){

    $hash               = array();
    $ignore             = array();
    $ignore[]           = 'sre_layout';
    $ignore[]           = 'slp_php';
    $ignore[]           = 'sre_php';

    foreach($J as $key => $v){                                           //-- add current hash variables
        
        if(!in_array($key, $ignore)){
            $hash['' . $key . '']     = $v;
        }
        
    }

    $d                  		= new DateTime();

    $hash['nu_date_time']		= $d->format('Y-m-d H:i:s');
    $hash['nu_date']			= $d->format('Y-m-d');
    $hash['nu_time']			= $d->format('H:i:s');
    $hash['nu_year']			= $d->format('Y');
    $hash['nu_month']    		= $d->format('m');
    $hash['nu_day'] 			= $d->format('d');
    $hash['nu_hour']			= $d->format('H');
    $hash['nu_minute']			= $d->format('i');
	
	if($run == 'report'){
		
		$hash['sre_layout']		= $J->sre_layout;
		$hash['slp_php']		= $J->slp_php;
		
	}
	
	if($run == 'php'){
		
		$hash['sph_php']		= $J->sph_php;
		
	}

    return $hash;

}


function nuGetUserAccess(){

	$A					= array();

	$s					= "SELECT * FROM zzzzsys_session WHERE zzzzsys_session_id = ? ";
	$t					= nuRunQuery($s, array($_SESSION['nubuilder_session_data']['SESSION_ID']));			 
	$r					= db_fetch_object($t);
	$j					= json_decode($r->sss_access);
	
	$A['USER_ID']				= $j->session->zzzzsys_user_id;
	$A['USER_GROUP_ID']			= $j->session->zzzzsys_access_id;
	$A['HOME_ID']				= $j->session->zzzzsys_form_id;
	$A['GLOBAL_ACCESS']			= $j->session->global_access;
	$A['ACCESS_LEVEL_CODE']		= $j->access_level_code;
	
	$f							= db_field_names('zzzzsys_session');
	$s							= time();

	//-- update session time
	
	if (in_array("sss_time", $f)){
		
		nuRunQuery("UPDATE zzzzsys_session SET sss_time = $s WHERE zzzzsys_session_id = ? ", array($_SESSION['nubuilder_session_data']['SESSION_ID']));
		nuRunQuery("DELETE FROM zzzzsys_session WHERE sss_time < $s - 18000");					//-- 5 hours
	}

	return $A;
	
}


function nuGetFormProperties($i){
	
	$t	= nuRunQuery("SELECT * FROM zzzzsys_form WHERE zzzzsys_form_id = ? ", array($i));
	
	return db_fetch_object($t);
	
}



function nuFormatList(){
	
	$f	= [['','']];
	$s	= "
		SELECT 
			CONCAT(LEFT(srm_type, 1), '|', TRIM(srm_format)) AS a, 
			srm_format AS b 
		FROM zzzzsys_format
		ORDER BY srm_type
	";
	
	$t 	= nuRunQuery($s);
	
	while($r = db_fetch_object($t)){
		$f[] = [$r->a, $r->b];
	}

	return json_encode($f);
	
}




function nuAddFormatting($v, $f){

	if($v == '' || $f == ''){return $v;}
	
	if($f[0] == 'N'){									//-- number  '456.789','N|€ 1,000.00'

		$f			= substr($f, 2);
		$e			= explode(' ', $f);
		$s			= $e[0];							//-- sign
		$n			= $e[1];							//-- number
		$p			= nuPunctuation($f);				//-- returns [comma, decimal]
		$c			= $p[0];							//-- comma
		$dp			= $p[1];							//-- decimal point
		$o			= explode('.', $v);
		
		if(count($o) == 1){$o[1] = '';}
		
		$d			= $o[1];							//-- decimal number

		if($dp == ''){
			$p		= 0;								//-- decimal places
		}else{
			
			$pos	= strpos($f, $dp);					//-- decimal places
			$p		= strlen(substr($f, $pos));
		}

		$h			= nuAddThousandSpaces($o[0], $c);
		
		$ss			= substr($s, 0,2);
		
		if($ss == '10' || $ss == '1,' || $ss == '1.'){		// no sign
			$s		= '';
		}else{
			$s		= $s . ' ';
		}
		
		if($p == 0){ 									//-- no decimal numbers even if it has a decimal place
			$m		= $s . $h;
		}else{
			
			$suf	= substr($d . str_repeat('0', 20), 0, $p - 1);
			$m		= $s . $h . $dp . $suf;
			
		}

		return $m;
	
	}
	
	if($f[0] == 'D'){	//-- date

		if($v == '0000-00-00' or $v == ''){return '';}
		
		$split	= explode(' ', $v);
		$d		= explode('-', $split[0]);
		$t		= explode(':', $split[1]);

		if($t[0] == ''){
			$t	= [0, 0, 0];
		}
		
		$o	 	= new DateTime();

		$o->setDate($d[0], $d[1], $d[2]);
		$o->setTime($t[0], $t[1], $t[2]);
		
		
		$s 		= '';
		
		$s 		= str_replace('pp', 	$o->format('a'), $f);
		$s 		= str_replace('PP', 	$o->format('A'), $s);
		$s 		= str_replace('yyyy',	$o->format('Y'), $s);
		$s 		= str_replace('yy',		$o->format('y'), $s);
		$s 		= str_replace('mmmm',	$o->format('F'), $s);
		$s 		= str_replace('mmm',	$o->format('M'), $s);
		$s 		= str_replace('mm',		$o->format('m'), $s);
		$s 		= str_replace('dddd',	$o->format('l'), $s);
		$s 		= str_replace('ddd',	$o->format('D'), $s);
		$s 		= str_replace('dd',		$o->format('d'), $s);
		$s 		= str_replace('hh',		$o->format('h'), $s);
		$s 		= str_replace('nn',		$o->format('i'), $s);
		$s 		= str_replace('ss', 	$o->format('s'), $s);
		
		return substr($s,2);
		
	}
	
	return $v;
	
}


function nuAddThousandSpaces($s, $c){

	$r			= strrev($s);
	$a			= str_split($r, 3);
	$n			= [];
	
	for($i = 0 ; $i < count($a) ; $i++){
		
		$n[]	= strrev($a[$i]);
		
		if($i < count($a) - 1){
			
			$n[]	= $c;
		
		}
		
	}
		

	$r			= array_reverse($n);
	
	return implode('', $r);
	
}



function nuPunctuation($f){

	$c			= '';
	$d			= '';
		
	if(strpos($f , '1,' ) !== false){
		$c		= ',';
	}

	if(strpos($f , '1.' ) !== false){
		$c		= '.';
	}

	if(strpos($f , '0,' ) !== false){
		$d		= ',';
	}

	if(strpos($f , '0.' ) !== false){
		$d		= '.';
	}

	return [$c, $d];
	
}


function nuTTList($id, $l){
	
	$t										= nuRunQuery('SELECT * FROM zzzzsys_object WHERE  sob_all_zzzzsys_form_id = ?' , [$l]);
	
	while($r = db_fetch_object($t)){						//-- add default empty hash variables
		$_POST['nuHash'][$r->sob_all_id]	= '';
	}
	
	$tt										= nuTT();
	$_POST['nuHash']['TABLE_ID']			= $tt;
	$_POST['nuHash']['RECORD_ID']			= '';
	
	nuBuildTempTable($id, $tt, 1);

	$f										= db_field_names($tt);
	$f[]									= 'KEEP EXACT HEIGHT';

	nuRunQuery("DROP TABLE $tt");
	
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
		$t			= nuRunQuery($s,[$id]);
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
		//$p			= addslashes($p);
		$tt			= addslashes($tt);

		$P			 = '$sql = "CREATE TABLE '.$tt.' '.$p.'";';
		$P			.= 'nuRunQuery($sql);';
		
		eval($P);
		
	}
	
}


function nuJSInclude($pfile){

    $timestamp 		= date("YmdHis", filemtime($pfile));                                         //-- Add timestamp so javascript changes are effective immediately
    print "<script src='$pfile?ts=$timestamp' type='text/javascript'></script>\n";
    
}

function nuCSSInclude($pfile){

    $timestamp 		= date("YmdHis", filemtime($pfile));                                         //-- Add timestamp so javascript changes are effective immediately
    print "<link rel='stylesheet' href='$pfile?ts=$timestamp' />\n";
    
}


function nuImageList($f){

	$a			= [];	
	$s			= "SELECT sfi_code FROM zzzzsys_file ORDER BY sfi_code";
	$t			= nuRunQuery($s);
	
	while($r = db_fetch_object($t)){
		$a[]	= 'Image:' . $r->sfi_code;
	}

	$c								= json_encode(array_merge($a, $f,['KEEP EXACT HEIGHT']));

	return $c . ";\n";
	
}



function nuCreateFile($j){

	if($j == ''){return '';}

	$id		= nuID();
	$f		= json_decode($j);
	$t		= explode('/',$f->type)[1];
	$file	= sys_get_temp_dir()."/$id." . $t;
	$h		= fopen($file , 'w');
	$d		= base64_decode($f->file);
	$p		= explode(';base64,', $d)[1];
	$data 	= base64_decode($p);
	
	fwrite($h, $data);
	fclose($h);
	
	return $file;
}


function nuHash(){
	return $_POST['nuHash'];
}


function nuBuildFormSchema(){

	$T				= nuRunQuery("SELECT * FROM zzzzsys_form ORDER BY sfo_code");
	$fs				= [];

	while($r = db_fetch_object($T)){
		
		$f 			= $r->zzzzsys_form_id;
		$a 			= array();
		$t 			= nuRunQuery("SELECT * FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = '$f' ORDER BY sob_all_id");
		
		while($r = db_fetch_object($t)){
			
			if(in_array($r->sob_all_type, array('input', 'lookup', 'select', 'textarea'))){
				$a[]= array($r->zzzzsys_object_id, $r->sob_all_id, $r->sob_all_label, $r->sob_all_type, $r->sob_input_type); 
			}
			
		}
		
		$fs[$f]		= $a;
		
	}

	return $fs;

}


function nuBuildTableSchema(){

	$a				= array();
	$t				= nuRunQuery("SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = DATABASE()");

	while($r = db_fetch_object($t)){
		
		$tn			= $r->table_name;
		$a[$tn] 	= array('names' => db_field_names($tn), 'types' => db_field_types($tn), 'primary_key' => db_primary_key($tn), 'valid' => 1);
		
	}
	
	return $a;

}



function nuBuildViewSchema(){

	$a				= array();
	$t				= nuRunQuery("SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'VIEW' AND table_schema = DATABASE()");

	while($r = db_fetch_object($t)){
		$a[]		= $r->table_name;
	}
	
	return $a;

}



function nuUpdateFormSchema(){

	$s 		= nuGetJSONData('clientFormSchema');
	
	if(is_null($s)){
		
		$s	= nuBuildFormSchema();
		nuSetJSONData('clientFormSchema', $s);
		
		return $s;
		
	}else{
		return [];
	}
	
}


function nuUpdateTableSchema($call_type){
	
	if($call_type == 'runhiddenphp' and nuHash()['form_code'] == 'nufflaunch'){
		
		nuSetJSONData('clientTableSchema', []);			//-- force updating Table Schema
		return;
		
	}

	$was	= nuGetJSONData('clientTableSchema');
	$is		= nuBuildTableSchema();
	
	if(is_null($was)){
		
		nuSetJSONData('clientTableSchema', $is);
		
		return $is;
		
	}else{
		
		if(json_encode($was) == json_encode($is)){
			return [];
		}else{
			
			nuSetJSONData('clientTableSchema', $is);
			return $is;
			
		}
		
	}
	
}



function nuListSystemTables(){

	$a				= array();
	$t				= nuRunQuery("SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = DATABASE()");

	while($r = db_fetch_object($t)){
		
		if(substr($r->table_name, 0, 8) == 'zzzzsys_'){
			$a[]	= $r->table_name;
		}
		
	}
	
	return $a;

}


function nuFontList(){

	$result         = array();
        $fonts          = array(['Helvetica','Helvetica'],['Courier','Courier'],['Times','Times'],['Symbol','Symbol']);
        $exclude        = array('..', '.',DIRECTORY_SEPARATOR);
        $folder         = __DIR__ . DIRECTORY_SEPARATOR . 'tcpdf' . DIRECTORY_SEPARATOR . 'fonts';
        $list           = scandir($folder);

        for ( $x=0; $x<count($list); $x++) {

                if ( !in_array($list[$x], $exclude) )  {

                        $item           = trim($folder . DIRECTORY_SEPARATOR . $list[$x]);

			if ( is_file($item) )  {
                        	$path_parts     = pathinfo($item);
                        	$font_name      = $path_parts['filename'];
                        	$font_name      = explode('.', $path_parts['filename'])[0];
                        	if ( !in_array($font_name, $result) )  {
                                	array_push($result, $font_name);
                        	}	
			}
                }
        }

        for ( $x=0; $x<count($result); $x++) {

                $element    = array();
                $element[0] = $result[$x];
                $element[1] = $result[$x];
                array_push($fonts, $element);
        }

	return json_encode($fonts);
}

function nuEventName($e){

	$event['BB']	    =  'Before Browse';
	$event['AB']	    =  'After Browse';
	$event['BE']    	=  'Before Edit';
	$event['BS']    	=  'Before Save';
	$event['AS']    	=  'After Save';
	$event['BD']    	=  'Before Delete';
	$event['AD']    	=  'After Delete';
	
	return $event[$e];
	
}



function nuEval($phpid){

	$s						= "SELECT * FROM zzzzsys_php WHERE zzzzsys_php_id = ? ";
	$t						= nuRunQuery($s, [$phpid]);
	$r						= db_fetch_object($t);
	
	if(trim($r->sph_php) == ''){return;}
	
	$code					= $r->sph_code;
	$php					= nuReplaceHashVariables($r->sph_php);
	$_POST['nuSystemEval']	= nuEvalMessage($phpid, $code);
	
	try{
		eval($php); 
	}catch(Throwable $e){
		nuExceptionHandler($e, $code);   
	}catch(Exception $e){
		nuExceptionHandler($e, $code);
	}

	$_POST['nuProcedureEval']	=  '';
	$_POST['nuSystemEval']	=  '';
	
}



function nuProcedure($c){

	$s							= "SELECT * FROM zzzzsys_php WHERE sph_code = ? ";
	$t							= nuRunQuery($s, [$c]);
	$r							= db_fetch_object($t);
	$php						= nuReplaceHashVariables($r->sph_php);
	$php						= "$php \n\n//--Added by nuProcedure()\n\n$"."_POST['nuProcedureEval'] = '';";
	$_POST['nuProcedureEval']	= "Procedure <b>$r->sph_code</b> - run inside ";
	
	return $php;
	
}


function nuExceptionHandler($e, $code){
	
	$ce		= $_POST['nuProcedureEval'];
	$se		= $_POST['nuSystemEval'];
	
	nuDisplayError("$ce $se<br>", "nuErrorPHP");
	nuDisplayError($e->getFile(), 'eval');
	nuDisplayError('<i>' . $e->getMessage() . '</i>', 'eval');
	nuDisplayError('<br><b><i>Traced from...</i></b><br>', 'nuErrorPHP');
	
	$a		= $e->getTrace();
	$t		= array_reverse($a);

	for($i = 0 ; $i < count($t) ; $i++){
		
		$m	= '(line:<i>' . $t[$i]['line'] . '</i>) ' . $t[$i]['file'] . ' <b> - ' . $t[$i]['function'] . '<b>';
		
		nuDisplayError($m . '<br>', 'eval');
		
	}
	
}


function nuEvalMessage($phpid, $code){
	
	$i			= explode('_', $phpid);
	
	if(count($i) == 1){
		return "Procedure <b>$code</b>";
	}
	
	if($i[1] != 'AB'){
		
		$event	= nuEventName($i[1]);
		$s		= "SELECT * FROM zzzzsys_form WHERE zzzzsys_form_id = ?	";
		$t		= nuRunQuery($s, [$i[0]]);
		$O		= db_fetch_object($t);
	
		return "<i>$event</i> of Form <b>$O->sfo_code</b>";
		
	}
		
	$s			= "SELECT * FROM zzzzsys_object JOIN zzzzsys_form ON zzzzsys_form_id = sob_all_zzzzsys_form_id	WHERE zzzzsys_object_id = ?	";
	$t			= nuRunQuery($s, [$i[0]]);
	$O			= db_fetch_object($t);
	
	return "<i>Before Browse</i> of Object <b>$O->sob_all_id</b> on Form <b>$O->sfo_code</b>";
	
}


function nuUpdateSystemIds(){

	nuUpdateObjectIds();
	nuUpdateTabIds();

	nuUpdateTableIds('zzzzsys_browse');
	nuUpdateTableIds('zzzzsys_event');
	nuUpdateTableIds('zzzzsys_file');
	nuUpdateTableIds('zzzzsys_translate');

}


function nuUpdateTabIds(){

	$s		= 'SELECT * FROM zzzzsys_tab WHERE zzzzsys_tab_id != "nufastforms"';
	$t		= nuRunQuery($s);
	
	while($r = db_fetch_object($t)){
		
		$i	= $r->zzzzsys_tab_id;
		$n	= nuID();
		
		$b	= "UPDATE zzzzsys_tab 		SET zzzzsys_tab_id = 'nu$n' 		WHERE zzzzsys_tab_id = ? ";
		$o	= "UPDATE zzzzsys_object 	SET sob_all_zzzzsys_tab_id = 'nu$n'	WHERE sob_all_zzzzsys_tab_id = ? ";
		
		nuRunQuery($o, [$i]);
		print "$o<br>";
		nuRunQuery($b, [$i]);
		print "$b<br>";
	}
	
}


function nuUpdateObjectIds(){

	$s		= 'SELECT * FROM zzzzsys_object';
	$t		= nuRunQuery($s);
	
	while($r = db_fetch_object($t)){
		
		$i	= $r->zzzzsys_object_id;
		$n	= nuID();
		$a	= $i . '_AB';
		$pid= $n . '_AB';
		
		$o	= "UPDATE zzzzsys_object 	SET zzzzsys_object_id = 'nu$n' 		WHERE sob_all_zzzzsys_form_id != 'nusample' AND zzzzsys_object_id = ? ";
		$e	= "UPDATE zzzzsys_event 	SET sev_zzzzsys_object_id = 'nu$n' 	WHERE sev_zzzzsys_object_id = ? ";
		$p	= "UPDATE zzzzsys_php 		SET zzzzsys_php_id = 'nu$pid' 		WHERE zzzzsys_php_id = ? ";
		
		nuRunQuery($o, [$i]);
		nuRunQuery($e, [$i]);
		nuRunQuery($p, [$a]);
		print "$o<br>";
	}
	
}


function nuUpdateTableIds($table){

	$id		= $table . '_id';
	$s		= "SELECT $id FROM $table";
	$t		= nuRunQuery($s);
		
	while($r = db_fetch_row($t)){
		
		$i	= $r[0];
		$n	= nuID();
		$u	= "UPDATE $table SET $id = 'nu$n' WHERE $id = '$i' ";
		
		nuRunQuery($u);
		
		print "$u<br>";
		
	}
	
}

function nuRunSystemUpdate(){
	
	
	if($_SESSION['IsDemo']){
		
		nuDisplayError('Not available in the Demo...');
		return;
	
	}
	
	$i					= nuID();
	
	nuSetJSONData($i, 'valid');
	
	return $i;
	
}


function nuGetFonts(){

//	$dir 	= "fonts/";
	$dir 	= "tfpdf/font/unifont/";
	$a		= [];

	if (is_dir($dir)){	// Open a directory, and read its contents
		
		if ($dh = opendir($dir)){
			
			while (($file = readdir($dh)) !== false){
				
				if(explode('.', $file)[1] == 'ttf'){
					$a[]	= explode('.', $file)[0];
				}
				
			}
		
			closedir($dh);
		
		}
		
	}
	
	return $a;
	
}

function nuSendEmail($to, $from, $fromname, $content, $subject, $filelist, $html = false, $cc = "", $bcc = "", $reply_to_addresses = array()) {

	// nuSendEmail function is being retired and replaced with nuSendEmail
	$to_list	= explode(',',$to);
	return nuEmail($to_list,$from,$fromname,$content,$subject,$filelist,$html,$reply_to_addresses);
}




function nuUser(){

	$s	= "
		SELECT *
		FROM zzzzsys_user
		WHERE zzzzsys_user_id = ?
	";
	
	$t	= nuRunQuery($s, [nuHash()['USER_ID']]);

	return db_fetch_object($t);

}



function db_setup(){
    
	static $setup;
	
    if (empty($setup)) {                                          			//check if setup has already been called
	
		$s					= "
								SELECT 
									zzzzsys_setup.*, 
									zzzzsys_timezone.stz_timezone AS set_timezone 
								FROM zzzzsys_setup 
								LEFT JOIN zzzzsys_timezone ON zzzzsys_timezone_id = set_zzzzsys_timezone_id
							";
		
		
		$rs					= nuRunQuery($s);						        //get setup info from db
		$setup				= db_fetch_object($rs);
	}
	
	// moved to nuchoosesetup.php SG 10/10/2018
	//$gcLifetime				= 60 * $setup->set_time_out_minutes;             //setup garbage collect timeouts
	//ini_set("session.gc_maxlifetime", $gcLifetime);
		
    return $setup;
	
}



function nuUserLanguage(){

	$user_id	= nuHash()['USER_ID'];
	$t 			= nuRunQuery('SELECT * FROM zzzzsys_user WHERE zzzzsys_user_id = ?', [$user_id]);
	$r 			= db_fetch_object($t);
	$l 			= $r->sus_language;

	return $l;
	
}


function nuTranslate($e){

        $l      = nuUserLanguage();
        $s      = "
                        SELECT *
                        FROM zzzzsys_translate
                        WHERE trl_language = ?
                        AND trl_english = ?

                ";

        $t      = nuRunQuery($s, [$l, $e]);
		$tr		= db_fetch_object($t)->trl_translation;

        return $tr == '' ? $e : $tr;

}


?>
