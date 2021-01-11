<?php

function nu_sanitize() {

	//nu_sanitize_get_variables();
	//nu_sanitize_post_variables();
}

function nu_sanitize_get_variables() {	

	//_nu_sanitize_array($_GET);
}

function nu_sanitize_post_variables() {

	//_nu_sanitize_array($_POST);
}

function _nu_sanitize_array(&$_array) {

	foreach ($_array as $key => $value) {
		if ( is_array($value) ) {
			_nu_sanitize_array($value);
		} else {
			if ( !is_array($value) && !is_object($value) ) {
				$_arry[$key] = nu_sanitize_text_fields($value);
			}
		}
	}
}

function nu_sanitize_sql_orderby( $orderby ) {

	if ( preg_match( '/^\s*(([a-z0-9_]+|`[a-z0-9_]+`)(\s+(ASC|DESC))?\s*(,\s*(?=[a-z0-9_`])|$))+$/i', $orderby ) || preg_match( '/^\s*RAND\(\s*\)\s*$/i', $orderby ) ) {
		return $orderby;
	}

	return false;
}

function nu_sanitize_text_fields( $str, $keep_newlines = false ) {
		$filtered = nu_wp_check_invalid_utf8( $str );

		if ( strpos($filtered, '<') !== false ) {
			$filtered = nu_wp_pre_kses_less_than( $filtered );
			// This will strip extra whitespace for us.
			$filtered = nu_wp_strip_all_tags( $filtered, false );

			// Use html entities in a special case to make sure no later
			// newline stripping stage could lead to a functional tag
			$filtered = str_replace("<\n", "&lt;\n", $filtered);
		}

		if ( ! $keep_newlines ) {
			$filtered = preg_replace( '/[\r\n\t ]+/', ' ', $filtered );
		}
		$filtered = trim( $filtered );

		$found = false;
		while ( preg_match('/%[a-f0-9]{2}/i', $filtered, $match) ) {
			$filtered = str_replace($match[0], '', $filtered);
			$found = true;
		}

		if ( $found ) {
			// Strip out the whitespace that may now exist after removing the octets.
			$filtered = trim( preg_replace('/ +/', ' ', $filtered) );
		}

		return $filtered;
}

function nu_wp_strip_all_tags($string, $remove_breaks = false) {
		$string = preg_replace( '@<(script|style)[^>]*?>.*?</\\1>@si', '', $string );
		$string = strip_tags($string);

		if ( $remove_breaks )
			$string = preg_replace('/[\r\n\t ]+/', ' ', $string);

		return trim( $string );
}

function nu_wp_pre_kses_less_than( $text ) {
		return preg_replace_callback('%<[^>]*?((?=<)|>|$)%', 'nu_wp_pre_kses_less_than_callback', $text);
}

function nu_wp_pre_kses_less_than_callback( $matches ) {
		if ( false === strpos($matches[0], '>') )
			return esc_html($matches[0]);
		return $matches[0];
}

function nu_wp_check_invalid_utf8( $string, $strip = false ) {
		$string = (string) $string;

		if ( 0 === strlen( $string ) ) {
			return '';
		}

		// Store the site charset as a static to avoid multiple calls to get_option()
		static $is_utf8 = null;
		if ( ! isset( $is_utf8 ) ) {
			$is_utf8 = in_array( $_SESSION['nubuilder_session_data']['WP_BLOG_CHARSET'] , array( 'utf8', 'utf-8', 'UTF8', 'UTF-8' ) );
		}
		if ( ! $is_utf8 ) {
			return $string;
		}

		// Check for support for utf8 in the installed PCRE library once and store the result in a static
		static $utf8_pcre = null;
		if ( ! isset( $utf8_pcre ) ) {
			$utf8_pcre = @preg_match( '/^./u', 'a' );
		}
		// We can't demand utf8 in the PCRE installation, so just return the string in those cases
		if ( !$utf8_pcre ) {
			return $string;
		}

		// preg_match fails when it encounters invalid UTF8 in $string
		if ( 1 === @preg_match( '/^./us', $string ) ) {
			return $string;
		}

		// Attempt to strip the bad chars if requested (not recommended)
		if ( $strip && function_exists( 'iconv' ) ) {
			return iconv( 'utf-8', 'utf-8', $string );
		}

		return '';
}



?>
