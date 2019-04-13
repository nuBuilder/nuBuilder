<?php

/* table/structure/actions_in_table_structure.twig */
class __TwigTemplate_03ebb0eec1d4d1ebd7828be1c80ca1b67e494565b7f65d1219661bd89b01231a extends Twig_Template
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
        echo "<td class=\"print_ignore\"><ul class=\"table-structure-actions resizable-menu\">
    ";
        // line 2
        if (($context["hide_structure_actions"] ?? null)) {
            // line 3
            echo "        <li class=\"submenu shown\">
            <a href=\"#\" class=\"tab nowrap\">";
            // line 4
            echo PhpMyAdmin\Util::getIcon("b_more", _gettext("More"));
            echo "</a>
            <ul>
    ";
        }
        // line 7
        echo "    ";
        // line 8
        echo "    ";
        $this->loadTemplate("table/structure/action_row_in_structure_table.twig", "table/structure/actions_in_table_structure.twig", 8)->display(array("type" =>         // line 9
($context["type"] ?? null), "tbl_storage_engine" =>         // line 10
($context["tbl_storage_engine"] ?? null), "class" => "primary nowrap", "has_field" => (        // line 12
($context["primary"] ?? null) && $this->getAttribute(($context["primary"] ?? null), "hasColumn", array(0 => ($context["field_name"] ?? null)), "method")), "has_link_class" => true, "url_query" =>         // line 14
($context["url_query"] ?? null), "primary" =>         // line 15
($context["primary"] ?? null), "syntax" => "ADD PRIMARY KEY", "message" => _gettext("A primary key has been added on %s."), "action" => "Primary", "titles" =>         // line 19
($context["titles"] ?? null), "row" =>         // line 20
($context["row"] ?? null), "is_primary" => true, "table" =>         // line 22
($context["table"] ?? null)));
        // line 24
        echo "
    ";
        // line 26
        echo "    ";
        $this->loadTemplate("table/structure/action_row_in_structure_table.twig", "table/structure/actions_in_table_structure.twig", 26)->display(array("type" =>         // line 27
($context["type"] ?? null), "tbl_storage_engine" =>         // line 28
($context["tbl_storage_engine"] ?? null), "class" => "add_unique unique nowrap", "has_field" => twig_in_filter(        // line 30
($context["field_name"] ?? null), ($context["columns_with_unique_index"] ?? null)), "has_link_class" => false, "url_query" =>         // line 32
($context["url_query"] ?? null), "primary" =>         // line 33
($context["primary"] ?? null), "syntax" => "ADD UNIQUE", "message" => _gettext("An index has been added on %s."), "action" => "Unique", "titles" =>         // line 37
($context["titles"] ?? null), "row" =>         // line 38
($context["row"] ?? null), "is_primary" => false, "table" =>         // line 40
($context["table"] ?? null)));
        // line 42
        echo "
    ";
        // line 44
        echo "    ";
        $this->loadTemplate("table/structure/action_row_in_structure_table.twig", "table/structure/actions_in_table_structure.twig", 44)->display(array("type" =>         // line 45
($context["type"] ?? null), "tbl_storage_engine" =>         // line 46
($context["tbl_storage_engine"] ?? null), "class" => "add_index nowrap", "has_field" => false, "has_link_class" => false, "url_query" =>         // line 50
($context["url_query"] ?? null), "primary" =>         // line 51
($context["primary"] ?? null), "syntax" => "ADD INDEX", "message" => _gettext("An index has been added on %s."), "action" => "Index", "titles" =>         // line 55
($context["titles"] ?? null), "row" =>         // line 56
($context["row"] ?? null), "is_primary" => false, "table" =>         // line 58
($context["table"] ?? null)));
        // line 60
        echo "
    ";
        // line 62
        echo "    ";
        $context["spatial_types"] = array(0 => "geometry", 1 => "point", 2 => "linestring", 3 => "polygon", 4 => "multipoint", 5 => "multilinestring", 6 => "multipolygon", 7 => "geomtrycollection");
        // line 72
        echo "    ";
        $this->loadTemplate("table/structure/action_row_in_structure_table.twig", "table/structure/actions_in_table_structure.twig", 72)->display(array("type" =>         // line 73
($context["type"] ?? null), "tbl_storage_engine" =>         // line 74
($context["tbl_storage_engine"] ?? null), "class" => "spatial nowrap", "has_field" => (!twig_in_filter(        // line 76
($context["type"] ?? null), ($context["spatial_types"] ?? null)) && ((        // line 77
($context["tbl_storage_engine"] ?? null) == "MYISAM") || (($context["mysql_int_version"] ?? null) >= 50705))), "has_link_class" => false, "url_query" =>         // line 79
($context["url_query"] ?? null), "primary" =>         // line 80
($context["primary"] ?? null), "syntax" => "ADD SPATIAL", "message" => _gettext("An index has been added on %s."), "action" => "Spatial", "titles" =>         // line 84
($context["titles"] ?? null), "row" =>         // line 85
($context["row"] ?? null), "is_primary" => false, "table" =>         // line 87
($context["table"] ?? null)));
        // line 89
        echo "
    ";
        // line 91
        echo "    <li class=\"fulltext nowrap\">
    ";
        // line 92
        if ((( !twig_test_empty(($context["tbl_storage_engine"] ?? null)) && ((((        // line 93
($context["tbl_storage_engine"] ?? null) == "MYISAM") || (        // line 94
($context["tbl_storage_engine"] ?? null) == "ARIA")) || (        // line 95
($context["tbl_storage_engine"] ?? null) == "MARIA")) || ((        // line 96
($context["tbl_storage_engine"] ?? null) == "INNODB") && (($context["mysql_int_version"] ?? null) >= 50604)))) && (twig_in_filter("text",         // line 97
($context["type"] ?? null)) || twig_in_filter("char", ($context["type"] ?? null))))) {
            // line 98
            echo "        <a rel=\"samepage\" class=\"ajax add_key add_fulltext_anchor\" href=\"tbl_structure.php\"
            data-post=\"";
            // line 99
            echo ($context["url_query"] ?? null);
            echo "&amp;add_key=1&amp;sql_query=";
            // line 100
            echo twig_escape_filter($this->env, twig_urlencode_filter((((("ALTER TABLE " . PhpMyAdmin\Util::backquote(($context["table"] ?? null))) . " ADD FULLTEXT(") . PhpMyAdmin\Util::backquote($this->getAttribute(            // line 101
($context["row"] ?? null), "Field", array(), "array"))) . ");")), "html", null, true);
            // line 102
            echo "&amp;message_to_show=";
            // line 103
            echo twig_escape_filter($this->env, twig_urlencode_filter(sprintf(_gettext("An index has been added on %s."), twig_escape_filter($this->env, $this->getAttribute(($context["row"] ?? null), "Field", array(), "array")))), "html", null, true);
            echo "\">
            ";
            // line 104
            echo $this->getAttribute(($context["titles"] ?? null), "IdxFulltext", array(), "array");
            echo "
        </a>
    ";
        } else {
            // line 107
            echo "        ";
            echo $this->getAttribute(($context["titles"] ?? null), "NoIdxFulltext", array(), "array");
            echo "
    ";
        }
        // line 109
        echo "    </li>

    ";
        // line 112
        echo "    <li class=\"browse nowrap\">
        <a href=\"sql.php\" data-post=\"";
        // line 113
        echo ($context["url_query"] ?? null);
        echo "&amp;sql_query=";
        // line 114
        echo twig_escape_filter($this->env, twig_urlencode_filter(((((((((("SELECT COUNT(*) AS " . PhpMyAdmin\Util::backquote(_gettext("Rows"))) . ", ") . PhpMyAdmin\Util::backquote($this->getAttribute(        // line 115
($context["row"] ?? null), "Field", array(), "array"))) . " FROM ") . PhpMyAdmin\Util::backquote(        // line 116
($context["table"] ?? null))) . " GROUP BY ") . PhpMyAdmin\Util::backquote($this->getAttribute(        // line 117
($context["row"] ?? null), "Field", array(), "array"))) . " ORDER BY ") . PhpMyAdmin\Util::backquote($this->getAttribute(        // line 118
($context["row"] ?? null), "Field", array(), "array")))), "html", null, true);
        // line 119
        echo "&amp;is_browse_distinct=1\">
            ";
        // line 120
        echo $this->getAttribute(($context["titles"] ?? null), "DistinctValues", array(), "array");
        echo "
        </a>
    </li>
    ";
        // line 123
        if (($context["central_columns_work"] ?? null)) {
            // line 124
            echo "        <li class=\"browse nowrap\">
        ";
            // line 125
            if (($context["is_in_central_columns"] ?? null)) {
                // line 126
                echo "            <a href=\"#\" class=\"central_columns remove_button\">
                ";
                // line 127
                echo PhpMyAdmin\Util::getIcon("centralColumns_delete", _gettext("Remove from central columns"));
                echo "
            </a>
        ";
            } else {
                // line 130
                echo "            <a href=\"#\" class=\"central_columns add_button\">
                ";
                // line 131
                echo PhpMyAdmin\Util::getIcon("centralColumns_add", _gettext("Add to central columns"));
                echo "
            </a>
        ";
            }
            // line 134
            echo "        </li>
    ";
        }
        // line 136
        echo "    ";
        if (($context["hide_structure_actions"] ?? null)) {
            // line 137
            echo "            </ul>
        </li>
    ";
        }
        // line 140
        echo "</ul></td>
