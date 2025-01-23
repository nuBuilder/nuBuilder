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

/* database/structure/check_all_tables.twig */
class __TwigTemplate_7d0074082d58975989811ca2432435e6 extends Template
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
        yield "<div class=\"clearfloat d-print-none\">
    <img class=\"selectallarrow\" src=\"";
        // line 2
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['PhpMyAdmin\Twig\AssetExtension']->getImagePath((("arrow_" . ($context["text_dir"] ?? null)) . ".png")), "html", null, true);
        yield "\" width=\"38\" height=\"22\" alt=\"";
yield _gettext("With selected:");
        yield "\">
    <input type=\"checkbox\" id=\"tablesForm_checkall\" class=\"checkall_box\" title=\"";
yield _gettext("Check all");
        // line 3
        yield "\">
    <label for=\"tablesForm_checkall\">";
yield _gettext("Check all");
        // line 4
        yield "</label>
    ";
        // line 5
        if ((($context["overhead_check"] ?? null) != "")) {
            // line 6
            yield "        / <a href=\"#\" class=\"checkall-filter\" data-checkall-selector=\".tbl-overhead\">";
yield _gettext("Check tables having overhead");
            yield "</a>
    ";
        }
        // line 8
        yield "    <select name=\"submit_mult\" style=\"margin: 0 3em 0 3em;\">
        <option value=\"";
yield _gettext("With selected:");
        // line 9
        yield "\" selected=\"selected\">";
yield _gettext("With selected:");
        yield "</option>
        <option value=\"copy_tbl\">";
yield _gettext("Copy table");
        // line 10
        yield "</option>
        <option value=\"show_create\">";
yield _gettext("Show create");
        // line 11
        yield "</option>
        <option value=\"export\">";
yield _gettext("Export");
        // line 12
        yield "</option>
        ";
        // line 13
        if (( !($context["db_is_system_schema"] ?? null) &&  !($context["disable_multi_table"] ?? null))) {
            // line 14
            yield "            <optgroup label=\"";
yield _gettext("Delete data or table");
            yield "\">
                <option value=\"empty_tbl\">";
yield _gettext("Empty");
            // line 15
            yield "</option>
                <option value=\"drop_tbl\">";
yield _gettext("Drop");
            // line 16
            yield "</option>
            </optgroup>
            <optgroup label=\"";
yield _gettext("Table maintenance");
            // line 18
            yield "\">
                <option value=\"analyze_tbl\">";
yield _gettext("Analyze table");
            // line 19
            yield "</option>
                <option value=\"check_tbl\">";
yield _gettext("Check table");
            // line 20
            yield "</option>
                <option value=\"checksum_tbl\">";
yield _gettext("Checksum table");
            // line 21
            yield "</option>
                <option value=\"optimize_tbl\">";
yield _gettext("Optimize table");
            // line 22
            yield "</option>
                <option value=\"repair_tbl\">";
yield _gettext("Repair table");
            // line 23
            yield "</option>
            </optgroup>
            <optgroup label=\"";
yield _gettext("Prefix");
            // line 25
            yield "\">
                <option value=\"add_prefix_tbl\">";
yield _gettext("Add prefix to table");
            // line 26
            yield "</option>
                <option value=\"replace_prefix_tbl\">";
yield _gettext("Replace table prefix");
            // line 27
            yield "</option>
                <option value=\"copy_tbl_change_prefix\">";
yield _gettext("Copy table with prefix");
            // line 28
            yield "</option>
            </optgroup>
        ";
        }
        // line 31
        yield "        ";
        if ((array_key_exists("central_columns_work", $context) && ($context["central_columns_work"] ?? null))) {
            // line 32
            yield "            <optgroup label=\"";
yield _gettext("Central columns");
            yield "\">
                <option value=\"sync_unique_columns_central_list\">";
yield _gettext("Add columns to central list");
            // line 33
            yield "</option>
                <option value=\"delete_unique_columns_central_list\">";
yield _gettext("Remove columns from central list");
            // line 34
            yield "</option>
                <option value=\"make_consistent_with_central_list\">";
yield _gettext("Make consistent with central list");
            // line 35
            yield "</option>
            </optgroup>
        ";
        }
        // line 38
        yield "    </select>
    ";
        // line 39
        yield Twig\Extension\CoreExtension::join(($context["hidden_fields"] ?? null), "
");
        yield "
</div>

";
        // line 42
        if ((array_key_exists("central_columns_work", $context) && ($context["central_columns_work"] ?? null))) {
            // line 43
            yield "  <div class=\"modal fade\" id=\"makeConsistentWithCentralListModal\" data-bs-backdrop=\"static\" data-bs-keyboard=\"false\"
       tabindex=\"-1\" aria-labelledby=\"makeConsistentWithCentralListModalLabel\" aria-hidden=\"true\">
    <div class=\"modal-dialog modal-dialog-centered\">
      <div class=\"modal-content\">
        <div class=\"modal-header\">
          <h5 class=\"modal-title\" id=\"makeConsistentWithCentralListModalLabel\">";
yield _gettext("Are you sure?");
            // line 48
            yield "</h5>
          <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"";
yield _gettext("Cancel");
            // line 49
            yield "\"></button>
        </div>
        <div class=\"modal-body\">
          ";
            // line 52
            yield PhpMyAdmin\Sanitize::sanitizeMessage(_gettext("This action may change some of the columns definition.[br]Are you sure you want to continue?"));
            yield "
        </div>
        <div class=\"modal-footer\">
          <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">";
yield _gettext("Cancel");
            // line 55
            yield "</button>
          <button type=\"button\" class=\"btn btn-primary\" id=\"makeConsistentWithCentralListContinue\">";
yield _gettext("Continue");
            // line 56
            yield "</button>
        </div>
      </div>
    </div>
  </div>
";
        }
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "database/structure/check_all_tables.twig";
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
        return array (  205 => 56,  201 => 55,  194 => 52,  189 => 49,  185 => 48,  177 => 43,  175 => 42,  168 => 39,  165 => 38,  160 => 35,  156 => 34,  152 => 33,  146 => 32,  143 => 31,  138 => 28,  134 => 27,  130 => 26,  126 => 25,  121 => 23,  117 => 22,  113 => 21,  109 => 20,  105 => 19,  101 => 18,  96 => 16,  92 => 15,  86 => 14,  84 => 13,  81 => 12,  77 => 11,  73 => 10,  67 => 9,  63 => 8,  57 => 6,  55 => 5,  52 => 4,  48 => 3,  41 => 2,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/check_all_tables.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\database\\structure\\check_all_tables.twig");
    }
}
