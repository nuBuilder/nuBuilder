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

/* table/structure/display_partitions.twig */
class __TwigTemplate_bad96e74e70f9e5f8c87cfb749d509b5ebfc5d8c04657688ea48d5c795d80844 extends \Twig\Template
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
        echo "<div id=\"partitions\">
    <fieldset>
        <legend>
            ";
        // line 4
        echo _gettext("Partitions");
        // line 5
        echo "            ";
        echo PhpMyAdmin\Util::showMySQLDocu("partitioning");
        echo "
        </legend>
        ";
        // line 7
        if (twig_test_empty(($context["partitions"] ?? null))) {
            // line 8
            echo "            ";
            echo call_user_func_array($this->env->getFilter('notice')->getCallable(), [_gettext("No partitioning defined!")]);
            echo "
        ";
        } else {
            // line 10
            echo "            <p>
                ";
            // line 11
            echo _gettext("Partitioned by:");
            // line 12
            echo "                <code>";
            echo twig_escape_filter($this->env, ($context["partition_method"] ?? null), "html", null, true);
            echo "(";
            echo twig_escape_filter($this->env, ($context["partition_expression"] ?? null), "html", null, true);
            echo ")</code>
            </p>
            ";
            // line 14
            if (($context["has_sub_partitions"] ?? null)) {
                // line 15
                echo "                <p>
                    ";
                // line 16
                echo _gettext("Sub partitioned by:");
                // line 17
                echo "                    <code>";
                echo twig_escape_filter($this->env, ($context["sub_partition_method"] ?? null), "html", null, true);
                echo "(";
                echo twig_escape_filter($this->env, ($context["sub_partition_expression"] ?? null), "html", null, true);
                echo ")</code>
                <p>
            ";
            }
            // line 20
            echo "            <table>
                <thead>
                    <tr>
                        <th colspan=\"2\">#</th>
                        <th>";
            // line 24
            echo _gettext("Partition");
            echo "</th>
                        ";
            // line 25
            if (($context["has_description"] ?? null)) {
                // line 26
                echo "                            <th>";
                echo _gettext("Expression");
                echo "</th>
                        ";
            }
            // line 28
            echo "                        <th>";
            echo _gettext("Rows");
            echo "</th>
                        <th>";
            // line 29
            echo _gettext("Data length");
            echo "</th>
                        <th>";
            // line 30
            echo _gettext("Index length");
            echo "</th>
                        <th>";
            // line 31
            echo _gettext("Comment");
            echo "</th>
                        <th colspan=\"";
            // line 32
            echo ((($context["range_or_list"] ?? null)) ? ("7") : ("6"));
            echo "\">
                            ";
            // line 33
            echo _gettext("Action");
            // line 34
            echo "                        </th>
                    </tr>
                </thead>
                <tbody>
                ";
            // line 38
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["partitions"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["partition"]) {
                // line 39
                echo "                    <tr class=\"noclick";
                echo ((($context["has_sub_partitions"] ?? null)) ? (" marked") : (""));
                echo "\">
                        ";
                // line 40
                if (($context["has_sub_partitions"] ?? null)) {
                    // line 41
                    echo "                            <td>";
                    echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["partition"], "getOrdinal", [], "method", false, false, false, 41), "html", null, true);
                    echo "</td>
                            <td></td>
                        ";
                } else {
                    // line 44
                    echo "                            <td colspan=\"2\">";
                    echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["partition"], "getOrdinal", [], "method", false, false, false, 44), "html", null, true);
                    echo "</td>
                        ";
                }
                // line 46
                echo "                        <th>";
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["partition"], "getName", [], "method", false, false, false, 46), "html", null, true);
                echo "</th>
                        ";
                // line 47
                if (($context["has_description"] ?? null)) {
                    // line 48
                    echo "                            <td>
                                <code>";
                    // line 50
                    echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["partition"], "getExpression", [], "method", false, false, false, 50), "html", null, true);
                    // line 51
                    echo (((twig_get_attribute($this->env, $this->source, $context["partition"], "getMethod", [], "method", false, false, false, 51) == "LIST")) ? (" IN (") : (" < "));
                    // line 52
                    echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["partition"], "getDescription", [], "method", false, false, false, 52), "html", null, true);
                    // line 53
                    echo (((twig_get_attribute($this->env, $this->source, $context["partition"], "getMethod", [], "method", false, false, false, 53) == "LIST")) ? (")") : (""));
                    // line 54
                    echo "</code>
                            </td>
                        ";
                }
                // line 57
                echo "                        <td class=\"value\">";
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["partition"], "getRows", [], "method", false, false, false, 57), "html", null, true);
                echo "</td>
                        <td class=\"value\">
                            ";
                // line 59
                $context["data_length"] = PhpMyAdmin\Util::formatByteDown(twig_get_attribute($this->env, $this->source,                 // line 60
$context["partition"], "getDataLength", [], "method", false, false, false, 60), 3, 1);
                // line 64
                echo "                            <span>";
                echo twig_escape_filter($this->env, (($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = ($context["data_length"] ?? null)) && is_array($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4) || $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 instanceof ArrayAccess ? ($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4[0] ?? null) : null), "html", null, true);
                echo "</span>
                            <span class=\"unit\">";
                // line 65
                echo twig_escape_filter($this->env, (($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 = ($context["data_length"] ?? null)) && is_array($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144) || $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 instanceof ArrayAccess ? ($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144[1] ?? null) : null), "html", null, true);
                echo "</span>
                        </td>
                        <td class=\"value\">
                            ";
                // line 68
                $context["index_length"] = PhpMyAdmin\Util::formatByteDown(twig_get_attribute($this->env, $this->source,                 // line 69
$context["partition"], "getIndexLength", [], "method", false, false, false, 69), 3, 1);
                // line 73
                echo "                            <span>";
                echo twig_escape_filter($this->env, (($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b = ($context["index_length"] ?? null)) && is_array($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b) || $__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b instanceof ArrayAccess ? ($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b[0] ?? null) : null), "html", null, true);
                echo "</span>
                            <span class=\"unit\">";
                // line 74
                echo twig_escape_filter($this->env, (($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 = ($context["index_length"] ?? null)) && is_array($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002) || $__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 instanceof ArrayAccess ? ($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002[1] ?? null) : null), "html", null, true);
                echo "</span>
                        </td>
                        <td>";
                // line 76
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["partition"], "getComment", [], "method", false, false, false, 76), "html", null, true);
                echo "</td>
                        ";
                // line 77
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(($context["action_icons"] ?? null));
                foreach ($context['_seq'] as $context["action"] => $context["icon"]) {
                    // line 78
                    echo "                            <td>
                                <a href=\"tbl_structure.php\" data-post=\"";
                    // line 79
                    echo twig_escape_filter($this->env, ($context["url_query"] ?? null), "html", null, true);
                    // line 80
                    echo "&amp;partition_maintenance=1&amp;sql_query=";
                    // line 81
                    echo twig_escape_filter($this->env, twig_urlencode_filter(((((("ALTER TABLE " . PhpMyAdmin\Util::backquote(($context["table"] ?? null))) . " ") . $context["action"]) . " PARTITION ") . twig_get_attribute($this->env, $this->source,                     // line 82
$context["partition"], "getName", [], "method", false, false, false, 82))), "html", null, true);
                    echo "\"
                                    id=\"partition_action_";
                    // line 83
                    echo twig_escape_filter($this->env, $context["action"], "html", null, true);
                    echo "\"
                                    name=\"partition_action_";
                    // line 84
                    echo twig_escape_filter($this->env, $context["action"], "html", null, true);
                    echo "\"
                                    class=\"ajax\">
                                    ";
                    // line 86
                    echo $context["icon"];
                    echo "
                                </a>
                            </td>
                        ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['action'], $context['icon'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 90
                echo "
                        ";
                // line 91
                if (($context["has_sub_partitions"] ?? null)) {
                    // line 92
                    echo "                            ";
                    $context['_parent'] = $context;
                    $context['_seq'] = twig_ensure_traversable(twig_get_attribute($this->env, $this->source, $context["partition"], "getSubPartitions", [], "method", false, false, false, 92));
                    foreach ($context['_seq'] as $context["_key"] => $context["sub_partition"]) {
                        // line 93
                        echo "                                <tr class=\"noclick\">
                                    <td></td>
                                    <td>";
                        // line 95
                        echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["sub_partition"], "getOrdinal", [], "method", false, false, false, 95), "html", null, true);
                        echo "</td>
                                    <td>";
                        // line 96
                        echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["sub_partition"], "getName", [], "method", false, false, false, 96), "html", null, true);
                        echo "</td>
                                    ";
                        // line 97
                        if (($context["has_description"] ?? null)) {
                            // line 98
                            echo "                                        <td></td>
                                    ";
                        }
                        // line 100
                        echo "                                    <td class=\"value\">";
                        echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["sub_partition"], "getRows", [], "method", false, false, false, 100), "html", null, true);
                        echo "</td>
                                    <td class=\"value\">
                                        ";
                        // line 102
                        $context["data_length"] = PhpMyAdmin\Util::formatByteDown(twig_get_attribute($this->env, $this->source,                         // line 103
$context["sub_partition"], "getDataLength", [], "method", false, false, false, 103), 3, 1);
                        // line 107
                        echo "                                        <span>";
                        echo twig_escape_filter($this->env, (($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 = ($context["data_length"] ?? null)) && is_array($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4) || $__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 instanceof ArrayAccess ? ($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4[0] ?? null) : null), "html", null, true);
                        echo "</span>
                                        <span class=\"unit\">";
                        // line 108
                        echo twig_escape_filter($this->env, (($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 = ($context["data_length"] ?? null)) && is_array($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666) || $__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 instanceof ArrayAccess ? ($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666[1] ?? null) : null), "html", null, true);
                        echo "</span>
                                    </td>
                                    <td class=\"value\">
                                        ";
                        // line 111
                        $context["index_length"] = PhpMyAdmin\Util::formatByteDown(twig_get_attribute($this->env, $this->source,                         // line 112
$context["sub_partition"], "getIndexLength", [], "method", false, false, false, 112), 3, 1);
                        // line 116
                        echo "                                        <span>";
                        echo twig_escape_filter($this->env, (($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e = ($context["index_length"] ?? null)) && is_array($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e) || $__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e instanceof ArrayAccess ? ($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e[0] ?? null) : null), "html", null, true);
                        echo "</span>
                                        <span class=\"unit\">";
                        // line 117
                        echo twig_escape_filter($this->env, (($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 = ($context["index_length"] ?? null)) && is_array($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52) || $__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 instanceof ArrayAccess ? ($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52[1] ?? null) : null), "html", null, true);
                        echo "</span>
                                    </td>
                                    <td>";
                        // line 119
                        echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["sub_partition"], "getComment", [], "method", false, false, false, 119), "html", null, true);
                        echo "</td>
                                    <td colspan=\"";
                        // line 120
                        echo ((($context["range_or_list"] ?? null)) ? ("7") : ("6"));
                        echo "\"></td>
                                </tr>
                            ";
                    }
                    $_parent = $context['_parent'];
                    unset($context['_seq'], $context['_iterated'], $context['_key'], $context['sub_partition'], $context['_parent'], $context['loop']);
                    $context = array_intersect_key($context, $_parent) + $_parent;
                    // line 123
                    echo "                        ";
                }
                // line 124
                echo "                    </tr>
                ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['partition'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 126
            echo "                </tbody>
            </table>
        ";
        }
        // line 129
        echo "    </fieldset>
    <fieldset class=\"tblFooters print_ignore\">
        <form action=\"tbl_structure.php\" method=\"post\">
            ";
        // line 132
        echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null), ($context["table"] ?? null));
        echo "
            <input type=\"hidden\" name=\"edit_partitioning\" value=\"true\">
            ";
        // line 134
        if (twig_test_empty(($context["partitions"] ?? null))) {
            // line 135
            echo "                <input class=\"btn btn-secondary\" type=\"submit\" name=\"edit_partitioning\" value=\"";
            echo _gettext("Partition table");
            echo "\">
            ";
        } else {
            // line 137
            echo "                ";
            echo PhpMyAdmin\Util::linkOrButton(($context["remove_url"] ?? null), _gettext("Remove partitioning"), ["class" => "button ajax", "id" => "remove_partitioning"]);
            // line 140
            echo "
                <input class=\"btn btn-secondary\" type=\"submit\" name=\"edit_partitioning\" value=\"";
            // line 141
            echo _gettext("Edit partitioning");
            echo "\">
            ";
        }
        // line 143
        echo "        </form>
    </fieldset>
