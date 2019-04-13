<?php

/* database/structure/check_all_tables.twig */
class __TwigTemplate_cc0ea717fabe224dde61b060dad04881da370c56b8251d1e276cb4e1ca47989b extends Twig_Template
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
        echo "<div class=\"clearfloat print_ignore\">
    <img class=\"selectallarrow\" src=\"";
        // line 2
        echo twig_escape_filter($this->env, ($context["pma_theme_image"] ?? null), "html", null, true);
        echo "arrow_";
        echo twig_escape_filter($this->env, ($context["text_dir"] ?? null), "html", null, true);
        echo ".png\" width=\"38\" height=\"22\" alt=\"";
        echo _gettext("With selected:");
        echo "\" />
    <input type=\"checkbox\" id=\"tablesForm_checkall\" class=\"checkall_box\" title=\"";
        // line 3
        echo _gettext("Check all");
        echo "\" />
    <label for=\"tablesForm_checkall\">";
        // line 4
        echo _gettext("Check all");
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
        // line 9
        echo _gettext("With selected:");
        echo "\" selected=\"selected\">";
        echo _gettext("With selected:");
        echo "</option>
        <option value=\"copy_tbl\">";
        // line 10
        echo _gettext("Copy table");
        echo "</option>
        <option value=\"show_create\">";
        // line 11
        echo _gettext("Show create");
        echo "</option>
        <option value=\"export\">";
        // line 12
        echo _gettext("Export");
        echo "</option>
        ";
        // line 13
        if (( !($context["db_is_system_schema"] ?? null) &&  !($context["disable_multi_table"] ?? null))) {
            // line 14
            echo "            <optgroup label=\"";
            echo _gettext("Delete data or table");
            echo "\">
                <option value=\"empty_tbl\">";
            // line 15
            echo _gettext("Empty");
            echo "</option>
                <option value=\"drop_tbl\">";
            // line 16
            echo _gettext("Drop");
            echo "</option>
            </optgroup>
            <optgroup label=\"";
            // line 18
            echo _gettext("Table maintenance");
            echo "\">
                <option value=\"analyze_tbl\">";
            // line 19
            echo _gettext("Analyze table");
            echo "</option>
                <option value=\"check_tbl\">";
            // line 20
            echo _gettext("Check table");
            echo "</option>
                <option value=\"checksum_tbl\">";
            // line 21
            echo _gettext("Checksum table");
            echo "</option>
                <option value=\"optimize_tbl\">";
            // line 22
            echo _gettext("Optimize table");
            echo "</option>
                <option value=\"repair_tbl\">";
            // line 23
            echo _gettext("Repair table");
            echo "</option>
            </optgroup>
            <optgroup label=\"";
            // line 25
            echo _gettext("Prefix");
            echo "\">
                <option value=\"add_prefix_tbl\">";
            // line 26
            echo _gettext("Add prefix to table");
            echo "</option>
                <option value=\"replace_prefix_tbl\">";
            // line 27
            echo _gettext("Replace table prefix");
            echo "</option>
                <option value=\"copy_tbl_change_prefix\">";
            // line 28
            echo _gettext("Copy table with prefix");
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
            // line 33
            echo _gettext("Add columns to central list");
            echo "</option>
                <option value=\"delete_unique_columns_central_list\">";
            // line 34
            echo _gettext("Remove columns from central list");
            echo "</option>
                <option value=\"make_consistent_with_central_list\">";
            // line 35
            echo _gettext("Make consistent with central list");
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
";
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
        return array (  151 => 39,  148 => 38,  142 => 35,  138 => 34,  134 => 33,  129 => 32,  126 => 31,  120 => 28,  116 => 27,  112 => 26,  108 => 25,  103 => 23,  99 => 22,  95 => 21,  91 => 20,  87 => 19,  83 => 18,  78 => 16,  74 => 15,  69 => 14,  67 => 13,  63 => 12,  59 => 11,  55 => 10,  49 => 9,  46 => 8,  40 => 6,  38 => 5,  34 => 4,  30 => 3,  22 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "database/structure/check_all_tables.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\database\\structure\\check_all_tables.twig");
    }
}
