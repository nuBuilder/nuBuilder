<?php

    $nuConfigDBHost                 = "127.0.0.1";
    $nuConfigDBName                 = "nubuilder4";
    $nuConfigDBUser                 = "root";
    $nuConfigDBPassword             = "";
    $nuConfigDBGlobeadminUsername   = "globeadmin";     //-- globeadmin username
    $nuConfigDBGlobeadminPassword   = "nu";             //-- globeadmin password
    $nuConfigTitle                  = "nuBuilder 4";
    $nuConfigIsDemo                 = false;
	$nuConfigTimeOut             	= 1440;
  /*$nuWelcomeBodyInnerHTML			= " 
	
	
			<div id='outer' style='width:100%'>

				<div id='login' class='nuLogin'>
					<table>
						<tr>
							<td align='center' style='padding:0px 0px 0px 33px; text-align:center;'>
							<img src='graphics/logo.png'><br><br>
							</td>
						</tr>
						<tr>
							<td><div style='width:90px'>Username</div><input class='nuLoginInput' id='nuusername'/><br><br></td>
						</tr>
						<tr>
							<td><div style='width:90px'>Password</div><input class='nuLoginInput' id='nupassword' type='password'  onkeypress='nuSubmit(event)'/><br></td>
						</tr>
						<tr>
							<td style='text-align:center' colspan='2'><br><br>
								<input id='submit' type='button' class='nuButton' onclick='nuLoginRequest()' value='Log in'/>
							</td>
						</tr>
					</table>
				</div>
				
			</div>
				
				
									";

*/
									
    if(array_key_exists('REQUEST_URI', $_SERVER)){
        if(strpos($_SERVER['REQUEST_URI'], basename(__FILE__)) !== false){
            header('HTTP/1.0 404 Not Found', true, 404);
            die();
        }
    }

?>