</div>
";
    }

    public function getTemplateName()
    {
        return "table/structure/display_partitions.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  371 => 143,  366 => 141,  363 => 140,  360 => 137,  354 => 135,  352 => 134,  347 => 132,  342 => 129,  337 => 126,  330 => 124,  327 => 123,  318 => 120,  314 => 119,  309 => 117,  304 => 116,  302 => 112,  301 => 111,  295 => 108,  290 => 107,  288 => 103,  287 => 102,  281 => 100,  277 => 98,  275 => 97,  271 => 96,  267 => 95,  263 => 93,  258 => 92,  256 => 91,  253 => 90,  243 => 86,  238 => 84,  234 => 83,  230 => 82,  229 => 81,  227 => 80,  225 => 79,  222 => 78,  218 => 77,  214 => 76,  209 => 74,  204 => 73,  202 => 69,  201 => 68,  195 => 65,  190 => 64,  188 => 60,  187 => 59,  181 => 57,  176 => 54,  174 => 53,  172 => 52,  170 => 51,  168 => 50,  165 => 48,  163 => 47,  158 => 46,  152 => 44,  145 => 41,  143 => 40,  138 => 39,  134 => 38,  128 => 34,  126 => 33,  122 => 32,  118 => 31,  114 => 30,  110 => 29,  105 => 28,  99 => 26,  97 => 25,  93 => 24,  87 => 20,  78 => 17,  76 => 16,  73 => 15,  71 => 14,  63 => 12,  61 => 11,  58 => 10,  52 => 8,  50 => 7,  44 => 5,  42 => 4,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "table/structure/display_partitions.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\display_partitions.twig");
    }
}
