<?php

// -> Important Note: You will need to restart your browser after modifying nuconfig.php in order for changes to be reflected

// -> Rename nuconfig-sample.php to nuconfig.php


// Database Settings:

	$nuConfigDBHost						= "127.0.0.1";				//-- Database Host / IP. You may try localhost if 127.0.0.1 does not work.
	$nuConfigDBName						= "nubuilder4";				//-- Database Name. You can change the name, if desired. The database must exist or must be created on your server.

	$nuConfigDBUser						= "root";					//-- Database User.  It is strongly recommended to use a different user than root The user must exist or must be created.
	$nuConfigDBPassword					= "";						//-- Database Password. We strongly recommend you to use any strong password.
																	//-- The default username for a new MySQL installation is root, with a blank password.

	$nuConfigDBEngine					= "InnoDB";					//-- InnoDB or MyISAM
	$nuConfigDBCollate					= "utf8mb4_unicode_ci";		//-- Or utf8_general_ci etc.
	$nuConfigDBCharacterSet				= "utf8mb4";				//-- Or utf8 etc.
	$nuConfigDBOptions					= array();					//-- PDO Options: E.g. array(PDO::ATTR_PERSISTENT => true);

// Administrator Login:

	$nuConfigDBGlobeadminUsername	 	= "globeadmin";				//-- Administrator username. You can choose any username you like.
	$nuConfigDBGlobeadminPassword		= "nu";						//-- Administrator password. Please choose a stronger password!

// SSO:

	$nuConfigLogonMode			        = 'normal';	 		        // normal/sso/both->Leave as 'normal' unless you want to enable SSO.
										                            // The sso/both options include a single sign on button.
										                            // See SSO_README.txt
	$nuConfigSsoOnlyExcept		         = array('globeadmin');		// If $nuConfigLogonMode=='both', only the SSO login option is displayed *unless* the last user to
										                            // log in (from this browser) matches one of the listed users in this setting.
										                            // For SSO users, use the full email address in the array, here.
                                                                	// E.g. array('globeadmin','user@example.com');
                                                                	// This causes the username/password to be displayed (otherwise it is hidden).

// Includes:

	$nuConfigIncludeJS					= '';						//-- Include one or more JavaScript File(s).  E.g. 'myjslib.js' or ['myjslib1.js','myjslib2.js']
	$nuConfigIncludeCSS					= '';						//-- Include one or more CSS File(s). E.g. 'mystyles.css' or ['mystyles1.css','mystyles2.css']
	$nuConfigIncludePHP					= '';						//-- Include one or more PHP File(s). E.g. '../libs/myphplib.php' or ['../libs/myphplib1.php','../libs/myphplib2.php']

// Settings

	$nuConfigSettingsFromDB				= true;						//-- Use settings from setup->settings if set to true (default)	



// Uncomment this block to customise just the top line of the login form (default = nuBuilder Forte logo)
// This must be one (or could be more) table rows inside <tr> and </tr> :-
/*
    $nuConfigLoginScreenTopRow = "
							<tr>
								<td align='center' style='padding:0px 0px 0px 33px; text-align:center;'>
								<img src='core/graphics/logo.png'><br><br>
								</td>
							</tr>
	";
*/

// Alternatively, uncomment this block to customise the whole login form (note: $nuConfigLogonMode will be ignored):

/*
	$nuWelcomeBodyInnerHTML = " 

				<div id='outer' style='width:100%'>
				<form id='nuLoginForm' action='#' method='post' onsubmit='return false'>
					<div id='login' class='nuLogin'>
						<table>
							<tr>
								<td align='center' style='padding:0px 0px 0px 33px; text-align:center;'>
								<img src='core/graphics/logo.png'><br><br>
								</td>
							</tr>
				<!-- SSO Log in part
						<tr>
							<td align='center' style='text-align:center' colspan='2'>
								<input id='submitSSO' style='width:90px' type='submit' class='nuButton' onclick='nuSSOLoginRequest()' value='SSO Log in'/>
								<br><br>
							</td>
						</tr>
				End of SSO Log in part -->
							<tr>
								<td><div style='width:90px; margin-bottom: 5px;'>Username</div><input class='nuLoginInput' id='nuusername' autocomplete='off' /><br><br></td>
							</tr>
							<tr>
								<td><div style='width:90px; margin-bottom: 5px;'>Password</div><input class='nuLoginInput' id='nupassword' type='password' autocomplete='off'  onkeypress='nuSubmit(event)'/><br></td>
							</tr>
							<tr>
								<td style='text-align:center' colspan='2'><br><br>
									<input id='submit' style='width:90px' type='submit' class='nuButton' onclick='nuLoginRequest()' value='Log in'/>
								</td>
							</tr>
						</table>
					</div>
				</form>	
				</div>			

	";
*/

?>
