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

/* database/structure/structure_table_row.twig */
class __TwigTemplate_0566f4784ea71e706bc8a57c172f2d84358fcf8014b3b7761e86eacef2514dac extends \Twig\Template
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
        echo "<tr id=\"row_tbl_";
        echo twig_escape_filter($this->env, ($context["curr"] ?? null), "html", null, true);
        echo "\"";
        echo ((($context["table_is_view"] ?? null)) ? (" class=\"is_view\"") : (""));
        echo " data-filter-row=\"";
        echo twig_escape_filter($this->env, twig_upper_filter($this->env, (($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = ($context["current_table"] ?? null)) && is_array($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4) || $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 instanceof ArrayAccess ? ($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4["TABLE_NAME"] ?? null) : null)), "html", null, true);
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
        echo twig_escape_filter($this->env, (($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 = ($context["current_table"] ?? null)) && is_array($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144) || $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 instanceof ArrayAccess ? ($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144["TABLE_NAME"] ?? null) : null), "html", null, true);
        echo "\"
            id=\"checkbox_tbl_";
        // line 7
        echo twig_escape_filter($this->env, ($context["curr"] ?? null), "html", null, true);
        echo "\">
    </td>
    <th>
        <a href=\"sql.php";
        // line 10
        echo ($context["tbl_url_query"] ?? null);
        echo "&amp;pos=0\" title=\"";
        echo twig_escape_filter($this->env, ($context["browse_table_label_title"] ?? null), "html", null, true);
        echo "\">
            ";
        // line 11
        echo twig_escape_filter($this->env, ($context["browse_table_label_truename"] ?? null), "html", null, true);
        echo "
        </a>
        ";
        // line 13
        echo ($context["tracking_icon"] ?? null);
        echo "
    </th>
    ";
        // line 15
        if (($context["server_slave_status"] ?? null)) {
            // line 16
            echo "        <td class=\"center\">
            ";
            // line 17
            echo ((($context["ignored"] ?? null)) ? (PhpMyAdmin\Util::getImage("s_cancel", _gettext("Not replicated"))) : (""));
            echo "
            ";
            // line 18
            echo ((($context["do"] ?? null)) ? (PhpMyAdmin\Util::getImage("s_success", _gettext("Replicated"))) : (""));
            echo "
        </td>
    ";
        }
        // line 21
        echo "
    ";
        // line 23
        echo "    ";
        if ((($context["num_favorite_tables"] ?? null) > 0)) {
            // line 24
            echo "        <td class=\"center print_ignore\">
            ";
            // line 26
            echo "            ";
            $context["fav_params"] = ["db" =>             // line 27
($context["db"] ?? null), "ajax_request" => true, "favorite_table" => (($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b =             // line 29
($context["current_table"] ?? null)) && is_array($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b) || $__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b instanceof ArrayAccess ? ($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b["TABLE_NAME"] ?? null) : null), (((            // line 30
($context["already_favorite"] ?? null)) ? ("remove") : ("add")) . "_favorite") => true];
            // line 32
            echo "            ";
            $this->loadTemplate("database/structure/favorite_anchor.twig", "database/structure/structure_table_row.twig", 32)->display(twig_to_array(["table_name_hash" =>             // line 33
($context["table_name_hash"] ?? null), "db_table_name_hash" =>             // line 34
($context["db_table_name_hash"] ?? null), "fav_params" =>             // line 35
($context["fav_params"] ?? null), "already_favorite" =>             // line 36
($context["already_favorite"] ?? null), "titles" =>             // line 37
($context["titles"] ?? null)]));
            // line 39
            echo "        </td>
    ";
        }
        // line 41
        echo "
    <td class=\"center print_ignore\">
        <a href=\"sql.php";
        // line 43
        echo ($context["tbl_url_query"] ?? null);
        echo "&amp;pos=0\">
            ";
        // line 44
        echo ($context["browse_table_title"] ?? null);
        echo "
        </a>

    </td>
    <td class=\"center print_ignore\">
        <a href=\"tbl_structure.php";
        // line 49
        echo ($context["tbl_url_query"] ?? null);
        echo "\">
            ";
        // line 50
        echo (($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 = ($context["titles"] ?? null)) && is_array($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002) || $__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 instanceof ArrayAccess ? ($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002["Structure"] ?? null) : null);
        echo "
        </a>
    </td>
    <td class=\"center print_ignore\">
        <a href=\"tbl_select.php";
        // line 54
        echo ($context["tbl_url_query"] ?? null);
        echo "\">
            ";
        // line 55
        echo ($context["search_table_title"] ?? null);
        echo "
        </a>
    </td>

    ";
        // line 59
        if ( !($context["db_is_system_schema"] ?? null)) {
            // line 60
            echo "        <td class=\"insert_table center print_ignore\">
            <a href=\"tbl_change.php";
            // line 61
            echo ($context["tbl_url_query"] ?? null);
            echo "\">";
            echo (($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 = ($context["titles"] ?? null)) && is_array($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4) || $__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 instanceof ArrayAccess ? ($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4["Insert"] ?? null) : null);
            echo "</a>
        </td>
        ";
            // line 63
            if (($context["table_is_view"] ?? null)) {
                // line 64
                echo "            <td class=\"center print_ignore\">
                <a href=\"view_create.php";
                // line 65
                echo PhpMyAdmin\Url::getCommon(["db" =>                 // line 66
($context["db"] ?? null), "table" => (($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 =                 // line 67
($context["current_table"] ?? null)) && is_array($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666) || $__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 instanceof ArrayAccess ? ($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666["TABLE_NAME"] ?? null) : null)]);
                // line 68
                echo "\">";
                echo (($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e = ($context["titles"] ?? null)) && is_array($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e) || $__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e instanceof ArrayAccess ? ($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e["Edit"] ?? null) : null);
                echo "</a>
            </td>
        ";
            } else {
                // line 71
                echo "          <td class=\"center print_ignore\">
                <a class=\"truncate_table_anchor ajax\" href=\"sql.php\" data-post=\"";
                // line 72
                echo ($context["tbl_url_query"] ?? null);
                echo "&amp;sql_query=";
                // line 73
                echo twig_escape_filter($this->env, ($context["empty_table_sql_query"] ?? null), "html", null, true);
                echo "&amp;message_to_show=";
                echo twig_escape_filter($this->env, ($context["empty_table_message_to_show"] ?? null), "html", null, true);
                echo "\">
                    ";
                // line 74
                echo ($context["empty_table_title"] ?? null);
                echo "
                </a>
          </td>
        ";
            }
            // line 78
            echo "        <td class=\"center print_ignore\">
            <a class=\"ajax drop_table_anchor";
            // line 80
            echo (((($context["table_is_view"] ?? null) || ((($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 = ($context["current_table"] ?? null)) && is_array($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52) || $__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 instanceof ArrayAccess ? ($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52["ENGINE"] ?? null) : null) == null))) ? (" view") : (""));
            echo "\"
                href=\"sql.php\" data-post=\"";
            // line 81
            echo ($context["tbl_url_query"] ?? null);
            echo "&amp;reload=1&amp;purge=1&amp;sql_query=";
            // line 82
            echo twig_escape_filter($this->env, twig_urlencode_filter(($context["drop_query"] ?? null)), "html", null, true);
            echo "&amp;message_to_show=";
            echo twig_escape_filter($this->env, twig_urlencode_filter(($context["drop_message"] ?? null)), "html", null, true);
            echo "\">
                ";
            // line 83
            echo (($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136 = ($context["titles"] ?? null)) && is_array($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136) || $__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136 instanceof ArrayAccess ? ($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136["Drop"] ?? null) : null);
            echo "
            </a>
        </td>
    ";
        }
        // line 87
        echo "
    ";
        // line 88
        if ((twig_get_attribute($this->env, $this->source, ($context["current_table"] ?? null), "TABLE_ROWS", [], "array", true, true, false, 88) && (((($__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386 =         // line 89
($context["current_table"] ?? null)) && is_array($__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386) || $__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386 instanceof ArrayAccess ? ($__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386["ENGINE"] ?? null) : null) != null) || ($context["table_is_view"] ?? null)))) {
            // line 90
            echo "        ";
            // line 91
            echo "        ";
            $context["row_count"] = PhpMyAdmin\Util::formatNumber((($__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9 = ($context["current_table"] ?? null)) && is_array($__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9) || $__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9 instanceof ArrayAccess ? ($__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9["TABLE_ROWS"] ?? null) : null), 0);
            // line 92
            echo "
        ";
            // line 95
            echo "        <td class=\"value tbl_rows\"
            data-table=\"";
            // line 96
            echo twig_escape_filter($this->env, (($__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae = ($context["current_table"] ?? null)) && is_array($__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae) || $__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae instanceof ArrayAccess ? ($__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae["TABLE_NAME"] ?? null) : null), "html", null, true);
            echo "\">
            ";
            // line 97
            if (($context["approx_rows"] ?? null)) {
                // line 98
                echo "                <a href=\"db_structure.php";
                echo PhpMyAdmin\Url::getCommon(["ajax_request" => true, "db" =>                 // line 100
($context["db"] ?? null), "table" => (($__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f =                 // line 101
($context["current_table"] ?? null)) && is_array($__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f) || $__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f instanceof ArrayAccess ? ($__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f["TABLE_NAME"] ?? null) : null), "real_row_count" => "true"]);
                // line 103
                echo "\" class=\"ajax real_row_count\">
                    <bdi>
                        ~";
                // line 105
                echo twig_escape_filter($this->env, ($context["row_count"] ?? null), "html", null, true);
                echo "
                    </bdi>
                </a>
            ";
            } else {
                // line 109
                echo "                ";
                echo twig_escape_filter($this->env, ($context["row_count"] ?? null), "html", null, true);
                echo "
            ";
            }
            // line 111
            echo "            ";
            echo ($context["show_superscript"] ?? null);
            echo "
        </td>

        ";
            // line 114
            if ( !(($context["properties_num_columns"] ?? null) > 1)) {
                // line 115
                echo "            <td class=\"nowrap\">
                ";
                // line 116
                if ( !twig_test_empty((($__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40 = ($context["current_table"] ?? null)) && is_array($__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40) || $__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40 instanceof ArrayAccess ? ($__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40["ENGINE"] ?? null) : null))) {
                    // line 117
                    echo "                    ";
                    echo twig_escape_filter($this->env, (($__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f = ($context["current_table"] ?? null)) && is_array($__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f) || $__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f instanceof ArrayAccess ? ($__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f["ENGINE"] ?? null) : null), "html", null, true);
                    echo "
                ";
                } elseif (                // line 118
($context["table_is_view"] ?? null)) {
                    // line 119
                    echo "                    ";
                    echo _gettext("View");
                    // line 120
                    echo "                ";
                }
                // line 121
                echo "            </td>
            ";
                // line 122
                if ((twig_length_filter($this->env, ($context["collation"] ?? null)) > 0)) {
                    // line 123
                    echo "                <td class=\"nowrap\">
                    ";
                    // line 124
                    echo ($context["collation"] ?? null);
                    echo "
                </td>
            ";
                }
                // line 127
                echo "        ";
            }
            // line 128
            echo "
        ";
            // line 129
            if (($context["is_show_stats"] ?? null)) {
                // line 130
                echo "            <td class=\"value tbl_size\">
                <a href=\"tbl_structure.php";
                // line 131
                echo ($context["tbl_url_query"] ?? null);
                echo "#showusage\">
                    <span>";
                // line 132
                echo twig_escape_filter($this->env, ($context["formatted_size"] ?? null), "html", null, true);
                echo "</span>&nbsp;<span class=\"unit\">";
                echo twig_escape_filter($this->env, ($context["unit"] ?? null), "html", null, true);
                echo "</span>
                </a>
            </td>
            <td class=\"value tbl_overhead\">
                ";
                // line 136
                echo ($context["overhead"] ?? null);
                echo "
            </td>
        ";
            }
            // line 139
            echo "
        ";
            // line 140
            if ( !(($context["show_charset"] ?? null) > 1)) {
                // line 141
                echo "            ";
                if ((twig_length_filter($this->env, ($context["charset"] ?? null)) > 0)) {
                    // line 142
                    echo "                <td class=\"nowrap\">
                    ";
                    // line 143
                    echo ($context["charset"] ?? null);
                    echo "
                </td>
            ";
                }
                // line 146
                echo "        ";
            }
            // line 147
            echo "
        ";
            // line 148
            if (($context["show_comment"] ?? null)) {
                // line 149
                echo "            ";
                $context["comment"] = (($__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760 = ($context["current_table"] ?? null)) && is_array($__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760) || $__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760 instanceof ArrayAccess ? ($__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760["Comment"] ?? null) : null);
                // line 150
                echo "            <td>
                ";
                // line 151
                if ((twig_length_filter($this->env, ($context["comment"] ?? null)) > ($context["limit_chars"] ?? null))) {
                    // line 152
                    echo "                    <abbr title=\"";
                    echo twig_escape_filter($this->env, ($context["comment"] ?? null), "html", null, true);
                    echo "\">
                        ";
                    // line 153
                    echo twig_escape_filter($this->env, twig_slice($this->env, ($context["comment"] ?? null), 0, ($context["limit_chars"] ?? null)), "html", null, true);
                    echo "
                        ...
                    </abbr>
                ";
                } else {
                    // line 157
                    echo "                    ";
                    echo twig_escape_filter($this->env, ($context["comment"] ?? null), "html", null, true);
                    echo "
                ";
                }
                // line 159
                echo "            </td>
        ";
            }
            // line 161
            echo "
        ";
            // line 162
            if (($context["show_creation"] ?? null)) {
                // line 163
                echo "            <td class=\"value tbl_creation\">
                ";
                // line 164
                echo twig_escape_filter($this->env, ($context["create_time"] ?? null), "html", null, true);
                echo "
            </td>
        ";
            }
            // line 167
            echo "
        ";
            // line 168
            if (($context["show_last_update"] ?? null)) {
                // line 169
                echo "            <td class=\"value tbl_last_update\">
                ";
                // line 170
                echo twig_escape_filter($this->env, ($context["update_time"] ?? null), "html", null, true);
                echo "
            </td>
        ";
            }
            // line 173
            echo "
        ";
            // line 174
            if (($context["show_last_check"] ?? null)) {
                // line 175
                echo "            <td class=\"value tbl_last_check\">
                ";
                // line 176
                echo twig_escape_filter($this->env, ($context["check_time"] ?? null), "html", null, true);
                echo "
            </td>
        ";
            }
            // line 179
            echo "
    ";
        } elseif (        // line 180
($context["table_is_view"] ?? null)) {
            // line 181
            echo "        <td class=\"value tbl_rows\">-</td>
        <td class=\"nowrap\">
            ";
            // line 183
            echo _gettext("View");
            // line 184
            echo "        </td>
        <td class=\"nowrap\">---</td>
        ";
            // line 186
            if (($context["is_show_stats"] ?? null)) {
                // line 187
                echo "            <td class=\"value tbl_size\">-</td>
            <td class=\"value tbl_overhead\">-</td>
        ";
            }
            // line 190
            echo "        ";
            if (($context["show_charset"] ?? null)) {
                // line 191
                echo "            <td></td>
        ";
            }
            // line 193
            echo "        ";
            if (($context["show_comment"] ?? null)) {
                // line 194
                echo "            <td></td>
        ";
            }
            // line 196
            echo "        ";
            if (($context["show_creation"] ?? null)) {
                // line 197
                echo "            <td class=\"value tbl_creation\">-</td>
        ";
            }
            // line 199
            echo "        ";
            if (($context["show_last_update"] ?? null)) {
                // line 200
                echo "            <td class=\"value tbl_last_update\">-</td>
        ";
            }
            // line 202
            echo "        ";
            if (($context["show_last_check"] ?? null)) {
                // line 203
                echo "            <td class=\"value tbl_last_check\">-</td>
        ";
            }
            // line 205
            echo "
    ";
        } else {
            // line 207
            echo "
        ";
            // line 208
            if (($context["db_is_system_schema"] ?? null)) {
                // line 209
                echo "            ";
                $context["action_colspan"] = 3;
                // line 210
                echo "        ";
            } else {
                // line 211
                echo "            ";
                $context["action_colspan"] = 6;
                // line 212
                echo "        ";
            }
            // line 213
            echo "        ";
            if ((($context["num_favorite_tables"] ?? null) > 0)) {
                // line 214
                echo "            ";
                $context["action_colspan"] = (($context["action_colspan"] ?? null) + 1);
                // line 215
                echo "        ";
            }
            // line 216
            echo "
        ";
            // line 217
            $context["colspan_for_structure"] = (($context["action_colspan"] ?? null) + 3);
            // line 218
            echo "        <td colspan=\"";
            echo (((($context["colspan_for_structure"] ?? null) - ($context["db_is_system_schema"] ?? null))) ? (6) : (9));
            echo "\"
            class=\"center\">
            ";
            // line 220
            echo _gettext("in use");
            // line 221
            echo "        </td>
    ";
        }
        // line 223
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
        return array (  546 => 223,  542 => 221,  540 => 220,  534 => 218,  532 => 217,  529 => 216,  526 => 215,  523 => 214,  520 => 213,  517 => 212,  514 => 211,  511 => 210,  508 => 209,  506 => 208,  503 => 207,  499 => 205,  495 => 203,  492 => 202,  488 => 200,  485 => 199,  481 => 197,  478 => 196,  474 => 194,  471 => 193,  467 => 191,  464 => 190,  459 => 187,  457 => 186,  453 => 184,  451 => 183,  447 => 181,  445 => 180,  442 => 179,  436 => 176,  433 => 175,  431 => 174,  428 => 173,  422 => 170,  419 => 169,  417 => 168,  414 => 167,  408 => 164,  405 => 163,  403 => 162,  400 => 161,  396 => 159,  390 => 157,  383 => 153,  378 => 152,  376 => 151,  373 => 150,  370 => 149,  368 => 148,  365 => 147,  362 => 146,  356 => 143,  353 => 142,  350 => 141,  348 => 140,  345 => 139,  339 => 136,  330 => 132,  326 => 131,  323 => 130,  321 => 129,  318 => 128,  315 => 127,  309 => 124,  306 => 123,  304 => 122,  301 => 121,  298 => 120,  295 => 119,  293 => 118,  288 => 117,  286 => 116,  283 => 115,  281 => 114,  274 => 111,  268 => 109,  261 => 105,  257 => 103,  255 => 101,  254 => 100,  252 => 98,  250 => 97,  246 => 96,  243 => 95,  240 => 92,  237 => 91,  235 => 90,  233 => 89,  232 => 88,  229 => 87,  222 => 83,  216 => 82,  213 => 81,  209 => 80,  206 => 78,  199 => 74,  193 => 73,  190 => 72,  187 => 71,  180 => 68,  178 => 67,  177 => 66,  176 => 65,  173 => 64,  171 => 63,  164 => 61,  161 => 60,  159 => 59,  152 => 55,  148 => 54,  141 => 50,  137 => 49,  129 => 44,  125 => 43,  121 => 41,  117 => 39,  115 => 37,  114 => 36,  113 => 35,  112 => 34,  111 => 33,  109 => 32,  107 => 30,  106 => 29,  105 => 27,  103 => 26,  100 => 24,  97 => 23,  94 => 21,  88 => 18,  84 => 17,  81 => 16,  79 => 15,  74 => 13,  69 => 11,  63 => 10,  57 => 7,  53 => 6,  49 => 5,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/structure_table_row.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\database\\structure\\structure_table_row.twig");
    }
}
