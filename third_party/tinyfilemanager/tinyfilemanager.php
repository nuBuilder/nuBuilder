<?php
/*
 * nuFiles for nuBuilder Forte – a single-file file manager (the file manager of nuBuilder Next, adapted).
 * Version 1.0.0-forte · built from nuBuilder Next 0.8.1123 · PHP 8.1 or newer · MySQL / MariaDB (SQL Server: log table only, untested)
 *
 * INSTALL
 *   Save this file as third_party/tinyfilemanager/tinyfilemanager.php of your nuBuilder Forte installation (it replaces Tiny File Manager).
 *   Forte's own File Manager entry (nuVendorLogin('TFM'), e.g. the File Manager button of the Setup / Home form) then opens it.
 *   A Forte update puts Tiny File Manager back – keep a copy of this file (your settings are at the top) and copy it again.
 *
 * WHO MAY USE IT (as Tiny File Manager)
 *   The globeadmin and the users listed in $nuConfigFileMangerUsers (nuconfig.php, user ids or login names, separated by commas).
 *   The sign-in is Forte's: Forte sets the cookie nu_TFM (the session id) when the File Manager is opened from Forte; this file checks
 *   that session in zzzzsys_session (not expired, no pending 2FA). Users in 'readonly_users' (below) can only view and download.
 *
 * SETTINGS – the array $NUF_SETTINGS right below. Keep a copy: a new version of this file brings the defaults again.
 *   An optional file nufiles-settings.php next to this one (returning an array) overrides them and survives replacing this file.
 *
 *   shares      folders the file manager shows. Each: id (a-z 0-9 _ -), label, path (absolute, or starting with {FORTE} = the folder of
 *               nuconfig.php, or {DOCUMENT_ROOT}), type 'files' (documents, with the protections below) or 'code' (globeadmin only, no
 *               name or content rules), readonly, extensions (allow-list), max_upload_mb, show_hidden, web_active_types (allow HTML / SVG
 *               / JS), content_check (refuse PHP code in uploads), editor, zip, trash (true / false), deny (hidden names: ".git",
 *               "nuconfig.php", "private/*"), grants (who besides the globeadmin): [{"tfm_users": true | "access": [access level codes]
 *               | "permission": [permission items] | "login": [login names], "rights": ["view","upload","mkdir","edit","rename","copy",
 *               "delete","zip"]}]
 *   readonly_users  login names or user ids that may only view / download (also the globeadmin's login, if you want)
 *   reauth      password again before: 'code' (any access to code shares, default), 'code_write', 'all_write', 'none';
 *               reauth_minutes how long a confirmation counts (default 15)
 *   data_dir    recycle bin, versions, upload chunks – best OUTSIDE the web root. Default: _nufiles_data next to this file (protected by
 *               an .htaccess on Apache; on nginx deny it or set data_dir to a folder outside the web root)
 *   limits      max_upload_mb, chunk_mb (below PHP's upload_max_filesize / post_max_size), zip_max_mb, zip_max_entries, copy_max_mb,
 *               editor_max_kb, search_max_results, list_max_entries, trash_days (0 = keep), versions_keep (0 = none)
 *   log_table   change log in Forte's database (created on first use), log_reads = also list / download / preview
 *   lang        '' = the Forte user's language (German → de, else en), or 'en' / 'de' / 'de-CH';  theme  'auto' | 'light' | 'dark'
 *   forte_root  '' = found by itself (the folder with nuconfig.php above this file)
 *
 * SECURITY: code shares are the program of the server – only the globeadmin sees them, always after the password confirmation.
 * Every path is checked (no "..", no symlinks out of a share, the data folder unreachable); uploads into "files" shares refuse names a
 * web server would run (.php, .phtml, .htaccess …) and PHP code inside files; zip / unzip are protected against zip-slip and zip bombs;
 * every change is logged. CSRF token on every change.
 */

declare(strict_types=1);

$NUF_SETTINGS = [
	'shares' => [
		['id' => 'uploads', 'label' => 'Uploads', 'path' => '{FORTE}/uploads', 'type' => 'files',
			'extensions' => 'pdf, png, jpg, jpeg, gif, webp, txt, csv, md, json, docx, xlsx, pptx, odt, ods, zip',
			'grants' => [['tfm_users' => true, 'rights' => ['view', 'upload', 'mkdir', 'edit', 'rename', 'copy', 'delete', 'zip']]]],
		['id' => 'forte', 'label' => 'nuBuilder Forte (code)', 'path' => '{FORTE}', 'type' => 'code', 'deny' => ['.git', 'nuconfig.php']],
	],
	'readonly_users' => [],
	'reauth' => 'code',
	'reauth_minutes' => 15,
	'data_dir' => '',
	'max_upload_mb' => 200,
	'chunk_mb' => 2,
	'zip_max_mb' => 500,
	'zip_max_entries' => 5000,
	'copy_max_mb' => 2000,
	'editor_max_kb' => 2048,
	'search_max_results' => 500,
	'list_max_entries' => 10000,
	'trash_days' => 30,
	'versions_keep' => 10,
	'log_table' => 'nufiles_log',
	'log_reads' => false,
	'lang' => '',
	'theme' => 'auto',
	'forte_root' => '',
];

// ====================================================================================================================== bootstrap

const NUF_VERSION = '1.0.0-forte';
const NUF_ASSET_V = '80987b613049';   // hash of the script + style of this build: a new file is never shown with the browser's copy of the old ones
const NUF_FORTE_EDITION = true;

if (is_file(__DIR__ . '/nufiles-settings.php')) {
	$nufOwn = include __DIR__ . '/nufiles-settings.php';
	if (is_array($nufOwn)) $NUF_SETTINGS = array_replace($NUF_SETTINGS, $nufOwn);
}

/** The folder of nuBuilder Forte (nuconfig.php) and the URL prefix from this file to it. */
(static function () use ($NUF_SETTINGS): void {
	$root = trim((string)$NUF_SETTINGS['forte_root']);
	$up = '';
	if ($root === '') {
		$d = __DIR__;
		for ($i = 0; $i < 4; $i++) {
			if (is_file($d . '/nuconfig.php')) { $root = $d; break; }
			$d = dirname($d);
			$up .= '../';
		}
	} else {
		$up = '';
		$rel = trim(substr(str_replace('\\', '/', __DIR__), strlen(rtrim(str_replace('\\', '/', $root), '/'))), '/');
		if ($rel !== '') $up = str_repeat('../', substr_count($rel, '/') + 1);
	}
	if ($root === '' || !is_file($root . '/nuconfig.php')) {
		http_response_code(500);
		exit('nuFiles: nuconfig.php of nuBuilder Forte not found – set forte_root at the top of this file.');
	}
	define('NUF_FORTE_ROOT', rtrim(str_replace('\\', '/', (string)realpath($root)), '/'));
	define('NUF_FORTE_URL', $up);
})();

final class NufCtx
{
	public PDO $pdo;
	public string $type = 'mysql';
	private array $user = [];
	private bool $ga = false;
	private bool $ro = false;
	private array $perms = [];
	private string $lang = 'en';

	public function __construct(private array $set) {}

	// ------------------------------------------------------------------ sign-in (Forte's session)

