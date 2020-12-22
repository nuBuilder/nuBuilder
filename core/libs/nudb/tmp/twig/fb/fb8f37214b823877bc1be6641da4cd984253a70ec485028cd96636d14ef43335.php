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

/* display/export/options_output.twig */
class __TwigTemplate_f27429ab1a6c9e36d53c730835e0044ef35a713fe873580ad5cac33525587173 extends \Twig\Template
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
        echo "<div class=\"exportoptions\" id=\"output\">
    <h3>";
        // line 2
        echo _gettext("Output:");
        echo "</h3>
    <ul id=\"ul_output\">
        <li>
            <input type=\"checkbox\" id=\"btn_alias_config\"";
        // line 5
        echo ((($context["has_aliases"] ?? null)) ? (" checked") : (""));
        echo ">
            <label for=\"btn_alias_config\">
                ";
        // line 7
        echo _gettext("Rename exported databases/tables/columns");
        // line 8
        echo "            </label>
        </li>

        ";
        // line 11
        if ((($context["export_type"] ?? null) != "server")) {
            // line 12
            echo "            <li>
                <input type=\"checkbox\" name=\"lock_tables\"
                    value=\"something\" id=\"checkbox_lock_tables\"";
            // line 15
            echo (((( !($context["repopulate"] ?? null) && ($context["is_checked_lock_tables"] ?? null)) || ($context["lock_tables"] ?? null))) ? (" checked") : (""));
            echo ">
                <label for=\"checkbox_lock_tables\">
                    ";
            // line 17
            echo sprintf(_gettext("Use %s statement"), "<code>LOCK TABLES</code>");
            echo "
                </label>
            </li>
        ";
        }
        // line 21
        echo "
        <li>
            <input type=\"radio\" name=\"output_format\" value=\"sendit\" id=\"radio_dump_asfile\"";
        // line 24
        echo ((( !($context["repopulate"] ?? null) && ($context["is_checked_asfile"] ?? null))) ? (" checked") : (""));
        echo ">
            <label for=\"radio_dump_asfile\">
                ";
        // line 26
        echo _gettext("Save output to a file");
        // line 27
        echo "            </label>
            <ul id=\"ul_save_asfile\">
                ";
        // line 29
        if ( !twig_test_empty(($context["save_dir"] ?? null))) {
            // line 30
            echo "                    ";
            echo ($context["options_output_save_dir"] ?? null);
            echo "
                ";
        }
        // line 32
        echo "
                ";
        // line 33
        echo ($context["options_output_format"] ?? null);
        echo "

                ";
        // line 35
        if (($context["is_encoding_supported"] ?? null)) {
            // line 36
            echo "                    ";
            echo ($context["options_output_charset"] ?? null);
            echo "
                ";
        }
        // line 38
        echo "
                ";
        // line 39
        echo ($context["options_output_compression"] ?? null);
        echo "

                ";
        // line 41
        if (((($context["export_type"] ?? null) == "server") || (($context["export_type"] ?? null) == "database"))) {
            // line 42
            echo "                    ";
            echo ($context["options_output_separate_files"] ?? null);
            echo "
                ";
        }
        // line 44
        echo "            </ul>
        </li>

        ";
        // line 47
        echo ($context["options_output_radio"] ?? null);
        echo "
    </ul>

    <label for=\"maxsize\">";
        // line 51
        echo sprintf(_gettext("Skip tables larger than %s MiB"), "</label><input type=\"text\" id=\"maxsize\" name=\"maxsize\" size=\"4\">");
        // line 53
        echo "
</div>
";
    }

    public function getTemplateName()
    {
        return "display/export/options_output.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  144 => 53,  142 => 51,  136 => 47,  131 => 44,  125 => 42,  123 => 41,  118 => 39,  115 => 38,  109 => 36,  107 => 35,  102 => 33,  99 => 32,  93 => 30,  91 => 29,  87 => 27,  85 => 26,  80 => 24,  76 => 21,  69 => 17,  64 => 15,  60 => 12,  58 => 11,  53 => 8,  51 => 7,  46 => 5,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "display/export/options_output.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\display\\export\\options_output.twig");
    }
}
