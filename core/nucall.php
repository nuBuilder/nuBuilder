<?php
require_once 'nudatabase.php';

if (empty($_REQUEST['p'])) {
    nuSendError(400, 'No procedure code is provided.');
}

$stmt = nuRunQuery(
    "SELECT zzzzsys_php_id
       FROM zzzzsys_php
      WHERE sph_code = ?",
    [$_REQUEST['p']]
);

if (db_num_rows($stmt) !== 1) {
    nuSendError(400, 'Could not find procedure with code given.');
}

$PHPID = db_fetch_object($stmt)->zzzzsys_php_id;
if (!$PHPID) {
    nuSendError(400, 'Invalid procedure was found.');
}

require_once 'nusession.php';

if (empty($_SESSION['TEMPORARY_SESSION'])) {
    $sessStmt = nuRunQuery(
        "SELECT sss_access
           FROM zzzzsys_session
          WHERE zzzzsys_session_id = ?",
        [$_SESSION['nubuilder_session_data']['SESSION_ID']]
    );
    if (db_num_rows($sessStmt) !== 1) {
        nuSendError(400, 'Could not find session data.');
    }

    $access = json_decode(db_fetch_object($sessStmt)->sss_access, true);
    if (empty($access['session']['global_access'])) {
        $allowed = array_column($access['procedures'], 0);
        if (!in_array($PHPID, $allowed, true)) {
            nuSendError(403, 'You do not have access to this procedure.');
        }
    }
}

require_once('nucommon.php');
nuEval($PHPID);

function nuSendError($statusCode, $message) {
    header('Content-Type: text/html');
    http_response_code($statusCode);
    die($message);
}
