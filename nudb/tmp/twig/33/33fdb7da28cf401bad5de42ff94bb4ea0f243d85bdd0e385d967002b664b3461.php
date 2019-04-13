<?php

/* table/structure/row_stats_table.twig */
class __TwigTemplate_1117a764a19e7fd4a96ad90d3b437e7423ce465bd3128a09a1f17248c3048842 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<table id=\"tablerowstats\" class=\"width100 data\">
<caption class=\"tblHeaders\">";
        // line 2
        echo _gettext("Row statistics");
        echo "</caption>
<tbody>
    ";
        // line 4
        if ($this->getAttribute(($context["showtable"] ?? null), "Row_format", array(), "array", true, true)) {
            // line 5
            echo "        <tr>
        <th class=\"name\">";
            // line 6
            echo _gettext("Format");
            echo "</th>
        ";
            // line 7
            if (($this->getAttribute(($context["showtable"] ?? null), "Row_format", array(), "array") == "Fixed")) {
                // line 8
                echo "            <td class=\"value\">";
                echo _gettext("static");
                echo "</td>
        ";
            } elseif (($this->getAttribute(            // line 9
($context["showtable"] ?? null), "Row_format", array(), "array") == "Dynamic")) {
                // line 10
                echo "            <td class=\"value\">";
                echo _gettext("dynamic");
                echo "</td>
        ";
            } else {
                // line 12
                echo "            <td class=\"value\">";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["showtable"] ?? null), "Row_format", array(), "array"), "html", null, true);
                echo "</td>
        ";
            }
            // line 14
            echo "        </tr>
    ";
        }
        // line 16
        echo "
    ";
        // line 17
        if ( !twig_test_empty($this->getAttribute(($context["showtable"] ?? null), "Create_options", array(), "array"))) {
            // line 18
            echo "        <tr>
        <th class=\"name\">";
            // line 19
            echo _gettext("Options");
            echo "</th>
        ";
            // line 20
            if (($this->getAttribute(($context["showtable"] ?? null), "Create_options", array(), "array") == "partitioned")) {
                // line 21
                echo "            <td class=\"value\">";
                echo _gettext("partitioned");
                echo "</td>
        ";
            } else {
                // line 23
                echo "            <td class=\"value\">";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["showtable"] ?? null), "Create_options", array(), "array"), "html", null, true);
                echo "</td>
        ";
            }
            // line 25
            echo "        </tr>
    ";
        }
        // line 27
        echo "
    ";
        // line 28
        if ( !twig_test_empty(($context["tbl_collation"] ?? null))) {
            // line 29
            echo "        <tr>
        <th class=\"name\">";
            // line 30
            echo _gettext("Collation");
            echo "</th>
        <td class=\"value\">
            <dfn title=\"";
            // line 32
            echo twig_escape_filter($this->env, PhpMyAdmin\Charsets::getCollationDescr(($context["tbl_collation"] ?? null)), "html", null, true);
            echo "\">
                ";
            // line 33
            echo twig_escape_filter($this->env, ($context["tbl_collation"] ?? null), "html", null, true);
            echo "
            </dfn>
        </td>
        </tr>
    ";
        }
        // line 38
        echo "
    ";
        // line 39
        if (( !($context["is_innodb"] ?? null) && $this->getAttribute(($context["showtable"] ?? null), "Rows", array(), "array", true, true))) {
            // line 40
            echo "        <tr>
        <th class=\"name\">";
            // line 41
            echo _gettext("Rows");
            echo "</th>
        <td class=\"value\">";
            // line 42
            echo twig_escape_filter($this->env, PhpMyAdmin\Util::formatNumber($this->getAttribute(($context["showtable"] ?? null), "Rows", array(), "array"), 0), "html", null, true);
            echo "</td>
        </tr>
    ";
        }
        // line 45
        echo "
    ";
        // line 46
        if ((( !($context["is_innodb"] ?? null) && $this->getAttribute(        // line 47
($context["showtable"] ?? null), "Avg_row_length", array(), "array", true, true)) && ($this->getAttribute(        // line 48
($context["showtable"] ?? null), "Avg_row_length", array(), "array") > 0))) {
            // line 49
            echo "        <tr>
        <th class=\"name\">";
            // line 50
            echo _gettext("Row length");
            echo "</th>
        ";
            // line 51
            $context["avg_row_length"] = PhpMyAdmin\Util::formatByteDown($this->getAttribute(($context["showtable"] ?? null), "Avg_row_length", array(), "array"), 6, 1);
            // line 52
            echo "        <td class=\"value\">";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["avg_row_length"] ?? null), 0, array(), "array"), "html", null, true);
            echo " ";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["avg_row_length"] ?? null), 1, array(), "array"), "html", null, true);
            echo "</td>
        </tr>
    ";
        }
        // line 55
        echo "
    ";
        // line 56
        if ((((( !($context["is_innodb"] ?? null) && $this->getAttribute(        // line 57
($context["showtable"] ?? null), "Data_length", array(), "array", true, true)) && $this->getAttribute(        // line 58
($context["showtable"] ?? null), "Rows", array(), "array", true, true)) && ($this->getAttribute(        // line 59
($context["showtable"] ?? null), "Rows", array(), "array") > 0)) && (        // line 60
($context["mergetable"] ?? null) == false))) {
            // line 61
            echo "        <tr>
        <th class=\"name\">";
            // line 62
            echo _gettext("Row size");
            echo "</th>
        <td class=\"value\">";
            // line 63
            echo twig_escape_filter($this->env, ($context["avg_size"] ?? null), "html", null, true);
            echo " ";
            echo twig_escape_filter($this->env, ($context["avg_unit"] ?? null), "html", null, true);
            echo "</td>
        </tr>
    ";
        }
        // line 66
        echo "
    ";
        // line 67
        if ($this->getAttribute(($context["showtable"] ?? null), "Auto_increment", array(), "array", true, true)) {
            // line 68
            echo "        <tr>
        <th class=\"name\">";
            // line 69
            echo _gettext("Next autoindex");
            echo "</th>
        <td class=\"value\">";
            // line 70
            echo twig_escape_filter($this->env, PhpMyAdmin\Util::formatNumber($this->getAttribute(($context["showtable"] ?? null), "Auto_increment", array(), "array"), 0), "html", null, true);
            echo "</td>
        </tr>
    ";
        }
        // line 73
        echo "
    ";
        // line 74
        if ($this->getAttribute(($context["showtable"] ?? null), "Create_time", array(), "array", true, true)) {
            // line 75
            echo "        <tr>
        <th class=\"name\">";
            // line 76
            echo _gettext("Creation");
            echo "</th>
        <td class=\"value\">";
            // line 77
            echo twig_escape_filter($this->env, PhpMyAdmin\Util::localisedDate(twig_date_format_filter($this->env, $this->getAttribute(($context["showtable"] ?? null), "Create_time", array(), "array"), "U")), "html", null, true);
            echo "</td>
        </tr>
    ";
        }
        // line 80
        echo "
    ";
        // line 81
        if ($this->getAttribute(($context["showtable"] ?? null), "Update_time", array(), "array", true, true)) {
            // line 82
            echo "        <tr>
        <th class=\"name\">";
            // line 83
            echo _gettext("Last update");
            echo "</th>
        <td class=\"value\">";
            // line 84
            echo twig_escape_filter($this->env, PhpMyAdmin\Util::localisedDate(twig_date_format_filter($this->env, $this->getAttribute(($context["showtable"] ?? null), "Update_time", array(), "array"), "U")), "html", null, true);
            echo "</td>
        </tr>
    ";
        }
        // line 87
        echo "
    ";
        // line 88
        if ($this->getAttribute(($context["showtable"] ?? null), "Check_time", array(), "array", true, true)) {
            // line 89
            echo "        <tr>
        <th class=\"name\">";
            // line 90
            echo _gettext("Last check");
            echo "</th>
        <td class=\"value\">";
            // line 91
            echo twig_escape_filter($this->env, PhpMyAdmin\Util::localisedDate(twig_date_format_filter($this->env, $this->getAttribute(($context["showtable"] ?? null), "Check_time", array(), "array"), "U")), "html", null, true);
            echo "</td>
        </tr>
    ";
        }
        // line 94
        echo "</tbody>
