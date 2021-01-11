<?php


class nuSqlClass{

	public $STR			= '';
	public $OBJ			= '';

	function __construct($sql){

		$this->STR			= $sql;
		$S					= new PHPSQLParser($sql, true);
		$this->OBJ			= $S->parsed;

	}
	
	public function setMulitArray($n){
		
		if(!isset($this->OBJ[$n])){
			$this->OBJ[$n]		= array();
		}
		
	}
	
	public function removeSelectElements(){
		
		$w							= $this->OBJ['SELECT'];
		$this->OBJ['SELECT']		= array();
		return $w;
		
	}

	public function addSelectElement($be){
		
		$this->setMulitArray('SELECT');
		
		$c							= array();
		$c['expr_type']				= ExpressionType::CONSTANT;
		$c['base_expr']				= $be;
		
		$this->OBJ['SELECT'][] 		= $c;
		
		for($i = 0 ; $i < count($this->OBJ['SELECT']) ; $i++){
			$this->OBJ['SELECT'][$i]['delim'] = ',';
		}
		
		$this->OBJ['SELECT'][$i-1]['delim'] = '';
		
	}

	public function addWhereElement($be){
		
		
		if(!isset($this->OBJ['WHERE'])){
			$this->OBJ['WHERE']		= array();
		}
		
		$c							= array();
		$c['expr_type']				= ExpressionType::CONSTANT;
		$c['base_expr']				= $be;
		$c['sub_tree']				= false;
		$c['nubuilder']				= 1;
		
		$this->OBJ['WHERE'][] 		= $c;
		
	}


	public function addBracketsToWhere(){
		
		if(!isset($this->OBJ['WHERE'])){
			
			$this->OBJ['WHERE']		= array();
			return;
			
		}
		
		$bo							= array();
		$bo['expr_type']			= ExpressionType::CONSTANT;
		$bo['base_expr']			= '(';
		$bo['sub_tree']				= false;
		$bo['nubuilder']			= 1;
		
		$bc							= array();
		$bc['expr_type']			= ExpressionType::CONSTANT;
		$bc['base_expr']			= ')';
		$bc['sub_tree']				= false;
		$bc['nubuilder']			= 1;
		
		array_unshift($this->OBJ['WHERE'], $bo);
		
		$this->OBJ['WHERE'][]		= $bc; 
		
	}

	public function SQL(){

			$s						= new PHPSQLCreator($this->OBJ);
			
			return $s->created;
			
	}

}



//-- tests ----


function test111(){
	
	$s		= nus();
	
	$SQL 	= new nuSqlClass($s);

	$SQL->removeSelectElements();

	$SQL->addSelectElement('cus_name');
	$SQL->addSelectElement('cus_address');
	$SQL->addWhereElement("and cus_name = 'bob'");

	print $SQL->SQL() . '<br><br><br>';
	$SQL->addBracketsToWhere();
	print $SQL->SQL() . '<br><br><br>';
	$Q 		= new nuSqlClass($SQL->SQL());

	print $Q->SQL() . '<br><br><br>';
	
}



function nus(){

$s = "
SELECT 
CONCAT(docket_type_weigh_link.docket_type_weigh_link_id, '_',IFNULL(sr.contract_id, ''),'_',IFNULL(dr.contract_id, '')) AS docket_type_lookup_id, 
IFNULL(sp.pro_code, dp.pro_code) AS pro_code,
IFNULL(sr.cot_season, dr.cot_season) AS season,
docket_type.*,
docket_type_weigh_link.dtw_source_weigh AS source_weigh,
docket_type_weigh_link.dtw_destination_weigh AS destination_weigh,
sr.cot_number AS source_cot_number,
dr.cot_number AS destination_cot_number,
sr.cot_quantity AS source_cot_quantity,
dr.cot_quantity AS destination_cot_quantity,
sr.cot_source_remaining AS source_remaining,
dr.cot_destination_remaining AS destination_remaining,
sc.con_code AS source_con_code,
IF(sr.cot_multigrade='1','Y','') AS source_multi,

sgr.gra_code AS source_grade,
dgr.gra_code AS destination_grade,
dc.con_code AS destination_con_code,
sct.ctt_description AS source_description,
dct.ctt_description AS destination_description,
dot_show_in_bridge_dockets AS bridge_docket_type_filter 

FROM docket_type_weigh_link 
LEFT JOIN docket_type ON dtw_docket_type_id = docket_type_id
LEFT JOIN contract_type AS sct ON dot_source_contract_type_id = sct.contract_type_id
LEFT JOIN contract_type AS dct ON dot_destination_contract_type_id = dct.contract_type_id
LEFT JOIN contract AS sr ON sct.contract_type_id = sr.cot_contract_type_id
LEFT JOIN contract AS dr ON dct.contract_type_id = dr.cot_contract_type_id
LEFT JOIN product sp ON sr.cot_product_id = sp.product_id 
LEFT JOIN product dp ON dr.cot_product_id = dp.product_id 
LEFT JOIN contact AS sc ON sr.cot_seller_contact_id = sc.contact_id
LEFT JOIN contact AS dc ON dr.cot_buyer_contact_id = dc.contact_id
LEFT JOIN grade AS sgr ON sr.cot_grade_id = sgr.grade_id
LEFT JOIN grade AS dgr ON dr.cot_grade_id = dgr.grade_id

WHERE IFNULL(sr.cot_season,dr.cot_season) = IFNULL(dr.cot_season,sr.cot_season) 
AND IFNULL(sr.cot_product_id,dr.cot_product_id) = IFNULL(dr.cot_product_id,sr.cot_product_id)
AND dot_transfer = '0'
AND IFNULL(sr.cot_status,'') != 'Completed'
AND IFNULL(dr.cot_status,'') != 'Completed'
AND
(
sr.cot_grade_id = dr.cot_grade_id 
OR 
IFNULL(sr.cot_grade_id,'') = '' 
OR
IFNULL(dr.cot_multigrade,'1') = '1'
OR
IFNULL(sr.cot_grade_id,'') = ''
OR
IFNULL(dr.cot_multigrade,'1') = '1'
)


";


return $s;

}



?>