	public function connect(): void
	{
		$c = (static function (): array {
			require NUF_FORTE_ROOT . '/nuconfig.php';
			return get_defined_vars();
		})();
		$this->type = ($c['nuConfigDBType'] ?? 'mysql') === 'sqlsrv' ? 'sqlsrv' : 'mysql';
		$host = (string)($c['nuConfigDBHost'] ?? 'localhost');
		$port = (string)($c['nuConfigDBPort'] ?? ($this->type === 'sqlsrv' ? '1433' : '3306'));
		$dsn = $this->type === 'sqlsrv'
			? 'sqlsrv:Server=' . $host . ($port !== '' ? ',' . $port : '') . ';Database=' . ($c['nuConfigDBName'] ?? '')
			: 'mysql:host=' . $host . ';port=' . $port . ';dbname=' . ($c['nuConfigDBName'] ?? '') . ';charset=utf8mb4';
		$this->pdo = new PDO($dsn, (string)($c['nuConfigDBUser'] ?? ''), (string)($c['nuConfigDBPassword'] ?? ''), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
		$this->cfg = $c;
	}
	public array $cfg = [];

	/** null = signed in; else the reason (session / access). */
	public function signIn(): ?string
	{
		$sid = (string)($_COOKIE['nu_TFM'] ?? '');
		if ($sid === '' || strlen($sid) > 64) return 'err_session';
		$row = $this->one('SELECT sss_access, sss_time FROM zzzzsys_session WHERE zzzzsys_session_id = ?', [$sid]);
		if (!$row) return 'err_session';
		$life = (isset($this->cfg['nuConfigTimeOut']) && is_int($this->cfg['nuConfigTimeOut']) && $this->cfg['nuConfigTimeOut'] > 0) ? 60 * $this->cfg['nuConfigTimeOut'] : 36000;
		if ($row['sss_time'] !== null && (int)$row['sss_time'] > 0 && (int)$row['sss_time'] < time() - $life) return 'err_session';
		$a = json_decode((string)$row['sss_access'], true);
		$s = is_array($a['session'] ?? null) ? $a['session'] : [];
		if (!$s) return 'err_session';
		$id = (string)($s['zzzzsys_user_id'] ?? '');
		$login = (string)($s['sus_login_name'] ?? '');
		$this->ga = (string)($s['global_access'] ?? '0') === '1';
		$listed = array_filter(array_map('trim', preg_split('/[\s,;]+/', (string)($this->cfg['nuConfigFileMangerUsers'] ?? '')) ?: []), 'strlen');
		$tfmUser = !$this->ga && ($id !== '' && in_array($id, $listed, true) || $login !== '' && in_array($login, $listed, true));
		if (!$this->ga && !$tfmUser) return 'err_access';
		$this->user = ['id' => $id !== '' ? $id : $login, 'login' => $login, 'display' => trim((string)($s['sus_name'] ?? '')) ?: $login,
			'access_code' => (string)($a['access_level_code'] ?? ''), 'tfm' => $tfmUser || $this->ga];
		$this->perms = array_values(array_filter(array_map('trim', explode(',', (string)($s['user_permissions'] ?? ''))), 'strlen'));
		$ro = array_map('strval', (array)$this->set['readonly_users']);
		$this->ro = in_array($login, $ro, true) || in_array($id, $ro, true);
		$l = strtolower(trim((string)$this->set['lang']));
		if ($l === '') $l = str_starts_with(strtolower((string)($s['language'] ?? '')), 'german') || str_starts_with(strtolower((string)($s['language'] ?? '')), 'deutsch') ? 'de' : 'en';
		$this->lang = $l;
		return null;
	}

	/** Password confirmation: the globeadmin against nuconfig.php, users against zzzzsys_user (bcrypt or Forte's md5). */
	public function checkPassword(string $pw): bool
	{
		if ($pw === '') return false;
		if ($this->ga) {
			$gp = (string)($this->cfg['nuConfigDBGlobeadminPassword'] ?? '');
			if ($gp !== '' && (hash_equals($gp, $pw) || (str_starts_with($gp, '$') && password_verify($pw, $gp)))) return true;
		}
		$hash = (string)($this->one('SELECT sus_login_password FROM zzzzsys_user WHERE zzzzsys_user_id = ?', [$this->user['id']])['sus_login_password'] ?? '');
		if ($hash === '') return false;
		if (str_starts_with($hash, '$')) return password_verify($pw, $hash);
		return hash_equals(strtolower($hash), md5($pw));
	}

	// ------------------------------------------------------------------ what lib/*.php asks for (nuBuilder Next's page context)

	public function action(): string { $a = $_GET['action'] ?? ''; return is_string($a) ? $a : ''; }
	public function param(string $name, ?string $default = null): ?string { $v = $_POST[$name] ?? $_GET[$name] ?? null; return is_string($v) ? $v : $default; }
	public function isPost(): bool { return ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST'; }
	public function setting(string $key, mixed $default = null): mixed { return array_key_exists($key, $this->set) ? $this->set[$key] : $default; }
	public function isGlobeadmin(): bool { return $this->ga; }
	public function readOnly(): bool { return $this->ro; }
	public function user(): array { return $this->user; }
	public function realUser(): ?array { return null; }
	public function permissions(): array { return $this->perms; }
	public function lang(): string { return $this->lang; }
	public function theme(): string { $t = (string)$this->set['theme']; return in_array($t, ['light', 'dark', 'auto'], true) ? $t : 'auto'; }
	public function dir(): string { return str_replace('\\', '/', __DIR__); }
	public function dataDir(): string { return $this->dir() . '/_nufiles_data'; }
	public function dbType(): string { return $this->type; }
	public function h(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
	public function url(array $params = []): string { return basename((string)$_SERVER['SCRIPT_NAME']) . ($params ? '?' . http_build_query($params) : ''); }
	public function homeUrl(): string { return NUF_FORTE_URL . 'index.php'; }
	public function asset(string $f): string { return $this->url(['asset' => $f === 'assets/app.css' ? 'css' : 'js', 'v' => NUF_ASSET_V]); }
	public function &session(): array { if (!isset($_SESSION['nuf']) || !is_array($_SESSION['nuf'])) $_SESSION['nuf'] = []; return $_SESSION['nuf']; }
	public function releaseSession(): void { if (session_status() === PHP_SESSION_ACTIVE) session_write_close(); }
	public function log(string $m): void { error_log($m); }
	public function recentAuth(): bool { $at = (int)($_SESSION['nuf']['auth_at'] ?? 0); return $at > time() - 60 * max(1, (int)$this->set['reauth_minutes']); }
	public function reauthUrl(string $back): string { return 'password'; }

	public function json(mixed $data, int $status = 200): never
	{
		while (ob_get_level() > 0) ob_end_clean();
		http_response_code($status);
		header('Content-Type: application/json; charset=utf-8');
		header('Cache-Control: no-store');
		echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
		exit;
	}

	public function one(string $sql, array $p = []): ?array { $st = $this->pdo->prepare($sql); $st->execute($p); $r = $st->fetch(PDO::FETCH_ASSOC); return $r === false ? null : $r; }
	public function all(string $sql, array $p = []): array { $st = $this->pdo->prepare($sql); $st->execute($p); return $st->fetchAll(PDO::FETCH_ASSOC); }
	public function exec(string $sql, array $p = []): int { $st = $this->pdo->prepare($sql); $st->execute($p); return $st->rowCount(); }
	public function insert(string $table, array $row): string
	{
		$pk = $table . '_id';
		$row = [$pk => substr(str_replace('.', '', uniqid('nf', true)), 0, 25)] + $row;
		$q = $this->type === 'sqlsrv' ? static fn($n) => '[' . $n . ']' : static fn($n) => '`' . $n . '`';
		$this->exec('INSERT INTO ' . $q($table) . ' (' . implode(', ', array_map($q, array_keys($row))) . ') VALUES (' . implode(', ', array_fill(0, count($row), '?')) . ')', array_values($row));
		return (string)$row[$pk];
	}
}

// ------------------------------------------------------------------ lib/guard.php
/**
 * nuFiles – path and name guard. Every path that comes from the browser goes through here before any file system call.
 *
 *  - Paths are RELATIVE to a share root, '/' separated. Rejected: null bytes, control characters, backslashes, '..', more than
 *    64 levels or 4096 bytes. '.' and empty parts are dropped.
 *  - An existing path is resolved with realpath() and must lie inside the share root (symlinks pointing outside are refused).
 *  - A new name is checked on its own (length, characters, reserved names) and against the share's rules: in a "files" share no
 *    names a web server could run or obey (same list as nuBuilder Next's upload guard, every dot part checked), no names starting
 *    with a dot, optionally no HTML / SVG / JS (web_active_types = false) and an optional extension allow-list.
 *  - The data folder of nuFiles (trash, versions, upload chunks) and the share's deny patterns are never reachable.
 */
final class NufError extends RuntimeException
{
	public function __construct(public string $key, public int $status = 400, public array $args = [])
	{
		parent::__construct($key, $status);
	}
}

final class NufGuard
{
	/** nuBuilder Next 0.8.459 NuSecurity::UPLOAD_DANGEROUS – kept in sync; the core list is used when it exists. */
	public const DANGEROUS = ['php', 'php2', 'php3', 'php4', 'php5', 'php6', 'php7', 'php8', 'phps', 'pht', 'phtm', 'phtml', 'phar', 'inc',
		'cgi', 'pl', 'py', 'rb', 'sh', 'bash', 'asp', 'aspx', 'ashx', 'asmx', 'cer', 'jsp', 'jspx', 'shtml', 'shtm', 'stm', 'htaccess', 'htpasswd',
		'ini', 'exe', 'com', 'bat', 'cmd', 'dll'];
	/** Served by a web server as active content on the portal's origin (stored XSS) – refused unless web_active_types = true. */
	public const WEB_ACTIVE = ['html', 'htm', 'xhtml', 'xht', 'svg', 'svgz', 'xml', 'xsl', 'xslt', 'js', 'mjs', 'swf', 'hta', 'vbs', 'wasm'];
	/** Names Windows / Samba cannot store (shares are sometimes mounted). */
	private const RESERVED = ['con', 'prn', 'aux', 'nul', 'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9',
		'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9'];

	/** @return list<string> the parts of a relative path ('' = the share root) */
	public static function segments(string $rel): array
	{
		if (strlen($rel) > 4096) throw new NufError('err_path');
		if (str_contains($rel, "\0") || preg_match('/[\x00-\x1f\x7f]/', $rel) || str_contains($rel, '\\')) throw new NufError('err_path');
		$out = [];
		foreach (explode('/', $rel) as $p) {
			if ($p === '' || $p === '.') continue;
			if ($p === '..') throw new NufError('err_path');
			$out[] = $p;
		}
		if (count($out) > 64) throw new NufError('err_path');
		return $out;
	}

	public static function join(array $segments): string
	{
		return implode('/', $segments);
	}

	/** Is $real (a realpath) the root itself or inside it? */
	public static function inside(string $root, string $real): bool
	{
		$root = rtrim($root, '/');
		return $real === $root || str_starts_with($real, $root . '/');
	}

	/** Lower-case dot parts after the first one: "a.tar.gz" → ['tar', 'gz']. */
	public static function extensions(string $name): array
	{
		$parts = explode('.', strtolower(rtrim($name, '. ')));
		array_shift($parts);
		return array_values(array_filter(array_map('trim', $parts), 'strlen'));
	}

	public static function lastExtension(string $name): string
	{
		$e = self::extensions($name);
		return $e ? (string)end($e) : '';
	}

	/** Would a web server run this name (or treat it as its configuration)? Uses nuBuilder Next's guard when it is there. */
	public static function dangerous(string $name): bool
	{
		if (class_exists('NuSecurity', false) && method_exists('NuSecurity', 'dangerousUploadName')) {
			if (NuSecurity::dangerousUploadName($name)) return true;
		}
		$base = strtolower(trim($name));
		if ($base === '' || str_starts_with($base, '.')) return true;
		foreach (self::extensions($base) as $p) if (in_array($p, self::DANGEROUS, true)) return true;
		return false;
	}

	/**
	 * A name for a new or renamed file / folder in $share. Throws NufError with the reason.
	 * $isDir: folders skip the extension rules (but not the dot and length rules).
	 */
	public static function checkName(string $name, array $share, bool $isDir): void
	{
		if ($name === '' || $name === '.' || $name === '..') throw new NufError('err_name_empty');
		if (strlen($name) > 255) throw new NufError('err_name_long');
		if (str_contains($name, '/') || str_contains($name, '\\') || str_contains($name, "\0") || preg_match('/[\x00-\x1f\x7f]/', $name)) throw new NufError('err_name_chars');
		if ($name !== trim($name) || str_ends_with($name, '.')) throw new NufError('err_name_edges');
		if (!mb_check_encoding($name, 'UTF-8')) throw new NufError('err_name_chars');
		// direction marks turn "invoice‮fdp.exe" into a name that reads "invoiceexe.pdf"; invisible characters hide parts of a name
		if (preg_match('/[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}-\x{2069}\x{FEFF}]/u', $name)) throw new NufError('err_name_chars');
		if (str_starts_with(strtolower($name), '.nufiles')) throw new NufError('err_name_reserved');
		if (in_array(strtolower(explode('.', $name)[0]), self::RESERVED, true)) throw new NufError('err_name_reserved');
		if (($share['type'] ?? 'files') === 'code') return;   // globeadmin only: everything a file system allows
		if (str_starts_with($name, '.')) throw new NufError('err_name_dot');
		if ($isDir) return;
		if (self::dangerous($name)) throw new NufError('err_name_dangerous', 400, [self::lastExtension($name)]);
		if (empty($share['web_active_types'])) {
			foreach (self::extensions($name) as $p) if (in_array($p, self::WEB_ACTIVE, true)) throw new NufError('err_name_web', 400, [$p]);
		}
		$allow = $share['extensions'] ?? [];
		if ($allow && !in_array(self::lastExtension($name), $allow, true)) throw new NufError('err_name_ext', 400, [self::lastExtension($name) ?: '–', implode(', ', $allow)]);
	}

	/** Is this relative path hidden by the share's rules (deny patterns, dot files) or inside the nuFiles data folder? */
	public static function denied(array $share, array $segments, ?string $real = null): bool
	{
		if ($real !== null && NufConfig::$dataDir !== '' && self::inside(NufConfig::$dataDir, $real)) return true;
		$rel = strtolower(self::join($segments));
		foreach ($segments as $s) {
			if (str_starts_with(strtolower($s), '.nufiles')) return true;
			if (empty($share['show_hidden']) && str_starts_with($s, '.')) return true;
		}
		foreach ($share['deny'] ?? [] as $pat) {
			$pat = strtolower((string)$pat);
			if ($pat === '') continue;
			if (fnmatch($pat, $rel, FNM_PATHNAME)) return true;
			foreach ($segments as $s) if (fnmatch($pat, strtolower($s))) return true;
		}
		return false;
	}

	/**
	 * Resolves an existing path of a share. Returns the realpath; throws when it does not exist, is outside, or is denied.
	 * $allowRoot = false refuses the share root itself (rename / delete / move of the root).
	 */
	public static function existing(array $share, string $rel, bool $allowRoot = true): string
	{
		$seg = self::segments($rel);
		if (!$allowRoot && !$seg) throw new NufError('err_root');
		if (self::denied($share, $seg)) throw new NufError('err_not_found', 404);
		$abs = $share['root'] . ($seg ? '/' . self::join($seg) : '');
		clearstatcache(true, $abs);
		if (!file_exists($abs) && !is_link($abs)) throw new NufError('err_not_found', 404);
		$real = realpath($abs);
		if ($real === false || !self::inside($share['root'], $real)) throw new NufError('err_outside', 403);
		if (self::denied($share, $seg, $real)) throw new NufError('err_not_found', 404);
		return $real;
	}

	/** An existing folder of a share (realpath). */
	public static function folder(array $share, string $rel): string
	{
		$real = self::existing($share, $rel);
		if (!is_dir($real)) throw new NufError('err_not_folder');
		return $real;
	}

	/** Absolute path for a NEW entry $name in the existing folder $relDir (name checked, must not exist yet). */
	public static function fresh(array $share, string $relDir, string $name, bool $isDir): string
	{
		$dir = self::folder($share, $relDir);
		self::checkName($name, $share, $isDir);
		$seg = array_merge(self::segments($relDir), [$name]);
		if (self::denied($share, $seg)) throw new NufError('err_name_reserved');
		$abs = $dir . '/' . $name;
		if (file_exists($abs) || is_link($abs)) throw new NufError('err_exists', 409, [$name]);
		return $abs;
	}

	/** Relative path of an absolute path inside a share ('' = the root). */
	public static function rel(array $share, string $abs): string
	{
		$root = rtrim($share['root'], '/');
		return $abs === $root ? '' : ltrim(substr($abs, strlen($root)), '/');
	}

	/** "name (2).ext" – the first free name in $dir. */
	public static function unique(string $dir, string $name): string
	{
		if (!file_exists($dir . '/' . $name) && !is_link($dir . '/' . $name)) return $name;
		$dot = strpos($name, '.', 1);
		$stem = $dot === false ? $name : substr($name, 0, $dot);
		$ext = $dot === false ? '' : substr($name, $dot);
		for ($i = 2; $i < 10000; $i++) {
			$try = $stem . ' (' . $i . ')' . $ext;
			if (!file_exists($dir . '/' . $try) && !is_link($dir . '/' . $try)) return $try;
		}
		throw new NufError('err_exists', 409, [$name]);
	}

	/**
	 * Content check for uploads and unzip into a "files" share: PHP code hidden in a harmless-looking file (polyglots), and
	 * HTML / SVG when web_active_types is off. Reads the first 64 KB.
	 */
	public static function checkContent(string $file, array $share): void
	{
		if (($share['type'] ?? 'files') === 'code' || empty($share['content_check'])) return;
		$h = @fopen($file, 'rb');
		if (!$h) return;
		$head = (string)fread($h, 65536);
		fclose($h);
		self::checkText($head, $share);
	}

	/**
	 * The same check for text that is about to be saved (editor). "<?php" always; the short "<?=" only in text (no NUL byte) – three
	 * bytes turn up by chance in every few hundred binary files (images, PDFs), so binaries would be refused at random.
	 */
	public static function checkText(string $text, array $share): void
	{
		if (($share['type'] ?? 'files') === 'code' || empty($share['content_check'])) return;
		if (stripos($text, '<?php') !== false) throw new NufError('err_content_php');
		if (!str_contains(substr($text, 0, 65536), "\0") && str_contains($text, '<?=')) throw new NufError('err_content_php');
		if (empty($share['web_active_types']) && function_exists('finfo_buffer')) {
			$mime = (string)finfo_buffer(finfo_open(FILEINFO_MIME_TYPE), substr($text, 0, 65536));
			if (in_array($mime, ['text/html', 'image/svg+xml', 'application/xhtml+xml', 'text/xml', 'application/xml'], true)) throw new NufError('err_content_web', 400, [$mime]);
		}
	}
}
// ------------------------------------------------------------------ lib/config.php
/**
 * nuFiles – configuration from the page settings JSON (form builder → Settings), see settings.example.json and README.md.
 *
 * shares[]: id, label, path, type ("files" | "code"), readonly, extensions, max_upload_mb, show_hidden, web_active_types,
 *           content_check, editor, zip, trash, deny[], grants[] {permission | access, rights[]}
 * Paths may start with {DOCUMENT_ROOT}, {NUNEXT}, {NUBUILDER} or {PAGE}; the folder must exist.
 * Rights: view, upload, mkdir, edit, rename, copy, delete, zip. Every right includes view.
 *   - globeadmin: every right on every share (a readonly share stays read-only)
 *   - type "code": globeadmin only, grants are ignored (editing code = full server access)
 *   - other users: the union of the grants whose permission item (or access level code) they hold
 */
final class NufConfig
{
	public const RIGHTS = ['view', 'upload', 'mkdir', 'edit', 'rename', 'copy', 'delete', 'zip'];
	public const WRITES = ['upload', 'mkdir', 'edit', 'rename', 'copy', 'delete', 'zip'];

	/** Absolute data folder (trash, versions, tmp) – set by load(). */
	public static string $dataDir = '';
	/** @var array<string, array> share id => share with root (realpath) and rights of the current user */
	public static array $shares = [];
	/** Problems in the settings, shown to the globeadmin only. */
	public static array $problems = [];
	public static array $limits = [];

	public static function load(NufCtx $nu): void
	{
		self::$problems = [];
		self::$limits = [
			'max_upload_mb'   => max(1, (int)$nu->setting('max_upload_mb', 200)),
			'chunk_mb'        => max(1, min(32, (int)$nu->setting('chunk_mb', 2))),
			'zip_max_mb'      => max(1, (int)$nu->setting('zip_max_mb', 500)),
			'zip_max_entries' => max(1, (int)$nu->setting('zip_max_entries', 5000)),
			'copy_max_mb'     => max(1, (int)$nu->setting('copy_max_mb', 2000)),
			'editor_max_kb'   => max(16, (int)$nu->setting('editor_max_kb', 2048)),
			'search_max'      => max(10, min(5000, (int)$nu->setting('search_max_results', 500))),
			'trash_days'      => max(0, (int)$nu->setting('trash_days', 30)),
			'versions_keep'   => max(0, (int)$nu->setting('versions_keep', 10)),
			'list_max'        => max(100, (int)$nu->setting('list_max_entries', 10000)),
		];
		self::$dataDir = self::dataDir($nu);

		$user = $nu->user();
		$ga = $nu->isGlobeadmin();
		$ro = $nu->readOnly();
		$perms = array_map('strtolower', $nu->permissions());
		$access = strtolower((string)($user['access_code'] ?? ''));

		self::$shares = [];
		$list = $nu->setting('shares', []);
		if (!is_array($list)) { self::$problems[] = 'shares must be a list'; $list = []; }
		foreach ($list as $i => $s) {
			if (!is_array($s)) { self::$problems[] = "shares[$i] is not an object"; continue; }
			$id = (string)($s['id'] ?? '');
			if (!preg_match('/^[a-z0-9][a-z0-9_-]{0,39}$/', $id) || isset(self::$shares[$id])) { self::$problems[] = "shares[$i]: invalid or duplicate id \"$id\""; continue; }
			$type = ($s['type'] ?? 'files') === 'code' ? 'code' : 'files';
			$root = self::resolvePath($nu, (string)($s['path'] ?? ''));
			$share = [
				'id' => $id,
				'label' => trim((string)($s['label'] ?? '')) !== '' ? trim((string)$s['label']) : $id,
				'type' => $type,
				'readonly' => !empty($s['readonly']),
				'extensions' => self::extList($s['extensions'] ?? ''),
				'max_upload' => (int)(max(1, (int)($s['max_upload_mb'] ?? self::$limits['max_upload_mb'])) * 1048576),
				'show_hidden' => array_key_exists('show_hidden', $s) ? !empty($s['show_hidden']) : $type === 'code',
				'web_active_types' => !empty($s['web_active_types']),
				'content_check' => array_key_exists('content_check', $s) ? !empty($s['content_check']) : true,
				'editor' => array_key_exists('editor', $s) ? !empty($s['editor']) : true,
				'zip' => array_key_exists('zip', $s) ? !empty($s['zip']) : true,
				'trash' => array_key_exists('trash', $s) ? !empty($s['trash']) : true,
				'deny' => array_values(array_filter(array_map('strval', is_array($s['deny'] ?? null) ? $s['deny'] : []), 'strlen')),
				'root' => $root ?? '',
				'ok' => $root !== null,
			];
			if ($root === null) self::$problems[] = "share \"$id\": folder not found or not readable (" . (string)($s['path'] ?? '') . ')';
			elseif (self::$dataDir !== '' && NufGuard::inside(self::$dataDir, $root)) { self::$problems[] = "share \"$id\": lies inside the nuFiles data folder"; $share['ok'] = false; }

			// rights of the current user
			$rights = [];
			if ($ga) {
				$rights = self::RIGHTS;
			} elseif ($type === 'files') {
				foreach (is_array($s['grants'] ?? null) ? $s['grants'] : [] as $g) {
					if (!is_array($g)) continue;
					$match = false;
					if (!empty($g['tfm_users']) && !empty($user['tfm'])) $match = true;                 // Forte: $nuConfigFileMangerUsers
					foreach ((array)($g['login'] ?? []) as $lg) if (strcasecmp(trim((string)$lg), (string)$user['login']) === 0) $match = true;
					foreach ((array)($g['permission'] ?? []) as $p) if (in_array(strtolower(trim((string)$p)), $perms, true)) $match = true;
					foreach ((array)($g['access'] ?? []) as $a) if ($access !== '' && strtolower(trim((string)$a)) === $access) $match = true;
					if ($match) $rights = array_merge($rights, array_intersect(self::RIGHTS, array_map('strval', (array)($g['rights'] ?? []))));
				}
				if ($rights) $rights[] = 'view';
			}
			if ($share['readonly'] || $ro) $rights = array_intersect($rights, ['view']);
			if (!$share['editor']) $rights = array_diff($rights, ['edit']);
			if (!$share['zip']) $rights = array_diff($rights, ['zip']);
			$share['rights'] = array_values(array_unique($rights));
			if (!in_array('view', $share['rights'], true)) continue;     // invisible
			if (!$share['ok'] && !$ga) continue;
			self::$shares[$id] = $share;
		}
	}

	/** The share of a request with the right $right – throws 404 / 403. */
	public static function share(string $id, string $right = 'view'): array
	{
		$s = self::$shares[$id] ?? null;
		if (!$s) throw new NufError('err_share', 404);
		if (!$s['ok']) throw new NufError('err_share_broken', 500);
		if (!in_array($right, $s['rights'], true)) throw new NufError($s['readonly'] && $right !== 'view' ? 'err_readonly' : 'err_right', 403, [$right]);
		return $s;
	}

	public static function can(array $share, string $right): bool
	{
		return in_array($right, $share['rights'], true);
	}

	/** {DOCUMENT_ROOT}, {NUNEXT}, {NUBUILDER}, {PAGE} + rest → realpath of an existing readable folder, or null. */
	public static function resolvePath(NufCtx $nu, string $path): ?string
	{
		$path = trim($path);
		if ($path === '' || str_contains($path, "\0")) return null;
		$map = [
			'{DOCUMENT_ROOT}' => (string)($_SERVER['DOCUMENT_ROOT'] ?? ''),
			'{FORTE}' => NUF_FORTE_ROOT,
			'{NUNEXT}' => NUF_FORTE_ROOT,
			'{NUBUILDER}' => NUF_FORTE_ROOT,
			'{PAGE}' => $nu->dir(),
		];
		foreach ($map as $k => $v) {
			if (str_starts_with($path, $k)) { if ($v === '') return null; $path = rtrim($v, '/') . substr($path, strlen($k)); break; }
		}
		if (!str_starts_with($path, '/') && !preg_match('~^[A-Za-z]:[\\\\/]~', $path)) return null;   // absolute only
		$real = realpath($path);
		if ($real === false || !is_dir($real) || !is_readable($real)) return null;
		return rtrim(str_replace('\\', '/', $real), '/') ?: '/';
	}

	/** Data folder: setting data_dir or <page>/_data; created with deny-all protection. '' when it cannot be created. */
	private static function dataDir(NufCtx $nu): string
	{
		$d = trim((string)$nu->setting('data_dir', ''));
		if ($d !== '') {
			foreach (['{FORTE}' => NUF_FORTE_ROOT, '{NUNEXT}' => NUF_FORTE_ROOT, '{NUBUILDER}' => NUF_FORTE_ROOT, '{PAGE}' => $nu->dir()] as $k => $v) {
				if (str_starts_with($d, $k)) { $d = rtrim($v, '/') . substr($d, strlen($k)); break; }
			}
		} else {
			$d = (string)(NufApi::future($nu, 'dataDir') ?? $nu->dir() . '/_data');   // core change C4 when it exists
		}
		foreach (['', '/trash', '/versions', '/tmp'] as $sub) {
			if (!is_dir($d . $sub) && !@mkdir($d . $sub, 0770, true)) { self::$problems[] = 'data folder cannot be created: ' . $d . $sub; return ''; }
		}
		if (!is_file($d . '/.htaccess')) @file_put_contents($d . '/.htaccess', "Require all denied\nDeny from all\n");
		if (!is_file($d . '/index.html')) @file_put_contents($d . '/index.html', '');
		$real = realpath($d);
		return $real === false ? '' : rtrim(str_replace('\\', '/', $real), '/');
	}

	/** "pdf, .DOCX" or ["pdf","docx"] → ['pdf', 'docx'] */
	private static function extList(mixed $v): array
	{
		$items = is_array($v) ? $v : explode(',', (string)$v);
		return array_values(array_unique(array_filter(array_map(static fn($e) => strtolower(ltrim(trim((string)$e), '.')), $items), 'strlen')));
	}

	/** Public description of the shares for the browser (no absolute paths for users). */
	public static function publicShares(bool $ga): array
	{
		$out = [];
		foreach (self::$shares as $s) {
			$out[] = ['id' => $s['id'], 'label' => $s['label'], 'type' => $s['type'], 'readonly' => $s['readonly'], 'rights' => $s['rights'],
				'ok' => $s['ok'], 'extensions' => $s['extensions'], 'max_upload' => $s['max_upload'], 'trash' => $s['trash'],
				'root' => $ga ? $s['root'] : null];
		}
		return $out;
	}
}
// ------------------------------------------------------------------ lib/fs.php
/**
 * nuFiles – file system operations. All paths given here are already resolved by NufGuard (realpaths inside a share root),
 * except where a method takes a share + relative path itself. Nothing here trusts the browser.
 */
final class NufFs
{
	/** Text types the editor opens (others: if the content is valid UTF-8 without NUL bytes). */
	public const TEXT_EXT = ['txt', 'md', 'csv', 'tsv', 'log', 'json', 'xml', 'html', 'htm', 'css', 'scss', 'less', 'js', 'mjs', 'ts', 'php', 'phtml', 'inc',
		'sql', 'ini', 'conf', 'cfg', 'yml', 'yaml', 'env', 'htaccess', 'sh', 'py', 'rb', 'pl', 'java', 'c', 'h', 'cpp', 'cs', 'go', 'vue', 'svg', 'tpl', 'twig', 'bat', 'ps1', 'properties', 'gitignore'];
	/** Inline previews: sniffed MIME types that a browser shows without running code. */
	public const INLINE = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/bmp', 'image/avif', 'image/x-icon', 'image/vnd.microsoft.icon',
		'application/pdf', 'video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/mp4', 'audio/flac', 'text/plain'];

	// ============================================================ listing and search

	public static function entry(array $share, string $abs, string $name): array
	{
		$isLink = is_link($abs);
		$real = $isLink ? realpath($abs) : $abs;
		$outside = $isLink && ($real === false || !NufGuard::inside($share['root'], $real));
		$isDir = !$outside && is_dir($abs);
		$st = @lstat($abs) ?: [];
		$size = $outside ? 0 : ($isDir ? 0 : (int)@filesize($abs));
		return [
			'name' => $name, 'type' => $isDir ? 'dir' : 'file', 'link' => $isLink, 'outside' => $outside,
			'size' => $size, 'mtime' => (int)($st['mtime'] ?? 0), 'ext' => $isDir ? '' : NufGuard::lastExtension($name),
			'writable' => !$outside && is_writable($abs), 'perms' => isset($st['mode']) ? substr(sprintf('%o', $st['mode']), -4) : '',
		];
	}

	public static function listDir(array $share, string $rel, int $max): array
	{
		$dir = NufGuard::folder($share, $rel);
		$seg = NufGuard::segments($rel);
		$items = [];
		$truncated = false;
		$h = @opendir($dir);
		if (!$h) throw new NufError('err_read', 500);
		while (($n = readdir($h)) !== false) {
			if ($n === '.' || $n === '..') continue;
			$abs = $dir . '/' . $n;
			$real = is_link($abs) ? (realpath($abs) ?: null) : $abs;
			if (NufGuard::denied($share, array_merge($seg, [$n]), $real)) continue;
			if (count($items) >= $max) { $truncated = true; break; }
			$items[] = self::entry($share, $abs, $n);
		}
		closedir($h);
		usort($items, static fn($a, $b) => [$a['type'] !== 'dir', mb_strtolower($a['name'])] <=> [$b['type'] !== 'dir', mb_strtolower($b['name'])]);
		return ['path' => NufGuard::join($seg), 'items' => $items, 'truncated' => $truncated,
			'writable' => is_writable($dir), 'free' => @disk_free_space($dir) ?: null];
	}

	/** Name search below $rel: case-insensitive part of the name, or a pattern with * and ?. No symlinks followed. */
	public static function search(array $share, string $rel, string $q, int $max): array
	{
		$start = NufGuard::folder($share, $rel);
		$q = trim($q);
		if ($q === '' || mb_strlen($q) > 200) throw new NufError('err_search');
		$glob = strpbrk($q, '*?') !== false;
		$needle = mb_strtolower($q);
		$found = [];
		$stack = [[$start, NufGuard::segments($rel), 0]];
		$t0 = microtime(true);
		$scanned = 0;
		$partial = false;
		while ($stack) {
			[$dir, $seg, $depth] = array_pop($stack);
			$h = @opendir($dir);
			if (!$h) continue;
			while (($n = readdir($h)) !== false) {
				if ($n === '.' || $n === '..') continue;
				$abs = $dir . '/' . $n;
				$s = array_merge($seg, [$n]);
				if (NufGuard::denied($share, $s, $abs)) continue;
				if (++$scanned % 500 === 0 && microtime(true) - $t0 > 8) { $partial = true; break 2; }
				$hit = $glob ? fnmatch($needle, mb_strtolower($n)) : str_contains(mb_strtolower($n), $needle);
				if ($hit) {
					$e = self::entry($share, $abs, $n);
					$e['dir'] = NufGuard::join($seg);
					$found[] = $e;
					if (count($found) >= $max) { $partial = true; break 2; }
				}
				if (!is_link($abs) && is_dir($abs) && $depth < 25) $stack[] = [$abs, $s, $depth + 1];
			}
			closedir($h);
		}
		return ['items' => $found, 'partial' => $partial, 'scanned' => $scanned];
	}

	// ============================================================ create, rename, move, copy

	public static function mkdir(array $share, string $relDir, string $name): string
	{
		$abs = NufGuard::fresh($share, $relDir, $name, true);
		if (!@mkdir($abs, 0775)) throw new NufError('err_write', 500);
		return $abs;
	}

	public static function newFile(array $share, string $relDir, string $name): string
	{
		$abs = NufGuard::fresh($share, $relDir, $name, false);
		$h = @fopen($abs, 'x');             // x = fails when it exists (no race)
		if (!$h) throw new NufError('err_write', 500);
		fclose($h);
		return $abs;
	}

	/** Rename in place. */
	public static function rename(array $share, string $rel, string $newName): array
	{
		$src = NufGuard::existing($share, $rel, false);
		$isDir = is_dir($src) && !is_link($src);
		$seg = NufGuard::segments($rel);
		array_pop($seg);
		$dst = NufGuard::fresh($share, NufGuard::join($seg), $newName, $isDir);
		if (!@rename($src, $dst)) throw new NufError('err_write', 500);
		return [$src, $dst];
	}

	/**
	 * Moves or copies $rels (relative to $from) into the folder $toRel of share $to. Existing names get " (2)".
	 * @return list<array{0:string,1:string}> [source rel, target rel]
	 */
	public static function transfer(array $from, array $rels, array $to, string $toRel, bool $copy, array $limits): array
	{
		$target = NufGuard::folder($to, $toRel);
		$done = [];
		$budget = ['files' => 0, 'bytes' => 0, 'max_files' => $limits['zip_max_entries'] * 10, 'max_bytes' => $limits['copy_max_mb'] * 1048576];
		$cross = $from['id'] !== $to['id'];                                           // into another share: its content rules apply too
		foreach ($rels as $rel) {
			$src = NufGuard::existing($from, (string)$rel, false);
			$name = basename($src);
			$isDir = is_dir($src) && !is_link($src);
			NufGuard::checkName($name, $to, $isDir);
			if ($isDir && NufGuard::inside($src, $target)) throw new NufError('err_into_self');
			if (!$copy && dirname($src) === $target) continue;                         // already there
			$dstName = NufGuard::unique($target, $name);
			$dst = $target . '/' . $dstName;
			if (!$isDir && $cross) NufGuard::checkContent($src, $to);
			if ($copy) {
				if ($isDir) self::checkTree($src, $to, $budget, $cross);
				self::copyAny($src, $dst, $budget);
			} else {
				$free = ['files' => 0, 'bytes' => 0, 'max_files' => PHP_INT_MAX, 'max_bytes' => PHP_INT_MAX];
				if ($isDir) self::checkTree($src, $to, $free, $cross);
				if (!@rename($src, $dst)) {                                             // other file system: copy, then delete
					self::copyAny($src, $dst, $budget);
					self::removeTree($src);
				}
			}
			$done[] = [NufGuard::rel($from, $src), NufGuard::rel($to, $dst)];
		}
		return $done;
	}

	/** Every name inside a folder that goes to another share must pass that share's rules (no .php smuggled in via a folder). */
	private static function checkTree(string $dir, array $share, array &$budget, bool $content = false): void
	{
		$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::SELF_FIRST);
		foreach ($it as $f) {
			/** @var SplFileInfo $f */
			if ($f->isLink()) throw new NufError('err_link_in_tree');
			NufGuard::checkName($f->getFilename(), $share, $f->isDir());
			if ($content && $f->isFile()) NufGuard::checkContent($f->getPathname(), $share);
			if (++$budget['files'] > $budget['max_files']) throw new NufError('err_too_many');
		}
	}

	private static function copyAny(string $src, string $dst, array &$budget): void
	{
		if (is_link($src)) throw new NufError('err_link_in_tree');
		if (is_dir($src)) {
			if (!@mkdir($dst, 0775)) throw new NufError('err_write', 500);
			foreach (scandir($src) ?: [] as $n) {
				if ($n === '.' || $n === '..') continue;
				self::copyAny($src . '/' . $n, $dst . '/' . $n, $budget);
			}
			return;
		}
		$budget['bytes'] += (int)filesize($src);
		if ($budget['bytes'] > $budget['max_bytes']) throw new NufError('err_too_big');
		if (!@copy($src, $dst)) throw new NufError('err_write', 500);
	}

	public static function removeTree(string $path): void
	{
		if (is_link($path) || !is_dir($path)) { if (!@unlink($path)) throw new NufError('err_write', 500); return; }
		foreach (scandir($path) ?: [] as $n) {
			if ($n === '.' || $n === '..') continue;
			self::removeTree($path . '/' . $n);
		}
		if (!@rmdir($path)) throw new NufError('err_write', 500);
	}

	// ============================================================ permissions (globeadmin)

	/** chmod works here (not on Windows, not disabled by the host). */
	public static function chmodAvailable(): bool
	{
		return PHP_OS_FAMILY !== 'Windows' && function_exists('chmod') && function_exists('fileperms');
	}

	/** Owner and group of a path (names when posix is there, else the numbers). */
	public static function owner(string $abs): array
	{
		$uid = @fileowner($abs); $gid = @filegroup($abs);
		if ($uid === false) return [];
		// every posix_* function on its own: hosts disable single ones (disable_functions) – e.g. posix_geteuid there, posix_getpwuid not (0.8.813)
		$user = static fn(int $id): string => function_exists('posix_getpwuid') && is_array($r = @posix_getpwuid($id)) && !empty($r['name']) ? (string)$r['name'] : (string)$id;
		$u = $user((int)$uid);
		$g = function_exists('posix_getgrgid') && is_array($r = @posix_getgrgid((int)$gid)) && !empty($r['name']) ? (string)$r['name'] : (string)$gid;
		$me = function_exists('posix_geteuid') ? $user((int)posix_geteuid()) : '';
		return ['owner' => $u, 'group' => $g, 'server_user' => $me, 'mode' => substr(sprintf('%o', (int)@fileperms($abs)), -3)];
	}

	/**
	 * Sets the permissions. $mode: three octal digits (no setuid / setgid / sticky); the owner keeps read (folders also execute), so the web
	 * server does not lock itself out. Recursive: folders get $mode, files $mode without execute bits; links are skipped, not followed.
	 * @return array{done: int, failed: int, links: int}
	 */
	public static function chmod(array $share, string $rel, string $mode, bool $recursive, int $cap): array
	{
		if (!preg_match('/^[0-7]{3}$/', $mode)) throw new NufError('err_chmod_mode');
		$m = octdec($mode);
		if (($m & 0400) === 0) throw new NufError('err_chmod_mode');
		$seg = NufGuard::segments($rel);
		if (!$seg) throw new NufError('err_root');
		if (is_link($share['root'] . '/' . NufGuard::join($seg))) throw new NufError('err_chmod_link');
		$abs = NufGuard::existing($share, $rel, false);
		$isDir = is_dir($abs);
		if ($isDir && ($m & 0100) === 0) throw new NufError('err_chmod_mode');
		$fileMode = $m & ~0111;
		$out = ['done' => 0, 'failed' => 0, 'links' => 0];
		$set = static function (string $p, int $md) use (&$out): void { clearstatcache(true, $p); if (@chmod($p, $md)) $out['done']++; else $out['failed']++; };
		if ($recursive && $isDir) {
			$n = 0;
			$walk = static function (string $dir) use (&$walk, &$n, &$out, $set, $m, $fileMode, $cap): void {
				foreach (scandir($dir) ?: [] as $name) {
					if ($name === '.' || $name === '..') continue;
					$p = $dir . '/' . $name;
					if (NufConfig::$dataDir !== '' && NufGuard::inside(NufConfig::$dataDir, $p)) continue;   // nuFiles' own data folder: never
					if (++$n > $cap) throw new NufError('err_too_many');
					if (is_link($p)) { $out['links']++; continue; }
					if (is_dir($p)) { $set($p, $m); $walk($p); } else $set($p, $fileMode);
				}
			};
			$walk($abs);
		}
		$set($abs, $m);
		if ($out['failed'] && $out['done'] === 0) throw new NufError('err_chmod', 500);
		return $out;
	}

	public static function treeSize(string $path, int $cap = 100000): array
	{
		if (!is_dir($path) || is_link($path)) return ['files' => 1, 'bytes' => (int)@filesize($path)];
		$files = 0; $bytes = 0;
		$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS));
		foreach ($it as $f) { $files++; $bytes += (int)$f->getSize(); if ($files > $cap) break; }
		return ['files' => $files, 'bytes' => $bytes];
	}

	// ============================================================ trash

	/**
	 * Deletes: into the trash (data folder) when the share has trash on, else for good.
	 * @return string the trash id ('' when deleted for good)
	 */
	public static function delete(array $share, string $rel, array $user): string
	{
		$src = NufGuard::existing($share, $rel, false);
		if (!$share['trash'] || NufConfig::$dataDir === '') { self::removeTree($src); return ''; }
		$id = date('Ymd-His') . '-' . bin2hex(random_bytes(6));
		$box = NufConfig::$dataDir . '/trash/' . $id;
		if (!@mkdir($box, 0770)) throw new NufError('err_write', 500);
		$size = self::treeSize($src);
		$meta = ['id' => $id, 'share' => $share['id'], 'path' => NufGuard::rel($share, $src), 'name' => basename($src),
			'type' => is_dir($src) && !is_link($src) ? 'dir' : 'file', 'deleted_at' => time(), 'user' => $user['login'] ?: $user['id'],
			'files' => $size['files'], 'bytes' => $size['bytes']];
		$dst = $box . '/item';
		if (!@rename($src, $dst)) {
			$b = ['files' => 0, 'bytes' => 0, 'max_files' => PHP_INT_MAX, 'max_bytes' => PHP_INT_MAX];
			self::copyAny($src, $dst, $b);
			self::removeTree($src);
		}
		file_put_contents($box . '/meta.json', json_encode($meta, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
		return $id;
	}

	/** Trash entries of the given share ids (null = all). */
	public static function trashList(?array $shareIds): array
	{
		$out = [];
		if (NufConfig::$dataDir === '') return $out;
		foreach (glob(NufConfig::$dataDir . '/trash/*/meta.json') ?: [] as $m) {
			$meta = json_decode((string)@file_get_contents($m), true);
			if (!is_array($meta)) continue;
			if ($shareIds !== null && !in_array($meta['share'] ?? '', $shareIds, true)) continue;
			$out[] = $meta;
		}
		usort($out, static fn($a, $b) => ($b['deleted_at'] ?? 0) <=> ($a['deleted_at'] ?? 0));
		return $out;
	}

	public static function trashMeta(string $id): array
	{
		if (!preg_match('/^\d{8}-\d{6}-[0-9a-f]{12}$/', $id)) throw new NufError('err_not_found', 404);
		$meta = json_decode((string)@file_get_contents(NufConfig::$dataDir . '/trash/' . $id . '/meta.json'), true);
		if (!is_array($meta)) throw new NufError('err_not_found', 404);
		return $meta;
	}

	/** Back to the original folder (or the share root if that is gone); a taken name gets " (2)". */
	public static function restore(array $share, array $meta): string
	{
		$box = NufConfig::$dataDir . '/trash/' . $meta['id'];
		$seg = NufGuard::segments((string)$meta['path']);
		$name = array_pop($seg);
		try { $dir = NufGuard::folder($share, NufGuard::join($seg)); } catch (NufError) { $dir = $share['root']; }
		NufGuard::checkName((string)$name, $share, ($meta['type'] ?? '') === 'dir');
		$dst = $dir . '/' . NufGuard::unique($dir, (string)$name);
		if (!@rename($box . '/item', $dst)) {
			$b = ['files' => 0, 'bytes' => 0, 'max_files' => PHP_INT_MAX, 'max_bytes' => PHP_INT_MAX];
			self::copyAny($box . '/item', $dst, $b);
			self::removeTree($box . '/item');
		}
		self::removeTree($box);
		return $dst;
	}

	public static function purge(string $id): void
	{
		self::trashMeta($id);
		self::removeTree(NufConfig::$dataDir . '/trash/' . $id);
	}

	/** Housekeeping, at most once per hour: trash older than trash_days, versions beyond versions_keep, upload chunks older than 1 day. */
	public static function housekeeping(array $limits): void
	{
		$d = NufConfig::$dataDir;
		if ($d === '') return;
		$stamp = $d . '/.nufiles-housekeeping';
		if (is_file($stamp) && filemtime($stamp) > time() - 3600) return;
		@touch($stamp);
		if ($limits['trash_days'] > 0) {
			foreach (self::trashList(null) as $m) {
				if (($m['deleted_at'] ?? time()) < time() - $limits['trash_days'] * 86400) { try { self::purge((string)$m['id']); } catch (Throwable) {} }
			}
		}
		foreach (glob($d . '/tmp/*') ?: [] as $f) if (@filemtime($f) < time() - 86400) @unlink($f);
		foreach (glob($d . '/thumbs/*/*') ?: [] as $f) if (@filemtime($f) < time() - self::THUMB_KEEP_DAYS * 86400) @unlink($f);   // not shown for a month, or of a file that changed / is gone
	}

	// ============================================================ thumbnails (grid view)

	public const THUMB_PX = 256;            // longest side
	public const THUMB_MAX_BYTES = 40 * 1024 * 1024;
	public const THUMB_MAX_PIXELS = 50_000_000;
	public const THUMB_KEEP_DAYS = 30;
	private const THUMB_TYPES = [IMAGETYPE_JPEG => 'imagecreatefromjpeg', IMAGETYPE_PNG => 'imagecreatefrompng', IMAGETYPE_GIF => 'imagecreatefromgif', IMAGETYPE_WEBP => 'imagecreatefromwebp'];

	public static function thumbsAvailable(): bool
	{
		return function_exists('imagecreatetruecolor') && function_exists('getimagesize') && function_exists('imagecopyresampled') && function_exists('imagepng');
	}

	/** Bytes PHP may still use (PHP_INT_MAX without a limit). */
	private static function memoryFree(): int
	{
		$l = trim((string)(function_exists('ini_get') ? ini_get('memory_limit') : ''));
		if ($l === '' || $l === '-1') return PHP_INT_MAX;
		$n = (int)$l;
		$n *= match (strtolower(substr($l, -1))) { 'g' => 1 << 30, 'm' => 1 << 20, 'k' => 1 << 10, default => 1 };
		return max(0, $n - memory_get_usage(true));
	}

	/**
	 * The thumbnail of an image as [bytes, mime], or null (no GD, not a picture GD reads, too large for the memory).
	 * Kept in <data>/thumbs/<share>/<sha1(path|mtime|size)> – a changed file gets a new one, the old one goes with housekeeping.
	 */
	public static function thumb(array $share, string $abs): ?array
	{
		if (!self::thumbsAvailable()) return null;
		$size = (int)@filesize($abs);
		if ($size <= 0 || $size > self::THUMB_MAX_BYTES) return null;
		$cache = '';
		if (NufConfig::$dataDir !== '') {
			$dir = NufConfig::$dataDir . '/thumbs/' . preg_replace('/[^A-Za-z0-9_-]/', '_', (string)$share['id']);
			$cache = $dir . '/' . sha1(NufGuard::rel($share, $abs) . '|' . (int)@filemtime($abs) . '|' . $size);
			foreach (['jpg' => 'image/jpeg', 'png' => 'image/png'] as $e => $mime) {
				if (is_file("$cache.$e")) {
					if (@filemtime("$cache.$e") < time() - 86400) @touch("$cache.$e");   // still in use
					return [(string)file_get_contents("$cache.$e"), $mime];
				}
			}
		}
		$info = @getimagesize($abs);
		if (!$info || !isset(self::THUMB_TYPES[$info[2]]) || !function_exists(self::THUMB_TYPES[$info[2]])) return null;
		[$w, $h] = $info;
		if ($w < 1 || $h < 1 || $w * $h > self::THUMB_MAX_PIXELS || $w * $h * 5 + (8 << 20) > self::memoryFree()) return null;
		$src = @(self::THUMB_TYPES[$info[2]])($abs);
		if (!$src) return null;
		if ($info[2] === IMAGETYPE_JPEG && function_exists('exif_read_data') && function_exists('imagerotate')) {
			$o = (int)(@exif_read_data($abs)['Orientation'] ?? 1);
			$deg = [3 => 180, 6 => -90, 8 => 90][$o] ?? 0;
			if ($deg) { $r = imagerotate($src, $deg, 0); if ($r) { $src = $r; $w = imagesx($src); $h = imagesy($src); } }
		}
		$k = min(1, self::THUMB_PX / max($w, $h));
		$tw = max(1, (int)round($w * $k)); $th = max(1, (int)round($h * $k));
		$dst = imagecreatetruecolor($tw, $th);
		$alpha = $info[2] !== IMAGETYPE_JPEG;
		if ($alpha) { imagealphablending($dst, false); imagesavealpha($dst, true); imagefill($dst, 0, 0, imagecolorallocatealpha($dst, 0, 0, 0, 127)); }
		imagecopyresampled($dst, $src, 0, 0, 0, 0, $tw, $th, $w, $h);
		ob_start();
		if ($alpha || !function_exists('imagejpeg')) { imagepng($dst, null, 7); $ext = 'png'; $mime = 'image/png'; }
		else { imagejpeg($dst, null, 82); $ext = 'jpg'; $mime = 'image/jpeg'; }
		$bytes = (string)ob_get_clean();
		if ($bytes === '') return null;
		if ($cache !== '') {
			if (!is_dir(dirname($cache))) @mkdir(dirname($cache), 0775, true);
			if (@file_put_contents("$cache.$ext.part", $bytes) !== false) @rename("$cache.$ext.part", "$cache.$ext");
		}
		return [$bytes, $mime];
	}

	/** Answers with the thumbnail (or a small SVG as it is – as a picture, scripts off) and ends the request; 204 (empty) when there is none. */
	public static function sendThumb(array $share, string $abs): never
	{
		$out = null;
		if (strtolower(pathinfo($abs, PATHINFO_EXTENSION)) === 'svg') {
			if ((int)filesize($abs) <= 1024 * 1024 && in_array(self::mime($abs), ['image/svg+xml', 'image/svg', 'text/xml', 'application/xml', 'text/plain', 'text/html'], true)) $out = [(string)file_get_contents($abs), 'image/svg+xml'];
		} else {
			try { $out = self::thumb($share, $abs); } catch (Throwable) { $out = null; }
		}
		while (ob_get_level() > 0) ob_end_clean();
		header_remove('Content-Security-Policy');
		header('Content-Security-Policy: default-src \'none\'; style-src \'unsafe-inline\'; sandbox');
		header('X-Content-Type-Options: nosniff');
		if ($out === null) { http_response_code(204); header('Cache-Control: private, max-age=300'); exit; }   // 204, not 404: no error line in the browser's console
		header('Cache-Control: private, max-age=604800');   // the address carries the file's time and size
		header('Content-Type: ' . $out[1]);
		header('Content-Length: ' . strlen($out[0]));
		echo $out[0];
		exit;
	}

	// ============================================================ text editor

	public static function isText(string $abs, int $maxBytes): array
	{
		$size = (int)filesize($abs);
		if ($size > $maxBytes) return [false, 'too_big'];
		$data = (string)file_get_contents($abs);
		if (str_contains($data, "\0")) return [false, 'binary'];
		if (!mb_check_encoding($data, 'UTF-8')) return [false, 'encoding'];
		return [true, $data];
	}

	/**
	 * Saves text atomically: the old version goes to versions/ first, the new content is written to a temporary file in the same
	 * folder and renamed over the old one (keeps the permissions). $expectSha = sha1 of the content the editor loaded ('' = new).
	 */
	public static function save(array $share, string $abs, string $content, string $expectSha, bool $force, int $keep): array
	{
		clearstatcache(true, $abs);
		$exists = is_file($abs);
		if ($exists) {
			$current = (string)file_get_contents($abs);
			if (!$force && $expectSha !== '' && sha1($current) !== $expectSha) throw new NufError('err_conflict', 409);
			if ($keep > 0) self::keepVersion($share, $abs, $current, $keep);
		}
		$dir = dirname($abs);
		$tmp = $dir . '/.nufiles-' . bin2hex(random_bytes(6)) . '.tmp';
		if (@file_put_contents($tmp, $content, LOCK_EX) === false) throw new NufError('err_write', 500);
		if ($exists) @chmod($tmp, fileperms($abs) & 0777);
		if (!@rename($tmp, $abs)) { @unlink($tmp); throw new NufError('err_write', 500); }
		clearstatcache(true, $abs);
		return ['sha' => sha1($content), 'size' => strlen($content), 'mtime' => (int)filemtime($abs)];
	}

	private static function keepVersion(array $share, string $abs, string $current, int $keep): void
	{
		if (NufConfig::$dataDir === '') return;
		$dir = NufConfig::$dataDir . '/versions/' . $share['id'] . '/' . sha1(NufGuard::rel($share, $abs));
		if (!is_dir($dir) && !@mkdir($dir, 0770, true)) return;
		$us = sprintf('%06d', (int)(fmod(microtime(true), 1) * 1000000));      // two saves in one second keep their order
		@file_put_contents($dir . '/' . date('Ymd-His') . '-' . $us . '-' . substr(sha1($current), 0, 8) . '.bak', $current);
		@file_put_contents($dir . '/path.txt', NufGuard::rel($share, $abs));
		$all = glob($dir . '/*.bak') ?: [];
		sort($all);
		while (count($all) > $keep) @unlink(array_shift($all));
	}

	public static function versions(array $share, string $abs): array
	{
		$dir = NufConfig::$dataDir . '/versions/' . $share['id'] . '/' . sha1(NufGuard::rel($share, $abs));
		$out = [];
		foreach (array_reverse(glob($dir . '/*.bak') ?: []) as $f) $out[] = ['id' => basename($f, '.bak'), 'size' => (int)filesize($f), 'mtime' => (int)filemtime($f)];
		return $out;
	}

	public static function versionContent(array $share, string $abs, string $id): string
	{
		if (!preg_match('/^\d{8}-\d{6}-\d{6}-[0-9a-f]{8}$/', $id)) throw new NufError('err_not_found', 404);
		$f = NufConfig::$dataDir . '/versions/' . $share['id'] . '/' . sha1(NufGuard::rel($share, $abs)) . '/' . $id . '.bak';
		if (!is_file($f)) throw new NufError('err_not_found', 404);
		return (string)file_get_contents($f);
	}

	/** PHP syntax check without exec(): token_get_all with TOKEN_PARSE throws ParseError. JSON: json_decode. */
	public static function lint(string $name, string $content): ?array
	{
		$ext = NufGuard::lastExtension($name);
		if (in_array($ext, ['php', 'phtml', 'inc', 'php8', 'php7'], true)) {
			try { token_get_all($content, TOKEN_PARSE); } catch (ParseError $e) { return ['line' => $e->getLine(), 'message' => $e->getMessage()]; }
		}
		if ($ext === 'json' && trim($content) !== '') {
			json_decode($content);
			if (json_last_error() !== JSON_ERROR_NONE) return ['line' => 0, 'message' => json_last_error_msg()];
		}
		return null;
	}

	// ============================================================ uploads in chunks

	/** Starts an upload: checks name, size and rights, writes a ticket into tmp/. */
	public static function uploadInit(array $share, string $relDir, string $name, int $size, bool $overwrite, array $user): array
	{
		$dir = NufGuard::folder($share, $relDir);
		NufGuard::checkName($name, $share, false);
		if (NufGuard::denied($share, array_merge(NufGuard::segments($relDir), [$name]))) throw new NufError('err_name_reserved');
		if ($size < 0 || $size > $share['max_upload']) throw new NufError('err_too_big_upload', 413, [round($share['max_upload'] / 1048576)]);
		$free = @disk_free_space($dir);
		if ($free !== false && $size > $free - 50 * 1048576) throw new NufError('err_disk_full', 507);
		if (NufConfig::$dataDir === '') throw new NufError('err_data_dir', 500);
		$token = bin2hex(random_bytes(16));
		$ticket = ['share' => $share['id'], 'dir' => NufGuard::rel($share, $dir), 'name' => $name, 'size' => $size, 'overwrite' => $overwrite,
			'user' => $user['id'], 'created' => time()];
		file_put_contents(NufConfig::$dataDir . '/tmp/' . $token . '.json', json_encode($ticket));
		touch(NufConfig::$dataDir . '/tmp/' . $token . '.part');
		return ['token' => $token];
	}

	public static function ticket(string $token, array $user): array
	{
		if (!preg_match('/^[0-9a-f]{32}$/', $token)) throw new NufError('err_upload_ticket', 400);
		$t = json_decode((string)@file_get_contents(NufConfig::$dataDir . '/tmp/' . $token . '.json'), true);
		if (!is_array($t) || ($t['user'] ?? null) !== $user['id']) throw new NufError('err_upload_ticket', 400);
		return $t;
	}

	/**
	 * Appends one chunk (uploaded file field "chunk") at $offset. When the last byte is in, the file is checked and moved into place.
	 * @return array{done:bool, received:int, path?:string, name?:string, replaced?:bool}
	 */
	public static function uploadChunk(array $share, string $token, int $offset, array $file, array $ticket, int $chunkMax): array
	{
		$part = NufConfig::$dataDir . '/tmp/' . $token . '.part';
		clearstatcache(true, $part);
		if (!is_file($part)) throw new NufError('err_upload_ticket');
		if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file((string)$file['tmp_name'])) throw new NufError('err_upload_php', 400, [(int)($file['error'] ?? -1)]);
		$len = (int)$file['size'];
		if ($len <= 0 || $len > $chunkMax) throw new NufError('err_upload_chunk');
		if ($offset !== (int)filesize($part)) throw new NufError('err_upload_offset', 409, [(int)filesize($part)]);
		if ($offset + $len > (int)$ticket['size']) throw new NufError('err_upload_chunk');
		$in = fopen((string)$file['tmp_name'], 'rb');
		$out = fopen($part, 'ab');
		if (!$in || !$out) throw new NufError('err_write', 500);
		stream_copy_to_stream($in, $out);
		fclose($in); fclose($out);
		clearstatcache(true, $part);
		$received = (int)filesize($part);
		if ($received < (int)$ticket['size']) return ['done' => false, 'received' => $received];
		return self::uploadFinish($share, $token, $ticket);
	}

	/** Empty files have no chunk: finish right after init. */
	public static function uploadFinish(array $share, string $token, array $ticket): array
	{
		$part = NufConfig::$dataDir . '/tmp/' . $token . '.part';
		try {
			NufGuard::checkContent($part, $share);
			$dir = NufGuard::folder($share, (string)$ticket['dir']);                      // again: the folder may be gone / moved
			NufGuard::checkName((string)$ticket['name'], $share, false);
			$name = (string)$ticket['name'];
			$replaced = false;
			$dst = $dir . '/' . $name;
			if (file_exists($dst) || is_link($dst)) {
				if ($ticket['overwrite'] && is_file($dst) && !is_link($dst)) {
					$replaced = true;
				} else {
					$name = NufGuard::unique($dir, $name);
					$dst = $dir . '/' . $name;
				}
			}
			if ($replaced && $share['trash'] && NufConfig::$dataDir !== '') {
				$tmpCopy = $dst . '.nufiles-old';
				@copy($dst, $tmpCopy);
			}
			if (!@rename($part, $dst)) { if (!@copy($part, $dst)) throw new NufError('err_write', 500); @unlink($part); }
			@chmod($dst, 0664);
			if (isset($tmpCopy) && is_file($tmpCopy)) {
				// keep the replaced file in the trash
				try { self::trashFile($share, $tmpCopy, NufGuard::rel($share, $dst)); } catch (Throwable) { @unlink($tmpCopy); }
			}
			return ['done' => true, 'received' => (int)$ticket['size'], 'path' => NufGuard::rel($share, $dst), 'name' => $name, 'replaced' => $replaced];
		} finally {
			@unlink(NufConfig::$dataDir . '/tmp/' . $token . '.json');
			if (is_file($part)) @unlink($part);
		}
	}

	/** A loose file (the old version of an overwritten upload) into the trash under the path it had. */
	private static function trashFile(array $share, string $file, string $rel): void
	{
		$id = date('Ymd-His') . '-' . bin2hex(random_bytes(6));
		$box = NufConfig::$dataDir . '/trash/' . $id;
		mkdir($box, 0770);
		rename($file, $box . '/item');
		file_put_contents($box . '/meta.json', json_encode(['id' => $id, 'share' => $share['id'], 'path' => $rel, 'name' => basename($rel),
			'type' => 'file', 'deleted_at' => time(), 'user' => 'upload (replaced)', 'files' => 1, 'bytes' => (int)filesize($box . '/item')]));
	}

	// ============================================================ zip

	/** Zips $rels (relative to the share) into a new archive $name in the folder $relDir. */
	public static function zip(array $share, string $relDir, array $rels, string $name, array $limits): string
	{
		if (!class_exists('ZipArchive')) throw new NufError('err_no_zip', 500);
		if (!str_ends_with(strtolower($name), '.zip')) $name .= '.zip';
		$dir = NufGuard::folder($share, $relDir);
		NufGuard::checkName($name, $share, false);
		$dst = $dir . '/' . NufGuard::unique($dir, $name);
		self::zipTo($share, $rels, $dst, $limits);
		return $dst;
	}

	/** Builds a zip file at $dst from share entries (skips symlinks and denied entries). */
	public static function zipTo(array $share, array $rels, string $dst, array $limits): void
	{
		$zip = new ZipArchive();
		if ($zip->open($dst, ZipArchive::CREATE | ZipArchive::EXCL) !== true) throw new NufError('err_write', 500);
		$files = 0; $bytes = 0;
		$add = function (string $abs, string $inZip, array $seg) use (&$add, $zip, $share, &$files, &$bytes, $limits): void {
			if (is_link($abs) || NufGuard::denied($share, $seg, $abs)) return;
			if (++$files > $limits['zip_max_entries']) throw new NufError('err_too_many');
			if (is_dir($abs)) {
				$zip->addEmptyDir($inZip);
				foreach (scandir($abs) ?: [] as $n) {
					if ($n === '.' || $n === '..') continue;
					$add($abs . '/' . $n, $inZip . '/' . $n, array_merge($seg, [$n]));
				}
				return;
			}
			$bytes += (int)filesize($abs);
			if ($bytes > $limits['zip_max_mb'] * 1048576) throw new NufError('err_too_big');
			$zip->addFile($abs, $inZip);
		};
		try {
			foreach ($rels as $rel) {
				$abs = NufGuard::existing($share, (string)$rel, false);
				$add($abs, basename($abs), NufGuard::segments((string)$rel));
			}
		} catch (Throwable $e) {
			$zip->close();
			@unlink($dst);
			throw $e;
		}
		if (!$zip->close()) { @unlink($dst); throw new NufError('err_write', 500); }
	}

	/**
	 * Extracts an archive into a NEW folder next to it ("name" or "name (2)"). Zip-slip safe: every entry name goes through the
	 * guard (no absolute paths, no '..', no backslashes); symlink entries are skipped; total size and entry count are capped
	 * BEFORE anything is written; names a "files" share refuses are skipped and reported.
	 */
	public static function unzip(array $share, string $rel, array $limits): array
	{
		if (!class_exists('ZipArchive')) throw new NufError('err_no_zip', 500);
		$src = NufGuard::existing($share, $rel, false);
		if (!is_file($src)) throw new NufError('err_not_file');
		$zip = new ZipArchive();
		if ($zip->open($src, ZipArchive::RDONLY) !== true) throw new NufError('err_zip_open');
		$n = $zip->numFiles;
		if ($n > $limits['zip_max_entries']) { $zip->close(); throw new NufError('err_too_many'); }
		$total = 0;
		$plan = [];
		$skipped = [];
		for ($i = 0; $i < $n; $i++) {
			$st = $zip->statIndex($i);
			if (!$st) continue;
			$name = (string)$st['name'];
			$opsys = 0; $attr = 0;
			$zip->getExternalAttributesIndex($i, $opsys, $attr);
			$isLink = $opsys === ZipArchive::OPSYS_UNIX && ((($attr >> 16) & 0170000) === 0120000);
			$isDir = str_ends_with($name, '/');
			try {
				if ($isLink) throw new NufError('err_link_in_tree');
				if (str_starts_with($name, '/') || preg_match('~^[A-Za-z]:~', $name)) throw new NufError('err_path');
				$seg = NufGuard::segments(rtrim($name, '/'));
				if (!$seg) continue;
				foreach ($seg as $k => $s) NufGuard::checkName($s, $share, $isDir || $k < count($seg) - 1);
				if (NufGuard::denied($share, $seg)) throw new NufError('err_name_reserved');
			} catch (NufError $e) {
				$skipped[] = ['name' => mb_substr($name, 0, 200), 'reason' => $e->key];
				continue;
			}
			$total += (int)$st['size'];
			if ($total > $limits['zip_max_mb'] * 1048576) { $zip->close(); throw new NufError('err_too_big'); }
			$plan[] = [$i, $seg, $isDir, (int)$st['size']];
		}
		$dir = dirname($src);
		$base = preg_replace('/\.zip$/i', '', basename($src)) ?: 'archive';
		try { NufGuard::checkName($base, $share, true); } catch (NufError) { $base = 'archive'; }
		$target = $dir . '/' . NufGuard::unique($dir, $base);
		if (!@mkdir($target, 0775)) { $zip->close(); throw new NufError('err_write', 500); }
		$written = 0;
		foreach ($plan as [$i, $seg, $isDir, $declared]) {
			$path = $target . '/' . NufGuard::join($seg);
			if ($isDir) { if (!is_dir($path)) @mkdir($path, 0775, true); continue; }
			$parent = dirname($path);
			if (!is_dir($parent)) @mkdir($parent, 0775, true);
			$realParent = realpath($parent);
			if ($realParent === false || !NufGuard::inside($target, $realParent)) { $skipped[] = ['name' => NufGuard::join($seg), 'reason' => 'err_path']; continue; }
			if (file_exists($path)) { $skipped[] = ['name' => NufGuard::join($seg), 'reason' => 'err_exists']; continue; }
			$in = $zip->getStream($zip->getNameIndex($i));
			$out = @fopen($path, 'xb');
			if (!$in || !$out) { $skipped[] = ['name' => NufGuard::join($seg), 'reason' => 'err_write']; continue; }
			$copied = stream_copy_to_stream($in, $out, $declared + 1);      // never more than the archive declared (zip bomb with a lying size)
			fclose($in); fclose($out);
			if ($copied !== $declared) { @unlink($path); $skipped[] = ['name' => NufGuard::join($seg), 'reason' => 'err_zip_size']; continue; }
			try { NufGuard::checkContent($path, $share); } catch (NufError $e) { @unlink($path); $skipped[] = ['name' => NufGuard::join($seg), 'reason' => $e->key]; continue; }
			$written++;
		}
		$zip->close();
		return ['folder' => NufGuard::rel($share, $target), 'files' => $written, 'skipped' => $skipped];
	}

	// ============================================================ sending files

	public static function mime(string $abs): string
	{
		if (!function_exists('finfo_open')) return 'application/octet-stream';
		$m = (string)finfo_file(finfo_open(FILEINFO_MIME_TYPE), $abs);
		return $m !== '' ? $m : 'application/octet-stream';
	}

	/**
	 * Streams a file and ends the request. $inline only for INLINE types (sniffed, not by name); everything else is an attachment.
	 * Supports one byte range (video / audio seeking).
	 */
	public static function send(string $abs, string $name, bool $inline): never
	{
		$size = (int)filesize($abs);
		$mime = self::mime($abs);
		if ($inline && $mime === 'text/plain') $mime = 'text/plain; charset=utf-8';
		$inline = $inline && in_array(explode(';', $mime)[0], self::INLINE, true);
		while (ob_get_level() > 0) ob_end_clean();
		@set_time_limit(0);
		header_remove('Content-Security-Policy');
		header('Content-Security-Policy: default-src \'none\'; img-src \'self\' data:; media-src \'self\'; style-src \'unsafe-inline\'; frame-ancestors \'self\'' . ($mime === 'application/pdf' ? '' : '; sandbox'));
		header('X-Content-Type-Options: nosniff');
		header('Cache-Control: private, no-store');
		header('Content-Type: ' . ($inline ? $mime : 'application/octet-stream'));
		$ascii = preg_replace('/[^\x20-\x7e]|["\\\\]/', '_', $name) ?: 'download';
		header('Content-Disposition: ' . ($inline ? 'inline' : 'attachment') . '; filename="' . $ascii . '"; filename*=UTF-8\'\'' . rawurlencode($name));
		header('Accept-Ranges: bytes');
		$start = 0; $end = $size - 1;
		if (preg_match('/^bytes=(\d*)-(\d*)$/', (string)($_SERVER['HTTP_RANGE'] ?? ''), $m) && $size > 0) {
			if ($m[1] === '' && $m[2] !== '') { $start = max(0, $size - (int)$m[2]); }
			else { $start = (int)$m[1]; if ($m[2] !== '') $end = min($end, (int)$m[2]); }
			if ($start > $end || $start >= $size) { http_response_code(416); header('Content-Range: bytes */' . $size); exit; }
			http_response_code(206);
			header("Content-Range: bytes $start-$end/$size");
		}
		header('Content-Length: ' . ($size === 0 ? 0 : $end - $start + 1));
		if ($_SERVER['REQUEST_METHOD'] === 'HEAD' || $size === 0) exit;
		$h = fopen($abs, 'rb');
		if ($start) fseek($h, $start);
		$left = $end - $start + 1;
		while ($left > 0 && !feof($h) && !connection_aborted()) {
			$buf = fread($h, (int)min(1048576, $left));
			if ($buf === false) break;
			echo $buf;
			flush();
			$left -= strlen($buf);
		}
		fclose($h);
		exit;
	}
}
// ------------------------------------------------------------------ lib/log.php
/**
 * nuFiles – change log in an own table (default nufiles_log, setting log_table). Created on first use; logging never stops an
 * operation. Read accesses (list, download, preview) are logged only with the setting log_reads = true.
 */
