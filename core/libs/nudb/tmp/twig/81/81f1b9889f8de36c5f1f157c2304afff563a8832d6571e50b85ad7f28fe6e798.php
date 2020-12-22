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

/* table/structure/display_table_stats.twig */
class __TwigTemplate_d0c290f1e84d84d1b0a35e478598b5d563a9a0f89a062fc31eca504dbb10a415 extends \Twig\Template
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
        echo "<div id=\"tablestatistics\">
    <fieldset>
        <legend>";
        // line 3
        echo _gettext("Information");
        echo "</legend>
        ";
        // line 4
        if ((($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = ($context["showtable"] ?? null)) && is_array($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4) || $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 instanceof ArrayAccess ? ($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4["TABLE_COMMENT"] ?? null) : null)) {
            // line 5
            echo "            <p>
                <strong>";
            // line 6
            echo _gettext("Table comments:");
            echo "</strong>
                ";
            // line 7
            echo twig_escape_filter($this->env, (($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 = ($context["showtable"] ?? null)) && is_array($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144) || $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 instanceof ArrayAccess ? ($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144["TABLE_COMMENT"] ?? null) : null), "html", null, true);
            echo "
            </p>
        ";
        }
        // line 10
        echo "        <a id=\"showusage\"></a>

        ";
        // line 12
        if (( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 13
            echo "            <table id=\"tablespaceusage\" class=\"width100 data\">
                <caption class=\"tblHeaders\">";
            // line 14
            echo _gettext("Space usage");
            echo "</caption>
                <tbody>
                    <tr>
                        <th class=\"name\">";
            // line 17
            echo _gettext("Data");
            echo "</th>
                        <td class=\"value\">";
            // line 18
            echo twig_escape_filter($this->env, ($context["data_size"] ?? null), "html", null, true);
            echo "</td>
                        <td class=\"unit\">";
            // line 19
            echo twig_escape_filter($this->env, ($context["data_unit"] ?? null), "html", null, true);
            echo "</td>
                    </tr>

                ";
            // line 22
            if ((isset($context["index_size"]) || array_key_exists("index_size", $context))) {
                // line 23
                echo "                    <tr>
                        <th class=\"name\">";
                // line 24
                echo _gettext("Index");
                echo "</th>
                        <td class=\"value\">";
                // line 25
                echo twig_escape_filter($this->env, ($context["index_size"] ?? null), "html", null, true);
                echo "</td>
                        <td class=\"unit\">";
                // line 26
                echo twig_escape_filter($this->env, ($context["index_unit"] ?? null), "html", null, true);
                echo "</td>
                    </tr>
                ";
            }
            // line 29
            echo "
                ";
            // line 30
            if ((isset($context["free_size"]) || array_key_exists("free_size", $context))) {
                // line 31
                echo "                    <tr>
                        <th class=\"name\">";
                // line 32
                echo _gettext("Overhead");
                echo "</th>
                        <td class=\"value\">";
                // line 33
                echo twig_escape_filter($this->env, ($context["free_size"] ?? null), "html", null, true);
                echo "</td>
                        <td class=\"unit\">";
                // line 34
                echo twig_escape_filter($this->env, ($context["free_unit"] ?? null), "html", null, true);
                echo "</td>
                    </tr>
                    <tr>
                        <th class=\"name\">";
                // line 37
                echo _gettext("Effective");
                echo "</th>
                        <td class=\"value\">";
                // line 38
                echo twig_escape_filter($this->env, ($context["effect_size"] ?? null), "html", null, true);
                echo "</td>
                        <td class=\"unit\">";
                // line 39
                echo twig_escape_filter($this->env, ($context["effect_unit"] ?? null), "html", null, true);
                echo "</td>
                    </tr>
                ";
            }
            // line 42
            echo "
                ";
            // line 43
            if (((isset($context["tot_size"]) || array_key_exists("tot_size", $context)) && (($context["mergetable"] ?? null) == false))) {
                // line 44
                echo "                    <tr>
                        <th class=\"name\">";
                // line 45
                echo _gettext("Total");
                echo "</th>
                        <td class=\"value\">";
                // line 46
                echo twig_escape_filter($this->env, ($context["tot_size"] ?? null), "html", null, true);
                echo "</td>
                        <td class=\"unit\">";
                // line 47
                echo twig_escape_filter($this->env, ($context["tot_unit"] ?? null), "html", null, true);
                echo "</td>
                    </tr>
                ";
            }
            // line 50
            echo "
                ";
            // line 52
            echo "                ";
            if ((((isset($context["free_size"]) || array_key_exists("free_size", $context)) && ((((            // line 53
($context["tbl_storage_engine"] ?? null) == "MYISAM") || (            // line 54
($context["tbl_storage_engine"] ?? null) == "ARIA")) || (            // line 55
($context["tbl_storage_engine"] ?? null) == "MARIA")) || (            // line 56
($context["tbl_storage_engine"] ?? null) == "BDB"))) || ((            // line 57
($context["tbl_storage_engine"] ?? null) == "INNODB") && (($context["innodb_file_per_table"] ?? null) == true)))) {
                // line 58
                echo "                    <tr class=\"tblFooters print_ignore\">
                        <td colspan=\"3\" class=\"center\">
                            <a href=\"sql.php\" data-post=\"";
                // line 60
                echo twig_escape_filter($this->env, ($context["url_query"] ?? null), "html", null, true);
                echo "&amp;pos=0&amp;sql_query=";
                // line 61
                echo twig_escape_filter($this->env, twig_urlencode_filter(("OPTIMIZE TABLE " . PhpMyAdmin\Util::backquote(($context["table"] ?? null)))), "html", null, true);
                echo "\">
                                ";
                // line 62
                echo PhpMyAdmin\Util::getIcon("b_tbloptimize", _gettext("Optimize table"));
                echo "
                            </a>
                        </td>
                    </tr>
                ";
            }
            // line 67
            echo "                </tbody>
            </table>
        ";
        }
        // line 70
        echo "
        ";
        // line 71
        $context["avg_size"] = (((isset($context["avg_size"]) || array_key_exists("avg_size", $context))) ? (($context["avg_size"] ?? null)) : (null));
        // line 72
        echo "        ";
        $context["avg_unit"] = (((isset($context["avg_unit"]) || array_key_exists("avg_unit", $context))) ? (($context["avg_unit"] ?? null)) : (null));
        // line 73
        echo "        <table id=\"tablerowstats\" class=\"width100 data\">
            <caption class=\"tblHeaders\">";
        // line 74
        echo _gettext("Row statistics");
        echo "</caption>
            <tbody>
                ";
        // line 76
        if (twig_get_attribute($this->env, $this->source, ($context["showtable"] ?? null), "Row_format", [], "array", true, true, false, 76)) {
            // line 77
            echo "                    <tr>
                    <th class=\"name\">";
            // line 78
            echo _gettext("Format");
            echo "</th>
                    ";
            // line 79
            if (((($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b = ($context["showtable"] ?? null)) && is_array($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b) || $__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b instanceof ArrayAccess ? ($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b["Row_format"] ?? null) : null) == "Fixed")) {
                // line 80
                echo "                        <td class=\"value\">";
                echo _gettext("static");
                echo "</td>
                    ";
            } elseif (((($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 =             // line 81
($context["showtable"] ?? null)) && is_array($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002) || $__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 instanceof ArrayAccess ? ($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002["Row_format"] ?? null) : null) == "Dynamic")) {
                // line 82
                echo "                        <td class=\"value\">";
                echo _gettext("dynamic");
                echo "</td>
                    ";
            } else {
                // line 84
                echo "                        <td class=\"value\">";
                echo twig_escape_filter($this->env, (($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 = ($context["showtable"] ?? null)) && is_array($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4) || $__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 instanceof ArrayAccess ? ($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4["Row_format"] ?? null) : null), "html", null, true);
                echo "</td>
                    ";
            }
            // line 86
            echo "                    </tr>
                ";
        }
        // line 88
        echo "
                ";
        // line 89
        if ( !twig_test_empty((($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 = ($context["showtable"] ?? null)) && is_array($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666) || $__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 instanceof ArrayAccess ? ($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666["Create_options"] ?? null) : null))) {
            // line 90
            echo "                    <tr>
                    <th class=\"name\">";
            // line 91
            echo _gettext("Options");
            echo "</th>
                    ";
            // line 92
            if (((($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e = ($context["showtable"] ?? null)) && is_array($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e) || $__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e instanceof ArrayAccess ? ($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e["Create_options"] ?? null) : null) == "partitioned")) {
                // line 93
                echo "                        <td class=\"value\">";
                echo _gettext("partitioned");
                echo "</td>
                    ";
            } else {
                // line 95
                echo "                        <td class=\"value\">";
                echo twig_escape_filter($this->env, (($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 = ($context["showtable"] ?? null)) && is_array($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52) || $__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 instanceof ArrayAccess ? ($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52["Create_options"] ?? null) : null), "html", null, true);
                echo "</td>
                    ";
            }
            // line 97
            echo "                    </tr>
                ";
        }
        // line 99
        echo "
                ";
        // line 100
        if ( !twig_test_empty(($context["table_collation"] ?? null))) {
            // line 101
            echo "                    <tr>
                    <th class=\"name\">";
            // line 102
            echo _gettext("Collation");
            echo "</th>
                    <td class=\"value\">
                        <dfn title=\"";
            // line 104
            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, ($context["table_collation"] ?? null), "description", [], "any", false, false, false, 104), "html", null, true);
            echo "\">
                            ";
            // line 105
            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, ($context["table_collation"] ?? null), "name", [], "any", false, false, false, 105), "html", null, true);
            echo "
                        </dfn>
                    </td>
                    </tr>
                ";
        }
        // line 110
        echo "
                ";
        // line 111
        if (( !($context["is_innodb"] ?? null) && twig_get_attribute($this->env, $this->source, ($context["showtable"] ?? null), "Rows", [], "array", true, true, false, 111))) {
            // line 112
            echo "                    <tr>
                    <th class=\"name\">";
            // line 113
            echo _gettext("Rows");
            echo "</th>
                    <td class=\"value\">";
            // line 114
            echo twig_escape_filter($this->env, PhpMyAdmin\Util::formatNumber((($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136 = ($context["showtable"] ?? null)) && is_array($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136) || $__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136 instanceof ArrayAccess ? ($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136["Rows"] ?? null) : null), 0), "html", null, true);
            echo "</td>
                    </tr>
                ";
        }
        // line 117
        echo "
                ";
        // line 118
        if ((( !($context["is_innodb"] ?? null) && twig_get_attribute($this->env, $this->source,         // line 119
($context["showtable"] ?? null), "Avg_row_length", [], "array", true, true, false, 119)) && ((($__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386 =         // line 120
($context["showtable"] ?? null)) && is_array($__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386) || $__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386 instanceof ArrayAccess ? ($__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386["Avg_row_length"] ?? null) : null) > 0))) {
            // line 121
            echo "                    <tr>
                    <th class=\"name\">";
            // line 122
            echo _gettext("Row length");
            echo "</th>
                    ";
            // line 123
            $context["avg_row_length"] = PhpMyAdmin\Util::formatByteDown((($__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9 = ($context["showtable"] ?? null)) && is_array($__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9) || $__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9 instanceof ArrayAccess ? ($__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9["Avg_row_length"] ?? null) : null), 6, 1);
            // line 124
            echo "                    <td class=\"value\">";
            echo twig_escape_filter($this->env, (($__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae = ($context["avg_row_length"] ?? null)) && is_array($__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae) || $__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae instanceof ArrayAccess ? ($__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae[0] ?? null) : null), "html", null, true);
            echo " ";
            echo twig_escape_filter($this->env, (($__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f = ($context["avg_row_length"] ?? null)) && is_array($__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f) || $__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f instanceof ArrayAccess ? ($__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f[1] ?? null) : null), "html", null, true);
            echo "</td>
                    </tr>
                ";
        }
        // line 127
        echo "
                ";
        // line 128
        if ((((( !($context["is_innodb"] ?? null) && twig_get_attribute($this->env, $this->source,         // line 129
($context["showtable"] ?? null), "Data_length", [], "array", true, true, false, 129)) && twig_get_attribute($this->env, $this->source,         // line 130
($context["showtable"] ?? null), "Rows", [], "array", true, true, false, 130)) && ((($__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40 =         // line 131
($context["showtable"] ?? null)) && is_array($__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40) || $__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40 instanceof ArrayAccess ? ($__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40["Rows"] ?? null) : null) > 0)) && (        // line 132
($context["mergetable"] ?? null) == false))) {
            // line 133
            echo "                    <tr>
                    <th class=\"name\">";
            // line 134
            echo _gettext("Row size");
            echo "</th>
                    <td class=\"value\">";
            // line 135
            echo twig_escape_filter($this->env, ($context["avg_size"] ?? null), "html", null, true);
            echo " ";
            echo twig_escape_filter($this->env, ($context["avg_unit"] ?? null), "html", null, true);
            echo "</td>
                    </tr>
                ";
        }
        // line 138
        echo "
                ";
        // line 139
        if (twig_get_attribute($this->env, $this->source, ($context["showtable"] ?? null), "Auto_increment", [], "array", true, true, false, 139)) {
            // line 140
            echo "                    <tr>
                    <th class=\"name\">";
            // line 141
            echo _gettext("Next autoindex");
            echo "</th>
                    <td class=\"value\">";
            // line 142
            echo twig_escape_filter($this->env, PhpMyAdmin\Util::formatNumber((($__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f = ($context["showtable"] ?? null)) && is_array($__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f) || $__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f instanceof ArrayAccess ? ($__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f["Auto_increment"] ?? null) : null), 0), "html", null, true);
            echo "</td>
                    </tr>
                ";
        }
        // line 145
        echo "
                ";
        // line 146
        if (twig_get_attribute($this->env, $this->source, ($context["showtable"] ?? null), "Create_time", [], "array", true, true, false, 146)) {
            // line 147
            echo "                    <tr>
                    <th class=\"name\">";
            // line 148
            echo _gettext("Creation");
            echo "</th>
                    <td class=\"value\">";
            // line 149
            echo twig_escape_filter($this->env, PhpMyAdmin\Util::localisedDate(twig_date_format_filter($this->env, (($__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760 = ($context["showtable"] ?? null)) && is_array($__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760) || $__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760 instanceof ArrayAccess ? ($__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760["Create_time"] ?? null) : null), "U")), "html", null, true);
            echo "</td>
                    </tr>
                ";
        }
        // line 152
        echo "
                ";
        // line 153
        if (twig_get_attribute($this->env, $this->source, ($context["showtable"] ?? null), "Update_time", [], "array", true, true, false, 153)) {
            // line 154
            echo "                    <tr>
                    <th class=\"name\">";
            // line 155
            echo _gettext("Last update");
            echo "</th>
                    <td class=\"value\">";
            // line 156
            echo twig_escape_filter($this->env, PhpMyAdmin\Util::localisedDate(twig_date_format_filter($this->env, (($__internal_653499042eb14fd8415489ba6fa87c1e85cff03392e9f57b26d0da09b9be82ce = ($context["showtable"] ?? null)) && is_array($__internal_653499042eb14fd8415489ba6fa87c1e85cff03392e9f57b26d0da09b9be82ce) || $__internal_653499042eb14fd8415489ba6fa87c1e85cff03392e9f57b26d0da09b9be82ce instanceof ArrayAccess ? ($__internal_653499042eb14fd8415489ba6fa87c1e85cff03392e9f57b26d0da09b9be82ce["Update_time"] ?? null) : null), "U")), "html", null, true);
            echo "</td>
                    </tr>
                ";
        }
        // line 159
        echo "
                ";
        // line 160
        if (twig_get_attribute($this->env, $this->source, ($context["showtable"] ?? null), "Check_time", [], "array", true, true, false, 160)) {
            // line 161
            echo "                    <tr>
                    <th class=\"name\">";
            // line 162
            echo _gettext("Last check");
            echo "</th>
                    <td class=\"value\">";
            // line 163
            echo twig_escape_filter($this->env, PhpMyAdmin\Util::localisedDate(twig_date_format_filter($this->env, (($__internal_ba9f0a3bb95c082f61c9fbf892a05514d732703d52edc77b51f2e6284135900b = ($context["showtable"] ?? null)) && is_array($__internal_ba9f0a3bb95c082f61c9fbf892a05514d732703d52edc77b51f2e6284135900b) || $__internal_ba9f0a3bb95c082f61c9fbf892a05514d732703d52edc77b51f2e6284135900b instanceof ArrayAccess ? ($__internal_ba9f0a3bb95c082f61c9fbf892a05514d732703d52edc77b51f2e6284135900b["Check_time"] ?? null) : null), "U")), "html", null, true);
            echo "</td>
                    </tr>
                ";
        }
        // line 166
        echo "            </tbody>
        </table>
    </fieldset>
