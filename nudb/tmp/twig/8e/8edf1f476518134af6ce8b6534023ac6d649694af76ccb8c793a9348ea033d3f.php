<?php

/* database/structure/structure_table_row.twig */
class __TwigTemplate_d4dbba108bc10287b113146f8771599356ef89701d7cd44faef35b743839392a extends Twig_Template
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
        echo "<tr id=\"row_tbl_";
        echo twig_escape_filter($this->env, ($context["curr"] ?? null), "html", null, true);
        echo "\"";
        echo ((($context["table_is_view"] ?? null)) ? (" class=\"is_view\"") : (""));
        echo " data-filter-row=\"";
        echo twig_escape_filter($this->env, twig_upper_filter($this->env, $this->getAttribute(($context["current_table"] ?? null), "TABLE_NAME", array(), "array")), "html", null, true);
        echo "\">
    <td class=\"center print_ignore\">
        <input type=\"checkbox\"
            name=\"selected_tbl[]\"
            class=\"";
        // line 5
        echo twig_escape_filter($this->env, ($context["input_class"] ?? null), "html", null, true);
        echo "\"
            value=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->getAttribute(($context["current_table"] ?? null), "TABLE_NAME", array(), "array"), "html", null, true);
        echo "\"
            id=\"checkbox_tbl_";
        // line 7
        echo twig_escape_filter($this->env, ($context["curr"] ?? null), "html", null, true);
        echo "\" />
    </td>
    <th>
        ";
        // line 10
        echo ($context["browse_table_label"] ?? null);
        echo "
        ";
        // line 11
        echo ($context["tracking_icon"] ?? null);
        echo "
    </th>
    ";
        // line 13
        if (($context["server_slave_status"] ?? null)) {
            // line 14
            echo "        <td class=\"center\">
            ";
            // line 15
            echo ((($context["ignored"] ?? null)) ? (PhpMyAdmin\Util::getImage("s_cancel", _gettext("Not replicated"))) : (""));
            echo "
            ";
            // line 16
            echo ((($context["do"] ?? null)) ? (PhpMyAdmin\Util::getImage("s_success", _gettext("Replicated"))) : (""));
            echo "
        </td>
    ";
        }
        // line 19
        echo "
    ";
        // line 21
        echo "    ";
        if ((($context["num_favorite_tables"] ?? null) > 0)) {
            // line 22
            echo "        <td class=\"center print_ignore\">
            ";
            // line 24
            echo "            ";
            $context["fav_params"] = array("db" =>             // line 25
($context["db"] ?? null), "ajax_request" => true, "favorite_table" => $this->getAttribute(            // line 27
($context["current_table"] ?? null), "TABLE_NAME", array(), "array"), (((            // line 28
($context["already_favorite"] ?? null)) ? ("remove") : ("add")) . "_favorite") => true);
            // line 30
            echo "            ";
            $this->loadTemplate("database/structure/favorite_anchor.twig", "database/structure/structure_table_row.twig", 30)->display(array("table_name_hash" => md5($this->getAttribute(            // line 31
($context["current_table"] ?? null), "TABLE_NAME", array(), "array")), "db_table_name_hash" => md5(((            // line 32
($context["db"] ?? null) . ".") . $this->getAttribute(($context["current_table"] ?? null), "TABLE_NAME", array(), "array"))), "fav_params" =>             // line 33
($context["fav_params"] ?? null), "already_favorite" =>             // line 34
($context["already_favorite"] ?? null), "titles" =>             // line 35
($context["titles"] ?? null)));
            // line 37
            echo "        </td>
    ";
        }
        // line 39
        echo "
    <td class=\"center print_ignore\">
        ";
        // line 41
        echo ($context["browse_table"] ?? null);
        echo "
    </td>
    <td class=\"center print_ignore\">
        <a href=\"tbl_structure.php";
        // line 44
        echo ($context["tbl_url_query"] ?? null);
        echo "\">
            ";
        // line 45
        echo $this->getAttribute(($context["titles"] ?? null), "Structure", array(), "array");
        echo "
        </a>
    </td>
    <td class=\"center print_ignore\">
        ";
        // line 49
        echo ($context["search_table"] ?? null);
        echo "
    </td>

    ";
        // line 52
        if ( !($context["db_is_system_schema"] ?? null)) {
            // line 53
            echo "        <td class=\"insert_table center print_ignore\">
            <a href=\"tbl_change.php";
            // line 54
            echo ($context["tbl_url_query"] ?? null);
            echo "\">";
            echo $this->getAttribute(($context["titles"] ?? null), "Insert", array(), "array");
            echo "</a>
        </td>
        <td class=\"center print_ignore\">";
            // line 56
            echo ($context["empty_table"] ?? null);
            echo "</td>
        <td class=\"center print_ignore\">
            <a class=\"ajax drop_table_anchor";
            // line 59
            echo (((($context["table_is_view"] ?? null) || ($this->getAttribute(($context["current_table"] ?? null), "ENGINE", array(), "array") == null))) ? (" view") : (""));
            echo "\"
                href=\"sql.php\" data-post=\"";
            // line 60
            echo ($context["tbl_url_query"] ?? null);
            echo "&amp;reload=1&amp;purge=1&amp;sql_query=";
            // line 61
            echo twig_escape_filter($this->env, twig_urlencode_filter(($context["drop_query"] ?? null)), "html", null, true);
            echo "&amp;message_to_show=";
            echo twig_escape_filter($this->env, twig_urlencode_filter(($context["drop_message"] ?? null)), "html", null, true);
            echo "\">
                ";
            // line 62
            echo $this->getAttribute(($context["titles"] ?? null), "Drop", array(), "array");
            echo "
            </a>
        </td>
    ";
        }
        // line 66
        echo "
    ";
        // line 67
        if (($this->getAttribute(($context["current_table"] ?? null), "TABLE_ROWS", array(), "array", true, true) && (($this->getAttribute(        // line 68
($context["current_table"] ?? null), "ENGINE", array(), "array") != null) || ($context["table_is_view"] ?? null)))) {
            // line 69
            echo "        ";
            // line 70
            echo "        ";
            $context["row_count"] = PhpMyAdmin\Util::formatNumber($this->getAttribute(($context["current_table"] ?? null), "TABLE_ROWS", array(), "array"), 0);
            // line 71
            echo "
        ";
            // line 74
            echo "        <td class=\"value tbl_rows\"
            data-table=\"";
            // line 75
            echo twig_escape_filter($this->env, $this->getAttribute(($context["current_table"] ?? null), "TABLE_NAME", array(), "array"), "html", null, true);
            echo "\">
            ";
            // line 76
            if (($context["approx_rows"] ?? null)) {
                // line 77
                echo "                <a href=\"db_structure.php";
                echo PhpMyAdmin\Url::getCommon(array("ajax_request" => true, "db" =>                 // line 79
($context["db"] ?? null), "table" => $this->getAttribute(                // line 80
($context["current_table"] ?? null), "TABLE_NAME", array(), "array"), "real_row_count" => "true"));
                // line 82
                echo "\" class=\"ajax real_row_count\">
                    <bdi>
                        ~";
                // line 84
                echo twig_escape_filter($this->env, ($context["row_count"] ?? null), "html", null, true);
                echo "
                    </bdi>
                </a>
            ";
            } else {
                // line 88
                echo "                ";
                echo twig_escape_filter($this->env, ($context["row_count"] ?? null), "html", null, true);
                echo "
            ";
            }
            // line 90
            echo "            ";
            echo ($context["show_superscript"] ?? null);
            echo "
        </td>

        ";
            // line 93
            if ( !(($context["properties_num_columns"] ?? null) > 1)) {
                // line 94
                echo "            <td class=\"nowrap\">
                ";
                // line 95
                if ( !twig_test_empty($this->getAttribute(($context["current_table"] ?? null), "ENGINE", array(), "array"))) {
                    // line 96
                    echo "                    ";
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["current_table"] ?? null), "ENGINE", array(), "array"), "html", null, true);
                    echo "
                ";
                } elseif (                // line 97
($context["table_is_view"] ?? null)) {
                    // line 98
                    echo "                    ";
                    echo _gettext("View");
                    // line 99
                    echo "                ";
                }
                // line 100
                echo "            </td>
            ";
                // line 101
                if ((twig_length_filter($this->env, ($context["collation"] ?? null)) > 0)) {
                    // line 102
                    echo "                <td class=\"nowrap\">
                    ";
                    // line 103
                    echo ($context["collation"] ?? null);
                    echo "
                </td>
            ";
                }
                // line 106
                echo "        ";
            }
            // line 107
            echo "
        ";
            // line 108
            if (($context["is_show_stats"] ?? null)) {
                // line 109
                echo "            <td class=\"value tbl_size\">
                <a href=\"tbl_structure.php";
                // line 110
                echo ($context["tbl_url_query"] ?? null);
                echo "#showusage\">
                    <span>";
                // line 111
                echo twig_escape_filter($this->env, ($context["formatted_size"] ?? null), "html", null, true);
                echo "</span>
                    <span class=\"unit\">";
                // line 112
                echo twig_escape_filter($this->env, ($context["unit"] ?? null), "html", null, true);
                echo "</span>
                </a>
            </td>
            <td class=\"value tbl_overhead\">
                ";
                // line 116
                echo ($context["overhead"] ?? null);
                echo "
            </td>
        ";
            }
            // line 119
            echo "
        ";
            // line 120
            if ( !(($context["show_charset"] ?? null) > 1)) {
                // line 121
                echo "            ";
                if ((twig_length_filter($this->env, ($context["charset"] ?? null)) > 0)) {
                    // line 122
                    echo "                <td class=\"nowrap\">
                    ";
                    // line 123
                    echo twig_escape_filter($this->env, ($context["charset"] ?? null), "html", null, true);
                    echo "
                </td>
            ";
                }
                // line 126
                echo "        ";
            }
            // line 127
            echo "
        ";
            // line 128
            if (($context["show_comment"] ?? null)) {
                // line 129
                echo "            ";
                $context["comment"] = $this->getAttribute(($context["current_table"] ?? null), "Comment", array(), "array");
                // line 130
                echo "            <td>
                ";
                // line 131
                if ((twig_length_filter($this->env, ($context["comment"] ?? null)) > ($context["limit_chars"] ?? null))) {
                    // line 132
                    echo "                    <abbr title=\"";
                    echo twig_escape_filter($this->env, ($context["comment"] ?? null), "html", null, true);
                    echo "\">
                        ";
                    // line 133
                    echo twig_escape_filter($this->env, twig_slice($this->env, ($context["comment"] ?? null), 0, ($context["limit_chars"] ?? null)), "html", null, true);
                    echo "
                        ...
                    </abbr>
                ";
                } else {
                    // line 137
                    echo "                    ";
                    echo twig_escape_filter($this->env, ($context["comment"] ?? null), "html", null, true);
                    echo "
                ";
                }
                // line 139
                echo "            </td>
        ";
            }
            // line 141
            echo "
        ";
            // line 142
            if (($context["show_creation"] ?? null)) {
                // line 143
                echo "            <td class=\"value tbl_creation\">
                ";
                // line 144
                echo twig_escape_filter($this->env, ((($context["create_time"] ?? null)) ? (PhpMyAdmin\Util::localisedDate(strtotime(($context["create_time"] ?? null)))) : ("-")), "html", null, true);
                echo "
            </td>
        ";
            }
            // line 147
            echo "
        ";
            // line 148
            if (($context["show_last_update"] ?? null)) {
                // line 149
                echo "            <td class=\"value tbl_last_update\">
                ";
                // line 150
                echo twig_escape_filter($this->env, ((($context["update_time"] ?? null)) ? (PhpMyAdmin\Util::localisedDate(strtotime(($context["update_time"] ?? null)))) : ("-")), "html", null, true);
                echo "
            </td>
        ";
            }
            // line 153
            echo "
        ";
            // line 154
            if (($context["show_last_check"] ?? null)) {
                // line 155
                echo "            <td class=\"value tbl_last_check\">
                ";
                // line 156
                echo twig_escape_filter($this->env, ((($context["check_time"] ?? null)) ? (PhpMyAdmin\Util::localisedDate(strtotime(($context["check_time"] ?? null)))) : ("-")), "html", null, true);
                echo "
            </td>
        ";
            }
            // line 159
            echo "
    ";
        } elseif (        // line 160
($context["table_is_view"] ?? null)) {
            // line 161
            echo "        <td class=\"value tbl_rows\">-</td>
        <td class=\"nowrap\">
            ";
            // line 163
            echo _gettext("View");
            // line 164
            echo "        </td>
        <td class=\"nowrap\">---</td>
        ";
            // line 166
            if (($context["is_show_stats"] ?? null)) {
                // line 167
                echo "            <td class=\"value tbl_size\">-</td>
            <td class=\"value tbl_overhead\">-</td>
        ";
            }
            // line 170
            echo "        ";
            if (($context["show_charset"] ?? null)) {
                // line 171
                echo "            <td></td>
        ";
            }
            // line 173
            echo "        ";
            if (($context["show_comment"] ?? null)) {
                // line 174
                echo "            <td></td>
        ";
            }
            // line 176
            echo "        ";
            if (($context["show_creation"] ?? null)) {
                // line 177
                echo "            <td class=\"value tbl_creation\">-</td>
        ";
            }
            // line 179
            echo "        ";
            if (($context["show_last_update"] ?? null)) {
                // line 180
                echo "            <td class=\"value tbl_last_update\">-</td>
        ";
            }
            // line 182
            echo "        ";
            if (($context["show_last_check"] ?? null)) {
                // line 183
                echo "            <td class=\"value tbl_last_check\">-</td>
        ";
            }
            // line 185
            echo "
    ";
        } else {
            // line 187
            echo "        ";
            $context["count"] = 0;
            // line 188
            echo "        ";
            if (($context["properties_num_columns"] ?? null)) {
                // line 189
                echo "            ";
                $context["count"] = (($context["count"] ?? null) + 2);
                // line 190
                echo "        ";
            }
            // line 191
            echo "        ";
            if (($context["is_show_stats"] ?? null)) {
                // line 192
                echo "            ";
                $context["count"] = (($context["count"] ?? null) + 2);
                // line 193
                echo "        ";
            }
            // line 194
            echo "        ";
            if (($context["show_charset"] ?? null)) {
                // line 195
                echo "            ";
                $context["count"] = (($context["count"] ?? null) + 1);
                // line 196
                echo "        ";
            }
            // line 197
            echo "        ";
            if (($context["show_comment"] ?? null)) {
                // line 198
                echo "            ";
                $context["count"] = (($context["count"] ?? null) + 1);
                // line 199
                echo "        ";
            }
            // line 200
            echo "        ";
            if (($context["show_creation"] ?? null)) {
                // line 201
                echo "            ";
                $context["count"] = (($context["count"] ?? null) + 1);
                // line 202
                echo "        ";
            }
            // line 203
            echo "        ";
            if (($context["show_last_update"] ?? null)) {
                // line 204
                echo "            ";
                $context["count"] = (($context["count"] ?? null) + 1);
                // line 205
                echo "        ";
            }
            // line 206
            echo "        ";
            if (($context["show_last_check"] ?? null)) {
                // line 207
                echo "            ";
                $context["count"] = (($context["count"] ?? null) + 1);
                // line 208
                echo "        ";
            }
            // line 209
            echo "
        ";
            // line 210
            if (($context["db_is_system_schema"] ?? null)) {
                // line 211
                echo "            ";
                $context["action_colspan"] = 3;
                // line 212
                echo "        ";
            } else {
                // line 213
                echo "            ";
                $context["action_colspan"] = 6;
                // line 214
                echo "        ";
            }
            // line 215
            echo "        ";
            if ((($context["num_favorite_tables"] ?? null) > 0)) {
                // line 216
                echo "            ";
                $context["action_colspan"] = (($context["action_colspan"] ?? null) + 1);
                // line 217
                echo "        ";
            }
            // line 218
            echo "
        ";
            // line 219
            $context["colspan_for_structure"] = (($context["action_colspan"] ?? null) + 3);
            // line 220
            echo "        <td colspan=\"";
            echo (((($context["colspan_for_structure"] ?? null) - ($context["db_is_system_schema"] ?? null))) ? (6) : (9));
            echo "\"
            class=\"center\">
            ";
            // line 222
            echo _gettext("in use");
            // line 223
            echo "        </td>
    ";
        }
        // line 225
        echo "</tr>
