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

/* database/structure/structure_table_row.twig */
class __TwigTemplate_96e98492f1189c27c1c028ec5d6fd92a extends Template
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
        yield "<tr id=\"row_tbl_";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["curr"] ?? null), "html", null, true);
        yield "\"";
        yield ((($context["table_is_view"] ?? null)) ? (" class=\"is_view\"") : (""));
        yield " data-filter-row=\"";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::upper($this->env->getCharset(), (($__internal_compile_0 = ($context["current_table"] ?? null)) && is_array($__internal_compile_0) || $__internal_compile_0 instanceof ArrayAccess ? ($__internal_compile_0["TABLE_NAME"] ?? null) : null)), "html", null, true);
        yield "\">
    <td class=\"text-center d-print-none\">
        <input type=\"checkbox\"
            name=\"selected_tbl[]\"
            class=\"";
        // line 5
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["input_class"] ?? null), "html", null, true);
        yield "\"
            value=\"";
        // line 6
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((($__internal_compile_1 = ($context["current_table"] ?? null)) && is_array($__internal_compile_1) || $__internal_compile_1 instanceof ArrayAccess ? ($__internal_compile_1["TABLE_NAME"] ?? null) : null), "html", null, true);
        yield "\"
            id=\"checkbox_tbl_";
        // line 7
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["curr"] ?? null), "html", null, true);
        yield "\">
    </td>
    <th>
        <a href=\"";
        // line 10
        yield PhpMyAdmin\Url::getFromRoute("/sql", Twig\Extension\CoreExtension::merge(($context["table_url_params"] ?? null), ["pos" => 0]));
        yield "\" title=\"";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["browse_table_label_title"] ?? null), "html", null, true);
        yield "\">";
        // line 11
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["browse_table_label_truename"] ?? null), "html", null, true);
        // line 12
        yield "</a>
        ";
        // line 13
        yield ($context["tracking_icon"] ?? null);
        yield "
    </th>
    ";
        // line 15
        if (($context["server_replica_status"] ?? null)) {
            // line 16
            yield "        <td class=\"text-center\">
            ";
            // line 17
            yield ((($context["ignored"] ?? null)) ? (PhpMyAdmin\Html\Generator::getImage("s_cancel", _gettext("Not replicated"))) : (""));
            yield "
            ";
            // line 18
            yield ((($context["do"] ?? null)) ? (PhpMyAdmin\Html\Generator::getImage("s_success", _gettext("Replicated"))) : (""));
            yield "
        </td>
    ";
        }
        // line 21
        yield "
    ";
        // line 23
        yield "    ";
        if ((($context["num_favorite_tables"] ?? null) > 0)) {
            // line 24
            yield "        <td class=\"text-center d-print-none\">
            ";
            // line 26
            yield "            ";
            $context["fav_params"] = ["db" =>             // line 27
($context["db"] ?? null), "ajax_request" => true, "favorite_table" => (($__internal_compile_2 =             // line 29
($context["current_table"] ?? null)) && is_array($__internal_compile_2) || $__internal_compile_2 instanceof ArrayAccess ? ($__internal_compile_2["TABLE_NAME"] ?? null) : null), (((            // line 30
($context["already_favorite"] ?? null)) ? ("remove") : ("add")) . "_favorite") => true];
            // line 32
            yield "            ";
            yield from             $this->loadTemplate("database/structure/favorite_anchor.twig", "database/structure/structure_table_row.twig", 32)->unwrap()->yield(CoreExtension::toArray(["table_name_hash" =>             // line 33
($context["table_name_hash"] ?? null), "db_table_name_hash" =>             // line 34
($context["db_table_name_hash"] ?? null), "fav_params" =>             // line 35
($context["fav_params"] ?? null), "already_favorite" =>             // line 36
($context["already_favorite"] ?? null)]));
            // line 38
            yield "        </td>
    ";
        }
        // line 40
        yield "
    <td class=\"text-center d-print-none\">
        <a href=\"";
        // line 42
        yield PhpMyAdmin\Url::getFromRoute("/sql", Twig\Extension\CoreExtension::merge(($context["table_url_params"] ?? null), ["pos" => 0]));
        yield "\">
          ";
        // line 43
        yield ((($context["may_have_rows"] ?? null)) ? (PhpMyAdmin\Html\Generator::getIcon("b_browse", _gettext("Browse"))) : (PhpMyAdmin\Html\Generator::getIcon("bd_browse", _gettext("Browse"))));
        yield "
        </a>
    </td>
    <td class=\"text-center d-print-none\">
        <a href=\"";
        // line 47
        yield PhpMyAdmin\Url::getFromRoute("/table/structure", ($context["table_url_params"] ?? null));
        yield "\">
          ";
        // line 48
        yield PhpMyAdmin\Html\Generator::getIcon("b_props", _gettext("Structure"));
        yield "
        </a>
    </td>
    <td class=\"text-center d-print-none\">
        <a href=\"";
        // line 52
        yield PhpMyAdmin\Url::getFromRoute("/table/search", ($context["table_url_params"] ?? null));
        yield "\">
          ";
        // line 53
        yield ((($context["may_have_rows"] ?? null)) ? (PhpMyAdmin\Html\Generator::getIcon("b_select", _gettext("Search"))) : (PhpMyAdmin\Html\Generator::getIcon("bd_select", _gettext("Search"))));
        yield "
        </a>
    </td>

    ";
        // line 57
        if ( !($context["db_is_system_schema"] ?? null)) {
            // line 58
            yield "        <td class=\"insert_table text-center d-print-none\">
            <a href=\"";
            // line 59
            yield PhpMyAdmin\Url::getFromRoute("/table/change", ($context["table_url_params"] ?? null));
            yield "\">";
            yield PhpMyAdmin\Html\Generator::getIcon("b_insrow", _gettext("Insert"));
            yield "</a>
        </td>
        ";
            // line 61
            if (($context["table_is_view"] ?? null)) {
                // line 62
                yield "            <td class=\"text-center d-print-none\">
                <a href=\"";
                // line 63
                yield PhpMyAdmin\Url::getFromRoute("/view/create", ["db" =>                 // line 64
($context["db"] ?? null), "table" => (($__internal_compile_3 =                 // line 65
($context["current_table"] ?? null)) && is_array($__internal_compile_3) || $__internal_compile_3 instanceof ArrayAccess ? ($__internal_compile_3["TABLE_NAME"] ?? null) : null)]);
                // line 66
                yield "\">";
                yield PhpMyAdmin\Html\Generator::getIcon("b_edit", _gettext("Edit"));
                yield "</a>
            </td>
        ";
            } else {
                // line 69
                yield "          <td class=\"text-center d-print-none\">
                <a class=\"truncate_table_anchor ajax\" href=\"";
                // line 70
                yield PhpMyAdmin\Url::getFromRoute("/sql");
                yield "\" data-post=\"";
                yield PhpMyAdmin\Url::getCommon(Twig\Extension\CoreExtension::merge(($context["table_url_params"] ?? null), ["sql_query" =>                 // line 71
($context["empty_table_sql_query"] ?? null), "message_to_show" =>                 // line 72
($context["empty_table_message_to_show"] ?? null)]), "");
                // line 73
                yield "\">
                  ";
                // line 74
                yield ((($context["may_have_rows"] ?? null)) ? (PhpMyAdmin\Html\Generator::getIcon("b_empty", _gettext("Empty"))) : (PhpMyAdmin\Html\Generator::getIcon("bd_empty", _gettext("Empty"))));
                yield "
                </a>
          </td>
        ";
            }
            // line 78
            yield "        <td class=\"text-center d-print-none\">
            <a class=\"ajax drop_table_anchor";
            // line 80
            yield ((($context["table_is_view"] ?? null)) ? (" view") : (""));
            yield "\" href=\"";
            yield PhpMyAdmin\Url::getFromRoute("/sql");
            yield "\" data-post=\"";
            // line 81
            yield PhpMyAdmin\Url::getCommon(Twig\Extension\CoreExtension::merge(($context["table_url_params"] ?? null), ["reload" => 1, "purge" => 1, "sql_query" =>             // line 84
($context["drop_query"] ?? null), "message_to_show" =>             // line 85
($context["drop_message"] ?? null)]), "");
            // line 86
            yield "\">
                ";
            // line 87
            yield PhpMyAdmin\Html\Generator::getIcon("b_drop", _gettext("Drop"));
            yield "
            </a>
        </td>
    ";
        }
        // line 91
        yield "
    ";
        // line 92
        if ((CoreExtension::getAttribute($this->env, $this->source, ($context["current_table"] ?? null), "TABLE_ROWS", [], "array", true, true, false, 92) && (((($__internal_compile_4 =         // line 93
($context["current_table"] ?? null)) && is_array($__internal_compile_4) || $__internal_compile_4 instanceof ArrayAccess ? ($__internal_compile_4["ENGINE"] ?? null) : null) != null) || ($context["table_is_view"] ?? null)))) {
            // line 94
            yield "        ";
            // line 95
            yield "        ";
            $context["row_count"] = PhpMyAdmin\Util::formatNumber((($__internal_compile_5 = ($context["current_table"] ?? null)) && is_array($__internal_compile_5) || $__internal_compile_5 instanceof ArrayAccess ? ($__internal_compile_5["TABLE_ROWS"] ?? null) : null), 0);
            // line 96
            yield "
        ";
            // line 99
            yield "        <td class=\"value tbl_rows font-monospace text-end\"
            data-table=\"";
            // line 100
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((($__internal_compile_6 = ($context["current_table"] ?? null)) && is_array($__internal_compile_6) || $__internal_compile_6 instanceof ArrayAccess ? ($__internal_compile_6["TABLE_NAME"] ?? null) : null), "html", null, true);
            yield "\">
            ";
            // line 101
            if (($context["approx_rows"] ?? null)) {
                // line 102
                yield "                <a href=\"";
                yield PhpMyAdmin\Url::getFromRoute("/database/structure/real-row-count", ["ajax_request" => true, "db" =>                 // line 104
($context["db"] ?? null), "table" => (($__internal_compile_7 =                 // line 105
($context["current_table"] ?? null)) && is_array($__internal_compile_7) || $__internal_compile_7 instanceof ArrayAccess ? ($__internal_compile_7["TABLE_NAME"] ?? null) : null)]);
                // line 106
                yield "\" class=\"ajax real_row_count\">
                    <bdi>
                        ~";
                // line 108
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["row_count"] ?? null), "html", null, true);
                yield "
                    </bdi>
                </a>
            ";
            } else {
                // line 112
                yield "                ";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["row_count"] ?? null), "html", null, true);
                yield "
            ";
            }
            // line 114
            yield "            ";
            yield ($context["show_superscript"] ?? null);
            yield "
        </td>

        ";
            // line 117
            if ( !(($context["properties_num_columns"] ?? null) > 1)) {
                // line 118
                yield "            <td class=\"text-nowrap\">
                ";
                // line 119
                if ( !Twig\Extension\CoreExtension::testEmpty((($__internal_compile_8 = ($context["current_table"] ?? null)) && is_array($__internal_compile_8) || $__internal_compile_8 instanceof ArrayAccess ? ($__internal_compile_8["ENGINE"] ?? null) : null))) {
                    // line 120
                    yield "                    ";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((($__internal_compile_9 = ($context["current_table"] ?? null)) && is_array($__internal_compile_9) || $__internal_compile_9 instanceof ArrayAccess ? ($__internal_compile_9["ENGINE"] ?? null) : null), "html", null, true);
                    yield "
                ";
                } elseif (                // line 121
($context["table_is_view"] ?? null)) {
                    // line 122
                    yield "                    ";
yield _gettext("View");
                    // line 123
                    yield "                ";
                }
                // line 124
                yield "            </td>
            ";
                // line 125
                if ((Twig\Extension\CoreExtension::length($this->env->getCharset(), ($context["collation"] ?? null)) > 0)) {
                    // line 126
                    yield "                <td class=\"text-nowrap\">
                    ";
                    // line 127
                    yield ($context["collation"] ?? null);
                    yield "
                </td>
            ";
                }
                // line 130
                yield "        ";
            }
            // line 131
            yield "
        ";
            // line 132
            if (($context["is_show_stats"] ?? null)) {
                // line 133
                yield "            <td class=\"value tbl_size font-monospace text-end\">
                <a href=\"";
                // line 134
                yield PhpMyAdmin\Url::getFromRoute("/table/structure", ($context["table_url_params"] ?? null));
                yield "#showusage\">
                    <span>";
                // line 135
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["formatted_size"] ?? null), "html", null, true);
                yield "</span>&nbsp;<span class=\"unit\">";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["unit"] ?? null), "html", null, true);
                yield "</span>
                </a>
            </td>
            <td class=\"value tbl_overhead font-monospace text-end\">
                ";
                // line 139
                yield ($context["overhead"] ?? null);
                yield "
            </td>
        ";
            }
            // line 142
            yield "
        ";
            // line 143
            if (($context["show_charset"] ?? null)) {
                // line 144
                yield "            <td class=\"text-nowrap\">
                ";
                // line 145
                if ((Twig\Extension\CoreExtension::length($this->env->getCharset(), ($context["charset"] ?? null)) > 0)) {
                    // line 146
                    yield "                    ";
                    yield ($context["charset"] ?? null);
                    yield "
                ";
                }
                // line 148
                yield "            </td>
        ";
            }
            // line 150
            yield "
        ";
            // line 151
            if (($context["show_comment"] ?? null)) {
                // line 152
                yield "            ";
                $context["comment"] = (($__internal_compile_10 = ($context["current_table"] ?? null)) && is_array($__internal_compile_10) || $__internal_compile_10 instanceof ArrayAccess ? ($__internal_compile_10["Comment"] ?? null) : null);
                // line 153
                yield "            <td>
                ";
                // line 154
                if ((Twig\Extension\CoreExtension::length($this->env->getCharset(), ($context["comment"] ?? null)) > ($context["limit_chars"] ?? null))) {
                    // line 155
                    yield "                    <abbr title=\"";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["comment"] ?? null), "html", null, true);
                    yield "\">
                        ";
                    // line 156
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::slice($this->env->getCharset(), ($context["comment"] ?? null), 0, ($context["limit_chars"] ?? null)), "html", null, true);
                    yield "
                        ...
                    </abbr>
                ";
                } else {
                    // line 160
                    yield "                    ";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["comment"] ?? null), "html", null, true);
                    yield "
                ";
                }
                // line 162
                yield "            </td>
        ";
            }
            // line 164
            yield "
        ";
            // line 165
            if (($context["show_creation"] ?? null)) {
                // line 166
                yield "            <td class=\"value tbl_creation font-monospace text-end\">
                ";
                // line 167
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["create_time"] ?? null), "html", null, true);
                yield "
            </td>
        ";
            }
            // line 170
            yield "
        ";
            // line 171
            if (($context["show_last_update"] ?? null)) {
                // line 172
                yield "            <td class=\"value tbl_last_update font-monospace text-end\">
                ";
                // line 173
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["update_time"] ?? null), "html", null, true);
                yield "
            </td>
        ";
            }
            // line 176
            yield "
        ";
            // line 177
            if (($context["show_last_check"] ?? null)) {
                // line 178
                yield "            <td class=\"value tbl_last_check font-monospace text-end\">
                ";
                // line 179
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["check_time"] ?? null), "html", null, true);
                yield "
            </td>
        ";
            }
            // line 182
            yield "
    ";
        } elseif (        // line 183
($context["table_is_view"] ?? null)) {
            // line 184
            yield "        <td class=\"value tbl_rows font-monospace text-end\">-</td>
        <td class=\"text-nowrap\">
            ";
yield _gettext("View");
            // line 187
            yield "        </td>
        <td class=\"text-nowrap\">---</td>
        ";
            // line 189
            if (($context["is_show_stats"] ?? null)) {
                // line 190
                yield "            <td class=\"value tbl_size font-monospace text-end\">-</td>
            <td class=\"value tbl_overhead font-monospace text-end\">-</td>
        ";
            }
            // line 193
            yield "        ";
            if (($context["show_charset"] ?? null)) {
                // line 194
                yield "            <td></td>
        ";
            }
            // line 196
            yield "        ";
            if (($context["show_comment"] ?? null)) {
                // line 197
                yield "            <td></td>
        ";
            }
            // line 199
            yield "        ";
            if (($context["show_creation"] ?? null)) {
                // line 200
                yield "            <td class=\"value tbl_creation font-monospace text-end\">-</td>
        ";
            }
            // line 202
            yield "        ";
            if (($context["show_last_update"] ?? null)) {
                // line 203
                yield "            <td class=\"value tbl_last_update font-monospace text-end\">-</td>
        ";
            }
            // line 205
            yield "        ";
            if (($context["show_last_check"] ?? null)) {
                // line 206
                yield "            <td class=\"value tbl_last_check font-monospace text-end\">-</td>
        ";
            }
            // line 208
            yield "
    ";
        } else {
            // line 210
            yield "
        ";
            // line 211
            if (($context["db_is_system_schema"] ?? null)) {
                // line 212
                yield "            ";
                $context["action_colspan"] = 2;
                // line 213
                yield "        ";
            } else {
                // line 214
                yield "            ";
                $context["action_colspan"] = 4;
                // line 215
                yield "        ";
            }
            // line 216
            yield "        ";
            if ((($context["num_favorite_tables"] ?? null) > 0)) {
                // line 217
                yield "            ";
                $context["action_colspan"] = (($context["action_colspan"] ?? null) + 1);
                // line 218
                yield "        ";
            }
            // line 219
            yield "        ";
            if (($context["show_charset"] ?? null)) {
                // line 220
                yield "            ";
                $context["action_colspan"] = (($context["action_colspan"] ?? null) + 1);
                // line 221
                yield "        ";
            }
            // line 222
            yield "        ";
            if (($context["show_comment"] ?? null)) {
                // line 223
                yield "            ";
                $context["action_colspan"] = (($context["action_colspan"] ?? null) + 1);
                // line 224
                yield "        ";
            }
            // line 225
            yield "        ";
            if (($context["show_creation"] ?? null)) {
                // line 226
                yield "            ";
                $context["action_colspan"] = (($context["action_colspan"] ?? null) + 1);
                // line 227
                yield "        ";
            }
            // line 228
            yield "        ";
            if (($context["show_last_update"] ?? null)) {
                // line 229
                yield "            ";
                $context["action_colspan"] = (($context["action_colspan"] ?? null) + 1);
                // line 230
                yield "        ";
            }
            // line 231
            yield "        ";
            if (($context["show_last_check"] ?? null)) {
                // line 232
                yield "            ";
                $context["action_colspan"] = (($context["action_colspan"] ?? null) + 1);
                // line 233
                yield "        ";
            }
            // line 234
            yield "
        <td colspan=\"";
            // line 235
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["action_colspan"] ?? null), "html", null, true);
            yield "\"
            class=\"text-center\">
            ";