</table>
";
    }

    public function getTemplateName()
    {
        return "table/structure/row_stats_table.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  255 => 94,  249 => 91,  245 => 90,  242 => 89,  240 => 88,  237 => 87,  231 => 84,  227 => 83,  224 => 82,  222 => 81,  219 => 80,  213 => 77,  209 => 76,  206 => 75,  204 => 74,  201 => 73,  195 => 70,  191 => 69,  188 => 68,  186 => 67,  183 => 66,  175 => 63,  171 => 62,  168 => 61,  166 => 60,  165 => 59,  164 => 58,  163 => 57,  162 => 56,  159 => 55,  150 => 52,  148 => 51,  144 => 50,  141 => 49,  139 => 48,  138 => 47,  137 => 46,  134 => 45,  128 => 42,  124 => 41,  121 => 40,  119 => 39,  116 => 38,  108 => 33,  104 => 32,  99 => 30,  96 => 29,  94 => 28,  91 => 27,  87 => 25,  81 => 23,  75 => 21,  73 => 20,  69 => 19,  66 => 18,  64 => 17,  61 => 16,  57 => 14,  51 => 12,  45 => 10,  43 => 9,  38 => 8,  36 => 7,  32 => 6,  29 => 5,  27 => 4,  22 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "table/structure/row_stats_table.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\row_stats_table.twig");
    }
}