final class NufLog
{
	public static function table(NufCtx $nu): string
	{
		$t = (string)$nu->setting('log_table', 'nufiles_log');
		return preg_match('/^[A-Za-z0-9_]{1,60}$/', $t) ? $t : 'nufiles_log';
	}

	public static function ensure(NufCtx $nu): bool
	{
		$s = &$nu->session();
		$t = self::table($nu);
		if (($s['nuf_log_ok'] ?? '') === $t) return true;
		try {
			if ($nu->dbType() === 'sqlsrv') {
				$nu->exec("IF OBJECT_ID(N'$t', N'U') IS NULL CREATE TABLE [$t] ([{$t}_id] NVARCHAR(25) NOT NULL PRIMARY KEY, [log_at] DATETIME2 NOT NULL,
					[user_id] NVARCHAR(25) NULL, [login] NVARCHAR(100) NULL, [real_login] NVARCHAR(100) NULL, [share_id] NVARCHAR(64) NULL,
					[action] NVARCHAR(30) NULL, [path] NVARCHAR(2000) NULL, [target] NVARCHAR(2000) NULL, [bytes] BIGINT NULL, [ok] TINYINT NULL,
					[detail] NVARCHAR(1000) NULL, [ip] NVARCHAR(64) NULL)");
			} else {
				$nu->exec("CREATE TABLE IF NOT EXISTS `$t` (`{$t}_id` VARCHAR(25) NOT NULL PRIMARY KEY, `log_at` DATETIME NOT NULL,
					`user_id` VARCHAR(25) NULL, `login` VARCHAR(100) NULL, `real_login` VARCHAR(100) NULL, `share_id` VARCHAR(64) NULL,
					`action` VARCHAR(30) NULL, `path` VARCHAR(2000) NULL, `target` VARCHAR(2000) NULL, `bytes` BIGINT NULL, `ok` TINYINT NULL,
					`detail` VARCHAR(1000) NULL, `ip` VARCHAR(64) NULL, KEY `{$t}_at` (`log_at`), KEY `{$t}_share` (`share_id`))
					ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
			}
			$s['nuf_log_ok'] = $t;
			return true;
		} catch (Throwable $e) {
			$nu->log('nuFiles: log table not available: ' . $e->getMessage());
			return false;
		}
	}

	public static function write(NufCtx $nu, string $action, string $share, string $path, string $target = '', ?int $bytes = null, bool $ok = true, string $detail = ''): void
	{
		try {
			if (!self::ensure($nu)) return;
			$u = $nu->user();
			$real = $nu->realUser();
			$nu->insert(self::table($nu), [
				'log_at' => date('Y-m-d H:i:s'), 'user_id' => $u['id'], 'login' => mb_substr($u['login'] !== '' ? $u['login'] : $u['id'], 0, 100),
				'real_login' => $real ? mb_substr((string)($real['login'] ?? $real['id'] ?? ''), 0, 100) : null,
				'share_id' => mb_substr($share, 0, 64), 'action' => mb_substr($action, 0, 30), 'path' => mb_substr($path, 0, 2000),
				'target' => $target !== '' ? mb_substr($target, 0, 2000) : null, 'bytes' => $bytes, 'ok' => $ok ? 1 : 0,
				'detail' => $detail !== '' ? mb_substr($detail, 0, 1000) : null, 'ip' => mb_substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 64),
			]);
		} catch (Throwable $e) {
			$nu->log('nuFiles: log write failed: ' . $e->getMessage());
		}
	}

	/** Latest entries for the globeadmin, optional filters. */
	public static function latest(NufCtx $nu, int $limit, string $share, string $q): array
	{
		if (!self::ensure($nu)) return [];
		$t = self::table($nu);
		$where = []; $p = [];
		if ($share !== '') { $where[] = 'share_id = ?'; $p[] = $share; }
		if ($q !== '') { $where[] = '(path LIKE ? OR target LIKE ? OR login LIKE ? OR action LIKE ?)'; array_push($p, "%$q%", "%$q%", "%$q%", "%$q%"); }
		$limit = max(1, min(2000, $limit));
		$sql = $nu->dbType() === 'sqlsrv'
			? "SELECT TOP $limit * FROM [$t]" . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY log_at DESC'
			: "SELECT * FROM `$t`" . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . " ORDER BY log_at DESC LIMIT $limit";
		return $nu->all($sql, $p);
	}
}
// ------------------------------------------------------------------ lib/i18n.php
/** nuFiles – texts in English and German ("du"); de-CH gets ss instead of ß. Placeholders %1, %2 … */
final class NufI18n
{
	private const EN = [
		'title' => 'Files', 'shares' => 'Shares', 'trash' => 'Recycle bin', 'log' => 'Log', 'upload' => 'Upload', 'new_folder' => 'New folder',
		'new_file' => 'New file', 'refresh' => 'Refresh', 'search_ph' => 'Search names (* and ? allowed)', 'name' => 'Name', 'size' => 'Size',
		'modified' => 'Modified', 'actions' => 'Actions', 'open' => 'Open', 'preview' => 'Preview', 'edit' => 'Edit', 'download' => 'Download',
		'download_zip' => 'Download as zip', 'rename' => 'Rename', 'copy' => 'Copy to …', 'move' => 'Move to …', 'delete' => 'Delete', 'zip' => 'Create zip',
		'unzip' => 'Extract', 'restore' => 'Restore', 'purge' => 'Delete for good', 'purge_all' => 'Empty recycle bin', 'empty_folder' => 'This folder is empty.',
		'select_all' => 'Select all', 'selected_n' => '%1 selected', 'confirm_delete_n' => 'Delete %1 item(s)?', 'confirm_delete_trash' => 'They go to the recycle bin.',
		'confirm_delete_final' => 'This cannot be undone.', 'prompt_folder' => 'Name of the new folder', 'prompt_file' => 'Name of the new file',
		'prompt_rename' => 'New name', 'prompt_zip' => 'Name of the zip file', 'save' => 'Save', 'saved' => 'Saved', 'cancel' => 'Cancel', 'close' => 'Close',
		'ok' => 'OK', 'overwrite_existing' => 'Replace files with the same name', 'uploading' => 'Uploading', 'upload_done' => 'Uploaded',
		'upload_failed' => 'Upload failed', 'drop_here' => 'Drop files here to upload', 'conflict_title' => 'Changed meanwhile',
		'conflict_text' => 'Someone changed this file after you opened it. Reload it (your changes are lost) or overwrite it with your version?',
		'reload' => 'Reload', 'overwrite' => 'Overwrite', 'lint_title' => 'Syntax error', 'lint_text' => 'Line %1: %2', 'save_anyway' => 'Save anyway',
		'unsaved' => 'You have unsaved changes. Close anyway?', 'versions' => 'Versions', 'restore_version' => 'Load this version', 'no_versions' => 'No older versions.',
		'target' => 'Target', 'choose_folder' => 'Choose a folder', 'here' => 'Here', 'up' => 'Up', 'path' => 'Path', 'more_levels' => 'More folders', 'show_modified' => 'Show the modified date instead of the size', 'show_size' => 'Show the size instead of the modified date', 'view_grid' => 'Show as tiles', 'view_list' => 'Show as a list', 'sort_by' => 'Sort by', 'theme_dark' => 'Dark mode', 'theme_light' => 'Light mode', 'root' => 'Root', 'no_shares' => 'No shares are available to you.',
		'problems' => 'Settings problems (only you see this)', 'readonly_badge' => 'read only', 'code_badge' => 'code', 'search_results' => 'Search results for “%1”',
		'partial_results' => 'Only the first results are shown – refine your search.', 'deleted_at' => 'Deleted', 'deleted_by' => 'By', 'original_path' => 'Original place',
		'items' => 'Items', 'files_skipped' => '%1 entries were skipped', 'nothing_selected' => 'Nothing selected.', 'unzip_done' => '%1 file(s) extracted to “%2”.',
		'zip_done' => 'Created “%1”.', 'moved_n' => '%1 item(s) moved', 'copied_n' => '%1 item(s) copied', 'deleted_n' => '%1 item(s) deleted',
		'restored' => 'Restored to “%1”', 'purged' => 'Deleted for good', 'log_when' => 'When', 'log_user' => 'User', 'log_action' => 'Action', 'log_path' => 'Path',
		'log_target' => 'Target', 'log_ok' => 'OK', 'free_space' => '%1 free', 'entries_truncated' => 'Only the first %1 entries are shown.',
		'preview_unavailable' => 'No preview for this file type – download it instead.', 'text_too_big' => 'The file is too large for the editor.',
		'binary_file' => 'This is not a text file.', 'encoding_file' => 'The file is not UTF-8 – open it in a desktop editor.', 'shortcut_hint' => 'Ctrl+S saves',
		'empty_trash' => 'The recycle bin is empty.', 'readonly_mode' => 'Read only – changes are not possible here.', 'reauth_needed' => 'Please confirm your password first.',
		'skipped_reason' => 'Skipped', 'details' => 'Details', 'filter' => 'Filter', 'all_shares' => 'All shares', 'loading' => 'Loading …', 'unknown_error' => 'Something went wrong.',
		'path_copied' => 'Path copied', 'copy_path' => 'Copy path', 'info' => 'Info', 'permissions' => 'Permissions', 'type' => 'Type', 'folder' => 'Folder', 'file' => 'File',
		'link_outside' => 'Link to a place outside this share', 'refresh_done' => 'Updated', 'chunk_retry' => 'Connection problem – retrying …',
		'absolute_path' => 'Path on the server', 'count_line' => '%1 folder(s), %2 file(s), %3', 'n_entries' => '%1 entries', 'n_files' => '%1 files',
		'no_results' => 'Nothing found.', 'reauth_ok' => 'Password confirmed', 'reauth_ok_close' => 'Password confirmed – this window closes itself (or close it).',
		'reauth_open' => 'Confirm password', 'reauth_title' => 'Password confirmation', 'retry' => 'Try again',
		'reauth_text' => 'Code folders hold the program of this server. Please confirm your password (a small window opens) – then nuFiles goes on.',
		'replaced' => 'replaced', 'trash_days' => 'Entries older than %1 days are deleted for good automatically.', 'version_loaded' => 'Older version loaded – Save writes it back.',
		'wrap' => 'Wrap lines',

		'err_path' => 'Invalid path.', 'err_name_empty' => 'Please enter a name.', 'err_name_long' => 'The name is too long (255 bytes at most).',
		'err_name_chars' => 'The name contains characters that are not allowed (/, \\, control characters).', 'err_name_edges' => 'The name must not start or end with a space or end with a dot.',
		'err_name_reserved' => 'This name is reserved.', 'err_name_dot' => 'Names starting with a dot are not allowed in this share.',
		'err_name_dangerous' => 'Files of type .%1 are not allowed here (a web server could run them).', 'err_name_web' => 'Files of type .%1 are not allowed in this share (web content).',
		'err_name_ext' => 'Files of type .%1 are not allowed here. Allowed: %2', 'err_root' => 'The share itself cannot be changed.', 'err_not_found' => 'Not found.',
		'err_outside' => 'This place lies outside the share.', 'err_not_folder' => 'This is not a folder.', 'err_not_file' => 'This is not a file.',
		'err_exists' => '“%1” already exists.', 'err_content_php' => 'The file contains PHP code – not allowed in this share.',
		'err_content_web' => 'The file is web content (%1) – not allowed in this share.', 'err_share' => 'This share does not exist or you have no access.',
		'err_share_broken' => 'The folder of this share is not available.', 'err_readonly' => 'This share is read only.', 'err_right' => 'You are not allowed to do this here (%1).',
		'err_read' => 'The folder cannot be read.', 'err_search' => 'Please enter a search term (200 characters at most).', 'err_write' => 'The change could not be written (permissions of the server?).',
		'err_into_self' => 'A folder cannot be moved or copied into itself.', 'err_link_in_tree' => 'Links (symlinks) are not copied, moved or extracted.',
		'err_too_many' => 'Too many entries.', 'err_too_big' => 'Too large.', 'err_conflict' => 'The file was changed by someone else.',
		'err_too_big_upload' => 'The file is too large (at most %1 MB).', 'err_disk_full' => 'Not enough free disk space.', 'err_data_dir' => 'The data folder of nuFiles is missing.',
		'err_upload_ticket' => 'The upload expired – please start it again.', 'err_upload_php' => 'The server refused the upload (PHP error %1).',
		'err_upload_chunk' => 'Invalid part of the upload.', 'err_upload_offset' => 'Upload out of step – resuming.', 'err_no_zip' => 'Zip is not available on this server (PHP zip extension).',
		'err_zip_open' => 'The archive cannot be opened.', 'err_zip_size' => 'Entry size does not match the archive.', 'err_lint' => 'Syntax error.',
		'err_not_text' => 'This file cannot be edited as text.', 'err_readonly_mode' => 'Read only mode – changes are not possible.', 'err_reauth' => 'Please confirm your password.',
		'err_admin' => 'Only the globeadmin may do this.', 'err_bad_request' => 'Invalid request.', 'err_server' => 'Server error.',
		'chmod' => 'Permissions …', 'chmod_title' => 'Permissions of “%1”', 'chmod_owner' => 'Owner', 'chmod_group' => 'Group', 'chmod_others' => 'Others',
		'chmod_read' => 'Read', 'chmod_write' => 'Write', 'chmod_exec' => 'Execute', 'chmod_exec_dir' => 'Open', 'chmod_octal' => 'As a number',
		'chmod_recursive' => 'Also for everything inside (sub-folders the same, files without “execute”)', 'chmod_owned' => 'Owner: %1 · group: %2 · the web server runs as %3',
		'chmod_owned_short' => 'Owner: %1 · group: %2', 'chmod_warn_world' => 'Others may write: every account on the server can change it.',
		'chmod_warn_exec' => 'Execute on a file is rarely needed for web files.', 'chmod_apply' => 'Set permissions', 'chmod_done' => 'Permissions set (%1).',
		'chmod_partly' => '%1 changed, %2 could not be changed (owned by another account?).', 'chmod_links' => '%1 link(s) skipped.',
		'err_chmod_mode' => 'Three digits 0–7 – and the owner keeps “read” (folders also “open”).', 'err_chmod' => 'The permissions could not be changed – the web server must own the file.',
		'err_chmod_link' => 'Links (symlinks) are not changed.', 'err_no_chmod' => 'Permissions cannot be changed on this server.',
	];