yield _gettext("in use");
            // line 238
            yield "        </td>
    ";
        }
        // line 240
        yield "</tr>
";
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "database/structure/structure_table_row.twig";
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
        return array (  583 => 240,  579 => 238,  573 => 235,  570 => 234,  567 => 233,  564 => 232,  561 => 231,  558 => 230,  555 => 229,  552 => 228,  549 => 227,  546 => 226,  543 => 225,  540 => 224,  537 => 223,  534 => 222,  531 => 221,  528 => 220,  525 => 219,  522 => 218,  519 => 217,  516 => 216,  513 => 215,  510 => 214,  507 => 213,  504 => 212,  502 => 211,  499 => 210,  495 => 208,  491 => 206,  488 => 205,  484 => 203,  481 => 202,  477 => 200,  474 => 199,  470 => 197,  467 => 196,  463 => 194,  460 => 193,  455 => 190,  453 => 189,  449 => 187,  444 => 184,  442 => 183,  439 => 182,  433 => 179,  430 => 178,  428 => 177,  425 => 176,  419 => 173,  416 => 172,  414 => 171,  411 => 170,  405 => 167,  402 => 166,  400 => 165,  397 => 164,  393 => 162,  387 => 160,  380 => 156,  375 => 155,  373 => 154,  370 => 153,  367 => 152,  365 => 151,  362 => 150,  358 => 148,  352 => 146,  350 => 145,  347 => 144,  345 => 143,  342 => 142,  336 => 139,  327 => 135,  323 => 134,  320 => 133,  318 => 132,  315 => 131,  312 => 130,  306 => 127,  303 => 126,  301 => 125,  298 => 124,  295 => 123,  292 => 122,  290 => 121,  285 => 120,  283 => 119,  280 => 118,  278 => 117,  271 => 114,  265 => 112,  258 => 108,  254 => 106,  252 => 105,  251 => 104,  249 => 102,  247 => 101,  243 => 100,  240 => 99,  237 => 96,  234 => 95,  232 => 94,  230 => 93,  229 => 92,  226 => 91,  219 => 87,  216 => 86,  214 => 85,  213 => 84,  212 => 81,  207 => 80,  204 => 78,  197 => 74,  194 => 73,  192 => 72,  191 => 71,  188 => 70,  185 => 69,  178 => 66,  176 => 65,  175 => 64,  174 => 63,  171 => 62,  169 => 61,  162 => 59,  159 => 58,  157 => 57,  150 => 53,  146 => 52,  139 => 48,  135 => 47,  128 => 43,  124 => 42,  120 => 40,  116 => 38,  114 => 36,  113 => 35,  112 => 34,  111 => 33,  109 => 32,  107 => 30,  106 => 29,  105 => 27,  103 => 26,  100 => 24,  97 => 23,  94 => 21,  88 => 18,  84 => 17,  81 => 16,  79 => 15,  74 => 13,  71 => 12,  69 => 11,  64 => 10,  58 => 7,  54 => 6,  50 => 5,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/structure_table_row.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\database\\structure\\structure_table_row.twig");
    }
}
