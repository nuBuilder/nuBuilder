<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* header.twig */
class __TwigTemplate_da2ab562267720cdc1d5bde3ba67b5ebb943dd4a398bc8673fb915078bae42f0 extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        if (( !($context["is_ajax"] ?? null) && ($context["is_enabled"] ?? null))) {
            // line 3
            echo "<!doctype html>
<html lang=\"";
            // line 4
            echo twig_escape_filter($this->env, ($context["lang"] ?? null), "html", null, true);
            echo "\" dir=\"";
            echo twig_escape_filter($this->env, ($context["text_dir"] ?? null), "html", null, true);
            echo "\">
<head>
  <meta charset=\"utf-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">
  <meta name=\"referrer\" content=\"no-referrer\">
  <meta name=\"robots\" content=\"noindex,nofollow\">
  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\">
  ";
            // line 11
            if ( !($context["allow_third_party_framing"] ?? null)) {
                // line 12
                echo "<style id=\"cfs-style\">html{display: none;}</style>";
            }
            // line 14
            echo "
  <link rel=\"icon\" href=\"favicon.ico\" type=\"image/x-icon\">
  <link rel=\"shortcut icon\" href=\"favicon.ico\" type=\"image/x-icon\">
  ";
            // line 17
            if (($context["is_print_view"] ?? null)) {
                // line 18
                echo "    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
                echo twig_escape_filter($this->env, ($context["base_dir"] ?? null), "html", null, true);
                echo "print.css?";
                echo twig_escape_filter($this->env, ($context["version"] ?? null), "html", null, true);
                echo "\">
  ";
            } else {
                // line 20
                echo "    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
                echo twig_escape_filter($this->env, ($context["theme_path"] ?? null), "html", null, true);
                echo "/jquery/jquery-ui.css\">
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
                // line 21
                echo twig_escape_filter($this->env, ($context["base_dir"] ?? null), "html", null, true);
                echo "js/vendor/codemirror/lib/codemirror.css?";
                echo twig_escape_filter($this->env, ($context["version"] ?? null), "html", null, true);
                echo "\">
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
                // line 22
                echo twig_escape_filter($this->env, ($context["base_dir"] ?? null), "html", null, true);
                echo "js/vendor/codemirror/addon/hint/show-hint.css?";
                echo twig_escape_filter($this->env, ($context["version"] ?? null), "html", null, true);
                echo "\">
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
                // line 23
                echo twig_escape_filter($this->env, ($context["base_dir"] ?? null), "html", null, true);
                echo "js/vendor/codemirror/addon/lint/lint.css?";
                echo twig_escape_filter($this->env, ($context["version"] ?? null), "html", null, true);
                echo "\">
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
                // line 24
                echo twig_escape_filter($this->env, ($context["theme_path"] ?? null), "html", null, true);
                echo "/css/theme";
                echo (((($context["text_dir"] ?? null) == "rtl")) ? ("-rtl") : (""));
                echo ".css?";
                echo twig_escape_filter($this->env, ($context["version"] ?? null), "html", null, true);
                echo "&nocache=";
                // line 25
                echo twig_escape_filter($this->env, ($context["unique_value"] ?? null), "html", null, true);
                echo twig_escape_filter($this->env, ($context["text_dir"] ?? null), "html", null, true);
                if ( !twig_test_empty(($context["server"] ?? null))) {
                    echo "&server=";
                    echo twig_escape_filter($this->env, ($context["server"] ?? null), "html", null, true);
                }
                echo "\">
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
                // line 26
                echo twig_escape_filter($this->env, ($context["theme_path"] ?? null), "html", null, true);
                echo "/css/printview.css?";
                echo twig_escape_filter($this->env, ($context["version"] ?? null), "html", null, true);
                echo "\" media=\"print\" id=\"printcss\">
  ";
            }
            // line 28
            echo "  <title>";
            echo twig_escape_filter($this->env, ($context["title"] ?? null), "html", null, true);
            echo "</title>
  ";
            // line 29
            echo ($context["scripts"] ?? null);
            echo "
  <noscript><style>html{display:block}</style></noscript>
</head>
<body";
            // line 32
            (( !twig_test_empty(($context["body_id"] ?? null))) ? (print (twig_escape_filter($this->env, (" id=" . ($context["body_id"] ?? null)), "html", null, true))) : (print ("")));
            echo ">
  ";
            // line 33
            echo ($context["navigation"] ?? null);
            echo "
  ";
            // line 34
            echo ($context["custom_header"] ?? null);
            echo "
  ";
            // line 35
            echo ($context["load_user_preferences"] ?? null);
            echo "

  ";
            // line 37
            if ( !($context["show_hint"] ?? null)) {
                // line 38
                echo "    <span id=\"no_hint\" class=\"hide\"></span>
  ";
            }
            // line 40
            echo "
  ";
            // line 41
            if (($context["is_warnings_enabled"] ?? null)) {
                // line 42
                echo "    <noscript>
      ";
                // line 43
                echo call_user_func_array($this->env->getFilter('error')->getCallable(), [_gettext("Javascript must be enabled past this point!")]);
                echo "
    </noscript>
  ";
            }
            // line 46
            echo "
  ";
            // line 47
            if ((($context["is_menu_enabled"] ?? null) && (($context["server"] ?? null) > 0))) {
                // line 48
                echo "    ";
                echo ($context["menu"] ?? null);
                echo "
    <span id=\"page_nav_icons\">
      <span id=\"lock_page_icon\"></span>
      <span id=\"page_settings_icon\">
        ";
                // line 52
                echo PhpMyAdmin\Util::getImage("s_cog", _gettext("Page-related settings"));
                echo "
      </span>
      <a id=\"goto_pagetop\" href=\"#\">";
                // line 54
                echo PhpMyAdmin\Util::getImage("s_top", _gettext("Click on the bar to scroll to top of page"));
                echo "</a>
    </span>
  ";
            }
            // line 57
            echo "
  ";
            // line 58
            echo ($context["console"] ?? null);
            echo "

  <div id=\"page_content\">
    ";
            // line 61
            echo ($context["messages"] ?? null);
            echo "
";
        }
        // line 63
        echo "
";
        // line 64
        if ((($context["is_enabled"] ?? null) && ($context["has_recent_table"] ?? null))) {
            // line 65
            echo "  ";
            echo ($context["recent_table"] ?? null);
            echo "
";
        }
    }

    public function getTemplateName()
    {
        return "header.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  211 => 65,  209 => 64,  206 => 63,  201 => 61,  195 => 58,  192 => 57,  186 => 54,  181 => 52,  173 => 48,  171 => 47,  168 => 46,  162 => 43,  159 => 42,  157 => 41,  154 => 40,  150 => 38,  148 => 37,  143 => 35,  139 => 34,  135 => 33,  131 => 32,  125 => 29,  120 => 28,  113 => 26,  104 => 25,  97 => 24,  91 => 23,  85 => 22,  79 => 21,  74 => 20,  66 => 18,  64 => 17,  59 => 14,  56 => 12,  54 => 11,  42 => 4,  39 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "header.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\header.twig");
    }
}