	private const DE = [
		'title' => 'Dateien', 'shares' => 'Freigaben', 'trash' => 'Papierkorb', 'log' => 'Protokoll', 'upload' => 'Hochladen', 'new_folder' => 'Neuer Ordner',
		'new_file' => 'Neue Datei', 'refresh' => 'Aktualisieren', 'search_ph' => 'Namen suchen (* und ? erlaubt)', 'name' => 'Name', 'size' => 'Grösse',
		'modified' => 'Geändert', 'actions' => 'Aktionen', 'open' => 'Öffnen', 'preview' => 'Vorschau', 'edit' => 'Bearbeiten', 'download' => 'Herunterladen',
		'download_zip' => 'Als Zip herunterladen', 'rename' => 'Umbenennen', 'copy' => 'Kopieren nach …', 'move' => 'Verschieben nach …', 'delete' => 'Löschen', 'zip' => 'Zip erstellen',
		'unzip' => 'Entpacken', 'restore' => 'Wiederherstellen', 'purge' => 'Endgültig löschen', 'purge_all' => 'Papierkorb leeren', 'empty_folder' => 'Dieser Ordner ist leer.',
		'select_all' => 'Alle auswählen', 'selected_n' => '%1 ausgewählt', 'confirm_delete_n' => '%1 Element(e) löschen?', 'confirm_delete_trash' => 'Sie kommen in den Papierkorb.',
		'confirm_delete_final' => 'Das kann nicht rückgängig gemacht werden.', 'prompt_folder' => 'Name des neuen Ordners', 'prompt_file' => 'Name der neuen Datei',
		'prompt_rename' => 'Neuer Name', 'prompt_zip' => 'Name der Zip-Datei', 'save' => 'Speichern', 'saved' => 'Gespeichert', 'cancel' => 'Abbrechen', 'close' => 'Schliessen',
		'ok' => 'OK', 'overwrite_existing' => 'Gleichnamige Dateien ersetzen', 'uploading' => 'Wird hochgeladen', 'upload_done' => 'Hochgeladen',
		'upload_failed' => 'Hochladen fehlgeschlagen', 'drop_here' => 'Dateien hierher ziehen zum Hochladen', 'conflict_title' => 'Inzwischen geändert',
		'conflict_text' => 'Jemand hat diese Datei geändert, nachdem du sie geöffnet hast. Neu laden (deine Änderungen gehen verloren) oder mit deiner Version überschreiben?',
		'reload' => 'Neu laden', 'overwrite' => 'Überschreiben', 'lint_title' => 'Syntaxfehler', 'lint_text' => 'Zeile %1: %2', 'save_anyway' => 'Trotzdem speichern',
		'unsaved' => 'Du hast ungespeicherte Änderungen. Trotzdem schliessen?', 'versions' => 'Versionen', 'restore_version' => 'Diese Version laden', 'no_versions' => 'Keine älteren Versionen.',
		'target' => 'Ziel', 'choose_folder' => 'Ordner wählen', 'here' => 'Hierhin', 'up' => 'Nach oben', 'path' => 'Pfad', 'more_levels' => 'Weitere Ordner', 'show_modified' => 'Änderungsdatum statt Größe anzeigen', 'show_size' => 'Größe statt Änderungsdatum anzeigen', 'view_grid' => 'Als Kacheln anzeigen', 'view_list' => 'Als Liste anzeigen', 'sort_by' => 'Sortieren nach', 'theme_dark' => 'Dunkler Modus', 'theme_light' => 'Heller Modus', 'root' => 'Stamm', 'no_shares' => 'Für dich sind keine Freigaben verfügbar.',
		'problems' => 'Probleme in den Einstellungen (nur du siehst das)', 'readonly_badge' => 'nur lesen', 'code_badge' => 'Code', 'search_results' => 'Suchergebnisse für «%1»',
		'partial_results' => 'Es werden nur die ersten Ergebnisse gezeigt – verfeinere die Suche.', 'deleted_at' => 'Gelöscht', 'deleted_by' => 'Von', 'original_path' => 'Ursprünglicher Ort',
		'items' => 'Elemente', 'files_skipped' => '%1 Einträge wurden übersprungen', 'nothing_selected' => 'Nichts ausgewählt.', 'unzip_done' => '%1 Datei(en) nach «%2» entpackt.',
		'zip_done' => '«%1» erstellt.', 'moved_n' => '%1 Element(e) verschoben', 'copied_n' => '%1 Element(e) kopiert', 'deleted_n' => '%1 Element(e) gelöscht',
		'restored' => 'Wiederhergestellt nach «%1»', 'purged' => 'Endgültig gelöscht', 'log_when' => 'Wann', 'log_user' => 'Benutzer', 'log_action' => 'Aktion', 'log_path' => 'Pfad',
		'log_target' => 'Ziel', 'log_ok' => 'OK', 'free_space' => '%1 frei', 'entries_truncated' => 'Es werden nur die ersten %1 Einträge gezeigt.',
		'preview_unavailable' => 'Für diesen Dateityp gibt es keine Vorschau – lade die Datei herunter.', 'text_too_big' => 'Die Datei ist zu gross für den Editor.',
		'binary_file' => 'Das ist keine Textdatei.', 'encoding_file' => 'Die Datei ist nicht UTF-8 – öffne sie in einem Desktop-Editor.', 'shortcut_hint' => 'Ctrl+S speichert',
		'empty_trash' => 'Der Papierkorb ist leer.', 'readonly_mode' => 'Nur lesen – hier sind keine Änderungen möglich.', 'reauth_needed' => 'Bitte bestätige zuerst dein Passwort.',
		'skipped_reason' => 'Übersprungen', 'details' => 'Details', 'filter' => 'Filter', 'all_shares' => 'Alle Freigaben', 'loading' => 'Wird geladen …', 'unknown_error' => 'Etwas ist schiefgelaufen.',
		'path_copied' => 'Pfad kopiert', 'copy_path' => 'Pfad kopieren', 'info' => 'Info', 'permissions' => 'Rechte', 'type' => 'Typ', 'folder' => 'Ordner', 'file' => 'Datei',
		'link_outside' => 'Verknüpfung auf einen Ort ausserhalb dieser Freigabe', 'refresh_done' => 'Aktualisiert', 'chunk_retry' => 'Verbindungsproblem – neuer Versuch …',
		'absolute_path' => 'Pfad auf dem Server', 'count_line' => '%1 Ordner, %2 Datei(en), %3', 'n_entries' => '%1 Einträge', 'n_files' => '%1 Dateien',
		'no_results' => 'Nichts gefunden.', 'reauth_ok' => 'Passwort bestätigt', 'reauth_ok_close' => 'Passwort bestätigt – dieses Fenster schliesst sich (oder schliesse es).',
		'reauth_open' => 'Passwort bestätigen', 'reauth_title' => 'Passwort-Bestätigung', 'retry' => 'Nochmals versuchen',
		'reauth_text' => 'Code-Ordner enthalten das Programm dieses Servers. Bitte bestätige dein Passwort (ein kleines Fenster öffnet sich) – danach geht es weiter.',
		'replaced' => 'ersetzt', 'trash_days' => 'Einträge, die älter als %1 Tage sind, werden automatisch endgültig gelöscht.', 'version_loaded' => 'Ältere Version geladen – Speichern schreibt sie zurück.',
		'wrap' => 'Zeilen umbrechen',

		'err_path' => 'Ungültiger Pfad.', 'err_name_empty' => 'Bitte gib einen Namen ein.', 'err_name_long' => 'Der Name ist zu lang (höchstens 255 Bytes).',
		'err_name_chars' => 'Der Name enthält unerlaubte Zeichen (/, \\, Steuerzeichen).', 'err_name_edges' => 'Der Name darf nicht mit einem Leerzeichen beginnen oder enden und nicht mit einem Punkt enden.',
		'err_name_reserved' => 'Dieser Name ist reserviert.', 'err_name_dot' => 'Namen, die mit einem Punkt beginnen, sind in dieser Freigabe nicht erlaubt.',
		'err_name_dangerous' => 'Dateien vom Typ .%1 sind hier nicht erlaubt (ein Webserver könnte sie ausführen).', 'err_name_web' => 'Dateien vom Typ .%1 sind in dieser Freigabe nicht erlaubt (Webinhalt).',
		'err_name_ext' => 'Dateien vom Typ .%1 sind hier nicht erlaubt. Erlaubt: %2', 'err_root' => 'Die Freigabe selbst kann nicht geändert werden.', 'err_not_found' => 'Nicht gefunden.',
		'err_outside' => 'Dieser Ort liegt ausserhalb der Freigabe.', 'err_not_folder' => 'Das ist kein Ordner.', 'err_not_file' => 'Das ist keine Datei.',
		'err_exists' => '«%1» gibt es schon.', 'err_content_php' => 'Die Datei enthält PHP-Code – in dieser Freigabe nicht erlaubt.',
		'err_content_web' => 'Die Datei ist Webinhalt (%1) – in dieser Freigabe nicht erlaubt.', 'err_share' => 'Diese Freigabe gibt es nicht oder du hast keinen Zugriff.',
		'err_share_broken' => 'Der Ordner dieser Freigabe ist nicht verfügbar.', 'err_readonly' => 'Diese Freigabe ist schreibgeschützt.', 'err_right' => 'Das darfst du hier nicht (%1).',
		'err_read' => 'Der Ordner kann nicht gelesen werden.', 'err_search' => 'Bitte gib einen Suchbegriff ein (höchstens 200 Zeichen).', 'err_write' => 'Die Änderung konnte nicht geschrieben werden (Rechte auf dem Server?).',
		'err_into_self' => 'Ein Ordner kann nicht in sich selbst verschoben oder kopiert werden.', 'err_link_in_tree' => 'Verknüpfungen (Symlinks) werden nicht kopiert, verschoben oder entpackt.',
		'err_too_many' => 'Zu viele Einträge.', 'err_too_big' => 'Zu gross.', 'err_conflict' => 'Die Datei wurde von jemand anderem geändert.',
		'err_too_big_upload' => 'Die Datei ist zu gross (höchstens %1 MB).', 'err_disk_full' => 'Nicht genug freier Speicherplatz.', 'err_data_dir' => 'Der Datenordner von nuFiles fehlt.',
		'err_upload_ticket' => 'Das Hochladen ist abgelaufen – bitte neu starten.', 'err_upload_php' => 'Der Server hat das Hochladen abgelehnt (PHP-Fehler %1).',
		'err_upload_chunk' => 'Ungültiger Teil des Uploads.', 'err_upload_offset' => 'Upload nicht im Takt – wird fortgesetzt.', 'err_no_zip' => 'Zip ist auf diesem Server nicht verfügbar (PHP-Erweiterung zip).',
		'err_zip_open' => 'Das Archiv kann nicht geöffnet werden.', 'err_zip_size' => 'Die Grösse eines Eintrags stimmt nicht mit dem Archiv überein.', 'err_lint' => 'Syntaxfehler.',
		'err_not_text' => 'Diese Datei kann nicht als Text bearbeitet werden.', 'err_readonly_mode' => 'Nur-Lesen-Modus – keine Änderungen möglich.', 'err_reauth' => 'Bitte bestätige dein Passwort.',
		'err_admin' => 'Nur der Globeadmin darf das.', 'err_bad_request' => 'Ungültige Anfrage.', 'err_server' => 'Serverfehler.',
		'chmod' => 'Rechte …', 'chmod_title' => 'Rechte von «%1»', 'chmod_owner' => 'Besitzer', 'chmod_group' => 'Gruppe', 'chmod_others' => 'Andere',
		'chmod_read' => 'Lesen', 'chmod_write' => 'Schreiben', 'chmod_exec' => 'Ausführen', 'chmod_exec_dir' => 'Öffnen', 'chmod_octal' => 'Als Zahl',
		'chmod_recursive' => 'Auch für alles darin (Unterordner gleich, Dateien ohne «Ausführen»)', 'chmod_owned' => 'Besitzer: %1 · Gruppe: %2 · der Webserver läuft als %3',
		'chmod_owned_short' => 'Besitzer: %1 · Gruppe: %2', 'chmod_warn_world' => 'Andere dürfen schreiben: jedes Konto auf dem Server kann es ändern.',
		'chmod_warn_exec' => '«Ausführen» braucht eine Datei für das Web kaum je.', 'chmod_apply' => 'Rechte setzen', 'chmod_done' => 'Rechte gesetzt (%1).',
		'chmod_partly' => '%1 geändert, %2 konnten nicht geändert werden (gehören einem anderen Konto?).', 'chmod_links' => '%1 Verknüpfung(en) übersprungen.',
		'err_chmod_mode' => 'Drei Ziffern 0–7 – und der Besitzer behält «Lesen» (Ordner auch «Öffnen»).', 'err_chmod' => 'Die Rechte konnten nicht geändert werden – die Datei muss dem Webserver gehören.',
		'err_chmod_link' => 'Verknüpfungen (Symlinks) werden nicht geändert.', 'err_no_chmod' => 'Rechte können auf diesem Server nicht geändert werden.',
	];

	/** @return array<string,string> */
	public static function strings(string $lang): array
	{
		$l = strtolower($lang);
		if (str_starts_with($l, 'de')) {
			$de = self::DE + self::EN;
			if ($l !== 'de-ch') {                       // German German: ß where Swiss German writes ss
				$map = ['Grösse' => 'Größe', 'Schliessen' => 'Schließen', 'schliessen' => 'schließen', 'schliesst' => 'schließt', 'ausserhalb' => 'außerhalb', 'gross' => 'groß'];
				foreach ($de as $k => $v) $de[$k] = strtr($v, $map);
			}
			return $de;
		}
		return self::EN;
	}

	public static function t(array $strings, string $key, array $args = []): string
	{
		$s = $strings[$key] ?? $key;
		foreach (array_values($args) as $i => $a) $s = str_replace('%' . ($i + 1), (string)$a, $s);
		return $s;
	}
}
// ------------------------------------------------------------------ lib/api.php
/**
 * nuFiles – the JSON / file actions of the page (?action=…). Before the page runs, nuBuilder Next has checked the login, the
 * form's view right and (for every POST of a fetch) the CSRF token, and refuses POSTs while the globeadmin views as another user.
 * Here: share rights, read-only mode, the password confirmation for code shares, the log.
 */
final class NufApi
{
	/** GET actions (a POST works too); the POST-only actions change something. */
	private const GET = ['boot', 'list', 'search', 'info', 'read', 'versions', 'version', 'trash', 'download', 'raw', 'thumb', 'logview', 'reauth_done'];
	private const POST = ['save', 'newfile', 'mkdir', 'rename', 'move', 'copy', 'delete', 'restore', 'purge', 'upload_init', 'upload_chunk', 'zip', 'unzip', 'chmod'];

	public static function handle(NufCtx $nu, array $S): never
	{
		$a = $nu->action();
		try {
			if (!in_array($a, self::GET, true) && !in_array($a, self::POST, true)) throw new NufError('err_bad_request', 404);
			if (in_array($a, self::POST, true) && !$nu->isPost()) throw new NufError('err_bad_request', 405);
			$out = match ($a) {
				'boot' => self::boot($nu, $S),
				'list' => self::listDir($nu),
				'search' => self::search($nu),
				'info' => self::info($nu),
				'read' => self::read($nu),
				'versions' => self::versions($nu),
				'version' => self::version($nu),
				'save' => self::save($nu, $S),
				'newfile' => self::newFile($nu),
				'mkdir' => self::mkdir($nu),
				'rename' => self::rename($nu),
				'move' => self::transfer($nu, false),
				'copy' => self::transfer($nu, true),
				'delete' => self::delete($nu),
				'trash' => self::trash($nu),
				'restore' => self::restore($nu),
				'purge' => self::purge($nu),
				'upload_init' => self::uploadInit($nu),
				'upload_chunk' => self::uploadChunk($nu),
				'zip' => self::zip($nu),
				'unzip' => self::unzip($nu),
				'chmod' => self::chmod($nu),
				'download' => self::download($nu),
				'raw' => self::raw($nu),
				'thumb' => self::thumb($nu),
				'logview' => self::logView($nu),
				'reauth_done' => self::reauthDone($nu, $S),
			};
			$nu->json(['ok' => true] + $out);
		} catch (NufError $e) {
			$body = ['ok' => false, 'error' => $e->key, 'message' => NufI18n::t($S, $e->key, $e->args), 'args' => $e->args];
			if ($e->key === 'err_reauth') $body['reauth'] = self::reauthUrl($nu);
			$nu->json($body, $e->status);
		} catch (Throwable $e) {
			$nu->log('nuFiles ' . $a . ': ' . get_class($e) . ': ' . $e->getMessage() . ' in ' . basename($e->getFile()) . ':' . $e->getLine());
			$nu->json(['ok' => false, 'error' => 'err_server', 'message' => NufI18n::t($S, 'err_server')
				. ($nu->isGlobeadmin() ? ' ' . get_class($e) . ': ' . $e->getMessage() . ' (' . basename($e->getFile()) . ':' . $e->getLine() . ')' : '')], 500);
		}
	}

	// ------------------------------------------------------------------ helpers

	private static function p(NufCtx $nu, string $name, string $default = ''): string
	{
		return (string)($nu->param($name, $default) ?? $default);
	}

	/** JSON list parameter (paths=["a","b"]). */
	private static function names(NufCtx $nu, string $name): array
	{
		$v = json_decode(self::p($nu, $name, '[]'), true);
		if (!is_array($v) || count($v) > 5000) throw new NufError('err_bad_request');
		$v = array_values(array_filter($v, 'is_string'));
		if (!$v) throw new NufError('err_bad_request');
		return $v;
	}

	/**
	 * A method of a later page API (see the core change list in README.md) – called through a variable, so nuBuilder Next's page
	 * check does not report it as unknown while it does not exist yet. null when the method is not there.
	 */
	public static function future(NufCtx $nu, string $method, mixed ...$args): mixed
	{
		if (!method_exists($nu, $method)) return null;
		return $nu->{$method}(...$args);
	}

	/** reauth setting: "code" (default: any access to code shares), "code_write" (changes in code shares), "all_write", "none". */
	private static function needsReauth(NufCtx $nu, array $share, bool $write): bool
	{
		$mode = (string)$nu->setting('reauth', 'code');
		return match ($mode) {
			'none' => false,
			'all_write' => $write || $share['type'] === 'code',
			'code_write' => $write && $share['type'] === 'code',
			default => $share['type'] === 'code',
		};
	}

	/** Was the password entered recently? Core change C3 (page method "recentAuth"); until then nuBuilder Next's NuSecurity directly. */
	private static function recentAuth(NufCtx $nu): bool
	{
		$r = self::future($nu, 'recentAuth');
		if ($r !== null) return (bool)$r;
		if (class_exists('NuSecurity') && method_exists('NuSecurity', 'recentAuth')) return NuSecurity::recentAuth();
		return true;                                       // no way to ask: as before (the page form's own access rules)
	}

	/** URL of the password confirmation that comes back to ?action=reauth_done (opened in a small window by app.js). */
	private static function reauthUrl(NufCtx $nu): string
	{
		$back = $nu->url(['action' => 'reauth_done']);
		$u = self::future($nu, 'reauthUrl', $back);
		if ($u !== null) return (string)$u;
		if (session_status() === PHP_SESSION_ACTIVE) $_SESSION['nu_reauth_next'] = $back;   // as pages/nubuilderapi.php does (interim)
		return 'index.php?p=reauth';
	}

	/** A share for reading (view right, password confirmation for code shares). */
	private static function read_(NufCtx $nu, string $id, string $right = 'view'): array
	{
		$share = NufConfig::share($id, $right);
		if (self::needsReauth($nu, $share, false) && !self::recentAuth($nu)) throw new NufError('err_reauth', 403);
		return $share;
	}

	/** A share for a change: read-only mode, the right, the password confirmation. */
	private static function write(NufCtx $nu, string $id, string $right): array
	{
		if ($nu->readOnly()) throw new NufError('err_readonly_mode', 403);
		$share = NufConfig::share($id, $right);
		if (self::needsReauth($nu, $share, true) && !self::recentAuth($nu)) throw new NufError('err_reauth', 403);
		return $share;
	}

	// ------------------------------------------------------------------ read

	public static function boot(NufCtx $nu, array $S): array
	{
		$u = $nu->user();
		$ga = $nu->isGlobeadmin();
		return [
			'strings' => $S,
			'shares' => NufConfig::publicShares($ga),
			'user' => ['display' => $u['display'] !== '' ? $u['display'] : $u['login'], 'login' => $u['login'], 'globeadmin' => $ga],
			'limits' => ['chunk' => NufConfig::$limits['chunk_mb'] * 1048576, 'editor_max' => NufConfig::$limits['editor_max_kb'] * 1024,
				'search_max' => NufConfig::$limits['search_max']],
			'readonly' => $nu->readOnly(),
			'problems' => $ga ? NufConfig::$problems : [],
			'features' => ['zip' => class_exists('ZipArchive'), 'trash' => NufConfig::$dataDir !== '', 'thumbs' => NufFs::thumbsAvailable(), 'log' => $ga, 'chmod' => $ga && NufFs::chmodAvailable()],
			'base' => $nu->url(),
			'home' => $nu->homeUrl(),
			'lang' => $nu->lang(),
			'version' => NUF_VERSION,
		];
	}

	private static function listDir(NufCtx $nu): array
	{
		$share = self::read_($nu, self::p($nu, 'share'));
		$nu->releaseSession();
		$r = NufFs::listDir($share, self::p($nu, 'path'), NufConfig::$limits['list_max']);
		if ($nu->setting('log_reads', false)) NufLog::write($nu, 'list', $share['id'], $r['path']);
		return $r;
	}

	private static function search(NufCtx $nu): array
	{
		$share = self::read_($nu, self::p($nu, 'share'));
		$nu->releaseSession();
		return NufFs::search($share, self::p($nu, 'path'), self::p($nu, 'q'), NufConfig::$limits['search_max']);
	}

	private static function info(NufCtx $nu): array
	{
		$share = self::read_($nu, self::p($nu, 'share'));
		$abs = NufGuard::existing($share, self::p($nu, 'path'));
		$e = NufFs::entry($share, $abs, $abs === $share['root'] ? $share['label'] : basename($abs));
		$e['path'] = NufGuard::rel($share, $abs);
		if ($e['type'] === 'dir') $e += NufFs::treeSize($abs, 20000); else $e['mime'] = NufFs::mime($abs);
		if ($nu->isGlobeadmin()) $e['absolute'] = $abs;
		if ($nu->isGlobeadmin()) $e += NufFs::owner($abs);
		return ['info' => $e];
	}

	private static function read(NufCtx $nu): array
	{
		$share = self::read_($nu, self::p($nu, 'share'));
		$abs = NufGuard::existing($share, self::p($nu, 'path'), false);
		if (!is_file($abs)) throw new NufError('err_not_file');
		[$ok, $data] = NufFs::isText($abs, NufConfig::$limits['editor_max_kb'] * 1024);
		if (!$ok) return ['text' => false, 'reason' => $data, 'size' => (int)filesize($abs)];
		if ($nu->setting('log_reads', false)) NufLog::write($nu, 'read', $share['id'], NufGuard::rel($share, $abs));
		return ['text' => true, 'content' => $data, 'sha' => sha1($data), 'size' => strlen($data), 'mtime' => (int)filemtime($abs),
			'editable' => NufConfig::can($share, 'edit') && is_writable($abs) && !$nu->readOnly()];
	}

	private static function versions(NufCtx $nu): array
	{
		$share = self::read_($nu, self::p($nu, 'share'), 'edit');
		$abs = NufGuard::existing($share, self::p($nu, 'path'), false);
		return ['versions' => NufFs::versions($share, $abs)];
	}

	private static function version(NufCtx $nu): array
	{
		$share = self::read_($nu, self::p($nu, 'share'), 'edit');
		$abs = NufGuard::existing($share, self::p($nu, 'path'), false);
		return ['content' => NufFs::versionContent($share, $abs, self::p($nu, 'id'))];
	}

	// ------------------------------------------------------------------ change

	private static function save(NufCtx $nu, array $S): array
	{
		$share = self::write($nu, self::p($nu, 'share'), 'edit');
		$abs = NufGuard::existing($share, self::p($nu, 'path'), false);
		if (!is_file($abs)) throw new NufError('err_not_file');
		// a files share: no saving into names it would refuse for an upload (an old .php, .html …); the allow-list is not applied
		NufGuard::checkName(basename($abs), array_merge($share, ['extensions' => []]), false);
		// the text arrives as a file (a Blob): nuBuilder Next rewrites CRLF in every $_POST string, files reach the page unchanged
		$f = $_FILES['content'] ?? null;
		if (!is_array($f) || ($f['error'] ?? 1) !== UPLOAD_ERR_OK || !is_uploaded_file((string)$f['tmp_name'])) throw new NufError('err_bad_request');
		if ((int)$f['size'] > NufConfig::$limits['editor_max_kb'] * 1024) throw new NufError('err_too_big');
		$content = (string)file_get_contents((string)$f['tmp_name']);
		if (!mb_check_encoding($content, 'UTF-8') || str_contains($content, "\0")) throw new NufError('err_not_text');
		NufGuard::checkText($content, $share);
		if (self::p($nu, 'force_lint') !== '1' && ($lint = NufFs::lint(basename($abs), $content))) {
			$nu->json(['ok' => false, 'error' => 'err_lint', 'message' => NufI18n::t($S, 'lint_text', [$lint['line'], $lint['message']]), 'lint' => $lint], 422);
		}
		$res = NufFs::save($share, $abs, $content, self::p($nu, 'sha'), self::p($nu, 'force') === '1', NufConfig::$limits['versions_keep']);
		NufLog::write($nu, 'save', $share['id'], NufGuard::rel($share, $abs), '', $res['size']);
		return $res;
	}

	private static function newFile(NufCtx $nu): array
	{
		$share = self::write($nu, self::p($nu, 'share'), 'edit');
		$abs = NufFs::newFile($share, self::p($nu, 'path'), self::p($nu, 'name'));
		NufLog::write($nu, 'newfile', $share['id'], NufGuard::rel($share, $abs));
		return ['path' => NufGuard::rel($share, $abs)];
	}

	private static function mkdir(NufCtx $nu): array
	{
		$share = self::write($nu, self::p($nu, 'share'), 'mkdir');
		$abs = NufFs::mkdir($share, self::p($nu, 'path'), self::p($nu, 'name'));
		NufLog::write($nu, 'mkdir', $share['id'], NufGuard::rel($share, $abs));
		return ['path' => NufGuard::rel($share, $abs)];
	}

	private static function rename(NufCtx $nu): array
	{
		$share = self::write($nu, self::p($nu, 'share'), 'rename');
		[$src, $dst] = NufFs::rename($share, self::p($nu, 'path'), self::p($nu, 'name'));
		NufLog::write($nu, 'rename', $share['id'], NufGuard::rel($share, $src), NufGuard::rel($share, $dst));
		return ['path' => NufGuard::rel($share, $dst)];
	}

	/**
	 * move inside a share: "rename"; into another share: "delete" on the source and "upload" on the target.
	 * copy inside a share: "copy"; into another share: "view" on the source and "upload" on the target.
	 */
	private static function transfer(NufCtx $nu, bool $copy): array
	{
		$fromId = self::p($nu, 'share');
		$toId = self::p($nu, 'to_share', $fromId);
		$same = $fromId === $toId;
		$from = $copy ? self::read_($nu, $fromId) : self::write($nu, $fromId, $same ? 'rename' : 'delete');
		$to = self::write($nu, $toId, $same ? ($copy ? 'copy' : 'rename') : 'upload');
		$done = NufFs::transfer($from, self::names($nu, 'paths'), $to, self::p($nu, 'to_path'), $copy, NufConfig::$limits);
		foreach ($done as [$s, $t]) NufLog::write($nu, $copy ? 'copy' : 'move', $from['id'], $s, ($same ? '' : $to['id'] . ':') . $t);
		return ['done' => count($done)];
	}

	private static function delete(NufCtx $nu): array
	{
		$share = self::write($nu, self::p($nu, 'share'), 'delete');
		$n = 0;
		$user = $nu->user();
		foreach (self::names($nu, 'paths') as $rel) {
			$id = NufFs::delete($share, $rel, $user);
			NufLog::write($nu, $id !== '' ? 'trash' : 'delete', $share['id'], $rel, $id);
			$n++;
		}
		return ['done' => $n, 'trash' => $share['trash'] && NufConfig::$dataDir !== ''];
	}

	/** The recycle bin: the globeadmin sees everything, users the entries of shares where they may delete. */
	private static function trash(NufCtx $nu): array
	{
		$ids = [];
		foreach (NufConfig::$shares as $s) if (NufConfig::can($s, 'delete')) $ids[] = $s['id'];
		$labels = array_column(NufConfig::$shares, 'label', 'id');
		$items = NufFs::trashList($nu->isGlobeadmin() ? null : $ids);
		foreach ($items as &$i) $i['share_label'] = $labels[$i['share'] ?? ''] ?? (string)($i['share'] ?? '');
		unset($i);
		return ['items' => $items, 'can_purge' => $nu->isGlobeadmin() && !$nu->readOnly(), 'days' => NufConfig::$limits['trash_days']];
	}

	private static function restore(NufCtx $nu): array
	{
		$meta = NufFs::trashMeta(self::p($nu, 'id'));
		$share = self::write($nu, (string)$meta['share'], 'delete');
		$dst = NufFs::restore($share, $meta);
		NufLog::write($nu, 'restore', $share['id'], (string)$meta['path'], NufGuard::rel($share, $dst));
		return ['path' => NufGuard::rel($share, $dst), 'share' => $share['id']];
	}

	/** Final deletion from the recycle bin: globeadmin only (the bin also empties itself after trash_days). */
	private static function purge(NufCtx $nu): array
	{
		if (!$nu->isGlobeadmin()) throw new NufError('err_admin', 403);
		if ($nu->readOnly()) throw new NufError('err_readonly_mode', 403);
		$ids = self::p($nu, 'all') === '1' ? array_column(NufFs::trashList(null), 'id') : [self::p($nu, 'id')];
		foreach ($ids as $id) {
			$m = NufFs::trashMeta((string)$id);
			NufFs::purge((string)$id);
			NufLog::write($nu, 'purge', (string)$m['share'], (string)$m['path']);
		}
		return ['done' => count($ids)];
	}

	private static function uploadInit(NufCtx $nu): array
	{
		$share = self::write($nu, self::p($nu, 'share'), 'upload');
		$overwrite = self::p($nu, 'overwrite') === '1' && NufConfig::can($share, 'delete');   // replacing = deleting the old file
		$size = (int)self::p($nu, 'size', '-1');
		$r = NufFs::uploadInit($share, self::p($nu, 'path'), self::p($nu, 'name'), $size, $overwrite, $nu->user());
		if ($size !== 0) return $r + ['done' => false];
		$res = NufFs::uploadFinish($share, $r['token'], NufFs::ticket($r['token'], $nu->user()));
		NufLog::write($nu, 'upload', $share['id'], $res['path'], '', 0, true, $res['replaced'] ? 'replaced' : '');
		return $res;
	}

	private static function uploadChunk(NufCtx $nu): array
	{
		$token = self::p($nu, 'token');
		$ticket = NufFs::ticket($token, $nu->user());
		$share = self::write($nu, (string)$ticket['share'], 'upload');
		$nu->releaseSession();                                                  // chunks of several files may run side by side
		$res = NufFs::uploadChunk($share, $token, (int)self::p($nu, 'offset', '-1'), $_FILES['chunk'] ?? [], $ticket, NufConfig::$limits['chunk_mb'] * 1048576);
		if (!empty($res['done'])) NufLog::write($nu, 'upload', $share['id'], (string)$res['path'], '', (int)$ticket['size'], true, !empty($res['replaced']) ? 'replaced' : '');
		return $res;
	}

	private static function zip(NufCtx $nu): array
	{
		$share = self::write($nu, self::p($nu, 'share'), 'zip');
		$dst = NufFs::zip($share, self::p($nu, 'path'), self::names($nu, 'paths'), self::p($nu, 'name', 'archive.zip'), NufConfig::$limits);
		NufLog::write($nu, 'zip', $share['id'], NufGuard::rel($share, $dst), '', (int)filesize($dst));
		return ['path' => NufGuard::rel($share, $dst), 'name' => basename($dst)];
	}

	private static function unzip(NufCtx $nu): array
	{
		$share = self::write($nu, self::p($nu, 'share'), 'zip');
		$r = NufFs::unzip($share, self::p($nu, 'path'), NufConfig::$limits);
		NufLog::write($nu, 'unzip', $share['id'], self::p($nu, 'path'), $r['folder'], null, true, $r['skipped'] ? count($r['skipped']) . ' skipped' : '');
		return $r;
	}

	/**
	 * Unix permissions of a file or folder (globeadmin only, always with password confirmation): mode = three octal digits; recursive (folders):
	 * sub-folders get the mode, files the mode without "execute". Links are never changed (chmod would follow them).
	 */
	private static function chmod(NufCtx $nu): array
	{
		if (!$nu->isGlobeadmin()) throw new NufError('err_admin', 403);
		if (!NufFs::chmodAvailable()) throw new NufError('err_no_chmod', 501);
		$share = self::write($nu, self::p($nu, 'share'), 'edit');
		if (!self::recentAuth($nu)) throw new NufError('err_reauth', 403);
		$mode = self::p($nu, 'mode');
		$r = NufFs::chmod($share, self::p($nu, 'path'), $mode, self::p($nu, 'recursive') === '1', 20000);
		NufLog::write($nu, 'chmod', $share['id'], self::p($nu, 'path'), $mode . (self::p($nu, 'recursive') === '1' ? ' recursive' : ''), null, $r['failed'] === 0,
			$r['done'] . ' changed' . ($r['failed'] ? ', ' . $r['failed'] . ' failed' : '') . ($r['links'] ? ', ' . $r['links'] . ' links skipped' : ''));
		return $r;
	}

	// ------------------------------------------------------------------ files out

	/** One file as it is; a folder or several entries (paths=[…]) as a temporary zip. */
	private static function download(NufCtx $nu): array
	{
		$share = self::read_($nu, self::p($nu, 'share'));
		$rels = self::p($nu, 'paths') !== '' ? self::names($nu, 'paths') : null;
		$abs = $rels === null ? NufGuard::existing($share, self::p($nu, 'path'), false) : null;
		$nu->releaseSession();
		if ($abs !== null && is_file($abs)) {
			NufLog::write($nu, 'download', $share['id'], NufGuard::rel($share, $abs), '', (int)filesize($abs));
			NufFs::send($abs, basename($abs), false);
		}
		if ($rels === null) $rels = [NufGuard::rel($share, (string)$abs)];
		if (!class_exists('ZipArchive')) throw new NufError('err_no_zip', 500);
		if (NufConfig::$dataDir === '') throw new NufError('err_data_dir', 500);
		$tmp = NufConfig::$dataDir . '/tmp/dl-' . bin2hex(random_bytes(8)) . '.zip';
		register_shutdown_function(static function () use ($tmp): void { @unlink($tmp); });
		NufFs::zipTo($share, $rels, $tmp, NufConfig::$limits);
		NufLog::write($nu, 'download', $share['id'], implode(', ', array_slice($rels, 0, 20)) . (count($rels) > 20 ? ' …' : ''), '', (int)filesize($tmp));
		$name = count($rels) === 1 ? basename($rels[0]) . '.zip' : $share['id'] . '-' . date('Ymd-His') . '.zip';
		NufFs::send($tmp, $name, false);
	}

	/** Inline view for the preview (images, PDF, audio, video, plain text) – other types come as a download. */
	private static function raw(NufCtx $nu): array
	{
		$share = self::read_($nu, self::p($nu, 'share'));
		$abs = NufGuard::existing($share, self::p($nu, 'path'), false);
		if (!is_file($abs)) throw new NufError('err_not_file');
		$nu->releaseSession();
		if ($nu->setting('log_reads', false)) NufLog::write($nu, 'preview', $share['id'], NufGuard::rel($share, $abs));
		NufFs::send($abs, basename($abs), true);
	}

	/** Small picture of an image file for the grid view (made once, kept in the data folder). An empty answer = the client shows the type icon. */
	private static function thumb(NufCtx $nu): array
	{
		$share = self::read_($nu, self::p($nu, 'share'));
		$abs = NufGuard::existing($share, self::p($nu, 'path'), false);
		if (!is_file($abs)) throw new NufError('err_not_file');
		$nu->releaseSession();
		NufFs::sendThumb($share, $abs);
	}

	private static function logView(NufCtx $nu): array
	{
		if (!$nu->isGlobeadmin()) throw new NufError('err_admin', 403);
		return ['items' => NufLog::latest($nu, (int)self::p($nu, 'limit', '500'), self::p($nu, 'share'), trim(self::p($nu, 'q')))];
	}

