<?php

/* database/structure/body_for_table_summary.twig */
class __TwigTemplate_40dbcb2b6c6c38d489b74bb2814836ee0d55042225105cd2c76f751a8b8ebffb extends Twig_Template
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
        echo "<tbody id=\"tbl_summary_row\">
<tr>
    <th class=\"print_ignore\"></th>
    <th class=\"tbl_num nowrap\">
        ";
        // line 5
        ob_start();
        // line 6
        echo _ngettext("%s table", "%s tables", abs(($context["num_tables"] ?? null)));
        $context["num_tables_trans"] = ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
        // line 8
        echo "        ";
        echo twig_escape_filter($this->env, sprintf(($context["num_tables_trans"] ?? null), PhpMyAdmin\Util::formatNumber(($context["num_tables"] ?? null), 0)), "html", null, true);
        echo "
    </th>
    ";
        // line 10
        if (($context["server_slave_status"] ?? null)) {
            // line 11
            echo "        <th>";
            echo _gettext("Replication");
            echo "</th>
    ";
        }
        // line 13
        echo "    ";
        $context["sum_colspan"] = ((($context["db_is_system_schema"] ?? null)) ? (4) : (7));
        // line 14
        echo "    ";
        if ((($context["num_favorite_tables"] ?? null) == 0)) {
            // line 15
            echo "        ";
            $context["sum_colspan"] = (($context["sum_colspan"] ?? null) - 1);
            // line 16
            echo "    ";
        }
        // line 17
        echo "    <th colspan=\"";
        echo twig_escape_filter($this->env, ($context["sum_colspan"] ?? null), "html", null, true);
        echo "\" class=\"print_ignore\">";
        echo _gettext("Sum");
        echo "</th>
    ";
        // line 18
        $context["row_count_sum"] = PhpMyAdmin\Util::formatNumber(($context["sum_entries"] ?? null), 0);
        // line 19
        echo "    ";
        // line 20
        echo "    ";
        $context["row_sum_url"] = array();
        // line 21
        echo "    ";
        if (array_key_exists("approx_rows", $context)) {
            // line 22
            echo "        ";
            $context["row_sum_url"] = array("ajax_request" => true, "db" =>             // line 24
($context["db"] ?? null), "real_row_count" => "true", "real_row_count_all" => "true");
            // line 28
            echo "    ";
        }
        // line 29
        echo "    ";
        if (($context["approx_rows"] ?? null)) {
            // line 30
            echo "        ";
            ob_start();
            // line 31
            echo "<a href=\"db_structure.php";
            // line 32
            echo PhpMyAdmin\Url::getCommon(($context["row_sum_url"] ?? null));
            echo "\" class=\"ajax row_count_sum\">~";
            // line 33
            echo twig_escape_filter($this->env, ($context["row_count_sum"] ?? null), "html", null, true);
            // line 34
            echo "</a>";
            $context["cell_text"] = ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
            // line 36
            echo "    ";
        } else {
            // line 37
            echo "        ";
            $context["cell_text"] = ($context["row_count_sum"] ?? null);
            // line 38
            echo "    ";
        }
        // line 39
        echo "    <th class=\"value tbl_rows\">";
        echo twig_escape_filter($this->env, ($context["cell_text"] ?? null), "html", null, true);
        echo "</th>
    ";
        // line 40
        if ( !(($context["properties_num_columns"] ?? null) > 1)) {
            // line 41
            echo "        ";
            // line 42
            echo "        ";
            $context["default_engine"] = $this->getAttribute(($context["dbi"] ?? null), "fetchValue", array(0 => "SELECT @@storage_engine;"), "method");
            // line 43
            echo "        ";
            if (twig_test_empty(($context["default_engine"] ?? null))) {
                // line 44
                echo "            ";
                // line 45
                echo "            ";
                $context["default_engine"] = $this->getAttribute(($context["dbi"] ?? null), "fetchValue", array(0 => "SELECT @@default_storage_engine;"), "method");
                // line 46
                echo "        ";
            }
            // line 47
            echo "        <th class=\"center\">
            <dfn title=\"";
            // line 48
            echo twig_escape_filter($this->env, sprintf(_gettext("%s is the default storage engine on this MySQL server."), ($context["default_engine"] ?? null)), "html", null, true);
            echo "\">
                ";
            // line 49
            echo twig_escape_filter($this->env, ($context["default_engine"] ?? null), "html", null, true);
            echo "
            </dfn>
        </th>
        <th>
            ";
            // line 53
            if ( !twig_test_empty(($context["db_collation"] ?? null))) {
                // line 54
                echo "                <dfn title=\"";
                echo twig_escape_filter($this->env, PhpMyAdmin\Charsets::getCollationDescr(($context["db_collation"] ?? null)), "html", null, true);
                echo " (";
                echo _gettext("Default");
                echo ")\">
                    ";
                // line 55
                echo twig_escape_filter($this->env, ($context["db_collation"] ?? null), "html", null, true);
                echo "
                </dfn>
            ";
            }
            // line 58
            echo "        </th>
    ";
        }
        // line 60
        echo "
    ";
        // line 61
        if (($context["is_show_stats"] ?? null)) {
            // line 62
            echo "        ";
            $context["sum"] = PhpMyAdmin\Util::formatByteDown(($context["sum_size"] ?? null), 3, 1);
            // line 63
            echo "        ";
            $context["sum_formatted"] = $this->getAttribute(($context["sum"] ?? null), 0, array(), "array");
            // line 64
            echo "        ";
            $context["sum_unit"] = $this->getAttribute(($context["sum"] ?? null), 1, array(), "array");
            // line 65
            echo "        <th class=\"value tbl_size\">";
            echo twig_escape_filter($this->env, ($context["sum_formatted"] ?? null), "html", null, true);
            echo " ";
            echo twig_escape_filter($this->env, ($context["sum_unit"] ?? null), "html", null, true);
            echo "</th>

        ";
            // line 67
            $context["overhead"] = PhpMyAdmin\Util::formatByteDown(($context["overhead_size"] ?? null), 3, 1);
            // line 68
            echo "        ";
            $context["overhead_formatted"] = $this->getAttribute(($context["overhead"] ?? null), 0, array(), "array");
            // line 69
            echo "        ";
            $context["overhead_unit"] = $this->getAttribute(($context["overhead"] ?? null), 1, array(), "array");
            // line 70
            echo "        <th class=\"value tbl_overhead\">";
            echo twig_escape_filter($this->env, ($context["overhead_formatted"] ?? null), "html", null, true);
            echo " ";
            echo twig_escape_filter($this->env, ($context["overhead_unit"] ?? null), "html", null, true);
            echo "</th>
    ";
        }
        // line 72
        echo "
    ";
        // line 73
        if (($context["show_charset"] ?? null)) {
            // line 74
            echo "        <th>";
            echo twig_escape_filter($this->env, ($context["db_charset"] ?? null), "html", null, true);
            echo "</th>
    ";
        }
        // line 76
        echo "    ";
        if (($context["show_comment"] ?? null)) {
            // line 77
            echo "        <th></th>
    ";
        }
        // line 79
        echo "    ";
        if (($context["show_creation"] ?? null)) {
            // line 80
            echo "        <th class=\"value tbl_creation\">
            ";
            // line 81
            echo twig_escape_filter($this->env, ((($context["create_time_all"] ?? null)) ? (PhpMyAdmin\Util::localisedDate(strtotime(($context["create_time_all"] ?? null)))) : ("-")), "html", null, true);
            echo "
        </th>
    ";
        }
        // line 84
        echo "    ";
        if (($context["show_last_update"] ?? null)) {
            // line 85
            echo "        <th class=\"value tbl_last_update\">
            ";
            // line 86
            echo twig_escape_filter($this->env, ((($context["update_time_all"] ?? null)) ? (PhpMyAdmin\Util::localisedDate(strtotime(($context["update_time_all"] ?? null)))) : ("-")), "html", null, true);
            echo "
        </th>
    ";
        }
        // line 89
        echo "    ";
        if (($context["show_last_check"] ?? null)) {
            // line 90
            echo "        <th class=\"value tbl_last_check\">
            ";
            // line 91
            echo twig_escape_filter($this->env, ((($context["check_time_all"] ?? null)) ? (PhpMyAdmin\Util::localisedDate(strtotime(($context["check_time_all"] ?? null)))) : ("-")), "html", null, true);
            echo "
        </th>
    ";
        }
        // line 94
        echo "</tr>
