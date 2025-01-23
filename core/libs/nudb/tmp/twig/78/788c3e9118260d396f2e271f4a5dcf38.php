<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* database/structure/body_for_table_summary.twig */
class __TwigTemplate_d9d9b88fe49aca4ee10deda7519bd9de extends Template
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
        yield "<tfoot id=\"tbl_summary_row\">
<tr>
    <th class=\"d-print-none\"></th>
    <th class=\"tbl_num text-nowrap\">
        ";
        // line 5
        $context["num_tables_trans"] = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
yield _ngettext("%s table", "%s tables", abs(            // line 6
($context["num_tables"] ?? null)));
            return; yield '';
        })())) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 8
        yield "        ";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::sprintf(($context["num_tables_trans"] ?? null), PhpMyAdmin\Util::formatNumber(($context["num_tables"] ?? null), 0)), "html", null, true);
        yield "
    </th>
    ";
        // line 10
        if (($context["server_replica_status"] ?? null)) {
            // line 11
            yield "        <th>";
yield _gettext("Replication");
            yield "</th>
    ";
        }
        // line 13
        yield "    ";
        $context["sum_colspan"] = ((($context["db_is_system_schema"] ?? null)) ? (4) : (7));
        // line 14
        yield "    ";
        if ((($context["num_favorite_tables"] ?? null) == 0)) {
            // line 15
            yield "        ";
            $context["sum_colspan"] = (($context["sum_colspan"] ?? null) - 1);
            // line 16
            yield "    ";
        }
        // line 17
        yield "    <th colspan=\"";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["sum_colspan"] ?? null), "html", null, true);
        yield "\" class=\"d-print-none\">";
yield _gettext("Sum");
        yield "</th>
    ";
        // line 18
        $context["row_count_sum"] = PhpMyAdmin\Util::formatNumber(($context["sum_entries"] ?? null), 0);
        // line 19
        yield "    ";
        // line 20
        yield "    ";
        $context["row_sum_url"] = [];
        // line 21
        yield "    ";
        if (array_key_exists("approx_rows", $context)) {
            // line 22
            yield "        ";
            $context["row_sum_url"] = ["ajax_request" => true, "db" =>             // line 24
($context["db"] ?? null), "real_row_count_all" => "true"];
            // line 27
            yield "    ";
        }
        // line 28
        yield "    ";
        if (($context["approx_rows"] ?? null)) {
            // line 29
            yield "        ";
            $context["cell_text"] = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
                // line 30
                yield "<a href=\"";
                yield PhpMyAdmin\Url::getFromRoute("/database/structure/real-row-count", ($context["row_sum_url"] ?? null));
                yield "\" class=\"ajax row_count_sum\">~";
                // line 31
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["row_count_sum"] ?? null), "html", null, true);
                // line 32
                yield "</a>";
                return; yield '';
            })())) ? '' : new Markup($tmp, $this->env->getCharset());
            // line 34
            yield "    ";
        } else {
            // line 35
            yield "        ";
            $context["cell_text"] = ($context["row_count_sum"] ?? null);
            // line 36
            yield "    ";
        }
        // line 37
        yield "    <th class=\"value tbl_rows font-monospace text-end\">";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["cell_text"] ?? null), "html", null, true);
        yield "</th>
    ";
        // line 38
        if ( !(($context["properties_num_columns"] ?? null) > 1)) {
            // line 39
            yield "        ";
            // line 40
            yield "        ";
            $context["default_engine"] = CoreExtension::getAttribute($this->env, $this->source, ($context["dbi"] ?? null), "fetchValue", ["SELECT @@storage_engine;"], "method", false, false, false, 40);
            // line 41
            yield "        ";
            if (Twig\Extension\CoreExtension::testEmpty(($context["default_engine"] ?? null))) {
                // line 42
                yield "            ";
                // line 43
                yield "            ";
                $context["default_engine"] = CoreExtension::getAttribute($this->env, $this->source, ($context["dbi"] ?? null), "fetchValue", ["SELECT @@default_storage_engine;"], "method", false, false, false, 43);
                // line 44
                yield "        ";
            }
            // line 45
            yield "        <th class=\"text-center\">
            <dfn title=\"";
            // line 46
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::sprintf(_gettext("%s is the default storage engine on this MySQL server."), ($context["default_engine"] ?? null)), "html", null, true);
            yield "\">
                ";
            // line 47
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["default_engine"] ?? null), "html", null, true);
            yield "
            </dfn>
        </th>
        <th>
            ";
            // line 51
            if ( !Twig\Extension\CoreExtension::testEmpty(($context["database_collation"] ?? null))) {
                // line 52
                yield "                <dfn title=\"";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, ($context["database_collation"] ?? null), "description", [], "any", false, false, false, 52), "html", null, true);
                yield " (";