	/** End of the password confirmation (in its own small window): tell the page and close. */
	private static function reauthDone(NufCtx $nu, array $S): never
	{
		while (ob_get_level() > 0) ob_end_clean();
		header('Content-Type: text/html; charset=utf-8');
		echo '<!doctype html><html lang="' . $nu->h(substr($nu->lang(), 0, 2)) . '"><meta charset="utf-8"><title>' . $nu->h($S['reauth_ok']) . '</title>'
			. '<body style="font-family:system-ui,sans-serif;padding:2rem"><p>' . $nu->h($S['reauth_ok_close']) . '</p>'
			. '<script src="' . $nu->h($nu->asset('assets/reauth.js')) . '"></script></body></html>';
		exit;
	}
}

const NUF_JS = <<<'NUFJS'
/* nuFiles for nuBuilder Forte: fetch with the CSRF token, and Ace (third_party/ace of Forte) behind the few CodeMirror calls app.js makes. */
(function () {
	'use strict';
	window.nufFetch = function (u, opts) {
		opts = opts || {};
		opts.credentials = 'same-origin';
		opts.headers = Object.assign({'X-CSRF-Token': (JSON.parse(document.getElementById('nufBoot').textContent || '{}').csrf || '')}, opts.headers || {});
		return fetch(u, opts);
	};
	var MODES = {'application/x-httpd-php': 'php', 'text/javascript': 'javascript', 'text/typescript': 'typescript', 'application/json': 'javascript',
		'text/css': 'css', 'text/x-scss': 'css', 'text/x-less': 'css', 'text/html': 'html', 'application/xml': 'html', 'text/x-mysql': 'mysql', 'text/plain': 'text'};
	window.NufAce = {fromTextArea: function (ta, opt) {
		var base = document.body.getAttribute('data-ace');
		if (base) window.ace.config.set('basePath', base);
		var host = document.createElement('div');
		host.className = 'nuf-ace';
		ta.parentNode.insertBefore(host, ta);
		ta.style.display = 'none';
		var ed = window.ace.edit(host, {useWorker: false, showPrintMargin: false, tabSize: 4, useSoftTabs: false, fontSize: 13});
		var rev = 0, handlers = {};
		var dark = function () { return document.documentElement.getAttribute('data-bs-theme') === 'dark'; };
		var theme = function () { ed.setTheme(dark() ? 'ace/theme/tomorrow_night' : 'ace/theme/chrome'); };
		theme();
		new MutationObserver(theme).observe(document.documentElement, {attributes: true, attributeFilter: ['data-bs-theme']});
		var fire = function (n) { (handlers[n] || []).forEach(function (f) { f(); }); };
		ed.session.on('change', function () { rev++; fire('changes'); });
		ed.selection.on('changeCursor', function () { fire('cursorActivity'); });
		var keys = (opt && opt.extraKeys) || {};
		ed.commands.addCommand({name: 'nufSave', bindKey: {win: 'Ctrl-S', mac: 'Command-S'}, exec: function () { if (keys['Ctrl-S']) keys['Ctrl-S'](); }});
		ed.commands.addCommand({name: 'nufEsc', bindKey: {win: 'Esc', mac: 'Esc'}, exec: function () { if (keys.Esc) keys.Esc(); }});
		return {
			on: function (n, f) { (handlers[n] = handlers[n] || []).push(f); },
			refresh: function () { ed.resize(true); },
			focus: function () { ed.focus(); },
			setOption: function (k, v) {
				if (k === 'lineWrapping') ed.session.setUseWrapMode(!!v);
				else if (k === 'readOnly') ed.setReadOnly(!!v);
				else if (k === 'mode') ed.session.setMode('ace/mode/' + (MODES[v] || 'text'));
				else if (k === 'lineSeparator') ed.session.setNewLineMode(v === '\r\n' ? 'windows' : 'unix');
			},
			setValue: function (v) { ed.session.setValue(v); },
			getValue: function () { return ed.session.getValue(); },
			clearHistory: function () { ed.session.getUndoManager().reset(); },
			changeGeneration: function () { return rev; },
			isClean: function (g) { return g === rev; },
			markClean: function () { /* the caller takes changeGeneration() afterwards */ },
			getCursor: function () { var p = ed.getCursorPosition(); return {line: p.row, ch: p.column}; },
			setCursor: function (p) { ed.gotoLine(p.line + 1, p.ch || 0, false); },
			scrollIntoView: function () { ed.renderer.scrollCursorIntoView(null, 0.5); },
			ace: ed
		};
	}};
}());
/* nuFiles – file manager page for nuBuilder Next. Vanilla JavaScript + Bootstrap 5 + CodeMirror 5 (all shipped with nuBuilder Next).
 * Every name from the server is put into the page with textContent / attributes – never as HTML. */
