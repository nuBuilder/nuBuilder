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

/* database/structure/body_for_table_summary.twig */
class __TwigTemplate_78e4d4834eaf22cfdd70f09f70b9a202357c4edb0aa4295cd022ebfc83a76a21 extends \Twig\Template
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
        echo "<tbody id=\"tbl_summary_row\">
<tr>
    <th class=\"print_ignore\"></th>
    <th class=\"tbl_num nowrap\">
        ";
        // line 5
        ob_start(function () { return ''; });
        // line 6
        echo _ngettext("%s table", "%s tables", abs(($context["num_tables"] ?? null)));
        $context["num_tables_trans"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
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
        $context["row_sum_url"] = [];
        // line 21
        echo "    ";
        if ((isset($context["approx_rows"]) || array_key_exists("approx_rows", $context))) {
            // line 22
            echo "        ";
            $context["row_sum_url"] = ["ajax_request" => true, "db" =>             // line 24
($context["db"] ?? null), "real_row_count" => "true", "real_row_count_all" => "true"];
            // line 28
            echo "    ";
        }
        // line 29
        echo "    ";
        if (($context["approx_rows"] ?? null)) {
            // line 30
            echo "        ";
            ob_start(function () { return ''; });
            // line 31
            echo "<a href=\"db_structure.php";
            // line 32
            echo PhpMyAdmin\Url::getCommon(($context["row_sum_url"] ?? null));
            echo "\" class=\"ajax row_count_sum\">~";
            // line 33
            echo twig_escape_filter($this->env, ($context["row_count_sum"] ?? null), "html", null, true);
            // line 34
            echo "</a>";
            $context["cell_text"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
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
            $context["default_engine"] = twig_get_attribute($this->env, $this->source, ($context["dbi"] ?? null), "fetchValue", [0 => "SELECT @@storage_engine;"], "method", false, false, false, 42);
            // line 43
            echo "        ";
            if (twig_test_empty(($context["default_engine"] ?? null))) {
                // line 44
                echo "            ";
                // line 45
                echo "            ";
                $context["default_engine"] = twig_get_attribute($this->env, $this->source, ($context["dbi"] ?? null), "fetchValue", [0 => "SELECT @@default_storage_engine;"], "method", false, false, false, 45);
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
            if ( !twig_test_empty(($context["database_collation"] ?? null))) {
                // line 54
                echo "                <dfn title=\"";
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, ($context["database_collation"] ?? null), "description", [], "any", false, false, false, 54), "html", null, true);
                echo " (";
                echo _gettext("Default");
                echo ")\">
                    ";
                // line 55
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, ($context["database_collation"] ?? null), "name", [], "any", false, false, false, 55), "html", null, true);
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
            $context["sum_formatted"] = (($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = ($context["sum"] ?? null)) && is_array($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4) || $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 instanceof ArrayAccess ? ($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4[0] ?? null) : null);
            // line 64
            echo "        ";
            $context["sum_unit"] = (($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 = ($context["sum"] ?? null)) && is_array($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144) || $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 instanceof ArrayAccess ? ($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144[1] ?? null) : null);
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
            $context["overhead_formatted"] = (($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b = ($context["overhead"] ?? null)) && is_array($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b) || $__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b instanceof ArrayAccess ? ($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b[0] ?? null) : null);
            // line 69
            echo "        ";
            $context["overhead_unit"] = (($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 = ($context["overhead"] ?? null)) && is_array($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002) || $__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 instanceof ArrayAccess ? ($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002[1] ?? null) : null);
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
            echo twig_escape_filter($this->env, ($context["database_charset"] ?? null), "html", null, true);
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
            echo twig_escape_filter($this->env, ($context["create_time_all"] ?? null), "html", null, true);
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
            echo twig_escape_filter($this->env, ($context["update_time_all"] ?? null), "html", null, true);
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
            echo twig_escape_filter($this->env, ($context["check_time_all"] ?? null), "html", null, true);
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
        return array (  271 => 94,  265 => 91,  262 => 90,  259 => 89,  253 => 86,  250 => 85,  247 => 84,  241 => 81,  238 => 80,  235 => 79,  231 => 77,  228 => 76,  222 => 74,  220 => 73,  217 => 72,  209 => 70,  206 => 69,  203 => 68,  201 => 67,  193 => 65,  190 => 64,  187 => 63,  184 => 62,  182 => 61,  179 => 60,  175 => 58,  169 => 55,  162 => 54,  160 => 53,  153 => 49,  149 => 48,  146 => 47,  143 => 46,  140 => 45,  138 => 44,  135 => 43,  132 => 42,  130 => 41,  128 => 40,  123 => 39,  120 => 38,  117 => 37,  114 => 36,  111 => 34,  109 => 33,  106 => 32,  104 => 31,  101 => 30,  98 => 29,  95 => 28,  93 => 24,  91 => 22,  88 => 21,  85 => 20,  83 => 19,  81 => 18,  74 => 17,  71 => 16,  68 => 15,  65 => 14,  62 => 13,  56 => 11,  54 => 10,  48 => 8,  45 => 6,  43 => 5,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/body_for_table_summary.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\database\\structure\\body_for_table_summary.twig");
    }
}