</div>
";
    }

    public function getTemplateName()
    {
        return "table/structure/display_table_stats.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  445 => 166,  439 => 163,  435 => 162,  432 => 161,  430 => 160,  427 => 159,  421 => 156,  417 => 155,  414 => 154,  412 => 153,  409 => 152,  403 => 149,  399 => 148,  396 => 147,  394 => 146,  391 => 145,  385 => 142,  381 => 141,  378 => 140,  376 => 139,  373 => 138,  365 => 135,  361 => 134,  358 => 133,  356 => 132,  355 => 131,  354 => 130,  353 => 129,  352 => 128,  349 => 127,  340 => 124,  338 => 123,  334 => 122,  331 => 121,  329 => 120,  328 => 119,  327 => 118,  324 => 117,  318 => 114,  314 => 113,  311 => 112,  309 => 111,  306 => 110,  298 => 105,  294 => 104,  289 => 102,  286 => 101,  284 => 100,  281 => 99,  277 => 97,  271 => 95,  265 => 93,  263 => 92,  259 => 91,  256 => 90,  254 => 89,  251 => 88,  247 => 86,  241 => 84,  235 => 82,  233 => 81,  228 => 80,  226 => 79,  222 => 78,  219 => 77,  217 => 76,  212 => 74,  209 => 73,  206 => 72,  204 => 71,  201 => 70,  196 => 67,  188 => 62,  184 => 61,  181 => 60,  177 => 58,  175 => 57,  174 => 56,  173 => 55,  172 => 54,  171 => 53,  169 => 52,  166 => 50,  160 => 47,  156 => 46,  152 => 45,  149 => 44,  147 => 43,  144 => 42,  138 => 39,  134 => 38,  130 => 37,  124 => 34,  120 => 33,  116 => 32,  113 => 31,  111 => 30,  108 => 29,  102 => 26,  98 => 25,  94 => 24,  91 => 23,  89 => 22,  83 => 19,  79 => 18,  75 => 17,  69 => 14,  66 => 13,  64 => 12,  60 => 10,  54 => 7,  50 => 6,  47 => 5,  45 => 4,  41 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "table/structure/display_table_stats.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\display_table_stats.twig");
    }
}