(function () {
	'use strict';

	var boot = JSON.parse(document.getElementById('nufBoot').textContent || '{}');
	var S = boot.strings || {};
	var $ = function (id) { return document.getElementById(id); };
	var TEXT_EXT = ['txt', 'md', 'csv', 'tsv', 'log', 'json', 'xml', 'html', 'htm', 'css', 'scss', 'less', 'js', 'mjs', 'ts', 'php', 'phtml', 'inc', 'sql', 'ini',
		'conf', 'cfg', 'yml', 'yaml', 'env', 'htaccess', 'sh', 'py', 'rb', 'pl', 'java', 'c', 'h', 'cpp', 'cs', 'go', 'vue', 'svg', 'tpl', 'twig', 'bat', 'ps1',
		'properties', 'gitignore', 'lock', 'dist', 'example', 'sample', 'editorconfig', 'map'];
	var IMG_EXT = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'avif', 'ico'];
	var VIDEO_EXT = ['mp4', 'webm', 'ogv', 'mov', 'm4v'];
	var AUDIO_EXT = ['mp3', 'ogg', 'oga', 'wav', 'm4a', 'flac', 'aac', 'opus'];

	var state = {
		view: 'files',          // files | search | trash | log
		share: null,            // share object of boot.shares
		path: '',
		items: [],
		sel: new Set(),
		sort: {key: 'name', dir: 1},
		query: '',
		listing: null
	};

	// ================================================================== small helpers

	function t(key) {
		var s = Object.prototype.hasOwnProperty.call(S, key) ? S[key] : key;
		for (var i = 1; i < arguments.length; i++) s = s.split('%' + i).join(String(arguments[i]));
		return s;
	}

	function el(tag, attrs, children) {
		var e = document.createElement(tag);
		if (attrs) Object.keys(attrs).forEach(function (k) {
			var v = attrs[k];
			if (v === null || v === undefined || v === false) return;
			if (k === 'text') e.textContent = v;
			else if (k === 'class') e.className = v;
			else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
			else e.setAttribute(k, v === true ? '' : v);
		});
		(children || []).forEach(function (c) { if (c !== null && c !== undefined) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
		return e;
	}

	var FA = {"arrow-clockwise":"fa-solid fa-rotate-right","arrow-right-square":"fa-solid fa-arrow-right","clock-history":"fa-solid fa-clock-rotate-left","cloud-arrow-up":"fa-solid fa-cloud-arrow-up","copy":"fa-regular fa-copy","download":"fa-solid fa-download","exclamation-triangle":"fa-solid fa-triangle-exclamation","file-earmark-plus":"fa-solid fa-file-circle-plus","file-earmark-zip":"fa-regular fa-file-zipper","floppy":"fa-solid fa-floppy-disk","folder-fill":"fa-solid fa-folder","folder-symlink-fill":"fa-solid fa-folder","folder-plus":"fa-solid fa-folder-plus","hdd-network":"fa-solid fa-server","journal-text":"fa-solid fa-book","link-45deg":"fa-solid fa-link","list":"fa-solid fa-bars","lock":"fa-solid fa-lock","search":"fa-solid fa-magnifying-glass","text-wrap":"fa-solid fa-paragraph","trash3":"fa-regular fa-trash-can","upload":"fa-solid fa-upload","x-lg":"fa-solid fa-xmark","arrow-90deg-up":"fa-solid fa-turn-up","arrow-counterclockwise":"fa-solid fa-rotate-left","clipboard":"fa-regular fa-clipboard","shield-lock":"fa-solid fa-shield-halved","three-dots-vertical":"fa-solid fa-ellipsis-vertical","x-octagon":"fa-solid fa-circle-xmark","file-earmark":"fa-regular fa-file","file-earmark-code":"fa-regular fa-file-code","file-earmark-image":"fa-regular fa-file-image","file-earmark-music":"fa-regular fa-file-audio","file-earmark-pdf":"fa-regular fa-file-pdf","file-earmark-play":"fa-regular fa-file-video","file-earmark-slides":"fa-regular fa-file-powerpoint","file-earmark-spreadsheet":"fa-regular fa-file-excel","file-earmark-text":"fa-regular fa-file-lines","file-earmark-word":"fa-regular fa-file-word","info-circle":"fa-solid fa-circle-info","pencil":"fa-solid fa-pencil","code-square":"fa-solid fa-code","folder2":"fa-regular fa-folder","folder2-open":"fa-regular fa-folder-open","box-arrow-up":"fa-solid fa-arrow-up-from-bracket","input-cursor-text":"fa-solid fa-i-cursor","pencil-square":"fa-regular fa-pen-to-square","eye":"fa-regular fa-eye","key":"fa-solid fa-key","file-earmark-arrow-down":"fa-solid fa-file-arrow-down","chevron-left":"fa-solid fa-chevron-left","chevron-down":"fa-solid fa-chevron-down","three-dots":"fa-solid fa-ellipsis","clock":"fa-regular fa-clock","hdd":"fa-solid fa-hard-drive","grid-3x3-gap":"fa-solid fa-table-cells","list-ul":"fa-solid fa-list","moon-stars":"fa-solid fa-moon","sun":"fa-solid fa-sun"};
	function bi(name) { return 'bi ' + (FA[name] || 'fa-regular fa-file'); }   // Forte: Font Awesome instead of Bootstrap Icons
	function icon(name) { return el('i', {'class': bi(name), 'aria-hidden': 'true'}); }

	function size(n) {
		if (n === null || n === undefined) return '';
		if (n < 1024) return n + ' B';
		var u = ['KB', 'MB', 'GB', 'TB'], i = -1;
		do { n /= 1024; i++; } while (n >= 1024 && i < u.length - 1);
		return n.toFixed(n < 10 ? 1 : 0) + ' ' + u[i];
	}

	var dateFmt = (function () {
		try { return new Intl.DateTimeFormat(boot.lang || undefined, {dateStyle: 'medium', timeStyle: 'short'}); } catch (e) { return null; }
	}());
	function when(ts) {
		if (!ts) return '';
		var d = new Date(ts * 1000);
		return dateFmt ? dateFmt.format(d) : d.toLocaleString();
	}

	function ext(name) {
		var i = name.lastIndexOf('.');
		return i > 0 ? name.slice(i + 1).toLowerCase() : (name.charAt(0) === '.' ? name.slice(1).toLowerCase() : '');
	}

	function join(a, b) { return a ? (b ? a + '/' + b : a) : b; }
	function parent(p) { var i = p.lastIndexOf('/'); return i < 0 ? '' : p.slice(0, i); }
	function base(p) { var i = p.lastIndexOf('/'); return i < 0 ? p : p.slice(i + 1); }

	function can(right, share) {
		share = share || state.share;
		return !!share && share.rights.indexOf(right) >= 0 && !boot.readonly;
	}

	function fileIcon(it) {
		if (it.type === 'dir') return it.link ? 'folder-symlink-fill' : 'folder-fill';
		if (it.outside) return 'link-45deg';
		var e = it.ext || ext(it.name);
		if (IMG_EXT.indexOf(e) >= 0 || e === 'svg') return 'file-earmark-image';
		if (e === 'pdf') return 'file-earmark-pdf';
		if (['zip', 'gz', 'tgz', 'tar', '7z', 'rar', 'bz2', 'xz'].indexOf(e) >= 0) return 'file-earmark-zip';
		if (VIDEO_EXT.indexOf(e) >= 0) return 'file-earmark-play';
		if (AUDIO_EXT.indexOf(e) >= 0) return 'file-earmark-music';
		if (['xls', 'xlsx', 'ods', 'csv', 'tsv'].indexOf(e) >= 0) return 'file-earmark-spreadsheet';
		if (['doc', 'docx', 'odt', 'rtf'].indexOf(e) >= 0) return 'file-earmark-word';
		if (['ppt', 'pptx', 'odp'].indexOf(e) >= 0) return 'file-earmark-slides';
		if (['php', 'js', 'mjs', 'ts', 'css', 'scss', 'less', 'html', 'htm', 'json', 'xml', 'sql', 'sh', 'py', 'vue', 'twig', 'tpl', 'phtml', 'inc'].indexOf(e) >= 0) return 'file-earmark-code';
		if (TEXT_EXT.indexOf(e) >= 0) return 'file-earmark-text';
		return 'file-earmark';
	}

	function kind(name) {
		var e = ext(name);
		if (IMG_EXT.indexOf(e) >= 0) return 'image';
		if (e === 'pdf') return 'pdf';
		if (VIDEO_EXT.indexOf(e) >= 0) return 'video';
		if (AUDIO_EXT.indexOf(e) >= 0) return 'audio';
		if (e === 'zip') return 'zip';
		if (TEXT_EXT.indexOf(e) >= 0 || e === '') return 'text';
		return 'other';
	}

	// ================================================================== toasts and dialogs

	function toast(text, level) {
		var cls = {success: 'text-bg-success', danger: 'text-bg-danger', warning: 'text-bg-warning', info: 'text-bg-secondary'}[level || 'info'] || 'text-bg-secondary';
		var box = el('div', {'class': 'toast align-items-center border-0 ' + cls, role: level === 'danger' ? 'alert' : 'status'}, [
			el('div', {'class': 'd-flex'}, [el('div', {'class': 'toast-body', text: text}),
				el('button', {type: 'button', 'class': 'btn-close me-2 m-auto' + (level === 'warning' ? '' : ' btn-close-white'), 'data-bs-dismiss': 'toast', 'aria-label': t('close')})])
		]);
		$('nufToasts').appendChild(box);
		var tt = new bootstrap.Toast(box, {delay: level === 'danger' ? 8000 : 3500});
		box.addEventListener('hidden.bs.toast', function () { box.remove(); });
		tt.show();
	}

	/** Bootstrap ignores hide() while a modal is still fading in (a quick Enter): hide as soon as it is shown. */
	function hideModal(m, elId) {
		var node = $(elId);
		if (node.classList.contains('show') && !node.hasAttribute('data-nuf-showing')) { m.hide(); return; }
		node.addEventListener('shown.bs.modal', function f() { node.removeEventListener('shown.bs.modal', f); m.hide(); });
	}
	['nufDlg', 'nufPick', 'nufPreview', 'nufEditor'].forEach(function (id) {
		var node = $(id);
		node.addEventListener('show.bs.modal', function () { node.setAttribute('data-nuf-showing', '1'); });
		node.addEventListener('shown.bs.modal', function () { node.removeAttribute('data-nuf-showing'); });
	});

	var dlg = {modal: null, resolve: null, value: null};
	function dialog(opt) {
		// opt: {title, text, input (default value), buttons: [{label, value, cls}], validate(value) → error text|''}
		return new Promise(function (resolve) {
			if (!dlg.modal) dlg.modal = new bootstrap.Modal($('nufDlg'));
			dlg.resolve = resolve;
			dlg.value = null;
			dlg.validate = opt.validate || null;
			$('nufDlgTitle').textContent = opt.title || '';
			var txt = $('nufDlgText');
			txt.textContent = '';
			if (opt.node) txt.appendChild(opt.node); else txt.textContent = opt.text || '';
			var inp = $('nufDlgInput');
			inp.classList.toggle('d-none', opt.input === undefined);
			inp.classList.remove('is-invalid');
			inp.value = opt.input === undefined ? '' : opt.input;
			var foot = $('nufDlgFoot');
			foot.textContent = '';
			(opt.buttons || [{label: t('ok'), value: true, cls: 'btn-primary'}]).forEach(function (b, i, all) {
				var isSubmit = i === all.length - 1;
				foot.appendChild(el('button', {type: isSubmit ? 'submit' : 'button', 'class': 'btn ' + (b.cls || 'btn-secondary'), text: b.label,
					onclick: isSubmit ? null : function () { dlg.value = b.value; hideModal(dlg.modal, 'nufDlg'); }}));
				if (isSubmit) dlg.submitValue = b.value;
			});
			dlg.modal.show();
			if (opt.input !== undefined) {
				$('nufDlg').addEventListener('shown.bs.modal', function f() {
					$('nufDlg').removeEventListener('shown.bs.modal', f);
					inp.focus();
					var dot = inp.value.lastIndexOf('.');
					if (opt.selectStem && dot > 0) inp.setSelectionRange(0, dot); else inp.select();
				});
			}
		});
	}
	$('nufDlgForm').addEventListener('submit', function (e) {
		e.preventDefault();
		var inp = $('nufDlgInput');
		if (!inp.classList.contains('d-none')) {
			var err = dlg.validate ? dlg.validate(inp.value) : '';
			if (err) { $('nufDlgErr').textContent = err; inp.classList.add('is-invalid'); return; }
			dlg.value = dlg.submitValue === true ? inp.value : dlg.submitValue;
		} else {
			dlg.value = dlg.submitValue;
		}
		hideModal(dlg.modal, 'nufDlg');
	});
	$('nufDlg').addEventListener('hidden.bs.modal', function () {
		var r = dlg.resolve;
		dlg.resolve = null;
		if (r) r(dlg.value);
	});

	function prompt(title, value, selectStem) {
		return dialog({title: title, input: value || '', selectStem: selectStem, validate: function (v) { return v.trim() === '' ? t('err_name_empty') : ''; },
			buttons: [{label: t('cancel'), value: null}, {label: t('ok'), value: true, cls: 'btn-primary'}]}).then(function (v) { return v === null || v === undefined ? null : v.trim(); });
	}

	function confirmBox(title, text, okLabel, danger) {
		return dialog({title: title, text: text, buttons: [{label: t('cancel'), value: false}, {label: okLabel || t('ok'), value: true, cls: danger ? 'btn-danger' : 'btn-primary'}]})
			.then(function (v) { return v === true; });
	}

	// ================================================================== server calls

	function url(action, params) {
		var u = boot.base + (boot.base.indexOf('?') >= 0 ? '&' : '?') + 'action=' + encodeURIComponent(action);
		Object.keys(params || {}).forEach(function (k) {
			if (params[k] !== undefined && params[k] !== null) u += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
		});
		return u;
	}

	function ApiError(status, data) {
		this.status = status;
		this.data = data || {};
		this.key = this.data.error || 'err_server';
		this.message = this.data.message || t('unknown_error');
	}

	function call(action, params, post, extra) {
		var opts = {method: post ? 'POST' : 'GET'};
		var u;
		if (post) {
			var fd = new FormData();
			Object.keys(params || {}).forEach(function (k) {
				var v = params[k];
				if (v === undefined || v === null) return;
				if (v instanceof Blob) fd.append(k, v, k + '.bin'); else fd.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
			});
			opts.body = fd;
			u = url(action);
		} else {
			u = url(action, params);
		}
		if (extra && extra.signal) opts.signal = extra.signal;
		return nufFetch(u, opts).then(function (r) {
			return r.text().then(function (txt) {
				var d = null;
				try { d = JSON.parse(txt); } catch (e) { d = {error: 'err_server', message: t('unknown_error') + ' (HTTP ' + r.status + ')'}; }
				if (r.ok && d && d.ok) return d;
				if (d && d.error === 'csrf') d.message = d.message || t('unknown_error');
				throw new ApiError(r.status, d);
			});
		});
	}

	/** call() that handles the password confirmation (code shares) and asks to retry. */
	function api(action, params, post, extra) {
		return call(action, params, post, extra).catch(function (e) {
			if (e instanceof ApiError && e.key === 'err_reauth' && e.data.reauth) {
				return reauth().then(function (ok) {
					if (!ok) throw e;
					return api(action, params, post, extra);
				});
			}
			throw e;
		});
	}

	function fail(e) {
		if (e && e.name === 'AbortError') return;
		var msg = e instanceof ApiError ? e.message : (e && e.message) || t('unknown_error');
		toast(msg, 'danger');
		if (window.console && !(e instanceof ApiError)) window.console.error(e);
	}

	// password confirmation in a small window (core page ?p=reauth); the window tells us when it is done (assets/reauth.js)
	var reauthWait = null;
	function reauth() {
		if (reauthWait) return reauthWait;
		reauthWait = new Promise(function (resolve) {
			var ask = function (err) {
				var inp = $('nufDlgInput');
				inp.type = 'password';
				inp.setAttribute('autocomplete', 'current-password');
				dialog({title: t('reauth_title'), text: err || t('reauth_text'), input: '',
					buttons: [{label: t('cancel'), value: null}, {label: t('reauth_open'), value: true, cls: 'btn-primary'}]}).then(function (v) {
					inp.type = 'text';
					inp.setAttribute('autocomplete', 'off');
					if (v === null || v === undefined) { reauthWait = null; resolve(false); return; }
					call('reauth', {password: v}, true).then(function () { reauthWait = null; resolve(true); })
						.catch(function (e) { ask(e instanceof ApiError ? e.message : t('unknown_error')); });
				});
			};
			ask('');
		});
		return reauthWait;
	}

	// ================================================================== shares, navigation

	function shareById(id) { return (boot.shares || []).filter(function (s) { return s.id === id; })[0] || null; }

	function renderShares() {
		var nav = $('nufShares');
		nav.textContent = '';
		(boot.shares || []).forEach(function (s) {
			var a = el('a', {href: '#/' + encodeURIComponent(s.id) + '/', 'class': 'nav-link nuf-share' + (state.view === 'files' && state.share && state.share.id === s.id ? ' active' : ''),
				'data-share': s.id, title: s.root || s.label}, [
				icon(s.type === 'code' ? 'code-square' : 'folder2'), el('span', {'class': 'nuf-share-label', text: s.label}),
				s.type === 'code' ? el('span', {'class': 'badge bg-danger-subtle text-danger-emphasis ms-1', text: t('code_badge')}) : null,
				s.readonly || boot.readonly || s.rights.length === 1 ? el('i', {'class': bi('lock') + ' ms-1 small', title: t('readonly_badge')}) : null,
				!s.ok ? el('i', {'class': bi('exclamation-triangle') + ' text-warning ms-1', title: t('err_share_broken')}) : null
			]);
			nav.appendChild(a);
		});
		if (!(boot.shares || []).length) nav.appendChild(el('div', {'class': 'px-3 py-2 small text-body-secondary', text: t('no_shares')}));
		$('nufTrashBtn').classList.toggle('active', state.view === 'trash');
		$('nufLogBtn').classList.toggle('active', state.view === 'log');
	}

	function hashFor(share, path) {
		return '#/' + encodeURIComponent(share) + '/' + path.split('/').filter(Boolean).map(encodeURIComponent).join('/');
	}

	function readHash() {
		var h = window.location.hash.replace(/^#\/?/, '');
		if (h === 'trash') return {view: 'trash'};
		if (h === 'log') return {view: 'log'};
		var parts = h.split('/');
		var id = '';
		try { id = decodeURIComponent(parts.shift() || ''); } catch (e) { id = ''; }
		var path = parts.filter(Boolean).map(function (p) { try { return decodeURIComponent(p); } catch (e) { return p; } }).join('/');
		return {view: 'files', share: id, path: path};
	}

	function go(share, path) {
		var h = hashFor(share, path || '');
		if (window.location.hash === h) route(); else window.location.hash = h;
	}

	function route() {
		var r = readHash();
		if (r.view === 'trash') return showTrash();
		if (r.view === 'log') return boot.features.log ? showLog() : go((boot.shares[0] || {}).id || '', '');
		var s = shareById(r.share) || (boot.shares || [])[0] || null;
		if (!s) { state.share = null; renderShares(); message(t('no_shares')); toolbar(); return; }
		if (s.id !== r.share) { go(s.id, ''); return; }
		state.view = 'files';
		state.share = s;
		state.path = r.path;
		state.query = '';
		$('nufSearch').value = '';
		load();
	}
	window.addEventListener('hashchange', route);
	// a link to the place already in the address (share in the side bar, breadcrumb during a search): no hashchange – load again
	document.addEventListener('click', function (e) {
		var a = e.target.closest('a[href^="#/"]');
		if (a && a.getAttribute('href') === window.location.hash && !e.ctrlKey && !e.metaKey) { e.preventDefault(); route(); }
	});

	function message(text) {
		var m = $('nufMsg');
		m.textContent = text || '';
		m.classList.toggle('d-none', !text);
	}

	// the path: a breadcrumb from 576 px (folders in between fold into "…" when it does not fit), on phones ‹ parent + the folder's
	// name, which opens the whole path as a list
	function crumbs() {
		var ol = $('nufCrumbs'), ph = $('nufPhPath');
		ol.textContent = '';
		ph.textContent = '';
		var items = [];   // {label, href|null, icon}
		if (state.view === 'trash' || state.view === 'log') {
			items.push({label: t(state.view === 'trash' ? 'trash' : 'log'), href: null, icon: state.view === 'trash' ? 'trash3' : 'journal-text'});
			document.title = t('title') + ' – ' + items[0].label;
		} else if (state.share) {
			var parts = state.path ? state.path.split('/') : [], search = state.view === 'search';
			items.push({label: state.share.label, href: parts.length || search ? hashFor(state.share.id, '') : null, icon: state.share.type === 'code' ? 'code-square' : 'folder2'});
			parts.forEach(function (p, i) {
				var last = i === parts.length - 1 && !search;
				items.push({label: p, href: last ? null : hashFor(state.share.id, parts.slice(0, i + 1).join('/'))});
			});
			if (search) items.push({label: t('search_results', state.query), href: null, icon: 'search'});
			document.title = t('title') + ' – ' + state.share.label + (state.path ? '/' + state.path : '');
		}
		if (!items.length) return;
		items.forEach(function (it, i) {
			var last = i === items.length - 1;
			var li = el('li', {'class': 'breadcrumb-item' + (last ? ' active' : ''), 'aria-current': last ? 'page' : null, 'data-i': String(i)});
			var kids = it.icon ? [icon(it.icon), ' ', it.label] : [it.label];
			li.appendChild(it.href ? el('a', {href: it.href, title: it.label}, kids) : el('span', {title: it.label}, kids));
			ol.appendChild(li);
		});
		ol._items = items;
		fitCrumbs();
		// phones
		var cur = items[items.length - 1], up = null;
		for (var j = items.length - 2; j >= 0; j--) if (items[j].href) { up = items[j]; break; }
		if (up) ph.appendChild(el('a', {'class': 'nuf-ph-up', href: up.href, title: t('up') + ': ' + up.label, 'aria-label': t('up') + ': ' + up.label}, [icon('chevron-left'), el('span', {text: up.label})]));
		var dd = el('div', {'class': 'dropdown nuf-ph-cur'});
		var btn = el('button', {type: 'button', 'class': 'nuf-ph-title', 'data-bs-toggle': items.length > 1 ? 'dropdown' : null, 'aria-expanded': 'false',
			'aria-label': t('path') + ': ' + items.map(function (x) { return x.label; }).join(' / ')}, [
			cur.icon ? icon(cur.icon) : null, el('span', {text: cur.label}), items.length > 1 ? icon('chevron-down') : null]);
		if (items.length < 2) btn.disabled = true;
		dd.appendChild(btn);
		if (items.length > 1) {
			var ul = el('ul', {'class': 'dropdown-menu nuf-ph-menu'});
			items.forEach(function (it, i) {
				var kids = [el('span', {'class': 'nuf-ph-ind', 'aria-hidden': 'true'}, [icon(it.icon || (i === items.length - 1 ? 'folder2-open' : 'folder2'))]), el('span', {'class': 'nuf-ph-nm', text: it.label})];
				var a = it.href ? el('a', {'class': 'dropdown-item', href: it.href}, kids) : el('span', {'class': 'dropdown-item active', 'aria-current': 'page'}, kids);
				a.style.paddingLeft = (0.75 + Math.min(i, 8) * 0.7) + 'rem';
				ul.appendChild(el('li', {}, [a]));
			});
			dd.appendChild(ul);
		}
		ph.appendChild(dd);
	}

	// breadcrumb wider than the bar: hide folders after the first one and show "…" with them as a menu (the last two stay)
	function fitCrumbs() {
		var ol = $('nufCrumbs'), items = ol._items;
		if (!items) return;
		var old = ol.querySelector('.nuf-crumb-more');
		if (old && old.querySelector('.dropdown-menu.show')) return;   // a resize while the "…" menu is open keeps it
		if (old) old.remove();
		Array.prototype.forEach.call(ol.children, function (li) { li.hidden = false; });
		var lastLi = ol.lastElementChild;
		function tooWide() { return ol.scrollWidth > ol.clientWidth + 1 || lastLi.scrollWidth > lastLi.clientWidth + 1; }
		if (!ol.offsetParent || items.length < 4 || !tooWide()) return;
		var more = el('li', {'class': 'breadcrumb-item nuf-crumb-more dropdown'});
		var ul = el('ul', {'class': 'dropdown-menu'});
		more.appendChild(el('button', {type: 'button', 'class': 'btn btn-link btn-sm p-0 nuf-crumb-more-btn', 'data-bs-toggle': 'dropdown', 'data-bs-popper-config': '{"strategy":"fixed"}', 'aria-expanded': 'false', 'aria-label': t('more_levels'), title: t('more_levels')}, [icon('three-dots')]));
		more.appendChild(ul);
		ol.insertBefore(more, ol.children[1]);
		var lis = ol.querySelectorAll('li[data-i]');
		for (var i = 1; i < lis.length - 2; i++) {
			lis[i].hidden = true;
			var it = items[i];
			ul.appendChild(el('li', {}, [el('a', {'class': 'dropdown-item', href: it.href}, [icon('folder2'), ' ', it.label])]));
			if (!tooWide()) break;
		}
	}
	var fitTimer = null;
	window.addEventListener('resize', function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitCrumbs, 120); });

	function toolbar() {
		var files = state.view === 'files' || state.view === 'search';
		$('nufTools').classList.toggle('d-none', !files || !state.share);
		$('nufSearchForm').classList.toggle('d-none', !files || !state.share);
		var grid = files && state.layout === 'grid';
		$('nufTable').classList.toggle('d-none', !files || grid);
		$('nufGrid').classList.toggle('d-none', !grid);
		$('nufGridBar').classList.toggle('d-none', !grid || !state.share);
		$('nufLayoutBtn').classList.toggle('d-none', !files);
		$('nufColToggle').classList.toggle('nuf-off', grid);
		$('nufTable2').classList.toggle('d-none', files);
		$('nufRoBadge').classList.toggle('d-none', !(boot.readonly || (state.share && state.share.rights.length === 1)));
		if (!state.share) return;
		var nsel = state.sel.size;
		document.querySelectorAll('#nufTools [data-need]').forEach(function (b) {
			var need = b.getAttribute('data-need').split('|');
			var ok = need.some(function (r) { return r === 'view' ? !!state.share : can(r); });
			if (b.id === 'nufCopyBtn') ok = (boot.shares || []).some(function (s) { return can(s.id === state.share.id ? 'copy' : 'upload', s); });
			b.classList.toggle('d-none', !ok);
		});
		document.querySelectorAll('#nufTools [data-sel]').forEach(function (b) { b.disabled = nsel === 0; });
		$('nufMkdirBtn').disabled = state.view === 'search';
		$('nufNewFileBtn').disabled = state.view === 'search';
		$('nufUploadBtn').disabled = state.view === 'search';
	}

	// ================================================================== the list

	function load(keepSel) {
		if (!state.share) return Promise.resolve();
		var share = state.share, path = state.path;
		state.view = 'files';
		renderShares();
		crumbs();
		message(t('loading'));
		$('nufRows').textContent = '';
		return api('list', {share: share.id, path: path}).then(function (d) {
			if (state.share !== share || state.path !== path || state.view !== 'files') return;
			state.path = d.path;
			state.items = d.items;
			state.listing = d;
			if (!keepSel) state.sel.clear();
			else state.sel.forEach(function (n) { if (!d.items.some(function (i) { return i.name === n; })) state.sel.delete(n); });
			render();
		}).catch(function (e) {
			message(e.message || t('unknown_error'));
			if (e instanceof ApiError && (e.key === 'err_not_found' || e.key === 'err_not_folder') && path !== '') { toast(e.message, 'warning'); go(share.id, parent(path)); return; }
			if (!(e instanceof ApiError)) fail(e);
			toolbar();
		});
	}

	function sorted(items) {
		var k = state.sort.key, dir = state.sort.dir;
		var coll = typeof Intl !== 'undefined' ? new Intl.Collator(boot.lang || undefined, {numeric: true, sensitivity: 'base'}) : null;
		return items.slice().sort(function (a, b) {
			if (a.type !== b.type && state.view === 'files') return a.type === 'dir' ? -1 : 1;
			var r = 0;
			if (k === 'size') r = (a.size || 0) - (b.size || 0);
			else if (k === 'mtime') r = (a.mtime || 0) - (b.mtime || 0);
			if (r === 0) r = coll ? coll.compare(a.name, b.name) : (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
			return r * dir;
		});
	}

	function keyOf(it) { return state.view === 'search' ? join(it.dir, it.name) : it.name; }
	function pathOf(it) { return state.view === 'search' ? join(it.dir, it.name) : join(state.path, it.name); }

	function render() {
		toolbar();
		crumbs();
		var tb = $('nufRows'), gridOn = state.layout === 'grid';
		tb.textContent = '';
		$('nufGrid').textContent = '';
		var items = sorted(state.items);
		message(items.length ? '' : (state.view === 'search' ? t('no_results') : t('empty_folder')));
		if (gridOn) {
			var gf = document.createDocumentFragment();
			if (state.view === 'files' && state.path !== '') {
				gf.appendChild(el('a', {'class': 'nuf-tile nuf-tile-up', href: hashFor(state.share.id, parent(state.path)), title: t('up')}, [
					el('div', {'class': 'nuf-thumb'}, [icon('arrow-90deg-up')]), el('div', {'class': 'nuf-tname', text: '..'})]));
			}
			items.forEach(function (it) { gf.appendChild(tile(it)); });
			$('nufGrid').appendChild(gf);
		} else if (state.view === 'files' && state.path !== '') {
			tb.appendChild(el('tr', {'class': 'nuf-up', ondblclick: function () { go(state.share.id, parent(state.path)); }}, [
				el('td'), el('td', {colspan: '4'}, [el('a', {href: hashFor(state.share.id, parent(state.path)), 'class': 'nuf-name'}, [icon('arrow-90deg-up'), ' ..'])])
			]));
		}
		if (!gridOn) {
			var frag = document.createDocumentFragment();
			items.forEach(function (it) { frag.appendChild(row(it)); });
			tb.appendChild(frag);
		}
		document.querySelectorAll('.nuf-sort').forEach(function (b) {
			b.classList.toggle('nuf-sorted', b.getAttribute('data-sort') === state.sort.key);
			b.setAttribute('data-dir', state.sort.dir > 0 ? 'asc' : 'desc');
		});
		status();
	}

	function row(it) {
		var key = keyOf(it);
		var p = pathOf(it);
		var chk = el('input', {type: 'checkbox', 'class': 'form-check-input', 'aria-label': it.name, checked: state.sel.has(key) ? true : null});
		chk.addEventListener('change', function () { if (chk.checked) state.sel.add(key); else state.sel.delete(key); tr.classList.toggle('table-active', chk.checked); status(); toolbar(); });
		var nameLink = el('a', {href: it.type === 'dir' ? hashFor(state.share.id, p) : '#', 'class': 'nuf-name', title: it.outside ? t('link_outside') : it.name}, [
			el('i', {'class': bi(fileIcon(it)) + (it.type === 'dir' ? ' nuf-ico-dir' : ''), 'aria-hidden': 'true'}), el('span', {text: it.name})]);
		if (it.type !== 'dir') nameLink.addEventListener('click', function (e) { e.preventDefault(); open(it, p); });
		var nameCell = el('td', {'class': 'nuf-c-name'}, [nameLink]);
		if (it.link) nameCell.appendChild(el('i', {'class': bi('link-45deg') + ' ms-1 text-body-secondary', title: it.outside ? t('link_outside') : 'symlink'}));
		if (state.view === 'search') nameCell.appendChild(el('div', {'class': 'small text-body-secondary text-truncate', text: '/' + it.dir}));
		var tr = el('tr', {'class': state.sel.has(key) ? 'table-active' : null, 'data-key': key}, [
			el('td', {'class': 'nuf-c-check'}, [chk]),
			nameCell,
			el('td', {'class': 'nuf-c-size text-end text-nowrap', text: it.type === 'dir' ? '' : size(it.size)}),
			el('td', {'class': 'nuf-c-time text-nowrap', text: when(it.mtime)}),
			el('td', {'class': 'nuf-c-act text-end'}, [menu(it, p)])
		]);
		tr.addEventListener('dblclick', function (e) {
			if (e.target.closest('input, button, a, .dropdown-menu')) return;
			if (it.type === 'dir') go(state.share.id, p); else open(it, p);
		});
		// right-click (mouse / desktop): the row's ⋮ menu opens at the pointer; the row becomes the selection unless it is part of it
		tr.addEventListener('contextmenu', function (e) {
			if (e.target.closest('.dropdown-menu, input[type=text]') || !window.matchMedia('(any-pointer: fine)').matches) return;
			e.preventDefault();
			if (!state.sel.has(key)) {
				state.sel.clear();
				document.querySelectorAll('#nufRows tr.table-active').forEach(function (r) { r.classList.remove('table-active'); var c = r.querySelector('input'); if (c) c.checked = false; });
				chk.checked = true; state.sel.add(key); tr.classList.add('table-active');
				status(); toolbar();
			}
			openMenuAt(tr.querySelector('.nuf-more'), e.clientX, e.clientY);
		});
		tr.addEventListener('click', function (e) {
			if (e.target.closest('input, button, a, .dropdown-menu')) return;
			if (e.ctrlKey || e.metaKey) {
				chk.checked = !chk.checked;
			} else {
				state.sel.clear();
				document.querySelectorAll('#nufRows tr.table-active').forEach(function (r) { r.classList.remove('table-active'); var c = r.querySelector('input'); if (c) c.checked = false; });
				chk.checked = true;
			}
			if (chk.checked) state.sel.add(key); else state.sel.delete(key);
			tr.classList.toggle('table-active', chk.checked);
			status(); toolbar();
		});
		return tr;
	}

	/** Pictures the grid view shows: a server thumbnail (GD) or, for SVG, the file itself. */
	function thumbable(it) {
		if (it.type === 'dir' || it.outside || !boot.features) return false;
		var e = it.ext || ext(it.name);
		if (e === 'svg') return (it.size || 0) <= 1048576;
		return !!boot.features.thumbs && ['png', 'jpg', 'jpeg', 'gif', 'webp'].indexOf(e) >= 0 && (it.size || 0) > 0;
	}

	/** One tile of the grid view – same selection, double click, right-click and ⋮ menu as a row of the list. */
	function tile(it) {
		var key = keyOf(it), p = pathOf(it);
		var chk = el('input', {type: 'checkbox', 'class': 'form-check-input nuf-tcheck', 'aria-label': it.name, checked: state.sel.has(key) ? true : null});
		var ico = icon(fileIcon(it));
		if (it.type === 'dir') ico.classList.add('nuf-ico-dir');
		var box = el('div', {'class': 'nuf-thumb'}, [ico]);
		if (thumbable(it)) {
			var img = el('img', {alt: '', loading: 'lazy', decoding: 'async', draggable: 'false', src: url('thumb', {share: state.share.id, path: p, v: (it.mtime || 0) + '-' + (it.size || 0)})});
			img.addEventListener('load', function () { box.classList.add('nuf-thumb-img'); });
			img.addEventListener('error', function () { img.remove(); });
			box.appendChild(img);
		}
		var name = el('a', {href: it.type === 'dir' ? hashFor(state.share.id, p) : '#', 'class': 'nuf-tname', title: it.outside ? t('link_outside') : it.name, text: it.name});
		if (it.type !== 'dir') name.addEventListener('click', function (e) { e.preventDefault(); if (!e.ctrlKey && !e.metaKey) open(it, p); });
		var sub = state.view === 'search' ? '/' + it.dir : (it.type === 'dir' ? when(it.mtime) : size(it.size));
		var div = el('div', {'class': 'nuf-tile' + (state.sel.has(key) ? ' nuf-sel' : ''), 'data-key': key}, [
			chk, el('div', {'class': 'nuf-tmenu'}, [menu(it, p)]), box, name, el('div', {'class': 'nuf-tsub', text: sub, title: when(it.mtime)})
		]);
		function clearOthers() {
			state.sel.clear();
			document.querySelectorAll('#nufGrid .nuf-tile.nuf-sel').forEach(function (x) { x.classList.remove('nuf-sel'); var c = x.querySelector('.nuf-tcheck'); if (c) c.checked = false; });
		}
		function apply() {
			if (chk.checked) state.sel.add(key); else state.sel.delete(key);
			div.classList.toggle('nuf-sel', chk.checked);
			status(); toolbar();
		}
		chk.addEventListener('change', apply);
		div.addEventListener('dblclick', function (e) {
			if (e.target.closest('input, button, a, .dropdown-menu')) return;
			if (it.type === 'dir') go(state.share.id, p); else open(it, p);
		});
		div.addEventListener('contextmenu', function (e) {
			if (e.target.closest('.dropdown-menu') || !window.matchMedia('(any-pointer: fine)').matches) return;
			e.preventDefault();
			if (!state.sel.has(key)) { clearOthers(); chk.checked = true; apply(); }
			openMenuAt(div.querySelector('.nuf-more'), e.clientX, e.clientY);
		});
		div.addEventListener('click', function (e) {
			if (e.target.closest('input, button, a, .dropdown-menu')) return;
			if (e.ctrlKey || e.metaKey) chk.checked = !chk.checked;
			else { clearOthers(); chk.checked = true; }
			apply();
		});
		return div;
	}

	/** Opens the ⋮ dropdown of a row at the mouse (a Bootstrap dropdown with a virtual reference); afterwards the ⋮ button works as before. */
	function openMenuAt(btn, x, y) {
		if (!btn) return;
		document.querySelectorAll('#nufView .dropdown-menu.show').forEach(function (m) { var b = m.parentNode.querySelector('.nuf-more'); var d = b && bootstrap.Dropdown.getInstance(b); if (d) d.hide(); });
		var old = bootstrap.Dropdown.getInstance(btn);
		if (old) old.dispose();
		var dd = new bootstrap.Dropdown(btn, {
			reference: {getBoundingClientRect: function () { return new DOMRect(x, y, 0, 0); }},
			popperConfig: function (cfg) { return Object.assign({}, cfg, {strategy: 'fixed', placement: 'bottom-start'}); }
		});
		btn.addEventListener('hidden.bs.dropdown', function done() { btn.removeEventListener('hidden.bs.dropdown', done); dd.dispose(); }, {once: true});
		dd.show();
		var first = btn.parentNode.querySelector('.dropdown-menu .dropdown-item');
		if (first) first.focus();
	}

	function menu(it, p) {
		var items = [];
		function add(label, ico, fn, cls) {
			items.push(el('li', {}, [el('button', {type: 'button', 'class': 'dropdown-item' + (cls ? ' ' + cls : ''), onclick: fn}, [icon(ico), ' ' + label])]));
		}
		var k = kind(it.name);
		if (it.type === 'dir') add(t('open'), 'folder2-open', function () { go(state.share.id, p); });
		else if (k === 'text') add(can('edit') ? t('edit') : t('open'), can('edit') ? 'pencil-square' : 'eye', function () { open(it, p); });
		else if (['image', 'pdf', 'video', 'audio'].indexOf(k) >= 0) add(t('preview'), 'eye', function () { preview(p); });
		if (it.type === 'dir') add(t('download_zip'), 'file-earmark-zip', function () { download([p]); });
		else add(t('download'), 'download', function () { download([p]); });
		if (it.type !== 'dir' && k === 'zip' && can('zip') && boot.features.zip) add(t('unzip'), 'box-arrow-up', function () { unzip(p); });
		if (can('rename')) add(t('rename'), 'input-cursor-text', function () { rename(it, p); });
		items.push(el('li', {}, [el('hr', {'class': 'dropdown-divider'})]));
		add(t('copy'), 'copy', function () { transfer([p], true); });
		if (can('rename') || can('delete')) add(t('move'), 'arrow-right-square', function () { transfer([p], false); });
		add(t('info'), 'info-circle', function () { info(p); });
		if (boot.features.chmod && !boot.readonly && !state.share.readonly) add(t('chmod'), 'shield-lock', function () { chmodDlg(it, p); });   // globeadmin
		if (can('delete')) { items.push(el('li', {}, [el('hr', {'class': 'dropdown-divider'})])); add(t('delete'), 'trash3', function () { remove([p]); }, 'text-danger'); }
		return el('div', {'class': 'dropdown'}, [
			el('button', {type: 'button', 'class': 'btn btn-sm btn-link text-body nuf-more', 'data-bs-toggle': 'dropdown', 'aria-expanded': 'false', 'aria-label': t('actions'), 'data-bs-popper-config': '{"strategy":"fixed"}'}, [icon('three-dots-vertical')]),
			el('ul', {'class': 'dropdown-menu dropdown-menu-end'}, items)
		]);
	}

	function status() {
		var l = $('nufStatusLeft'), r = $('nufStatusRight');
		if (state.view === 'trash' || state.view === 'log') { l.textContent = ''; r.textContent = ''; return; }
		var dirs = 0, files = 0, bytes = 0;
		state.items.forEach(function (i) { if (i.type === 'dir') dirs++; else { files++; bytes += i.size || 0; } });
		var txt = t('count_line', dirs, files, size(bytes));
		if (state.sel.size) txt += ' · ' + t('selected_n', state.sel.size);
		if (state.listing && state.listing.truncated) txt += ' · ' + t('entries_truncated', state.items.length);
		if (state.view === 'search' && state.listing && state.listing.partial) txt += ' · ' + t('partial_results');
		l.textContent = txt;
		r.textContent = state.view === 'files' && state.listing && state.listing.free ? t('free_space', size(state.listing.free)) : '';
		var all = $('nufAll');
		all.checked = state.items.length > 0 && state.sel.size === state.items.length;
		all.indeterminate = state.sel.size > 0 && state.sel.size < state.items.length;
		$('nufAllG').checked = all.checked; $('nufAllG').indeterminate = all.indeterminate;
	}

	function selectedPaths() {
		return state.items.filter(function (i) { return state.sel.has(keyOf(i)); }).map(pathOf);
	}

	$('nufAll').addEventListener('change', function () {
		var on = this.checked;
		state.sel.clear();
		if (on) state.items.forEach(function (i) { state.sel.add(keyOf(i)); });
		render();
	});

	$('nufAllG').addEventListener('change', function () { $('nufAll').checked = this.checked; $('nufAll').dispatchEvent(new Event('change')); });

	// list or tiles – the button left of Refresh switches, remembered in this browser
	(function () {
		var b = $('nufLayoutBtn');
		function set(grid) {
			state.layout = grid ? 'grid' : 'list';
			$('nufApp').classList.toggle('nuf-layout-grid', grid);
			b.setAttribute('aria-pressed', grid ? 'true' : 'false');
			var lbl = t(grid ? 'view_list' : 'view_grid');
			b.title = lbl; b.setAttribute('aria-label', lbl);
		}
		try { set(localStorage.getItem('nufLayout') === 'grid'); } catch (e) { set(false); }
		b.addEventListener('click', function () {
			set(state.layout !== 'grid');
			try { localStorage.setItem('nufLayout', state.layout); } catch (e) { /* private mode */ }
			if (state.view === 'files' || state.view === 'search') render(); else toolbar();
		});
	})();

	document.querySelectorAll('.nuf-sort').forEach(function (b) {
		b.addEventListener('click', function () {
			var k = b.getAttribute('data-sort');
			if (state.sort.key === k) state.sort.dir = -state.sort.dir; else { state.sort.key = k; state.sort.dir = k === 'name' ? 1 : -1; }
			try { localStorage.setItem('nufSort', JSON.stringify(state.sort)); } catch (e) { /* private mode */ }
			if (state.view === 'files' || state.view === 'search') render();
		});
	});
	try { var savedSort = JSON.parse(localStorage.getItem('nufSort') || 'null'); if (savedSort && savedSort.key) state.sort = savedSort; } catch (e) { /* none */ }

	// ================================================================== search

	$('nufSearchForm').addEventListener('submit', function (e) {
		e.preventDefault();
		var q = $('nufSearch').value.trim();
		if (!q) { go(state.share.id, state.path); return; }
		var share = state.share, path = state.path;
		state.view = 'search';
		state.query = q;
		state.sel.clear();
		state.items = [];
		crumbs();
		message(t('loading'));
		$('nufRows').textContent = '';
		api('search', {share: share.id, path: path, q: q}).then(function (d) {
			if (state.view !== 'search' || state.query !== q) return;
			state.items = d.items;
			state.listing = d;
			render();
		}).catch(function (e) { message(''); fail(e); });
	});
	$('nufSearch').addEventListener('search', function () { if (this.value === '' && state.view === 'search') go(state.share.id, state.path); });

	// ================================================================== actions

	function after(promise, okText) {
		// the selection is cleared afterwards: a later Delete must not hit what was just copied or moved
		return promise.then(function (d) { if (okText) toast(typeof okText === 'function' ? okText(d) : okText, 'success'); return load().then(function () { return d; }); })
			.catch(function (e) { fail(e); load(true); });
	}

	function mkdir() {
		prompt(t('prompt_folder'), '').then(function (name) {
			if (!name) return;
			after(api('mkdir', {share: state.share.id, path: state.path, name: name}, true));
		});
	}

	function newFile() {
		prompt(t('prompt_file'), '.txt', true).then(function (name) {
			if (!name) return;
			var share = state.share;
			api('newfile', {share: share.id, path: state.path, name: name}, true).then(function (d) {
				return load(true).then(function () { editor(share, d.path); });
			}).catch(fail);
		});
	}

	function rename(it, p) {
		prompt(t('prompt_rename'), it.name, it.type !== 'dir').then(function (name) {
			if (!name || name === it.name) return;
			after(api('rename', {share: state.share.id, path: p, name: name}, true));
		});
	}

	function remove(paths) {
		if (!paths.length) { toast(t('nothing_selected'), 'warning'); return; }
		var trash = state.share.trash && boot.features.trash;
		var names = paths.slice(0, 8).map(base).join(', ') + (paths.length > 8 ? ' …' : '');
		confirmBox(t('confirm_delete_n', paths.length), names + '\n\n' + t(trash ? 'confirm_delete_trash' : 'confirm_delete_final'), t('delete'), true).then(function (ok) {
			if (!ok) return;
			after(api('delete', {share: state.share.id, paths: paths}, true), function (d) { return t('deleted_n', d.done); });
		});
	}

	function transfer(paths, copy) {
		if (!paths.length) { toast(t('nothing_selected'), 'warning'); return; }
		var from = state.share;
		pickFolder(copy ? t('copy') : t('move'), function (s) {
			if (s.id === from.id) return can(copy ? 'copy' : 'rename', s);
			return can('upload', s) && (copy || can('delete', from));
		}).then(function (target) {
			if (!target) return;
			after(api(copy ? 'copy' : 'move', {share: from.id, paths: paths, to_share: target.share.id, to_path: target.path}, true),
				function (d) { return t(copy ? 'copied_n' : 'moved_n', d.done); });
		});
	}

	function zip(paths) {
		if (!paths.length) { toast(t('nothing_selected'), 'warning'); return; }
		var def = paths.length === 1 ? base(paths[0]).replace(/\.[^.]*$/, '') + '.zip' : (state.path ? base(state.path) : state.share.id) + '.zip';
		prompt(t('prompt_zip'), def, true).then(function (name) {
			if (!name) return;
			after(api('zip', {share: state.share.id, path: state.view === 'search' ? '' : state.path, paths: paths, name: name}, true), function (d) { return t('zip_done', d.name); });
		});
	}

	function unzip(p) {
		api('unzip', {share: state.share.id, path: p}, true).then(function (d) {
			toast(t('unzip_done', d.files, d.folder), 'success');
			if (d.skipped && d.skipped.length) {
				var ul = el('ul', {'class': 'small mb-0 nuf-skipped'});
				d.skipped.slice(0, 200).forEach(function (s) { ul.appendChild(el('li', {}, [el('code', {text: s.name}), ' – ' + t(s.reason)])); });
				dialog({title: t('files_skipped', d.skipped.length), node: ul});
			}
			return load(true);
		}).catch(function (e) { fail(e); load(true); });
	}

	function download(paths) {
		if (!paths.length) { toast(t('nothing_selected'), 'warning'); return; }
		var share = state.share;
		var single = paths.length === 1 && state.items.some(function (i) { return pathOf(i) === paths[0] && i.type !== 'dir'; });
		// first a cheap call: it asks for the password confirmation if the share needs one (a plain link could not)
		api('info', {share: share.id, path: paths[0]}).then(function () {
			if (single) { window.location.href = url('download', {share: share.id, path: paths[0]}); return; }
			// several entries: a POST form (the list may be long for a URL)
			var f = el('form', {method: 'post', action: url('download'), 'class': 'd-none'}, [
				el('input', {type: 'hidden', name: '_csrf', value: boot.csrf}),
				el('input', {type: 'hidden', name: 'share', value: share.id}),
				el('input', {type: 'hidden', name: 'paths', value: JSON.stringify(paths)})
			]);
			document.body.appendChild(f);
			f.submit();
			setTimeout(function () { f.remove(); }, 1000);
		}).catch(fail);
	}

	function info(p) {
		api('info', {share: state.share.id, path: p}).then(function (d) {
			var i = d.info;
			var rows = [[t('name'), i.name], [t('type'), i.type === 'dir' ? t('folder') : (i.mime || t('file'))], [t('log_path'), '/' + i.path]];
			if (i.absolute) rows.push([t('absolute_path'), i.absolute]);
			rows.push([t('size'), i.type === 'dir' ? size(i.bytes) + ' · ' + t('n_files', i.files) : size(i.size)]);
			rows.push([t('modified'), when(i.mtime)], [t('permissions'), i.perms + (i.writable ? '' : ' · ' + t('readonly_badge'))]);
			if (i.link) rows.push(['symlink', i.outside ? t('link_outside') : '✓']);
			var tbl = el('table', {'class': 'table table-sm mb-0'}, [el('tbody', {}, rows.map(function (r) {
				return el('tr', {}, [el('th', {'class': 'text-nowrap', text: r[0]}), el('td', {'class': 'text-break', text: r[1]})]);
			}))]);
			var copyBtn = el('button', {type: 'button', 'class': 'btn btn-sm btn-outline-secondary mt-2', onclick: function () {
				var txt = i.absolute || ('/' + i.path);
				if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast(t('path_copied'), 'success'); }).catch(function () {});
			}}, [icon('clipboard'), ' ' + t('copy_path')]);
			dialog({title: t('info'), node: el('div', {}, [tbl, copyBtn])});
		}).catch(fail);
	}

	/** Unix permissions (globeadmin): owner / group / others × read / write / execute, the number, "also inside" for folders. */
	function chmodDlg(it, p) {
		api('info', {share: state.share.id, path: p}).then(function (d) {
			var i = d.info, dir = i.type === 'dir';
			var mode = String(i.mode || (i.perms || '').slice(-3) || (dir ? '755' : '644'));
			var who = [['owner', 6], ['group', 3], ['others', 0]], bits = [['read', 4], ['write', 2], ['exec', 1]];
			var boxes = [];
			var num = el('input', {type: 'text', 'class': 'form-control form-control-sm nuf-chmod-num', value: mode, maxlength: '3', inputmode: 'numeric', 'aria-label': t('chmod_octal'), pattern: '[0-7]{3}'});
			var warn = el('div', {'class': 'small text-warning-emphasis mt-2 nuf-chmod-warn'});
			var rec = dir ? el('input', {type: 'checkbox', 'class': 'form-check-input', id: 'nufChmodRec'}) : null;
			function val() { return /^[0-7]{3}$/.test(num.value) ? parseInt(num.value, 8) : null; }
			function fromBoxes() { var v = 0; boxes.forEach(function (b) { if (b.box.checked) v |= b.bit; }); num.value = ('00' + v.toString(8)).slice(-3); check(); }
			function toBoxes() { var v = val(); if (v === null) { check(); return; } boxes.forEach(function (b) { b.box.checked = (v & b.bit) !== 0; }); check(); }
			function check() {
				var v = val(), w = [];
				num.classList.toggle('is-invalid', v === null || (v & 256) === 0 || (dir && (v & 64) === 0));
				if (v !== null && (v & 2)) w.push(t('chmod_warn_world'));
				if (v !== null && !dir && (v & 73)) w.push(t('chmod_warn_exec'));
				warn.textContent = w.join(' ');
			}
			var head = el('tr', {}, [el('th')].concat(bits.map(function (b) { return el('th', {'class': 'text-center fw-normal small', text: t(b[0] === 'exec' && dir ? 'chmod_exec_dir' : 'chmod_' + b[0])}); })));
			var body = who.map(function (w) {
				return el('tr', {}, [el('th', {'class': 'fw-normal small', text: t('chmod_' + w[0])})].concat(bits.map(function (b) {
					var bit = b[1] << w[1];
					var box = el('input', {type: 'checkbox', 'class': 'form-check-input', 'aria-label': t('chmod_' + w[0]) + ' – ' + t(b[0] === 'exec' && dir ? 'chmod_exec_dir' : 'chmod_' + b[0]), 'data-bit': String(bit)});
					box.addEventListener('change', fromBoxes);
					boxes.push({box: box, bit: bit});
					return el('td', {'class': 'text-center'}, [box]);
				})));
			});
			num.addEventListener('input', toBoxes);
			var node = el('div', {'class': 'nuf-chmod'}, [
				i.owner ? el('div', {'class': 'small text-body-secondary mb-2', text: i.server_user ? t('chmod_owned', i.owner, i.group, i.server_user) : t('chmod_owned_short', i.owner, i.group)}) : el('span'),
				el('table', {'class': 'table table-sm align-middle mb-2 nuf-chmod-grid'}, [el('thead', {}, [head]), el('tbody', {}, body)]),
				el('div', {'class': 'd-flex align-items-center gap-2'}, [el('label', {'class': 'small', text: t('chmod_octal')}), num]),
				rec ? el('div', {'class': 'form-check mt-2'}, [rec, el('label', {'class': 'form-check-label small', 'for': 'nufChmodRec', text: t('chmod_recursive')})]) : el('span'),
				warn
			]);
			toBoxes();
			dialog({title: t('chmod_title', it.name), node: node, buttons: [{label: t('cancel'), value: false}, {label: t('chmod_apply'), value: true, cls: 'btn-primary'}]}).then(function (ok) {
				if (ok !== true) return;
				var v = val();
				if (v === null || (v & 256) === 0 || (dir && (v & 64) === 0)) { toast(t('err_chmod_mode'), 'danger'); return; }
				after(api('chmod', {share: state.share.id, path: p, mode: num.value, recursive: rec && rec.checked ? '1' : '0'}, true), function (r) {
					return (r.failed ? t('chmod_partly', r.done, r.failed) : t('chmod_done', num.value)) + (r.links ? ' ' + t('chmod_links', r.links) : '');
				});
			});
		}).catch(fail);
	}

	// phones: one of size / modified date is shown – the button left of Refresh switches, remembered in this browser
	(function () {
		var b = $('nufColToggle'), app = $('nufApp');
		if (!b || !app) return;
		function set(time) {
			app.classList.toggle('nuf-show-time', time);
			b.setAttribute('aria-pressed', time ? 'true' : 'false');
			var lbl = t(time ? 'show_size' : 'show_modified');
			b.title = lbl; b.setAttribute('aria-label', lbl);
		}
		try { set(localStorage.getItem('nufPhoneCol') === 'time'); } catch (e) { set(false); }
		b.addEventListener('click', function () {
			var time = !app.classList.contains('nuf-show-time');
			set(time);
			try { localStorage.setItem('nufPhoneCol', time ? 'time' : 'size'); } catch (e) { /* private mode */ }
		});
	})();
	$('nufMkdirBtn').addEventListener('click', mkdir);
	$('nufNewFileBtn').addEventListener('click', newFile);
	$('nufRefreshBtn').addEventListener('click', function () {
		if (state.view === 'trash') showTrash(); else if (state.view === 'log') showLog(); else if (state.view === 'search') $('nufSearchForm').requestSubmit(); else load(true);
	});
	$('nufDownloadBtn').addEventListener('click', function () { download(selectedPaths()); });
	$('nufCopyBtn').addEventListener('click', function () { transfer(selectedPaths(), true); });
	$('nufMoveBtn').addEventListener('click', function () { transfer(selectedPaths(), false); });
	$('nufZipBtn').addEventListener('click', function () { zip(selectedPaths()); });
	$('nufDeleteBtn').addEventListener('click', function () { remove(selectedPaths()); });

	// keyboard in the list
	document.addEventListener('keydown', function (e) {
		if (state.view !== 'files' && state.view !== 'search') return;
		if (document.querySelector('.modal.show') || e.target.closest('input, textarea, select, .ace_editor')) return;
		var paths = selectedPaths();
		if (e.key === 'Delete' && can('delete') && paths.length) { e.preventDefault(); remove(paths); }
		else if (e.key === 'F2' && can('rename') && paths.length === 1) {
			e.preventDefault();
			var it = state.items.filter(function (i) { return pathOf(i) === paths[0]; })[0];
			if (it) rename(it, paths[0]);
		} else if (e.key === 'Backspace' && state.view === 'files' && state.path) { e.preventDefault(); go(state.share.id, parent(state.path)); }
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') { e.preventDefault(); $('nufAll').checked = true; $('nufAll').dispatchEvent(new Event('change')); }
	});

	// ================================================================== folder picker (copy / move)

	var pick = {modal: null, share: null, path: '', resolve: null, result: null};
	function pickFolder(title, allowed) {
		return new Promise(function (resolve) {
			if (!pick.modal) pick.modal = new bootstrap.Modal($('nufPick'));
			var shares = (boot.shares || []).filter(function (s) { return s.ok && allowed(s); });
			if (!shares.length) { toast(t('err_right', ''), 'warning'); resolve(null); return; }
			pick.resolve = resolve;
			pick.result = null;
			$('nufPickTitle').textContent = title + ' – ' + t('choose_folder');
			var sel = $('nufPickShare');
			sel.textContent = '';
			shares.forEach(function (s) { sel.appendChild(el('option', {value: s.id, text: s.label})); });
			var start = shares.some(function (s) { return s.id === state.share.id; }) ? state.share.id : shares[0].id;
			sel.value = start;
			pickLoad(shareById(start), shares.some(function (s) { return s.id === state.share.id; }) ? state.path : '');
			pick.modal.show();
		});
	}
	function pickLoad(share, path) {
		pick.share = share;
		pick.path = path;
		var pathBox = $('nufPickPath');
		pathBox.textContent = '';
		pathBox.appendChild(el('span', {'class': 'fw-semibold', text: share.label}));
		pathBox.appendChild(document.createTextNode(' /' + path));
		var list = $('nufPickList');
		list.textContent = '';
		list.appendChild(el('div', {'class': 'text-body-secondary small p-2', text: t('loading')}));
		api('list', {share: share.id, path: path}).then(function (d) {
			if (pick.share !== share || pick.path !== path) return;
			list.textContent = '';
			if (path) list.appendChild(el('button', {type: 'button', 'class': 'list-group-item list-group-item-action', onclick: function () { pickLoad(share, parent(path)); }}, [icon('arrow-90deg-up'), ' ..']));
			d.items.filter(function (i) { return i.type === 'dir' && !i.outside; }).forEach(function (i) {
				list.appendChild(el('button', {type: 'button', 'class': 'list-group-item list-group-item-action', onclick: function () { pickLoad(share, join(path, i.name)); }},
					[el('i', {'class': bi('folder-fill') + ' nuf-ico-dir', 'aria-hidden': 'true'}), ' ', i.name]));
			});
		}).catch(function (e) { list.textContent = ''; list.appendChild(el('div', {'class': 'text-danger small p-2', text: e.message || t('unknown_error')})); });
	}
	$('nufPickShare').addEventListener('change', function () { pickLoad(shareById(this.value), ''); });
	$('nufPickOk').addEventListener('click', function () { pick.result = {share: pick.share, path: pick.path}; hideModal(pick.modal, 'nufPick'); });
	$('nufPick').addEventListener('hidden.bs.modal', function () { var r = pick.resolve; pick.resolve = null; if (r) r(pick.result); });

	// ================================================================== open, preview

	function open(it, p) {
		var k = kind(it.name);
		if (k === 'text') editor(state.share, p);
		else if (['image', 'pdf', 'video', 'audio'].indexOf(k) >= 0) preview(p);
		else if (k === 'zip' && can('zip')) {
			confirmBox(t('unzip'), it.name, t('unzip')).then(function (ok) { if (ok) unzip(p); });
		} else download([p]);
	}

	var previewModal = null;
	function preview(p) {
		var share = state.share;
		api('info', {share: share.id, path: p}).then(function () {          // password confirmation first, if needed
			if (!previewModal) {
				previewModal = new bootstrap.Modal($('nufPreview'));
				$('nufPreview').addEventListener('hidden.bs.modal', function () { $('nufPreviewBody').textContent = ''; });
			}
			var src = url('raw', {share: share.id, path: p});
			var body = $('nufPreviewBody');
			body.textContent = '';
			$('nufPreviewTitle').textContent = base(p);
			$('nufPreviewDl').setAttribute('href', url('download', {share: share.id, path: p}));
			var k = kind(p);
			if (k === 'image') body.appendChild(el('img', {src: src, alt: base(p), 'class': 'nuf-preview-img'}));
			else if (k === 'pdf') body.appendChild(el('iframe', {src: src, title: base(p), 'class': 'nuf-preview-frame'}));
			else if (k === 'video') body.appendChild(el('video', {src: src, controls: true, 'class': 'nuf-preview-media'}));
			else if (k === 'audio') body.appendChild(el('audio', {src: src, controls: true, 'class': 'w-100'}));
			else body.appendChild(el('p', {text: t('preview_unavailable')}));
			previewModal.show();
		}).catch(fail);
	}

	// ================================================================== editor

	var ed = {modal: null, cm: null, share: null, path: '', sha: '', clean: 0, readOnly: false};

	function cmMode(name) {
		var e = ext(name);
		if (['php', 'phtml', 'inc'].indexOf(e) >= 0) return 'application/x-httpd-php';
		if (['js', 'mjs'].indexOf(e) >= 0) return 'text/javascript';
		if (e === 'ts') return 'text/typescript';
		if (e === 'json' || e === 'map') return 'application/json';
		if (e === 'css') return 'text/css';
		if (e === 'scss') return 'text/x-scss';
		if (e === 'less') return 'text/x-less';
		if (['html', 'htm', 'vue', 'tpl', 'twig'].indexOf(e) >= 0) return 'text/html';
		if (['xml', 'svg', 'xsl', 'xslt'].indexOf(e) >= 0) return 'application/xml';
		if (e === 'sql') return 'text/x-mysql';
		return 'text/plain';
	}

	function editor(share, p) {
		api('read', {share: share.id, path: p}).then(function (d) {
			if (!d.text) {
				var why = {too_big: 'text_too_big', binary: 'binary_file', encoding: 'encoding_file'}[d.reason] || 'err_not_text';
				dialog({title: base(p), text: t(why), buttons: [{label: t('close'), value: false}, {label: t('download'), value: true, cls: 'btn-primary'}]})
					.then(function (v) { if (v === true) window.location.href = url('download', {share: share.id, path: p}); });
				return;
			}
			if (!ed.modal) {
				ed.modal = new bootstrap.Modal($('nufEditor'));
				ed.cm = NufAce.fromTextArea($('nufCode'), {
					lineNumbers: true, indentUnit: 4, tabSize: 4, indentWithTabs: true, matchBrackets: true, styleActiveLine: true,
					extraKeys: {
						'Ctrl-S': function () { save(false, false); }, 'Cmd-S': function () { save(false, false); },
						'Ctrl-/': 'toggleComment', 'Cmd-/': 'toggleComment', 'Alt-G': 'jumpToLine',
						'Esc': function () { closeEditor(); }
					}
				});
				ed.cm.on('changes', editorState);
				ed.cm.on('cursorActivity', function () { var c = ed.cm.getCursor(); $('nufEditorPos').textContent = (c.line + 1) + ':' + (c.ch + 1); });
				$('nufEditor').addEventListener('shown.bs.modal', function () { ed.cm.refresh(); ed.cm.focus(); });
				try { $('nufWrap').checked = localStorage.getItem('nufWrap') === '1'; } catch (e) { /* none */ }
				ed.cm.setOption('lineWrapping', $('nufWrap').checked);
			}
			ed.share = share;
			ed.path = p;
			ed.sha = d.sha;
			ed.readOnly = !d.editable;
			// CodeMirror joins lines with \n: keep the file's own line ends (Windows files stay CRLF)
			var crlf = (d.content.match(/\r\n/g) || []).length;
			var lf = (d.content.match(/\n/g) || []).length;
			ed.cm.setOption('lineSeparator', crlf > 0 && crlf * 2 >= lf ? '\r\n' : null);
			ed.cm.setOption('mode', cmMode(p));
			ed.cm.setOption('readOnly', ed.readOnly);
			ed.cm.setValue(d.content);
			ed.cm.clearHistory();
			ed.clean = ed.cm.changeGeneration();
			$('nufEditorTitle').textContent = share.label + ' / ' + p;
			$('nufEditorTitle').title = share.label + ' / ' + p;
			// nuBuilder Next's tool buttons for this file's language (undo / redo, search, replace, comment, format, copy / paste)
			if (window.NuCodeTools) {
				if (ed.tools && ed.tools.nuDetach) ed.tools.nuDetach();
				var ext = (p.split('.').pop() || '').toLowerCase();
				var lang = {php: 'PHP', phtml: 'PHP', inc: 'PHP', js: 'JS', mjs: 'JS', json: 'JS', sql: 'SQL', html: 'HTML', htm: 'HTML', css: 'CSS'}[ext] || '';
				ed.tools = window.NuCodeTools.attach(ed.cm, $('nufCodeTools'), {lang: lang, readOnly: ed.readOnly, noFull: true, compact: true});
			}
			$('nufEditorRo').classList.toggle('d-none', !ed.readOnly);
			$('nufSaveBtn').classList.toggle('d-none', ed.readOnly);
			$('nufVersionsBtn').parentNode.classList.toggle('d-none', ed.readOnly);
			editorState();
			ed.modal.show();
		}).catch(fail);
	}

	function dirty() { return ed.cm && !ed.cm.isClean(ed.clean); }

	function editorState() {
		$('nufSaveBtn').disabled = !dirty();
		$('nufEditorTitle').classList.toggle('nuf-dirty', dirty());
	}

	function save(force, forceLint) {
		if (ed.readOnly || !ed.cm) return;
		var text = ed.cm.getValue();
		var gen = ed.cm.changeGeneration();
		$('nufSaveBtn').disabled = true;
		// the text goes as a file: nuBuilder Next rewrites CRLF in posted fields, files arrive byte for byte
		api('save', {share: ed.share.id, path: ed.path, sha: ed.sha, force: force ? '1' : null, force_lint: forceLint ? '1' : null,
			content: new Blob([text], {type: 'text/plain'})}, true).then(function (d) {
			ed.sha = d.sha;
			ed.clean = gen;
			editorState();
			toast(t('saved') + ' – ' + base(ed.path), 'success');
			if (state.view === 'files') load(true);
		}).catch(function (e) {
			editorState();
			if (e instanceof ApiError && e.key === 'err_conflict') {
				dialog({title: t('conflict_title'), text: t('conflict_text'), buttons: [{label: t('cancel'), value: null}, {label: t('reload'), value: 'reload', cls: 'btn-outline-secondary'},
					{label: t('overwrite'), value: 'overwrite', cls: 'btn-danger'}]}).then(function (v) {
					if (v === 'overwrite') save(true, forceLint);
					else if (v === 'reload') { ed.cm.markClean(); editor(ed.share, ed.path); }
				});
			} else if (e instanceof ApiError && e.key === 'err_lint') {
				var line = e.data.lint && e.data.lint.line ? e.data.lint.line : 0;
				if (line > 0) { ed.cm.setCursor({line: line - 1, ch: 0}); ed.cm.scrollIntoView(null, 120); }
				dialog({title: t('lint_title'), text: e.message, buttons: [{label: t('cancel'), value: false}, {label: t('save_anyway'), value: true, cls: 'btn-warning'}]})
					.then(function (v) { if (v === true) save(force, true); else ed.cm.focus(); });
			} else fail(e);
		});
	}

	function closeEditor() {
		if (!dirty()) { hideModal(ed.modal, 'nufEditor'); return; }
		confirmBox(t('close'), t('unsaved'), t('close'), true).then(function (ok) { if (ok) { ed.cm.markClean(); ed.clean = ed.cm.changeGeneration(); hideModal(ed.modal, 'nufEditor'); } });
	}

	$('nufSaveBtn').addEventListener('click', function () { save(false, false); });
	$('nufEditorClose').addEventListener('click', closeEditor);
	$('nufWrap').addEventListener('change', function () {
		if (ed.cm) ed.cm.setOption('lineWrapping', this.checked);
		try { localStorage.setItem('nufWrap', this.checked ? '1' : '0'); } catch (e) { /* none */ }
	});
	$('nufVersionsBtn').addEventListener('show.bs.dropdown', function () {
		var ul = $('nufVersions');
		ul.textContent = '';
		ul.appendChild(el('li', {}, [el('span', {'class': 'dropdown-item-text small text-body-secondary', text: t('loading')})]));
		api('versions', {share: ed.share.id, path: ed.path}).then(function (d) {
			ul.textContent = '';
			if (!d.versions.length) { ul.appendChild(el('li', {}, [el('span', {'class': 'dropdown-item-text small text-body-secondary', text: t('no_versions')})])); return; }
			d.versions.forEach(function (v) {
				ul.appendChild(el('li', {}, [el('button', {type: 'button', 'class': 'dropdown-item small', title: t('restore_version'), onclick: function () {
					api('version', {share: ed.share.id, path: ed.path, id: v.id}).then(function (r) {
						ed.cm.setValue(r.content);   // an unsaved change – Save writes it back (the current text becomes a version itself)
						toast(t('version_loaded'), 'info');
					}).catch(fail);
				}}, [when(v.mtime) + ' · ' + size(v.size)])]));
			});
		}).catch(function (e) { ul.textContent = ''; ul.appendChild(el('li', {}, [el('span', {'class': 'dropdown-item-text small text-danger', text: e.message})])); });
	});
	window.addEventListener('beforeunload', function (e) { if (ed.modal && $('nufEditor').classList.contains('show') && dirty()) { e.preventDefault(); e.returnValue = ''; } });

	// ================================================================== uploads (in chunks, resumable after a hiccup)

	var up = {queue: [], running: 0, max: 2, total: 0, done: 0, failed: 0, dirs: {}};

	function chooseFiles() { $('nufFileInput').click(); }
	$('nufUploadBtn').addEventListener('click', chooseFiles);
	$('nufFileInput').addEventListener('change', function () {
		var files = Array.prototype.slice.call(this.files || []);
		this.value = '';
		enqueue(files.map(function (f) { return {file: f, dir: ''}; }));
	});

	function enqueue(list) {
		if (!list.length || !state.share) return;
		if (!can('upload')) { toast(t('err_right', t('upload')), 'warning'); return; }
		var share = state.share, path = state.view === 'files' ? state.path : '';
		var overwrite = $('nufOverwrite').checked && can('delete');
		$('nufUploads').classList.remove('d-none');
		list.forEach(function (x) {
			var li = el('li', {'class': 'list-group-item small'}, [
				el('div', {'class': 'd-flex gap-2'}, [el('span', {'class': 'text-truncate me-auto', text: join(x.dir, x.file.name)}), el('span', {'class': 'text-nowrap nuf-up-state', text: size(x.file.size)})]),
				el('div', {'class': 'progress mt-1', role: 'progressbar', 'aria-label': x.file.name}, [el('div', {'class': 'progress-bar', style: 'width:0%'})])
			]);
			$('nufUploadList').appendChild(li);
			up.queue.push({file: x.file, share: share, dir: join(path, x.dir), sub: x.dir, overwrite: overwrite, li: li});
			up.total++;
		});
		uploadTitle();
		pump();
	}

	function uploadTitle() {
		$('nufUploadsTitle').textContent = up.running || up.queue.length ? t('uploading') + ' ' + up.done + ' / ' + up.total : t('upload_done') + ' ' + up.done + ' / ' + up.total;
	}

	function pump() {
		while (up.running < up.max && up.queue.length) {
			var job = up.queue.shift();
			up.running++;
			uploadOne(job).then(function () { up.done++; }, function (e) { up.failed++; return e; }).then(function () {
				up.running--;
				uploadTitle();
				if (!up.running && !up.queue.length) {
					if (state.view === 'files') load(true);
					if (!up.failed) setTimeout(function () { if (!up.running && !up.queue.length) { $('nufUploads').classList.add('d-none'); $('nufUploadList').textContent = ''; up.total = 0; up.done = 0; } }, 4000);
				}
				pump();
			});
		}
	}

	function ensureDir(share, dir) {
		// folders of a dropped folder: created one level at a time (an existing one is fine)
		if (!dir) return Promise.resolve();
		var key = share.id + ':' + dir;
		if (up.dirs[key]) return up.dirs[key];
		up.dirs[key] = ensureDir(share, parent(dir)).then(function () {
			return api('mkdir', {share: share.id, path: parent(dir), name: base(dir)}, true).catch(function (e) { if (!(e instanceof ApiError && e.key === 'err_exists')) throw e; });
		});
		return up.dirs[key];
	}

	function uploadOne(job) {
		var bar = job.li.querySelector('.progress-bar'), st = job.li.querySelector('.nuf-up-state');
		var chunk = Math.max(65536, boot.limits.chunk || 2097152);
		function setP(n) { var pc = job.file.size ? Math.round(n * 100 / job.file.size) : 100; bar.style.width = pc + '%'; }
		function failed(e) {
			bar.classList.add('bg-danger');
			bar.style.width = '100%';
			st.textContent = t('upload_failed');
			job.li.appendChild(el('div', {'class': 'text-danger', text: e.message || t('unknown_error')}));
			throw e;
		}
		var base0 = job.sub ? job.dir : null;
		return (base0 ? ensureDir(job.share, job.dir) : Promise.resolve()).then(function () {
			return api('upload_init', {share: job.share.id, path: job.dir, name: job.file.name, size: job.file.size, overwrite: job.overwrite ? '1' : null}, true);
		}).then(function (d) {
			if (d.done) return d;
			var offset = 0, retries = 0;
			function next() {
				var part = job.file.slice(offset, Math.min(offset + chunk, job.file.size));
				return call('upload_chunk', {token: d.token, offset: offset, chunk: part}, true).then(function (r) {
					retries = 0;
					offset = r.received;
					setP(offset);
					return r.done ? r : next();
				}, function (e) {
					if (e instanceof ApiError && e.key === 'err_upload_offset' && e.data.args && retries < 5) { retries++; offset = Number(e.data.args[0]) || 0; return next(); }
					if ((!(e instanceof ApiError) || e.status >= 500 || e.status === 0) && retries < 4) {
						retries++;
						st.textContent = t('chunk_retry');
						return new Promise(function (res) { setTimeout(res, 800 * retries * retries); }).then(next);
					}
					throw e;
				});
			}
			return next();
		}).then(function (r) {
			bar.style.width = '100%';
			bar.classList.add('bg-success');
			st.textContent = r.replaced ? t('replaced') : (r.name && r.name !== job.file.name ? '→ ' + r.name : '✓');
			return r;
		}).catch(failed);
	}

	$('nufUploadsClose').addEventListener('click', function () {
		if (up.running || up.queue.length) return;
		$('nufUploads').classList.add('d-none');
		$('nufUploadList').textContent = '';
		up.total = 0; up.done = 0; up.failed = 0; up.dirs = {};
	});

	// drag and drop – files and whole folders (webkitGetAsEntry)
	var dragDepth = 0;
	var view = $('nufView');
	function dropOk(e) {
		return state.view === 'files' && can('upload') && e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0;
	}
	view.addEventListener('dragenter', function (e) { if (!dropOk(e)) return; e.preventDefault(); dragDepth++; view.classList.add('nuf-dragging'); });
	view.addEventListener('dragover', function (e) { if (!dropOk(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
	view.addEventListener('dragleave', function () { if (--dragDepth <= 0) { dragDepth = 0; view.classList.remove('nuf-dragging'); } });
	view.addEventListener('drop', function (e) {
		if (!dropOk(e)) return;
		e.preventDefault();
		dragDepth = 0;
		view.classList.remove('nuf-dragging');
		var items = Array.prototype.slice.call(e.dataTransfer.items || []);
		var entries = items.map(function (i) { return i.webkitGetAsEntry ? i.webkitGetAsEntry() : null; }).filter(Boolean);
		if (!entries.length || !can('mkdir')) { enqueue(Array.prototype.slice.call(e.dataTransfer.files || []).map(function (f) { return {file: f, dir: ''}; })); return; }
		var out = [];
		function walk(entry, dir) {
			if (entry.isFile) return new Promise(function (res) { entry.file(function (f) { out.push({file: f, dir: dir}); res(); }, function () { res(); }); });
			if (!entry.isDirectory) return Promise.resolve();
			var reader = entry.createReader(), all = [];
			return new Promise(function (res) {
				(function readMore() {
					reader.readEntries(function (batch) {
						if (!batch.length) { Promise.all(all.map(function (c) { return walk(c, join(dir, entry.name)); })).then(res); return; }
						all = all.concat(Array.prototype.slice.call(batch));
						readMore();
					}, function () { res(); });
				}());
			});
		}
		Promise.all(entries.map(function (en) { return walk(en, ''); })).then(function () { enqueue(out); });
	});
	// a file dropped outside the list must not open in the browser
	window.addEventListener('dragover', function (e) { e.preventDefault(); });
	window.addEventListener('drop', function (e) { if (!e.target.closest('#nufView')) e.preventDefault(); });

	// ================================================================== recycle bin

	function showTrash() {
		state.view = 'trash';
		state.sel.clear();
		renderShares();
		crumbs();
		toolbar();
		var tb = $('nufRows2');
		tb.textContent = '';
		$('nufHead2').textContent = '';
		message(t('loading'));
		api('trash', {}).then(function (d) {
			if (state.view !== 'trash') return;
			setHead([t('name'), t('original_path'), t('deleted_at'), t('size'), '']);
			tb.textContent = '';
			message(d.items.length ? '' : t('empty_trash'));
			var bar = $('nufStatusLeft');
			bar.textContent = d.days > 0 ? t('trash_days', d.days) : '';
			$('nufStatusRight').textContent = '';
			if (d.can_purge && d.items.length) {
				$('nufStatusRight').appendChild(el('button', {type: 'button', 'class': 'btn btn-sm btn-outline-danger py-0', onclick: function () {
					confirmBox(t('purge_all'), t('confirm_delete_final'), t('purge_all'), true).then(function (ok) {
						if (ok) api('purge', {all: '1'}, true).then(function () { toast(t('purged'), 'success'); showTrash(); }).catch(fail);
					});
				}}, [icon('trash3'), ' ' + t('purge_all')]));
			}
			d.items.forEach(function (m) {
				var acts = [];
				var sh = shareById(m.share);
				if (sh && can('delete', sh)) acts.push(el('button', {type: 'button', 'class': 'btn btn-sm btn-outline-primary py-0', onclick: function () {
					api('restore', {id: m.id}, true).then(function (r) { toast(t('restored', r.path), 'success'); showTrash(); }).catch(fail);
				}}, [icon('arrow-counterclockwise'), ' ' + t('restore')]));
				if (d.can_purge) acts.push(el('button', {type: 'button', 'class': 'btn btn-sm btn-outline-danger py-0 ms-1', onclick: function () {
					confirmBox(t('purge'), m.name + '\n\n' + t('confirm_delete_final'), t('purge'), true).then(function (ok) {
						if (ok) api('purge', {id: m.id}, true).then(function () { toast(t('purged'), 'success'); showTrash(); }).catch(fail);
					});
				}}, [icon('x-octagon'), ' ' + t('purge')]));
				tb.appendChild(el('tr', {}, [
					el('td', {}, [el('i', {'class': (m.type === 'dir' ? bi('folder-fill') + ' nuf-ico-dir' : bi(fileIcon({name: m.name, type: 'file'}))), 'aria-hidden': 'true'}), ' ', el('span', {text: m.name})]),
					el('td', {'class': 'small text-break', text: (m.share_label || m.share) + ' / ' + m.path}),
					el('td', {'class': 'small text-nowrap', text: when(m.deleted_at) + ' · ' + (m.user || '')}),
					el('td', {'class': 'text-end text-nowrap small', text: size(m.bytes) + (m.type === 'dir' ? ' · ' + t('n_files', m.files) : '')}),
					el('td', {'class': 'text-end text-nowrap'}, acts)
				]));
			});
		}).catch(function (e) { message(e.message); });
	}

	/** Head of the second table (recycle bin, log). */
	function setHead(labels) {
		var tr = $('nufHead2');
		tr.textContent = '';
		labels.forEach(function (l, i) { tr.appendChild(el('th', {'class': i === labels.length - 1 && l === '' ? 'text-end' : null, text: l})); });
	}

	$('nufTrashBtn').addEventListener('click', function () { window.location.hash = '#/trash'; });

	// ================================================================== log (globeadmin)

	function showLog() {
		state.view = 'log';
		renderShares();
		crumbs();
		toolbar();
		var tb = $('nufRows2');
		tb.textContent = '';
		$('nufHead2').textContent = '';
		message(t('loading'));
		var q = (showLog.q || '');
		api('logview', {limit: 500, q: q}).then(function (d) {
			if (state.view !== 'log') return;
			setHead([t('log_when'), t('log_user'), t('log_action'), t('log_path'), t('log_target')]);
			tb.textContent = '';
			message(d.items.length ? '' : t('no_results'));
			var filter = el('input', {type: 'search', 'class': 'form-control form-control-sm d-inline-block w-auto', placeholder: t('filter'), value: q});
			filter.addEventListener('change', function () { showLog.q = filter.value.trim(); showLog(); });
			$('nufStatusLeft').textContent = '';
			$('nufStatusLeft').appendChild(filter);
			$('nufStatusRight').textContent = t('n_entries', d.items.length);
			d.items.forEach(function (r) {
				tb.appendChild(el('tr', {'class': String(r.ok) === '0' ? 'table-danger' : null}, [
					el('td', {'class': 'small text-nowrap', text: r.log_at}),
					el('td', {'class': 'small', text: (r.login || r.user_id || '') + (r.real_login ? ' (' + r.real_login + ')' : '')}),
					el('td', {'class': 'small', text: r.action}),
					el('td', {'class': 'small text-break', text: (r.share_id || '') + ' / ' + (r.path || '')}),
					el('td', {'class': 'small text-break', text: [r.target, r.detail, r.bytes !== null && r.bytes !== undefined && r.bytes !== '' ? size(Number(r.bytes)) : ''].filter(Boolean).join(' · ')})
				]));
			});
		}).catch(function (e) { message(e.message); });
	}
	$('nufLogBtn').addEventListener('click', function () { window.location.hash = '#/log'; });

	// ================================================================== side bar (small screens), theme, start

	// closed by: the button again, a tap outside (backdrop), Esc, a swipe to the left, choosing a share / Trash / Log
	function sideOpen(on) {
		$('nufApp').classList.toggle('nuf-side-open', on);
		$('nufSideToggle').setAttribute('aria-expanded', on ? 'true' : 'false');
		if (!on && $('nufSide').contains(document.activeElement)) $('nufSideToggle').focus();
	}
	function sideIsOpen() { return $('nufApp').classList.contains('nuf-side-open'); }
	$('nufSideToggle').addEventListener('click', function () { sideOpen(!sideIsOpen()); });
	$('nufSideBackdrop').addEventListener('click', function () { sideOpen(false); });
	$('nufShares').addEventListener('click', function (e) { if (e.target.closest('a')) sideOpen(false); });
	['nufTrashBtn', 'nufLogBtn'].forEach(function (id) { $(id).addEventListener('click', function () { sideOpen(false); }); });
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && sideIsOpen() && !document.querySelector('.modal.show')) { e.preventDefault(); sideOpen(false); }
	});
	(function swipe() {
		var x0 = null, y0 = 0;
		$('nufSide').addEventListener('touchstart', function (e) { if (e.touches.length === 1) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; } }, {passive: true});
		$('nufSide').addEventListener('touchend', function (e) {
			if (x0 === null) return;
			var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
			x0 = null;
			if (dx < -60 && Math.abs(dx) > Math.abs(dy) * 1.5) sideOpen(false);
		}, {passive: true});
	})();

	// theme: nuBuilder Next's choice (localStorage "nunext-theme", the server got it as cookie); follows a change in another tab
	(function theme() {
		var root = document.documentElement;
		var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
		function pref() {
			var p = null;
			try { p = localStorage.getItem('nufiles-theme'); } catch (e) { p = null; }
			return p || root.getAttribute('data-nuf-theme') || 'light';
		}
		function set() { var p = pref(); root.setAttribute('data-bs-theme', p === 'dark' || (p === 'auto' && mq && mq.matches) ? 'dark' : 'light'); }
		set();
		if (mq && mq.addEventListener) mq.addEventListener('change', set);
		window.addEventListener('storage', function (e) { if (e.key === 'nufiles-theme') { set(); label(); } });
		var tb = $('nufThemeBtn');
		function label() {
			var dark = root.getAttribute('data-bs-theme') === 'dark';
			tb.setAttribute('aria-pressed', dark ? 'true' : 'false');
			$('nufThemeLbl').textContent = t(dark ? 'theme_light' : 'theme_dark');
		}
		label();
		if (mq && mq.addEventListener) mq.addEventListener('change', label);
		tb.addEventListener('click', function () {
			var next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
			try { localStorage.setItem('nufiles-theme', next); } catch (e) { root.setAttribute('data-nuf-theme', next); }
			set(); label();
		});
	}());

	if (boot.problems && boot.problems.length) {
		var pb = $('nufProblems');
		pb.appendChild(el('strong', {text: t('problems')}));
		pb.appendChild(el('ul', {'class': 'mb-0 small'}, boot.problems.map(function (p) { return el('li', {text: p}); })));
		pb.classList.remove('d-none');
	}
	if (boot.readonly) $('nufRoBadge').classList.remove('d-none');
	$('nufLogBtn').classList.toggle('d-none', !boot.features.log);
	$('nufTrashBtn').classList.toggle('d-none', !boot.features.trash || !(boot.shares || []).some(function (s) { return s.trash && s.rights.indexOf('delete') >= 0; }));
	if (!window.location.hash && boot.shares && boot.shares.length) {
		var last = null;
		try { last = localStorage.getItem('nufLast'); } catch (e) { last = null; }
		history.replaceState(null, '', '#/' + encodeURIComponent(shareById(last) ? last : boot.shares[0].id) + '/');
	}
	window.addEventListener('hashchange', function () { if (state.share) try { localStorage.setItem('nufLast', state.share.id); } catch (e) { /* none */ } });
	route();
}());

