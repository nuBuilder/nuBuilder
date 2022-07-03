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

		$count = count($this->OBJ['SELECT']);
		for($i = 0 ; $i < $count ; $i++){
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

?>
