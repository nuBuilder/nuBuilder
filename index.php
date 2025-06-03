<?php
$nuPath = __DIR__;

$nuconfig = "nuconfig.php";
if (!is_file($nuconfig)) {
	echo nuGetErrorConfigNotFound();
	exit;
}

require_once('nuconfig.php');
require_once('core/nudatabase.php');
require_once('core/nusetuplibs.php');

eval (nuConfigScript()['code']);

require_once('core/nusessiondata.php');
require_once('core/nuindexlibs.php');

nuImportNewDB();

require_once('core/nusystemupdatelibs.php');

if (!isset($_SESSION['nubuilder_session_data']['NB_PATH']) || dirname($_SESSION['nubuilder_session_data']['NB_PATH']) != $nuPath) {

	$_SESSION['nubuilder_session_data']['NB_PATH'] = null;
	nuLoadNewSession();
	header('Location: ' . $_SERVER['PHP_SELF']);
	die;

}
?>

<!DOCTYPE html>
<html id="nuhtml" onclick="nuClick(event)">

<head>
	<title><?php echo isset($nuConfigTitle) ? $nuConfigTitle : '' ?></title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv='Content-type' content='text/html;charset=UTF-8'>
	<meta name="theme-color" content="#00adef">
	<?php

	function nuGetErrorConfigNotFound() {
		return <<<HTML
		<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <title>Configuration File Missing</title>
		  <style>
			body {
			  font-family: Arial, sans-serif;
			  background-color: #f9f9f9;
			  padding: 2rem;
			  color: #333;
			}
			.container {
			  max-width: 600px;
			  margin: auto;
			  background: #fff;
			  padding: 2rem;
			  border: 1px solid #ddd;
			  border-radius: 8px;
			  box-shadow: 0 0 10px rgba(0,0,0,0.05);
			}
			h1 {
			  color: #d9534f;
			}
			code {
			  background-color: #f1f1f1;
			  padding: 0.2rem 0.4rem;
			  border-radius: 4px;
			  font-family: monospace;
			}
		  </style>
		</head>
		<body>
		  <div class="container">
			<h1>Configuration File Not Found</h1>
			<p>The file <code>nuconfig.php</code> is missing.</p>
			<p>Please rename <code>nuconfig-sample.php</code> to <code>nuconfig.php</code> and then refresh this page.</p>
		  </div>
		</body>
		</html>
		HTML;
	}

	function nuHeader() {

		$sql = "SELECT * FROM zzzzsys_setup WHERE zzzzsys_setup_id = ?";
		$stmt = nuRunQuery($sql, [1]);

		$obj = db_fetch_object($stmt);
		$style = $obj->set_style ?? '';
		$style = '</script>' . (nuEndsWithStyleTag($style) ? $style : "<style>$style</style>") . '<script>';

		return "\n\n{$obj->set_header}$style\n\n";
	}

	function nuEndsWithStyleTag($style) {

		$tag = '</style>';
		$style = trim($style);
		return strpos($style, $tag) === strlen($style) - strlen($tag);

	}

	function nuLastLoggedInUser() {
		return $_SESSION['nuLastUser']['user_id'] ?? "";
	}

	nuIncludeFiles();

	?>

	<script>

		function nuValidCaller(o) {

			if (o === null) { return false; }
			return o.hasOwnProperty('nuVersion');
		}

		function nuSSOLoginRequest(u, p) {
			const btn = document.getElementById('submitSSO');
			btn.style.opacity = 0.5;
			btn.style.cursor = "wait";
			location.replace("/sso/login");
		}

		function nuLoginRequest(u, p) {

			$(":submit").nuDisable();

			const data = {
				call_type: 'login',
				username: arguments.length == 0 ? $('#nuusername').val() : u,
				password: arguments.length == 0 ? $('#nupassword').val() : p,
				login_form_id: nuLoginF,
				login_record_id: nuLoginR
			};

			$.ajax({
				async: true,
				dataType: "json",
				url: "core/nuapi.php",
				method: "POST",
				data: { nuSTATE: JSON.stringify(data) },
				success: ({ form_id, record_id, filter, search }) => {
					if (nuDisplayError({ form_id, record_id, filter, search })) {
						if (data.log_again == 1) {
							location.reload();
						}
					} else {
						nuForm(form_id, record_id, filter, search);
					}
				},
				error: (jqXHR, textStatus, errorThrown) => {
					$(":submit").nuEnable();
					window.test = jqXHR.responseText;

					let err = nuFormatAjaxErrorMessage(jqXHR, errorThrown);
					nuMessage(err);
				},
			});

		}

		window.nuVersion = 'nuBuilder4.6';
		window.nuDocumentID = Date.now();

		window.nuHASH = [];

		<?php
		global $nuConfigLogonMode;
		global $nuConfigHideNonSsoLogonExcept;
		$nuConfigLoginScreenTopRow = (isset($nuConfigLoginScreenTopRow) ? $nuConfigLoginScreenTopRow : '');
		$loginTopRow = addslashes($nuConfigLoginScreenTopRow);
		$nuWelcomeBodyInnerHTML = (isset($nuWelcomeBodyInnerHTML) ? $nuWelcomeBodyInnerHTML : '');
		$welcome = addslashes($nuWelcomeBodyInnerHTML);
		$nuHeader = nuHeader();
		$graphics = json_encode(scandir('core/graphics'));
		$nuBrowseFunction = 'browse';

		function nuSanitize(&$item) {
			$item = htmlspecialchars($item);
		}

		array_walk($_GET, 'nuSanitize');

		$nuUser = $_GET['u'] ?? '';
		$nuPassword = $_GET['p'] ?? '';
		$nuForm = $_GET['f'] ?? '';
		$nuRecord = $_GET['r'] ?? '';
		$nuHome = $_GET['h'] ?? '';

		$URLParams = $_GET;
		unset($URLParams['p']);
		foreach ($URLParams as $param => $value) {
			$_SESSION['nubuilder_session_data']['URL_PARAMS'][$param] = $value;
		}

		$opener = $_GET['opener'] ?? '';
		$search = $_GET['search'] ?? '';
		$iframe = $_GET['iframe'] ?? '';
		$target = $_GET['target'] ?? '';
		$like = $_GET['like'] ?? '';
		$nuBrowseFunction = $_GET['browsefunction'] ?? 'browse';

		$h1 = "
		window.nuLoginU		= '$nuUser';
		window.nuLoginP		= '$nuPassword';
		window.nuLoginF		= '$nuForm';
		window.nuLoginR		= '$nuRecord';
		window.nuLoginH		= '$nuHome';
		window.nuGraphics	= $graphics;
		window.nuIsWindow	= '$iframe';
		window.nuImages		= [];
	";

		$isSession = isset($_SESSION['nubuilder_session_data']['SESSION_ID']);

		if ($nuUser != '' && $nuPassword != '') {
			$h2 = nuUseUP($nuBrowseFunction, $target, $welcome, $nuUser, $nuPassword);
		} else {

			if ($opener == '') {
				$lastUser = nuLastLoggedInUser();
				$onlySsoExcept = (isset($nuConfigSsoOnlyExcept) ? $nuConfigSsoOnlyExcept : array());
				$h2 = nuGetJS_login($nuBrowseFunction, $target, $loginTopRow, $welcome, $nuForm, $nuRecord, $isSession, $nuConfigLogonMode, $onlySsoExcept, $lastUser);
			} else {
				$h2 = nuGetJSActionScreen($nuBrowseFunction, $target, $welcome, $opener, $search, $like);
			}

		}

		$sessionAlive = '';

		if (isset($nuConfigKeepSessionAlive) && $nuConfigKeepSessionAlive) {
			$nuConfigKeepSessionAliveInterval = !isset($nuConfigKeepSessionAliveInterval) ? 600 : $nuConfigKeepSessionAliveInterval;
			$sessionAlive = "
		if (nuMainForm()) {

			function nuRunKeepAlive() {
				nuRunPHPHidden('nukeepalive');
			}

			if (sessionStorage.getItem('nukeepalive') === null) {
				var refreshTime = 1000 * $nuConfigKeepSessionAliveInterval; // refresh interval in milliseconds
				var intervalID = setInterval(() => nuRunKeepAlive(), refreshTime);
				sessionStorage.setItem('nukeepalive', intervalID);
			}

		}
		";
		}

		$h3 = isset($nuJSOptions) ? $nuJSOptions : '';

		$h4 = "

	function nuResize(){

		if(typeof window['nuOnBeforeResize'] === 'function'){
			if (nuOnBeforeResize() == false) return;
		}

		$('#nuActionHolder').css('width', '100%');
		$('#nuBreadcrumbHolder').css('width', '100%');
		$('#nuTabHolder').css('width', '100%');
		$('.nuTabTitleColumn').css('width', '100%');
		$('body').css('width', '100%');

		if (window.nuVerticalTabs) {
			nuSetVerticalTabs();
		}

		if(typeof window['nuOnResize'] === 'function'){
			nuOnResize();
		}

	}

	$(document).on('select2:open', (element) => {
		const targetId = element.target.id;
		const searchField = document.querySelector(\"[aria-controls='select2-\"+targetId+\"-results']\");
		searchField.focus();
	});

	document.addEventListener('focus', nuOnFocus, true);

	</script>
	<script id='nuheader'>
		$nuHeader
		$sessionAlive
	</script>
	<script>
	";


		$h = $h1 . $h2 . $h3 . $h4;
		print $h;
		?>
	</script>

	<noscript>
		<p style="padding-left: 30px;">It appears that JavaScript is disabled or your browser does not support it.</p>
	</noscript>

</head>
<?php
nuLoadBody();
?>
</body>

</html>