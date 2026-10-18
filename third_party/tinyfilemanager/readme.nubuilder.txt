version: 2.6+git.4149143.nu1
upstream: https://github.com/prasathmani/tinyfilemanager
commit: 41491439a6b243c55502581e53fad20bc4c6e777
commit-note: CWE-626 precautionary patch (null byte in file names rejected, PR #1427)
downloaded: 2026-10-19
CVE-2025-15138: open (path traversal via fullpath – no upstream fix known)
additions:
- config.php
fixes:
- tinyfilemanager.php: saving a file results in an "Invalid Token" error (https://github.com/prasathmani/tinyfilemanager/issues/1282)