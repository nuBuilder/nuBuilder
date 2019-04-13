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
/*    $nuWelcomeBodyInnerHTML			= " 
	
	
			<div id='outer' style='width:100%'>

				<div id='login' class='nuLogin'>
					<table>
						<tr>
							<td align='center' style='text-align:center;height:50px' colspan='2'>
								<div id='nulogo' style='margin:50px 0px 20px 65px;background-size:100% 100%;background-image:url(\"graphics/logo.png\");width:200px;height:80px;'></div>
							</td>
						</tr>
						<tr>
							<td style='text-align:right;margin:0px 5px 0px 20px;'><span style='padding:0px 5px 0px 40px;'>Username</span></td>
							<td style='text-align:left'><input id='nuusername'/></td>
						</tr>
						<tr>
							<td style='text-align:right;margin:0px 5px 0px 20px;'><span style='padding:0px 5px 0px 40px;'>Password</span></td>
							<td style='text-align:left'><input id='nupassword' type='password'  onkeypress='nuSubmit(event)'/></td>
						</tr>
						<tr>
							<td style='text-align:center' colspan='2'>
								<input id='submit' type='button' class='nuButton'  style='margin:20px 0px 0px 50px;width:90px;height:30px;' onclick='nuLoginRequest()' value='Log in'/>
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