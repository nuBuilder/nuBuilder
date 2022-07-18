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

/* database/structure/check_all_tables.twig */
class __TwigTemplate_cf2dd064b5f41c9a92659a85ef1eb15b extends Template
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
        echo "<div class=\"clearfloat d-print-none\">
    <img class=\"selectallarrow\" src=\"";
        // line 2
        echo twig_escape_filter($this->env, $this->extensions['PhpMyAdmin\Twig\AssetExtension']->getImagePath((("arrow_" . ($context["text_dir"] ?? null)) . ".png")), "html", null, true);
        echo "\" width=\"38\" height=\"22\" alt=\"";
echo _gettext("With selected:");
        echo "\">
    <input type=\"checkbox\" id=\"tablesForm_checkall\" class=\"checkall_box\" title=\"";
echo _gettext("Check all");
        // line 3
        echo "\">
    <label for=\"tablesForm_checkall\">";
echo _gettext("Check all");
        // line 4
        echo "</label>
    ";
        // line 5
        if ((($context["overhead_check"] ?? null) != "")) {
            // line 6
            echo "        / <a href=\"#\" class=\"checkall-filter\" data-checkall-selector=\".tbl-overhead\">";
echo _gettext("Check tables having overhead");
            echo "</a>
    ";
        }
        // line 8
        echo "    <select name=\"submit_mult\" style=\"margin: 0 3em 0 3em;\">
        <option value=\"";
echo _gettext("With selected:");
        // line 9
        echo "\" selected=\"selected\">";
echo _gettext("With selected:");
        echo "</option>
        <option value=\"copy_tbl\">";
echo _gettext("Copy table");
        // line 10
        echo "</option>
        <option value=\"show_create\">";
echo _gettext("Show create");
        // line 11
        echo "</option>
        <option value=\"export\">";