NUFJS;
const NUF_CSS = <<<'NUFCSS'
/* nuFiles – file manager page for nuBuilder Next (Bootstrap 5 variables, light and dark). */
html, body.nuf { height: 100%; }
body.nuf { margin: 0; background: var(--bs-body-bg); color: var(--bs-body-color); font-size: .9rem; overflow: hidden; }

.nuf-app { display: flex; height: 100vh; min-height: 22rem; }
.nuf-side { width: 15rem; flex: 0 0 15rem; display: flex; flex-direction: column; border-right: 1px solid var(--bs-border-color); background: var(--bs-tertiary-bg); overflow: auto; }
.nuf-side-head { padding: .7rem 1rem .4rem; font-weight: 600; color: var(--bs-secondary-color); text-transform: uppercase; font-size: .75rem; letter-spacing: .04em; }
.nuf-shares { padding: 0 .4rem; }
.nuf-share, .nuf-side-link { display: flex; align-items: center; gap: .45rem; padding: .4rem .6rem; border-radius: .375rem; color: var(--bs-body-color); text-decoration: none; background: none; border: 0; width: 100%; text-align: left; }
.nuf-share:hover, .nuf-side-link:hover { background: var(--bs-secondary-bg); color: var(--bs-body-color); }
.nuf-share.active, .nuf-side-link.active { background: var(--bs-primary-bg-subtle); color: var(--bs-primary-text-emphasis); font-weight: 600; }
.nuf-share-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nuf-side-foot { margin-top: auto; padding: .4rem; border-top: 1px solid var(--bs-border-color); }

