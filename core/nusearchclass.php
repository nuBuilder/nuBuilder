<?php

class nuSearchClass{
	
	private $where				= array();
	private $not				= array();
	private $columns			= array();
	private $search				= array();
	
	public function __construct($s){
 

		$S		= str_split($s);
		$o		= array();
		$isP	= false;

		for($i = 0 ; $i < count($S) ; $i++){

			$c			= new stdClass;
			$c->value	= $S[$i];
			$c->not		= false;
			$c->phrase	= false;
			$o[]		= $c;

		}
		
		for($i = 0 ; $i < count($o) ; $i++){
			$isP	= $this->phrase($o, $i, $isP);
		}

		$isN	= false;

		for($i = 0 ; $i < count($o) ; $i++){
			if($o[$i]->value == '-'){
				$isN	= true;
			}

			if(!$o[$i]->phrase and $o[$i]->value == ' '){
				$isN	= false;
			}
				
			$o[$i]->not = $isN;
		
		}
		
		$W = '';
		$N = '';

		for($i = 0 ; $i < count($o) ; $i++){

			$O = $o[$i];

			if($O->value == '"'){

			}else if($O->value == '-' and !$O->phrase){
			}else if($O->value == ' ' and !$O->phrase){

				if($W != ''){
					$this->where[]	= $W;
				}

				if($N != ''){
					$this->not[]	= $N;
				}

				$N = '';
				$W = '';

			}else if($O->not){
				$N .= $O->value;
			}else if(!$O->not){
				$W .= $O->value;

			}

		}

		if($W != ''){
			$this->where[]	= $W;
		}

		if($N != ''){
			$this->not[]	= $N;
		}

		return this;

	}


	
	public function phrase(&$o, $i, $isP){

		if($o[$i]->value != '"'){return $isP;}

		if($isP){															//-- is ending quote

			$o[$i]->phrase	  = true;
			return false;

		}else{

			if($this->hasNextQuoted($o, $i)){								 //-- quote with matching quote

				$o[$i]->phrase = true;
				return true;

			}else{
				return false;
			}

		}

	}


	public function hasNextQuoted($o, $i){

		$i++;
		$s = $i;
		
		for($i ; $i < count($o) ; $i++){
		
			if($o[$i]->value == '"'){
			
				$this->addPhraseTag($o, $s, $i);
				
				return true;
				
			}

		}

		return false;

	}


	private function addPhraseTag(&$o, $s, $I){

		for($i = $s ; $i < $I ; $i++){

			$o[$i]->phrase = true;

		}

	}

}

?>