</tbody>
";
    }

    public function getTemplateName()
    {
        return "database/structure/body_for_table_summary.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  253 => 94,  247 => 91,  244 => 90,  241 => 89,  235 => 86,  232 => 85,  229 => 84,  223 => 81,  220 => 80,  217 => 79,  213 => 77,  210 => 76,  204 => 74,  202 => 73,  199 => 72,  191 => 70,  188 => 69,  185 => 68,  183 => 67,  175 => 65,  172 => 64,  169 => 63,  166 => 62,  164 => 61,  161 => 60,  157 => 58,  151 => 55,  144 => 54,  142 => 53,  135 => 49,  131 => 48,  128 => 47,  125 => 46,  122 => 45,  120 => 44,  117 => 43,  114 => 42,  112 => 41,  110 => 40,  105 => 39,  102 => 38,  99 => 37,  96 => 36,  93 => 34,  91 => 33,  88 => 32,  86 => 31,  83 => 30,  80 => 29,  77 => 28,  75 => 24,  73 => 22,  70 => 21,  67 => 20,  65 => 19,  63 => 18,  56 => 17,  53 => 16,  50 => 15,  47 => 14,  44 => 13,  38 => 11,  36 => 10,  30 => 8,  27 => 6,  25 => 5,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "database/structure/body_for_table_summary.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\database\\structure\\body_for_table_summary.twig");
    }
}