";
    }

    public function getTemplateName()
    {
        return "database/structure/structure_table_row.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  545 => 225,  541 => 223,  539 => 222,  533 => 220,  531 => 219,  528 => 218,  525 => 217,  522 => 216,  519 => 215,  516 => 214,  513 => 213,  510 => 212,  507 => 211,  505 => 210,  502 => 209,  499 => 208,  496 => 207,  493 => 206,  490 => 205,  487 => 204,  484 => 203,  481 => 202,  478 => 201,  475 => 200,  472 => 199,  469 => 198,  466 => 197,  463 => 196,  460 => 195,  457 => 194,  454 => 193,  451 => 192,  448 => 191,  445 => 190,  442 => 189,  439 => 188,  436 => 187,  432 => 185,  428 => 183,  425 => 182,  421 => 180,  418 => 179,  414 => 177,  411 => 176,  407 => 174,  404 => 173,  400 => 171,  397 => 170,  392 => 167,  390 => 166,  386 => 164,  384 => 163,  380 => 161,  378 => 160,  375 => 159,  369 => 156,  366 => 155,  364 => 154,  361 => 153,  355 => 150,  352 => 149,  350 => 148,  347 => 147,  341 => 144,  338 => 143,  336 => 142,  333 => 141,  329 => 139,  323 => 137,  316 => 133,  311 => 132,  309 => 131,  306 => 130,  303 => 129,  301 => 128,  298 => 127,  295 => 126,  289 => 123,  286 => 122,  283 => 121,  281 => 120,  278 => 119,  272 => 116,  265 => 112,  261 => 111,  257 => 110,  254 => 109,  252 => 108,  249 => 107,  246 => 106,  240 => 103,  237 => 102,  235 => 101,  232 => 100,  229 => 99,  226 => 98,  224 => 97,  219 => 96,  217 => 95,  214 => 94,  212 => 93,  205 => 90,  199 => 88,  192 => 84,  188 => 82,  186 => 80,  185 => 79,  183 => 77,  181 => 76,  177 => 75,  174 => 74,  171 => 71,  168 => 70,  166 => 69,  164 => 68,  163 => 67,  160 => 66,  153 => 62,  147 => 61,  144 => 60,  140 => 59,  135 => 56,  128 => 54,  125 => 53,  123 => 52,  117 => 49,  110 => 45,  106 => 44,  100 => 41,  96 => 39,  92 => 37,  90 => 35,  89 => 34,  88 => 33,  87 => 32,  86 => 31,  84 => 30,  82 => 28,  81 => 27,  80 => 25,  78 => 24,  75 => 22,  72 => 21,  69 => 19,  63 => 16,  59 => 15,  56 => 14,  54 => 13,  49 => 11,  45 => 10,  39 => 7,  35 => 6,  31 => 5,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "database/structure/structure_table_row.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\database\\structure\\structure_table_row.twig");
    }
}