";
    }

    public function getTemplateName()
    {
        return "table/structure/actions_in_table_structure.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  193 => 140,  188 => 137,  185 => 136,  181 => 134,  175 => 131,  172 => 130,  166 => 127,  163 => 126,  161 => 125,  158 => 124,  156 => 123,  150 => 120,  147 => 119,  145 => 118,  144 => 117,  143 => 116,  142 => 115,  141 => 114,  138 => 113,  135 => 112,  131 => 109,  125 => 107,  119 => 104,  115 => 103,  113 => 102,  111 => 101,  110 => 100,  107 => 99,  104 => 98,  102 => 97,  101 => 96,  100 => 95,  99 => 94,  98 => 93,  97 => 92,  94 => 91,  91 => 89,  89 => 87,  88 => 85,  87 => 84,  86 => 80,  85 => 79,  84 => 77,  83 => 76,  82 => 74,  81 => 73,  79 => 72,  76 => 62,  73 => 60,  71 => 58,  70 => 56,  69 => 55,  68 => 51,  67 => 50,  66 => 46,  65 => 45,  63 => 44,  60 => 42,  58 => 40,  57 => 38,  56 => 37,  55 => 33,  54 => 32,  53 => 30,  52 => 28,  51 => 27,  49 => 26,  46 => 24,  44 => 22,  43 => 20,  42 => 19,  41 => 15,  40 => 14,  39 => 12,  38 => 10,  37 => 9,  35 => 8,  33 => 7,  27 => 4,  24 => 3,  22 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "table/structure/actions_in_table_structure.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\actions_in_table_structure.twig");
    }
}
