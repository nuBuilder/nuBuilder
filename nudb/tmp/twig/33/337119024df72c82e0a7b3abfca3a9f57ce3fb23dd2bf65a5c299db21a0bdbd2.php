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

/* database/structure/table_header.twig */
class __TwigTemplate_95d6bd90c5d598338d10ddd128fb39c12c7449fef80837ca79931850f77b677b extends \Twig\Template
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
        echo "<form method=\"post\" action=\"db_structure.php\" name=\"tablesForm\" id=\"tablesForm\">
";
        // line 2
        echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null));
        echo "
<div class=\"responsivetable\">
<table id=\"structureTable\" class=\"data\">
    <thead>
        <tr>
            <th class=\"print_ignore\"></th>
            <th>";
        // line 8
        echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Table"), "table");
        echo "</th>
            ";
        // line 9
        if (($context["replication"] ?? null)) {
            // line 10
            echo "                <th>";
            echo _gettext("Replication");
            echo "</th>
            ";
        }
        // line 12
        echo "
            ";
        // line 13
        if (($context["db_is_system_schema"] ?? null)) {
            // line 14
            echo "                ";
            $context["action_colspan"] = 3;
            // line 15
            echo "            ";
        } else {
            // line 16
            echo "                ";
            $context["action_colspan"] = 6;
            // line 17
            echo "            ";
        }
        // line 18
        echo "            ";
        if ((($context["num_favorite_tables"] ?? null) > 0)) {
            // line 19
            echo "                ";
            $context["action_colspan"] = (($context["action_colspan"] ?? null) + 1);
            // line 20
            echo "            ";
        }
        // line 21
        echo "            <th colspan=\"";
        echo twig_escape_filter($this->env, ($context["action_colspan"] ?? null), "html", null, true);
        echo "\" class=\"print_ignore\">
                ";
        // line 22
        echo _gettext("Action");
        // line 23
        echo "            </th>
            ";
        // line 25
        echo "            <th>
                ";
        // line 26
        echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Rows"), "records", "DESC");
        echo "
                ";
        // line 27
        echo PhpMyAdmin\Util::showHint(PhpMyAdmin\Sanitize::sanitizeMessage(_gettext("May be approximate. Click on the number to get the exact count. See [doc@faq3-11]FAQ 3.11[/doc].")));
        echo "
            </th>
            ";
        // line 29
        if ( !(($context["properties_num_columns"] ?? null) > 1)) {
            // line 30
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Type"), "type");
            echo "</th>
                <th>";
            // line 31
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Collation"), "collation");
            echo "</th>
            ";
        }
        // line 33
        echo "
            ";
        // line 34
        if (($context["is_show_stats"] ?? null)) {
            // line 35
            echo "                ";
            // line 36
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Size"), "size", "DESC");
            echo "</th>
                ";
            // line 38
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Overhead"), "overhead", "DESC");
            echo "</th>
            ";
        }
        // line 40
        echo "
            ";
        // line 41
        if (($context["show_charset"] ?? null)) {
            // line 42
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Charset"), "charset");
            echo "</th>
            ";
        }
        // line 44
        echo "
            ";
        // line 45
        if (($context["show_comment"] ?? null)) {
            // line 46
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Comment"), "comment");
            echo "</th>
            ";
        }
        // line 48
        echo "
            ";
        // line 49
        if (($context["show_creation"] ?? null)) {
            // line 50
            echo "                ";
            // line 51
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Creation"), "creation", "DESC");
            echo "</th>
            ";
        }
        // line 53
        echo "
            ";
        // line 54
        if (($context["show_last_update"] ?? null)) {
            // line 55
            echo "                ";
            // line 56
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Last update"), "last_update", "DESC");
            echo "</th>
            ";
        }
        // line 58
        echo "
            ";
        // line 59
        if (($context["show_last_check"] ?? null)) {
            // line 60
            echo "                ";
            // line 61
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Last check"), "last_check", "DESC");
            echo "</th>
            ";
        }
        // line 63
        echo "        </tr>
    </thead>
    <tbody>
    ";
        // line 66
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["structure_table_rows"] ?? null));
        foreach ($context['_seq'] as $context["_key"] => $context["structure_table_row"]) {
            // line 67
            echo "        ";
            $this->loadTemplate("database/structure/structure_table_row.twig", "database/structure/table_header.twig", 67)->display(twig_to_array($context["structure_table_row"]));
            // line 68
            echo "    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['structure_table_row'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 69
        echo "    </tbody>
    ";
        // line 70
        if (($context["body_for_table_summary"] ?? null)) {
            // line 71
            echo "        ";
            $this->loadTemplate("database/structure/body_for_table_summary.twig", "database/structure/table_header.twig", 71)->display(twig_to_array(($context["body_for_table_summary"] ?? null)));
            // line 72
            echo "    ";
        }
        // line 73
        echo "</table>
</div>
";
        // line 75
        if (($context["check_all_tables"] ?? null)) {
            // line 76
            echo "    ";
            $this->loadTemplate("database/structure/check_all_tables.twig", "database/structure/table_header.twig", 76)->display(twig_to_array(($context["check_all_tables"] ?? null)));
        }
        // line 78
        echo "</form>
";
    }

    public function getTemplateName()
    {
        return "database/structure/table_header.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  239 => 78,  235 => 76,  233 => 75,  229 => 73,  226 => 72,  223 => 71,  221 => 70,  218 => 69,  212 => 68,  209 => 67,  205 => 66,  200 => 63,  194 => 61,  192 => 60,  190 => 59,  187 => 58,  181 => 56,  179 => 55,  177 => 54,  174 => 53,  168 => 51,  166 => 50,  164 => 49,  161 => 48,  155 => 46,  153 => 45,  150 => 44,  144 => 42,  142 => 41,  139 => 40,  133 => 38,  128 => 36,  126 => 35,  124 => 34,  121 => 33,  116 => 31,  111 => 30,  109 => 29,  104 => 27,  100 => 26,  97 => 25,  94 => 23,  92 => 22,  87 => 21,  84 => 20,  81 => 19,  78 => 18,  75 => 17,  72 => 16,  69 => 15,  66 => 14,  64 => 13,  61 => 12,  55 => 10,  53 => 9,  49 => 8,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/table_header.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\database\\structure\\table_header.twig");
    }
}