.nuf-main { flex: 1 1 auto; display: flex; flex-direction: column; min-width: 0; }
.nuf-bar { display: flex; align-items: center; gap: .5rem; padding: .5rem .75rem; border-bottom: 1px solid var(--bs-border-color); }
.nuf-crumbs { flex: 1 1 0; min-width: 0; }
.nuf-crumbs .breadcrumb { flex-wrap: nowrap; overflow: hidden; white-space: nowrap; }
.nuf-crumbs .breadcrumb-item { flex: 0 0 auto; overflow: hidden; text-overflow: ellipsis; max-width: 18rem; }
.nuf-crumbs .breadcrumb-item:last-child { flex: 0 1 auto; min-width: 4rem; }
.nuf-crumbs a { text-decoration: none; }
.nuf-crumb-more-btn { line-height: 1; vertical-align: baseline; text-decoration: none; }
.nuf-phpath { display: none; }
/* phones: ‹ parent · folder name ▾ (the whole path as a list) instead of the breadcrumb */
@media (max-width: 575.98px) {
	.nuf-crumbs .breadcrumb { display: none; }
	.nuf-phpath { display: flex; align-items: center; gap: .25rem; min-width: 0; }
	.nuf-ph-up { flex: 0 1 auto; max-width: 38%; min-width: 0; display: flex; align-items: center; gap: .1rem; text-decoration: none; padding: .35rem .2rem; }
	.nuf-ph-up span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.nuf-ph-cur { flex: 1 1 auto; min-width: 0; }
	.nuf-ph-title { display: flex; align-items: center; gap: .35rem; width: 100%; min-width: 0; border: 0; background: none; color: var(--bs-body-color); font-weight: 600; padding: .35rem .25rem; border-radius: .375rem; text-align: left; }
	.nuf-ph-title span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
	.nuf-ph-title:not(:disabled):hover, .nuf-ph-title[aria-expanded="true"] { background: var(--bs-secondary-bg); }
	.nuf-ph-title:disabled { opacity: 1; }
	.nuf-ph-title .bi-chevron-down, .nuf-ph-title .fa-chevron-down { font-size: .75em; color: var(--bs-secondary-color); }
	.nuf-ph-menu { max-width: calc(100vw - 2rem); max-height: 60vh; overflow: auto; }
	.nuf-ph-menu .dropdown-item { display: flex; align-items: center; gap: .45rem; }
	.nuf-ph-nm { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
}
.nuf-search { flex: 0 1 18rem; }
.nuf-tools { display: flex; flex-wrap: wrap; align-items: center; gap: .35rem; padding: .45rem .75rem; border-bottom: 1px solid var(--bs-border-color); }
.nuf-sep { width: 1px; align-self: stretch; background: var(--bs-border-color); margin: 0 .2rem; }
.nuf-upload-opts { min-width: 16rem; }

.nuf-view { position: relative; flex: 1 1 auto; overflow: auto; outline: none; }
.nuf-msg { padding: 2rem 1rem; text-align: center; }
.nuf-table thead th { position: sticky; top: 0; z-index: 2; background: var(--bs-body-bg); border-bottom-width: 1px; font-weight: 600; white-space: nowrap; }
.nuf-table td, .nuf-table th { padding: .3rem .5rem; }
.nuf-c-check { width: 2.2rem; text-align: center; }
.nuf-c-size { width: 7rem; }
.nuf-c-time { width: 11rem; }
.nuf-c-act { width: 3rem; }
.nuf-c-name { max-width: 0; }
.nuf-name { display: inline-flex; align-items: center; gap: .5rem; max-width: 100%; color: var(--bs-body-color); text-decoration: none; }
.nuf-name span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nuf-name:hover span { text-decoration: underline; }
.nuf-name .bi { font-size: 1.1rem; color: var(--bs-secondary-color); }
.nuf-name .nuf-ico-dir, .nuf-ico-dir { color: #e0a526; }
.nuf-table tbody tr { cursor: default; user-select: none; }
.nuf-up td { color: var(--bs-secondary-color); }
.nuf-more { padding: 0 .35rem; line-height: 1; }
.nuf-sort { background: none; border: 0; padding: 0; font-weight: 600; color: inherit; }
.nuf-sort.nuf-sorted::after { content: ' \2191'; font-weight: 400; color: var(--bs-secondary-color); }
.nuf-sort.nuf-sorted[data-dir="desc"]::after { content: ' \2193'; }
.nuf-status { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: .3rem .75rem; border-top: 1px solid var(--bs-border-color); font-size: .8rem; color: var(--bs-secondary-color); min-height: 2rem; }

/* drag and drop */
.nuf-drop { display: none; position: absolute; inset: .5rem; z-index: 5; border: 2px dashed var(--bs-primary); border-radius: .5rem; background: rgba(var(--bs-primary-rgb), .08); align-items: center; justify-content: center; text-align: center; font-size: 1.1rem; color: var(--bs-primary-text-emphasis); pointer-events: none; }
.nuf-drop .bi { font-size: 2.5rem; }
.nuf-view.nuf-dragging .nuf-drop { display: flex; }

/* uploads */
.nuf-uploads { position: fixed; right: 1rem; bottom: 1rem; width: 22rem; max-width: calc(100vw - 2rem); max-height: 50vh; z-index: 1040; }
.nuf-uploads .list-group { overflow: auto; }
.nuf-uploads .progress { height: .35rem; }

/* dialogs: the small dialog stays above the full-screen editor */
#nufDlg { z-index: 1070; }
#nufPick { z-index: 1065; }
.modal-backdrop ~ .modal-backdrop { z-index: 1060; }
#nufDlgText { white-space: pre-line; overflow-wrap: anywhere; }
.nuf-pick-list { max-height: 50vh; overflow: auto; }
.nuf-skipped { max-height: 40vh; overflow: auto; }

/* preview */
.nuf-preview-body { display: flex; align-items: center; justify-content: center; min-height: 40vh; background: var(--bs-tertiary-bg); }
.nuf-preview-img { max-width: 100%; max-height: 75vh; object-fit: contain; background: repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 16px 16px; }
.nuf-preview-frame { width: 100%; height: 75vh; border: 0; background: #fff; }
.nuf-preview-media { max-width: 100%; max-height: 75vh; }

/* editor */
.nuf-editor-body { display: flex; }
.nuf-editor-body .CodeMirror { flex: 1 1 auto; height: auto; font-size: .85rem; }
#nufEditor .modal-content { height: 100vh; }
#nufEditor .modal-body { overflow: hidden; }
#nufEditor .modal-body.nuf-editor-body { flex: 1 1 auto; min-height: 0; }
.nuf-editor-body .CodeMirror { height: auto; min-height: 0; }   /* fills the rest of the window below the header (one, two or three rows) */
/* editor header: the file name on its own row, tools below; on phones the buttons show only their icon */
.nuf-editor-head .modal-title { min-width: 0; font-size: 1rem; }
.nuf-editor-tools > .btn, .nuf-editor-tools .dropdown > .btn,
.nuf-codetools .nuCodeTools .btn { padding: .15rem .45rem; height: 1.9375rem; display: inline-flex; align-items: center; justify-content: center; }
@media (max-width: 575.98px) {
	.nuf-btn-text { display: none; }
	.nuf-editor-tools > .btn, .nuf-editor-tools .dropdown > .btn { width: 1.9375rem; padding: 0; }
	#nufVersionsBtn.dropdown-toggle::after { display: none; }
}
.nuf-icon-only { display: none; }
@media (max-width: 575.98px) { .nuf-icon-only { display: inline; } }
.nuf-dirty::after { content: ' \25CF'; color: var(--bs-warning); }
.nuf-versions { max-height: 60vh; overflow: auto; }
.CodeMirror-dialog { position: absolute; left: 0; right: 0; background: var(--bs-tertiary-bg); color: var(--bs-body-color); z-index: 15; padding: .25rem .8rem; overflow: hidden; font-size: .85rem; }
.CodeMirror-dialog-top { border-bottom: 1px solid var(--bs-border-color); top: 0; }
.CodeMirror-dialog-bottom { border-top: 1px solid var(--bs-border-color); bottom: 0; }
.CodeMirror-dialog input { border: 1px solid var(--bs-border-color); border-radius: .25rem; outline: none; background: var(--bs-body-bg); width: 20em; color: inherit; font-family: var(--bs-font-monospace); padding: 0 .3rem; }
.CodeMirror-dialog button { font-size: .8rem; margin-left: .25rem; }
.CodeMirror .cm-searching { background: rgba(255, 193, 7, .35); }
.CodeMirror .CodeMirror-linenumber { color: #666; }

/* CodeMirror in dark mode – the palette nuBuilder Next uses for its own editors */
[data-bs-theme="dark"] .CodeMirror { background: #1c2027; color: #e9ecef; }
[data-bs-theme="dark"] .CodeMirror .CodeMirror-gutters { background: #1c2027; border-right-color: #343a40; }
[data-bs-theme="dark"] .CodeMirror .CodeMirror-linenumber { color: #9aa5b1; }
[data-bs-theme="dark"] .CodeMirror .CodeMirror-cursor { border-left-color: #e9ecef; }
[data-bs-theme="dark"] .CodeMirror div.CodeMirror-selected, [data-bs-theme="dark"] .CodeMirror-focused div.CodeMirror-selected { background: #2f3b4a; }
[data-bs-theme="dark"] .CodeMirror .cm-keyword, [data-bs-theme="dark"] .CodeMirror .cm-attribute { color: #c792ea; }
[data-bs-theme="dark"] .CodeMirror .cm-atom, [data-bs-theme="dark"] .CodeMirror .cm-number { color: #f78c6c; }
[data-bs-theme="dark"] .CodeMirror .cm-def, [data-bs-theme="dark"] .CodeMirror .cm-variable-2, [data-bs-theme="dark"] .CodeMirror .cm-header, [data-bs-theme="dark"] .CodeMirror .cm-link { color: #82aaff; }
[data-bs-theme="dark"] .CodeMirror .cm-variable, [data-bs-theme="dark"] .CodeMirror .cm-punctuation { color: #e9ecef; }
[data-bs-theme="dark"] .CodeMirror .cm-variable-3, [data-bs-theme="dark"] .CodeMirror .cm-type, [data-bs-theme="dark"] .CodeMirror .cm-builtin { color: #ffcb6b; }
[data-bs-theme="dark"] .CodeMirror .cm-property { color: #9cdcfe; }
[data-bs-theme="dark"] .CodeMirror .cm-operator { color: #89ddff; }
[data-bs-theme="dark"] .CodeMirror .cm-comment { color: #9aa5b1; }
[data-bs-theme="dark"] .CodeMirror .cm-string, [data-bs-theme="dark"] .CodeMirror .cm-qualifier { color: #c3e88d; }
[data-bs-theme="dark"] .CodeMirror .cm-string-2, [data-bs-theme="dark"] .CodeMirror .cm-tag { color: #f07178; }
[data-bs-theme="dark"] .CodeMirror .cm-meta, [data-bs-theme="dark"] .CodeMirror .cm-bracket { color: #b0b8c0; }
[data-bs-theme="dark"] .CodeMirror .cm-error { color: #ff8e98; background: transparent; }
[data-bs-theme="dark"] .CodeMirror .CodeMirror-matchingbracket { color: #c3e88d !important; outline: 1px solid #4f5c6a; }
[data-bs-theme="dark"] .nuf-ico-dir { color: #d6a43a; }

/* small screens: the side bar slides in */
@media (max-width: 767.98px) {
	.nuf-side { position: fixed; z-index: 1030; top: 0; bottom: 0; left: 0; transform: translateX(-100%); transition: transform .2s; box-shadow: 0 0 1rem rgba(0, 0, 0, .25); }
	.nuf-app.nuf-side-open .nuf-side { transform: none; }
	.nuf-side-backdrop { position: fixed; inset: 0; z-index: 1029; background: rgba(0, 0, 0, .35); opacity: 0; visibility: hidden; transition: opacity .2s, visibility .2s; }
	.nuf-app.nuf-side-open .nuf-side-backdrop { opacity: 1; visibility: visible; }
	.nuf-lbl { display: none; }
	.nuf-c-time { display: none; }
	.nuf-app.nuf-show-time .nuf-c-time { display: table-cell; }   /* toggle #nufColToggle: date instead of size */
	.nuf-app.nuf-show-time .nuf-c-size { display: none; }
	#nufColToggle .nuf-ic-size, .nuf-app.nuf-show-time #nufColToggle .nuf-ic-time { display: none; }
	.nuf-app.nuf-show-time #nufColToggle .nuf-ic-size { display: inline-block; }
	.nuf-search { flex-basis: 10rem; }
	.nuf-bar { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) { .nuf-side, .nuf-side-backdrop { transition: none; } }
@media (min-width: 768px) { .nuf-side-backdrop { display: none; } }

/* permissions dialog (globeadmin) */
.nuf-chmod-grid { max-width: 22rem; }
.nuf-chmod-num { width: 5rem; font-family: var(--bs-font-monospace); }
@media (max-width: 767.98px) { .nuf-search { flex: 1 1 100%; } }
/* phones: the toolbar in one row (no separator, tighter gaps and buttons) */
@media (max-width: 575.98px) {
	.nuf-tools { gap: .25rem; padding: .4rem .5rem; }
	.nuf-tools .nuf-sep { display: none; }
	.nuf-tools > .btn, .nuf-tools > .btn-group > .btn { flex: 0 0 auto; padding-left: .45rem; padding-right: .45rem; }
	.nuf-tools > .btn-group > .dropdown-toggle-split { padding-left: .3rem; padding-right: .3rem; }
}
@media (max-width: 419.98px) {   /* phones up to 420 px: the column toggle (0.8.1095) needs the room */
	.nuf-tools { gap: .2rem; padding-left: .35rem; padding-right: .35rem; }
	.nuf-tools > .btn, .nuf-tools > .btn-group > .btn { padding-left: .3rem; padding-right: .3rem; }
	.nuf-tools > .btn-group > .dropdown-toggle-split { padding-left: .2rem; padding-right: .2rem; }
}

/* grid view (tiles with thumbnails) */
#nufLayoutBtn .nuf-ic-list, .nuf-layout-grid #nufLayoutBtn .nuf-ic-grid { display: none; }
.nuf-layout-grid #nufLayoutBtn .nuf-ic-list { display: inline-block; }
#nufColToggle.nuf-off { display: none !important; }
.nuf-gridbar { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; gap: .75rem; padding: .3rem .75rem; background: var(--bs-body-bg); border-bottom: 1px solid var(--bs-border-color); }
.nuf-gridbar .form-check-input { margin: 0 .25rem 0 0; }
.nuf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr)); gap: .5rem; padding: .75rem; user-select: none; }
.nuf-tile { position: relative; display: flex; flex-direction: column; min-width: 0; padding: .4rem .4rem .45rem; border: 1px solid transparent; border-radius: .5rem; color: var(--bs-body-color); text-decoration: none; cursor: default; }
.nuf-tile:hover { background: var(--bs-tertiary-bg); }
.nuf-tile.nuf-sel { background: var(--bs-primary-bg-subtle); border-color: var(--bs-primary-border-subtle); }
.nuf-thumb { display: flex; align-items: center; justify-content: center; aspect-ratio: 4 / 3; border-radius: .35rem; overflow: hidden; }
.nuf-thumb .bi { font-size: 3rem; color: var(--bs-secondary-color); }
.nuf-thumb .nuf-ico-dir { color: #e0a526; }
.nuf-thumb { position: relative; }
.nuf-thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; }   /* not display: none – a lazy picture would never load */
.nuf-thumb-img { background: var(--bs-secondary-bg); }
.nuf-thumb-img img { opacity: 1; }
.nuf-thumb-img .bi { display: none; }
.nuf-tname { display: block; margin-top: .35rem; font-size: .85rem; text-align: center; color: var(--bs-body-color); text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
a.nuf-tname:hover { text-decoration: underline; }
.nuf-tsub { font-size: .72rem; text-align: center; color: var(--bs-secondary-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nuf-tcheck { position: absolute; top: .45rem; left: .45rem; z-index: 1; margin: 0; opacity: 0; }
.nuf-tmenu { position: absolute; top: .15rem; right: .1rem; z-index: 1; opacity: 0; }
.nuf-tmenu .nuf-more { padding: .1rem .25rem; background: var(--bs-body-bg); border-radius: .35rem; }
.nuf-tile:hover .nuf-tcheck, .nuf-tile:focus-within .nuf-tcheck, .nuf-tile.nuf-sel .nuf-tcheck, .nuf-tile:hover .nuf-tmenu, .nuf-tile:focus-within .nuf-tmenu, .nuf-tmenu:has(.show) { opacity: 1; }
@media (hover: none) { .nuf-tcheck, .nuf-tmenu { opacity: 1; } }
@media (max-width: 575.98px) { .nuf-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); padding: .5rem; } }

/* nuBuilder Forte edition: Ace editor fills the editor dialogue; Font Awesome icons in the places of Bootstrap Icons */
.nuf-editor-body { position: relative; }
.nuf-ace { position: absolute; inset: 0; }
.nuf .bi { display: inline-block; width: 1.15em; text-align: center; }
#nufThemeBtn .nuf-ic-light, [data-bs-theme="dark"] #nufThemeBtn .nuf-ic-dark { display: none; }
[data-bs-theme="dark"] #nufThemeBtn .nuf-ic-light { display: inline-block; }

NUFCSS;

// ====================================================================================================================== run

$nu = new NufCtx($NUF_SETTINGS);

if (isset($_GET['asset'])) {                     // the page's own script and style (CSP 'self', no inline code)
	$a = (string)$_GET['asset'];
	header('X-Content-Type-Options: nosniff');
	header('Cache-Control: private, max-age=86400');
	if ($a === 'js') { header('Content-Type: text/javascript; charset=utf-8'); echo NUF_JS; exit; }
	if ($a === 'css') { header('Content-Type: text/css; charset=utf-8'); echo NUF_CSS; exit; }
	http_response_code(404);
	exit;
}

header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; "
	. "media-src 'self' blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'");
header('Referrer-Policy: same-origin');
header('X-Content-Type-Options: nosniff');

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
session_name('NUFILESFORTE');
session_set_cookie_params(['lifetime' => 0, 'path' => rtrim(str_replace('\\', '/', dirname((string)$_SERVER['SCRIPT_NAME'])), '/') . '/',
	'secure' => $https, 'httponly' => true, 'samesite' => 'Strict']);
session_start();

$S = [];
try {
	$nu->connect();
	$why = $nu->signIn();
} catch (Throwable $e) {
	error_log('nuFiles: ' . $e->getMessage());
	$why = 'err_server';
}
$S = NufI18n::strings($nu->lang());
$de = str_starts_with($nu->lang(), 'de');
$S = array_replace($S, $de ? [
	'reauth_text' => 'Code-Ordner enthalten das Programm dieses Servers. Bitte bestätige dein Passwort.',
	'err_password' => 'Das Passwort stimmt nicht.', 'err_password_many' => 'Zu viele Versuche – warte ein paar Minuten.',
	'err_session' => 'Die Sitzung ist abgelaufen – melde dich bei nuBuilder an und öffne den Datei-Manager von dort.',
	'err_access' => 'Kein Zugriff auf den Datei-Manager.', 'err_csrf' => 'Die Seite ist veraltet – bitte neu laden.',
] : [
	'reauth_text' => 'Code folders hold the program of this server. Please confirm your password.',
	'err_password' => 'The password is not correct.', 'err_password_many' => 'Too many tries – wait a few minutes.',
	'err_session' => 'The session has ended – sign in to nuBuilder and open the File Manager from there.',
	'err_access' => 'No access to the File Manager.', 'err_csrf' => 'The page is out of date – please reload it.',
]);

if ($why !== null) {
	if ($nu->action() !== '') $nu->json(['ok' => false, 'error' => $why, 'message' => $S[$why] ?? $why], $why === 'err_server' ? 500 : 401);
	http_response_code($why === 'err_server' ? 500 : 403);
	header('Content-Type: text/html; charset=utf-8');
	echo '<!doctype html><meta charset="utf-8"><title>' . $nu->h($S['title'] ?? 'Files') . '</title><body style="font-family:system-ui,sans-serif;padding:2rem"><p>'
		. $nu->h($S[$why] ?? $why) . '</p><p><a href="' . $nu->h($nu->homeUrl()) . '">nuBuilder</a></p></body>';
	exit;
}

$sess = &$nu->session();
if (empty($sess['csrf'])) $sess['csrf'] = bin2hex(random_bytes(32));
if ($nu->isPost()) {
	$tok = (string)($_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['_csrf'] ?? ''));
	if (!hash_equals((string)$sess['csrf'], $tok)) $nu->json(['ok' => false, 'error' => 'csrf', 'message' => $S['err_csrf']], 403);
}

if ($nu->action() === 'reauth') {               // password confirmation (code shares, chmod): 5 tries per 15 minutes
	if (!$nu->isPost()) $nu->json(['ok' => false, 'error' => 'err_bad_request', 'message' => $S['err_bad_request'] ?? 'Bad request'], 405);
	$tries = array_values(array_filter((array)($sess['pw_tries'] ?? []), static fn($t) => (int)$t > time() - 900));
	if (count($tries) >= 5) $nu->json(['ok' => false, 'error' => 'err_password_many', 'message' => $S['err_password_many']], 429);
	if (!$nu->checkPassword((string)($_POST['password'] ?? ''))) {
		$tries[] = time();
		$sess['pw_tries'] = $tries;
		usleep(400000);
		$nu->json(['ok' => false, 'error' => 'err_password', 'message' => $S['err_password']], 403);
	}
	$sess['pw_tries'] = [];
	$sess['auth_at'] = time();
	session_regenerate_id(true);
	$nu->json(['ok' => true]);
}

NufConfig::load($nu);
NufFs::housekeeping(NufConfig::$limits);
if ($nu->action() !== '') NufApi::handle($nu, $S);

$boot = NufApi::boot($nu, $S) + ['csrf' => (string)$sess['csrf']];
$t = static fn(string $k): string => $nu->h($S[$k] ?? $k);
$theme = $nu->theme();
?><!doctype html>
<html lang="<?= $nu->h(substr($nu->lang(), 0, 2)) ?>" data-bs-theme="<?= $theme === 'dark' ? 'dark' : 'light' ?>" data-nuf-theme="<?= $nu->h($theme) ?>">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= $t('title') ?></title>
<link rel="stylesheet" href="<?= $nu->h(NUF_FORTE_URL . 'third_party/bootstrap/bootstrap.min.css') ?>">
<link rel="stylesheet" href="<?= $nu->h(NUF_FORTE_URL . 'third_party/fontawesome/css/all.min.css') ?>">
<link rel="stylesheet" href="<?= $nu->h($nu->asset('assets/app.css')) ?>">
</head>
<body class="nuf" data-ace="<?= $nu->h(NUF_FORTE_URL . 'third_party/ace/src-min-noconflict') ?>">
<script type="application/json" id="nufBoot"><?= json_encode($boot, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_INVALID_UTF8_SUBSTITUTE) ?></script>

<div class="nuf-app" id="nufApp">
	<aside class="nuf-side" id="nufSide" aria-label="<?= $t('shares') ?>">
		<div class="nuf-side-head">
			<i class="bi fa-solid fa-server" aria-hidden="true"></i> <span><?= $t('shares') ?></span>
		</div>
		<nav class="nav flex-column nuf-shares" id="nufShares"></nav>
		<div class="nuf-side-foot">
			<button type="button" class="nav-link nuf-side-link" id="nufTrashBtn"><i class="bi fa-regular fa-trash-can" aria-hidden="true"></i> <?= $t('trash') ?></button>
			<button type="button" class="nav-link nuf-side-link" id="nufThemeBtn" aria-pressed="false"><i class="bi fa-solid fa-moon nuf-ic-dark" aria-hidden="true"></i><i class="bi fa-solid fa-sun nuf-ic-light" aria-hidden="true"></i> <span id="nufThemeLbl"></span></button>
			<button type="button" class="nav-link nuf-side-link d-none" id="nufLogBtn"><i class="bi fa-solid fa-book" aria-hidden="true"></i> <?= $t('log') ?></button>
		</div>
	</aside>
	<div class="nuf-side-backdrop" id="nufSideBackdrop" aria-hidden="true"></div>

	<main class="nuf-main" id="nufMain">
		<div class="nuf-bar">
			<button type="button" class="btn btn-sm btn-outline-secondary d-md-none" id="nufSideToggle" aria-controls="nufSide" aria-expanded="false" title="<?= $t('shares') ?>"><i class="bi fa-solid fa-bars"></i></button>
			<nav aria-label="breadcrumb" class="nuf-crumbs"><ol class="breadcrumb mb-0" id="nufCrumbs"></ol><div class="nuf-phpath" id="nufPhPath"></div></nav>
			<form class="nuf-search" id="nufSearchForm" role="search">
				<div class="input-group input-group-sm">
					<span class="input-group-text"><i class="bi fa-solid fa-magnifying-glass" aria-hidden="true"></i></span>
					<input type="search" class="form-control" id="nufSearch" placeholder="<?= $t('search_ph') ?>" aria-label="<?= $t('search_ph') ?>" maxlength="200">
				</div>
			</form>
		</div>

		<div class="nuf-tools" id="nufTools" role="toolbar">
			<div class="btn-group btn-group-sm" data-need="upload">
				<button type="button" class="btn btn-primary" id="nufUploadBtn"><i class="bi fa-solid fa-upload"></i> <span class="nuf-lbl"><?= $t('upload') ?></span></button>
				<button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" data-need="delete"><span class="visually-hidden"><?= $t('details') ?></span></button>
				<div class="dropdown-menu p-2 nuf-upload-opts">
					<div class="form-check"><input class="form-check-input" type="checkbox" id="nufOverwrite"><label class="form-check-label" for="nufOverwrite"><?= $t('overwrite_existing') ?></label></div>
				</div>
			</div>
			<input type="file" id="nufFileInput" multiple hidden>
			<button type="button" class="btn btn-sm btn-outline-secondary" id="nufMkdirBtn" data-need="mkdir"><i class="bi fa-solid fa-folder-plus"></i> <span class="nuf-lbl"><?= $t('new_folder') ?></span></button>
			<button type="button" class="btn btn-sm btn-outline-secondary" id="nufNewFileBtn" data-need="edit"><i class="bi fa-solid fa-file-circle-plus"></i> <span class="nuf-lbl"><?= $t('new_file') ?></span></button>
			<span class="nuf-sep"></span>
			<button type="button" class="btn btn-sm btn-outline-secondary" id="nufDownloadBtn" data-sel="1"><i class="bi fa-solid fa-download"></i> <span class="nuf-lbl"><?= $t('download') ?></span></button>
			<button type="button" class="btn btn-sm btn-outline-secondary" id="nufCopyBtn" data-sel="1" data-need="view"><i class="bi fa-regular fa-copy"></i> <span class="nuf-lbl"><?= $t('copy') ?></span></button>
			<button type="button" class="btn btn-sm btn-outline-secondary" id="nufMoveBtn" data-sel="1" data-need="rename|delete"><i class="bi fa-solid fa-arrow-right"></i> <span class="nuf-lbl"><?= $t('move') ?></span></button>
			<button type="button" class="btn btn-sm btn-outline-secondary" id="nufZipBtn" data-sel="1" data-need="zip"><i class="bi fa-regular fa-file-zipper"></i> <span class="nuf-lbl"><?= $t('zip') ?></span></button>
			<button type="button" class="btn btn-sm btn-outline-danger" id="nufDeleteBtn" data-sel="1" data-need="delete"><i class="bi fa-regular fa-trash-can"></i> <span class="nuf-lbl"><?= $t('delete') ?></span></button>
			<span class="ms-auto"></span>
			<span class="badge text-bg-warning d-none" id="nufRoBadge"><?= $t('readonly_badge') ?></span>
			<button type="button" class="btn btn-sm btn-outline-secondary d-md-none" id="nufColToggle" title="<?= $t('show_modified') ?>" aria-label="<?= $t('show_modified') ?>" aria-pressed="false"><i class="bi fa-regular fa-clock nuf-ic-time"></i><i class="bi fa-solid fa-hard-drive nuf-ic-size"></i></button>
			<button type="button" class="btn btn-sm btn-outline-secondary" id="nufLayoutBtn" title="<?= $t('view_grid') ?>" aria-label="<?= $t('view_grid') ?>" aria-pressed="false"><i class="bi fa-solid fa-table-cells nuf-ic-grid"></i><i class="bi fa-solid fa-list nuf-ic-list"></i></button>
			<button type="button" class="btn btn-sm btn-outline-secondary" id="nufRefreshBtn" title="<?= $t('refresh') ?>"><i class="bi fa-solid fa-rotate-right"></i></button>
		</div>

		<div class="alert alert-warning m-2 d-none" id="nufProblems" role="alert"></div>

		<div class="nuf-view" id="nufView" tabindex="-1">
			<div class="nuf-drop" id="nufDrop" aria-hidden="true"><div><i class="bi fa-solid fa-cloud-arrow-up"></i><br><?= $t('drop_here') ?></div></div>
			<div class="nuf-msg text-body-secondary d-none" id="nufMsg"></div>
			<div class="nuf-gridbar d-none" id="nufGridBar">
				<input class="form-check-input" type="checkbox" id="nufAllG" aria-label="<?= $t('select_all') ?>">
				<span class="text-body-secondary small"><?= $t('sort_by') ?></span>
				<button type="button" class="nuf-sort" data-sort="name"><?= $t('name') ?></button>
				<button type="button" class="nuf-sort" data-sort="size"><?= $t('size') ?></button>
				<button type="button" class="nuf-sort" data-sort="mtime"><?= $t('modified') ?></button>
			</div>
			<div class="nuf-grid d-none" id="nufGrid"></div>
			<table class="table table-sm table-hover align-middle nuf-table mb-0" id="nufTable">
				<thead><tr>
					<th class="nuf-c-check"><input class="form-check-input" type="checkbox" id="nufAll" aria-label="<?= $t('select_all') ?>"></th>
					<th class="nuf-c-name"><button type="button" class="nuf-sort" data-sort="name"><?= $t('name') ?></button></th>
					<th class="nuf-c-size text-end"><button type="button" class="nuf-sort" data-sort="size"><?= $t('size') ?></button></th>
					<th class="nuf-c-time"><button type="button" class="nuf-sort" data-sort="mtime"><?= $t('modified') ?></button></th>
					<th class="nuf-c-act"><span class="visually-hidden"><?= $t('actions') ?></span></th>
				</tr></thead>
				<tbody id="nufRows"></tbody>
			</table>
			<table class="table table-sm table-hover align-middle nuf-table nuf-table2 mb-0 d-none" id="nufTable2">
				<thead><tr id="nufHead2"></tr></thead>
				<tbody id="nufRows2"></tbody>
			</table>
		</div>

		<div class="nuf-status" id="nufStatus"><span id="nufStatusLeft"></span><span id="nufStatusRight"></span></div>
	</main>
</div>

<!-- uploads -->
<div class="nuf-uploads card shadow d-none" id="nufUploads">
	<div class="card-header d-flex align-items-center gap-2 py-1">
		<i class="bi fa-solid fa-upload"></i><strong class="me-auto" id="nufUploadsTitle"><?= $t('uploading') ?></strong>
		<button type="button" class="btn-close btn-sm" id="nufUploadsClose" aria-label="<?= $t('close') ?>"></button>
	</div>
	<ul class="list-group list-group-flush" id="nufUploadList"></ul>
</div>

<!-- generic dialog: prompt / confirm / message -->
<div class="modal fade" id="nufDlg" tabindex="-1" aria-hidden="true" aria-labelledby="nufDlgTitle">
	<div class="modal-dialog modal-dialog-centered"><form class="modal-content" id="nufDlgForm" novalidate>
		<div class="modal-header"><h5 class="modal-title" id="nufDlgTitle"></h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="<?= $t('close') ?>"></button></div>
		<div class="modal-body"><div id="nufDlgText" class="mb-2"></div><input type="text" class="form-control d-none" id="nufDlgInput" autocomplete="off" spellcheck="false"><div class="invalid-feedback" id="nufDlgErr"></div></div>
		<div class="modal-footer" id="nufDlgFoot"></div>
	</form></div>
</div>

<!-- folder picker (copy / move) -->
<div class="modal fade" id="nufPick" tabindex="-1" aria-hidden="true" aria-labelledby="nufPickTitle">
	<div class="modal-dialog modal-dialog-scrollable"><div class="modal-content">
		<div class="modal-header"><h5 class="modal-title" id="nufPickTitle"><?= $t('choose_folder') ?></h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="<?= $t('close') ?>"></button></div>
		<div class="modal-body">
			<select class="form-select form-select-sm mb-2" id="nufPickShare" aria-label="<?= $t('shares') ?>"></select>
			<div class="small mb-2 text-break" id="nufPickPath"></div>
			<div class="list-group list-group-flush nuf-pick-list" id="nufPickList"></div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?= $t('cancel') ?></button>
			<button type="button" class="btn btn-primary" id="nufPickOk"><?= $t('here') ?></button>
		</div>
	</div></div>
</div>

<!-- preview -->
<div class="modal fade" id="nufPreview" tabindex="-1" aria-hidden="true" aria-labelledby="nufPreviewTitle">
	<div class="modal-dialog modal-xl modal-dialog-centered"><div class="modal-content">
		<div class="modal-header"><h5 class="modal-title text-truncate" id="nufPreviewTitle"></h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="<?= $t('close') ?>"></button></div>
		<div class="modal-body nuf-preview-body" id="nufPreviewBody"></div>
		<div class="modal-footer"><a class="btn btn-outline-secondary" id="nufPreviewDl" href="#"><i class="bi fa-solid fa-download"></i> <?= $t('download') ?></a><button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?= $t('close') ?></button></div>
	</div></div>
</div>

<!-- editor -->
<div class="modal" id="nufEditor" tabindex="-1" aria-hidden="true" aria-labelledby="nufEditorTitle" data-bs-backdrop="static" data-bs-keyboard="false">
	<div class="modal-dialog modal-fullscreen"><div class="modal-content">
		<div class="modal-header py-2 gap-2 flex-wrap nuf-editor-head">
			<div class="d-flex align-items-center gap-2 w-100 nuf-editor-titlerow">
				<h5 class="modal-title text-truncate me-auto" id="nufEditorTitle"></h5>
				<span class="badge text-bg-secondary d-none" id="nufEditorRo"><?= $t('readonly_badge') ?></span>
				<span class="small text-body-secondary text-nowrap" id="nufEditorPos"></span>
			</div>
			<div class="d-flex align-items-center gap-2 flex-wrap w-100 nuf-editor-tools">
				<div class="nuf-codetools" id="nufCodeTools"></div>
				<div class="form-check form-switch mb-0 small ms-auto"><input class="form-check-input" type="checkbox" id="nufWrap"><label class="form-check-label" for="nufWrap" title="<?= $t('wrap') ?>"><i class="bi fa-solid fa-paragraph nuf-icon-only" aria-hidden="true"></i><span class="nuf-btn-text"><?= $t('wrap') ?></span></label></div>
				<div class="dropdown">
					<button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" id="nufVersionsBtn" title="<?= $t('versions') ?>" aria-label="<?= $t('versions') ?>"><i class="bi fa-solid fa-clock-rotate-left" aria-hidden="true"></i><span class="nuf-btn-text"> <?= $t('versions') ?></span></button>
					<ul class="dropdown-menu dropdown-menu-end nuf-versions" id="nufVersions"></ul>
				</div>
				<button type="button" class="btn btn-sm btn-primary" id="nufSaveBtn" title="<?= $t('save') ?> – <?= $t('shortcut_hint') ?>" aria-label="<?= $t('save') ?>"><i class="bi fa-solid fa-floppy-disk" aria-hidden="true"></i><span class="nuf-btn-text"> <?= $t('save') ?></span></button>
				<button type="button" class="btn btn-sm btn-outline-secondary" id="nufEditorClose" title="<?= $t('close') ?>" aria-label="<?= $t('close') ?>"><i class="bi fa-solid fa-xmark" aria-hidden="true"></i><span class="nuf-btn-text"> <?= $t('close') ?></span></button>
			</div>
		</div>
		<div class="modal-body p-0 nuf-editor-body"><textarea id="nufCode" aria-labelledby="nufEditorTitle"></textarea></div>
	</div></div>
</div>

<!-- trash / log / info / search results share the main view; the toasts -->
<div class="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3" id="nufToasts" aria-live="polite"></div>

<script src="<?= $nu->h(NUF_FORTE_URL . 'third_party/bootstrap/bootstrap.bundle.min.js') ?>"></script>
<script src="<?= $nu->h(NUF_FORTE_URL . 'third_party/ace/src-min-noconflict/ace.js') ?>"></script>
<script src="<?= $nu->h($nu->url(['asset' => 'js', 'v' => NUF_ASSET_V])) ?>"></script>
</body>
</html>
