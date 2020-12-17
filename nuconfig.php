<?php

    $nuConfigDBHost                 = "127.0.0.1";		//-- database host / IP
    $nuConfigDBName                 = "nubuilder4";		//-- database name
    $nuConfigDBUser                 = "root";			//-- database user
    $nuConfigDBPassword             = "";				//-- database password
    $nuConfigDBGlobeadminUsername   = "globeadmin";     //-- globeadmin username
    $nuConfigDBGlobeadminPassword   = "nu";             //-- globeadmin password
	
    $nuConfigTitle                  = "nuBuilder 4";	//-- nuBuilder Title
		
    $nuConfigIsDemo                 = false;			//-- Demo mode. Saving not permitted.
	$nuIncludeGoogleCharts          = true;				//-- include external link to www.gstatic.com
	$nuIncludeApexCharts			= false;			//-- include apex charts (libs/apexcharts)
	$nuEnableDatabaseUpdate			= true;				//-- Enable updating the database within nuBuilder
	
	$nuConfigTimeOut             	= 1440;				//-- SessionTimeout
	
	
  // Uncomment this block to customise the login form:
  
  /*
	$nuWelcomeBodyInnerHTML = " 

   			<div id='outer' style='width:100%'>
			<form id='nuLoginForm' action='#' method='post' onsubmit='return false'">
				<div id='login' class='nuLogin'>
					<table>
						<tr>
							<td align='center' style='padding:0px 0px 0px 33px; text-align:center;'>
							<img src='graphics/logo.png'><br><br>
							</td>
						</tr>
						<tr>
							<td><div style='width:90px'>Username</div><input class='nuLoginInput' id='nuusername' autocomplete='off' /><br><br></td>
						</tr>
						<tr>
							<td><div style='width:90px'>Password</div><input class='nuLoginInput' id='nupassword' type='password' autocomplete='off'  onkeypress='nuSubmit(event)'/><br></td>
						</tr>
						<tr>
							<td style='text-align:center' colspan='2'><br><br>
								<input id='submit' style='width:90px' type='button' class='nuButton' onclick='nuLoginRequest()' value='Log in'/>
							</td>
						</tr>
					</table>
				</div>
			</form>	
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