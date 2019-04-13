<?php

/* table/structure/display_structure.twig */
class __TwigTemplate_02b4a3b83baab87b182bb5d56ab9e6ab02bd2e15954e6b7117f2910e76d7dc1d extends Twig_Template
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
        echo "<form method=\"post\" action=\"tbl_structure.php\" name=\"fieldsForm\" id=\"fieldsForm\"
    class=\"ajax";
        // line 2
        echo ((($context["hide_structure_actions"] ?? null)) ? (" HideStructureActions") : (""));
        echo "\">
    ";
        // line 3
        echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null), ($context["table"] ?? null));
        echo "
    <input type=\"hidden\" name=\"table_type\" value=";
        // line 5
        if (($context["db_is_system_schema"] ?? null)) {
            // line 6
            echo "\"information_schema\"";
        } elseif (        // line 7
($context["tbl_is_view"] ?? null)) {
            // line 8
            echo "\"view\"";
        } else {
            // line 10
            echo "\"table\"";
        }
        // line 11
        echo " />
    <div class=\"responsivetable\">
    <table id=\"tablestructure\" class=\"data topmargin\">
        ";
        // line 15
        echo "        ";
        $this->loadTemplate("table/structure/table_structure_header.twig", "table/structure/display_structure.twig", 15)->display(array("db_is_system_schema" =>         // line 16
($context["db_is_system_schema"] ?? null), "tbl_is_view" =>         // line 17
($context["tbl_is_view"] ?? null), "show_column_comments" =>         // line 18
($context["show_column_comments"] ?? null)));
        // line 20
        echo "        <tbody>
        ";
        // line 22
        echo "        ";
        $context["rownum"] = 0;
        // line 23
        echo "        ";
        $context["columns_list"] = array();
        // line 24
        echo "        ";
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["fields"] ?? null));
        foreach ($context['_seq'] as $context["_key"] => $context["row"]) {
            // line 25
            echo "            ";
            $context["rownum"] = (($context["rownum"] ?? null) + 1);
            // line 26
            echo "            ";
            $context["columns_list"] = twig_array_merge(($context["columns_list"] ?? null), array(0 => $this->getAttribute($context["row"], "Field", array(), "array")));
            // line 27
            echo "            ";
            $context["field_charset"] = $this->getAttribute($context["row"], "Collation", array(), "array");
            // line 28
            echo "
            ";
            // line 29
            $context["extracted_columnspec"] = PhpMyAdmin\Util::extractColumnSpec($this->getAttribute($context["row"], "Type", array(), "array"));
            // line 30
            echo "            ";
            $context["attribute"] = $this->getAttribute(($context["extracted_columnspec"] ?? null), "attribute", array(), "array");
            // line 31
            echo "            ";
            if ( !(strpos($this->getAttribute($context["row"], "Extra", array(), "array"), "on update CURRENT_TIMESTAMP") === false)) {
                // line 33
                echo "                ";
                $context["attribute"] = "on update CURRENT_TIMESTAMP";
                // line 34
                echo "            ";
            }
            // line 35
            echo "
            ";
            // line 36
            if ( !$this->getAttribute($context["row"], "Default", array(), "array", true, true)) {
                // line 37
                echo "                ";
                if (($this->getAttribute($context["row"], "Null", array(), "array") == "YES")) {
                    // line 38
                    echo "                    ";
                    $context["row"] = twig_array_merge($context["row"], array("Default" => "<em>NULL</em>"));
                    // line 39
                    echo "                ";
                }
                // line 40
                echo "            ";
            } else {
                // line 41
                echo "                ";
                $context["row"] = twig_array_merge($context["row"], array("Default" => twig_escape_filter($this->env, $this->getAttribute($context["row"], "Default", array(), "array"))));
                // line 42
                echo "            ";
            }
            // line 43
            echo "
            ";
            // line 44
            $context["field_name"] = twig_escape_filter($this->env, $this->getAttribute($context["row"], "Field", array(), "array"));
            // line 45
            echo "            ";
            $context["displayed_field_name"] = ($context["field_name"] ?? null);
            // line 46
            echo "            ";
            // line 47
            echo "            ";
            $context["comments"] = "";
            // line 48
            echo "            ";
            // line 49
            echo "
            ";
            // line 50
            if ($this->getAttribute(($context["comments_map"] ?? null), $this->getAttribute($context["row"], "Field", array(), "array"), array(), "array", true, true)) {
                // line 51
                echo "                ";
                ob_start();
                // line 52
                echo "<span class=\"commented_column\" title=\"";
                // line 53
                echo twig_escape_filter($this->env, $this->getAttribute(($context["comments_map"] ?? null), $this->getAttribute($context["row"], "Field", array(), "array"), array(), "array"), "html", null, true);
                echo "\">";
                // line 54
                echo ($context["field_name"] ?? null);
                // line 55
                echo "</span>";
                $context["displayed_field_name"] = ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
                // line 57
                echo "                ";
                $context["comments"] = $this->getAttribute(($context["comments_map"] ?? null), $this->getAttribute($context["row"], "Field", array(), "array"), array(), "array");
                // line 58
                echo "            ";
            }
            // line 59
            echo "
            ";
            // line 60
            if ((($context["primary"] ?? null) && $this->getAttribute(($context["primary"] ?? null), "hasColumn", array(0 => ($context["field_name"] ?? null)), "method"))) {
                // line 61
                echo "                ";
                $context["displayed_field_name"] = (($context["displayed_field_name"] ?? null) . PhpMyAdmin\Util::getImage("b_primary", _gettext("Primary")));
                // line 64
                echo "            ";
            }
            // line 65
            echo "            ";
            if (twig_in_filter(($context["field_name"] ?? null), ($context["columns_with_index"] ?? null))) {
                // line 66
                echo "                ";
                $context["displayed_field_name"] = (($context["displayed_field_name"] ?? null) . PhpMyAdmin\Util::getImage("bd_primary", _gettext("Index")));
                // line 69
                echo "            ";
            }
            // line 70
            echo "        <tr>
            ";
            // line 71
            $this->loadTemplate("table/structure/table_structure_row.twig", "table/structure/display_structure.twig", 71)->display(array("row" =>             // line 72
$context["row"], "rownum" =>             // line 73
($context["rownum"] ?? null), "displayed_field_name" => preg_replace("/[\\x00-\\x1F]/", "&#x2051;",             // line 77
($context["displayed_field_name"] ?? null)), "type_nowrap" => PhpMyAdmin\Util::getClassForType($this->getAttribute(            // line 79
($context["extracted_columnspec"] ?? null), "type", array(), "array")), "extracted_columnspec" =>             // line 80
($context["extracted_columnspec"] ?? null), "attribute" =>             // line 81
($context["attribute"] ?? null), "tbl_is_view" =>             // line 82
($context["tbl_is_view"] ?? null), "db_is_system_schema" =>             // line 83
($context["db_is_system_schema"] ?? null), "url_query" =>             // line 84
($context["url_query"] ?? null), "titles" =>             // line 85
($context["titles"] ?? null), "table" =>             // line 86
($context["table"] ?? null), "tbl_storage_engine" =>             // line 87
($context["tbl_storage_engine"] ?? null), "field_charset" =>             // line 88
($context["field_charset"] ?? null), "comments" =>             // line 89
($context["comments"] ?? null), "show_column_comments" =>             // line 90
($context["show_column_comments"] ?? null), "relation_commwork" =>             // line 91
($context["relation_commwork"] ?? null), "relation_mimework" =>             // line 92
($context["relation_mimework"] ?? null), "browse_mime" =>             // line 93
($context["browse_mime"] ?? null)));
            // line 95
            echo "            ";
            if (( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
                // line 96
                echo "                ";
                $this->loadTemplate("table/structure/actions_in_table_structure.twig", "table/structure/display_structure.twig", 96)->display(array("row" =>                 // line 97
$context["row"], "rownum" =>                 // line 98
($context["rownum"] ?? null), "extracted_columnspec" =>                 // line 99
($context["extracted_columnspec"] ?? null), "type" => (( !twig_test_empty($this->getAttribute(                // line 100
($context["extracted_columnspec"] ?? null), "print_type", array(), "array"))) ? ($this->getAttribute(($context["extracted_columnspec"] ?? null), "print_type", array(), "array")) : ("")), "tbl_storage_engine" =>                 // line 101
($context["tbl_storage_engine"] ?? null), "primary" =>                 // line 102
($context["primary"] ?? null), "field_name" =>                 // line 103
($context["field_name"] ?? null), "url_query" =>                 // line 104
($context["url_query"] ?? null), "titles" =>                 // line 105
($context["titles"] ?? null), "columns_with_unique_index" =>                 // line 106
($context["columns_with_unique_index"] ?? null), "is_in_central_columns" => ((twig_in_filter($this->getAttribute(                // line 107
$context["row"], "Field", array(), "array"), ($context["central_list"] ?? null))) ? (true) : (false)), "central_columns_work" =>                 // line 108
($context["central_columns_work"] ?? null), "table" =>                 // line 109
($context["table"] ?? null), "hide_structure_actions" =>                 // line 110
($context["hide_structure_actions"] ?? null), "mysql_int_version" =>                 // line 111
($context["mysql_int_version"] ?? null)));
                // line 113
                echo "            ";
            }
            // line 114
            echo "        </tr>
        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['row'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 116
        echo "        </tbody>
    </table>
    </div>
    ";
        // line 119
        $this->loadTemplate("table/structure/check_all_table_column.twig", "table/structure/display_structure.twig", 119)->display(array("pma_theme_image" =>         // line 120
($context["pma_theme_image"] ?? null), "text_dir" =>         // line 121
($context["text_dir"] ?? null), "tbl_is_view" =>         // line 122
($context["tbl_is_view"] ?? null), "db_is_system_schema" =>         // line 123
($context["db_is_system_schema"] ?? null), "tbl_storage_engine" =>         // line 124
($context["tbl_storage_engine"] ?? null), "central_columns_work" =>         // line 125
($context["central_columns_work"] ?? null)));
        // line 127
        echo "</form>
<hr class=\"print_ignore\"/>
";
        // line 129
        $this->loadTemplate("table/structure/move_columns_dialog.twig", "table/structure/display_structure.twig", 129)->display(array("db" =>         // line 130
($context["db"] ?? null), "table" =>         // line 131
($context["table"] ?? null)));
        // line 134
        echo "<div id=\"structure-action-links\">
    ";
        // line 135
        if ((($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 136
            echo "        ";
            echo PhpMyAdmin\Util::linkOrButton(            // line 137
($context["edit_view_url"] ?? null), PhpMyAdmin\Util::getIcon("b_edit", _gettext("Edit view"), true));
            // line 139
            echo "
    ";
        }
        // line 141
        echo "    ";
        $this->loadTemplate("table/structure/optional_action_links.twig", "table/structure/display_structure.twig", 141)->display(array("url_query" =>         // line 142
($context["url_query"] ?? null), "tbl_is_view" =>         // line 143
($context["tbl_is_view"] ?? null), "db_is_system_schema" =>         // line 144
($context["db_is_system_schema"] ?? null), "table" =>         // line 145
($context["table"] ?? null), "is_active" =>         // line 146
($context["is_active"] ?? null)));
        // line 148
        echo "</div>
";
        // line 149
        if (( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 150
            echo "    ";
            $this->loadTemplate("table/structure/add_column.twig", "table/structure/display_structure.twig", 150)->display(array("columns_list" =>             // line 151
($context["columns_list"] ?? null), "db" =>             // line 152
($context["db"] ?? null), "table" =>             // line 153
($context["table"] ?? null)));
        }
        // line 156
        echo "
";
        // line 158
        if ((( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null)) && ("ARCHIVE" !=         // line 159
($context["tbl_storage_engine"] ?? null)))) {
            // line 160
            echo "    ";
            echo PhpMyAdmin\Index::getHtmlForDisplayIndexes();
            echo "
";
        }
        // line 162
        echo "
";
        // line 164
        if (($context["have_partitioning"] ?? null)) {
            // line 165
            echo "    ";
            // line 166
            echo "    ";
            if (( !twig_test_empty(($context["partition_names"] ?? null)) &&  !(null === $this->getAttribute(($context["partition_names"] ?? null), 0, array(), "array")))) {
                // line 167
                echo "        ";
                $context["partitions"] = PhpMyAdmin\Partition::getPartitions(($context["db"] ?? null), ($context["table"] ?? null));
                // line 168
                echo "        ";
                $context["first_partition"] = $this->getAttribute(($context["partitions"] ?? null), 0, array(), "array");
                // line 169
                echo "        ";
                $context["range_or_list"] = (((($this->getAttribute(($context["first_partition"] ?? null), "getMethod", array(), "method") == "RANGE") || ($this->getAttribute(                // line 170
($context["first_partition"] ?? null), "getMethod", array(), "method") == "RANGE COLUMNS")) || ($this->getAttribute(                // line 171
($context["first_partition"] ?? null), "getMethod", array(), "method") == "LIST")) || ($this->getAttribute(                // line 172
($context["first_partition"] ?? null), "getMethod", array(), "method") == "LIST COLUMNS"));
                // line 173
                echo "        ";
                $context["sub_partitions"] = $this->getAttribute(($context["first_partition"] ?? null), "getSubPartitions", array(), "method");
                // line 174
                echo "        ";
                $context["has_sub_partitions"] = $this->getAttribute(($context["first_partition"] ?? null), "hasSubPartitions", array(), "method");
                // line 175
                echo "        ";
                if (($context["has_sub_partitions"] ?? null)) {
                    // line 176
                    echo "            ";
                    $context["first_sub_partition"] = $this->getAttribute(($context["sub_partitions"] ?? null), 0, array(), "array");
                    // line 177
                    echo "        ";
                }
                // line 178
                echo "
        ";
                // line 179
                $context["action_icons"] = array("ANALYZE" => PhpMyAdmin\Util::getIcon("b_search", _gettext("Analyze")), "CHECK" => PhpMyAdmin\Util::getIcon("eye", _gettext("Check")), "OPTIMIZE" => PhpMyAdmin\Util::getIcon("normalize", _gettext("Optimize")), "REBUILD" => PhpMyAdmin\Util::getIcon("s_tbl", _gettext("Rebuild")), "REPAIR" => PhpMyAdmin\Util::getIcon("b_tblops", _gettext("Repair")), "TRUNCATE" => PhpMyAdmin\Util::getIcon("b_empty", _gettext("Truncate")));
                // line 187
                echo "        ";
                if (($context["range_or_list"] ?? null)) {
                    // line 188
                    echo "            ";
                    $context["action_icons"] = twig_array_merge(($context["action_icons"] ?? null), array("DROP" => PhpMyAdmin\Util::getIcon("b_drop", _gettext("Drop"))));
                    // line 189
                    echo "        ";
                }
                // line 190
                echo "
        ";
                // line 191
                echo PhpMyAdmin\Util::getDivForSliderEffect("partitions", _gettext("Partitions"));
                echo "

        ";
                // line 193
                $context["remove_sql"] = (("ALTER TABLE " . PhpMyAdmin\Util::backquote(($context["table"] ?? null))) . " REMOVE PARTITIONING");
                // line 194
                echo "        ";
                $context["remove_url"] = ((("sql.php" . ($context["url_query"] ?? null)) . "&sql_query=") . twig_urlencode_filter(($context["remove_sql"] ?? null)));
                // line 195
                echo "
        ";
                // line 196
                $this->loadTemplate("table/structure/display_partitions.twig", "table/structure/display_structure.twig", 196)->display(array("db" =>                 // line 197
($context["db"] ?? null), "table" =>                 // line 198
($context["table"] ?? null), "url_query" =>                 // line 199
($context["url_query"] ?? null), "partitions" =>                 // line 200
($context["partitions"] ?? null), "partition_method" => $this->getAttribute(                // line 201
($context["first_partition"] ?? null), "getMethod", array(), "method"), "partition_expression" => $this->getAttribute(                // line 202
($context["first_partition"] ?? null), "getExpression", array(), "method"), "has_description" =>  !twig_test_empty($this->getAttribute(                // line 203
($context["first_partition"] ?? null), "getDescription", array(), "method")), "has_sub_partitions" =>                 // line 204
($context["has_sub_partitions"] ?? null), "sub_partition_method" => ((                // line 205
($context["has_sub_partitions"] ?? null)) ? ($this->getAttribute(($context["first_sub_partition"] ?? null), "getMethod", array(), "method")) : ("")), "sub_partition_expression" => ((                // line 206
($context["has_sub_partitions"] ?? null)) ? ($this->getAttribute(($context["first_sub_partition"] ?? null), "getExpression", array(), "method")) : ("")), "action_icons" =>                 // line 207
($context["action_icons"] ?? null), "range_or_list" =>                 // line 208
($context["range_or_list"] ?? null), "remove_url" =>                 // line 209
($context["remove_url"] ?? null)));
                // line 211
                echo "    ";
            } else {
                // line 212
                echo "        ";
                $this->loadTemplate("table/structure/display_partitions.twig", "table/structure/display_structure.twig", 212)->display(array("db" =>                 // line 213
($context["db"] ?? null), "table" =>                 // line 214
($context["table"] ?? null)));
                // line 216
                echo "    ";
            }
            // line 217
            echo "    ";
            // line 218
            echo "    </div>
";
        }
        // line 220
        echo "
";
        // line 222
        if (($context["show_stats"] ?? null)) {
            // line 223
            echo "    ";
            echo ($context["table_stats"] ?? null);
            echo "
";
        }
        // line 225
        echo "<div class=\"clearfloat\"></div>
";
    }

    public function getTemplateName()
    {
        return "table/structure/display_structure.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  405 => 225,  399 => 223,  397 => 222,  394 => 220,  390 => 218,  388 => 217,  385 => 216,  383 => 214,  382 => 213,  380 => 212,  377 => 211,  375 => 209,  374 => 208,  373 => 207,  372 => 206,  371 => 205,  370 => 204,  369 => 203,  368 => 202,  367 => 201,  366 => 200,  365 => 199,  364 => 198,  363 => 197,  362 => 196,  359 => 195,  356 => 194,  354 => 193,  349 => 191,  346 => 190,  343 => 189,  340 => 188,  337 => 187,  335 => 179,  332 => 178,  329 => 177,  326 => 176,  323 => 175,  320 => 174,  317 => 173,  315 => 172,  314 => 171,  313 => 170,  311 => 169,  308 => 168,  305 => 167,  302 => 166,  300 => 165,  298 => 164,  295 => 162,  289 => 160,  287 => 159,  286 => 158,  283 => 156,  280 => 153,  279 => 152,  278 => 151,  276 => 150,  274 => 149,  271 => 148,  269 => 146,  268 => 145,  267 => 144,  266 => 143,  265 => 142,  263 => 141,  259 => 139,  257 => 137,  255 => 136,  253 => 135,  250 => 134,  248 => 131,  247 => 130,  246 => 129,  242 => 127,  240 => 125,  239 => 124,  238 => 123,  237 => 122,  236 => 121,  235 => 120,  234 => 119,  229 => 116,  222 => 114,  219 => 113,  217 => 111,  216 => 110,  215 => 109,  214 => 108,  213 => 107,  212 => 106,  211 => 105,  210 => 104,  209 => 103,  208 => 102,  207 => 101,  206 => 100,  205 => 99,  204 => 98,  203 => 97,  201 => 96,  198 => 95,  196 => 93,  195 => 92,  194 => 91,  193 => 90,  192 => 89,  191 => 88,  190 => 87,  189 => 86,  188 => 85,  187 => 84,  186 => 83,  185 => 82,  184 => 81,  183 => 80,  182 => 79,  181 => 77,  180 => 73,  179 => 72,  178 => 71,  175 => 70,  172 => 69,  169 => 66,  166 => 65,  163 => 64,  160 => 61,  158 => 60,  155 => 59,  152 => 58,  149 => 57,  146 => 55,  144 => 54,  141 => 53,  139 => 52,  136 => 51,  134 => 50,  131 => 49,  129 => 48,  126 => 47,  124 => 46,  121 => 45,  119 => 44,  116 => 43,  113 => 42,  110 => 41,  107 => 40,  104 => 39,  101 => 38,  98 => 37,  96 => 36,  93 => 35,  90 => 34,  87 => 33,  84 => 31,  81 => 30,  79 => 29,  76 => 28,  73 => 27,  70 => 26,  67 => 25,  62 => 24,  59 => 23,  56 => 22,  53 => 20,  51 => 18,  50 => 17,  49 => 16,  47 => 15,  42 => 11,  39 => 10,  36 => 8,  34 => 7,  32 => 6,  30 => 5,  26 => 3,  22 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "table/structure/display_structure.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\display_structure.twig");
    }
}
