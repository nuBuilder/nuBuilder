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

/* table/search/fields_table.twig */
class __TwigTemplate_a064139f9d17076e0b653fb427995324fda685a50f2ead4bffe280ce3fc6d1d1 extends \Twig\Template
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
        echo "<table class=\"data\"";
        echo (((($context["search_type"] ?? null) == "zoom")) ? (" id=\"tableFieldsId\"") : (""));
        echo ">
    <thead>
        <tr>
            ";
        // line 4
        if (($context["geom_column_flag"] ?? null)) {
            // line 5
            echo "                <th>";
            echo _gettext("Function");
            echo "</th>
            ";
        }
        // line 7
        echo "            <th>";
        echo _gettext("Column");
        echo "</th>
            <th>";
        // line 8
        echo _gettext("Type");
        echo "</th>
            <th>";
        // line 9
        echo _gettext("Collation");
        echo "</th>
            <th>";
        // line 10
        echo _gettext("Operator");
        echo "</th>
            <th>";
        // line 11
        echo _gettext("Value");
        echo "</th>
        </tr>
    </thead>
    <tbody>
    ";
        // line 15
        if ((($context["search_type"] ?? null) == "zoom")) {
            // line 16
            echo "        ";
            $this->loadTemplate("table/search/rows_zoom.twig", "table/search/fields_table.twig", 16)->display(twig_to_array(["self" =>             // line 17
($context["self"] ?? null), "column_names" =>             // line 18
($context["column_names"] ?? null), "keys" =>             // line 19
($context["keys"] ?? null), "criteria_column_names" =>             // line 20
($context["criteria_column_names"] ?? null), "criteria_column_types" =>             // line 21
($context["criteria_column_types"] ?? null)]));
            // line 23
            echo "    ";
        } else {
            // line 24
            echo "        ";
            $this->loadTemplate("table/search/rows_normal.twig", "table/search/fields_table.twig", 24)->display(twig_to_array(["self" =>             // line 25
($context["self"] ?? null), "geom_column_flag" =>             // line 26
($context["geom_column_flag"] ?? null), "column_names" =>             // line 27
($context["column_names"] ?? null), "column_types" =>             // line 28
($context["column_types"] ?? null), "column_collations" =>             // line 29
($context["column_collations"] ?? null)]));
            // line 31
            echo "    ";
        }
        // line 32
        echo "    </tbody>
</table>
";
    }

    public function getTemplateName()
    {
        return "table/search/fields_table.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  100 => 32,  97 => 31,  95 => 29,  94 => 28,  93 => 27,  92 => 26,  91 => 25,  89 => 24,  86 => 23,  84 => 21,  83 => 20,  82 => 19,  81 => 18,  80 => 17,  78 => 16,  76 => 15,  69 => 11,  65 => 10,  61 => 9,  57 => 8,  52 => 7,  46 => 5,  44 => 4,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "table/search/fields_table.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\search\\fields_table.twig");
    }
}
