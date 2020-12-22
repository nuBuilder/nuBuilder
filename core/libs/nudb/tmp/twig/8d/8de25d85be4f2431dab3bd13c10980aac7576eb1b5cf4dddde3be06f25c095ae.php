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

/* display/results/options_block.twig */
class __TwigTemplate_c94c1f980187a28b4632fe7cb983f8d9b8018f3f67069a2351d0478e9425ed8e extends \Twig\Template
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
        echo "<form method=\"post\" action=\"sql.php\" name=\"displayOptionsForm\" class=\"ajax print_ignore\">
    ";
        // line 2
        echo PhpMyAdmin\Url::getHiddenInputs(["db" =>         // line 3
($context["db"] ?? null), "table" =>         // line 4
($context["table"] ?? null), "sql_query" =>         // line 5
($context["sql_query"] ?? null), "goto" =>         // line 6
($context["goto"] ?? null), "display_options_form" => 1]);
        // line 8
        echo "

    ";
        // line 10
        $this->loadTemplate("div_for_slider_effect.twig", "display/results/options_block.twig", 10)->display(twig_to_array(["id" => "", "message" => _gettext("Options"), "initial_sliders_state" =>         // line 13
($context["default_sliders_state"] ?? null)]));
        // line 15
        echo "        <fieldset>
            <div class=\"formelement\">
                ";
        // line 18
        echo "                ";
        echo PhpMyAdmin\Util::getRadioFields("pftext", ["P" => _gettext("Partial texts"), "F" => _gettext("Full texts")],         // line 24
($context["pftext"] ?? null), true, true, "", ("pftext_" .         // line 28
($context["unique_id"] ?? null)));
        // line 29
        echo "
            </div>

            ";
        // line 32
        if ((($context["relwork"] ?? null) && ($context["displaywork"] ?? null))) {
            // line 33
            echo "                <div class=\"formelement\">
                    ";
            // line 34
            echo PhpMyAdmin\Util::getRadioFields("relational_display", ["K" => _gettext("Relational key"), "D" => _gettext("Display column for relationships")],             // line 40
($context["relational_display"] ?? null), true, true, "", ("relational_display_" .             // line 44
($context["unique_id"] ?? null)));
            // line 45
            echo "
                </div>
            ";
        }
        // line 48
        echo "
            <div class=\"formelement\">
                ";
        // line 50
        $this->loadTemplate("checkbox.twig", "display/results/options_block.twig", 50)->display(twig_to_array(["html_field_name" => "display_binary", "label" => _gettext("Show binary contents"), "checked" =>  !twig_test_empty(        // line 53
($context["display_binary"] ?? null)), "onclick" => false, "html_field_id" => ("display_binary_" .         // line 55
($context["unique_id"] ?? null))]));
        // line 57
        echo "                ";
        $this->loadTemplate("checkbox.twig", "display/results/options_block.twig", 57)->display(twig_to_array(["html_field_name" => "display_blob", "label" => _gettext("Show BLOB contents"), "checked" =>  !twig_test_empty(        // line 60
($context["display_blob"] ?? null)), "onclick" => false, "html_field_id" => ("display_blob_" .         // line 62
($context["unique_id"] ?? null))]));
        // line 64
        echo "            </div>

            ";
        // line 70
        echo "            <div class=\"formelement\">
                ";
        // line 71
        $this->loadTemplate("checkbox.twig", "display/results/options_block.twig", 71)->display(twig_to_array(["html_field_name" => "hide_transformation", "label" => _gettext("Hide browser transformation"), "checked" =>  !twig_test_empty(        // line 74
($context["hide_transformation"] ?? null)), "onclick" => false, "html_field_id" => ("hide_transformation_" .         // line 76
($context["unique_id"] ?? null))]));
        // line 78
        echo "            </div>


            ";
        // line 81
        if (($context["possible_as_geometry"] ?? null)) {
            // line 82
            echo "                <div class=\"formelement\">
                    ";
            // line 83
            echo PhpMyAdmin\Util::getRadioFields("geoOption", ["GEOM" => _gettext("Geometry"), "WKT" => _gettext("Well Known Text"), "WKB" => _gettext("Well Known Binary")],             // line 90
($context["geo_option"] ?? null), true, true, "", ("geoOption_" .             // line 94
($context["unique_id"] ?? null)));
            // line 95
            echo "
                </div>
            ";
        } else {
            // line 98
            echo "                <div class=\"formelement\">
                    ";
            // line 99
            echo twig_escape_filter($this->env, ($context["possible_as_geometry"] ?? null), "html", null, true);
            echo "
                    ";
            // line 100
            echo PhpMyAdmin\Util::getRadioFields("geoOption", ["WKT" => _gettext("Well Known Text"), "WKB" => _gettext("Well Known Binary")],             // line 106
($context["geo_option"] ?? null), true, true, "", ("geoOption_" .             // line 110
($context["unique_id"] ?? null)));
            // line 111
            echo "
                </div>
            ";
        }
        // line 114
        echo "            <div class=\"clearfloat\"></div>
        </fieldset>

        <fieldset class=\"tblFooters\">
            <input class=\"btn btn-primary\" type=\"submit\" value=\"";
        // line 118
        echo _gettext("Go");
        echo "\">
        </fieldset>
    </div>";
        // line 121
        echo "</form>
";
    }

    public function getTemplateName()
    {
        return "display/results/options_block.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  151 => 121,  146 => 118,  140 => 114,  135 => 111,  133 => 110,  132 => 106,  131 => 100,  127 => 99,  124 => 98,  119 => 95,  117 => 94,  116 => 90,  115 => 83,  112 => 82,  110 => 81,  105 => 78,  103 => 76,  102 => 74,  101 => 71,  98 => 70,  94 => 64,  92 => 62,  91 => 60,  89 => 57,  87 => 55,  86 => 53,  85 => 50,  81 => 48,  76 => 45,  74 => 44,  73 => 40,  72 => 34,  69 => 33,  67 => 32,  62 => 29,  60 => 28,  59 => 24,  57 => 18,  53 => 15,  51 => 13,  50 => 10,  46 => 8,  44 => 6,  43 => 5,  42 => 4,  41 => 3,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "display/results/options_block.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\display\\results\\options_block.twig");
    }
}