echo _gettext("Export");
        // line 12
        echo "</option>
        ";
        // line 13
        if (( !($context["db_is_system_schema"] ?? null) &&  !($context["disable_multi_table"] ?? null))) {
            // line 14
            echo "            <optgroup label=\"";
echo _gettext("Delete data or table");
            echo "\">
                <option value=\"empty_tbl\">";
echo _gettext("Empty");
            // line 15
            echo "</option>
                <option value=\"drop_tbl\">";
echo _gettext("Drop");
            // line 16
            echo "</option>
            </optgroup>
            <optgroup label=\"";
echo _gettext("Table maintenance");
            // line 18
            echo "\">
                <option value=\"analyze_tbl\">";
echo _gettext("Analyze table");
            // line 19
            echo "</option>
                <option value=\"check_tbl\">";
echo _gettext("Check table");
            // line 20
            echo "</option>
                <option value=\"checksum_tbl\">";
echo _gettext("Checksum table");
            // line 21
            echo "</option>
                <option value=\"optimize_tbl\">";
echo _gettext("Optimize table");
            // line 22
            echo "</option>
                <option value=\"repair_tbl\">";
echo _gettext("Repair table");
            // line 23
            echo "</option>
            </optgroup>
            <optgroup label=\"";
echo _gettext("Prefix");
            // line 25
            echo "\">
                <option value=\"add_prefix_tbl\">";
echo _gettext("Add prefix to table");
            // line 26
            echo "</option>
                <option value=\"replace_prefix_tbl\">";
echo _gettext("Replace table prefix");
            // line 27
            echo "</option>
                <option value=\"copy_tbl_change_prefix\">";
echo _gettext("Copy table with prefix");
            // line 28
            echo "</option>
            </optgroup>
        ";
        }
        // line 31
        echo "        ";
        if ((array_key_exists("central_columns_work", $context) && ($context["central_columns_work"] ?? null))) {
            // line 32
            echo "            <optgroup label=\"";
echo _gettext("Central columns");
            echo "\">
                <option value=\"sync_unique_columns_central_list\">";
echo _gettext("Add columns to central list");
            // line 33
            echo "</option>
                <option value=\"delete_unique_columns_central_list\">";
echo _gettext("Remove columns from central list");
            // line 34
            echo "</option>
                <option value=\"make_consistent_with_central_list\">";
echo _gettext("Make consistent with central list");
            // line 35
            echo "</option>
            </optgroup>
        ";
        }
        // line 38
        echo "    </select>
    ";
        // line 39
        echo twig_join_filter(($context["hidden_fields"] ?? null), "
");
        echo "
</div>

<div class=\"modal fade\" id=\"bulkActionModal\" data-bs-backdrop=\"static\" data-bs-keyboard=\"false\"
     tabindex=\"-1\" aria-labelledby=\"bulkActionLabel\" aria-hidden=\"true\">
  <div class=\"modal-dialog modal-dialog-centered\">
    <div class=\"modal-content\">
      <div class=\"modal-header\">
        <h5 class=\"modal-title\" id=\"bulkActionLabel\"></h5>
        <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"";
echo _gettext("Cancel");
        // line 48
        echo "\"></button>
      </div>
      <div class=\"modal-body\"></div>
      <div class=\"modal-footer\">
        <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">";
echo _gettext("Cancel");
        // line 52
        echo "</button>
        <button type=\"button\" class=\"btn btn-primary\" id=\"bulkActionContinue\">";
echo _gettext("Continue");
        // line 53
        echo "</button>
      </div>
    </div>
  </div>
</div>

";
        // line 59
        if ((array_key_exists("central_columns_work", $context) && ($context["central_columns_work"] ?? null))) {
            // line 60
            echo "  <div class=\"modal fade\" id=\"makeConsistentWithCentralListModal\" data-bs-backdrop=\"static\" data-bs-keyboard=\"false\"
       tabindex=\"-1\" aria-labelledby=\"makeConsistentWithCentralListModalLabel\" aria-hidden=\"true\">
    <div class=\"modal-dialog modal-dialog-centered\">
      <div class=\"modal-content\">
        <div class=\"modal-header\">
          <h5 class=\"modal-title\" id=\"makeConsistentWithCentralListModalLabel\">";
echo _gettext("Are you sure?");
            // line 65
            echo "</h5>
          <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"";
echo _gettext("Cancel");
            // line 66
            echo "\"></button>
        </div>
        <div class=\"modal-body\">
          ";
            // line 69
            echo PhpMyAdmin\Sanitize::sanitizeMessage(_gettext("This action may change some of the columns definition.[br]Are you sure you want to continue?"));
            echo "
        </div>
        <div class=\"modal-footer\">
          <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">";
echo _gettext("Cancel");
            // line 72
            echo "</button>
          <button type=\"button\" class=\"btn btn-primary\" id=\"makeConsistentWithCentralListContinue\">";
echo _gettext("Continue");
            // line 73
            echo "</button>
        </div>
      </div>
    </div>
  </div>
";
        }
    }

    public function getTemplateName()
    {
        return "database/structure/check_all_tables.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  230 => 73,  226 => 72,  219 => 69,  214 => 66,  210 => 65,  202 => 60,  200 => 59,  192 => 53,  188 => 52,  181 => 48,  167 => 39,  164 => 38,  159 => 35,  155 => 34,  151 => 33,  145 => 32,  142 => 31,  137 => 28,  133 => 27,  129 => 26,  125 => 25,  120 => 23,  116 => 22,  112 => 21,  108 => 20,  104 => 19,  100 => 18,  95 => 16,  91 => 15,  85 => 14,  83 => 13,  80 => 12,  76 => 11,  72 => 10,  66 => 9,  62 => 8,  56 => 6,  54 => 5,  51 => 4,  47 => 3,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/check_all_tables.twig", "C:\\xampp\\htdocs\\nubuilder4\\core\\libs\\nudb\\templates\\database\\structure\\check_all_tables.twig");
    }
}
