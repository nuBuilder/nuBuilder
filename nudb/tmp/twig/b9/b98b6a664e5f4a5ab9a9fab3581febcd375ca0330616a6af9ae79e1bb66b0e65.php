<?php

/* table/structure/display_table_stats.twig */
class __TwigTemplate_5d78b4369ab8c9da99d907c3acd8d7a10c0d2eb27d6725a8ae5246a4fc3e1f95 extends Twig_Template
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
        echo "<div id=\"tablestatistics\">
    <fieldset>
        <legend>";
        // line 3
        echo _gettext("Information");
        echo "</legend>
        ";
        // line 4
        if ($this->getAttribute(($context["showtable"] ?? null), "TABLE_COMMENT", array(), "array")) {
            // line 5
            echo "            <p>
                <strong>";
            // line 6
            echo _gettext("Table comments:");
            echo "</strong>
                ";
            // line 7
            echo twig_escape_filter($this->env, $this->getAttribute(($context["showtable"] ?? null), "TABLE_COMMENT", array(), "array"), "html", null, true);
            echo "
            </p>
        ";
        }
        // line 10
        echo "        <a id=\"showusage\"></a>

        ";
        // line 12
        if (( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 13
            echo "            <table id=\"tablespaceusage\" class=\"width100 data\">
                <caption class=\"tblHeaders\">";
            // line 14
            echo _gettext("Space usage");
            echo "</caption>
                <tbody>
                    <tr>
                        <th class=\"name\">";
            // line 17
            echo _gettext("Data");
            echo "</th>
                        <td class=\"value\">";
            // line 18
            echo twig_escape_filter($this->env, ($context["data_size"] ?? null), "html", null, true);
            echo "</td>
                        <td class=\"unit\">";
            // line 19
            echo twig_escape_filter($this->env, ($context["data_unit"] ?? null), "html", null, true);
            echo "</td>
                    </tr>

                ";
            // line 22
            if (array_key_exists("index_size", $context)) {
                // line 23
                echo "                    <tr>
                        <th class=\"name\">";
                // line 24
                echo _gettext("Index");
                echo "</th>
                        <td class=\"value\">";
                // line 25
                echo twig_escape_filter($this->env, ($context["index_size"] ?? null), "html", null, true);
                echo "</td>
                        <td class=\"unit\">";
                // line 26
                echo twig_escape_filter($this->env, ($context["index_unit"] ?? null), "html", null, true);
                echo "</td>
                    </tr>
                ";
            }
            // line 29
            echo "
                ";
            // line 30
            if (array_key_exists("free_size", $context)) {
                // line 31
                echo "                    <tr>
                        <th class=\"name\">";
                // line 32
                echo _gettext("Overhead");
                echo "</th>
                        <td class=\"value\">";
                // line 33
                echo twig_escape_filter($this->env, ($context["free_size"] ?? null), "html", null, true);
                echo "</td>
                        <td class=\"unit\">";
                // line 34
                echo twig_escape_filter($this->env, ($context["free_unit"] ?? null), "html", null, true);
                echo "</td>
                    </tr>
                    <tr>
                        <th class=\"name\">";
                // line 37
                echo _gettext("Effective");
                echo "</th>
                        <td class=\"value\">";
                // line 38
                echo twig_escape_filter($this->env, ($context["effect_size"] ?? null), "html", null, true);
                echo "</td>
                        <td class=\"unit\">";
                // line 39
                echo twig_escape_filter($this->env, ($context["effect_unit"] ?? null), "html", null, true);
                echo "</td>
                    </tr>
                ";
            }
            // line 42
            echo "
                ";
            // line 43
            if ((array_key_exists("tot_size", $context) && (($context["mergetable"] ?? null) == false))) {
                // line 44
                echo "                    <tr>
                        <th class=\"name\">";
                // line 45
                echo _gettext("Total");
                echo "</th>
                        <td class=\"value\">";
                // line 46
                echo twig_escape_filter($this->env, ($context["tot_size"] ?? null), "html", null, true);
                echo "</td>
                        <td class=\"unit\">";
                // line 47
                echo twig_escape_filter($this->env, ($context["tot_unit"] ?? null), "html", null, true);
                echo "</td>
                    </tr>
                ";
            }
            // line 50
            echo "
                ";
            // line 52
            echo "                ";
            if ((array_key_exists("free_size", $context) && ((((            // line 53
($context["tbl_storage_engine"] ?? null) == "MYISAM") || (            // line 54
($context["tbl_storage_engine"] ?? null) == "ARIA")) || (            // line 55
($context["tbl_storage_engine"] ?? null) == "MARIA")) || (            // line 56
($context["tbl_storage_engine"] ?? null) == "BDB")))) {
                // line 57
                echo "                    <tr class=\"tblFooters print_ignore\">
                        <td colspan=\"3\" class=\"center\">
                            <a href=\"sql.php\" data-post=\"";
                // line 59
                echo twig_escape_filter($this->env, ($context["url_query"] ?? null), "html", null, true);
                echo "&amp;pos=0&amp;sql_query=";
                // line 60
                echo twig_escape_filter($this->env, twig_urlencode_filter(("OPTIMIZE TABLE " . PhpMyAdmin\Util::backquote(($context["table"] ?? null)))), "html", null, true);
                echo "\">
                                ";
                // line 61
                echo PhpMyAdmin\Util::getIcon("b_tbloptimize", _gettext("Optimize table"));
                echo "
                            </a>
                        </td>
                    </tr>
                ";
            }
            // line 66
            echo "                </tbody>
            </table>
        ";
        }
        // line 69
        echo "
        ";
        // line 70
        $this->loadTemplate("table/structure/row_stats_table.twig", "table/structure/display_table_stats.twig", 70)->display(array("showtable" =>         // line 71
($context["showtable"] ?? null), "tbl_collation" =>         // line 72
($context["tbl_collation"] ?? null), "is_innodb" =>         // line 73
($context["is_innodb"] ?? null), "mergetable" =>         // line 74
($context["mergetable"] ?? null), "avg_size" => ((        // line 75
array_key_exists("avg_size", $context)) ? (($context["avg_size"] ?? null)) : (null)), "avg_unit" => ((        // line 76
array_key_exists("avg_unit", $context)) ? (($context["avg_unit"] ?? null)) : (null))));
        // line 78
        echo "    </fieldset>
</div>
";
    }

    public function getTemplateName()
    {
        return "table/structure/display_table_stats.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  193 => 78,  191 => 76,  190 => 75,  189 => 74,  188 => 73,  187 => 72,  186 => 71,  185 => 70,  182 => 69,  177 => 66,  169 => 61,  165 => 60,  162 => 59,  158 => 57,  156 => 56,  155 => 55,  154 => 54,  153 => 53,  151 => 52,  148 => 50,  142 => 47,  138 => 46,  134 => 45,  131 => 44,  129 => 43,  126 => 42,  120 => 39,  116 => 38,  112 => 37,  106 => 34,  102 => 33,  98 => 32,  95 => 31,  93 => 30,  90 => 29,  84 => 26,  80 => 25,  76 => 24,  73 => 23,  71 => 22,  65 => 19,  61 => 18,  57 => 17,  51 => 14,  48 => 13,  46 => 12,  42 => 10,  36 => 7,  32 => 6,  29 => 5,  27 => 4,  23 => 3,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "table/structure/display_table_stats.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\display_table_stats.twig");
    }
}