yield _gettext("Default");
                yield ")\">
                    ";
                // line 53
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, ($context["database_collation"] ?? null), "name", [], "any", false, false, false, 53), "html", null, true);
                yield "
                </dfn>
            ";
            }
            // line 56
            yield "        </th>
    ";
        }
        // line 58
        yield "
    ";
        // line 59
        if (($context["is_show_stats"] ?? null)) {
            // line 60
            yield "        ";
            $context["sum"] = PhpMyAdmin\Util::formatByteDown(($context["sum_size"] ?? null), 3, 1);
            // line 61
            yield "        ";
            $context["sum_formatted"] = (($__internal_compile_0 = ($context["sum"] ?? null)) && is_array($__internal_compile_0) || $__internal_compile_0 instanceof ArrayAccess ? ($__internal_compile_0[0] ?? null) : null);
            // line 62
            yield "        ";
            $context["sum_unit"] = (($__internal_compile_1 = ($context["sum"] ?? null)) && is_array($__internal_compile_1) || $__internal_compile_1 instanceof ArrayAccess ? ($__internal_compile_1[1] ?? null) : null);
            // line 63
            yield "        <th class=\"value tbl_size font-monospace text-end\">";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["sum_formatted"] ?? null), "html", null, true);
            yield " ";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["sum_unit"] ?? null), "html", null, true);
            yield "</th>

        ";
            // line 65
            $context["overhead"] = PhpMyAdmin\Util::formatByteDown(($context["overhead_size"] ?? null), 3, 1);
            // line 66
            yield "        ";
            $context["overhead_formatted"] = (($__internal_compile_2 = ($context["overhead"] ?? null)) && is_array($__internal_compile_2) || $__internal_compile_2 instanceof ArrayAccess ? ($__internal_compile_2[0] ?? null) : null);
            // line 67
            yield "        ";
            $context["overhead_unit"] = (($__internal_compile_3 = ($context["overhead"] ?? null)) && is_array($__internal_compile_3) || $__internal_compile_3 instanceof ArrayAccess ? ($__internal_compile_3[1] ?? null) : null);
            // line 68
            yield "        <th class=\"value tbl_overhead font-monospace text-end\">";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["overhead_formatted"] ?? null), "html", null, true);
            yield " ";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["overhead_unit"] ?? null), "html", null, true);
            yield "</th>
    ";
        }
        // line 70
        yield "
    ";
        // line 71
        if (($context["show_charset"] ?? null)) {
            // line 72
            yield "        <th>";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["database_charset"] ?? null), "html", null, true);
            yield "</th>
    ";
        }
        // line 74
        yield "    ";
        if (($context["show_comment"] ?? null)) {
            // line 75
            yield "        <th></th>
    ";
        }
        // line 77
        yield "    ";
        if (($context["show_creation"] ?? null)) {
            // line 78
            yield "        <th class=\"value tbl_creation font-monospace text-end\">
            ";
            // line 79
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["create_time_all"] ?? null), "html", null, true);
            yield "
        </th>
    ";
        }
        // line 82
        yield "    ";
        if (($context["show_last_update"] ?? null)) {
            // line 83
            yield "        <th class=\"value tbl_last_update font-monospace text-end\">
            ";
            // line 84
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["update_time_all"] ?? null), "html", null, true);
            yield "
        </th>
    ";
        }
        // line 87
        yield "    ";
        if (($context["show_last_check"] ?? null)) {
            // line 88
            yield "        <th class=\"value tbl_last_check font-monospace text-end\">
            ";
            // line 89
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["check_time_all"] ?? null), "html", null, true);
            yield "
        </th>
    ";
        }
        // line 92
        yield "</tr>
</tfoot>
";
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "database/structure/body_for_table_summary.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable()
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo()
    {
        return array (  273 => 92,  267 => 89,  264 => 88,  261 => 87,  255 => 84,  252 => 83,  249 => 82,  243 => 79,  240 => 78,  237 => 77,  233 => 75,  230 => 74,  224 => 72,  222 => 71,  219 => 70,  211 => 68,  208 => 67,  205 => 66,  203 => 65,  195 => 63,  192 => 62,  189 => 61,  186 => 60,  184 => 59,  181 => 58,  177 => 56,  171 => 53,  164 => 52,  162 => 51,  155 => 47,  151 => 46,  148 => 45,  145 => 44,  142 => 43,  140 => 42,  137 => 41,  134 => 40,  132 => 39,  130 => 38,  125 => 37,  122 => 36,  119 => 35,  116 => 34,  112 => 32,  110 => 31,  106 => 30,  103 => 29,  100 => 28,  97 => 27,  95 => 24,  93 => 22,  90 => 21,  87 => 20,  85 => 19,  83 => 18,  76 => 17,  73 => 16,  70 => 15,  67 => 14,  64 => 13,  58 => 11,  56 => 10,  50 => 8,  46 => 6,  44 => 5,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/body_for_table_summary.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\database\\structure\\body_for_table_summary.twig");
    }
}
