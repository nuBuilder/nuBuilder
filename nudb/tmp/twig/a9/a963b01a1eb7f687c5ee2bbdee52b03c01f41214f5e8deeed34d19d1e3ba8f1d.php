<?php

/* database/structure/table_header.twig */
class __TwigTemplate_6c18ac45b0a42d261b2266c86459cae40193e11e05bc836c2d4ceaa62d08d858 extends Twig_Template
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
        echo PhpMyAdmin\Util::showHint(PhpMyAdmin\Sanitize::sanitize(_gettext("May be approximate. Click on the number to get the exact count. See [doc@faq3-11]FAQ 3.11[/doc].")));
        // line 29
        echo "
            </th>
            ";
        // line 31
        if ( !(($context["properties_num_columns"] ?? null) > 1)) {
            // line 32
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Type"), "type");
            echo "</th>
                <th>";
            // line 33
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Collation"), "collation");
            echo "</th>
            ";
        }
        // line 35
        echo "
            ";
        // line 36
        if (($context["is_show_stats"] ?? null)) {
            // line 37
            echo "                ";
            // line 38
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Size"), "size", "DESC");
            echo "</th>
                ";
            // line 40
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Overhead"), "overhead", "DESC");
            echo "</th>
            ";
        }
        // line 42
        echo "
            ";
        // line 43
        if (($context["show_charset"] ?? null)) {
            // line 44
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Charset"), "charset");
            echo "</th>
            ";
        }
        // line 46
        echo "
            ";
        // line 47
        if (($context["show_comment"] ?? null)) {
            // line 48
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Comment"), "comment");
            echo "</th>
            ";
        }
        // line 50
        echo "
            ";
        // line 51
        if (($context["show_creation"] ?? null)) {
            // line 52
            echo "                ";
            // line 53
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Creation"), "creation", "DESC");
            echo "</th>
            ";
        }
        // line 55
        echo "
            ";
        // line 56
        if (($context["show_last_update"] ?? null)) {
            // line 57
            echo "                ";
            // line 58
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Last update"), "last_update", "DESC");
            echo "</th>
            ";
        }
        // line 60
        echo "
            ";
        // line 61
        if (($context["show_last_check"] ?? null)) {
            // line 62
            echo "                ";
            // line 63
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Last check"), "last_check", "DESC");
            echo "</th>
            ";
        }
        // line 65
        echo "        </tr>
    </thead>
    <tbody>
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
        return array (  183 => 65,  177 => 63,  175 => 62,  173 => 61,  170 => 60,  164 => 58,  162 => 57,  160 => 56,  157 => 55,  151 => 53,  149 => 52,  147 => 51,  144 => 50,  138 => 48,  136 => 47,  133 => 46,  127 => 44,  125 => 43,  122 => 42,  116 => 40,  111 => 38,  109 => 37,  107 => 36,  104 => 35,  99 => 33,  94 => 32,  92 => 31,  88 => 29,  86 => 27,  82 => 26,  79 => 25,  76 => 23,  74 => 22,  69 => 21,  66 => 20,  63 => 19,  60 => 18,  57 => 17,  54 => 16,  51 => 15,  48 => 14,  46 => 13,  43 => 12,  37 => 10,  35 => 9,  31 => 8,  22 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "database/structure/table_header.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\database\\structure\\table_header.twig");
    }
}
